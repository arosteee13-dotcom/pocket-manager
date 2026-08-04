(function () {
  const KEY = 'pm_save_';
  const ACTIVE = 'pm_active_save';
  const NAME_KEY = '__pm_saves__';
  const S = window.PocketManager;

  // Capa de persistencia real (localStorage) si está disponible; si no (p. ej. file:// bloqueado),
  // devuelve un objeto sin persistencia (no-op). Nunca lanza.
  function createRealStorage() {
    try {
      const ls = window.localStorage;
      const probe = '__pm_probe__';
      ls.setItem(probe, '1');
      ls.removeItem(probe);
      return ls;
    } catch (e) {
      const noop = {};
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        key: () => null,
        length: 0
      };
    }
  }

  const real = createRealStorage();
  let realUsable = true;
  let nameUsable = true;
  // Registro en memoria: fuente de verdad de la sesión. Garantiza que el slot aparezca
  // tras guardar aunque el localStorage real no persista ni enumere.
  const sessionStore = new Map();
  const activeSaveId = { value: null };

  function isHttp() {
    try { return /^https?:$/.test(window.location.protocol); } catch (e) { return false; }
  }

  // Capa de durabilidad por window.name: sobrevive al refresco de la misma pestaña
  // incluso abriendo index.html directamente (file://), donde localStorage no persiste.
  function readWindowName() {
    try {
      if (window.name && window.name.indexOf(NAME_KEY + '=') === 0) {
        return JSON.parse(window.name.slice(NAME_KEY.length + 1));
      }
    } catch (e) {}
    return null;
  }

  function persistWindowName() {
    try {
      const obj = { saves: {}, active: getActiveSaveId() };
      for (const [k, raw] of sessionStore) obj.saves[k] = raw;
      window.name = NAME_KEY + '=' + JSON.stringify(obj);
      nameUsable = true;
      return true;
    } catch (e) {
      nameUsable = false;
      return false;
    }
  }

  function hydrate() {
    // 1. localStorage (p. ej. sesiones previas vía http)
    const len = realLength();
    for (let i = 0; i < len; i++) {
      const k = realKey(i);
      if (k && k.indexOf(KEY) === 0) {
        const raw = realGet(k);
        if (raw) sessionStore.set(k, raw);
      }
    }
    // 2. window.name de esta pestaña (más reciente que localStorage)
    const nameData = readWindowName();
    if (nameData) {
      if (nameData.saves) {
        for (const [k, raw] of Object.entries(nameData.saves)) {
          if (raw) sessionStore.set(k, raw);
        }
      }
      if (nameData.active) activeSaveId.value = nameData.active;
    }
  }

  function canUseReal() {
    return realUsable;
  }

  function realGet(key) {
    if (!realUsable) return null;
    try { return real.getItem(key); } catch (e) { realUsable = false; return null; }
  }

  function realSet(key, value) {
    if (!realUsable) return false;
    try { real.setItem(key, value); return true; } catch (e) { realUsable = false; return false; }
  }

  function realRemove(key) {
    if (!realUsable) return;
    try { real.removeItem(key); } catch (e) { realUsable = false; }
  }

  function realKey(i) {
    if (!realUsable) return null;
    try { return real.key(i); } catch (e) { realUsable = false; return null; }
  }

  function realLength() {
    if (!realUsable) return 0;
    try { return real.length; } catch (e) { realUsable = false; return 0; }
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function formatDateTime(d) {
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function formatDateShort(d) {
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  function getActiveSaveId() {
    if (activeSaveId.value) return activeSaveId.value;
    activeSaveId.value = realGet(ACTIVE);
    return activeSaveId.value;
  }

  function setActiveSaveId(id) {
    activeSaveId.value = id;
    if (id) realSet(ACTIVE, id);
    persistWindowName();
  }

  function newSaveId() {
    return 'save_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
  }

  hydrate();

  function buildSaveData() {
    const gs = S.gameState;
    const team = gs.team;
    if (!team) return null;

    const runtime = S.captureRuntime ? S.captureRuntime() : null;
    const now = new Date();
    const saveId = getActiveSaveId() || newSaveId();
    setActiveSaveId(saveId);

    const manager = gs.manager || {};
    return {
      saveId,
      managerName: `${manager.firstName || ''} ${manager.lastName || ''}`.trim() || 'Mánager',
      managerFlag: manager.flag || '🌍',
      teamId: team.id,
      teamName: team.name,
      teamColors: { primary: team.primaryColor, secondary: team.secondaryColor || team.primaryColor },
      currentSeason: gs.currentSeason || 1,
      currentDate: gs.currentDate || formatDateShort(now),
      savedAt: formatDateTime(now),
      gameStateData: {
        manager,
        teamId: team.id,
        season: gs.season || null,
        seasons: gs.seasons || {},
        transfers: gs.transfers || [],
        callUpLog: gs.callUpLog || [],
        callUpsWeek: gs._callUpsWeek || 0,
        formation: runtime ? runtime.formation : undefined,
        style: runtime ? runtime.style : undefined,
        squadState: runtime ? runtime.squadState : undefined,
        playerStats: runtime ? runtime.playerStats : undefined,
        ratings: runtime ? runtime.ratings : undefined,
        trophies: runtime ? runtime.trophies : undefined,
        dorsals: runtime ? runtime.dorsals : undefined,
        staminaInjury: runtime ? runtime.staminaInjury : undefined,
        inbox: gs.inbox || { seen: [], offers: [] },
        academy: gs.academy || null,
        englandShield: gs.englandShield || null
      }
    };
  }

  function saveCurrentGame() {
    let data;
    try {
      data = buildSaveData();
    } catch (e) {
      return null;
    }
    if (!data) return null;

    const json = JSON.stringify(data);
    const key = KEY + data.saveId;
    // Siempre en memoria (fuente de verdad de la sesión)
    sessionStore.set(key, json);
    // Persistencia real si se puede (http) y durabilidad por window.name (file:// refresco)
    realSet(key, json);
    const nameOk = persistWindowName();
    const persistent = nameOk || (isHttp() && realUsable);

    if (!persistent) {
      if (window.console && console.warn) {
        console.warn('[saveSystem] no hay almacenamiento durable; guardado solo en esta sesión.');
      }
    }
    return { data, persistent };
  }

  function readSave(saveId) {
    const key = KEY + saveId;
    let raw = sessionStore.get(key);
    if (raw === undefined) {
      raw = realGet(key);
      if (raw !== null && raw !== undefined) sessionStore.set(key, raw);
    }
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function loadSave(saveId) {
    const data = readSave(saveId);
    if (!data || !data.gameStateData) return null;

    const gsd = data.gameStateData;
    const team = S.db.getTeamById(gsd.teamId);
    if (!team) return null;

    S.gameState.manager = gsd.manager || null;
    S.gameState.team = team;
    S.gameState.currentSeason = data.currentSeason || 1;
    S.gameState.currentDate = data.currentDate || null;
    S.gameState.season = gsd.season || null;
    S.gameState.seasons = gsd.seasons || {};
    S.gameState.transfers = gsd.transfers || [];
    S.gameState.callUpLog = gsd.callUpLog || [];
    S.gameState._callUpsWeek = gsd.callUpsWeek || 0;
    S.gameState.inbox = gsd.inbox || { seen: [], offers: [] };
    S.gameState.academy = gsd.academy || null;
    S.gameState.englandShield = gsd.englandShield || null;
    setActiveSaveId(data.saveId);

    if (S.restoreRuntime) S.restoreRuntime(team, gsd);

    return data;
  }

  // Combinar el registro de sesión + localStorage real, deduplicando por clave (manda sesión)
  function collectEntries() {
    const map = new Map();
    const len = realLength();
    for (let i = 0; i < len; i++) {
      const k = realKey(i);
      if (k && k.indexOf(KEY) === 0) {
        try {
          const raw = realGet(k);
          if (raw) map.set(k, raw);
        } catch (e) {}
      }
    }
    for (const [k, raw] of sessionStore) map.set(k, raw);
    return map;
  }

  function listSaves() {
    const out = [];
    try {
      for (const [k, raw] of collectEntries()) {
        try {
          const d = JSON.parse(raw);
          out.push({
            saveId: d.saveId,
            managerName: d.managerName,
            managerFlag: d.managerFlag,
            teamId: d.teamId,
            teamName: d.teamName,
            teamColors: d.teamColors,
            currentSeason: d.currentSeason,
            savedAt: d.savedAt
          });
        } catch (e) {}
      }
    } catch (e) {}
    out.sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)));
    return out;
  }

  function deleteSave(saveId) {
    const key = KEY + saveId;
    sessionStore.delete(key);
    realRemove(key);
    if (getActiveSaveId() === saveId) {
      activeSaveId.value = null;
      realRemove(ACTIVE);
    }
    persistWindowName();
  }

  function getStorageMode() {
    if (realUsable) return 'localStorage';
    return nameUsable ? 'window.name' : 'memoria';
  }

  window.PocketManager.saveSystem = {
    getActiveSaveId,
    setActiveSaveId,
    newSaveId,
    saveCurrentGame,
    loadSave,
    listSaves,
    deleteSave,
    getStorageMode,
    formatDateTime
  };
})();
