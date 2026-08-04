(function () {
  // Motor de plantilla: asignación inteligente de dorsales y validación de alineación.
  // El dorsal de un jugador se guarda en su campo `number` ('' si no tiene).

  const db = window.PocketManager.db;

  function hasNumber(player) {
    return !!(player && player.number !== undefined && player.number !== null && player.number !== '');
  }

  // Dorsales lógicos por posición (orden de prioridad dentro de cada bucket).
  // Cada lista combina los dorsales primarios y secundarios en orden de preferencia;
  // MCD/MC comparten lista, ED/EI comparten lista, LD/CAD y LI/CAI comparten lista.
  const PRIORITY_BUCKETS = [
    { positions: ['POR'], numbers: [1, 13, 25] },
    { positions: ['LD', 'CAD'], numbers: [2, 12, 16, 18, 20, 22] },
    { positions: ['LI', 'CAI'], numbers: [3, 12, 16, 17, 18, 20, 22] },
    { positions: ['DFC'], numbers: [3, 4, 5, 12, 14, 15, 20, 23, 24] },
    { positions: ['MCD', 'MC'], numbers: [6, 8, 14, 15, 16, 18, 20, 21] },
    { positions: ['MD'], numbers: [7, 14, 16, 17, 18, 20, 22] },
    { positions: ['MI'], numbers: [11, 14, 16, 17, 18, 20, 22] },
    { positions: ['MCO'], numbers: [10, 14, 15, 18, 20, 21, 23] },
    { positions: ['ED', 'EI'], numbers: [7, 11, 17, 19, 20, 22] },
    { positions: ['DC'], numbers: [9, 11, 14, 19, 21, 22] }
  ];

  const byOvrDesc = (a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id));

  function isLoanedOutOf(team, player) {
    const isLoanedOut = window.PocketManager.isLoanedOut;
    return isLoanedOut ? isLoanedOut(team, player) : false;
  }

  // Número libre más bajo en [min..99], con preferencia 1-25 antes que 26+.
  function lowestFree(used, start) {
    let n = start;
    while (used.has(String(n)) && n <= 99) n++;
    return n > 99 ? null : n;
  }

  function firstFree(used) {
    const in1to25 = lowestFree(used, 1);
    if (in1to25 !== null && in1to25 <= 25) return in1to25;
    const from26 = lowestFree(used, 26);
    return from26 !== null ? from26 : in1to25;
  }

  // Asigna dorsales únicos a los jugadores del equipo que NO tienen dorsal.
  // Preserva los ya asignados (estáticos o del usuario) y solo rellena huecos;
  // si dos jugadores comparten número, el de menor prioridad pasa al libre más bajo.
  function assignAutomaticNumbers(team) {
    if (!team || !Array.isArray(team.players)) return 0;

    const players = team.players.filter(p => !isLoanedOutOf(team, p));
    const used = new Set();

    const claim = (p, n) => {
      if (n === null || n === undefined) return false;
      if (used.has(String(n))) return false;
      p.number = n;
      used.add(String(n));
      return true;
    };

    // 1) Registrar dorsales ya asignados, detectando duplicados.
    const byNumber = {};
    for (const p of players) {
      if (hasNumber(p)) {
        const key = String(p.number);
        if (byNumber[key]) {
          byNumber[key].push(p);
        } else {
          byNumber[key] = [p];
        }
      }
    }
    for (const key of Object.keys(byNumber)) {
      const group = byNumber[key].sort(byOvrDesc);
      claim(group[0], Number(key));
      for (let i = 1; i < group.length; i++) {
        const free = firstFree(used);
        claim(group[i], free);
      }
    }

    // 2) Asignar por buckets de posición (mejor OVR primero → prioridad lógica).
    //    Dentro de cada bucket se consume la lista (primarios + secundarios) en orden,
    //    saltando los números ya ocupados; si la lista se agota, se usa el libre más bajo.
    for (const bucket of PRIORITY_BUCKETS) {
      const inBucket = (p) => bucket.positions.indexOf(p.pos) !== -1;
      const unassigned = players.filter(p => !hasNumber(p) && inBucket(p)).sort(byOvrDesc);
      let pi = 0;
      for (const p of unassigned) {
        let assigned = false;
        while (pi < bucket.numbers.length && used.has(String(bucket.numbers[pi]))) pi++;
        if (pi < bucket.numbers.length) {
          assigned = claim(p, bucket.numbers[pi]);
          pi++;
        }
        if (!assigned) claim(p, firstFree(used));
      }
    }

    // 3) Pasada final: posiciones sin prioridad (CAI/CAD/MI/MD...) con el libre más bajo.
    const remaining = players.filter(p => !hasNumber(p)).sort(byOvrDesc);
    for (const p of remaining) claim(p, firstFree(used));

    return players.filter(p => hasNumber(p)).length;
  }

  // Devuelve null si todo el once + convocados tiene dorsal; si no, el primer infractor.
  function validateMatchDorsals(team) {
    if (!team || !Array.isArray(team.players)) return null;
    const getSquadState = window.PocketManager.getSquadState;
    let ids = [];
    if (getSquadState) {
      try {
        const squad = getSquadState(team);
        ids = (squad.startingIds || []).concat(squad.subIds || []);
      } catch (e) {
        ids = team.players.map(p => p.id);
      }
    } else {
      ids = team.players.map(p => p.id);
    }
    const seen = new Set();
    for (const id of ids) {
      if (seen.has(id)) continue;
      seen.add(id);
      const p = team.players.find(x => String(x.id) === String(id));
      if (p && !hasNumber(p)) return { player: p };
    }
    return null;
  }

  // Rellena los dorsales de todos los equipos (para el arranque de partida y la carga).
  function ensureAllTeamsDorsals() {
    let total = 0;
    if (db && db.getAllTeams) {
      for (const t of db.getAllTeams()) total += assignAutomaticNumbers(t);
    }
    return total;
  }

  // Inserta a `player` en la plantilla de `team` en su sección correcta por posición
  // (POR -> DEF -> MED -> DEL), en vez de añadirlo al final. Así un fichaje/cesión/
  // retorno no aparece "abajo del todo" en la plantilla.
  function insertPlayerByPosition(team, player) {
    if (!team || !Array.isArray(team.players) || !player) return team;
    const posRankOf = window.PocketManager.posRankOf;
    const rankOf = (p) => (posRankOf ? posRankOf(p) : 99);
    const rank = rankOf(player);
    let idx = team.players.length;
    for (let i = 0; i < team.players.length; i++) {
      if (rankOf(team.players[i]) > rank) { idx = i; break; }
    }
    team.players.splice(idx, 0, player);
    return team;
  }

  window.PocketManager.squadEngine = {
    hasNumber,
    assignAutomaticNumbers,
    validateMatchDorsals,
    ensureAllTeamsDorsals,
    insertPlayerByPosition
  };
})();
