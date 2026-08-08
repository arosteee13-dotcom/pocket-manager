(function () {
  // Motor de competiciones continentales (Europa).
  // UEFA Champions League (16 equipos, 4 grupos de 4): participantes = top-4 de cada liga
  // doméstica (España/Inglaterra/Italia) + 4 del pool "Resto de Europa". Fase de grupos en
  // semanas 3/5/7/10/12/14 (slot 1), doble vuelta; eliminatorias: cuartos ida/vuelta 28/30,
  // semis ida/vuelta 34/35, final única semana 38. Empate global -> prórroga -> penaltis.
  // Si el equipo del usuario participa, sus partidos son jugables; el resto, CPU semana a semana.
  // Supercopa de Europa: panel "A definir" (se activa en Fase 2 con la UEL).
  // Copa Intercontinental de la FIFA: cuadro de eliminatoria resuelto al cierre.
  //
  // CONTINENTALS_ENABLED: las competiciones continentales están desactivadas hasta que se
  // configuren. Con `false` no se construye ni se simula ningún torneo (Champions incluida),
  // y la interfaz muestra "Próximamente". Actívala cuando esté listo.
  const CONTINENTALS_ENABLED = false;

  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const cupEngine = window.PocketManager.cupEngine;

  const UCL = 'uefa_champions_league';
  const SUPER_CUP = 'uefa_super_cup';
  const CLUB_WORLD_CUP = 'club_world_cup';
  const TROPHY_UCL = 'Champions League';
  const TROPHY_INTERCONTINENTAL = 'Copa Intercontinental de la FIFA';

  const GROUP_WEEKS = [3, 5, 7, 10, 12, 14];
  const QF_WEEKS = [28, 30];
  const SF_WEEKS = [34, 35];
  const FINAL_WEEK = 38;

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function ovrOf(id) {
    const t = db.getTeamById(id);
    return t ? Number(t.ovr || 0) : 0;
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

  function simulate(home, away) {
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away, { recordStats: false });
    }
    return simpleSim(home, away);
  }

  function leagueHasResults(compId) {
    const se = gameState.seasons ? gameState.seasons[compId] : null;
    if (!se || !se.jornadas) return false;
    return se.jornadas.some(j => j.matches.some(m => m.played));
  }

  function domesticLeagueCompIds() {
    const out = [];
    for (const c of db.getCountries()) {
      const comp = (db.getCompetitions(c.name) || []).find(x => x.type === 'league');
      if (comp) out.push(comp.id);
    }
    return out;
  }

  // Top-k de cada liga doméstica por clasificación actual (o por ovr si no hay resultados).
  function qualifiedDomestic(k) {
    const out = [];
    for (const compId of domesticLeagueCompIds()) {
      let list;
      if (leagueHasResults(compId)) {
        list = window.PocketManager.season.sortedStandings(gameState.seasons[compId]).map(s => s.teamId);
      } else {
        const comp = (db.getCompetitions(db.getCountries().find(n => (db.getCompetitions(n.name) || []).some(x => x.id === compId)).name) || []).find(x => x.id === compId) || {};
        list = (comp.teams || []).slice().sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id))).map(t => t.id);
      }
      out.push(...list.slice(0, k));
    }
    return out;
  }

  function qualifiedEurope(k) {
    return (db.europeTeams || []).slice()
      .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)))
      .slice(0, k)
      .map(t => t.id);
  }

  function drawGroups(teamIds) {
    const sorted = [...teamIds].sort((a, b) => (ovrOf(b) - ovrOf(a)) || String(a).localeCompare(String(b)));
    const pots = [[], [], [], []];
    sorted.forEach((id, i) => pots[i % 4].push(id));
    const rng = cupEngine.mulberry32(hashStr('ucl:pots:' + sorted.join(',')));
    pots.forEach(p => cupEngine.shuffle(p, rng));
    return ['A', 'B', 'C', 'D'].map((gid, gi) => ({
      id: gid,
      name: 'Grupo ' + gid,
      teamIds: pots.map(p => p[gi])
    }));
  }

  function groupFixtures(group) {
    const rr = window.PocketManager.calendar.generateRoundRobin(group.teamIds);
    const out = [];
    for (let i = 0; i < 6; i++) {
      const leg = rr[i % 3];
      out.push(leg.map(p => (i < 3 ? { homeId: p.homeId, awayId: p.awayId } : { homeId: p.awayId, awayId: p.homeId })));
    }
    return out;
  }

  function makeMatch(homeId, awayId, leg, tieId) {
    return {
      homeId, awayId,
      homeGoals: null, awayGoals: null,
      played: false, leg: leg || null, tieId: tieId || null,
      winnerId: null, loserId: null,
      etGoals: null, penalties: null, summary: null
    };
  }

  function buildChampionsLeague(season, opts) {
    opts = opts || {};
    const teams = opts.teams || qualifiedDomestic(4).concat(qualifiedEurope(4));
    if (teams.length < 16) return null;
    const groups = drawGroups(teams);
    const standings = {};
    for (const g of groups) {
      standings[g.id] = {};
      for (const id of g.teamIds) standings[g.id][id] = { pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, pts: 0 };
    }
    const groupJornadas = GROUP_WEEKS.map((week, idx) => {
      const matches = [];
      for (const g of groups) {
        for (const p of groupFixtures(g)[idx]) {
          matches.push({ ...makeMatch(p.homeId, p.awayId), week, groupId: g.id, jornada: idx + 1 });
        }
      }
      return { jornada: idx + 1, week, slot: 1, matches };
    });
    return {
      id: UCL, name: 'UEFA Champions League', shortName: 'CHA',
      type: 'continental', country: 'Europa', season,
      teams, groups, standings, groupJornadas,
      phase: 'groups', knockout: null,
      winner: null, runnerUp: null, finished: false, qualifications: {}
    };
  }

  function recordGroupResult(ucl, m) {
    const st = ucl.standings[m.groupId];
    if (!st) return;
    const h = st[m.homeId], a = st[m.awayId];
    if (!h || !a) return;
    const hg = m.homeGoals, ag = m.awayGoals;
    h.pj++; a.pj++;
    h.gf += hg; h.gc += ag; a.gf += ag; a.gc += hg;
    if (hg > ag) { h.g++; h.pts += 3; a.p++; }
    else if (hg < ag) { a.g++; a.pts += 3; h.p++; }
    else { h.e++; a.e++; h.pts++; a.pts++; }
  }

  function classifyGroup(ucl, gid) {
    const st = ucl.standings[gid];
    return Object.keys(st)
      .map(id => ({ teamId: id, ...st[id] }))
      .sort((a, b) => (b.pts - a.pts) || ((b.gf - b.gc) - (a.gf - a.gc)) || (b.gf - a.gf) || String(a.teamId).localeCompare(String(b.teamId)));
  }

  function allGroupsComplete(ucl) {
    return ucl.groupJornadas.every(j => j.matches.every(m => m.played));
  }

  function buildKnockout(ucl) {
    const qualifiers = [];
    const byGroup = {};
    for (const g of ucl.groups) {
      const list = classifyGroup(ucl, g.id);
      const first = { teamId: list[0].teamId, group: g.id };
      const second = { teamId: list[1].teamId, group: g.id };
      qualifiers.push(first, second);
      byGroup[g.id] = first;
    }
    const ties = [
      { a: byGroup.A.teamId, b: byGroup.B.teamId, tieId: 'qf1' },
      { a: byGroup.B.teamId, b: byGroup.A.teamId, tieId: 'qf2' },
      { a: byGroup.C.teamId, b: byGroup.D.teamId, tieId: 'qf3' },
      { a: byGroup.D.teamId, b: byGroup.C.teamId, tieId: 'qf4' }
    ];
    ucl._qualifiers = qualifiers;
    ucl.knockout = {
      rounds: [
        { round: 'Cuartos de final · Ida', week: QF_WEEKS[0], slot: 1, matches: ties.map(t => makeMatch(t.a, t.b, 1, t.tieId)) },
        { round: 'Cuartos de final · Vuelta', week: QF_WEEKS[1], slot: 1, matches: ties.map(t => makeMatch(t.b, t.a, 2, t.tieId)) }
      ]
    };
    ucl.phase = 'knockout';
  }

  function legsOf(ucl, tieId) {
    const out = [];
    for (const r of ucl.knockout.rounds) for (const m of r.matches) if (m.tieId === tieId) out.push(m);
    return out;
  }

  function tieWinner(ucl, tieId) {
    const w = legsOf(ucl, tieId).find(m => m.winnerId);
    return w ? w.winnerId : null;
  }

  function ensureKnockoutNext(ucl, roundIdx) {
    const rounds = ucl.knockout.rounds;
    if (roundIdx === 1) {
      const winners = ['qf1', 'qf2', 'qf3', 'qf4'].map(t => tieWinner(ucl, t));
      const pairings = [
        { a: winners[0], b: winners[2], tieId: 'sf1' },
        { a: winners[1], b: winners[3], tieId: 'sf2' }
      ];
      rounds.push({ round: 'Semifinal · Ida', week: SF_WEEKS[0], slot: 1, matches: pairings.map(p => makeMatch(p.a, p.b, 1, p.tieId)) });
      rounds.push({ round: 'Semifinal · Vuelta', week: SF_WEEKS[1], slot: 1, matches: pairings.map(p => makeMatch(p.b, p.a, 2, p.tieId)) });
      return;
    }
    if (roundIdx === 3) {
      const a = tieWinner(ucl, 'sf1');
      const b = tieWinner(ucl, 'sf2');
      const final = makeMatch(a, b, null, 'fin');
      final.neutral = 'Sede neutral';
      rounds.push({ round: 'Final', week: FINAL_WEEK, slot: 1, matches: [final] });
    }
  }

  function playMatch(m) {
    const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
    if (!home || !away) return;
    cupEngine.applyMatchResult(m, simulate(home, away));
  }

  function advanceWeek(ucl, week, opts) {
    if (!ucl || ucl.finished) return;
    opts = opts || {};
    const skip = opts.skipTeamId;
    const isUserWeek = opts.isUserWeek;

    if (ucl.phase === 'groups') {
      for (const j of ucl.groupJornadas) {
        if (j.week !== week) continue;
        for (const m of j.matches) {
          if (m.played) continue;
          if (skip && isUserWeek && (m.homeId === skip || m.awayId === skip)) continue;
          playMatch(m);
          recordGroupResult(ucl, m);
        }
      }
      if (allGroupsComplete(ucl)) buildKnockout(ucl);
      return;
    }

    const rounds = ucl.knockout.rounds;
    for (let i = 0; i < rounds.length; i++) {
      const r = rounds[i];
      if (r.week !== week) continue;
      for (const m of r.matches) {
        if (m.played || m.winnerId) continue;
        if (skip && isUserWeek && (m.homeId === skip || m.awayId === skip)) continue;
        if (r.round === 'Final') {
          cupEngine.resolveSingleMatch(m);
        } else {
          playMatch(m);
          cupEngine.resolveSfTie({ rounds }, m.tieId);
        }
      }
      const finished = r.round === 'Final'
        ? r.matches.every(m => m.winnerId)
        : r.matches.every(m => m.winnerId);
      if (finished) {
        if (r.round === 'Final') {
          const fm = r.matches[0];
          ucl.winner = fm.winnerId;
          ucl.runnerUp = fm.loserId;
          ucl.finished = true;
          ucl.qualifications = { champion: ucl.winner };
          awardChampionTrophy(ucl);
        } else {
          ensureKnockoutNext(ucl, i);
        }
      }
    }
  }

  function awardChampionTrophy(ucl) {
    if (!ucl || !ucl.winner) return;
    const team = db.getTeamById(ucl.winner);
    if (team && cupEngine.awardTrophy) cupEngine.awardTrophy(team, TROPHY_UCL);
  }

  function nextFixture(ucl, teamId) {
    if (!ucl) return null;
    if (ucl.phase === 'groups') {
      for (const j of ucl.groupJornadas) {
        for (const m of j.matches) {
          if (m.played) continue;
          if (m.homeId === teamId || m.awayId === teamId) return m;
        }
      }
    } else if (ucl.knockout) {
      for (const r of ucl.knockout.rounds) {
        for (const m of r.matches) {
          if (m.played || m.winnerId) continue;
          if (m.homeId === teamId || m.awayId === teamId) return m;
        }
      }
    }
    return null;
  }

  // Aplica el resultado de un partido jugado por el usuario (de cualquier fase).
  function applyResult(ucl, match, result) {
    if (!ucl || !match) return;
    cupEngine.applyMatchResult(match, result);
    if (ucl.phase === 'groups' && match.groupId) {
      recordGroupResult(ucl, match);
      if (allGroupsComplete(ucl)) buildKnockout(ucl);
      return;
    }
    if (ucl.phase === 'knockout' && ucl.knockout) {
      const rounds = ucl.knockout.rounds;
      const idx = rounds.findIndex(r => r.matches.indexOf(match) !== -1);
      if (idx !== -1) {
        const r = rounds[idx];
        if (r.round !== 'Final') cupEngine.resolveSfTie({ rounds }, match.tieId);
        else cupEngine.resolveSingleMatch(match);
        if (r.matches.every(m => m.winnerId)) {
          if (r.round === 'Final') {
            const fm = r.matches[0];
            ucl.winner = fm.winnerId;
            ucl.runnerUp = fm.loserId;
            ucl.finished = true;
            ucl.qualifications = { champion: ucl.winner };
            awardChampionTrophy(ucl);
          } else {
            ensureKnockoutNext(ucl, idx);
          }
        }
      }
    }
  }

  // Semana del próximo partido europeo sin jugar del equipo (0 si no tiene ninguno).
  function userFixtureWeek(ucl, teamId) {
    if (!ucl) return 0;
    if (ucl.phase === 'groups') {
      for (const j of ucl.groupJornadas) {
        for (const m of j.matches) {
          if (m.played) continue;
          if (m.homeId === teamId || m.awayId === teamId) return j.week;
        }
      }
    } else if (ucl.knockout) {
      for (const r of ucl.knockout.rounds) {
        for (const m of r.matches) {
          if (m.played || m.winnerId) continue;
          if (m.homeId === teamId || m.awayId === teamId) return r.week;
        }
      }
    }
    return 0;
  }

  // ---------- Torneos especiales (MVP) ----------
  function buildSuperCupPanel(season) {
    return {
      id: SUPER_CUP, name: 'Supercopa de Europa', shortName: 'SUP',
      type: 'continental', country: 'Europa', season,
      panel: 'pending', // se activa en la Fase 2 (UEL)
      winner: null, runnerUp: null, finished: false
    };
  }

  function buildDirectCup(id, name, shortName, season, teamIds) {
    const rng = cupEngine.mulberry32(hashStr(id + ':' + season));
    let alive = cupEngine.shuffle(cupEngine.seededSorted(teamIds), rng);
    const rounds = [];
    const names = ['Cuartos de final', 'Semifinal', 'Final'];
    let i = 0;
    while (alive.length > 1 && i < names.length) {
      const matches = [];
      for (let k = 0; k < alive.length; k += 2) matches.push(makeMatch(alive[k], alive[k + 1]));
      const round = { round: names[i], matches, winner: null };
      for (const m of round.matches) cupEngine.resolveSingleMatch(m);
      round.winner = round.matches.map(m => m.winnerId);
      rounds.push(round);
      alive = round.winner;
      i++;
    }
    const cup = {
      id, name, shortName, type: 'continental', country: 'Europa', season,
      rounds, winner: alive[0] || null, runnerUp: null, finished: true, qualifications: {}
    };
    if (cup.winner) {
      const team = db.getTeamById(cup.winner);
      if (team && cupEngine.awardTrophy) cupEngine.awardTrophy(team, TROPHY_INTERCONTINENTAL);
    }
    return cup;
  }

  // Construye los torneos continentales para la temporada `season` (participantes por mérito
  // doméstico actual). Idempotente para la temporada en curso.
  function buildSeason(season, opts) {
    if (!CONTINENTALS_ENABLED) return null;
    opts = opts || {};
    if (gameState.seasons[UCL] && gameState.seasons[UCL].season === season && !opts.force) return gameState.seasons[UCL];
    const ucl = buildChampionsLeague(season, opts);
    if (ucl) gameState.seasons[UCL] = ucl;
    return ucl;
  }

  // Cierre de temporada: captura la clasificación doméstica final (las ligas aún no se han
  // reiniciado) y regenera la UCL + construye la Copa Intercontinental de la FIFA para la
  // próxima temporada.
  function seasonEnd() {
    if (!CONTINENTALS_ENABLED) return;
    const next = (gameState.currentSeason || 1) + 1;
    const ucl = buildChampionsLeague(next);
    if (ucl) gameState.seasons[UCL] = ucl;

    const winners = [];
    for (const compId of domesticLeagueCompIds()) {
      const se = gameState.seasons[compId];
      if (se) {
        const top = window.PocketManager.season.sortedStandings(se)[0];
        if (top) winners.push(top.teamId);
      }
    }
    if (ucl && ucl.winner) winners.push(ucl.winner);
    const europeTop = (db.europeTeams || []).slice()
      .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)))
      .slice(0, 4 - winners.length)
      .map(t => t.id);
    const pool = winners.concat(europeTop).filter(Boolean).slice(0, 8);
    while (pool.length < 8) {
      const extras = (db.europeTeams || []).map(t => t.id).filter(id => pool.indexOf(id) === -1);
      if (!extras.length) break;
      pool.push(extras[pool.length % extras.length]);
    }
    if (pool.length >= 8) {
      gameState.seasons[CLUB_WORLD_CUP] = buildDirectCup(CLUB_WORLD_CUP, 'Copa Intercontinental de la FIFA', 'INTER', next, pool.slice(0, 8));
    }
    gameState.seasons[SUPER_CUP] = buildSuperCupPanel(next);
  }

  // Avanza la jornada europea de la semana actual para todos los torneos continentales.
  function advanceWeekForAll(week, opts) {
    if (!CONTINENTALS_ENABLED) return;
    const comps = [UCL, CLUB_WORLD_CUP];
    for (const id of comps) {
      const t = gameState.seasons[id];
      if (t && t.type === 'continental' && !t.finished && t.rounds === undefined) advanceWeek(t, week, opts);
    }
  }

  window.PocketManager.continentalEngine = {
    UCL, SUPER_CUP, CLUB_WORLD_CUP, TROPHY_INTERCONTINENTAL, CONTINENTALS_ENABLED,
    GROUP_WEEKS, QF_WEEKS, SF_WEEKS, FINAL_WEEK,
    buildChampionsLeague,
    buildSuperCupPanel,
    buildSeason,
    advanceWeek,
    advanceWeekForAll,
    nextFixture,
    applyResult,
    userFixtureWeek,
    classifyGroup,
    seasonEnd
  };
})();
