(function () {
  const spainData = window.PocketManager.spainData;
  const englandData = window.PocketManager.englandData;

  class Database {
    constructor() {
      this.countries = [spainData, englandData];
    }

    // Obtener todos los países disponibles
    getCountries() {
      return this.countries.map(c => ({ id: c.country, name: c.country, league: c.leagueName }));
    }

    // Obtener todos los equipos de un país específico
    getTeamsByCountry(countryName) {
      const data = this.countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
      return data ? data.teams : [];
    }

    // Obtener las competiciones de una liga (una por liga, con sus equipos)
    getCompetitions(countryName) {
      const data = this.countries.find(c => c.country.toLowerCase() === countryName.toLowerCase());
      if (!data) return [];
      return [{
        id: data.country.toLowerCase().replace(/\s+/g, '_') + '_league',
        name: data.leagueName,
        teams: data.teams
      }];
    }

    // Buscar un equipo por su ID único
    getTeamById(teamId) {
      for (const country of this.countries) {
        const team = country.teams.find(t => t.id === teamId);
        if (team) return team;
      }
      return null;
    }

    // País/liga al que pertenece un equipo (null si no se encuentra)
    getCountryData(teamId) {
      for (const country of this.countries) {
        if (country.teams.some(t => t.id === teamId)) return country;
      }
      return null;
    }

    // Obtener una lista global de todos los equipos del juego
    getAllTeams() {
      return this.countries.flatMap(c => c.teams);
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
          player.loan = null;
          to.players.push(player);
        }
      }
      return loans.length;
    }
  }

  window.PocketManager.Database = Database;
  window.PocketManager.db = new Database();
})();
