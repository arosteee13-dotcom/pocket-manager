(function () {
  const db = window.PocketManager.db;

  const POS_ORDER = ['POR', 'DEF', 'MED', 'DEL'];

  const POS_GROUPS = {
    POR: 'POR',
    DFC: 'DEF', LI: 'DEF', LD: 'DEF', CAI: 'DEF', CAD: 'DEF',
    MCD: 'MED', MC: 'MED', MCO: 'MED', MI: 'MED', MD: 'MED',
    EI: 'DEL', ED: 'DEL', DC: 'DEL'
  };

  const POS_COLUMNS = {
    POR: 50,
    CAI: 12, LI: 25, DFC: 50, LD: 75, CAD: 88,
    MI: 25, MCD: 40, MC: 50, MCO: 60, MD: 75,
    EI: 25, DC: 50, ED: 75
  };

  // Orden canónico por posición específica (agrupado por línea)
  const POS_RANK = {
    POR: 0,
    DFC: 1, LI: 2, LD: 3, CAI: 4, CAD: 5,
    MCD: 6, MC: 7, MCO: 8, MI: 9, MD: 10,
    EI: 11, DC: 12, ED: 13
  };

  // Plantillas de formación: cada slot indica el rol y su posición en el campo (x%, y%)
  const FORMATIONS = {
    '4-3-3': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'LD', x: 80, y: 67 },
      { pos: 'DFC', x: 61, y: 67 },
      { pos: 'DFC', x: 39, y: 67 },
      { pos: 'LI', x: 20, y: 67 },
      { pos: 'MCD', x: 50, y: 45 },
      { pos: 'MC', x: 35, y: 35 },
      { pos: 'MC', x: 65, y: 35 },
      { pos: 'ED', x: 80, y: 14 },
      { pos: 'DC', x: 50, y: 12 },
      { pos: 'EI', x: 20, y: 14 }
    ],
    '4-4-2': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'LD', x: 80, y: 67 },
      { pos: 'DFC', x: 61, y: 67 },
      { pos: 'DFC', x: 39, y: 67 },
      { pos: 'LI', x: 20, y: 67 },
      { pos: 'MD', x: 80, y: 33 },
      { pos: 'MC', x: 59, y: 40 },
      { pos: 'MC', x: 41, y: 40 },
      { pos: 'MI', x: 20, y: 33 },
      { pos: 'DC', x: 59, y: 12 },
      { pos: 'DC', x: 41, y: 12 }
    ],
    '3-5-2': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'DFC', x: 75, y: 67 },
      { pos: 'DFC', x: 50, y: 67 },
      { pos: 'DFC', x: 25, y: 67 },
      { pos: 'CAI', x: 16, y: 42 },
      { pos: 'MCD', x: 50, y: 46 },
      { pos: 'MC', x: 35, y: 35 },
      { pos: 'MCO', x: 65, y: 35 },
      { pos: 'CAD', x: 84, y: 42 },
      { pos: 'DC', x: 58, y: 12 },
      { pos: 'DC', x: 42, y: 12 }
    ],
    '3-4-3': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'DFC', x: 75, y: 67 },
      { pos: 'DFC', x: 50, y: 67 },
      { pos: 'DFC', x: 25, y: 67 },
      { pos: 'CAI', x: 16, y: 42 },
      { pos: 'MC', x: 59, y: 40 },
      { pos: 'MC', x: 41, y: 40 },
      { pos: 'CAD', x: 84, y: 42 },
      { pos: 'EI', x: 20, y: 14 },
      { pos: 'DC', x: 50, y: 12 },
      { pos: 'ED', x: 80, y: 14 }
    ],
    '4-2-3-1': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'LD', x: 80, y: 67 },
      { pos: 'DFC', x: 61, y: 67 },
      { pos: 'DFC', x: 39, y: 67 },
      { pos: 'LI', x: 20, y: 67 },
      { pos: 'MCD', x: 39, y: 48 },
      { pos: 'MCD', x: 61, y: 48 },
      { pos: 'MCO', x: 50, y: 30 },
      { pos: 'EI', x: 18, y: 20 },
      { pos: 'DC', x: 50, y: 11 },
      { pos: 'ED', x: 82, y: 20 }
    ],
    '5-3-2': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'CAI', x: 16, y: 62 },
      { pos: 'DFC', x: 33, y: 67 },
      { pos: 'DFC', x: 50, y: 67 },
      { pos: 'DFC', x: 67, y: 67 },
      { pos: 'CAD', x: 84, y: 62 },
      { pos: 'MCD', x: 50, y: 44 },
      { pos: 'MC', x: 33, y: 33 },
      { pos: 'MC', x: 67, y: 33 },
      { pos: 'DC', x: 58, y: 12 },
      { pos: 'DC', x: 42, y: 12 }
    ],
    '4-1-4-1': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'LD', x: 80, y: 67 },
      { pos: 'DFC', x: 61, y: 67 },
      { pos: 'DFC', x: 39, y: 67 },
      { pos: 'LI', x: 20, y: 67 },
      { pos: 'MCD', x: 50, y: 48 },
      { pos: 'MD', x: 80, y: 30 },
      { pos: 'MC', x: 35, y: 35 },
      { pos: 'MC', x: 65, y: 35 },
      { pos: 'MI', x: 20, y: 30 },
      { pos: 'DC', x: 50, y: 11 }
    ],
    '3-4-2-1': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'DFC', x: 75, y: 67 },
      { pos: 'DFC', x: 50, y: 67 },
      { pos: 'DFC', x: 25, y: 67 },
      { pos: 'CAI', x: 16, y: 45 },
      { pos: 'MCD', x: 38, y: 42 },
      { pos: 'MC', x: 62, y: 42 },
      { pos: 'CAD', x: 84, y: 45 },
      { pos: 'MCO', x: 35, y: 20 },
      { pos: 'MCO', x: 65, y: 20 },
      { pos: 'DC', x: 50, y: 10 }
    ],
    '4-4-1-1': [
      { pos: 'POR', x: 50, y: 86 },
      { pos: 'LD', x: 80, y: 67 },
      { pos: 'DFC', x: 61, y: 67 },
      { pos: 'DFC', x: 39, y: 67 },
      { pos: 'LI', x: 20, y: 67 },
      { pos: 'MD', x: 80, y: 35 },
      { pos: 'MC', x: 59, y: 42 },
      { pos: 'MC', x: 41, y: 42 },
      { pos: 'MI', x: 20, y: 35 },
      { pos: 'MCO', x: 50, y: 18 },
      { pos: 'DC', x: 50, y: 10 }
    ]
  };

  const FORMATION_ORDER = ['3-4-3', '3-5-2', '3-4-2-1', '4-3-3', '4-4-2', '4-4-1-1', '4-2-3-1', '4-1-4-1', '5-3-2'];

  function getPosGroup(pos) {
    return POS_GROUPS[pos] || 'MED';
  }

  function getPosColumn(player, players) {
    const base = POS_COLUMNS[player.pos];
    if (base === undefined) {
      const i = players.indexOf(player);
      return (i - (players.length - 1) / 2) * 25 + 50;
    }
    const same = players.filter(q => q.pos === player.pos);
    const idx = same.indexOf(player);
    const nudge = (idx - (same.length - 1) / 2) * 10;
    return Math.min(90, Math.max(10, base + nudge));
  }

const ICON_ATTACK = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>';
const ICON_STADIUM = '<svg class="icon stadium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" x2="21" y1="22" y2="22"/><line x1="6" x2="6" y1="18" y2="11"/><line x1="10" x2="10" y1="18" y2="11"/><line x1="14" x2="14" y1="18" y2="11"/><line x1="18" x2="18" y1="18" y2="11"/><polygon points="12 2 20 7 4 7"/></svg>';
const ICON_SEAT = '<svg class="icon stadium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"/><path d="M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v2H7v-2a2 2 0 0 0-4 0Z"/><path d="M5 18v2"/><path d="M19 18v2"/></svg>';
const ICON_BUDGET = '<svg class="icon stadium-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>';
const ICON_SHIELD = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>';
const ICON_CHECK = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';

const state = new Map();

let activeFormation = '4-3-3';

const STYLES = ['Ofensivo', 'Equilibrado', 'Defensivo'];
const styleOverrides = new Map();

// Sección elegida por el usuario: 'first' (primer equipo) o 'reserves' (reservas).
const roleOverrides = new Map();

// Sección actual de un jugador (primer equipo / reservas), aplicando las preferencias del usuario
function sectionOf(team, playerId) {
  const p = team.players.find(x => x.id === playerId);
  if (!p) return 'reserves';
  if (roleOverrides.get(playerId) === 'reserves') return 'reserves';
  if (roleOverrides.get(playerId) === 'first') return 'first';
  return buildFirstTeamSquad(team).firstTeam.some(x => x.id === playerId) ? 'first' : 'reserves';
}

function getTeamStyle(team) {
  return styleOverrides.get(team.id) || team.style || 'Equilibrado';
}

