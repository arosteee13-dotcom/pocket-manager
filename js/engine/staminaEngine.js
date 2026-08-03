(function () {
  // Pérdidas de stamina por partido (rangos en %)
  const FIELD_LOSS = [12, 18];
  const GK_LOSS = [3, 5];

  function clamp(n) {
    return Math.max(0, Math.min(100, n));
  }

  function randRange(a, b) {
    return a + Math.random() * (b - a);
  }

  function isInjured(p) {
    return !!(p && p.injury && p.injury.isInjured);
  }

  function isSuspended(p) {
    return !!(p && p.suspension && p.suspension.isSuspended);
  }

  function isUnavailable(p) {
    return isInjured(p) || isSuspended(p);
  }

  // Asigna una lesión aleatoria al jugador
  function randomizeInjury(p) {
    const grave = Math.random() < 0.35;
    const weeksLeft = grave ? 4 + Math.floor(Math.random() * 3) : 1 + Math.floor(Math.random() * 3);
    p.injury = { isInjured: true, weeksLeft, type: grave ? 'Grave' : 'Muscular' };
    return p.injury;
  }

  // Al empezar una nueva carrera: todos los jugadores al 100% de stamina, sin lesiones ni sanciones
  function resetFitness(team) {
    for (const p of team.players) {
      p.stamina = 100;
      delete p.injury;
      delete p.suspension;
      delete p._sentOff;
      delete p._injuredInMatch;
    }
  }

  // Factor de fatiga según el estilo de juego: ofensivo cansa más, defensivo menos
  function styleFatigueMultiplier(team) {
    const style = window.PocketManager.getTeamStyle ? window.PocketManager.getTeamStyle(team) : 'Equilibrado';
    if (style === 'Ofensivo') return 1.15;
    if (style === 'Defensivo') return 0.85;
    return 1.0;
  }

  // Tras un partido: reduce stamina según minutos jugados y posición.
  // Los jugadores de campo pierden más/menos según el estilo (ofensivo/equilibrado/defensivo).
  // minutesMap: { playerId: minutos }
  function applyMatchStamina(team, minutesMap) {
    const mult = styleFatigueMultiplier(team);
    for (const p of team.players) {
      const mins = minutesMap ? (minutesMap[p.id] || 0) : 0;
      if (mins <= 0) continue;
      if (p.pos === 'POR') {
        p.stamina = clamp(p.stamina - randRange(GK_LOSS[0], GK_LOSS[1]));
      } else {
        const ratio = Math.min(1, mins / 90);
        p.stamina = clamp(p.stamina - randRange(FIELD_LOSS[0], FIELD_LOSS[1]) * ratio * mult);
      }
    }
  }

  // Paso del tiempo entre jornadas: reduce lesiones y sanciones (no la stamina)
  function applyWeeklyRecovery(teams, weeks) {
    weeks = Math.max(1, Math.floor(weeks || 1));
    for (const team of teams) {
      if (!team || !team.players) continue;
      for (const p of team.players) {
        if (isInjured(p)) {
          p.injury.weeksLeft -= weeks;
          if (p.injury.weeksLeft <= 0) delete p.injury;
        }
        if (isSuspended(p)) {
          p.suspension.matchesLeft -= weeks;
          if (p.suspension.matchesLeft <= 0) delete p.suspension;
        }
      }
    }
  }

  // Recuperación de stamina entre jornadas: campo +15% por semana, porteros al 100%.
  // Se aplica ANTES de cada partido (para que tras el anterior la fatiga sea visible).
  function recoverStamina(teams, weeks) {
    weeks = Math.max(1, Math.floor(weeks || 1));
    for (const team of teams) {
      if (!team || !team.players) continue;
      for (const p of team.players) {
        if (p.pos === 'POR') p.stamina = 100;
        else p.stamina = clamp(p.stamina + 15 * weeks);
      }
    }
  }

  window.PocketManager.staminaEngine = {
    isInjured,
    isSuspended,
    isUnavailable,
    randomizeInjury,
    resetFitness,
    applyMatchStamina,
    applyWeeklyRecovery,
    recoverStamina
  };
})();
