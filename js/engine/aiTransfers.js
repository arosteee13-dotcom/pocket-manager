(function () {
  const db = window.PocketManager.db;

  function groupOf(pos) {
    if (pos === 'POR') return 'POR';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'DEF';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'MED';
    return 'DEL';
  }

  const GROUPS = ['POR', 'DEF', 'MED', 'DEL'];

  // Jugadores "disponibles" de un equipo para jugar (sin lesionados ni cedidos fuera)
  function availablePlayers(team) {
    return team.players.filter(p => {
      if (window.PocketManager.isInjured && window.PocketManager.isInjured(p)) return false;
      if (window.PocketManager.isLoanedOut && window.PocketManager.isLoanedOut(team, p)) return false;
      return true;
    });
  }

  // Necesidades del club: posiciones con <2 jugadores disponibles, o cuyo mejor OVR
  // está por debajo de la media del club. Si no hay necesidad clara, se busca una mejora
  // notable y asequible para alguna posición.
  function needsOf(team) {
    const players = availablePlayers(team);
    const counts = { POR: 0, DEF: 0, MED: 0, DEL: 0 };
    const bestOvr = { POR: 0, DEF: 0, MED: 0, DEL: 0 };
    let sum = 0;
    for (const p of players) {
      const g = groupOf(p.pos);
      counts[g]++;
      sum += p.ovr;
      if (p.ovr > bestOvr[g]) bestOvr[g] = p.ovr;
    }
    const avg = players.length ? sum / players.length : 0;
    const needs = GROUPS.filter(g => counts[g] < 2 || (counts[g] > 0 && bestOvr[g] < avg - 5));

    // Si no hay posición débil, reforzar comprando una mejora clara (+2 OVR) y asequible
    if (!needs.length) {
      for (const g of GROUPS) {
        if (counts[g] === 0) { needs.push(g); break; }
        const target = pickTarget(team, g);
        if (target && target.player.ovr >= bestOvr[g] + 2) { needs.push(g); break; }
      }
    }
    return needs;
  }

  // Jugadores que acaban de cambiar de club (últimos 6 traspasos).
  // La IA no los vuelve a fichar de inmediato para evitar idas y venidas irreales.
  function recentlyMovedIds() {
    const list = (window.PocketManager.gameState && window.PocketManager.gameState.transfers) || [];
    const set = new Set();
    for (let i = Math.max(0, list.length - 6); i < list.length; i++) set.add(list[i].playerId);
    return set;
  }

  // Mejor jugador disponible para reforzar la posición, de otros clubes (nunca del equipo del usuario),
  // dentro del presupuesto del club.
  function pickTarget(team, group) {
    const userTeam = window.PocketManager.gameState ? window.PocketManager.gameState.team : null;
    const moved = recentlyMovedIds();
    let best = null;
    for (const other of db.getAllTeams()) {
      if (other.id === team.id) continue;
      if (userTeam && other.id === userTeam.id) continue;
      for (const p of other.players) {
        if (moved.has(p.id)) continue;
        if (groupOf(p.pos) !== group) continue;
        if (window.PocketManager.isInjured && window.PocketManager.isInjured(p)) continue;
        if ((p.value || 0) > team.budget) continue;
        if (!best || p.ovr > best.player.ovr) best = { player: p, seller: other };
      }
    }
    return best;
  }

  // Ejecuta fichajes automáticos de los clubes de la IA.
  // `limit`: número máximo de traspasos en esta ejecución.
  function runAITransfers(limit) {
    const userTeam = window.PocketManager.gameState ? window.PocketManager.gameState.team : null;
    const teams = db.getAllTeams().filter(t => !userTeam || t.id !== userTeam.id);
    // Barajar el orden para que no siempre actúen los mismos clubes
    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = teams[i]; teams[i] = teams[j]; teams[j] = tmp;
    }

    let done = 0;
    const max = Math.max(0, Number(limit) || 0);
    for (const team of teams) {
      if (done >= max) break;
      if (!window.PocketManager.executeTransfer) break;
      if (team.players.length >= 40) continue;
      if (!team.budget || team.budget <= 0) continue;

      const needs = needsOf(team);
      if (!needs.length) continue;

      const group = needs[Math.floor(Math.random() * needs.length)];
      const target = pickTarget(team, group);
      if (!target) continue;

      const res = window.PocketManager.executeTransfer(team, target.seller, target.player, target.player.value);
      if (res && res.ok) done++;
    }
    return done;
  }

  window.PocketManager.runAITransfers = runAITransfers;
})();
