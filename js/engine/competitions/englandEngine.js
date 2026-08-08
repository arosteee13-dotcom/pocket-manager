(function () {
  // Competiciones de Inglaterra: Community Shield, EFL Cup (Carabao), FA Cup y EFL Trophy.
  //
  // Estructura semanal (slot 1 = Miércoles entre semana, slot 2 = Domingo):
  //   - Community Shield: partido único en la Semana 1 (slot 1).
  //   - EFL Cup: partido único R1→Cuartos, Semifinal a doble partido (agregado), Final única.
  //   - FA Cup: partido único; la Premier League entra en la Ronda 3 (1/32).
  //   - EFL Trophy: fase de grupos (League One + League Two + Academias) + eliminatorias.
  // Todas las rondas de copa se asignan al slot 1; la Premier League se mantiene en slot 2.
  const db = window.PocketManager.db;
  const cupEngine = window.PocketManager.cupEngine;

  const { makeMatch, teamOf, applyMatchResult, resolveSingleMatch, resolveSingleTie, resolveSfTie, buildSfLeg, syncJornadas, roundComplete, seededSorted, shuffle, mulberry32 } = cupEngine;

  const TROPHY_NAMES = {
    community_shield: 'Community Shield',
    efl_cup: 'EFL Cup',
    fa_cup: 'FA Cup',
    efl_trophy: 'EFL Trophy'
  };

  // Plan de rondas de la EFL Cup: cuadro 1/128 → Final (partido único salvo la Semifinal,
  // que es a doble partido). Con 92 equipos, las primeras rondas usan byes para que la
  // Semifinal llegue con 4 equipos.
  const EFL_CUP_PLAN = [
    { name: '1/128', at: 2, target: 80 },
    { name: '1/64', at: 3, target: 64 },
    { name: '1/32', at: 4, target: 32 },
    { name: '1/16', at: 6, target: 16 },
    { name: 'Octavos', at: 8, target: 8 },
    { name: 'Cuartos', at: 9, target: 4 },
    { name: 'Semifinal', at: 10, at2: 11, sf: true },
    { name: 'Final', at: 12, target: 1 }
  ];

  // Plan de la FA Cup: 14 rondas (Previa 1-3, 1/1024…Final) con byes. Las divisiones
  // inferiores arrancan en la Previa 1; la Premier League entra en la Ronda 1/32.
  const FA_CUP_PLAN = [
    { name: 'Previa 1', at: 5, target: 68 },
    { name: 'Previa 2', at: 6, target: 64 },
    { name: 'Previa 3', at: 7, target: 60 },
    { name: '1/1024', at: 8, target: 56 },
    { name: '1/512', at: 9, target: 52 },
    { name: '1/256', at: 10, target: 48 },
    { name: '1/128', at: 11, target: 44 },
    { name: '1/64', at: 12, target: 40 },
    { name: '1/32', at: 13, addPL: true, target: 32 },
    { name: '1/16', at: 15, target: 16 },
    { name: 'Octavos', at: 17, target: 8 },
    { name: 'Cuartos', at: 19, target: 4 },
    { name: 'Semifinal', at: 21, target: 2 },
    { name: 'Final', at: 22, target: 1 }
  ];

  // Eliminatorias del EFL Trophy tras la fase de grupos: 1/16 → Final.
  // (32 equipos clasificados = ronda de dieciseisavos 1/16, no treintaidosavos.)
  const TROPHY_KNOCKOUT = [
    { name: '1/16', at: 12, target: 16 },
    { name: 'Octavos', at: 14, target: 8 },
    { name: 'Cuartos', at: 16, target: 4 },
    { name: 'Semifinal', at: 18, target: 2 },
    { name: 'Final', at: 20, target: 1 }
  ];

  // ---------- Utilidades ----------
  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
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
    // Las copas auto-simuladas no registran stats de jugador (evita inflar partidos/goles
    // con fases que se juegan en segundo plano antes o durante la liga).
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away, { recordStats: false });
    }
    return simpleSim(home, away);
  }

  function playMatch(match) {
    const home = teamOf(match.homeId), away = teamOf(match.awayId);
    if (!home || !away) return;
    applyMatchResult(match, simulate(home, away));
  }

  // Equipos de Inglaterra por grupo de participación.
  function englandTeams() {
    const pl = db.getTeamsByCountry('Inglaterra') || [];
    const all = db.getCupParticipants('Inglaterra') || [];
    const plIds = new Set(pl.map(t => t.id));
    const divs = all.filter(t => !plIds.has(t.id));
    return { pl, divs };
  }

  function newCup(id, name, season, extra) {
    return Object.assign({
      id, name, type: 'cup', country: 'Inglaterra', season,
      rounds: [], jornadas: [], alive: [], winner: null, runnerUp: null, finished: false, qualifications: {}
    }, extra || {});
  }

  function buildRound(cup, roundName, alive, numByes, atWeek, slot) {
    const rng = mulberry32(hashStr(cup.id + ':' + cup.season + ':' + roundName));
    const sorted = seededSorted(alive);
    const byes = numByes > 0 ? sorted.slice(0, numByes) : [];
    const playing = shuffle(sorted.slice(numByes), rng);
    const matches = [];
    for (let i = 0; i + 1 < playing.length; i += 2) {
      matches.push(makeMatch(playing[i], playing[i + 1]));
    }
    const round = { round: roundName, atWeek: atWeek || 0, slot: slot || 1, semis: false, byes, matches, completed: false };
    cup.rounds.push(round);
    syncJornadas(cup);
    return round;
  }

  function buildGroupRound(cup, name, atWeek, groups, matchday) {
    const matches = [];
    for (const g of groups) {
      if (g.length < 4) continue;
      const [a, b, c, d] = g;
      const pair = matchday === 1 ? [[a, b], [c, d]]
        : matchday === 2 ? [[a, c], [b, d]]
        : [[a, d], [b, c]];
      for (const [x, y] of pair) {
        const m = makeMatch(x, y);
        m.group = g.name || g.id;
        matches.push(m);
      }
    }
    const round = { round: name, atWeek, slot: 1, semis: false, byes: [], groups, matches, completed: false };
    cup.rounds.push(round);
    syncJornadas(cup);
    return round;
  }

  function roundWinners(round) {
    const w = new Set(round.byes || []);
    for (const m of round.matches) if (m.winnerId) w.add(m.winnerId);
    return [...w];
  }

  function roundIndexForMatch(cup, match) {
    return cup.rounds.findIndex(r => r.matches.indexOf(match) !== -1);
  }

  // Construye la siguiente ronda de eliminación directa a partir del plan.
  function ensureNextRound(cup, planIdx) {
    const plan = cup._plan;
    if (!plan || planIdx >= plan.length) return;
    const p = plan[planIdx];
    let alive = cup.alive || [];
    if (p.addPL && cup._plIds) alive = alive.concat(cup._plIds);
    if (!alive.length) return;

    if (p.sf) {
      if (alive.length !== 4) return;
      const rng = mulberry32(hashStr(cup.id + ':' + cup.season + ':' + p.name));
      const shuffled = shuffle(seededSorted(alive), rng);
      const pairings = [[shuffled[0], shuffled[1]], [shuffled[2], shuffled[3]]];
      buildSfLeg(cup, 'Semifinal Ida', p.at, p.slot || 1, 1, pairings);
      buildSfLeg(cup, 'Semifinal Vuelta', p.at2 || p.at, p.slot || 1, 2, pairings);
      return;
    }
    if (alive.length <= p.target) return;
    const byes = Math.max(0, 2 * p.target - alive.length);
    buildRound(cup, p.name, alive, byes, p.at, p.slot || 1);
  }

  function ensureKnockoutRound(cup, planIdx) {
    if (planIdx >= TROPHY_KNOCKOUT.length) return;
    const p = TROPHY_KNOCKOUT[planIdx];
    const alive = cup.alive || [];
    if (!alive.length) return;
    const byes = Math.max(0, 2 * p.target - alive.length);
    buildRound(cup, p.name, alive, byes, p.at, 1);
  }

  function finalizeRound(cup, idx) {
    const round = cup.rounds[idx];
    if (!round || round.completed) return;
    if (!roundComplete(round)) return;
    const winners = roundWinners(round);
    round.completed = true;

    if (round.round === 'Final') {
      const m = round.matches[0];
      cup.winner = m ? m.winnerId : (cup.alive[0] || null);
      cup.runnerUp = m ? m.loserId : null;
      cup.finished = true;
      return;
    }
    cup.alive = winners;

    if (cup.mode === 'knockout') {
      cup._planIdx = (cup._planIdx || 0) + 1;
      ensureNextRound(cup, cup._planIdx);
    } else if (cup.mode === 'trophy') {
      cup._knockIdx = (cup._knockIdx || 0) + 1;
      ensureKnockoutRound(cup, cup._knockIdx);
    }
  }

  function allGroupMatchesPlayed(cup) {
    const gr = cup.rounds.filter(r => r.groups);
    return gr.length > 0 && gr.every(r => r.matches.every(m => m.played));
  }

  // Clasificación de la fase de grupos: top-2 de cada grupo avanzan a los Treintaidosavos.
  function finalizeGroupStage(cup) {
    if (cup._groupsFinalized) return;
    const groupRounds = cup.rounds.filter(r => r.groups);
    if (!groupRounds.length || !allGroupMatchesPlayed(cup)) return;
    cup._groupsFinalized = true;

    const groups = cup.groups || groupRounds[0].groups;
    const qualified = [];
    for (const g of groups) {
      const rows = g.map(id => ({ teamId: id, pts: 0, gf: 0, ga: 0 }));
      const byId = {};
      rows.forEach(r => byId[r.teamId] = r);
      for (const r of groupRounds) {
        for (const m of r.matches) {
          if (g.indexOf(m.homeId) === -1 || g.indexOf(m.awayId) === -1) continue;
          const h = byId[m.homeId], a = byId[m.awayId];
          h.gf += m.homeGoals; h.ga += m.awayGoals;
          a.gf += m.awayGoals; a.ga += m.homeGoals;
          if (m.homeGoals > m.awayGoals) h.pts += 3;
          else if (m.homeGoals < m.awayGoals) a.pts += 3;
          else { h.pts += 1; a.pts += 1; }
        }
      }
      rows.sort((x, y) => (y.pts - x.pts) || ((y.gf - y.ga) - (x.gf - x.ga)) || (y.gf - x.gf) || String(x.teamId).localeCompare(String(y.teamId)));
      qualified.push(rows[0].teamId, rows[1].teamId);
    }
    groupRounds.forEach(r => r.completed = true);
    cup.alive = qualified;
    cup._knockIdx = 0;
    ensureKnockoutRound(cup, 0);
  }

  function finalizePendingRounds(cup, upToIdx) {
    for (let k = 0; k <= upToIdx; k++) {
      const r = cup.rounds[k];
      if (!r || r.completed) continue;
      if (roundComplete(r)) finalizeRound(cup, k);
    }
  }

  // ---------- Construcción ----------
  function buildCommunityShield(opts) {
    opts = opts || {};
    if (!opts.championId || !opts.faCupWinnerId) return null;
    const cup = newCup('community_shield', 'Community Shield', opts.season, { mode: 'shield' });
    cup.alive = [opts.championId, opts.faCupWinnerId];
    const round = { round: 'Final', atWeek: 1, slot: 1, semis: false, byes: [], matches: [makeMatch(opts.championId, opts.faCupWinnerId)], completed: false };
    cup.rounds.push(round);
    syncJornadas(cup);
    return cup;
  }

  // Primera edición de la Community Shield (temporada 1): sin resultados previos de liga/copa,
  // se fija el cruce (Arsenal vs Manchester City).
  function buildCommunityShieldFirstEdition(opts) {
    opts = opts || {};
    const season = opts.season || 1;
    const cup = newCup('community_shield', 'Community Shield', season, { mode: 'shield' });
    cup.alive = ['eng_arsenal', 'eng_mancity'];
    const round = { round: 'Final', atWeek: 1, slot: 1, semis: false, byes: [], matches: [makeMatch('eng_arsenal', 'eng_mancity')], completed: false };
    cup.rounds.push(round);
    syncJornadas(cup);
    return cup;
  }

  function buildEflCup(opts) {
    opts = opts || {};
    const { pl, divs } = englandTeams();
    const efl = divs.filter(t => t.division !== 'academy'); // Championship + League One + League Two
    const cup = newCup('efl_cup', 'EFL Cup', opts.season, { mode: 'knockout', _plan: EFL_CUP_PLAN });
    cup._plIds = pl.map(t => t.id);
    cup.alive = efl.concat(pl).map(t => t.id); // 72 EFL + 20 Premier
    cup._planIdx = 0;
    ensureNextRound(cup, 0);
    return cup;
  }

  function buildFaCup(opts) {
    opts = opts || {};
    const { pl, divs } = englandTeams();
    const efl = divs.filter(t => t.division !== 'academy'); // Championship + League One + League Two
    const cup = newCup('fa_cup', 'FA Cup', opts.season, { mode: 'knockout', _plan: FA_CUP_PLAN });
    cup._plIds = pl.map(t => t.id);
    cup.alive = efl.map(t => t.id); // R1 y R2 solo divisiones; la Premier entra en R3
    cup._planIdx = 0;
    ensureNextRound(cup, 0);
    return cup;
  }

  function buildEflTrophy(opts) {
    opts = opts || {};
    const { divs } = englandTeams();
    const trophy = divs.filter(t => t.division === 'league1' || t.division === 'league2' || t.division === 'academy');
    const cup = newCup('efl_trophy', 'EFL Trophy', opts.season, { mode: 'trophy' });
    const rng = mulberry32(hashStr('efl_trophy:' + (opts.season || 1)));
    const ids = shuffle(trophy.map(t => t.id), rng);
    // 16 grupos de 4 equipos: 8 del Grupo Norte (A-H) y 8 del Grupo Sur (A-H). Los dos
    // primeros de cada grupo avanzan a las eliminatorias (1/16 → Final).
    const names = [];
    for (let i = 0; i < 8; i++) names.push('Grupo Norte ' + String.fromCharCode(65 + i));
    for (let i = 0; i < 8; i++) names.push('Grupo Sur ' + String.fromCharCode(65 + i));
    const groups = [];
    for (let i = 0; i < ids.length; i += 4) {
      const g = ids.slice(i, i + 4);
      g.name = names[groups.length] || ('Grupo ' + (groups.length + 1));
      groups.push(g);
    }
    cup.groups = groups;
    buildGroupRound(cup, 'Jornada 1', 3, groups, 1);
    buildGroupRound(cup, 'Jornada 2', 6, groups, 2);
    buildGroupRound(cup, 'Jornada 3', 9, groups, 3);
    return cup;
  }

  // ---------- Resolución ----------
  function playRound(cup, idx, opts) {
    opts = opts || {};
    const round = cup.rounds[idx];
    if (!round || round.completed) return;
    for (const m of round.matches) {
      if (m.winnerId) continue;
      if (opts.skipTeamId && !m.played && (m.homeId === opts.skipTeamId || m.awayId === opts.skipTeamId)) continue;
      if (round.groups) {
        if (!m.played) playMatch(m);
      } else if (round.semis) {
        if (!m.played) playMatch(m);
        resolveSfTie(cup, m.tieId);
      } else {
        resolveSingleMatch(m);
      }
    }
    if (round.groups) {
      if (allGroupMatchesPlayed(cup)) finalizeGroupStage(cup);
    } else {
      finalizePendingRounds(cup, idx);
    }
  }

  function applyCupResult(cup, match, result) {
    if (!cup || !match) return;
    const idx = roundIndexForMatch(cup, match);
    if (idx === -1) return;
    const round = cup.rounds[idx];
    applyMatchResult(match, result);
    if (round.groups) {
      if (allGroupMatchesPlayed(cup)) finalizeGroupStage(cup);
      return;
    }
    if (round.semis) {
      resolveSfTie(cup, match.tieId);
    } else {
      resolveSingleMatch(match);
    }
    finalizePendingRounds(cup, idx);
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

  function awardCompetitionTrophy(cup) {
    if (!cup || !cup.winner) return null;
    const name = TROPHY_NAMES[cup.id] || cup.name || 'Trofeo';
    const winner = teamOf(cup.winner);
    return cupEngine.awardTrophy(winner, name);
  }

  // =====================================================================
  // EFL CHAMPIONSHIP (liga de 24 equipos · 46 jornadas · playoffs 3º-8º)
  // =====================================================================
  // Reglas:
  //   - Ascenso directo: 1º y 2º. Descenso: 22º, 23º y 24º (a League One).
  //   - Playoffs de ascenso (3ª plaza) al terminar la Jornada 46:
  //       · 1ª Ronda (Ida/Vuelta, J47 y J48): 3º vs 8º · 4º vs 7º · 5º vs 6º.
  //       · Semifinales (Ida/Vuelta, J49 y J50): los 3 ganadores + el mejor perdedor
  //         (perdedor de la 1ª ronda con mejor posición regular), por cabeza de serie.
  //       · Final (J51): partido único en campo neutral (Wembley).
  //   - Empate global en una eliminatoria -> avanza el mejor clasificado en la fase regular.
  const gameState = window.PocketManager.gameState;
  const CHAMPIONSHIP_COMP = 'inglaterra_efl_championship_league';
  const CHAMPION_REGULAR_JORNADAS = 46;
  const CHAMPION_FINAL_WEEK = 51;

  function isChampionship(compId) {
    return String(compId || '').indexOf('championship') !== -1;
  }

  function leagueSim(home, away) {
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away);
    }
    return simpleSim(home, away);
  }

  // Simula un partido de liga pendiente (registra stats de jugador).
  function applyLeagueResult(se, m) {
    if (m.played) return;
    const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
    if (!home || !away) return;
    const res = leagueSim(home, away);
    window.PocketManager.season.applyMatchResult(se, m, res.homeGoals, res.awayGoals);
  }

  function champMatch(a, b, leg, tieId) {
    const m = makeMatch(a, b, leg, tieId);
    m.playoff = true; // no puntúa para la clasificación regular
    m.championship = true;
    if (leg === null) m.neutral = 'Wembley';
    return m;
  }

  // Crea el cuadro de playoffs tras completar las 46 jornadas (idempotente).
  function championshipPlayoff(se) {
    if (se.playoff || !se.jornadas) return;
    const list = window.PocketManager.season.sortedStandings(se);
    const at = (i) => (list[i] ? list[i].teamId : null);
    const p3 = at(2), p4 = at(3), p5 = at(4), p6 = at(5), p7 = at(6), p8 = at(7);
    if (!p3 || !p4 || !p5 || !p6 || !p7 || !p8) return;

    const pos = {};
    list.forEach((s, i) => { pos[s.teamId] = i + 1; });
    se.playoff = {
      positions: pos,
      round1: [
        { a: p3, seedA: 3, b: p8, seedB: 8, tieId: 'r1_1', winner: null },
        { a: p4, seedA: 4, b: p7, seedB: 7, tieId: 'r1_2', winner: null },
        { a: p5, seedA: 5, b: p6, seedB: 6, tieId: 'r1_3', winner: null }
      ],
      sf: null,
      final: null,
      promotedId: null
    };
    se.jornadas.push({
      jornada: 47,
      matches: se.playoff.round1.map((t) => champMatch(t.a, t.b, 1, t.tieId))
    });
    se.jornadas.push({
      jornada: 48,
      matches: se.playoff.round1.map((t) => champMatch(t.b, t.a, 2, t.tieId))
    });
  }

  function championshipLegs(se, tieId) {
    const out = [];
    for (const j of se.jornadas) {
      if (j.jornada <= CHAMPION_REGULAR_JORNADAS) continue;
      for (const m of j.matches) if (m.tieId === tieId) out.push(m);
    }
    return out;
  }

  // Agregado; empate global -> avanza el mejor clasificado (menor posición) sin penaltis.
  function champWinnerByAggregate(legs, seedA, seedB, a, b) {
    const aggA = legs[0].homeGoals + legs[1].awayGoals;
    const aggB = legs[0].awayGoals + legs[1].homeGoals;
    if (aggA !== aggB) return aggA > aggB ? a : b;
    return seedA < seedB ? a : b;
  }

  function seedOf(p, teamId) {
    return p.positions[teamId] != null ? p.positions[teamId] : 99;
  }

  function resolveChampionshipPlayoff(se) {
    const p = se.playoff;
    if (!p) return;

    // 1ª Ronda
    for (const t of p.round1) {
      if (t.winner) continue;
      const legs = championshipLegs(se, t.tieId);
      if (legs.length === 2 && legs.every((m) => m.played)) {
        t.winner = champWinnerByAggregate(legs, t.seedA, t.seedB, t.a, t.b);
      }
    }

    // Semifinales: 3 ganadores + mejor perdedor (menor posición entre los eliminados).
    if (!p.sf && p.round1.every((t) => t.winner)) {
      const qual = p.round1.map((t) => t.winner);
      const losers = p.round1.map((t) => (t.winner === t.a ? t.b : t.a));
      const loserSeed = losers.map((id) => seedOf(p, id));
      const bestIdx = loserSeed.indexOf(Math.min.apply(null, loserSeed));
      qual.push(losers[bestIdx]);
      qual.sort((x, y) => (seedOf(p, x) - seedOf(p, y)) || String(x).localeCompare(String(y)));

      p.sf = [
        { a: qual[0], b: qual[3], tieId: 'sf_1', winner: null },
        { a: qual[1], b: qual[2], tieId: 'sf_2', winner: null }
      ];
      se.jornadas.push({ jornada: 49, matches: p.sf.map((t) => champMatch(t.a, t.b, 1, t.tieId)) });
      se.jornadas.push({ jornada: 50, matches: p.sf.map((t) => champMatch(t.b, t.a, 2, t.tieId)) });
    }

    // Resolver semifinales
    if (p.sf) {
      for (const t of p.sf) {
        if (t.winner) continue;
        const legs = championshipLegs(se, t.tieId);
        if (legs.length === 2 && legs.every((m) => m.played)) {
          t.winner = champWinnerByAggregate(legs, seedOf(p, t.a), seedOf(p, t.b), t.a, t.b);
        }
      }
    }

    // Final única en Wembley (J51)
    if (!p.final && p.sf && p.sf.every((t) => t.winner)) {
      p.final = { a: p.sf[0].winner, b: p.sf[1].winner, winner: null };
      se.jornadas.push({ jornada: CHAMPION_FINAL_WEEK, matches: [champMatch(p.final.a, p.final.b, null, 'final')] });
    }
    if (p.final && !p.final.winner) {
      const j = se.jornadas.find((x) => x.jornada === CHAMPION_FINAL_WEEK);
      const m = j && j.matches[0];
      if (m && m.played) {
        if (m.homeGoals !== m.awayGoals) {
          p.final.winner = m.homeGoals > m.awayGoals ? m.homeId : m.awayId;
        } else {
          p.final.winner = seedOf(p, p.final.a) <= seedOf(p, p.final.b) ? p.final.a : p.final.b;
        }
        p.promotedId = p.final.winner;
      }
    }
  }

  // Avanza la lógica de playoff tras un resultado (idempotente).
  function championshipAdvance(se, compId) {
    if (!isChampionship(compId) || !se || !se.jornadas) return;
    const regular = se.jornadas.filter((j) => j.jornada <= CHAMPION_REGULAR_JORNADAS);
    if (regular.length && regular.every((j) => j.matches.every((m) => m.played))) {
      championshipPlayoff(se);
      resolveChampionshipPlayoff(se);
    }
  }

  function championshipPlayoffWinner(se) {
    return (se && se.playoff) ? (se.playoff.promotedId || null) : null;
  }

  // Simula los partidos pendientes de una liga inglesa (para el cierre global).
  function finishEnglandLeague(se, compId) {
    if (!se || !se.jornadas) return;
    const isCh = isChampionship(compId);
    if (isCh) championshipPlayoff(se);
    for (const j of se.jornadas) {
      for (const m of j.matches) if (!m.played) applyLeagueResult(se, m);
    }
    if (isCh) resolveChampionshipPlayoff(se);
  }

  function moveTeam(fromArr, toArr, team) {
    const i = fromArr.indexOf(team);
    if (i !== -1) fromArr.splice(i, 1);
    if (toArr.indexOf(team) === -1) toArr.push(team);
  }

  // Cierre global de temporada de Inglaterra: completa PL y Championship, calcula
  // ascensos/descensos (PL <-> Championship <-> League One) y reinicia las temporadas.
  function englandSeasonEnd() {
    const sePL = gameState.seasons['inglaterra_league'];
    const seCh = gameState.seasons[CHAMPIONSHIP_COMP];
    if (!sePL || !seCh) return;

    finishEnglandLeague(sePL, 'inglaterra_league');
    finishEnglandLeague(seCh, CHAMPIONSHIP_COMP);

    const plList = window.PocketManager.season.sortedStandings(sePL);
    const chList = window.PocketManager.season.sortedStandings(seCh);
    if (plList.length < 20 || chList.length < 24) return;

    // Championship -> Premier: 1º, 2º + ganador del playoff.
    const promoted = [chList[0].teamId, chList[1].teamId];
    const pw = championshipPlayoffWinner(seCh);
    if (pw) promoted.push(pw);
    // Premier -> Championship: últimos 3 (puestos 18-20).
    const relPL = plList.slice(17).map((s) => s.teamId);
    // Championship -> League One: últimos 3 (puestos 22-24).
    const relCh = chList.slice(21).map((s) => s.teamId);
    // League One -> Championship: 3 mejores por media (League One no se simula como liga).
    const leagueOne = db.divisionTeams.filter((t) => t.division === 'league1');
    const promLO = leagueOne.slice()
      .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)))
      .slice(0, 3)
      .map((t) => t.id);

    const engCountry = db.countries.find((c) => c.country === 'Inglaterra');
    const chLeague = db.leagues.find((l) => l.country === 'Inglaterra');
    if (!engCountry || !chLeague) return;
    const plArr = engCountry.teams;
    const chArr = chLeague.teams;
    const divArr = db.divisionTeams;

    const byId = (arr, id) => arr.find((t) => t.id === id) || null;

    for (const id of promoted) {
      const t = byId(chArr, id);
      if (!t) continue;
      moveTeam(chArr, plArr, t);
      t.division = null;
    }
    for (const id of relPL) {
      const t = byId(plArr, id);
      if (!t) continue;
      moveTeam(plArr, chArr, t);
      t.division = 'championship';
    }
    for (const id of relCh) {
      const t = byId(chArr, id);
      if (!t) continue;
      moveTeam(chArr, divArr, t);
      t.division = 'league1';
    }
    for (const id of promLO) {
      const t = byId(divArr, id);
      if (!t) continue;
      moveTeam(divArr, chArr, t);
      t.division = 'championship';
    }

    if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.assignAutomaticNumbers) {
      try { for (const t of [...plArr, ...chArr]) window.PocketManager.squadEngine.assignAutomaticNumbers(t); } catch (e) {}
    }
    if (window.PocketManager.staminaEngine && window.PocketManager.staminaEngine.resetFitness) {
      try { for (const t of [...plArr, ...chArr]) window.PocketManager.staminaEngine.resetFitness(t); } catch (e) {}
    }

    const season = window.PocketManager.season;
    gameState.seasons['inglaterra_league'] = season.initSeason(plArr[0], 'inglaterra_league');
    gameState.seasons[CHAMPIONSHIP_COMP] = season.initSeason(chArr[0], CHAMPIONSHIP_COMP);
    const userCompId = window.PocketManager.calendar && window.PocketManager.calendar.userLeagueCompId
      ? window.PocketManager.calendar.userLeagueCompId(gameState.team.id)
      : null;
    if (userCompId === 'inglaterra_league' || userCompId === CHAMPIONSHIP_COMP) {
      gameState.season = gameState.seasons[userCompId];
    }
  }

  window.PocketManager.englandEngine = {
    buildCommunityShield,
    buildCommunityShieldFirstEdition,
    buildEflCup,
    buildFaCup,
    buildEflTrophy,
    playRound,
    applyCupResult,
    nextFixture,
    awardCompetitionTrophy,
    resolveSingleTie,
    englandTeams,
    TROPHY_NAMES,
    TROPHY_KNOCKOUT,
    // EFL Championship
    CHAMPIONSHIP_COMP,
    isChampionship,
    championshipAdvance,
    championshipPlayoff,
    resolveChampionshipPlayoff,
    championshipPlayoffWinner,
    finishEnglandLeague,
    englandSeasonEnd
  };
})();