function setStyle(teamId, style) {
  if (STYLES.indexOf(style) !== -1) styleOverrides.set(teamId, style);
}

// Rellena las opciones y abre el modal de formación (usado desde TÁCTICA y desde el modal de cambios)
function openFormationModal() {
  const modal = document.getElementById('formation-modal');
  const listEl = document.getElementById('formation-modal-list');
  if (listEl) {
    listEl.innerHTML = FORMATION_ORDER.filter(f => FORMATIONS[f]).map(f => `
      <button class="nat-option${f === activeFormation ? ' selected' : ''}" data-formation="${f}">
        <span class="nat-name">${f}</span>
        ${f === activeFormation ? '<span class="nat-check">✓</span>' : ''}
      </button>`).join('');
  }
  if (modal) modal.classList.add('open');
}

// Rellena las opciones y abre el modal de estilo
function openStyleModal(team) {
  const modal = document.getElementById('style-modal');
  const listEl = document.getElementById('style-modal-list');
  if (listEl) {
    const current = getTeamStyle(team);
    listEl.innerHTML = STYLES.map(s => `
      <button class="nat-option${s === current ? ' selected' : ''}" data-style="${s}">
        <span class="nat-name">${s}</span>
        ${s === current ? '<span class="nat-check">✓</span>' : ''}
      </button>`).join('');
  }
  if (modal) modal.classList.add('open');
}

const playerStats = new Map();

function getPlayerStats(player) {
  if (!player) return null;
  let s = playerStats.get(player.id);
  if (!s) {
    s = { apps: 0, goals: 0, assists: 0, ratingSum: 0, yellows: 0, reds: 0 };
    playerStats.set(player.id, s);
  }
  return s;
}

function getStartingLineup(team, preferredIds) {
  const players = activeRoster(team).filter(p => !isUnavailable(p) && roleOverrides.get(p.id) !== 'reserves');
  const slots = FORMATIONS[activeFormation] || FORMATIONS['4-3-3'];
  const preferred = (preferredIds || []).map(id => players.find(p => p.id === id)).filter(Boolean);
  const assigned = new Array(slots.length).fill(null);
  const used = new Set();
  const best = (list) => list.filter(p => !used.has(p.id)).sort(byOvrDesc)[0];
  const assign = (i, p) => { if (p) { assigned[i] = p.id; used.add(p.id); } };

  // 1) Rol exacto: conservar los titulares anteriores en su rol exacto
  for (let i = 0; i < slots.length; i++) {
    if (!assigned[i]) assign(i, best(preferred.filter(x => x.pos === slots[i].pos)));
  }
  // 2) Misma línea: conservar los titulares anteriores en la misma zona
  for (let i = 0; i < slots.length; i++) {
    if (!assigned[i]) assign(i, best(preferred.filter(x => getPosGroup(x.pos) === getPosGroup(slots[i].pos))));
  }
  // 3) Rol exacto del resto de la plantilla
  for (let i = 0; i < slots.length; i++) {
    if (!assigned[i]) assign(i, best(players.filter(x => x.pos === slots[i].pos)));
  }
  // 4) Misma línea del resto de la plantilla
  for (let i = 0; i < slots.length; i++) {
    if (!assigned[i]) assign(i, best(players.filter(x => getPosGroup(x.pos) === getPosGroup(slots[i].pos))));
  }
  // 5) Cualquier jugador de campo
  for (let i = 0; i < slots.length; i++) {
    if (!assigned[i]) assign(i, best(players.filter(x => x.pos !== 'POR')));
  }

  const picked = assigned.filter(Boolean);

  // Rellenar hasta 11 con los mejores jugadores de campo restantes (sin más porteros)
  for (const p of players.filter(x => !used.has(x.id) && x.pos !== 'POR').sort(byOvrDesc)) {
    if (picked.length >= 11) break;
    picked.push(p.id); used.add(p.id);
  }

  return picked;
}

function getMaxSubsForTeam(team) {
  const country = db.getCountryData(team.id);
  return (country && country.maxSubs) || 9;
}

// Posiciones compatibles para cubrir cada hueco (la primera es la exacta)
const POSITION_COVERS = {
  POR: ['POR'],
  DFC: ['DFC', 'LI', 'LD', 'CAI', 'CAD'],
  LI: ['LI', 'LD', 'CAI', 'CAD', 'DFC'],
  LD: ['LD', 'LI', 'CAI', 'CAD', 'DFC'],
  CAI: ['CAI', 'LI', 'CAD', 'LD', 'DFC'],
  CAD: ['CAD', 'LD', 'CAI', 'LI', 'DFC'],
  MCD: ['MCD', 'MC', 'MCO'],
  MC: ['MC', 'MCD', 'MCO', 'MI', 'MD'],
  MCO: ['MCO', 'MC', 'MI', 'MD', 'DC'],
  MI: ['MI', 'MD', 'EI', 'ED', 'MC'],
  MD: ['MD', 'MI', 'ED', 'EI', 'MC'],
  EI: ['EI', 'ED', 'MI', 'MD', 'DC'],
  ED: ['ED', 'EI', 'MD', 'MI', 'DC'],
  DC: ['DC', 'EI', 'ED', 'MCO']
};

// Convocatoria del banquillo: 2 porteros + un jugador por cada slot de la formación,
// prefiriendo el mejor OVR compatible. El resto del primer equipo son reservas.
function buildConvocatoriaOrder(team, startingIds) {
  const { firstTeam } = buildFirstTeamSquad(team);
  const starters = new Set(startingIds);
  const pool = firstTeam.filter(p => !starters.has(p.id) && !isUnavailable(p));
  const used = new Set(startingIds);
  const conv = [];

  const addBest = (list) => {
    const p = list.filter(x => !used.has(x.id)).sort(byOvrDesc)[0];
    if (p) { conv.push(p.id); used.add(p.id); }
    return p;
  };

  // 1) Dos mejores porteros disponibles
  addBest(pool.filter(p => p.pos === 'POR'));
  addBest(pool.filter(p => p.pos === 'POR'));

  // 2) Un jugador por cada slot de campo de la formación
  const slots = FORMATIONS[activeFormation] || FORMATIONS['4-3-3'];
  for (const slot of slots) {
    if (slot.pos === 'POR') continue;
    const covers = POSITION_COVERS[slot.pos] || [slot.pos];
    let p = pool.filter(x => covers.indexOf(x.pos) !== -1 && !used.has(x.id)).sort(byOvrDesc)[0];
    if (!p) p = pool.filter(x => getPosGroup(x.pos) === getPosGroup(slot.pos) && x.pos !== 'POR' && !used.has(x.id)).sort(byOvrDesc)[0];
    if (!p) p = pool.filter(x => x.pos !== 'POR' && !used.has(x.id)).sort(byOvrDesc)[0];
    if (p) { conv.push(p.id); used.add(p.id); }
  }

  // 3) Resto del primer equipo (reservas) por OVR
  const rest = pool.filter(p => !used.has(p.id)).sort(byOvrDesc).map(p => p.id);

  // 4) No disponibles (lesión/sanción) al final del banquillo: solo ocupan hueco si no hay suficientes jugadores
  const unavailable = firstTeam.filter(p => !starters.has(p.id) && isUnavailable(p) && conv.indexOf(p.id) === -1 && rest.indexOf(p.id) === -1);
  return conv.concat(rest, unavailable.map(p => p.id));
}

function setFormation(f) {
  if (FORMATIONS[f]) activeFormation = f;
}

function getSquadState(team) {
  if (state.has(team.id)) return state.get(team.id);

  const startingIds = getStartingLineup(team);
  const subIds = buildConvocatoriaOrder(team, startingIds);

  const squad = {
    startingIds,
    subIds,
    selected: null
  };
  state.set(team.id, squad);
  return squad;
}

// Tras lesiones/sanciones: quita no disponibles del once y rellena el 11 con los disponibles
function refreshLineup(team) {
  const squad = getSquadState(team);
  // Descarta ids que ya no están en la plantilla (traspasado/cedido) para evitar huecos rotos
  const valid = (id) => !!getPlayer(team, id);
  const healthyStarters = squad.startingIds.filter(id => valid(id) && !isUnavailable(getPlayer(team, id)));
  const startingIds = healthyStarters.length < 11 ? getStartingLineup(team, healthyStarters) : healthyStarters;
  const subIds = buildConvocatoriaOrder(team, startingIds);
  state.set(team.id, { startingIds, subIds, selected: null });
}

function getPlayer(team, id) {
  return team.players.find(p => p.id === id);
}

function getStartingTeamOvr(team) {
  const squad = getSquadState(team);
  const starters = squad.startingIds.map(id => getPlayer(team, id));
  const sum = starters.reduce((acc, p) => acc + p.ovr, 0);
  return Math.round((sum / starters.length) * 10) / 10;
}

