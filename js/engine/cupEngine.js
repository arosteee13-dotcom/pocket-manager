(function () {
  // Motor de copas (eliminatorias): Copa del Rey y Supercopa de España.
  //
  // Copa del Rey (calendario semanal, 39 semanas):
  //   - Fase previa (solo divisiones inferiores, automática): semanas 4, 6, 8 (slot1).
  //   - Fase final (los equipos de Primera entran en 1/16): 1/16@15, 1/8@17,
  //     Cuartos@19 (slot1), Semifinal Ida@21, Semifinal Vuelta@24 (slot1, agregado →
  //     gol visitante → penaltis) y Final@32 (slot2). Partidos únicos con desempate
  //     90' → prórroga → penaltis. El campeón obtiene plaza de Europa League; campeón y
  //     subcampeón clasifican a la Supercopa de España de la temporada siguiente.
  //
  // Supercopa de España (semana 18, enero):
  //   - Clasificados: campeón/subcampeón de liga + campeón/subcampeón de Copa (previos).
  //   - Semifinal A: Campeón de Liga vs Subcampeón de Copa.
  //   - Semifinal B: Campeón de Copa vs Subcampeón de Liga (duplicados → 3º/4º de Liga).
  //   - Semifinales a partido único (slot1) → Final a partido único (slot2).
  const db = window.PocketManager.db;
  const TROPHY_COPA = 'Copa del Rey';
  const TROPHY_SUPER = 'Supercopa de España';

  // ---------- Utilidades ----------
  function nextPowerOfTwo(n) {
    let p = 1;
    while (p < n) p *= 2;
    return p;
  }

  // Nombre de la ronda a partir del número de partidos de la ronda completa.
  function roundNameForMatches(matches) {
    if (matches === 1) return 'Final';
    if (matches === 2) return 'Semifinal';
    if (matches === 4) return 'Cuartos de final';
    if (matches === 8) return '1/8';
    if (matches === 16) return '1/16';
    return '1/' + matches;
  }

  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function hashStr(s) {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function shuffle(list, rng) {
    const a = [...list];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Rating general de un equipo por su id (proxy: ovr estático del club).
  function ratingOf(teamId) {
    const t = db.getTeamById(teamId);
    return t ? Number(t.ovr || 0) : 0;
  }

  function clamp(n, lo, hi) {
    return Math.max(lo, Math.min(hi, n));
  }

  // Sembrado: equipos ordenados por rating descendente (los fuertes descansan).
  function seededSorted(ids) {
    return [...ids].sort((a, b) => (ratingOf(b) - ratingOf(a)) || String(a).localeCompare(String(b)));
  }

  function isPrimera(team) {
    return !team.division || team.division === 'primera';
  }

  // ---------- Resolución de empates ----------
  // Goles en la prórroga (30 min) ponderados por el rating.
  function etGoals(power, oppPower, rng) {
    const ratio = power + oppPower > 0 ? power / (power + oppPower) : 0.5;
    let g = 0;
    for (let i = 0; i < 3; i++) {
      if (rng() < 0.30 * ratio) g++;
    }
    return g;
  }

  function shootout(teamA, teamB, rng) {
    const conv = (id) => clamp(0.5, 0.95, 0.58 + (ratingOf(id) - 60) * 0.008);
    let a = 0, b = 0;
    for (let i = 0; i < 5; i++) {
      if (rng() < conv(teamA)) a++;
      if (rng() < conv(teamB)) b++;
    }
    let guard = 0;
    while (a === b && guard++ < 100) {
      if (rng() < conv(teamA)) a++;
      if (rng() < conv(teamB)) b++;
    }
    return { home: a, away: b, winnerId: a > b ? teamA : teamB, loserId: a > b ? teamB : teamA };
  }

  // Desempate de un partido único: prórroga y, si sigue igual, penaltis.
  function resolveSingleTie(homeId, awayId) {
    const rng = mulberry32(hashStr(homeId + '|' + awayId) ^ Math.floor(Math.random() * 0x7fffffff));
    const hp = ratingOf(homeId), ap = ratingOf(awayId);
    const et = { home: etGoals(hp, ap, rng), away: etGoals(ap, hp, rng) };
    if (et.home !== et.away) {
      return { etGoals: et, penalties: null, winnerId: et.home > et.away ? homeId : awayId, loserId: et.home > et.away ? awayId : homeId };
    }
    const pen = shootout(homeId, awayId, rng);
    return { etGoals: et, penalties: pen, winnerId: pen.winnerId, loserId: pen.loserId };
  }

  // ---------- Partidos ----------
  function makeMatch(homeId, awayId, leg, tieId) {
    return {
      homeId, awayId,
      homeGoals: null, awayGoals: null,
      played: false,
      leg: leg || null,
      tieId: tieId || null,
      etGoals: null,
      penalties: null,
      winnerId: null,
      loserId: null,
      summary: null
    };
  }

  function teamOf(id) {
    return db.getTeamById(id);
  }

  // Simulación instantánea de respaldo (si no existe matchSim).
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
    // Las copas auto-simuladas no registran stats de jugador: evita que la fase previa de la
    // Copa del Rey (jugada al iniciar partida, antes de la liga) inflen partidos/goles.
    if (window.PocketManager.simulateInstant && home && away) {
      return window.PocketManager.simulateInstant(home, away, { recordStats: false });
    }
    return simpleSim(home, away);
  }

  function applyMatchResult(match, result) {
    match.homeGoals = result.homeGoals;
    match.awayGoals = result.awayGoals;
    match.played = true;
    if (window.PocketManager.calendar && window.PocketManager.calendar.buildMatchSummary) {
      try { match.summary = window.PocketManager.calendar.buildMatchSummary(result.events); } catch (e) {}
    }
    // Stamina tras el partido simulado (minutos jugados)
    if (window.PocketManager.staminaEngine && result.minutesPlayed) {
      const home = teamOf(match.homeId), away = teamOf(match.awayId);
      if (home) window.PocketManager.staminaEngine.applyMatchStamina(home, result.minutesPlayed[home.id]);
      if (away) window.PocketManager.staminaEngine.applyMatchStamina(away, result.minutesPlayed[away.id]);
    }
    return match;
  }

  function playMatch(match) {
    const home = teamOf(match.homeId), away = teamOf(match.awayId);
    if (!home || !away) return;
    applyMatchResult(match, simulate(home, away));
  }

  // Resuelve el ganador de un partido único (prórroga + penaltis si hay empate).
  function resolveSingleMatch(match) {
    if (match.winnerId) return match.winnerId;
    if (!match.played) playMatch(match);
    if (match.homeGoals === match.awayGoals) {
      const r = resolveSingleTie(match.homeId, match.awayId);
      match.etGoals = r.etGoals;
      match.penalties = r.penalties;
      match.winnerId = r.winnerId;
      match.loserId = r.loserId;
    } else {
      match.winnerId = match.homeGoals > match.awayGoals ? match.homeId : match.awayId;
      match.loserId = match.homeGoals > match.awayGoals ? match.awayId : match.homeId;
    }
    return match.winnerId;
  }

  // ---------- Rondas ----------
  // Construye una ronda de partido único con `numByes` equipos descansando (los más fuertes).
  function buildRound(cup, roundName, alive, numByes, atWeek, slot) {
    const rng = mulberry32(hashStr(cup.id + ':' + cup.season + ':' + roundName));
    const sorted = seededSorted(alive);
    const byes = numByes > 0 ? sorted.slice(0, numByes) : [];
    const playing = shuffle(sorted.slice(numByes), rng);
    const matches = [];
    for (let i = 0; i < playing.length; i += 2) {
      matches.push(makeMatch(playing[i], playing[i + 1]));
    }
    const round = { round: roundName, atWeek: atWeek || 0, slot: slot || 1, semis: false, byes, matches, completed: false };
    cup.rounds.push(round);
    syncJornadas(cup);
    return round;
  }

  // Construye una pierna (ida o vuelta) de la Semifinal. La ida guarda los emparejamientos
  // en cup._sfTies para que la vuelta invierta la localía.
  function buildSfLeg(cup, roundName, atWeek, slot, leg, pairings) {
    const rng = mulberry32(hashStr(cup.id + ':' + cup.season + ':' + roundName));
    const matches = [];
    const ties = pairings || [];
    ties.forEach((t, i) => {
      const [a, b] = t;
      const tieId = 'sf' + (i + 1);
      if (leg === 1) {
        matches.push(makeMatch(a, b, 1, tieId));
      } else {
        matches.push(makeMatch(b, a, 2, tieId));
      }
    });
    const round = { round: roundName, atWeek: atWeek || 0, slot: slot || 1, semis: true, byes: [], matches, completed: false };
    cup.rounds.push(round);
    syncJornadas(cup);
    return round;
  }

  function syncJornadas(cup) {
    cup.jornadas = cup.rounds.map((r, i) => ({ jornada: i + 1, matches: r.matches }));
  }

  function roundComplete(round) {
    return round.matches.every(m => m.winnerId);
  }

  // Resuelve una eliminatoria de semifinal por agregado (gol visitante → penaltis).
  // Busca las dos piernas (ida y vuelta) en todas las rondas.
  function resolveSfTie(cup, tieId) {
    const legs = [];
    for (const r of cup.rounds) {
      for (const m of r.matches) {
        if (m.tieId === tieId) legs.push(m);
      }
    }
    if (legs.length !== 2 || legs.some(m => !m.played)) return;
    const l1 = legs.find(m => m.leg === 1), l2 = legs.find(m => m.leg === 2);
    if (!l1 || !l2 || l1.winnerId) return;
    const teamA = l1.homeId, teamB = l1.awayId;
    const aggA = l1.homeGoals + l2.awayGoals;
    const aggB = l1.awayGoals + l2.homeGoals;
    let winnerId, loserId;
    if (aggA > aggB) { winnerId = teamA; loserId = teamB; }
    else if (aggB > aggA) { winnerId = teamB; loserId = teamA; }
    else {
      // Empate a agregado: gol visitante
      const awayA = l2.awayGoals, awayB = l1.awayGoals;
      if (awayA > awayB) { winnerId = teamA; loserId = teamB; }
      else if (awayB > awayA) { winnerId = teamB; loserId = teamA; }
      else {
        const r = resolveSingleTie(teamA, teamB);
        l2.etGoals = r.etGoals;
        l2.penalties = r.penalties;
        winnerId = r.winnerId; loserId = r.loserId;
      }
    }
    l1.winnerId = winnerId; l2.winnerId = winnerId;
    l1.loserId = loserId; l2.loserId = loserId;
  }

  // Avanza los ganadores de una ronda y construye la siguiente (o declara campeón).
  function finalizeRound(cup, idx) {
    const round = cup.rounds[idx];
    if (round.completed) return;
    if (!roundComplete(round)) return;
    const winners = new Set(round.byes || []);
    for (const m of round.matches) if (m.winnerId) winners.add(m.winnerId);
    cup.alive = [...winners];
    round.completed = true;

    // Supercopa: estructura propia (SF → Final).
    if (cup.id === 'supercopa_de_espana') {
      if (idx === 0) {
        const final = cup.rounds[1];
        if (final) {
          final.matches[0].homeId = round.matches[0] ? round.matches[0].winnerId : null;
          final.matches[0].awayId = round.matches[1] ? round.matches[1].winnerId : null;
        }
      } else if (idx === 1) {
        const fm = round.matches[0];
        cup.winner = fm ? fm.winnerId : cup.alive[0];
        cup.runnerUp = fm ? fm.loserId : null;
        cup.finished = true;
      }
      return;
    }

    // Las rondas preliminares (fase previa) las gestiona buildPreliminary.
    const start = cup.phase2Start !== undefined ? cup.phase2Start : cup.rounds.length;
    if (idx < start) return;
    const planIdx = idx - start;
    if (planIdx === MAIN_PLAN.length - 1) {
      const finalMatch = round.matches[0];
      cup.winner = finalMatch ? finalMatch.winnerId : cup.alive[0];
      cup.runnerUp = finalMatch ? finalMatch.loserId : null;
      cup.finished = true;
      cup.qualifications = { europaLeague: cup.winner };
    } else {
      ensureNextRound(cup, planIdx + 1);
    }
  }

  // Juega una ronda. Con opts.skipTeamId se respeta el partido pendiente de ese equipo
  // (el usuario lo jugará en su semana; si la semana pasa, advanceCups lo auto-simula).
  function playRound(cup, idx, opts) {
    opts = opts || {};
    const round = cup.rounds[idx];
    if (!round || round.completed) return;
    for (const m of round.matches) {
      if (m.winnerId) continue;
      if (opts.skipTeamId && !m.played && (m.homeId === opts.skipTeamId || m.awayId === opts.skipTeamId)) continue;
      if (round.semis) {
        if (!m.played) playMatch(m);
        resolveSfTie(cup, m.tieId);
      } else {
        resolveSingleMatch(m);
      }
    }
    finalizeRound(cup, idx);
  }

  function roundIndexForMatch(cup, match) {
    return cup.rounds.findIndex(r => r.matches.indexOf(match) !== -1);
  }

  // ---------- Construcción de la Copa ----------
  // Fase previa: reduce las divisiones inferiores hasta 12 supervivientes (auto-simulada).
  // 12 + 20 de Primera = 32 → la fase final arranca limpia en 1/16.
  function buildPreliminary(cup, lowerIds, totalTeams) {
    const target = 12;
    const weeks = [4, 6, 8]; // semanas de la fase previa (invisible para el usuario de Primera)
    let alive = seededSorted(lowerIds);
    let i = 0;
    while (alive.length > target) {
      const t = alive.length <= 2 * target ? target : Math.floor(nextPowerOfTwo(alive.length) / 2);
      const byes = Math.max(0, 2 * t - alive.length);
      const name = i < 3
        ? '1/' + Math.floor(nextPowerOfTwo(totalTeams) / Math.pow(2, i + 1))
        : 'Fase previa';
      buildRound(cup, name, alive, byes, weeks[Math.min(i, weeks.length - 1)], 1);
      playRound(cup, cup.rounds.length - 1);
      alive = cup.alive;
      i++;
    }
    return alive;
  }

  // Plan de la fase final (los equipos de Primera entran en 1/16).
  // target = número de supervivientes tras la ronda; at = semana en la que se juega.
  const MAIN_PLAN = [
    { type: 'single', target: 16, at: 15, slot: 1, name: '1/16' },
    { type: 'single', target: 8, at: 17, slot: 1, name: '1/8' },
    { type: 'single', target: 4, at: 19, slot: 1, name: 'Cuartos de final' },
    { type: 'sf', at: 21, slot: 1, name: 'Semifinal Ida' },
    { type: 'sf', at: 24, slot: 1, name: 'Semifinal Vuelta' },
    { type: 'single', target: 1, at: 32, slot: 2, name: 'Final' }
  ];

  // Construye la siguiente ronda de la fase final (justo a tiempo, cuando se conocen los vencedores).
  function ensureNextRound(cup, planIdx) {
    if (planIdx >= MAIN_PLAN.length) return;
    const start = cup.phase2Start !== undefined ? cup.phase2Start : 0;
    const abs = start + planIdx;
    if (cup.rounds[abs]) return;
    const plan = MAIN_PLAN[planIdx];
    const alive = cup.alive;
    if (!alive || !alive.length) return;

    if (plan.type === 'single') {
      if (alive.length <= plan.target) return;
      const byes = Math.max(0, 2 * plan.target - alive.length);
      buildRound(cup, plan.name, alive, byes, plan.at, plan.slot);
      return;
    }

    // Semifinal: construye las dos piernas juntas (ida y vuelta), con los mismos cruces.
    if (alive.length !== 4) return;
    const rng = mulberry32(hashStr(cup.id + ':' + cup.season + ':Semifinal'));
    const shuffled = shuffle(seededSorted(alive), rng);
    const pairings = [[shuffled[0], shuffled[1]], [shuffled[2], shuffled[3]]];
    buildSfLeg(cup, 'Semifinal Ida', MAIN_PLAN[3].at, MAIN_PLAN[3].slot, 1, pairings);
    buildSfLeg(cup, 'Semifinal Vuelta', MAIN_PLAN[4].at, MAIN_PLAN[4].slot, 2, pairings);
  }

  function buildCup(teamIds, opts) {
    opts = opts || {};
    const season = opts.season || 1;
    const teams = teamIds.map(teamOf).filter(Boolean);
    const primera = teams.filter(isPrimera).map(t => t.id);
    const lower = teams.filter(t => !isPrimera(t)).map(t => t.id);

    const cup = {
      id: opts.id || 'copa_del_rey',
      name: opts.name || 'Copa del Rey',
      type: 'cup',
      country: opts.country || 'España',
      season,
      rounds: [],
      jornadas: [],
      alive: [],
      winner: null,
      runnerUp: null,
      finished: false,
      qualifications: {}
    };

    // Fase previa: divisiones inferiores (se juega al instante).
    const survivors = buildPreliminary(cup, lower, teamIds.length);

    // Fase final: entran los de Primera en 1/16.
    cup.phase2Start = cup.rounds.length;
    cup.alive = seededSorted(survivors.concat(primera));
    ensureNextRound(cup, 0);

    return cup;
  }

  // ---------- Interacción con el usuario ----------
  // Próximo partido de copa sin jugar del equipo.
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

  // Aplica el resultado de un partido jugado por el usuario y, si la ronda se completa, avanza.
  function applyCupResult(cup, match, result) {
    if (!cup || !match) return;
    const idx = roundIndexForMatch(cup, match);
    if (idx === -1) return;
    const round = cup.rounds[idx];
    applyMatchResult(match, result);
    if (round.semis) {
      resolveSfTie(cup, match.tieId);
    } else {
      resolveSingleMatch(match);
    }
    if (roundComplete(round)) finalizeRound(cup, idx);
  }

  // ---------- Supercopa de España ----------
  // leagueTop: clasificación de la liga anterior (1º, 2º, 3º…).
  // cupFinalists: [campeón de Copa, subcampeón de Copa].
  function buildSupercopa(leagueTop, cupFinalists, opts) {
    opts = opts || {};
    const league = (leagueTop || []).filter(Boolean);
    const cupFin = (cupFinalists || []).filter(Boolean);
    if (league.length < 2 || cupFin.length < 2) return null;

    // Cuatro plazas distintas: campeón/subcampeón de liga + campeón/subcampeón de copa.
    // Los duplicados se cubren con el siguiente clasificado de la liga (3º, 4º…).
    const result = [];
    const add = (id) => { if (id && result.indexOf(id) === -1) result.push(id); };
    add(league[0]);
    add(league[1]);
    add(cupFin[0]);
    add(cupFin[1]);
    for (const t of league) { add(t); if (result.length >= 4) break; }
    for (const f of cupFin) { add(f); if (result.length >= 4) break; }
    if (result.length < 4) return null;

    const [A, B, C, D] = result;
    const supercopa = {
      id: opts.id || 'supercopa_de_espana',
      name: opts.name || 'Supercopa de España',
      type: 'cup',
      country: opts.country || 'España',
      season: opts.season || 1,
      rounds: [],
      jornadas: [],
      alive: [],
      winner: null,
      runnerUp: null,
      finished: false,
      qualifications: {}
    };
    const rng = mulberry32(hashStr('supercopa:' + supercopa.season));
    const h = (x, y) => (rng() < 0.5 ? makeMatch(x, y, null, 'spa') : makeMatch(y, x, null, 'spb'));
    // Semifinal A: Campeón de Liga (A) vs Subcampeón de Copa (D).
    // Semifinal B: Campeón de Copa (C) vs Subcampeón de Liga (B).
    supercopa.rounds.push({ round: 'Semifinal', atWeek: 18, slot: 1, semis: false, byes: [], matches: [h(A, D), h(C, B)], completed: false });
    supercopa.rounds.push({ round: 'Final', atWeek: 18, slot: 2, semis: false, byes: [], matches: [makeMatch(null, null)], completed: false });
    syncJornadas(supercopa);
    return supercopa;
  }

  // ---------- Trofeos ----------
  function awardTrophy(team, name) {
    if (!team) return null;
    const trophies = team.trophies || (team.trophies = []);
    let entry = trophies.find(t => t.name === name);
    if (entry) {
      entry.count = (entry.count || 0) + 1;
    } else {
      entry = { name, count: 1 };
      trophies.push(entry);
    }
    return { team, trophyName: name, count: entry.count };
  }

  function awardCupTrophy(cup) {
    if (!cup || !cup.winner) return null;
    return awardTrophy(teamOf(cup.winner), TROPHY_COPA);
  }

  function awardSupercopaTrophy(supercopa) {
    if (!supercopa || !supercopa.winner) return null;
    return awardTrophy(teamOf(supercopa.winner), TROPHY_SUPER);
  }

  // Trofeo genérico por id de competición (usado por el integrador de app.js).
  function awardCompetitionTrophy(cup) {
    if (!cup) return null;
    if (cup.id === 'supercopa_de_espana') return awardSupercopaTrophy(cup);
    return awardCupTrophy(cup);
  }

  window.PocketManager.cupEngine = {
    nextPowerOfTwo,
    roundNameForMatches,
    buildCup,
    buildSupercopa,
    playRound,
    applyCupResult,
    nextFixture,
    awardTrophy,
    awardCupTrophy,
    awardSupercopaTrophy,
    awardCompetitionTrophy,
    // Helpers de bajo nivel compartidos (usados por el motor de copas de Inglaterra).
    makeMatch,
    teamOf,
    applyMatchResult,
    resolveSingleMatch,
    resolveSingleTie,
    resolveSfTie,
    buildSfLeg,
    syncJornadas,
    roundComplete,
    seededSorted,
    shuffle,
    mulberry32,
    TROPHY_COPA,
    TROPHY_SUPER
  };
})();
