(function () {
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const season = window.PocketManager.season;
  const formatBudget = window.PocketManager.formatBudget;
  let bound = false;

  function badgeHtml(team, cls) {
    return `<span class="${cls}" style="background:linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})">${team.shortName}</span>`;
  }

  function formDots(list) {
    const map = { W: ['dash-form-w', 'V'], E: ['dash-form-d', 'E'], L: ['dash-form-l', 'D'] };
    if (!list.length) return '<span class="dash-form-empty">Sin partidos disputados</span>';
    const last5 = list.slice(-5);
    const chips = last5.map(r => {
      const [cls, label] = map[r] || ['dash-form-w', 'V'];
      return `<span class="dash-form-chip ${cls}">[${label}]</span>`;
    });
    while (chips.length < 5) chips.unshift('<span class="dash-form-slot">[·]</span>');
    return chips.join('');
  }

  function newsFor(team) {
    const form = season.formOf(gameState.season, team.id);
    if (form.length && form[form.length - 1] === 'W') return '🎉 ¡Gran victoria! La plantilla está en racha de cara al próximo encuentro.';
    if (form.length && form[form.length - 1] === 'L') return '📉 Derrota en el último partido. El cuerpo técnico trabaja para recuperar sensaciones.';
    return '📋 Plantilla lista para el próximo encuentro.';
  }

  function compLabel(f) {
    if (f.compType === 'league') return 'Liga';
    if (f.compId === 'copa_del_rey') return 'Copa del Rey';
    if (f.compId === 'supercopa_de_espana') return 'Supercopa';
    if (f.compId === 'coppa_italia') return 'Coppa Italia';
    if (f.compId === 'supercoppa_italiana') return 'Supercoppa';
    return f.compName;
  }

  function compCls(f) {
    if (f.compType === 'league') return 'dash-comp-liga';
    if (f.compId === 'copa_del_rey') return 'dash-comp-copa';
    if (f.compId === 'coppa_italia') return 'dash-comp-copa';
    return 'dash-comp-super';
  }

  function renderDashboard() {
    const root = document.getElementById('dashboard-root');
    if (!root) return;

    const team = gameState.team;
    if (!team) {
      root.innerHTML = '<p class="dash-empty">No hay equipo activo.</p>';
      return;
    }

    if (!gameState.season) gameState.season = season.initSeason(team);
    const se = gameState.season;
    const calendar = window.PocketManager.calendar;

    // El próximo partido real: liga, Copa del Rey, Supercopa… lo que toque.
    const next = calendar && calendar.nextUserFixture ? calendar.nextUserFixture(team.id) : null;
    const seasonEnded = !!gameState._seasonEnded;
    if (!next && !seasonEnded) {
      root.innerHTML = '<p class="dash-empty">Temporada completada. ¡Enhorabuena!</p>';
      return;
    }

    if (seasonEnded) {
      root.innerHTML = `
        <div class="dash">
          <div class="dash-season-end">
            <span class="dash-season-end-title">🏆 Temporada ${(gameState.currentSeason || 1)} finalizada</span>
            <p class="dash-season-end-sub">Revisa las clasificaciones finales y las plantillas (los cambios de media aparecen junto a cada jugador). Cuando estés listo, comienza la nueva temporada.</p>
            <button class="dash-play-btn" data-action="next-season">SIGUIENTE TEMPORADA</button>
          </div>
        </div>`;
      return;
    }

    const rival = db.getTeamById(next.match.homeId === team.id ? next.match.awayId : next.match.homeId);
    const localVisitante = next.isHome ? 'Local' : 'Visitante';
    const slotLabel = calendar && calendar.SLOT_LABELS ? (calendar.SLOT_LABELS[next.slot] || '') : '';

    const standings = season.sortedStandings(se);
    const pos = season.positionOf(se, team.id);
    const start = Math.max(0, pos - 3);
    const mini = standings.slice(start, pos + 2);

    root.innerHTML = `
      <div class="dash">
        <!-- Próximo partido -->
        <div class="dash-next">
          <span class="dash-next-label">PRÓXIMO PARTIDO</span>
          <div class="dash-next-row">
            ${badgeHtml(team, 'dash-badge')}
            <span class="dash-vs">VS</span>
            ${rival ? badgeHtml(rival, 'dash-badge dash-badge-away') : ''}
          </div>
          <div class="dash-next-names">
            <span class="dash-next-name">${team.name}</span>
            <span class="dash-next-name">${rival ? rival.name : '—'}</span>
          </div>
          <div class="dash-next-meta">
            <span class="dash-pill ${compCls(next)}">${compLabel(next)}</span>
            <button class="dash-pill dash-pill-link" data-action="calendar">Semana ${next.week} · Slot ${next.slot} (${slotLabel})</button>
            <span class="dash-pill ${next.isHome ? 'dash-pill-home' : 'dash-pill-away'}">${localVisitante}</span>
          </div>
          <span class="dash-cal-link" data-action="calendar">Ver Calendario ➔</span>
          <div class="dash-next-actions">
            <button class="dash-play-btn" data-action="play">JUGAR PARTIDO</button>
            <button class="dash-sim-btn" data-action="sim">SIMULAR</button>
          </div>
        </div>

        <!-- Widgets -->
        <div class="dash-widgets">
          <div class="dash-widget">
            <span class="dash-widget-title">Clasificación · Posición ${pos}</span>
            <div class="dash-standings">
              ${mini.map(s => {
                const t = db.getTeamById(s.teamId);
                const isUser = s.teamId === team.id;
                return `<div class="dash-strow${isUser ? ' user' : ''}" data-team-id="${s.teamId}">
                  <span class="dash-stpos">${season.positionOf(se, s.teamId)}</span>
                  ${badgeHtml(t, 'dash-stbadge')}
                  <span class="dash-stname">${t ? t.name : '—'}</span>
                  <span class="dash-stpts">${s.pts}</span>
                </div>`;
              }).join('')}
            </div>
          </div>

          <div class="dash-widget">
            <span class="dash-widget-title">Estado de forma</span>
            <div class="dash-form">${formDots(season.formOf(se, team.id))}</div>
          </div>

          <div class="dash-widget dash-news">
            <span class="dash-widget-title">Aviso del club</span>
            <p>${newsFor(team)}</p>
          </div>
        </div>
      </div>`;

    if (window.PocketManager.updateInboxBadge) window.PocketManager.updateInboxBadge();

    if (!bound) {
      bound = true;
      root.addEventListener('click', (e) => {
        const teamEl = e.target.closest('[data-team-id]');
        if (teamEl && window.PocketManager.openTeamView) {
          window.PocketManager.openTeamView(teamEl.dataset.teamId);
          return;
        }
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const team = gameState.team;
        if (!team) return;
        const calendar = window.PocketManager.calendar;
        const next = calendar && calendar.nextUserFixture ? calendar.nextUserFixture(team.id) : null;
        if (btn.dataset.action === 'play' || btn.dataset.action === 'sim') {
          if (next) {
            const ev = btn.dataset.action === 'play' ? 'start-match' : 'simulate-match';
            document.dispatchEvent(new CustomEvent(ev, {
              detail: { match: next.match, week: next.week, compId: next.compId, jornada: next.jornada }
            }));
          }
          return;
        }
        if (btn.dataset.action === 'next-season') {
          if (window.PocketManager.startNextSeason) {
            window.PocketManager.startNextSeason();
          }
          return;
        }
        if (btn.dataset.action === 'calendar') {
          if (window.PocketManager.openCalendarAt && next) window.PocketManager.openCalendarAt(next.week);
        }
      });
    }
  }

  window.PocketManager.renderDashboard = renderDashboard;
})();
