(function () {
  // Motor de evolución de jugadores a fin de temporada.
  // Evalúa a cada jugador según edad, nota media (ratingSum/apps) y partidos jugados,
  // ajusta su OVR (límites 45-99) y resetea sus estadísticas para la nueva temporada.

  function statsOf(player) {
    const s = window.PocketManager.getPlayerStats ? window.PocketManager.getPlayerStats(player) : null;
    return s || { apps: 0, goals: 0, assists: 0, ratingSum: 0, yellows: 0, reds: 0 };
  }

  function avgRatingOf(player) {
    const s = statsOf(player);
    return s.apps > 0 ? s.ratingSum / s.apps : 0;
  }

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function clamp(n) {
    return Math.max(45, Math.min(99, n));
  }

  // Factor de revalorización del valor de mercado según el cambio de OVR y la edad.
  // Cada punto de media: subida ×1.12, bajada ×0.90 (potencia de |delta|). La edad modula:
  // los jóvenes revalorizan más al subir y pierden menos al bajar; los veteranos al revés.
  function valueFactor(delta, age) {
    const base = delta >= 0 ? 1.12 : 0.90;
    let mult = Math.pow(base, Math.abs(delta));
    if (delta > 0) {
      if (age <= 23) mult *= 1.15;
      else if (age <= 27) mult *= 1.08;
      else if (age <= 30) mult *= 1.0;
      else if (age <= 33) mult *= 0.92;
      else mult *= 0.85;
    } else if (delta < 0) {
      if (age <= 23) mult *= 0.95;
      else if (age <= 27) mult *= 0.98;
      else if (age <= 30) mult *= 1.0;
      else mult *= 1.08;
    }
    return mult;
  }

  // Devuelve el cambio de OVR según la edad y el rendimiento.
  function deltaFor(player, apps, avg) {
    if (player.age <= 29) {
      // Jugadores en crecimiento
      if (avg >= 7.5) return apps >= 10 ? randInt(2, 3) : 1;
      if (avg >= 6.3) return apps < 2 ? 0 : 1;
      // Nota baja o sin partidos: se mantiene o baja -1
      return Math.random() < 0.5 ? 0 : -1;
    }
    // Veteranos (30+)
    if (avg >= 7.5 && apps >= 15) return Math.random() < 0.5 ? 0 : 1;
    if (apps < 5) return -randInt(1, 3); // jugó muy pocos partidos
    if (avg >= 6.5) return -1; // declive natural leve
    return -randInt(1, 3); // nota baja
  }

  // Aplica la evolución de medias al cierre de temporada y guarda el cambio en cada
  // jugador (p.ovrDelta) y en gameState.ratingChanges para mostrarlo en las plantillas.
  // NO resetea las stats: eso ocurre en resetSeasonStats (después de cerrar todas las ligas).
  function applySeasonRatingChanges(teams) {
    const changes = [];
    const ratingChanges = {};
    for (const team of teams) {
      if (!team || !team.players) continue;
      for (const p of team.players) {
        const s = statsOf(p);
        const apps = s.apps || 0;
        const avg = avgRatingOf(p);
        const delta = deltaFor(p, apps, avg);
        const from = p.ovr || 0;
        const to = clamp(from + delta);
        p.ovr = to;
        p.ovrDelta = to - from;
        // Revalorización: el valor de mercado sigue el cambio de media ponderado por la edad.
        const valueFrom = p.value || 0;
        const valueTo = Math.max(20000, Math.round(valueFrom * valueFactor(p.ovrDelta, p.age)));
        p.value = valueTo;
        p.valueDelta = valueTo - valueFrom;
        ratingChanges[p.id] = {
          from, to, delta: p.ovrDelta, name: p.name, team: team.name,
          valueFrom, valueTo, valueDelta: p.valueDelta
        };
        if (p.ovrDelta !== 0) {
          changes.push({
            playerId: p.id,
            name: p.name,
            flag: p.flag || '',
            team: team.name,
            from,
            to: p.ovr,
            delta: p.ovrDelta
          });
        }
      }
    }
    const gs = window.PocketManager.gameState;
    if (gs) gs.ratingChanges = ratingChanges;
    return changes;
  }

  // Resetea las estadísticas de todos los jugadores para la nueva temporada.
  function resetSeasonStats(teams) {
    for (const team of teams) {
      if (!team || !team.players) continue;
      for (const p of team.players) {
        const s = statsOf(p);
        if (!s) continue;
        s.apps = 0;
        s.goals = 0;
        s.assists = 0;
        s.ratingSum = 0;
        s.yellows = 0;
        s.reds = 0;
      }
    }
  }

  // Nombre del trofeo de liga según el país (para sumar al palmarés del campeón).
  // Usa el nombre real de la competición (p. ej. "LaLiga EA Sports", "LaLiga Hypermotion",
  // "Premier League", "Serie A"); solo como último recurso cae al nombre de la liga del país.
  function leagueTrophyNameFor(team) {
    const db = window.PocketManager.db;
    const country = db.getCountryData(team.id);
    if (country) {
      const comp = (db.getCompetitions(country.country) || []).find(c => c.type === 'league' && c.teams && c.teams.some(t => t.id === team.id));
      if (comp && comp.name) return comp.name;
      return country.leagueName || 'Liga';
    }
    return 'Liga';
  }

  // Otorga el título de liga al campeón de la temporada y devuelve { team, trophyName, count }.
  function awardLeagueTitle(season) {
    if (!season || !season.standings) return null;
    const list = window.PocketManager.season.sortedStandings(season);
    if (!list || !list.length) return null;
    const championId = list[0].teamId;
    const champion = window.PocketManager.db.getTeamById(championId);
    if (!champion) return null;
    const trophyName = leagueTrophyNameFor(champion);
    const trophies = champion.trophies || (champion.trophies = []);
    let entry = trophies.find(t => t.name === trophyName);
    if (entry) {
      entry.count = (entry.count || 0) + 1;
    } else {
      entry = { name: trophyName, count: 1 };
      trophies.push(entry);
    }
    return { team: champion, trophyName, count: entry.count };
  }

  window.PocketManager.seasonEngine = {
    updatePlayerRatingsAtSeasonEnd: applySeasonRatingChanges,
    applySeasonRatingChanges,
    resetSeasonStats,
    avgRatingOf,
    awardLeagueTitle
  };
})();
