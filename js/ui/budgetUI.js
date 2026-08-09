(function () {
  // Botón de presupuesto del header: muestra el presupuesto actual en un badge y abre un
  // modal con el desglose de ingresos (ventas) y gastos (fichajes) de la temporada actual.
  const gameState = window.PocketManager.gameState;

  function getTeam() {
    return gameState.team || null;
  }

  // Presupuesto abreviado con 2 decimales en millones (€25,43M), igual que el valor de mercado.
  function fmtShort(n) {
    const v = Number(n || 0);
    if (v >= 1e9) return `€${(v / 1e9).toFixed(2).replace('.', ',')}B`;
    if (v >= 1e6) return `€${(v / 1e6).toFixed(2).replace('.', ',')}M`;
    return `€${window.PocketManager.thousands(v)}`;
  }

  // Presupuesto exacto con separador de miles (€25.432.000).
  function fmtExact(n) {
    return `€${window.PocketManager.thousands(n)}`;
  }

  // Movimientos del equipo del usuario en la temporada actual.
  // Venta: fromTeamId === mi equipo (beneficio); Fichaje: toTeamId === mi equipo (gasto).
  function computeBudget() {
    const team = getTeam();
    const out = { budget: team ? team.budget : 0, income: 0, incomeCount: 0, expenses: 0, expenseCount: 0, items: [] };
    if (!team) return out;
    const list = (gameState.transfers || []).filter(t => t.season === gameState.currentSeason &&
      (t.fromTeamId === team.id || t.toTeamId === team.id));
    for (const t of list) {
      const isSale = t.fromTeamId === team.id;
      const rival = isSale ? t.toTeamName : t.fromTeamName;
      const fee = Number(t.fee) || 0;
      if (isSale) {
        out.income += fee;
        out.incomeCount++;
        out.items.push({ playerName: t.playerName, type: 'sale', fee, sign: '+', rival });
      } else {
        out.expenses += fee;
        out.expenseCount++;
        out.items.push({ playerName: t.playerName, type: 'buy', fee, sign: '-', rival });
      }
    }
    // Movimientos más recientes primero.
    out.items.reverse();
    return out;
  }

  function updateBudgetBadge() {
    const badge = document.getElementById('budget-badge');
    if (!badge) return;
    const team = getTeam();
    badge.textContent = team ? fmtShort(team.budget) : '€—';
  }

  function renderBudget() {
    const body = document.getElementById('budget-list');
    if (!body) return;
    const data = computeBudget();

    const currentEl = document.getElementById('budget-current');
    if (currentEl) currentEl.textContent = fmtExact(data.budget);
    const incEl = document.getElementById('budget-income');
    if (incEl) incEl.innerHTML = `<b>${fmtShort(data.income)}</b><span>${data.incomeCount} venta${data.incomeCount === 1 ? '' : 's'}</span>`;
    const expEl = document.getElementById('budget-expenses');
    if (expEl) expEl.innerHTML = `<b>${fmtShort(data.expenses)}</b><span>${data.expenseCount} fichaje${data.expenseCount === 1 ? '' : 's'}</span>`;

    if (!data.items.length) {
      body.innerHTML = '<p class="budget-empty">Sin movimientos de mercado esta temporada.</p>';
      return;
    }
    body.innerHTML = data.items.map(it => `
      <div class="budget-item ${it.type}">
        <span class="budget-item-player">${it.playerName}</span>
        <span class="budget-item-rival">${it.rival || ''}</span>
        <span class="budget-item-fee">${it.sign} ${fmtShort(it.fee)}</span>
      </div>`).join('');
  }

  function openBudget() {
    const modal = document.getElementById('budget-modal');
    if (!modal) return;
    renderBudget();
    modal.classList.add('open');
  }

  function closeBudget() {
    const modal = document.getElementById('budget-modal');
    if (modal) modal.classList.remove('open');
  }

  function initBudget() {
    const btn = document.getElementById('btn-budget-quick');
    if (btn) btn.addEventListener('click', openBudget);
    const close = document.getElementById('budget-modal-close');
    if (close) close.addEventListener('click', closeBudget);
    const modal = document.getElementById('budget-modal');
    if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeBudget(); });
    updateBudgetBadge();
  }

  window.PocketManager.initBudget = initBudget;
  window.PocketManager.updateBudgetBadge = updateBudgetBadge;
})();
