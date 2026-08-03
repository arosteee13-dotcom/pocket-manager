(function () {
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const formatBudget = window.PocketManager.formatBudget;
  const getRatingColor = window.PocketManager.getRatingColor;
  const nationalities = window.PocketManager.nationalities || [];

  const natByCode = new Map(nationalities.map(n => [n.code, n.name]));

  // Todas las posiciones específicas (orden canónico: POR, defensa, centro, ataque)
  const ALL_POSITIONS = ['POR', 'DFC', 'LI', 'LD', 'CAI', 'CAD', 'MCD', 'MC', 'MCO', 'MI', 'MD', 'EI', 'DC', 'ED'];

  let bound = false;
  let activeTab = 'market';
  let historySub = 'myliga';
  const filters = { pos: '', nat: '', ageMin: '', ageMax: '', ovrMin: '', ovrMax: '', maxValue: '' };

  function groupOf(pos) {
    if (pos === 'POR') return 'POR';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'DEF';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'MED';
    return 'DEL';
  }

  function normalizeText(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function flagToCode(flag) {
    try {
      const chars = [...String(flag)];
      if (chars.length !== 2) return '';
      const code = chars.map(c => String.fromCharCode(c.codePointAt(0) - 0x1F1E6 + 65)).join('');
      return /^[A-Z]{2}$/.test(code) ? code : '';
    } catch (e) { return ''; }
  }

  function countryNameFromFlag(flag) {
    const code = flagToCode(flag);
    return code ? (natByCode.get(code) || '') : '';
  }

  function populatePositionOptions() {
    const sel = document.getElementById('tm-f-pos');
    if (!sel || sel.dataset.populated) return;
    sel.dataset.populated = '1';
    sel.innerHTML = '<option value="">Todas</option>' +
      ALL_POSITIONS.map(p => `<option value="${p}">${p}</option>`).join('');
  }

  function transfers() {
    return gameState.transfers || (gameState.transfers = []);
  }

  function isMyLeagueTeam(teamId) {
    const country = db.getCountryData(gameState.team.id);
    return country ? country.teams.some(t => t.id === teamId) : false;
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }
  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  // --- Lógica de fichaje ---
  function executeTransfer(buyer, seller, player, fee) {
    const list = transfers();
    if (!buyer || !seller || !player) return { ok: false, reason: 'Datos inválidos' };
    if (buyer.id === seller.id) return { ok: false, reason: 'Mismo club' };
    if (buyer.budget < fee) return { ok: false, reason: 'Presupuesto insuficiente' };
    const idx = seller.players.indexOf(player);
    if (idx === -1) return { ok: false, reason: 'Jugador no disponible' };

    seller.players.splice(idx, 1);
    player.loan = null;
    buyer.players.push(player);
    buyer.budget = Math.round(buyer.budget - fee);
    seller.budget = Math.round((seller.budget || 0) + fee);

    const record = {
      id: 'tr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      season: gameState.currentSeason || 1,
      playerId: player.id,
      playerName: player.name,
      playerFlag: player.flag || '',
      pos: player.pos,
      fromTeamId: seller.id,
      fromTeamName: seller.name,
      toTeamId: buyer.id,
      toTeamName: buyer.name,
      fee
    };
    list.push(record);

    if (window.PocketManager.refreshLineup) {
      try { window.PocketManager.refreshLineup(buyer); } catch (e) {}
      try { window.PocketManager.refreshLineup(seller); } catch (e) {}
    }
    return { ok: true, record };
  }

  // --- MERCADO ---
  function marketPool() {
    const myTeam = gameState.team;
    const pool = [];
    for (const team of db.getAllTeams()) {
      if (!myTeam || team.id === myTeam.id) continue;
      for (const p of team.players) pool.push({ player: p, team });
    }
    return pool;
  }

  function applyFilters(pool) {
    const search = document.getElementById('tm-search');
    const q = normalizeText(search ? search.value : '');
    return pool.filter(({ player: p }) => {
      if (q && !normalizeText(p.name).includes(q)) return false;
      if (filters.pos && p.pos !== filters.pos) return false;
      if (filters.nat && p.flag !== filters.nat) return false;
      if (filters.ageMin !== '' && p.age < Number(filters.ageMin)) return false;
      if (filters.ageMax !== '' && p.age > Number(filters.ageMax)) return false;
      if (filters.ovrMin !== '' && p.ovr < Number(filters.ovrMin)) return false;
      if (filters.ovrMax !== '' && p.ovr > Number(filters.ovrMax)) return false;
      if (filters.maxValue !== '' && p.value > Number(filters.maxValue)) return false;
      return true;
    });
  }

  function renderMarket() {
    const myTeam = gameState.team;
    const pool = applyFilters(marketPool()).sort((a, b) => b.player.ovr - a.player.ovr);
    const countEl = document.getElementById('tm-count');
    if (countEl) countEl.textContent = `${pool.length} jugadores · Presupuesto: ${formatBudget(myTeam.budget)}`;
    const listEl = document.getElementById('tm-list');
    if (!listEl) return;
    if (!pool.length) { listEl.innerHTML = '<p class="tm-empty">Sin resultados.</p>'; return; }
    listEl.innerHTML = pool.map(({ player: p, team }) => marketCard(p, team)).join('');
  }

  function marketCard(p, team) {
    const rc = getRatingColor(p.ovr);
    const hasNum = p.number !== undefined && p.number !== null && p.number !== '';
    const foot = p.foot || 'D';
    return `
      <div class="tm-card" data-pid="${p.id}">
        <span class="tm-avatar">${hasNum ? `<b>${p.number}</b>` : '<i></i>'}</span>
        <span class="tm-main">
          <span class="tm-name">${p.flag ? p.flag + ' ' : ''}${p.name}</span>
          <span class="tm-meta">${p.age} años · ${foot === 'Z' ? 'Zurdo' : 'Diestro'} · <span class="pos-pill ${groupOf(p.pos).toLowerCase()}">${p.pos}</span></span>
          <span class="tm-club">${team.shortName} · ${window.PocketManager.formatValue(p.value)}</span>
        </span>
        <span class="tm-ovr" style="background:${rc.bg}; color:${rc.color}">${p.ovr}</span>
      </div>`;
  }

  // --- Filtros ---
  function flagsInDb() {
    const set = new Set();
    for (const t of db.getAllTeams()) for (const p of t.players) if (p.flag) set.add(p.flag);
    return [...set];
  }

  function openFilters() {
    const nat = document.getElementById('tm-f-nat');
    if (nat) {
      const opts = flagsInDb().map(f => ({ flag: f, name: countryNameFromFlag(f) }))
        .sort((a, b) => {
          const na = a.name || '\uffff';
          const nb = b.name || '\uffff';
          if (na === nb) return a.flag.localeCompare(b.flag);
          return na.localeCompare(nb, 'es');
        });
      nat.innerHTML = '<option value="">Todas</option>' + opts.map(o =>
        `<option value="${o.flag}">${o.flag}${o.name ? ' ' + o.name : ''}</option>`
      ).join('');
    }
    document.getElementById('tm-f-pos').value = filters.pos;
    document.getElementById('tm-f-nat').value = filters.nat;
    document.getElementById('tm-f-ageMin').value = filters.ageMin;
    document.getElementById('tm-f-ageMax').value = filters.ageMax;
    document.getElementById('tm-f-ovrMin').value = filters.ovrMin;
    document.getElementById('tm-f-ovrMax').value = filters.ovrMax;
    document.getElementById('tm-f-maxValue').value = filters.maxValue;
    openModal('tm-filters-modal');
  }

  function applyFiltersModal() {
    filters.pos = document.getElementById('tm-f-pos').value;
    filters.nat = document.getElementById('tm-f-nat').value;
    filters.ageMin = document.getElementById('tm-f-ageMin').value;
    filters.ageMax = document.getElementById('tm-f-ageMax').value;
    filters.ovrMin = document.getElementById('tm-f-ovrMin').value;
    filters.ovrMax = document.getElementById('tm-f-ovrMax').value;
    filters.maxValue = document.getElementById('tm-f-maxValue').value;
    closeModal('tm-filters-modal');
    renderMarket();
  }

  function resetFilters() {
    filters.pos = filters.nat = filters.ageMin = filters.ageMax = filters.ovrMin = filters.ovrMax = filters.maxValue = '';
    document.getElementById('tm-f-pos').value = '';
    document.getElementById('tm-f-nat').value = '';
    document.getElementById('tm-f-ageMin').value = '';
    document.getElementById('tm-f-ageMax').value = '';
    document.getElementById('tm-f-ovrMin').value = '';
    document.getElementById('tm-f-ovrMax').value = '';
    document.getElementById('tm-f-maxValue').value = '';
    closeModal('tm-filters-modal');
    renderMarket();
  }

  // --- HISTORIAL ---
  function renderHistory() {
    document.querySelectorAll('.transfers-subtabs .subtab').forEach(s => s.classList.toggle('active', s.dataset.hsub === historySub));
    const list = transfers().slice().reverse();
    const filtered = historySub === 'myliga'
      ? list.filter(t => isMyLeagueTeam(t.fromTeamId) || isMyLeagueTeam(t.toTeamId))
      : list;
    const listEl = document.getElementById('th-list');
    if (!listEl) return;
    if (!filtered.length) { listEl.innerHTML = '<p class="th-empty">Sin traspasos.</p>'; return; }
    listEl.innerHTML = filtered.map(historyItem).join('');
  }

  function historyItem(t) {
    return `
      <div class="th-item">
        <span class="th-avatar">${t.playerFlag || '🌍'}</span>
        <span class="th-main">
          <span class="th-name">${t.playerName}</span>
          <span class="th-route">${t.fromTeamName} ➡️ ${t.toTeamName}</span>
        </span>
        <span class="th-fee">${window.PocketManager.formatValue(t.fee)}</span>
      </div>`;
  }

  // --- PESTAÑAS / EVENTS ---
  function renderTransfers() {
    if (!bound) bindTransfers();
    if (!gameState.team) return;
    if (!gameState.season) gameState.season = window.PocketManager.season.initSeason(gameState.team);
    document.querySelectorAll('.transfers-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === activeTab));
    const marketPanel = document.getElementById('transfers-market');
    const historyPanel = document.getElementById('transfers-history');
    if (marketPanel) marketPanel.classList.toggle('active', activeTab === 'market');
    if (historyPanel) historyPanel.classList.toggle('active', activeTab === 'history');
    if (activeTab === 'market') renderMarket();
    else renderHistory();
  }

  function bindTransfers() {
    if (bound) return;
    bound = true;

    populatePositionOptions();

    document.querySelectorAll('.transfers-tab').forEach(t => {
      t.addEventListener('click', () => { activeTab = t.dataset.tab; renderTransfers(); });
    });
    document.querySelectorAll('.transfers-subtabs .subtab').forEach(s => {
      s.addEventListener('click', () => { historySub = s.dataset.hsub; renderHistory(); });
    });

    const search = document.getElementById('tm-search');
    if (search) search.addEventListener('input', () => renderMarket());

    document.getElementById('tm-filters-btn').addEventListener('click', openFilters);
    document.getElementById('tm-filters-close').addEventListener('click', () => closeModal('tm-filters-modal'));
    document.getElementById('tm-filters-modal').addEventListener('click', (e) => { if (e.target === e.currentTarget) closeModal('tm-filters-modal'); });
    document.getElementById('tm-f-apply').addEventListener('click', applyFiltersModal);
    document.getElementById('tm-f-reset').addEventListener('click', resetFilters);

    document.getElementById('tm-list').addEventListener('click', (e) => {
      const card = e.target.closest('.tm-card[data-pid]');
      if (!card) return;
      const found = marketPool().find(x => x.player.id === card.dataset.pid);
      if (found && window.PocketManager.openPlayerModal) {
        window.PocketManager.openPlayerModal(found.player, found.team);
      }
    });
  }

  window.PocketManager.renderTransfers = renderTransfers;
  window.PocketManager.executeTransfer = executeTransfer;
})();
