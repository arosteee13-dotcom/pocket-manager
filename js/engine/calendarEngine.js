(function () {
  // Motor de calendario: fachada sobre gameState.seasons (la fuente de resultados).
  // Modelo semanal multicompetencia:
  //   - 39 semanas, 2 franjas: slot1 = Miércoles (entre semana), slot2 = Domingo (fin de semana).
  //   - Semana 18 = parón de liga (semana de la Supercopa de España).
  //   - LaLiga: jornada N -> semana weekOfJornada(N), normalmente en slot2.
  //   - Copa del Rey: eliminatorias en slot1; Semifinal Ida/Vuelta en slot1; Final en slot2.
  //   - Supercopa de España: Semifinales en slot1 y Final en slot2 (semana 18).
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;

  const WEEK_BREAK = 18; // parón de liga (Supercopa)
  const SLOT_LABELS = { 1: 'Miércoles', 2: 'Domingo' };
  const SLOT_ORDER = { 1: 1, 2: 2 };

  // Jornada de liga N -> semana de calendario (la semana 18 es parón de liga).
  function weekOfJornada(j) {
    j = Number(j) || 1;
    return j < WEEK_BREAK ? j : j + 1;
  }

  // Semana -> jornada de liga que se juega (0 si es la semana de parón).
  function jornadaOfWeek(w) {
    w = Number(w) || 1;
    if (w === WEEK_BREAK) return 0;
    return w < WEEK_BREAK ? w : w - 1;
  }

  function userLeagueCompId(teamId) {
    const team = db.getTeamById(teamId);
    if (!team) return null;
    const country = db.getCountryData(teamId);
    if (!country) return null;
    const comp = (db.getCompetitions(country.country) || []).find(c => c.type !== 'cup' && c.teams && c.teams.some(t => t.id === teamId));
    return comp ? comp.id : null;
  }

  // Todos los partidos del equipo del usuario, con su (semana, slot, competición, rival…),
  // ordenados cronológicamente por (semana, slot).
  function allUserFixtures(teamId) {
    const out = [];
    const team = db.getTeamById(teamId);
    if (!team) return out;
    const country = db.getCountryData(teamId);
    const leagueId = userLeagueCompId(teamId);
    const leagueSeason = gameState.seasons ? gameState.seasons[leagueId] : null;
    const leagueName = country ? country.leagueName : 'Liga';

    // --- Liga (columna vertebral): jornada N en su semana, normalmente slot2.
    if (leagueSeason && leagueSeason.jornadas) {
      leagueSeason.jornadas.forEach((j, idx) => {
        const m = j.matches.find(x => x.homeId === teamId || x.awayId === teamId);
        if (!m) return;
        const jornada = idx + 1;
        const week = weekOfJornada(jornada);
        // En la semana 32 la Final de la Copa del Rey (España) ocupa el slot2: esa
        // jornada pasa a slot1. En el resto de países la liga se mantiene en slot2.
        const slot = (week === 32 && country && country.country === 'España') ? 1 : 2;
        out.push({
          compId: leagueId,
          compName: leagueName,
          compType: 'league',
          week,
          slot,
          match: m,
          isHome: m.homeId === teamId,
          jornada,
          roundLabel: 'Jornada ' + jornada
        });
      });
    }

    // --- Copas (Copa del Rey, Supercopa y futuras competiciones de copa del país).
    const comps = db.getCompetitions(country ? country.country : '') || [];
    for (const comp of comps) {
      if (comp.type !== 'cup') continue;
      const cup = gameState.seasons ? gameState.seasons[comp.id] : null;
      if (!cup || !cup.rounds) continue;
      for (const round of cup.rounds) {
        for (const m of round.matches) {
          if (m.homeId !== teamId && m.awayId !== teamId) continue;
          out.push({
            compId: comp.id,
            compName: comp.name,
            compType: 'cup',
            week: round.atWeek || 0,
            slot: round.slot || 1,
            match: m,
            isHome: m.homeId === teamId,
            jornada: null,
            roundLabel: round.round
          });
        }
      }
    }

    out.sort((a, b) => (a.week - b.week) || (SLOT_ORDER[a.slot] - SLOT_ORDER[b.slot]));
    return out;
  }

  // El próximo partido sin jugar del equipo (el que toca ahora, de cualquier competición).
  function nextUserFixture(teamId) {
    const list = allUserFixtures(teamId);
    return list.find(f => !f.match.played && !f.match.winnerId) || null;
  }

  // Semana actual: la semana del próximo partido sin jugar (0 si no queda ninguno).
  function currentUserWeek(teamId) {
    const next = nextUserFixture(teamId);
    return next ? next.week : (lastPlayedUserWeek(teamId) + 1);
  }

  // Última semana en la que el equipo ha disputado un partido (liga, copa o supercopa).
  function lastPlayedUserWeek(teamId) {
    const list = allUserFixtures(teamId);
    let max = 0;
    for (const f of list) {
      if (f.match.played && f.week > max) max = f.week;
    }
    return max;
  }

  // Round-robin de una vuelta (Algoritmo de Berger equilibrado). Devuelve array de rondas;
  // cada ronda es un array de { homeId, awayId }. Fija el índice 0 y rota el resto; alterna
  // la localía en cada jornada (home = teams[i] en rondas pares, teams[n-1-i] en impares)
  // para evitar rachas de 3 localías o visitas consecutivas.
  function generateRoundRobin(ids) {
    const teams = [...ids];
    if (teams.length % 2 === 1) teams.push(null); // jornada de descanso
    const rounds = teams.length - 1;
    const half = teams.length / 2;
    const result = [];
    for (let r = 0; r < rounds; r++) {
      const round = [];
      for (let i = 0; i < half; i++) {
        const x = teams[i];
        const y = teams[teams.length - 1 - i];
        if (x == null || y == null) continue;
        if (r % 2 === 0) round.push({ homeId: x, awayId: y });
        else round.push({ homeId: y, awayId: x });
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

  // Total de semanas del calendario según la liga del usuario (42 jornadas Hypermotion -> 43+).
  function totalWeeks(teamId) {
    const leagueId = userLeagueCompId(teamId);
    const se = leagueId ? (gameState.seasons ? gameState.seasons[leagueId] : null) : null;
    if (se && se.jornadas && se.jornadas.length) {
      return weekOfJornada(se.jornadas.length);
    }
    return 39;
  }

  window.PocketManager.calendar = {
    generateRoundRobin,
    buildMatchSummary,
    allUserFixtures,
    nextUserFixture,
    currentUserWeek,
    lastPlayedUserWeek,
    weekOfJornada,
    jornadaOfWeek,
    userLeagueCompId,
    totalWeeks,
    WEEK_BREAK,
    SLOT_LABELS
  };
})();