// GRL (media general del equipo): 2 mejores POR + 3 mejores DEF + 3 mejores MED + 3 mejores DEL, ÷ 11
function getTeamRating(team) {
  const pool = activeRoster(team);
  const byGroup = { POR: [], DEF: [], MED: [], DEL: [] };
  for (const p of pool) {
    const g = getPosGroup(p.pos);
    if (byGroup[g]) byGroup[g].push(p);
  }
  const pick = (arr, n) => arr.sort(byOvrDesc).slice(0, n);
  const best = [
    ...pick(byGroup.POR, 2),
    ...pick(byGroup.DEF, 3),
    ...pick(byGroup.MED, 3),
    ...pick(byGroup.DEL, 3)
  ];
  if (!best.length) return team.ovr || 0;
  const sum = best.reduce((a, p) => a + p.ovr, 0);
  return Math.round((sum / 11) * 10) / 10;
}

function getFormation(team) {
  return FORMATIONS[activeFormation] ? activeFormation : '4-3-3';
}

// Valor de mercado: millones con 2 decimales (€5,11M / €25,62M); por debajo de 1M,
// redondeado al millar (€107.000 / €108.000).
function formatValue(n) {
  const v = Number(n || 0);
  if (v >= 1e9) return `€${(v / 1e9).toFixed(2).replace('.', ',')}B`;
  if (v >= 1e6) return `€${(v / 1e6).toFixed(2).replace('.', ',')}M`;
  const k = Math.round(v / 1000) * 1000;
  return `€${k.toLocaleString('es-ES')}`;
}

function getRatingColor(ovr) {
  const r = Math.round(ovr);
  if (r <= 54) return { bg: '#DBEAFE', color: '#0F172A' };
  if (r <= 64) return { bg: '#93C5FD', color: '#0F172A' };
  if (r <= 74) return { bg: '#60A5FA', color: '#FFFFFF' };
  if (r <= 84) return { bg: '#2563EB', color: '#FFFFFF' };
  if (r <= 89) return { bg: '#1D4ED8', color: '#FFFFFF' };
  return { bg: '#0F172A', color: '#FFFFFF' };
}

function playerDorsalHtml(player) {
  const hasNumber = player.number !== undefined && player.number !== null && player.number !== '';
  return hasNumber
    ? `<span class="player-number">${player.number}</span>`
    : '<span class="player-number empty"></span>';
}

// Botón ⓘ para abrir la ficha del jugador desde el campo/banquillo de la táctica
function playerInfoBtnHtml(playerId) {
  return `<span class="player-info-btn" data-player-id="${playerId}" title="Ver ficha del jugador">
    <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  </span>`;
}

function buildField(team, fieldId, live) {
  const id = fieldId || 'squad-field';
  const squad = getSquadState(team);
  const starters = squad.startingIds.map(id => getPlayer(team, id));
  const slots = FORMATIONS[activeFormation] || FORMATIONS['4-3-3'];

  let html = `<div class="squad-field" id="${id}">`;
  html += '<span class="field-line line-h"></span>';
  html += '<span class="field-line line-v"></span>';
  html += '<span class="field-line center-circle"></span>';
  html += '<span class="field-line center-spot"></span>';
  html += '<span class="field-line box box-top"></span>';
  html += '<span class="field-line box box-bottom"></span>';
  html += '<span class="field-line goal goal-top"></span>';
  html += '<span class="field-line goal goal-bottom"></span>';
  html += '<span class="field-line spot spot-top"></span>';
  html += '<span class="field-line spot spot-bottom"></span>';
  html += `<span class="field-label">${getFormation(team)}</span>`;
  html += `<span class="field-attack">${ICON_ATTACK}</span>`;

  starters.forEach((p, i) => {
    const slot = slots[i] || { x: 50, y: 50 };
    const sel = squad.selected === p.id ? ' selected' : '';
    const outClass = p._sentOff ? ' sent-off' : (isInjured(p) ? ' injured' : '');
    const group = getPosGroup(slot.pos).toLowerCase();
    const st = (typeof p.stamina === 'number' && isFinite(p.stamina)) ? p.stamina : 100;
    const liveExtra = live ? liveMarksHtml(team, p, live) + liveRatingHtml(team, p, live) : statusBadgeHtml(p);
    const infoBtn = live ? '' : playerInfoBtnHtml(p.id);
    html += `
      <button class="field-player ${group}${sel}${outClass}" data-player-id="${p.id}"
              style="left:${slot.x}%; top:calc(${slot.y}% + 4px)" title="${p.name}">
        <span class="fp-badge">
          <span class="fp-avatar">${playerDorsalHtml(p)}</span>
          <span class="fp-pos ${group}">${slot.pos}</span>
          <span class="fp-ovr" style="background:${getRatingColor(p.ovr).bg}; color:${getRatingColor(p.ovr).color}">${p.ovr}</span>
          ${liveExtra}
          ${infoBtn}
        </span>
        <span class="fp-name">${p.nick || p.name.split(' ').pop()}</span>
        <span class="fp-stamina-bar"><span class="fp-stamina-fill" style="width:${st}%; background:${staminaColor(st)}"></span></span>
      </button>`;
  });

  html += '</div>';
  return html;
}

function isInjured(p) {
  return !!(p && p.injury && p.injury.isInjured);
}

function isSuspended(p) {
  return !!(p && p.suspension && p.suspension.isSuspended);
}

function isUnavailable(p) {
  return isInjured(p) || isSuspended(p);
}

function statusBadgeHtml(player) {
  if (isInjured(player)) return `<span class="player-status-badge inj">🩹${player.injury.weeksLeft}</span>`;
  if (isSuspended(player)) return `<span class="player-status-badge sus">🟥${player.suspension.matchesLeft}</span>`;
  return '';
}

// Marcadores en vivo (tarjetas, gol, lesión) para el modal de cambios
function liveMarksHtml(team, player, live) {
  const marks = [];
  if (live.yellows && live.yellows[team.id] && live.yellows[team.id][player.id]) marks.push('🟨');
  if ((live.reds && live.reds[team.id] && live.reds[team.id][player.id]) || player._sentOff) marks.push('🟥');
  if (live.goals && live.goals[team.id] && live.goals[team.id][player.id]) marks.push('⚽');
  if (isInjured(player)) marks.push('🩹');
  return marks.length ? `<span class="fp-live-marks">${marks.join('')}</span>` : '';
}

// Rendimiento en vivo (valoración del jugador en ese momento)
function liveRatingHtml(team, player, live) {
  const v = live.ratings && live.ratings[team.id] ? live.ratings[team.id][player.id] : undefined;
  if (v === undefined) return '';
  const color = live.colorFn ? live.colorFn(v) : '';
  return `<span class="fp-live-rating" style="color:${color}">${v.toFixed(1)}</span>`;
}

function playerRowHtml(team, player, isStarter, isSelected, opts = {}) {
  const rc = getRatingColor(player.ovr);
  const selectedClass = isSelected ? ' selected' : '';
  const unavailable = isUnavailable(player);
  const injClass = unavailable ? ' injured' : '';
  const group = getPosGroup(player.pos).toLowerCase();
  const foot = player.foot || 'D';
  const cedTag = opts.ced ? '<span class="ced-tag">CED</span>' : '';
  const listTags = [];
  if (player.transferListed) listTags.push('<span class="list-tag lt">LT</span>');
  if (player.loanListed) listTags.push('<span class="list-tag lc">LC</span>');
  const listTagsHtml = listTags.join('');
  const destDorsal = player.number !== undefined && player.number !== null && player.number !== '' ? ` · #${player.number}` : '';
  const destTag = opts.destination ? `<span class="ced-tag dest">CED → ${opts.destination}${destDorsal}</span>` : '';
  const filialClass = opts.filial ? ' filial-card' : '';
  const idAttr = opts.filial ? `data-filial-player-id="${player.id}"` : `data-player-id="${player.id}"`;

  return `
    <button class="player-card${selectedClass}${injClass}${filialClass}" ${idAttr}>
      <span class="player-avatar">
        ${playerDorsalHtml(player)}
        <span class="avatar-check">${ICON_CHECK}</span>
        ${statusBadgeHtml(player)}
      </span>
      <span class="player-info">
        <span class="player-name">${player.flag ? player.flag + ' ' : ''}${player.name} ${listTagsHtml}${cedTag}</span>
        <span class="player-meta"><span class="pos-pill ${group}">${player.pos}</span> · ${player.age} años · ${foot}</span>
        ${destTag ? `<span class="player-dest">${destTag}</span>` : ''}
      </span>
      <span class="player-value">${formatValue(player.value)}</span>
      <span class="ovr-badge" style="background:${rc.bg}; color:${rc.color}">${player.ovr}</span>
    </button>`;
}

function isLoanedIn(team, player) {
  return !!(player.loan && player.loan.isLoaned && player.loan.currentTeam === team.id && player.loan.parentTeam !== team.id);
}

