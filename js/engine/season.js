(function () {
  const db = window.PocketManager.db;

  function teamsOf(team) {
    const country = db.getCountryData(team.id);
    return country ? country.teams : [];
  }

  // Round-robin de una vuelta (método del círculo). Devuelve array de rondas,
  // cada ronda es un array de { homeId, awayId }.
  function roundRobin(ids) {
    const teams = [...ids];
    if (teams.length % 2 === 1) teams.push(null); // jornada de descanso
    const rounds = teams.length - 1;
    const half = teams.length / 2;
    const result = [];
    for (let r = 0; r < rounds; r++) {
      const round = [];
      for (let i = 0; i < half; i++) {
        const home = teams[i];
        const away = teams[teams.length - 1 - i];
        if (home && away) round.push({ homeId: home, awayId: away });
      }
      result.push(round);
      const last = teams[teams.length - 1];
      for (let i = teams.length - 1; i > 1; i--) teams[i] = teams[i - 1];
      teams[1] = last;
    }
    return result;
  }

  function emptyStandings(teams) {
    const st = {};
    for (const t of teams) {
      st[t.id] = { teamId: t.id, pts: 0, pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0 };
    }
    return st;
  }

  function initSeason(team) {
    const teams = teamsOf(team);
    const ids = teams.map(t => t.id);
    const first = roundRobin(ids);
    const jornadas = [];
    const toMatch = (m) => ({ homeId: m.homeId, awayId: m.awayId, homeGoals: null, awayGoals: null, played: false });
    first.forEach((r, i) => {
      jornadas.push({ jornada: i + 1, matches: r.map(toMatch) });
    });
    const off = first.length;
    first.forEach((r, i) => {
      jornadas.push({ jornada: off + i + 1, matches: r.map(m => toMatch({ homeId: m.awayId, awayId: m.homeId })) });
    });
    const form = {};
    ids.forEach(id => { form[id] = []; });
    return { standings: emptyStandings(teams), form, jornadas };
  }

  // Primer partido sin jugar del equipo
  function nextFixture(season, teamId) {
    if (!season || !season.jornadas) return null;
    for (const j of season.jornadas) {
      for (const m of j.matches) {
        if (!m.played && (m.homeId === teamId || m.awayId === teamId)) {
          return { jornada: j.jornada, match: m, isHome: m.homeId === teamId };
        }
      }
    }
    return null;
  }

  function applyMatchResult(season, match, homeGoals, awayGoals) {
    match.homeGoals = homeGoals;
    match.awayGoals = awayGoals;
    match.played = true;

    const update = (id, gf, ga, res) => {
      const s = season.standings[id];
      if (!s) return;
      s.pj++;
      s.gf += gf;
      s.gc += ga;
      if (res === 'W') { s.g++; s.pts += 3; }
      else if (res === 'D') { s.e++; s.pts += 1; }
      else { s.p++; }
      const form = season.form[id] || (season.form[id] = []);
      form.push(res);
      if (form.length > 5) form.shift();
    };

    if (homeGoals > awayGoals) {
      update(match.homeId, homeGoals, awayGoals, 'W');
      update(match.awayId, awayGoals, homeGoals, 'L');
    } else if (homeGoals < awayGoals) {
      update(match.awayId, awayGoals, homeGoals, 'W');
      update(match.homeId, homeGoals, awayGoals, 'L');
    } else {
      update(match.homeId, homeGoals, awayGoals, 'D');
      update(match.awayId, awayGoals, homeGoals, 'D');
    }
  }

  function sortedStandings(season) {
    if (!season || !season.standings) return [];
    return Object.values(season.standings)
      .sort((a, b) => b.pts - a.pts || ((b.gf - b.gc) - (a.gf - a.gc)) || b.gf - a.gf || a.teamId.localeCompare(b.teamId));
  }

  function positionOf(season, teamId) {
    const list = sortedStandings(season);
    for (let i = 0; i < list.length; i++) {
      if (list[i].teamId === teamId) return i + 1;
    }
    return 0;
  }

  function formOf(season, teamId) {
    return season && season.form ? (season.form[teamId] || []) : [];
  }

  // Última jornada en la que el equipo ha disputado un partido (0 si no ha jugado)
  function lastPlayedJornada(season, teamId) {
    if (!season || !season.jornadas) return 0;
    let last = 0;
    for (const j of season.jornadas) {
      for (const m of j.matches) {
        if (m.played && (m.homeId === teamId || m.awayId === teamId)) last = j.jornada;
      }
    }
    return last;
  }

  window.PocketManager.season = {
    initSeason,
    nextFixture,
    applyMatchResult,
    sortedStandings,
    positionOf,
    formOf,
    lastPlayedJornada
  };
})();
