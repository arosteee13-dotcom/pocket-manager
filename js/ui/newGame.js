(function () {
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const setManager = window.PocketManager.setManager;
  const setTeam = window.PocketManager.setTeam;
  const nationalities = window.PocketManager.nationalities;

  let createFormBound = false;
  let selectLeagueBound = false;
  let selectTeamBound = false;
  let selectedNatCode = null;
  let selectedCountry = null;
  let selectedLeague = null;
  let selectedTeamId = null;

function flagFromCode(code) {
  if (!code) return '🌍';
  const upper = code.toUpperCase();

  // Código ISO alfa-2 -> bandera regional (🇪🇸, 🇮🇹…)
  if (upper.length === 2) {
    return String.fromCodePoint(...[...upper].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
  }

  // Subdivisión "XX-YYY" -> secuencia de etiquetas (🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra, etc.)
  const parts = upper.split('-');
  if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 3) {
    const tags = [...(parts[0] + parts[1]).toLowerCase()].map(c => 0xE0000 + c.charCodeAt(0));
    return String.fromCodePoint(0x1F3F4, ...tags, 0xE007F);
  }

  return '🌍';
}

function normalizeText(s) {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

function formatBudget(n) {
  if (n >= 1e9) return `€${(n / 1e9).toFixed(1).replace('.', ',')}B`;
  if (n >= 1e6) return `€${Math.round(n / 1e6)}M`;
  return `€${Math.round(n)}`;
}

const nationalityByFlagName = new Map(nationalities.map(n => [n.name, n.code]));

function flagForCountryName(name) {
  const code = nationalityByFlagName.get(name);
  return code ? flagFromCode(code) : '🌍';
}

window.__teamLogoError = (img, initials, color, secondary) => {
  const span = document.createElement('span');
  span.className = 'team-initials';
  span.textContent = initials;
  span.style.background = secondary ? `linear-gradient(135deg, ${color}, ${secondary})` : color;
  img.replaceWith(span);
};

window.__stBoxLogoError = (img, initials) => {
  img.parentElement.textContent = initials;
};

function nav(screenId) {
  document.dispatchEvent(new CustomEvent('nav', { detail: screenId }));
}

/* ------------------------------------------------------------------ */
/* Paso 1: Creación del Mánager                                        */
/* ------------------------------------------------------------------ */
function bindCreateForm() {
  if (createFormBound) return;
  createFormBound = true;

  const nameInput = document.getElementById('mg-name');
  const lastnameInput = document.getElementById('mg-lastname');
  const natTrigger = document.getElementById('mg-nationality');
  const continueBtn = document.getElementById('btn-continue-manager');
  const modal = document.getElementById('nationality-modal');
  const search = document.getElementById('nat-search');
  const list = document.getElementById('nat-list');
  const closeBtn = document.getElementById('nat-close');

  function validate() {
    const ok = !!(nameInput.value.trim() && lastnameInput.value.trim() && selectedNatCode);
    continueBtn.disabled = !ok;
  }

  function renderList(filter = '') {
    const q = normalizeText(filter);
    const items = nationalities
      .filter(n => !q || normalizeText(n.name).includes(q))
      .map(n => `
        <button class="nat-option${selectedNatCode === n.code ? ' selected' : ''}" data-code="${n.code}" data-name="${n.name}">
          <span class="nat-flag">${flagFromCode(n.code)}</span>
          <span class="nat-name">${n.name}</span>
          ${selectedNatCode === n.code ? '<span class="nat-check">✓</span>' : ''}
        </button>`)
      .join('');
    list.innerHTML = items || '<p class="nat-empty">Sin resultados</p>';
  }

  function openModal() {
    modal.classList.add('open');
    search.value = '';
    renderList();
    search.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
  }

  nameInput.addEventListener('input', validate);
  lastnameInput.addEventListener('input', validate);

  natTrigger.addEventListener('click', openModal);

  list.addEventListener('click', (e) => {
    const opt = e.target.closest('.nat-option');
    if (!opt) return;
    selectedNatCode = opt.dataset.code;
    const name = opt.dataset.name;
    natTrigger.innerHTML = `
      <span class="nat-flag">${flagFromCode(selectedNatCode)}</span>
      <span class="selected-nat">${name}</span>
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    natTrigger.classList.add('filled');
    closeModal();
    validate();
  });

  search.addEventListener('input', () => renderList(search.value));

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  closeBtn.addEventListener('click', closeModal);

  document.getElementById('btn-back-manager').addEventListener('click', () => nav('screen-main-menu'));

  continueBtn.addEventListener('click', () => {
    if (continueBtn.disabled) return;
    const nat = nationalities.find(n => n.code === selectedNatCode) || {};
    setManager({
      firstName: nameInput.value.trim(),
      lastName: lastnameInput.value.trim(),
      nationality: nat.name || selectedNatCode,
      nationalityCode: selectedNatCode,
      flag: flagFromCode(selectedNatCode)
    });
    nav('screen-select-league');
  });
}

function resetCreateForm() {
  const nameInput = document.getElementById('mg-name');
  const lastnameInput = document.getElementById('mg-lastname');
  const natTrigger = document.getElementById('mg-nationality');
  const continueBtn = document.getElementById('btn-continue-manager');
  const startBtn = document.getElementById('btn-start-career');

  if (nameInput) nameInput.value = '';
  if (lastnameInput) lastnameInput.value = '';
  selectedNatCode = null;
  selectedCountry = null;
  selectedLeague = null;
  selectedTeamId = null;

  if (natTrigger) {
    natTrigger.innerHTML = `
      <span class="placeholder">Selecciona tu nacionalidad</span>
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    natTrigger.classList.remove('filled');
  }
  if (continueBtn) continueBtn.disabled = true;
  if (startBtn) startBtn.disabled = true;
}

/* ------------------------------------------------------------------ */
/* Paso 2: Selección de Liga                                          */
/* ------------------------------------------------------------------ */
function renderSelectLeague() {
  const manager = gameState.manager;
  const greeting = document.getElementById('sl-greeting');
  if (greeting && manager) {
    greeting.innerHTML = `
      <span class="greeting-avatar">👋</span>
      <span class="greeting-text">
        <strong>${manager.firstName} ${manager.lastName}</strong>
        <small>${flagForCountryName(manager.nationality)} ${manager.nationality}</small>
      </span>`;
  }

  const container = document.getElementById('sl-leagues');
  const countries = db.getCountries();
  container.innerHTML = countries.map(c => `
    <button class="league-card" data-country="${c.name}">
      <span class="country-flag">${flagForCountryName(c.name)}</span>
      <span class="country-info">
        <span class="country-name">${c.name}</span>
        <span class="league-name">${c.league}</span>
      </span>
      <svg class="chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>
    </button>`).join('');
}

function bindSelectLeague() {
  if (selectLeagueBound) return;
  selectLeagueBound = true;

  const container = document.getElementById('sl-leagues');
  container.addEventListener('click', (e) => {
    const card = e.target.closest('.league-card');
    if (!card) return;
    selectedCountry = card.dataset.country;
    selectedLeague = null;
    selectedTeamId = null;
    nav('screen-select-team');
  });

  document.getElementById('btn-back-league').addEventListener('click', () => nav('screen-create-manager'));
}

/* ------------------------------------------------------------------ */
/* Paso 3: Selección de Equipo (ligas + equipos)                      */
/* ------------------------------------------------------------------ */
function teamLogoHtml(team) {
  const inner = team.logo
    ? `<img src="${team.logo}" alt="${team.name}" onerror="window.__teamLogoError(this, '${team.shortName}', '${team.primaryColor}', '${team.secondaryColor || ''}')">`
    : `<span class="st-team-initials">${team.shortName}</span>`;
  return `<span class="st-team-logo" style="background:linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})">${inner}</span>`;
}

function renderLeagueTeams() {
  const listEl = document.getElementById('st-team-list');
  const countEl = document.getElementById('st-team-count');
  const teams = (selectedCountry ? db.getTeamsByCountry(selectedCountry) : [])
    .slice()
    .sort((a, b) => {
      const ra = Math.round(window.PocketManager.getTeamRating(a));
      const rb = Math.round(window.PocketManager.getTeamRating(b));
      return rb - ra || b.ovr - a.ovr || a.name.localeCompare(b.name);
    });
  if (countEl) countEl.textContent = teams.length;
  if (listEl) {
    listEl.innerHTML = teams.map(t => {
      const rating = Math.round(window.PocketManager.getTeamRating(t));
      const rc = window.PocketManager.getRatingColor(rating);
      return `
      <div class="st-team-row${selectedTeamId === t.id ? ' selected' : ''}" data-team-id="${t.id}">
        <span class="st-team-main">
          ${teamLogoHtml(t)}
          <span class="st-team-text">
            <span class="st-team-name">${t.name}</span>
            <span class="st-team-style">${[t.formation || '4-3-3', t.style].filter(Boolean).join(' · ')}</span>
          </span>
        </span>
        <span class="st-team-meta">
          <span class="st-ver-btn" data-ver-team="${t.id}">VER</span>
          <span class="st-count">${t.players.length}</span>
          <span class="st-ovr" style="background:${rc.bg}; color:${rc.color}">${rating}</span>
        </span>
      </div>`;
    }).join('');
  }
}

function updateTeamBox(team) {
  const box = document.getElementById('st-team-box');
  if (!box) return;
  box.classList.add('has-team');
  box.innerHTML = `
    <span class="st-team-box-logo" style="background:linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})">
      ${team.logo
        ? `<img src="${team.logo}" alt="${team.name}" onerror="window.__stBoxLogoError(this, '${team.shortName}')">`
        : team.shortName}
    </span>
    <span class="st-team-box-name">${team.name}</span>`;
}

function resetTeamBox() {
  const box = document.getElementById('st-team-box');
  if (!box) return;
  box.classList.remove('has-team');
  box.innerHTML = '<span class="st-team-placeholder">Sin equipo seleccionado.</span>';
}

function openTeamPreview(team) {
  const modal = document.getElementById('team-preview-modal');
  const list = document.getElementById('team-preview-list');
  const title = document.getElementById('team-preview-title');
  if (title) title.textContent = `${team.name} · Plantilla`;
  if (list) {
    const row = window.PocketManager.playerRowHtml;
    const isLoanedOut = window.PocketManager.isLoanedOut;
    const posRankOf = window.PocketManager.posRankOf;
    const squad = team.players.filter(p => !isLoanedOut(team, p));
    const loans = db.getLoanedOut(team.id).sort((a, b) => posRankOf(a.player) - posRankOf(b.player));

    let html = `<h3 class="squad-section-title">Plantilla<span class="count">${squad.length}</span></h3><div class="squad-group">`;
    html += squad.map(p => row(team, p, false, false, { ced: window.PocketManager.isLoanedIn(team, p) })).join('');
    html += '</div>';

    html += `<h3 class="squad-section-title">Cedidos fuera<span class="count">${loans.length}</span></h3><div class="squad-group">`;
    if (!loans.length) html += '<p class="squad-empty">Sin jugadores cedidos.</p>';
    html += loans.map(({ player: p, destination }) => row(team, p, false, false, { destination })).join('');
    html += '</div>';

    list.innerHTML = html;
  }
  if (modal) modal.classList.add('open');
}

function closeTeamPreview() {
  const modal = document.getElementById('team-preview-modal');
  if (modal) modal.classList.remove('open');
}

function bindSelectTeam() {
  if (selectTeamBound) return;
  selectTeamBound = true;

  const leaguesEl = document.getElementById('st-leagues');
  const listEl = document.getElementById('st-team-list');
  const startBtn = document.getElementById('btn-start-career');

  leaguesEl.addEventListener('click', (e) => {
    const pill = e.target.closest('.st-league-pill');
    if (!pill) return;
    selectedLeague = pill.dataset.leagueId;
    leaguesEl.querySelectorAll('.st-league-pill').forEach(p => p.classList.toggle('active', p === pill));
    selectedTeamId = null;
    startBtn.disabled = true;
    resetTeamBox();
    renderLeagueTeams();
  });

  listEl.addEventListener('click', (e) => {
    const verBtn = e.target.closest('.st-ver-btn');
    if (verBtn) {
      e.stopPropagation();
      const team = db.getTeamById(verBtn.dataset.verTeam);
      if (team) openTeamPreview(team);
      return;
    }

    const row = e.target.closest('.st-team-row');
    if (!row) return;
    listEl.querySelectorAll('.st-team-row.selected').forEach(r => r.classList.remove('selected'));
    row.classList.add('selected');
    selectedTeamId = row.dataset.teamId;
    const team = db.getTeamById(selectedTeamId);
    if (team) updateTeamBox(team);
    startBtn.disabled = false;
  });

  document.getElementById('btn-back-select').addEventListener('click', () => nav('screen-select-league'));
  document.getElementById('btn-back-select-top').addEventListener('click', () => nav('screen-select-league'));

  startBtn.addEventListener('click', () => {
    if (!selectedTeamId) return;
    const team = db.getTeamById(selectedTeamId);
    if (!team) return;
    setTeam(team);
    document.dispatchEvent(new CustomEvent('career-started'));
  });

  const closeBtn = document.getElementById('team-preview-close');
  const modal = document.getElementById('team-preview-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeTeamPreview);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeTeamPreview();
  });
}

function renderSelectTeam() {
  const manager = gameState.manager;

  const nameEl = document.getElementById('st-manager-name');
  if (nameEl && manager) nameEl.textContent = `${manager.firstName} ${manager.lastName}`.trim();

  const natEl = document.getElementById('st-manager-nat');
  if (natEl && manager) natEl.textContent = `${flagForCountryName(manager.nationality)} ${manager.nationality}`;

  resetTeamBox();

  const leaguesEl = document.getElementById('st-leagues');
  const competitions = selectedCountry ? db.getCompetitions(selectedCountry) : [];
  if (!selectedLeague && competitions.length) selectedLeague = competitions[0].id;
  leaguesEl.innerHTML = competitions.map(c => `
    <button class="st-league-pill${selectedLeague === c.id ? ' active' : ''}" data-league-id="${c.id}">${c.name}</button>`).join('');

  renderLeagueTeams();

  const startBtn = document.getElementById('btn-start-career');
  if (startBtn) startBtn.disabled = !selectedTeamId;
}

function initNewGame() {
  bindCreateForm();
  bindSelectLeague();
  bindSelectTeam();
}

  window.PocketManager.initNewGame = initNewGame;
  window.PocketManager.resetCreateForm = resetCreateForm;
  window.PocketManager.renderSelectLeague = renderSelectLeague;
  window.PocketManager.renderSelectTeam = renderSelectTeam;
  window.PocketManager.formatBudget = formatBudget;
})();
