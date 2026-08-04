(function () {
  // Motor de cesiones: gestión de dorsales cuando un jugador es cedido.
  // El dorsal vive en el campo `number` del jugador; el club actual en `loan.currentTeam`.

  // Al ceder un jugador al club `buyer`, le asigna un dorsal libre en ese club.
  // Guarda el dorsal previo en `loan.prevNumber` por si interesa restaurarlo.
  function assignDorsalOnLoan(buyer, player) {
    if (!buyer || !player) return false;
    const hasNumber = window.PocketManager.squadEngine
      ? window.PocketManager.squadEngine.hasNumber
      : (p) => !!(p && p.number !== undefined && p.number !== null && p.number !== '');
    if (!player.loan) player.loan = {};
    if (hasNumber(player)) player.loan.prevNumber = player.number;
    // Limpia el dorsal del club de origen y deja que el destino asigne uno libre.
    player.number = '';
    const assign = window.PocketManager.squadEngine
      ? window.PocketManager.squadEngine.assignAutomaticNumbers
      : null;
    if (assign) assign(buyer);
    return hasNumber(player);
  }

  // Al terminar la cesión, libera el dorsal en el club de destino.
  // (El jugador ya se elimina del array del destino, con lo que el número queda
  // libre automáticamente; aquí se limpia el campo para que el club propietario
  // pueda reasignarlo sin colisiones.)
  function freeDorsalOnReturn(player) {
    if (!player) return;
    const prev = player.loan && player.loan.prevNumber !== undefined ? player.loan.prevNumber : '';
    player.number = prev !== '' && prev !== null ? prev : '';
  }

  window.PocketManager.loanEngine = {
    assignDorsalOnLoan,
    freeDorsalOnReturn
  };
})();