function isLoanedOut(team, player) {
  return !!(player.loan && player.loan.isLoaned && player.loan.parentTeam === team.id && player.loan.currentTeam !== team.id);
}

function activeRoster(team) {
  return team.players.filter(p => !isLoanedOut(team, p));
}

function staminaColor(st) {
  if (st >= 75) return '#22c55e';
  if (st >= 50) return '#f59e0b';
  return '#ef4444';
}

function byOvrDesc(a, b) {
  return (b.ovr - a.ovr) || a.id.localeCompare(b.id);
}

function posRankOf(player) {
  return POS_RANK[player.pos] !== undefined ? POS_RANK[player.pos] : 99;
}

function sortByPosition(players) {
  return [...players].sort((a, b) => (posRankOf(a) - posRankOf(b)) || (b.ovr - a.ovr));
}

function buildFirstTeamSquad(team) {
  const startingIds = getStartingLineup(team);
  const players = activeRoster(team);
  const inTeam = new Set();

  // Preferencias del usuario: los forzados a 'reserves' nunca entran; los 'first' siempre
  const forcedOut = new Set(players.filter(p => roleOverrides.get(p.id) === 'reserves').map(p => p.id));
  const forcedIn = players.filter(p => roleOverrides.get(p.id) === 'first');

  // 1) Los 11 titulares siempre entran (pero con tope de 3 porteros)
  startingIds.forEach(id => { if (!forcedOut.has(id)) inTeam.add(id); });

  // 2) Tope de 3 porteros: mantener solo los 3 mejores POR (o los que haya)
  const gks = players.filter(p => p.pos === 'POR' && !forcedOut.has(p.id)).sort(byOvrDesc);
  const gkCap = Math.min(3, gks.length);
  const topGks = new Set(gks.slice(0, gkCap).map(p => p.id));
  for (const p of players) {
    if (p.pos === 'POR' && inTeam.has(p.id) && !topGks.has(p.id) && !forcedIn.some(x => x.id === p.id)) inTeam.delete(p.id);
  }
  topGks.forEach(id => inTeam.add(id));

  // 3) Mínimo 2 por posición específica de campo (mejores por OVR), sin forzados fuera
  const posiciones = [...new Set(players.filter(p => p.pos !== 'POR' && !forcedOut.has(p.id)).map(p => p.pos))];
  for (const pos of posiciones) {
    players.filter(p => p.pos === pos && !forcedOut.has(p.id)).sort(byOvrDesc).slice(0, 2).forEach(p => inTeam.add(p.id));
  }

  // 4) Forzados a primer equipo entran siempre
  forcedIn.forEach(p => { if (p.pos !== 'POR' || inTeam.size < 25) inTeam.add(p.id); });

  // 5) Rellenar con los mejores jugadores de campo restantes (nunca más porteros), sin
  //    superar 25. Cada jugador bajado a reservas de forma explícita libera una plaza
  //    que solo puede ocupar un jugador subido explícitamente, no el relleno automático.
  const demotedCount = players.filter(p => roleOverrides.get(p.id) === 'reserves').length;
  const forcedInCount = players.filter(p => roleOverrides.get(p.id) === 'first').length;
  const fillCap = Math.max(11, Math.min(25, 25 - demotedCount + forcedInCount));
  const remaining = players.filter(p => !inTeam.has(p.id) && p.pos !== 'POR' && !forcedOut.has(p.id)).sort(byOvrDesc);
  for (const p of remaining) {
    if (inTeam.size >= fillCap) break;
    inTeam.add(p.id);
  }

  return {
    firstTeam: players.filter(p => inTeam.has(p.id)),
    reservas: players.filter(p => !inTeam.has(p.id))
  };
}

function buildList(team, subTab, statTab) {
  // Autocompletar dorsales faltantes al renderizar la plantilla (solo rellena huecos).
  if (team && window.PocketManager.squadEngine && window.PocketManager.squadEngine.assignAutomaticNumbers) {
    try { window.PocketManager.squadEngine.assignAutomaticNumbers(team); } catch (e) {}
  }
  const squad = getSquadState(team);
  const sub = subTab || activeSubTab;
  const view = statTab || activeStatTab;

  if (sub === 'reservas') {
    const { reservas } = buildFirstTeamSquad(team);
    if (view === 'stats') return buildStatsList(team, reservas);
    if (view === 'dorsales') return buildDorsalesList(team, reservas);
    let html = `<h3 class="squad-section-title">Equipo Reservas<span class="count">${reservas.length}</span></h3><div class="squad-group">`;
    if (!reservas.length) html += '<p class="squad-empty">Sin jugadores en reserva.</p>';
    reservas.forEach(p => { html += playerRowHtml(team, p, false, squad.selected === p.id, { ced: isLoanedIn(team, p) }); });
    return html + '</div>';
  }

  if (sub === 'cedidos') {
    const loans = db.getLoanedOut(team.id).sort((a, b) => posRankOf(a.player) - posRankOf(b.player));
    if (view === 'stats') return buildLoanStatsList(team, loans);
    let html = `<h3 class="squad-section-title">Cedidos fuera<span class="count">${loans.length}</span></h3><div class="squad-group">`;
    if (!loans.length) html += '<p class="squad-empty">Sin jugadores cedidos.</p>';
    loans.forEach(({ player: p, destination }) => { html += playerRowHtml(team, p, false, false, { destination }); });
    return html + '</div>';
  }

  // FILIAL: plantilla del club filial con opción de subir jugadores al primer equipo.
  if (sub === 'filial') {
    const farm = team && team.farmTeamId ? db.getTeamById(team.farmTeamId) : null;
    if (!farm) return '<p class="squad-empty">Este club no tiene filial.</p>';
    if (view === 'stats') return buildStatsList(farm, farm.players);
    let html = `<h3 class="squad-section-title">${farm.name}<span class="count">${farm.players.length}</span></h3><div class="squad-group">`;
    if (!farm.players.length) html += '<p class="squad-empty">Sin jugadores en el filial.</p>';
    farm.players.forEach(p => { html += playerRowHtml(farm, p, false, false, { filial: true }); });
    return html + '</div>';
  }

  // PRIMER EQUIPO
  const { firstTeam } = buildFirstTeamSquad(team);
  if (view === 'stats') return buildStatsList(team, firstTeam);
  if (view === 'dorsales') return buildDorsalesList(team, firstTeam);
  let html = `<h3 class="squad-section-title">Primer Equipo<span class="count">${firstTeam.length}</span></h3><div class="squad-group">`;
  if (!firstTeam.length) html += '<p class="squad-empty">Sin resultados.</p>';
  firstTeam.forEach(p => { html += playerRowHtml(team, p, squad.startingIds.includes(p.id), squad.selected === p.id, { ced: isLoanedIn(team, p) }); });
  return html + '</div>';
}

function buildStatsList(team, players) {
  if (!players.length) return '<p class="squad-empty">Sin resultados.</p>';
  return '<div class="squad-group">' + players.map(p => {
    const s = getPlayerStats(p);
    const group = getPosGroup(p.pos).toLowerCase();
    const med = s.apps > 0 ? (s.ratingSum / s.apps).toFixed(1) : '—';
    return `
      <div class="stat-card">
        <span class="player-avatar">${playerDorsalHtml(p)}${statusBadgeHtml(p)}</span>
        <span class="player-info">
          <span class="player-name">${p.name}</span>
          <span class="player-meta"><span class="pos-pill ${group}">${p.pos}</span> · ${p.flag || '—'}</span>
        </span>
        <span class="stat-block">
          <span class="stat"><i>PJ</i><b>${s.apps}</b></span>
          <span class="stat"><i>G</i><b>${s.goals}</b></span>
          <span class="stat"><i>A</i><b>${s.assists}</b></span>
          <span class="stat"><i>MED</i><b>${med}</b></span>
          <span class="stat"><i>TA</i><b>${s.yellows}</b></span>
          <span class="stat"><i>TR</i><b>${s.reds}</b></span>
        </span>
      </div>`;
  }).join('') + '</div>';
}

// Stats del periodo de cesión (actual − línea base al ceder). Sin línea base = desde cero.
function loanStatsOf(player) {
  const s = getPlayerStats(player);
  const b = (player.loan && player.loan.baselineStats) || { apps: 0, goals: 0, assists: 0, ratingSum: 0, yellows: 0, reds: 0 };
  const max0 = (v) => Math.max(0, v);
  return {
    apps: max0(s.apps - (b.apps || 0)),
    goals: max0(s.goals - (b.goals || 0)),
    assists: max0(s.assists - (b.assists || 0)),
    ratingSum: max0(s.ratingSum - (b.ratingSum || 0)),
    yellows: max0(s.yellows - (b.yellows || 0)),
    reds: max0(s.reds - (b.reds || 0))
  };
}

