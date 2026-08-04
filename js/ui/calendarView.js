(function () {
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const calendar = window.PocketManager.calendar;
  const nationalities = window.PocketManager.nationalities || [];
  const state = { country: null, competitionId: null, jornada: null };
  let bound = false;

  const COUNTRY_FLAG_OVERRIDES = { 'Inglaterra': 'GB-ENG' };

  function flagFromCode(code) {
    if (!code) return '🌍';
    const upper = String(code).toUpperCase();
    if (upper.length === 2) {
      return String.fromCodePoint(...[...upper].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
    }
    const parts = upper.split('-');
    if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 3) {
      const tags = [...(parts[0] + parts[1]).toLowerCase()].map(c => 0xE0000 + c.charCodeAt(0));
      return String.fromCodePoint(0x1F3F4, ...tags, 0xE007F);
    }
    return '🌍';
  }

  function flagForCountry(name) {
    const override = COUNTRY_FLAG_OVERRIDES[name];
    if (override) return flagFromCode(override);
    const found = nationalities.find(n => n.name === name);
    return found ? flagFromCode(found.code) : '🌍';
  }

  function countries() {
    return db.getCountries() || [];
  }

  function competitionsOf(countryName) {
    if (!countryName) return [];
    return db.getCompetitions(countryName) || [];
  }

  function userCountry() {
    if (gameState.team) {
      const c = db.getCountryData(gameState.team.id);
      if (c) return c.country;
    }
    const all = countries();
    return all.length ? all[0].name : null;
  }

  function currentCompetition() {
    return competitionsOf(state.country).find(c => c.id === state.competitionId) ||
      competitionsOf(state.country)[0] || null;
  }

  // Temporada de la competición seleccionada (todas las ligas se simulan en paralelo).
  function currentSeason() {
    const comp = currentCompetition();
    if (comp && comp.teams && comp.teams.length) {
      const saved = gameState.seasons ? gameState.seasons[comp.id] : null;
      return saved || window.PocketManager.season.initSeason(comp.teams[0]);
    }
    return gameState && gameState.season ? gameState.season : null;
  }

  function isUserLeague() {
    const comp = currentCompetition();
    return !!(gameState.team && comp && comp.teams.some(t => t.id === gameState.team.id));
  }

  // Primera jornada sin jugar de una liga (para ligas ajenas).
  function nextJornada(se) {
    if (!se || !se.jornadas) return 1;
    const idx = se.jornadas.findIndex(j => j.matches.some(m => !m.played));
    return idx === -1 ? calendar.totalJornadas(se) : se.jornadas[idx].jornada;
  }

  function badgeHtml(team, cls) {
    return `<span class="${cls}" style="background:linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})">${team.shortName}</span>`;
  }

  function findMatch(jornada, homeId, awayId) {
    const se = currentSeason();
    if (!se || !se.jornadas) return null;
    const j = se.jornadas[Number(jornada) - 1];
    if (!j) return null;
    return j.matches.find(m => m.homeId === homeId && m.awayId === awayId) || null;
  }

  function renderCalendar() {
    const team = gameState.team;
    const root = document.getElementById('calendar-root');
    if (!root) return;

    // País/competición por defecto (antes de calcular la temporada)
    if (!state.country || !competitionsOf(state.country).length) {
      state.country = state.country || userCountry();
    }
    if (!competitionsOf(state.country).some(c => c.id === state.competitionId)) {
      const comps = competitionsOf(state.country);
      state.competitionId = comps.length ? comps[0].id : null;
      state.jornada = null;
    }

    if (!team || !currentSeason()) {
      root.innerHTML = '<p class="calendar-empty">Aún no hay calendario. Empieza una partida.</p>';
      return;
    }

    // Selector de país
    const trigger = document.getElementById('cal-countries-trigger');
    if (trigger) {
      trigger.innerHTML = `
        <span class="nat-flag">${flagForCountry(state.country)}</span>
        <span class="selected-nat">${state.country}</span>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    }
    // Carrusel de competiciones
    const compsEl = document.getElementById('cal-comps');
    if (compsEl) {
      compsEl.innerHTML = competitionsOf(state.country).map(c => `
        <button class="st-comp${c.id === state.competitionId ? ' active' : ''}" data-comp="${c.id}">
          <span class="st-comp-logo">${String(c.name).replace(/[^A-Za-zÁÉÍÓÚÑ]/g, '').slice(0, 3).toUpperCase()}</span>
          <span class="st-comp-name">${c.name}</span>
        </button>`).join('');
    }

    const se = currentSeason();
    const mine = isUserLeague();
    const total = calendar.totalJornadas(se);
    if (!state.jornada || state.jornada < 1 || state.jornada > total) {
      state.jornada = mine ? calendar.nextUserJornada(se, team.id) : 1;
    }
    const j = state.jornada;
    const nextFx = mine ? window.PocketManager.season.nextFixture(se, team.id) : null;

    const label = document.getElementById('calendar-jornada-label');
    if (label) label.textContent = `Jornada ${j} de ${total}`;
    const prevBtn = document.getElementById('calendar-prev');
    const nextBtn = document.getElementById('calendar-next');
    if (prevBtn) prevBtn.disabled = j <= 1;
    if (nextBtn) nextBtn.disabled = j >= total;
    const currentBtn = document.getElementById('calendar-current');
    if (currentBtn) {
      const target = mine
        ? calendar.nextUserJornada(se, team.id)
        : nextJornada(se);
      currentBtn.textContent = mine
        ? `Ir a Jornada Actual (${target})`
        : `Ir a Jornada Actual (${target})`;
      currentBtn.dataset.target = target;
    }

    const matches = calendar.jornadaMatches(se, j);
    root.innerHTML = matches.length
      ? matches.map(m => matchCardHtml(m, team, nextFx, j)).join('')
      : '<p class="calendar-empty">Jornada de descanso.</p>';

    bind();
  }

  function matchCardHtml(m, team, nextFx, jornada) {
    const home = db.getTeamById(m.homeId);
    const away = db.getTeamById(m.awayId);
    const isUser = m.homeId === team.id || m.awayId === team.id;
    const isNext = isUser && !!(nextFx && nextFx.match === m);

    const teams = `
      <span class="mc-team">${badgeHtml(home, 'mc-badge')}<span class="mc-name">${home ? home.shortName : '—'}</span></span>
      <span class="mc-vs">${m.played ? `${m.homeGoals} - ${m.awayGoals}` : 'vs'}</span>
      <span class="mc-team">${badgeHtml(away, 'mc-badge')}<span class="mc-name">${away ? away.shortName : '—'}</span></span>`;

    if (m.played) {
      return `
        <div class="match-card finished${isUser ? ' user' : ''}">
          <div class="mc-teams">${teams}</div>
          <div class="mc-footer">
            <span class="mc-state finished">Finalizado</span>
            <button class="mc-details" data-jornada="${jornada}" data-home="${m.homeId}" data-away="${m.awayId}">Ver detalles</button>
          </div>
        </div>`;
    }
    if (isNext) {
      return `
        <div class="match-card next${isUser ? ' user' : ''}">
          <div class="mc-teams">${teams}</div>
          <div class="mc-footer">
            <span class="mc-state">Tu próximo partido</span>
            <button class="mc-play" data-jornada="${jornada}" data-home="${m.homeId}" data-away="${m.awayId}">JUGAR PARTIDO</button>
          </div>
        </div>`;
    }
    return `
      <div class="match-card pending${isUser ? ' user' : ''}">
        <div class="mc-teams">${teams}</div>
        <div class="mc-footer">
          <span class="mc-state pending">Pendiente</span>
        </div>
      </div>`;
  }

  function openMatchDetails(match) {
    const body = document.getElementById('match-details-body');
    if (!body) return;
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    const sum = match.summary || { goals: [], yellows: [], reds: [] };
    const sideName = (side) => (side === 'home' ? (home ? home.shortName : '—') : (away ? away.shortName : '—'));
    const goals = sum.goals.map(g =>
      `<div class="md-row"><span class="md-row-name">⚽ ${g.name}${g.assist ? ` <span class="md-assist">🅰️ ${g.assist}</span>` : ''}</span><span class="md-row-side">${sideName(g.side)}</span></div>`).join('');
    const yellows = sum.yellows.map(c =>
      `<div class="md-row"><span class="md-row-name">🟨 ${c.name}</span><span class="md-row-side">${sideName(c.side)}</span></div>`).join('');
    const reds = sum.reds.map(c =>
      `<div class="md-row"><span class="md-row-name">🟥 ${c.name}</span><span class="md-row-side">${sideName(c.side)}</span></div>`).join('');

    body.innerHTML = `
      <div class="md-score">${match.homeGoals} - ${match.awayGoals}</div>
      <div class="md-teams"><span>${home ? home.shortName : '—'}</span><span>${away ? away.shortName : '—'}</span></div>
      <div class="md-section-title">Goles</div>
      ${goals || '<p class="md-none">Sin goles.</p>'}
      <div class="md-section-title">Tarjetas</div>
      ${(yellows + reds) || '<p class="md-none">Sin tarjetas.</p>'}`;

    const modal = document.getElementById('match-details-modal');
    if (modal) modal.classList.add('open');
  }

  // Abre la pantalla de calendario posicionándose en `jornada` (tu liga)
  function openCalendarAt(jornada) {
    state.jornada = Number(jornada) || state.jornada;
    document.dispatchEvent(new CustomEvent('nav', { detail: 'screen-calendar' }));
  }

  function renderCountryList(q) {
    const list = document.getElementById('calendar-country-list');
    if (!list) return;
    const nq = String(q || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const items = countries()
      .filter(c => !nq || String(c.name).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(nq))
      .map(c => `
        <button class="nat-option${c.name === state.country ? ' selected' : ''}" data-country="${c.name}">
          <span class="nat-flag">${flagForCountry(c.name)}</span>
          <span class="nat-name">${c.name}</span>
          ${c.name === state.country ? '<span class="nat-check">✓</span>' : ''}
        </button>`)
      .join('');
    list.innerHTML = items || '<p class="nat-empty">Sin resultados</p>';
  }

  function bind() {
    if (bound) return;
    bound = true;

    // Selector de país
    const calTrigger = document.getElementById('cal-countries-trigger');
    const calModal = document.getElementById('calendar-country-modal');
    const calSearch = document.getElementById('calendar-country-search');
    const calList = document.getElementById('calendar-country-list');
    if (calTrigger) {
      calTrigger.addEventListener('click', () => {
        calSearch.value = '';
        renderCountryList('');
        calModal.classList.add('open');
        calSearch.focus();
      });
    }
    document.getElementById('calendar-country-close').addEventListener('click', () => calModal.classList.remove('open'));
    calModal.addEventListener('click', (e) => { if (e.target === calModal) calModal.classList.remove('open'); });
    calSearch.addEventListener('input', () => renderCountryList(calSearch.value));
    calList.addEventListener('click', (e) => {
      const opt = e.target.closest('.nat-option');
      if (!opt) return;
      state.country = opt.dataset.country;
      state.competitionId = null;
      state.jornada = null;
      calModal.classList.remove('open');
      renderCalendar();
    });

    // Carrusel de competiciones
    const compsEl = document.getElementById('cal-comps');
    compsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.st-comp');
      if (!btn) return;
      state.competitionId = btn.dataset.comp;
      state.jornada = null;
      renderCalendar();
    });

    // Navegación de jornadas
    const prevBtn = document.getElementById('calendar-prev');
    const nextBtn = document.getElementById('calendar-next');
    const currentBtn = document.getElementById('calendar-current');
    if (prevBtn) prevBtn.addEventListener('click', () => { state.jornada = Math.max(1, state.jornada - 1); renderCalendar(); });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const total = calendar.totalJornadas(currentSeason());
      state.jornada = Math.min(total, state.jornada + 1);
      renderCalendar();
    });
    if (currentBtn) currentBtn.addEventListener('click', () => {
      const t = currentBtn.dataset.target ? Number(currentBtn.dataset.target) : 0;
      state.jornada = t || 1;
      renderCalendar();
    });

    // Lista de partidos
    const root = document.getElementById('calendar-root');
    if (root) {
      root.addEventListener('click', (e) => {
        const playBtn = e.target.closest('.mc-play');
        if (playBtn) {
          const m = findMatch(playBtn.dataset.jornada, playBtn.dataset.home, playBtn.dataset.away);
          if (m) {
            document.dispatchEvent(new CustomEvent('start-match', { detail: { match: m, jornada: Number(playBtn.dataset.jornada) } }));
          }
          return;
        }
        const detailsBtn = e.target.closest('.mc-details');
        if (detailsBtn) {
          const m = findMatch(detailsBtn.dataset.jornada, detailsBtn.dataset.home, detailsBtn.dataset.away);
          if (m) openMatchDetails(m);
        }
      });
    }

    const modal = document.getElementById('match-details-modal');
    if (modal) {
      document.getElementById('match-details-close').addEventListener('click', () => modal.classList.remove('open'));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }
  }

  window.PocketManager.renderCalendar = renderCalendar;
  window.PocketManager.openCalendarAt = openCalendarAt;
})();
