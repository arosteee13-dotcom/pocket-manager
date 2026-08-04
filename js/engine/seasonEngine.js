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

  // Evalúa a todos los jugadores de los equipos dados, registra los cambios y resetea stats.
  function updatePlayerRatingsAtSeasonEnd(teams) {
    const changes = [];
    for (const team of teams) {
      if (!team || !team.players) continue;
      for (const p of team.players) {
        const s = statsOf(p);
        const apps = s.apps || 0;
        const avg = avgRatingOf(p);
        const delta = deltaFor(p, apps, avg);
        if (delta !== 0) {
          const from = p.ovr;
          p.ovr = clamp((p.ovr || 0) + delta);
          if (p.ovr !== from) {
            changes.push({
              playerId: p.id,
              name: p.name,
              flag: p.flag || '',
              team: team.name,
              from,
              to: p.ovr,
              delta: p.ovr - from
            });
          }
        }
        // Reset para la siguiente temporada
        s.apps = 0;
        s.goals = 0;
        s.assists = 0;
        s.ratingSum = 0;
        s.yellows = 0;
        s.reds = 0;
      }
    }
    return changes;
  }

  // Nombre del trofeo de liga según el país (para sumar al palmarés del campeón).
  const LEAGUE_TROPHY_NAMES = { 'España': 'Primera División', 'Inglaterra': 'Premier League' };

  function leagueTrophyNameFor(team) {
    const db = window.PocketManager.db;
    const country = db.getCountryData(team.id);
    if (country) {
      // El trofeo depende de la liga del equipo (p. ej. LaLiga Hypermotion).
      const comp = (db.getCompetitions(country.country) || []).find(c => c.type === 'league' && c.teams && c.teams.some(t => t.id === team.id));
      if (comp && String(comp.id || '').indexOf('hypermotion') !== -1) return 'LaLiga Hypermotion';
      return LEAGUE_TROPHY_NAMES[country.country] || country.leagueName;
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
    updatePlayerRatingsAtSeasonEnd,
    avgRatingOf,
    awardLeagueTitle
  };
})();