// Tarjeta de estadísticas para jugadores cedidos, mostrando el club destino
function buildLoanStatsList(team, loans) {
  if (!loans.length) return '<p class="squad-empty">Sin resultados.</p>';
  return '<div class="squad-group">' + loans.map(({ player: p, destination }) => {
    const s = loanStatsOf(p);
    const group = getPosGroup(p.pos).toLowerCase();
    const med = s.apps > 0 ? (s.ratingSum / s.apps).toFixed(1) : '—';
    return `
      <div class="stat-card">
        <span class="player-avatar">${playerDorsalHtml(p)}${statusBadgeHtml(p)}</span>
        <span class="player-info">
          <span class="player-name">${p.name}</span>
          <span class="player-meta"><span class="pos-pill ${group}">${p.pos}</span> · Cedido en: ${destination || '—'}</span>
        </span>
        <span class="stat-block">
          <span class="stat"><i>PJ</i><b>${s.apps}</b></span>
          <span class="stat"><i>G</i><b>${s.goals}</b></span>
          <span class="stat"><i>A</i><b>${s.assists}</b></span>
          <span class="stat"><i>MED</i><b>${med}</b></span>
          <span class="stat"><i>TA</i><b>${s.yellows}</b></span>
          <span class="stat"><i>TR</i><b>${s.reds}</b></span>
        </span>
      </div>`;
  }).join('') + '</div>';
}

// Vista DORSALES: jugadores con su dorsal; tocar uno abre el selector de dorsal
function buildDorsalesList(team, players) {
  if (!players.length) return '<p class="squad-empty">Sin resultados.</p>';
  const html = players.map(p => {
    const group = getPosGroup(p.pos).toLowerCase();
    return `
      <button class="dorsal-row" data-player-id="${p.id}">
        <span class="player-avatar">${playerDorsalHtml(p)}</span>
        <span class="player-info">
          <span class="player-name">${p.flag ? p.flag + ' ' : ''}${p.name}</span>
          <span class="player-meta"><span class="pos-pill ${group}">${p.pos}</span> · ${p.age} años</span>
        </span>
        <span class="dorsal-swap">✎</span>
      </button>`;
  }).join('');
  return `<h3 class="squad-section-title">Dorsales<span class="count">${players.length}</span></h3>
    <p class="dorsal-hint">Toca un jugador para cambiar su dorsal.</p>
    <div class="squad-group">${html}</div>`;
}

// Aviso flotante (toast) reutilizando el elemento #toast
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => t.classList.add('hidden'), 2600);
}

// --- Selección de dorsal (modal) ---
let dorsalPickerPlayer = null;

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Abre el selector de dorsal para un jugador (teclear o elegir de la lista 1-99)
function openDorsalPicker(team, playerId) {
  const player = getPlayer(team, playerId);
  if (!player) return;
  dorsalPickerPlayer = player;
  const titleEl = document.getElementById('dorsal-picker-title');
  if (titleEl) titleEl.textContent = `Dorsal · ${player.name}`;
  const input = document.getElementById('dorsal-picker-input');
  if (input) input.value = player.number !== undefined && player.number !== null && player.number !== '' ? String(player.number) : '';

  // Rejilla 1-99: los ocupados por otros jugadores se marcan con su dueño
  const grid = document.getElementById('dorsal-picker-grid');
  if (grid) {
    const ownerByNumber = {};
    for (const p of team.players) {
      if (p.number !== undefined && p.number !== null && p.number !== '' && p.id !== playerId) {
        ownerByNumber[String(p.number)] = p;
      }
    }
    const chips = [];
    for (let n = 1; n <= 99; n++) {
      const owner = ownerByNumber[String(n)];
      const isCurrent = String(n) === String(player.number);
      const taken = owner ? ' taken' : '';
      const current = isCurrent ? ' current' : '';
      const label = owner ? `${n}·${owner.nick || owner.name}` : n;
      chips.push(`<button class="dorsal-pick${taken}${current}" data-number="${n}"${owner ? ' disabled' : ''}>${label}</button>`);
    }
    grid.innerHTML = chips.join('');
  }

  openModal('dorsal-picker-modal');
}

// Asigna el dorsal `n` al jugador seleccionado. Si otro lo tiene, intercambio automático.
function assignDorsal(n) {
  const player = dorsalPickerPlayer;
  if (!player) return;
  n = Math.floor(Number(n));
  if (!n || n < 1 || n > 99) {
    showToast('Introduce un dorsal entre 1 y 99');
    return;
  }
  const team = currentTeam();
  if (!team) return;
  const previous = player.number !== undefined && player.number !== null && player.number !== '' ? player.number : '';
  const owner = team.players.find(p => p.id !== player.id && String(p.number) === String(n));
  if (owner) {
    // Intercambio automático: el dueño anterior recibe el dorsal previo del editado
    owner.number = previous;
  }
  player.number = n;
  closeModal('dorsal-picker-modal');
  dorsalPickerPlayer = null;
  renderSquadList();
  showToast(owner ? `Dorsal ${n} para ${player.name} (${owner.nick || owner.name} toma el ${previous || '—'})` : `Dorsal ${n} asignado a ${player.name}`);
}

function renderSquadList() {
  const listEl = document.getElementById('squad-list');
  if (listEl) listEl.innerHTML = buildList(squadTeam(), activeSubTab, activeStatTab);
}

function getBenchSplit(team, squad) {
  const limit = getMaxSubsForTeam(team);
  const players = squad.subIds.map(id => getPlayer(team, id)).filter(Boolean);
  return { limit, bench: players.slice(0, limit), reserves: players.slice(limit) };
}

function benchRowHtml(team, player, selected, live) {
  const group = getPosGroup(player.pos).toLowerCase();
  const rc = getRatingColor(player.ovr);
  const st = (typeof player.stamina === 'number' && isFinite(player.stamina)) ? player.stamina : 100;
  const unavailable = isUnavailable(player);
  const injClass = unavailable ? ' unavailable' : '';
  // En el modal de cambios solo se muestra el rendimiento de quien ha jugado (tiene valoración en vivo)
  const played = live && live.ratings && live.ratings[team.id] && live.ratings[team.id][player.id] !== undefined;
  const extra = played ? liveMarksHtml(team, player, live) + liveRatingHtml(team, player, live) : statusBadgeHtml(player);
  const infoBtn = live ? '' : playerInfoBtnHtml(player.id);
  return `
    <button class="bench-card ${group}${injClass}${selected ? ' selected' : ''}" data-player-id="${player.id}" title="${player.name}">
      <span class="fp-badge">
        <span class="fp-avatar">${playerDorsalHtml(player)}</span>
        <span class="fp-pos ${group}">${player.pos}</span>
        <span class="fp-ovr" style="background:${rc.bg}; color:${rc.color}">${player.ovr}</span>
        ${extra}
        ${infoBtn}
      </span>
      <span class="fp-name">${player.nick || player.name.split(' ').pop()}</span>
      <span class="fp-stamina-bar"><span class="fp-stamina-fill" style="width:${st}%; background:${staminaColor(st)}"></span></span>
    </button>`;
}

function buildBench(team) {
  const squad = getSquadState(team);
  const { limit, bench, reserves } = getBenchSplit(team, squad);

  let html = `<h3 class="squad-section-title">Suplentes<span class="count">${bench.length}/${limit}</span></h3><div class="bench-list">`;
  if (!bench.length) html += '<p class="squad-empty">Sin suplentes.</p>';
  else bench.forEach(p => { html += benchRowHtml(team, p, squad.selected === p.id); });
  html += '</div>';

  html += `<h3 class="squad-section-title">Reservas<span class="count">${reserves.length}</span></h3><div class="bench-list">`;
  if (!reserves.length) html += '<p class="squad-empty">Sin reservas.</p>';
  else reserves.forEach(p => { html += benchRowHtml(team, p, squad.selected === p.id); });
  html += '</div>';

  return html;
}

// Suplentes (sin reservas): usado en el modal de cambios durante el partido
function buildSuplentes(team, live) {
  const squad = getSquadState(team);
  const { limit, bench } = getBenchSplit(team, squad);
  let html = `<h3 class="squad-section-title">Suplentes<span class="count">${bench.length}/${limit}</span></h3><div class="bench-list">`;
  if (!bench.length) html += '<p class="squad-empty">Sin suplentes.</p>';
  else bench.forEach(p => { html += benchRowHtml(team, p, squad.selected === p.id, live); });
  return html + '</div>';
}

function updateTeamOvr(team) {
  const onceOvr = getStartingTeamOvr(team);
  const ovrEl = document.getElementById('squad-team-ovr');
  if (ovrEl) ovrEl.textContent = Math.round(onceOvr);
  const ring = document.getElementById('squad-ovr-ring');
  if (ring) {
    const rc = getRatingColor(onceOvr);
    ring.style.background = rc.bg;
    ring.style.color = rc.color;
  }

  const clubValue = document.getElementById('club-ovr-value');
  if (clubValue) clubValue.textContent = Math.round(getTeamRating(team));
  const clubRing = document.getElementById('club-ovr-ring');
  if (clubRing) {
    const rc = getRatingColor(getTeamRating(team));
    clubRing.style.background = rc.bg;
    clubRing.style.color = rc.color;
  }
}

