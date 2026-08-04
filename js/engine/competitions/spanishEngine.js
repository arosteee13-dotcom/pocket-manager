(function () {
  // Motor de las competiciones de España (LaLiga Hypermotion y ascensos/descensos).
  // Playoffs de Ascenso tras la Jornada 42:
  //   - Semifinales (Ida y Vuelta): 3º vs 6º y 4º vs 5º.
  //   - Final (Ida y Vuelta): ganadores de las semifinales.
  //   - Empate global en la eliminatoria -> avanza el mejor clasificado en la fase regular
  //     (sin tanda de penaltis).
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;

  const HYPERMOTION_COMP = 'españa_laliga_hypermotion_league';
  const LALIGA_COMP = 'españa_league';
  const REGULAR_JORNADAS = 42;

  function isHypermotion(compId) {
    return String(compId || '').indexOf('hypermotion') !== -1;
  }

  function isSpanishLeague(compId) {
    return /^espa/i.test(String(compId || ''));
  }

  function simpleSim(home, away) {
    const h = home ? Number(home.ovr || 0) : 50;
    const a = away ? Number(away.ovr || 0) : 50;
    const total = h + a;
    let hg = 0, ag = 0;
    for (let i = 0; i < 90; i++) {
      if (Math.random() < 0.018 * (h / total)) hg++;
      if (Math.random() < 0.018 * (a / total)) ag++;
    }
    return { homeGoals: hg, awayGoals: ag, events: [], homeTeam: home, awayTeam: away, minutesPlayed: null };
  }

  function simulate(home, away) {
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away);
    }
    return simpleSim(home, away);
  }

  function applyResult(se, m) {
    if (m.played) return;
    const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
    if (!home || !away) return;
    const res = simulate(home, away);
    window.PocketManager.season.applyMatchResult(se, m, res.homeGoals, res.awayGoals);
  }

  function makeMatch(h, a) {
    return { homeId: h, awayId: a, homeGoals: null, awayGoals: null, played: false, playoff: true };
  }

  // ---------- Playoffs de Ascenso ----------

  // Crea los partidos de playoff (SF Ida/Vuelta) tras completar las 42 jornadas.
  function buildPlayoffs(se) {
    if (se.playoff || !se.jornadas) return;
    const list = window.PocketManager.season.sortedStandings(se);
    const at = (i) => (list[i] ? list[i].teamId : null);
    const p3 = at(2), p4 = at(3), p5 = at(4), p6 = at(5);
    if (!p3 || !p4 || !p5 || !p6) return;

    const sf = [
      { a: p3, seedA: 3, b: p6, seedB: 6, winner: null },
      { a: p4, seedA: 4, b: p5, seedB: 5, winner: null }
    ];
    se.playoff = { sf, final: null, promotedId: null };
    se.jornadas.push({ jornada: 43, matches: [makeMatch(p3, p6), makeMatch(p4, p5)] });
    se.jornadas.push({ jornada: 44, matches: [makeMatch(p6, p3), makeMatch(p5, p4)] });
  }

  function legsOf(se, tie) {
    const out = [];
    for (const j of se.jornadas) {
      if (j.jornada < 43) continue;
      for (const m of j.matches) {
        if ((m.homeId === tie.a && m.awayId === tie.b) || (m.homeId === tie.b && m.awayId === tie.a)) out.push(m);
      }
    }
    return out;
  }

  // Agregado; si hay empate global avanza el mejor clasificado (menor posición) sin penaltis.
  function winnerByAggregate(legs, seedA, seedB, a, b) {
    const aggA = legs[0].homeGoals + legs[1].awayGoals;
    const aggB = legs[0].awayGoals + legs[1].homeGoals;
    if (aggA !== aggB) return aggA > aggB ? a : b;
    return seedA < seedB ? a : b; // mejor clasificado en la fase regular
  }

  function resolvePlayoffs(se) {
    const p = se.playoff;
    if (!p) return;

    // Semifinales
    for (const t of p.sf) {
      if (t.winner) continue;
      const legs = legsOf(se, t);
      if (legs.length === 2 && legs.every(m => m.played)) {
        t.winner = winnerByAggregate(legs, t.seedA, t.seedB, t.a, t.b);
      }
    }

    // Construir la Final cuando ambas semifinales están resueltas.
    if (!p.final && p.sf.every(t => t.winner)) {
      const [s1, s2] = p.sf;
      p.final = { a: s1.winner, seedA: s1.winner === s1.a ? s1.seedA : s1.seedB, b: s2.winner, seedB: s2.winner === s2.a ? s2.seedA : s2.seedB, winner: null };
      se.jornadas.push({ jornada: 45, matches: [makeMatch(p.final.a, p.final.b)] });
      se.jornadas.push({ jornada: 46, matches: [makeMatch(p.final.b, p.final.a)] });
    }

    // Final
    if (p.final && !p.final.winner) {
      const legs = legsOf(se, p.final);
      if (legs.length === 2 && legs.every(m => m.played)) {
        p.final.winner = winnerByAggregate(legs, p.final.seedA, p.final.seedB, p.final.a, p.final.b);
        p.promotedId = p.final.winner; // 3ª plaza de ascenso
      }
    }
  }

  // Avanza la lógica de playoff tras un resultado (idempotente).
  function advance(se, compId) {
    if (!isHypermotion(compId) || !se || !se.jornadas) return;
    const regular = se.jornadas.filter(j => j.jornada <= REGULAR_JORNADAS);
    if (regular.length && regular.every(j => j.matches.every(m => m.played))) {
      buildPlayoffs(se);
      resolvePlayoffs(se);
    }
  }

  function playoffWinner(se) {
    return (se && se.playoff) ? (se.playoff.promotedId || null) : null;
  }

  // ---------- Fin de temporada: completar ligas ----------

  // Simula los partidos pendientes de una liga (para el fast-forward en el cierre global).
  function finishLeague(se, compId) {
    if (!se || !se.jornadas) return;
    buildPlayoffs(se); // crea los playoff si aún no existen (idempotente)
    for (const j of se.jornadas) {
      for (const m of j.matches) if (!m.played) applyResult(se, m);
    }
    if (isHypermotion(compId)) resolvePlayoffs(se);
  }

  // ---------- Ascensos y descensos ----------

  function moveTeam(fromArr, toArr, team) {
    const i = fromArr.indexOf(team);
    if (i !== -1) fromArr.splice(i, 1);
    if (toArr.indexOf(team) === -1) toArr.push(team);
  }

  // Al cierre global de temporada: completa ambas ligas españolas, calcula ascensos/descensos,
  // intercambia los equipos entre LaLiga, Hypermotion y Primera RFEF, y reinicia las temporadas.
  function seasonEnd() {
    const seLaLiga = gameState.seasons[LALIGA_COMP];
    const seHyper = gameState.seasons[HYPERMOTION_COMP];
    if (!seLaLiga || !seHyper) return;

    finishLeague(seLaLiga, LALIGA_COMP);
    finishLeague(seHyper, HYPERMOTION_COMP);

    const laligaList = window.PocketManager.season.sortedStandings(seLaLiga);
    const hyperList = window.PocketManager.season.sortedStandings(seHyper);
    if (laligaList.length < 20 || hyperList.length < 22) return;

    // Ascensos a LaLiga: 1º, 2º + ganador del playoff.
    const promoted = [hyperList[0].teamId, hyperList[1].teamId];
    const pw = playoffWinner(seHyper);
    if (pw) promoted.push(pw);
    // Descensos de LaLiga: últimos 3 (puestos 18-20).
    const relLaLiga = laligaList.slice(17).map(s => s.teamId);
    // Descensos de Hypermotion: últimos 4 (puestos 19-22) a Primera RFEF.
    const relHyper = hyperList.slice(18).map(s => s.teamId);
    // Ascensos desde Primera RFEF: 4 mejores por media.
    const tercera = db.divisionTeams.filter(t => t.division === '1rfef');
    const prom3rd = tercera.slice().sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id))).slice(0, 4).map(t => t.id);

    const spainCountry = db.countries.find(c => c.country === 'España');
    const hyperCountry = db.leagues.find(l => l.country === 'España');
    if (!spainCountry || !hyperCountry) return;
    const laligaArr = spainCountry.teams;
    const hyperArr = hyperCountry.teams;
    const terceraArr = db.divisionTeams;

    const byId = (arr, id) => arr.find(t => t.id === id) || null;

    // Hypermotion -> LaLiga (ascendidos)
    for (const id of promoted) {
      const t = byId(hyperArr, id);
      if (!t) continue;
      moveTeam(hyperArr, laligaArr, t);
      t.division = null; // Primera División
    }
    // LaLiga -> Hypermotion (descendidos)
    for (const id of relLaLiga) {
      const t = byId(laligaArr, id);
      if (!t) continue;
      moveTeam(laligaArr, hyperArr, t);
      t.division = 'segunda';
    }
    // Hypermotion -> Primera RFEF (descendidos)
    for (const id of relHyper) {
      const t = byId(hyperArr, id);
      if (!t) continue;
      moveTeam(hyperArr, terceraArr, t);
      t.division = '1rfef';
    }
    // Primera RFEF -> Hypermotion (ascendidos)
    for (const id of prom3rd) {
      const t = byId(terceraArr, id);
      if (!t) continue;
      moveTeam(terceraArr, hyperArr, t);
      t.division = 'segunda';
    }

    // Reasignar dorsales y limpiar estado de la plantilla de los equipos afectados.
    if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.assignAutomaticNumbers) {
      try { for (const t of [...laligaArr, ...hyperArr]) window.PocketManager.squadEngine.assignAutomaticNumbers(t); } catch (e) {}
    }
    if (window.PocketManager.staminaEngine && window.PocketManager.staminaEngine.resetFitness) {
      try { for (const t of [...laligaArr, ...hyperArr]) window.PocketManager.staminaEngine.resetFitness(t); } catch (e) {}
    }

    // Reiniciar ambas temporadas españolas para la nueva temporada.
    const season = window.PocketManager.season;
    gameState.seasons[LALIGA_COMP] = season.initSeason(laligaArr[0], LALIGA_COMP);
    gameState.seasons[HYPERMOTION_COMP] = season.initSeason(hyperArr[0], HYPERMOTION_COMP);
    // Si la liga del usuario es una de estas, apuntar gameState.season a la nueva.
    const userCompId = window.PocketManager.calendar && window.PocketManager.calendar.userLeagueCompId
      ? window.PocketManager.calendar.userLeagueCompId(gameState.team.id)
      : null;
    if (userCompId === LALIGA_COMP || userCompId === HYPERMOTION_COMP) {
      gameState.season = gameState.seasons[userCompId];
    }
  }

  window.PocketManager.spanishEngine = {
    isHypermotion,
    isSpanishLeague,
    advance,
    buildPlayoffs,
    resolvePlayoffs,
    playoffWinner,
    finishLeague,
    seasonEnd,
    HYPERMOTION_COMP,
    LALIGA_COMP
  };
})();
