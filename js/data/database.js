(function () {
  const spainData = window.PocketManager.spainData;
  const englandData = window.PocketManager.englandData;
  const hypermotionData = window.PocketManager.hypermotionData;

  // Competiciones de copa por país (además de su liga). España tiene la Copa del Rey y la
  // Supercopa; Inglaterra tiene Community Shield, EFL Cup, FA Cup y EFL Trophy.
  const CUP_COMPETITIONS = {
    'España': [
      { id: 'copa_del_rey', name: 'Copa del Rey', type: 'cup' },
      { id: 'supercopa_de_espana', name: 'Supercopa de España', type: 'cup' }
    ],
    'Inglaterra': [
      { id: 'community_shield', name: 'Community Shield', type: 'cup' },
      { id: 'efl_cup', name: 'EFL Cup', type: 'cup' },
      { id: 'fa_cup', name: 'FA Cup', type: 'cup' },
      { id: 'efl_trophy', name: 'EFL Trophy', type: 'cup' }
    ]
  };

  class Database {
    constructor() {
      this.countries = [spainData, englandData];
      // Segundas ligas (LaLiga Hypermotion): segunda división española jugable.
      this.leagues = [hypermotionData].filter(Boolean);
      // Divisiones inferiores: viven en cada fichero de país (divisionTeams) y participan en
      // las copas de su país, pero no en la liga principal (country.teams sigue siendo la liga).
      this.divisionTeams = (spainData.divisionTeams || []).concat(englandData.divisionTeams || []);
    }

    // Obtener todos los países disponibles
    getCountries() {
      return this.countries.map(c => ({ id: c.country, name: c.country, league: c.leagueName }));
    }

    // Obtener todos los equipos de un país específico (solo la liga principal)
    getTeamsByCountry(countryName) {
      const data = this.countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
      return data ? data.teams : [];
    }

    // Obtener las competiciones de un país: sus ligas + copas (con su `type`).
    getCompetitions(countryName) {
      const data = this.countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
      if (!data) return [];
      const comps = [{
        id: data.country.toLowerCase().replace(/\s+/g, '_') + '_league',
        name: data.leagueName,
        type: 'league',
        teams: data.teams
      }];
      // Segundas ligas del país (p. ej. LaLiga Hypermotion en España).
      for (const l of this.leagues || []) {
        if (l.country === data.country) {
          const slug = String(l.leagueName).toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
          comps.push({ id: data.country.toLowerCase().replace(/\s+/g, '_') + '_' + slug + '_league', name: l.leagueName, type: 'league', teams: l.teams });
        }
      }
      const cups = (CUP_COMPETITIONS[data.country] || []);
      for (const cup of cups) {
        comps.push({ ...cup, country: data.country, teams: this.getCupParticipants(data.country) });
      }
      return comps;
    }

    // ¿Es una competición de copa (eliminatorias) y no una liga?
    isCupCompetition(comp) {
      return !!(comp && comp.type === 'cup');
    }

    // Equipos que participan en las copas de un país: la liga + las segundas ligas + divisiones.
    getCupParticipants(countryName) {
      const data = this.countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
      if (!data) return [];
      const isSpain = data.country === 'España';
      const isEngland = data.country === 'Inglaterra';
      const divisions = this.divisionTeams.filter(t => (isSpain && ['1rfef', '2rfef'].indexOf(t.division) !== -1) ||
        (isEngland && ['championship', 'league1', 'league2', 'academy'].indexOf(t.division) !== -1));
      const leagues = (this.leagues || []).filter(l => l.country === data.country);
      return data.teams.concat(leagues.flatMap(l => l.teams), divisions);
    }

    // Buscar un equipo por su ID único (incluye segundas ligas y divisiones inferiores)
    getTeamById(teamId) {
      for (const country of this.countries) {
        const team = country.teams.find(t => t.id === teamId);
        if (team) return team;
      }
      for (const league of this.leagues || []) {
        const team = league.teams.find(t => t.id === teamId);
        if (team) return team;
      }
      for (const team of this.divisionTeams) {
        if (team.id === teamId) return team;
      }
      return null;
    }

    // País/liga al que pertenece un equipo (null si no se encuentra).
    // Un equipo de segundas ligas o divisiones inferiores pertenece a su país.
    getCountryData(teamId) {
      for (const country of this.countries) {
        if (country.teams.some(t => t.id === teamId)) return country;
      }
      for (const league of this.leagues || []) {
        if (league.teams.some(t => t.id === teamId)) {
          return this.countries.find(c => c.country === league.country) || null;
        }
      }
      for (const team of this.divisionTeams) {
        if (team.id === teamId) return String(teamId).indexOf('eng_') === 0 ? englandData : spainData;
      }
      return null;
    }

    // Obtener una lista global de todos los equipos del juego (incluye segundas ligas y divisiones)
    getAllTeams() {
      return this.countries.flatMap(c => c.teams).concat((this.leagues || []).flatMap(l => l.teams), this.divisionTeams);
    }

    // Jugadores propiedad de `teamId` cedidos a OTROS equipos (con club destino)
    getLoanedOut(teamId) {
      const result = [];
      for (const team of this.getAllTeams()) {
        for (const p of team.players) {
          const l = p.loan;
          if (l && l.isLoaned && l.parentTeam === teamId && l.currentTeam !== teamId) {
            const dest = this.getTeamById(l.currentTeam);
            result.push({ player: p, destination: dest ? dest.name : l.currentTeam });
          }
        }
      }
      return result;
    }

    // Final de temporada: devuelve todos los cedidos a su club propietario
    returnLoans() {
      const loans = [];
      for (const team of this.getAllTeams()) {
        for (const p of team.players) {
          const l = p.loan;
          if (l && l.isLoaned && l.parentTeam !== l.currentTeam) {
            loans.push({ player: p, fromTeamId: team.id, toTeamId: l.parentTeam });
          }
        }
      }
      for (const { player, fromTeamId, toTeamId } of loans) {
        const from = this.getTeamById(fromTeamId);
        const to = this.getTeamById(toTeamId);
        if (from && to) {
          from.players = from.players.filter(x => x !== player);
          // Libera el dorsal en el club de destino y restaura el previo (si lo había).
          if (window.PocketManager.loanEngine && window.PocketManager.loanEngine.freeDorsalOnReturn) {
            try { window.PocketManager.loanEngine.freeDorsalOnReturn(player); } catch (e) {}
          }
          player.loan = null;
          // Insertar en la sección correcta de la plantilla del club propietario.
          if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.insertPlayerByPosition) {
            try { window.PocketManager.squadEngine.insertPlayerByPosition(to, player); } catch (e) { to.players.push(player); }
          } else {
            to.players.push(player);
          }
        }
      }
      return loans.length;
    }
  }

  window.PocketManager.Database = Database;
  window.PocketManager.db = new Database();
})();