function rebuildUi(team, animate = false) {
  const fieldEl = document.getElementById('squad-field');
  if (fieldEl) {
    fieldEl.outerHTML = buildField(team);
    if (animate) {
      const newField = document.getElementById('squad-field');
      newField.classList.add('swap-anim');
      setTimeout(() => newField.classList.remove('swap-anim'), 400);
    }
  }

  const listEl = document.getElementById('squad-list');
  if (listEl) listEl.innerHTML = buildList(team, activeSubTab);

  const benchEl = document.getElementById('squad-bench');
  if (benchEl) benchEl.innerHTML = buildBench(team);

  updateTeamOvr(team);
  updateActionBar(team);
  bindSquadEvents(team);
}

function updateActionBar(team) {
  const squad = getSquadState(team);
  const cancelBtn = document.getElementById('squad-btn-cancel');
  if (cancelBtn) cancelBtn.classList.toggle('hidden', !squad.selected);
}

function doSwap(team, idA, idB) {
  const squad = getSquadState(team);
  if (idA === idB) { squad.selected = null; rebuildUi(team); return; }

  const aStart = squad.startingIds.indexOf(idA);
  const bStart = squad.startingIds.indexOf(idB);
  const aSub = squad.subIds.indexOf(idA);
  const bSub = squad.subIds.indexOf(idB);

  if (aStart !== -1 && bStart !== -1) {
    // Ambos titulares: intercambian su posición en el campo
    squad.startingIds[aStart] = idB;
    squad.startingIds[bStart] = idA;
  } else if (aStart !== -1 && bSub !== -1) {
    // A titular, B suplente -> B entra
    squad.startingIds[aStart] = idB;
    squad.subIds[bSub] = idA;
  } else if (aSub !== -1 && bStart !== -1) {
    // A suplente, B titular -> A entra
    squad.startingIds[bStart] = idA;
    squad.subIds[aSub] = idB;
  } else if (aSub !== -1 && bSub !== -1) {
    // Ambos suplentes: intercambian el orden en el banquillo
    squad.subIds[aSub] = idB;
    squad.subIds[bSub] = idA;
  } else {
    squad.selected = null;
    rebuildUi(team);
    return;
  }

  squad.selected = null;
  rebuildUi(team, true);
}

// Mueve un jugador entre primer equipo y reservas, manteniendo el once coherente.
// Al bajar a reservas, sale del once (y del banquillo).
// Devuelve { ok: boolean, reason?: string }.
function setPlayerSection(team, playerId, section) {
  const player = getPlayer(team, playerId);
  if (!player) return { ok: false, reason: 'Jugador no encontrado' };
  if (section !== 'first' && section !== 'reserves') return { ok: false, reason: 'Sección inválida' };

  // Tope de 25 en el primer equipo: no se puede subir si ya está lleno
  if (section === 'first' && !isPlayerInFirstTeam(team, playerId)) {
    if (buildFirstTeamSquad(team).firstTeam.length >= 25) {
      return { ok: false, reason: 'El primer equipo ya tiene 25 jugadores. Baja uno para poder subir a otro.' };
    }
  }

  roleOverrides.set(playerId, section);

  const squad = getSquadState(team);
  squad.startingIds = getStartingLineup(team, squad.startingIds);
  squad.subIds = buildConvocatoriaOrder(team, squad.startingIds);
  squad.selected = null;
  state.set(team.id, squad);
  rebuildUi(team);
  return { ok: true };
}

function isPlayerInFirstTeam(team, playerId) {
  return sectionOf(team, playerId) === 'first';
}

function handleSelection(team, playerId) {
  const squad = getSquadState(team);
  if (squad.selected === playerId) {
    squad.selected = null;
    rebuildUi(team);
    return;
  }
  if (squad.selected) {
    doSwap(team, squad.selected, playerId);
    return;
  }
  squad.selected = playerId;
  rebuildUi(team);
}

let squadEventsBound = false;
let activeClubTab = 'plantilla';
let activeSubTab = 'primer';
let activeStatTab = 'general';
let clubTabsBound = false;

function clubStadiumHtml(team) {
  const capacity = Number(team.stadiumCapacity || 0).toLocaleString('es-ES');
  return `
    <span class="stadium-line">${ICON_STADIUM} ${team.stadium || '—'}</span>
    <span class="stadium-line stadium-cap">${ICON_SEAT} ${capacity} espectadores</span>`;
}

function clubBudgetHtml(team) {
  return `<span class="stadium-line">${ICON_BUDGET} € ${Number(team.budget || 0).toLocaleString('es-ES')}</span>`;
}

function clubTrophiesHtml(team) {
  const t = team.trophies || [];
  if (!t.length) return '<span class="trophy-empty">Sin palmarés</span>';
  return t.map(x => `
    <li class="trophy-item">
      <span class="trophy-label">${x.name}</span>
      <span class="trophy-count">${x.count}</span>
    </li>`).join('');
}

// HTML de la información del club (estadio, espectadores, presupuesto y palmarés), reutilizado
// por la pestaña "Información del club" de la plantilla y por la vista previa del selector.
function clubInfoHtml(team) {
  return `
    <div class="club-info-card">
      <div class="info-block">
        <h3>Estadio</h3>
        <p>${clubStadiumHtml(team)}</p>
      </div>
      <div class="info-block">
        <h3>Presupuesto</h3>
        <p>${clubBudgetHtml(team)}</p>
      </div>
      <div class="info-block">
        <h3>Palmarés</h3>
        <ul class="trophies">${clubTrophiesHtml(team)}</ul>
      </div>
    </div>`;
}

function renderClubInfo(team) {
  const stadiumEl = document.getElementById('club-stadium');
  if (stadiumEl) stadiumEl.innerHTML = clubStadiumHtml(team);
  const budgetEl = document.getElementById('club-budget');
  if (budgetEl) budgetEl.innerHTML = clubBudgetHtml(team);
  const trophiesEl = document.getElementById('club-trophies');
  if (trophiesEl) trophiesEl.innerHTML = clubTrophiesHtml(team);
}

function bindClubTabs(team) {
  if (clubTabsBound) return;
  clubTabsBound = true;

  const tabsEl = document.getElementById('club-tabs');
  const subtabsEl = document.getElementById('squad-subtabs');

  tabsEl.addEventListener('click', (e) => {
    const tab = e.target.closest('.club-tab');
    if (!tab) return;
    activeClubTab = tab.dataset.tab;
    tabsEl.querySelectorAll('.club-tab').forEach(t => t.classList.toggle('active', t === tab));
    document.querySelectorAll('#screen-squad .club-panel').forEach(p => p.classList.toggle('active', p.id === 'club-panel-' + activeClubTab));
  });

  subtabsEl.addEventListener('click', (e) => {
    const sub = e.target.closest('.subtab');
    if (!sub) return;
    activeSubTab = sub.dataset.subtab;
    subtabsEl.querySelectorAll('.subtab').forEach(s => s.classList.toggle('active', s === sub));
    updateFilialTabVisibility();
    const listEl = document.getElementById('squad-list');
    if (listEl) listEl.innerHTML = buildList(squadTeam(), activeSubTab, activeStatTab);
  });

  const statTabsEl = document.getElementById('squad-stat-tabs');
  if (statTabsEl) {
    statTabsEl.addEventListener('click', (e) => {
      const tab = e.target.closest('.subtab');
      if (!tab) return;
      activeStatTab = tab.dataset.stattab;
      statTabsEl.querySelectorAll('.subtab').forEach(s => s.classList.toggle('active', s === tab));
      const listEl = document.getElementById('squad-list');
      if (listEl) listEl.innerHTML = buildList(squadTeam(), activeSubTab, activeStatTab);
    });
  }

  const btnFormation = document.getElementById('btn-formation');
  const btnStyle = document.getElementById('btn-style');

  if (btnFormation) {
    btnFormation.addEventListener('click', openFormationModal);
  }

  if (btnStyle) {
    btnStyle.addEventListener('click', () => openStyleModal(team));
  }
}

function currentTeam() {
  return window.PocketManager.gameState ? window.PocketManager.gameState.team : null;
}

// Equipo actualmente renderizado en la pantalla de plantilla (puede ser otro club en vista)
let activeSquadTeamId = null;
function squadTeam() {
  if (activeSquadTeamId) {
    const t = db.getTeamById(activeSquadTeamId);
    if (t) return t;
  }
  return currentTeam();
}

// ¿Estamos viendo un equipo que no es el del usuario? (solo lectura)
function squadIsReadOnly() {
  const team = squadTeam();
  const user = currentTeam();
  return !!(user && team && team.id !== user.id);
}

function setSquadViewReadonly(readonly) {
  const formBtn = document.getElementById('btn-formation');
  const styleBtn = document.getElementById('btn-style');
  if (formBtn) formBtn.disabled = readonly;
  if (styleBtn) styleBtn.disabled = readonly;
  const section = document.getElementById('screen-squad');
  if (section) section.classList.toggle('squad-view-readonly', readonly);
}

