(function () {
  // Estado global de la partida.
  const gameState = {
    manager: null,
    team: null,
    currentSeason: 1,
    currentDate: null,
    season: null,
    seasons: {},
    transfers: []
  };

  function setManager(manager) {
    gameState.manager = manager;
  }

  function setTeam(team) {
    gameState.team = team;
  }

  function getCurrentTeam() {
    return gameState.team;
  }

  window.PocketManager.gameState = gameState;
  window.PocketManager.setManager = setManager;
  window.PocketManager.setTeam = setTeam;
  window.PocketManager.getCurrentTeam = getCurrentTeam;
})();
