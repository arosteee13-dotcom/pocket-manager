(function () {
  // Motor de las competiciones de Italia: Serie A (liga jugable de 20 equipos), la
  // Coppa Italia (formato oficial adaptado a 40 equipos) y la Supercoppa Italiana
  // (Final Four, campeón/subcampeón de Serie A + campeón/subcampeón de Coppa).
  //
  // Serie A: 38 jornadas (todos contra todos a doble vuelta). Al cierre de temporada,
  // los puestos 18º-20º descienden a la Serie B y los 3 mejores de la Serie B (por ovr,
  // la Serie B no se simula como liga) ascienden.
  //
  // Coppa Italia (40 equipos = 20 Serie A + 20 Serie B; sin Serie C en el juego):
  //   - Los 8 cabezas de serie (top-8 de la temporada anterior) entran en Octavos (1/8).
  //   - 1ª Ronda (1/32)@4: los otros 32 (9º-20º de Serie A + 20 de Serie B), partido único.
  //   - 2ª Ronda (1/16)@8 · Octavos (1/8)@16 (ganadores + 8 cabezas) · Cuartos (1/4)@22.
  //   - Semifinales ida@29 / vuelta@33 (agregado → gol visitante → penaltis).
  //   - Final@36 a partido único en el Stadio Olimpico de Roma.
  //
  // Supercoppa Italiana (Final Four, enero): semifinales@19 y final@20 (slot1).
  //   - SF1: Campeón de Serie A vs Subcampeón de Coppa. SF2: Campeón de Coppa vs
  //     Subcampeón de Serie A. Duplicados → 3º/4º de Serie A. Final a partido único;
  //     empate a 90' → penaltis directos (sin prórroga).
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const cupEngine = window.PocketManager.cupEngine;
  const ITALIA_COMP = 'italia_league';
  const COPPA_ITALIA = 'coppa_italia';
  const SUPERCOPPA = 'supercoppa_italiana';
  const TROPHY_COPPA = 'Coppa Italia';
  const TROPHY_SUPER = 'Supercoppa Italiana';

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function simpleSim(home, away) {
    const h = home ? Number(home.ovr || 50) : 50;
    const a = away ? Number(away.ovr || 50) : 50;
    const t = h + a;
    let hg = 0, ag = 0;
    for (let i = 0; i < 90; i++) {
      if (Math.random() < 0.018 * (h / t)) hg++;
      if (Math.random() < 0.018 * (a / t)) ag++;
    }
    return { homeGoals: hg, awayGoals: ag, events: [] };
  }

  function leagueSim(home, away) {
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away);
    }
    return simpleSim(home, away);
  }

  function simulate(home, away) {
    // Las copas auto-simuladas no registran stats de jugador.
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away, { recordStats: false });
    }
    return simpleSim(home, away);
  }

  function applyLeagueResult(se, m) {
    if (m.played) return;
    const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
    if (!home || !away) return;
    const res = leagueSim(home, away);
    window.PocketManager.season.applyMatchResult(se, m, res.homeGoals, res.awayGoals);
  }

  // Simula los partidos pendientes de la Serie A (para el cierre global).
  function finishItalyLeague(se) {
    if (!se || !se.jornadas) return;
    for (const j of se.jornadas) {
      for (const m of j.matches) if (!m.played) applyLeagueResult(se, m);
    }
  }

  // =====================================================================
  // COPPA ITALIA
  // =====================================================================
  // Ronda 0 = Turno Preliminar (1/64). El resto se construye sobre la marcha.
  const COPPA_PLAN = [
    { name: '1/64', target: 4, atWeek: 2, slot: 1, prelim: true },
    { name: '1/32', target: 16, atWeek: 4, slot: 1, rest: true },
    { name: '1/16', target: 8, atWeek: 8, slot: 1 },
    { name: '1/8', target: 8, atWeek: 16, slot: 1, heads: true },
    { name: 'Cuartos de final', target: 4, atWeek: 22, slot: 1 },
    { name: 'Semifinal Ida', sf: true, atWeek: 29, slot: 1 },
    { name: 'Semifinal Vuelta', sf: true, atWeek: 33, slot: 1 },
    { name: 'Final', target: 1, atWeek: 36, slot: 1, neutral: 'Stadio Olimpico' }
  ];

  // Cabezas de serie: top-8 de la temporada anterior (persistido) o por ovr en la 1ª.
  function cupHeads() {
    const serieA = db.getTeamsByCountry('Italia');
    if (gameState.italyCupHeads && Array.isArray(gameState.italyCupHeads)) {
      const valid = gameState.italyCupHeads.filter(id => serieA.some(t => t.id === id));
      if (valid.length >= 8) return valid.slice(0, 8);
    }
    return serieA.slice()
      .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)))
      .slice(0, 8)
      .map(t => t.id);
  }

  // Construye una ronda de partido único (misma mecánica que cupEngine.buildRound).
  function coppaBuildRound(cup, roundName, alive, numByes, atWeek, slot) {
    const rng = cupEngine.mulberry32(hashStr(cup.id + ':' + cup.season + ':' + roundName));
    const sorted = cupEngine.seededSorted(alive);
    const byes = numByes > 0 ? sorted.slice(0, numByes) : [];
    const playing = cupEngine.shuffle(sorted.slice(numByes), rng);
    const matches = [];
    for (let i = 0; i < playing.length; i += 2) {
      matches.push(cupEngine.makeMatch(playing[i], playing[i + 1]));
    }
    const round = { round: roundName, atWeek, slot, semis: false, byes, matches, completed: false };
    cup.rounds.push(round);
    cupEngine.syncJornadas(cup);
    return round;
  }

  function buildCoppaItalia(opts) {
    opts = opts || {};
    const season = opts.season || 1;
    const serieA = db.getTeamsByCountry('Italia');
    const serieB = db.divisionTeams.filter(t => t.division === 'serie_b');
    if (serieA.length < 8) return null;
    const heads = cupHeads();
    // Los 8 cabezas de serie entran en Octavos (1/8). El resto: 12 de Serie A + 20 de Serie B.
    const serieANoHeads = serieA.filter(t => heads.indexOf(t.id) === -1).map(t => t.id);
    const serieBIds = serieB.map(t => t.id);
    // Turno Preliminar (1/64): los 8 peores de Serie B (por ovr); los demás descansan.
    const byOvr = (a, b) => (a.ovr - b.ovr) || String(a.id).localeCompare(String(b.id));
    const prelim = serieB.slice().sort(byOvr).slice(0, 8).map(t => t.id);
    const rest = serieANoHeads.concat(serieBIds.filter(id => prelim.indexOf(id) === -1));

    const cup = {
      id: COPPA_ITALIA,
      name: 'Coppa Italia',
      type: 'cup',
      country: 'Italia',
      season,
      rounds: [],
      jornadas: [],
      alive: [],
      winner: null,
      runnerUp: null,
      finished: false,
      qualifications: {},
      _heads: heads,
      _rest: rest,
      _plan: COPPA_PLAN,
      _planIdx: 0
    };
    const rng = cupEngine.mulberry32(hashStr('coppa:' + season));
    const shuffled = cupEngine.shuffle(cupEngine.seededSorted(prelim), rng);
    coppaBuildRound(cup, COPPA_PLAN[0].name, shuffled, 0, COPPA_PLAN[0].atWeek, COPPA_PLAN[0].slot);
    return cup;
  }

  function playCoppaMatch(m) {
    const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
    if (!home || !away) return;
    cupEngine.applyMatchResult(m, simulate(home, away));
  }

  function ensureCoppaNext(cup, planIdx) {
    if (planIdx >= COPPA_PLAN.length) return;
    if (cup.rounds[planIdx]) return;
    const plan = COPPA_PLAN[planIdx];
    const alive = cup.alive;
    if (!alive || !alive.length) return;
    cup._planIdx = planIdx;

    if (plan.sf) {
      if (alive.length !== 4) return;
      const rng = cupEngine.mulberry32(hashStr(cup.id + ':' + cup.season + ':Semifinal'));
      const shuffled = cupEngine.shuffle(cupEngine.seededSorted(alive), rng);
      const pairings = [[shuffled[0], shuffled[1]], [shuffled[2], shuffled[3]]];
      cupEngine.buildSfLeg(cup, COPPA_PLAN[planIdx].name, COPPA_PLAN[planIdx].atWeek, COPPA_PLAN[planIdx].slot, 1, pairings);
      const next = COPPA_PLAN[planIdx + 1];
      if (next) cupEngine.buildSfLeg(cup, next.name, next.atWeek, next.slot, 2, pairings);
      return;
    }

    let participants = alive;
    if (plan.rest) participants = cup._rest.concat(alive);
    if (plan.heads) participants = alive.concat(cup._heads || []);
    const byes = Math.max(0, 2 * plan.target - participants.length);
    coppaBuildRound(cup, plan.name, participants, byes, plan.atWeek, plan.slot);
    if (plan.neutral && cup.rounds[cup.rounds.length - 1]) {
      const m = cup.rounds[cup.rounds.length - 1].matches[0];
      if (m) m.neutral = plan.neutral;
    }
  }

  function finalizeCoppaRound(cup, idx) {
    const round = cup.rounds[idx];
    if (!round || round.completed) return;
    if (!cupEngine.roundComplete(round)) return;
    const winners = new Set(round.byes || []);
    for (const m of round.matches) if (m.winnerId) winners.add(m.winnerId);
    cup.alive = [...winners];
    round.completed = true;
    if (round.round === 'Final') {
      const fm = round.matches[0];
      cup.winner = fm ? fm.winnerId : cup.alive[0];
      cup.runnerUp = fm ? fm.loserId : null;
      cup.finished = true;
      cup.qualifications = { europaLeague: cup.winner };
      return;
    }
    ensureCoppaNext(cup, idx + 1);
  }

  function playCoppaRound(cup, idx, opts) {
    const round = cup.rounds[idx];
    if (!round || round.completed) return;
    const skip = opts && opts.skipTeamId;
    for (const m of round.matches) {
      if (m.winnerId) continue;
      if (skip && !m.played && (m.homeId === skip || m.awayId === skip)) continue;
      if (round.semis) {
        if (!m.played) playCoppaMatch(m);
        cupEngine.resolveSfTie(cup, m.tieId);
      } else {
        cupEngine.resolveSingleMatch(m);
      }
    }
    finalizeCoppaRound(cup, idx);
  }

  // =====================================================================
  // SUPERCOPPA ITALIANA (Final Four)
  // =====================================================================
  function buildSupercoppa(opts) {
    opts = opts || {};
    const leagueTop = (opts.leagueTop || []).filter(Boolean);
    const cupFinalists = (opts.cupFinalists || []).filter(Boolean);
    if (leagueTop.length < 2 || cupFinalists.length < 2) return null;
    const sc = cupEngine.buildSupercopa(leagueTop, cupFinalists, {
      id: SUPERCOPPA,
      name: 'Supercoppa Italiana',
      country: 'Italia',
      season: opts.season || 1
    });
    if (sc && sc.rounds.length >= 2) {
      sc.rounds[0].atWeek = 19;
      sc.rounds[0].slot = 1;
      sc.rounds[1].atWeek = 20;
      sc.rounds[1].slot = 1;
    }
    return sc;
  }

  // Primera edición (temporada 1): sin resultados previos, top-4 por ovr.
  function buildSupercoppaFirstEdition(opts) {
    const serieA = db.getTeamsByCountry('Italia').slice()
      .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)));
    if (serieA.length < 4) return null;
    const top = serieA.map(t => t.id);
    return buildSupercoppa({ season: (opts && opts.season) || 1, leagueTop: top, cupFinalists: [top[0], top[1]] });
  }

  function shootoutDirect(homeId, awayId) {
    const rng = cupEngine.mulberry32(hashStr(homeId + '|' + awayId) ^ Math.floor(Math.random() * 0x7fffffff));
    const conv = (id) => {
      const t = db.getTeamById(id);
      const o = t ? Number(t.ovr || 60) : 60;
      return Math.max(0.5, Math.min(0.95, 0.58 + (o - 60) * 0.008));
    };
    let a = 0, b = 0;
    for (let i = 0; i < 5; i++) {
      if (rng() < conv(homeId)) a++;
      if (rng() < conv(awayId)) b++;
    }
    let guard = 0;
    while (a === b && guard++ < 100) {
      if (rng() < conv(homeId)) a++;
      if (rng() < conv(awayId)) b++;
    }
    return { home: a, away: b, winnerId: a > b ? homeId : awayId, loserId: a > b ? awayId : homeId };
  }

  // Partido único de la Supercoppa: si empate a 90' → penaltis directos (sin prórroga).
  function resolveSuperMatch(m) {
    if (!m || m.winnerId) return;
    if (!m.played) {
      const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
      if (!home || !away) return;
      cupEngine.applyMatchResult(m, simulate(home, away));
    }
    if (m.homeGoals !== m.awayGoals) {
      m.winnerId = m.homeGoals > m.awayGoals ? m.homeId : m.awayId;
      m.loserId = m.homeGoals > m.awayGoals ? m.awayId : m.homeId;
    } else {
      const r = shootoutDirect(m.homeId, m.awayId);
      m.penalties = { home: r.home, away: r.away };
      m.winnerId = r.winnerId;
      m.loserId = r.loserId;
    }
  }

  function playSupercoppa(cup, opts) {
    const skip = opts && opts.skipTeamId;
    for (const round of cup.rounds) {
      if (round.completed) continue;
      for (const m of round.matches) {
        if (m.winnerId) continue;
        if (!m.played && skip && (m.homeId === skip || m.awayId === skip)) continue;
        resolveSuperMatch(m);
      }
      if (cupEngine.roundComplete(round)) {
        round.completed = true;
        if (round.round === 'Semifinal') {
          const final = cup.rounds[1];
          if (final && final.matches[0]) {
            final.matches[0].homeId = round.matches[0] ? round.matches[0].winnerId : null;
            final.matches[0].awayId = round.matches[1] ? round.matches[1].winnerId : null;
          }
        } else {
          const fm = round.matches[0];
          cup.winner = fm ? fm.winnerId : null;
          cup.runnerUp = fm ? fm.loserId : null;
          cup.finished = true;
        }
      }
    }
  }

  // =====================================================================
  // Interfaz genérica de copas (usada por app.js / calendar)
  // =====================================================================
  function playRound(cup, idx, opts) {
    if (!cup) return;
    if (cup.id === SUPERCOPPA) { playSupercoppa(cup, opts); return; }
    playCoppaRound(cup, idx, opts);
  }

  function nextFixture(cup, teamId) {
    if (!cup || !cup.rounds) return null;
    for (let i = 0; i < cup.rounds.length; i++) {
      const round = cup.rounds[i];
      if (round.completed) continue;
      for (const m of round.matches) {
        if (m.winnerId || m.played) continue;
        if (m.homeId === teamId || m.awayId === teamId) {
          return { roundIdx: i, round, match: m, isHome: m.homeId === teamId };
        }
      }
    }
    return null;
  }

  function applyCupResult(cup, match, result) {
    if (!cup || !match) return;
    if (cup.id === SUPERCOPPA) {
      cupEngine.applyMatchResult(match, result);
      playSupercoppa(cup, {});
      return;
    }
    const idx = cup.rounds.findIndex(r => r.matches.indexOf(match) !== -1);
    if (idx === -1) return;
    const round = cup.rounds[idx];
    cupEngine.applyMatchResult(match, result);
    if (round.semis) {
      cupEngine.resolveSfTie(cup, match.tieId);
    } else {
      cupEngine.resolveSingleMatch(match);
    }
    if (cupEngine.roundComplete(round)) finalizeCoppaRound(cup, idx);
  }

  function awardCompetitionTrophy(cup) {
    if (!cup || !cup.winner) return null;
    const name = cup.id === SUPERCOPPA ? TROPHY_SUPER : TROPHY_COPPA;
    return cupEngine.awardTrophy(cupEngine.teamOf(cup.winner), name);
  }

  // =====================================================================
  // Cierre de temporada: Serie A <-> Serie B
  // =====================================================================
  function moveTeam(fromArr, toArr, team) {
    const i = fromArr.indexOf(team);
    if (i !== -1) fromArr.splice(i, 1);
    if (toArr.indexOf(team) === -1) toArr.push(team);
  }

  function seasonEnd() {
    const se = gameState.seasons[ITALIA_COMP];
    if (!se || !se.jornadas) return;

    finishItalyLeague(se);
    const list = window.PocketManager.season.sortedStandings(se);
    if (list.length < 20) return;

    // Cabezas de serie de la Coppa Italia de la próxima temporada (top-8 actual).
    gameState.italyCupHeads = list.slice(0, 8).map(s => s.teamId);

    const ita = db.countries.find(c => c.country === 'Italia');
    if (!ita) return;
    const serieA = ita.teams;

    // Serie A -> Serie B: puestos 18-20. Serie B -> Serie A: 3 mejores por ovr.
    const rel = list.slice(17).map(s => s.teamId);
    const serieB = db.divisionTeams.filter(t => t.division === 'serie_b');
    const prom = serieB.slice()
      .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)))
      .slice(0, 3)
      .map(t => t.id);

    const byId = (arr, id) => arr.find(t => t.id === id) || null;

    for (const id of rel) {
      const t = byId(serieA, id);
      if (!t) continue;
      moveTeam(serieA, db.divisionTeams, t);
      t.division = 'serie_b';
      for (const p of t.players) p.division = 'serie_b';
    }
    for (const id of prom) {
      const t = byId(db.divisionTeams, id);
      if (!t) continue;
      moveTeam(db.divisionTeams, serieA, t);
      t.division = null;
      for (const p of t.players) p.division = null;
    }

    if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.assignAutomaticNumbers) {
      try { for (const t of serieA) window.PocketManager.squadEngine.assignAutomaticNumbers(t); } catch (e) {}
    }
    if (window.PocketManager.staminaEngine && window.PocketManager.staminaEngine.resetFitness) {
      try { for (const t of serieA) window.PocketManager.staminaEngine.resetFitness(t); } catch (e) {}
    }

    gameState.seasons[ITALIA_COMP] = window.PocketManager.season.initSeason(serieA[0], ITALIA_COMP);
    const userComp = window.PocketManager.calendar && window.PocketManager.calendar.userLeagueCompId
      ? window.PocketManager.calendar.userLeagueCompId(gameState.team.id)
      : null;
    if (userComp === ITALIA_COMP) gameState.season = gameState.seasons[ITALIA_COMP];
  }

  window.PocketManager.italyEngine = {
    ITALIA_COMP,
    COPPA_ITALIA,
    SUPERCOPPA,
    buildCoppaItalia,
    buildSupercoppa,
    buildSupercoppaFirstEdition,
    playRound,
    nextFixture,
    applyCupResult,
    awardCompetitionTrophy,
    finishItalyLeague,
    seasonEnd
  };
})();