// El botón DORSALES solo tiene sentido en PRIMER EQUIPO / RESERVAS (no en CEDIDOS)
function updateDorsalesTabVisibility() {
  const el = document.getElementById('squad-stat-dorsales');
  if (el) el.style.display = (activeSubTab === 'cedidos' || activeSubTab === 'filial') ? 'none' : '';
}

// ¿Se puede gestionar el filial desde este club? (el equipo del usuario con farmTeamId)
function canManageFilial(team) {
  const user = currentTeam();
  return !!(team && team.farmTeamId && user && team.id === user.id);
}

// Muestra/oculta el subapartado FILIAL (solo para el club del usuario con filial).
function updateFilialTabVisibility() {
  const el = document.getElementById('squad-subtab-filial');
  if (el) el.style.display = canManageFilial(squadTeam()) ? '' : 'none';
  const statTabsEl = document.getElementById('squad-stat-tabs');
  if (statTabsEl) statTabsEl.style.display = 'flex';
  updateDorsalesTabVisibility();
}

// Registra (una sola vez) la selección de opción y cierre de los modales de formación/estilo.
// Independiente de la pantalla de TÁCTICA, para que funcionen también desde el modal de cambios del partido.
function bindTacticModals() {
  const formationModal = document.getElementById('formation-modal');
  const styleModal = document.getElementById('style-modal');

  const close = (m) => { if (m) m.classList.remove('open'); };
  const closeModals = () => { close(formationModal); close(styleModal); };
  if (formationModal) {
    formationModal.addEventListener('click', (e) => {
      const team = currentTeam();
      const opt = e.target.closest('.nat-option');
      if (opt) {
        const f = opt.dataset.formation;
        if (f && team) {
          if (f !== activeFormation) {
            const current = state.get(team.id);
            const prevStartingIds = current ? current.startingIds.slice() : [];
            activeFormation = f;
            const startingIds = getStartingLineup(team, prevStartingIds);
            const subIds = buildConvocatoriaOrder(team, startingIds);
            state.set(team.id, { startingIds, subIds, selected: null });
            renderSquadScreen(team.id, true);
          }
          closeModals();
          document.dispatchEvent(new CustomEvent('tactics-changed'));
        }
        return;
      }
      if (e.target === formationModal) closeModals();
    });
  }

  if (styleModal) {
    styleModal.addEventListener('click', (e) => {
      const team = currentTeam();
      const opt = e.target.closest('.nat-option');
      if (opt) {
        const s = opt.dataset.style;
        if (s && team) {
          if (s !== getTeamStyle(team)) {
            setStyle(team.id, s);
            renderSquadScreen(team.id, true);
          }
          closeModals();
          document.dispatchEvent(new CustomEvent('tactics-changed'));
        }
        return;
      }
      if (e.target === styleModal) closeModals();
    });
  }

  const fClose = document.getElementById('formation-modal-close');
  const sClose = document.getElementById('style-modal-close');
  if (fClose) fClose.addEventListener('click', closeModals);
  if (sClose) sClose.addEventListener('click', closeModals);
}

// Enlaza (una sola vez) los eventos del selector de dorsal
function bindDorsalPicker() {
  const modal = document.getElementById('dorsal-picker-modal');
  if (!modal) return;
  const clear = () => { dorsalPickerPlayer = null; };

  document.getElementById('dorsal-picker-close').addEventListener('click', () => { clear(); closeModal('dorsal-picker-modal'); });
  modal.addEventListener('click', (e) => { if (e.target === modal) { clear(); closeModal('dorsal-picker-modal'); } });

  const apply = () => {
    const input = document.getElementById('dorsal-picker-input');
    assignDorsal(input ? input.value : '');
  };
  document.getElementById('dorsal-picker-apply').addEventListener('click', apply);
  const input = document.getElementById('dorsal-picker-input');
  if (input) input.addEventListener('keydown', (e) => { if (e.key === 'Enter') apply(); });

  const grid = document.getElementById('dorsal-picker-grid');
  grid.addEventListener('click', (e) => {
    const chip = e.target.closest('.dorsal-pick');
    if (!chip || chip.disabled) return;
    assignDorsal(chip.dataset.number);
  });
}

function handleAcademyAction(team, action, youthId) {
  const academy = window.PocketManager.academyEngine;
  if (!academy || !youthId) return;
  if (action === 'promote') {
    const res = academy.promoteYouth(team.id, youthId);
    if (res && res.ok) {
      showToast(`¡${res.player.name} promocionado a Reservas!`);
    } else {
      showToast((res && res.reason) || 'No se pudo promocionar');
      return;
    }
  } else if (action === 'discard') {
    const res = academy.discardYouth(team.id, youthId);
    if (res && res.ok) showToast(`${res.name} descartado`);
  }
  renderAcademy(team);
  // Si están en la pestaña Plantilla, refrescar el listado (el promocionado aparece en Reservas).
  const listEl = document.getElementById('squad-list');
  if (listEl && activeClubTab === 'plantilla') listEl.innerHTML = buildList(team, activeSubTab, activeStatTab);
}

function bindSquadEvents(team) {
  const section = document.getElementById('screen-squad');
  if (!section || squadEventsBound) return;
  squadEventsBound = true;

  section.addEventListener('click', (e) => {
    const team = squadTeam();
    const readonly = squadIsReadOnly();

    const academyBtn = e.target.closest('[data-academy-action]');
    if (academyBtn) {
      if (readonly) { showToast('Vista de solo lectura'); return; }
      handleAcademyAction(team, academyBtn.dataset.academyAction, academyBtn.dataset.youth);
      return;
    }

    const dorsalRow = e.target.closest('.dorsal-row');
    if (dorsalRow) {
      if (readonly) { showToast('Vista de solo lectura'); return; }
      openDorsalPicker(team, dorsalRow.dataset.playerId);
      return;
    }

    const filialCard = e.target.closest('.filial-card');
    if (filialCard) {
      const farm = team && team.farmTeamId ? db.getTeamById(team.farmTeamId) : null;
      if (!farm) return;
      const p = farm.players.find(x => x.id === filialCard.dataset.filialPlayerId);
      if (p && window.PocketManager.openPlayerModal) window.PocketManager.openPlayerModal(p, farm);
      return;
    }

    const infoBtn = e.target.closest('.player-info-btn');
    if (infoBtn) {
      const p = getPlayer(team, infoBtn.dataset.playerId);
      if (p && window.PocketManager.openPlayerModal) window.PocketManager.openPlayerModal(p, team);
      return;
    }

    const card = e.target.closest('.player-card');
    if (card) {
      const p = getPlayer(team, card.dataset.playerId);
      if (p && window.PocketManager.openPlayerModal) window.PocketManager.openPlayerModal(p, team);
      return;
    }

    const playerEl = e.target.closest('.field-player, .bench-card');
    if (playerEl) {
      if (readonly) { showToast('Vista de solo lectura'); return; }
      handleSelection(team, playerEl.dataset.playerId);
      return;
    }

    if (e.target.closest('#squad-btn-cancel')) {
      const squad = getSquadState(team);
      squad.selected = null;
      rebuildUi(team);
    }
  });
}

function renderAcademy(team) {
  const listEl = document.getElementById('academy-list');
  if (!listEl) return;
  const academy = window.PocketManager.academyEngine;
  if (!academy || !academy.academyList) {
    listEl.innerHTML = '';
    return;
  }
  const list = academy.academyList();
  if (!list.length) {
    listEl.innerHTML = '<p class="academy-empty">Sin canteranos disponibles. Llegarán en la Semana 20 (Enero).</p>';
    return;
  }
  listEl.innerHTML = list.map(y => `
    <div class="academy-card" data-youth="${y.id}">
      <div class="academy-head">
        <span class="academy-avatar">${y.flag || '🇪🇸'}</span>
        <div>
          <div class="academy-name">${y.name}</div>
          <div class="academy-meta"><span class="pos-pill ${getPosGroup(y.pos).toLowerCase()}">${y.pos}</span> · ${y.age} años</div>
        </div>
        <span class="academy-pot ${academy.potentialCls(y.potential)}">${academy.potentialLabel(y.potential)}</span>
      </div>
      <div class="academy-range">Media estimada: <b>${y.ovrRange[0]}-${y.ovrRange[1]}</b></div>
      ${y.valueRange ? `<div class="academy-value">Valor estimado: <b>${formatValue(y.valueRange[0])} - ${formatValue(y.valueRange[1])}</b></div>` : ''}
      <div class="academy-actions">
        <button class="btn btn-primary" data-academy-action="promote" data-youth="${y.id}">Promocionar a Reservas</button>
        <button class="btn btn-secondary" data-academy-action="discard" data-youth="${y.id}">Descartar</button>
      </div>
    </div>`).join('');
}

