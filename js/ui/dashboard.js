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
    if (!list.length) return '<span class="dash-form-empty">Sin partidos disputados</span>';
    const map = { W: ['dash-form-w', 'V'], E: ['dash-form-d', 'E'], L: ['dash-form-l', 'D'] };
    return list.map(r => {
      const [cls, label] = map[r] || ['dash-form-w', 'V'];
      return `<span class="dash-form-dot ${cls}">${label}</span>`;
    }).join('');
  }

  function newsFor(team) {
    const form = season.formOf(gameState.season, team.id);
    if (form.length && form[form.length - 1] === 'W') return '🎉 ¡Gran victoria! La plantilla está en racha de cara al próximo encuentro.';
    if (form.length && form[form.length - 1] === 'L') return '📉 Derrota en el último partido. El cuerpo técnico trabaja para recuperar sensaciones.';
    return '📋 Plantilla lista para el próximo encuentro.';
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

    const fx = season.nextFixture(se, team.id);
    if (!fx) {
      root.innerHTML = '<p class="dash-empty">Temporada completada. ¡Enhorabuena!</p>';
      return;
    }

    const country = db.getCountryData(team.id);
    const leagueName = country ? country.leagueName : 'Liga';
    const rivalId = fx.match.homeId === team.id ? fx.match.awayId : fx.match.homeId;
    const rival = db.getTeamById(rivalId);
    const localVisitante = fx.isHome ? 'Local' : 'Visitante';

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
            <span class="dash-next-name">${team.shortName}</span>
            <span class="dash-next-name">${rival ? rival.shortName : '—'}</span>
          </div>
          <div class="dash-next-meta">
            <span class="dash-pill">${leagueName}</span>
            <span class="dash-pill">Jornada ${fx.jornada}</span>
            <span class="dash-pill ${fx.isHome ? 'dash-pill-home' : 'dash-pill-away'}">${localVisitante}</span>
          </div>
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
                return `<div class="dash-strow${isUser ? ' user' : ''}">
                  <span class="dash-stpos">${season.positionOf(se, s.teamId)}</span>
                  ${badgeHtml(t, 'dash-stbadge')}
                  <span class="dash-stname">${t ? t.shortName : '—'}</span>
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

    if (!bound) {
      bound = true;
      root.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const team = gameState.team;
        const se = gameState.season;
        if (!team || !se) return;
        const f = season.nextFixture(se, team.id);
        if (!f) return;
        if (btn.dataset.action === 'play') {
          document.dispatchEvent(new CustomEvent('start-match', { detail: { match: f.match, jornada: f.jornada } }));
        } else if (btn.dataset.action === 'sim') {
          document.dispatchEvent(new CustomEvent('simulate-match', { detail: { match: f.match, jornada: f.jornada } }));
        }
      });
    }
  }

  window.PocketManager.renderDashboard = renderDashboard;
})();
