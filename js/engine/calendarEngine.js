(function () {
  // Motor de calendario: fachada sobre gameState.season (la fuente de resultados),
  // con utilidades para la vista y construcción de resúmenes de partido.
  const db = window.PocketManager.db;

  // Round-robin de una vuelta (mismo algoritmo que season.initSeason).
  // Devuelve array de rondas; cada ronda es un array de { homeId, awayId }.
  function generateRoundRobin(ids) {
    const teams = [...ids];
    if (teams.length % 2 === 1) teams.push(null); // jornada de descanso
    const rounds = teams.length - 1;
    const half = teams.length / 2;
    const result = [];
    for (let r = 0; r < rounds; r++) {
      const round = [];
      for (let i = 0; i < half; i++) {
        const home = teams[i];
        const away = teams[teams.length - 1 - i];
        if (home && away) round.push({ homeId: home, awayId: away });
      }
      result.push(round);
      const last = teams[teams.length - 1];
      for (let i = teams.length - 1; i > 1; i--) teams[i] = teams[i - 1];
      teams[1] = last;
    }
    return result;
  }

  // Resumen de un partido a partir de los eventos de MatchSim:
  // { goals: [{side,name,assist}], yellows: [{side,name}], reds: [{side,name}] }
  function buildMatchSummary(events) {
    const summary = { goals: [], yellows: [], reds: [] };
    if (!events || !events.length) return summary;
    for (let i = 0; i < events.length; i++) {
      const ev = events[i];
      if (!ev || !ev.player) continue;
      const side = ev.team === 'home' ? 'home' : 'away';
      if (ev.type === 'goal') {
        let assist = null;
        if (i > 0 && events[i - 1] && events[i - 1].type === 'assist' && events[i - 1].player) {
          assist = events[i - 1].player.name;
        }
        summary.goals.push({ side, name: ev.player.name, assist });
      } else if (ev.type === 'yellow') {
        summary.yellows.push({ side, name: ev.player.name });
      } else if (ev.type === 'red') {
        summary.reds.push({ side, name: ev.player.name });
      }
    }
    return summary;
  }

  function totalJornadas(season) {
    return season && season.jornadas ? season.jornadas.length : 0;
  }

  function jornadaMatches(season, jornada) {
    if (!season || !season.jornadas) return [];
    const j = season.jornadas[Number(jornada) - 1];
    return j ? j.matches : [];
  }

  function userJornadaMatch(season, jornada, teamId) {
    return jornadaMatches(season, jornada).find(m => m.homeId === teamId || m.awayId === teamId) || null;
  }

  // Próxima jornada sin jugar del equipo (1 si no hay temporada)
  function nextUserJornada(season, teamId) {
    if (!window.PocketManager.season || !season) return 1;
    const fx = window.PocketManager.season.nextFixture(season, teamId);
    return fx ? fx.jornada : totalJornadas(season);
  }

  window.PocketManager.calendar = {
    generateRoundRobin,
    buildMatchSummary,
    totalJornadas,
    jornadaMatches,
    userJornadaMatch,
    nextUserJornada
  };
})();