function renderSquadScreen(teamId, keepTab = false, isView = false) {
  const team = db.getTeamById(teamId);
  if (!team) {
    const fieldEl = document.getElementById('squad-field');
    if (fieldEl) fieldEl.innerHTML = '<p class="text-muted">Equipo no encontrado.</p>';
    return;
  }
  activeSquadTeamId = teamId;

  // En vista de otro equipo, usamos SU formación para mostrar su mejor once disponible
  const prevFormation = activeFormation;
  if (isView && team.formation) {
    activeFormation = team.formation;
    state.delete(team.id);
  }

  const titleEl = document.getElementById('squad-team-name');
  if (titleEl) titleEl.textContent = team.name;

  const badgeEl = document.getElementById('squad-team-badge');
  if (badgeEl) {
    badgeEl.textContent = team.shortName;
    badgeEl.style.background = `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})`;
  }

  const formationEl = document.getElementById('squad-formation');
  if (formationEl) {
    formationEl.innerHTML = `<span class="dot"></span> Formación ${getFormation(team)} · ${getTeamStyle(team)}`;
  }

  const btnFormationValue = document.getElementById('btn-formation-value');
  if (btnFormationValue) btnFormationValue.textContent = getFormation(team);
  const btnStyleValue = document.getElementById('btn-style-value');
  if (btnStyleValue) btnStyleValue.textContent = getTeamStyle(team);

  const fieldEl = document.getElementById('squad-field');
  if (fieldEl) fieldEl.outerHTML = buildField(team);

  if (!keepTab) {
    activeClubTab = 'plantilla';
    activeSubTab = 'primer';
    activeStatTab = 'general';
  }
  // Filial: en vista de otro club (solo lectura) no se puede gestionar.
  if (!canManageFilial(team) && activeSubTab === 'filial') activeSubTab = 'primer';
  // Pestaña Academia: solo para el club del usuario (no en la vista de otros clubes).
  const isUserClub = !!(currentTeam() && team.id === currentTeam().id);
  const academiaTab = document.getElementById('club-tab-academia');
  if (academiaTab) academiaTab.style.display = isUserClub ? '' : 'none';
  if (!isUserClub && activeClubTab === 'academia') activeClubTab = 'plantilla';
  document.querySelectorAll('#screen-squad .club-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeClubTab));
  document.querySelectorAll('#screen-squad .subtab').forEach(s => s.classList.toggle('active', s.dataset.subtab === activeSubTab));
  document.querySelectorAll('#screen-squad .club-panel').forEach(p => p.classList.toggle('active', p.id === 'club-panel-' + activeClubTab));

  const statTabsEl = document.getElementById('squad-stat-tabs');
  if (statTabsEl) {
    statTabsEl.style.display = 'flex';
    statTabsEl.querySelectorAll('.subtab').forEach(s => s.classList.toggle('active', s.dataset.stattab === activeStatTab));
  }
  updateDorsalesTabVisibility();
  updateFilialTabVisibility();

  const listEl = document.getElementById('squad-list');
  if (listEl) listEl.innerHTML = buildList(team, activeSubTab, activeStatTab);

  const benchEl = document.getElementById('squad-bench');
  if (benchEl) benchEl.innerHTML = buildBench(team);

  renderClubInfo(team);
  renderAcademy(team);
  updateTeamOvr(team);
  updateActionBar(team);

  // Indicadores de vista de otro club
  const viewBack = document.getElementById('squad-view-back');
  const readonly = isView && !(currentTeam() && team.id === currentTeam().id);
  if (viewBack) viewBack.classList.toggle('hidden', !isView);
  setSquadViewReadonly(readonly);

  if (isView && team.formation) activeFormation = prevFormation;

  bindSquadEvents(team);
  bindClubTabs(team);
}

function captureRuntime() {
  const team = window.PocketManager.gameState.team;
  if (!team) return null;
  const squad = state.get(team.id);
  return {
    formation: activeFormation,
    style: styleOverrides.get(team.id) || null,
    roleOverrides: [...roleOverrides.entries()],
    squadState: squad ? { startingIds: [...squad.startingIds], subIds: [...squad.subIds] } : null,
    playerStats: [...playerStats.entries()],
    ratings: db.getAllTeams().map(t => [t.id, t.players.map(p => [p.id, p.ovr])]),
    trophies: db.getAllTeams().map(t => [t.id, (t.trophies || []).map(x => ({ name: x.name, count: x.count }))]),
    dorsals: team.players.map(p => [p.id, p.number]),
    staminaInjury: team.players.map(p => [p.id, { stamina: p.stamina, injury: p.injury || null, suspension: p.suspension || null }])
  };
}

function restoreRuntime(team, data) {
  if (!team || !data) return;
  if (data.formation) activeFormation = data.formation;
  if (data.style) setStyle(team.id, data.style);
  if (data.roleOverrides && Array.isArray(data.roleOverrides)) {
    roleOverrides.clear();
    for (const [id, section] of data.roleOverrides) {
      if (id && (section === 'first' || section === 'reserves')) roleOverrides.set(id, section);
    }
  }
  if (data.playerStats && Array.isArray(data.playerStats)) {
    playerStats.clear();
    for (const [id, s] of data.playerStats) playerStats.set(id, s);
  }
  if (data.dorsals && Array.isArray(data.dorsals)) {
    for (const [id, number] of data.dorsals) {
      const p = team.players.find(x => x.id === id);
      if (p) p.number = number;
    }
  }
  if (data.ratings && Array.isArray(data.ratings)) {
    for (const [teamId, list] of data.ratings) {
      const t = db.getTeamById(teamId);
      if (!t || !Array.isArray(list)) continue;
      for (const [pid, ovr] of list) {
        const p = t.players.find(x => x.id === pid);
        if (p) p.ovr = ovr;
      }
    }
  }
  if (data.trophies && Array.isArray(data.trophies)) {
    for (const [teamId, trophies] of data.trophies) {
      const t = db.getTeamById(teamId);
      if (t && Array.isArray(trophies)) t.trophies = trophies;
    }
  }
  if (data.staminaInjury && Array.isArray(data.staminaInjury)) {
    for (const [id, s] of data.staminaInjury) {
      const p = team.players.find(x => x.id === id);
      if (p) {
        p.stamina = s.stamina;
        p.injury = s.injury || null;
        p.suspension = s.suspension || null;
      }
    }
  }
  if (data.squadState && Array.isArray(data.squadState.startingIds)) {
    state.set(team.id, {
      startingIds: data.squadState.startingIds,
      subIds: data.squadState.subIds || [],
      selected: null
    });
  } else {
    state.delete(team.id);
  }
}

  // Abre la plantilla de cualquier equipo en modo solo lectura (desde clasificaciones,
  // cuadros de copas, calendario, etc.).
  function openTeamView(teamId) {
    if (!teamId || !db.getTeamById(teamId)) return;
    document.dispatchEvent(new CustomEvent('nav', { detail: 'screen-squad' }));
    renderSquadScreen(teamId, false, true);
  }

  window.PocketManager.renderSquadScreen = renderSquadScreen;
  window.PocketManager.openTeamView = openTeamView;
  window.PocketManager.clubInfoHtml = clubInfoHtml;
  window.PocketManager.playerRowHtml = playerRowHtml;
  window.PocketManager.getRatingColor = getRatingColor;
  window.PocketManager.getTeamRating = getTeamRating;
  window.PocketManager.setFormation = setFormation;
  window.PocketManager.getTeamStyle = getTeamStyle;
  window.PocketManager.setStyle = setStyle;
  window.PocketManager.openFormationModal = openFormationModal;
  window.PocketManager.openStyleModal = openStyleModal;
  window.PocketManager.getPlayerStats = getPlayerStats;
  window.PocketManager.getStartingTeamOvr = getStartingTeamOvr;
  window.PocketManager.getSquadState = getSquadState;
  window.PocketManager.doSwap = doSwap;
  window.PocketManager.setPlayerSection = setPlayerSection;
  window.PocketManager.isPlayerInFirstTeam = isPlayerInFirstTeam;
  window.PocketManager.formatValue = formatValue;
  window.PocketManager.getFormation = getFormation;
  window.PocketManager.buildSuplentes = buildSuplentes;
  window.PocketManager.buildField = buildField;
  window.PocketManager.isLoanedOut = isLoanedOut;
  window.PocketManager.isLoanedIn = isLoanedIn;
  window.PocketManager.posRankOf = posRankOf;
  window.PocketManager.sortByPosition = sortByPosition;
  window.PocketManager.captureRuntime = captureRuntime;
  window.PocketManager.restoreRuntime = restoreRuntime;
  window.PocketManager.refreshLineup = refreshLineup;
  window.PocketManager.isInjured = isInjured;
  window.PocketManager.isSuspended = isSuspended;
  window.PocketManager.isUnavailable = isUnavailable;

  bindTacticModals();
  bindDorsalPicker();
})();
