(function () {
  // Rotaciones de la CPU: ajusta la alineación de los equipos controlados por la IA
  // antes de cada partido en función de la stamina de sus titulares y de las semanas
  // con doble partido. El equipo del usuario nunca se toca.
  const gameState = window.PocketManager.gameState;

  function groupOf(pos) {
    if (pos === 'POR') return 'POR';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'DEF';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'MED';
    return 'DEL';
  }

  function isPOR(p) {
    return !!(p && p.pos === 'POR');
  }

  function staminaOf(p) {
    const s = Number(p.stamina);
    return isFinite(s) ? s : 100;
  }

  // ¿Hay una ronda de copa pendiente en la semana actual? Si es así, los equipos de la
  // liga juegan copa + liga esa semana (doble partido).
  function isDoubleWeek() {
    const calendar = window.PocketManager.calendar;
    const team = gameState.team;
    if (!calendar || !team) return false;
    let week = 0;
    try { week = calendar.currentUserWeek(team.id); } catch (e) {}
    if (!week) return false;
    const seasons = gameState.seasons || {};
    for (const key in seasons) {
      const cup = seasons[key];
      if (!cup || cup.type !== 'cup' || cup.finished || !cup.rounds) continue;
      for (const r of cup.rounds) {
        if (!r.completed && Number(r.atWeek) === Number(week)) return true;
      }
    }
    return false;
  }

  // Mejor suplente compatible con la posición del titular (misma posición exacta o
  // misma línea), excluyendo a los no disponibles y a los ya usados en esta rotación.
  function pickSub(subs, starter, unavailable, usedIn, usedOut) {
    const exact = subs.filter(p => p.pos === starter.pos && !usedIn.has(p.id) && !unavailable(p));
    const line = subs.filter(p => !usedIn.has(p.id) && !unavailable(p) && groupOf(p.pos) === groupOf(starter.pos) && !isPOR(p));
    const pool = exact.length ? exact : line;
    if (!pool.length) return null;
    return pool.sort((a, b) => b.ovr - a.ovr)[0];
  }

  // Aplica 1-2 rotaciones en el once de un equipo de la CPU.
  // Prioriza titulares con stamina < 85%; si no hay ninguno pero es doble semana, rota a
  // los de menor energía. Sustituye SIEMPRE por suplentes de la misma posición/línea.
  function prepareCpuLineup(team, opts) {
    opts = opts || {};
    if (!team || !team.players) return;
    if (gameState.team && gameState.team.id === team.id) return; // nunca el equipo del usuario
    const PM = window.PocketManager;
    if (!PM.getSquadState || !PM.refreshLineup || !PM.isUnavailable) return;

    const squad = PM.getSquadState(team);
    if (!squad || !squad.startingIds || !squad.subIds) return;

    const unavailable = (p) => { try { return PM.isUnavailable(p); } catch (e) { return false; } };
    const resolve = (ids) => ids.map(id => team.players.find(p => p.id === id)).filter(Boolean);

    const starters = resolve(squad.startingIds);
    const subs = resolve(squad.subIds);
    if (starters.length < 11) return;

    const doubleWeek = !!(opts.doubleWeek !== undefined ? opts.doubleWeek : isDoubleWeek());
    const tired = starters.filter(p => !isPOR(p) && staminaOf(p) < 85);
    const shouldRotate = doubleWeek || tired.length > 0;
    if (!shouldRotate) return;

    // 1-2 rotaciones aleatorias.
    const maxRot = Math.random() < 0.5 ? 1 : 2;
    const usedIn = new Set();
    const usedOut = new Set();

    // Prioridad 1: titulares cansados (los de menor stamina primero).
    const tiredSorted = tired.sort((a, b) => staminaOf(a) - staminaOf(b));
    for (const p of tiredSorted) {
      if (usedOut.size >= maxRot) break;
      const sub = pickSub(subs, p, unavailable, usedIn, usedOut);
      if (!sub) continue;
      swapStarters(squad, p.id, sub.id);
      usedOut.add(p.id);
      usedIn.add(sub.id);
    }

    // Prioridad 2: si es doble semana y quedan rotaciones, descansa a los de menor energía.
    if (usedOut.size < maxRot) {
      const rest = starters.filter(p => !isPOR(p) && !usedOut.has(p.id))
        .sort((a, b) => staminaOf(a) - staminaOf(b));
      for (const p of rest) {
        if (usedOut.size >= maxRot) break;
        const sub = pickSub(subs, p, unavailable, usedIn, usedOut);
        if (!sub) continue;
        swapStarters(squad, p.id, sub.id);
        usedOut.add(p.id);
        usedIn.add(sub.id);
      }
    }

    // Reconstruye banquillo y descarta no disponibles sin tocar el once elegido.
    try { PM.refreshLineup(team); } catch (e) {}
  }

  // Intercambia un titular por un suplente dentro del estado de convocatoria cacheado.
  function swapStarters(squad, outId, inId) {
    const si = squad.startingIds.indexOf(outId);
    const bi = squad.subIds.indexOf(inId);
    if (si === -1 || bi === -1) return;
    squad.startingIds[si] = inId;
    squad.subIds[bi] = outId;
  }

  window.PocketManager.aiEngine = {
    prepareCpuLineup,
    isDoubleWeek
  };
})();
