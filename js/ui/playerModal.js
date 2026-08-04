(function () {
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const formatBudget = window.PocketManager.formatBudget;
  const getRatingColor = window.PocketManager.getRatingColor;

  const state = { player: null, owner: null, offerOpen: false };

  function posGroup(pos) {
    if (pos === 'POR') return 'por';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'def';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'med';
    return 'del';
  }

  function footName(f) {
    if (f === 'Z') return 'Zurdo';
    if (f === 'A') return 'Ambidiestro';
    return 'Diestro';
  }

  function staminaColor(st) {
    if (st >= 75) return '#22c55e';
    if (st >= 50) return '#f59e0b';
    return '#ef4444';
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  function currentClubOf(player, owner) {
    if (window.PocketManager.isLoanedOut && window.PocketManager.isLoanedOut(owner, player) && player.loan && player.loan.currentTeam) {
      const dest = db.getTeamById(player.loan.currentTeam);
      if (dest) return dest;
    }
    return owner;
  }

  // Club del que viene cedido el jugador (padre de la cesión)
  function loanOriginClub(player) {
    const parent = player && player.loan && player.loan.parentTeam ? db.getTeamById(player.loan.parentTeam) : null;
    return parent ? `${parent.name} (${parent.shortName})` : (player && player.loan ? player.loan.parentTeam : '');
  }

  function healthHtml(player) {
    if (window.PocketManager.isInjured && window.PocketManager.isInjured(player)) {
      const w = player.injury.weeksLeft;
      return `<span class="pm-health inj">🔴 Lesionado (${w} semana${w === 1 ? '' : 's'})</span>`;
    }
    if (window.PocketManager.isSuspended && window.PocketManager.isSuspended(player)) {
      const m = player.suspension.matchesLeft;
      return `<span class="pm-health sus">🟥 Sancionado (${m} partido${m === 1 ? '' : 's'})</span>`;
    }
    return '<span class="pm-health ok">🟢 Disponible</span>';
  }

  function buildBody() {
    const { player: p, owner } = state;
    const rc = getRatingColor(p.ovr);
    const hasNum = p.number !== undefined && p.number !== null && p.number !== '';
    const st = (p.stamina !== undefined && p.stamina !== null) ? p.stamina : 100;
    const club = currentClubOf(p, owner);

    const isMine = !!(gameState.team && owner.id === gameState.team.id);
    const isLoanedOutP = isMine && window.PocketManager.isLoanedOut && window.PocketManager.isLoanedOut(owner, p);
    const isLoanedInP = isMine && window.PocketManager.isLoanedIn && window.PocketManager.isLoanedIn(owner, p);

    let actions;
    if (isMine) {
      if (isLoanedOutP) {
        actions = `<p class="pm-note">Cedido a ${club.name}. No está disponible para tu once.</p>`;
      } else if (isLoanedInP) {
        const inFirst = window.PocketManager.isPlayerInFirstTeam(owner, p.id);
        actions = `
          <p class="pm-note">Cedido de otro club. No puedes traspasarlo ni cederlo.</p>
          <div class="pm-squad-actions">
            <button class="btn pm-role-btn" id="pm-role">${inFirst ? 'BAJAR A RESERVAS' : 'SUBIR AL PRIMER EQUIPO'}</button>
          </div>`;
      } else {
        const inFirst = window.PocketManager.isPlayerInFirstTeam(owner, p.id);
        actions = `
          <div class="pm-squad-actions">
            <button class="pm-list-btn transfer${p.transferListed ? ' active' : ''}" id="pm-transfer">TRANSFERIBLE</button>
            <button class="pm-list-btn ced${p.loanListed ? ' active' : ''}" id="pm-ced">CEDIBLE</button>
            <button class="btn pm-role-btn" id="pm-role">${inFirst ? 'BAJAR A RESERVAS' : 'SUBIR AL PRIMER EQUIPO'}</button>
          </div>`;
      }
    } else {
      actions = `
        <button class="btn btn-primary" id="pm-offer">REALIZAR OFERTA DE TRASPASO</button>
        <button class="btn btn-secondary" id="pm-loan">PEDIR CESIÓN</button>`;
    }

    return `
      <div class="pm-head">
        <span class="pm-dorsal">${hasNum ? p.number : ''}</span>
        <span class="pm-title">${p.flag ? p.flag + ' ' : ''}${p.name}</span>
      </div>

      <div class="pm-stats">
        <span class="pm-ovr" style="background:${rc.bg}; color:${rc.color}">${p.ovr}</span>
        <span class="pm-stats-right">
          <span class="pos-pill ${posGroup(p.pos)}">${p.pos}</span>
          <span class="pm-meta">${p.age} años · ${footName(p.foot || 'D')}</span>
        </span>
      </div>

      <div class="pm-rows">
        <div><span>Valor de mercado</span><b>${window.PocketManager.formatValue(p.value)}</b></div>
        <div><span>Equipo actual</span><b>${club.name} (${club.shortName})</b></div>
        ${p.loan && p.loan.isLoaned ? `<div><span>Equipo procedente</span><b>${loanOriginClub(p)}</b></div>` : ''}
      </div>

      <div class="pm-divider"></div>
      <h4 class="pm-section">Estado físico</h4>
      <div class="pm-stamina">
        <span class="pm-stamina-label">Stamina</span>
        <span class="pm-stamina-track"><span class="pm-stamina-fill" style="width:${Math.min(100, Math.max(0, st))}%; background:${staminaColor(st)}"></span></span>
        <span class="pm-stamina-val">${Math.round(st)}%</span>
      </div>
      <div class="pm-health-row">${healthHtml(p)}</div>

      <div class="pm-actions" id="pm-actions">${actions}</div>
      ${state.offerOpen ? `
      <div class="pm-offer" id="pm-offer-box">
        <label class="pm-offer-label" for="pm-offer-input">Tu oferta (€)</label>
        <input type="number" id="pm-offer-input" class="text-input" min="0" step="1" value="${p.value}" inputmode="numeric">
        <div class="pm-offer-actions">
          <button class="btn btn-secondary btn-half" id="pm-offer-cancel">Cancelar</button>
          <button class="btn btn-primary btn-half" id="pm-offer-confirm">Confirmar oferta</button>
        </div>
        <p class="pm-msg" id="pm-msg"></p>
      </div>` : ''}`;
  }

  function bindActions() {
    const offerBtn = document.getElementById('pm-offer');
    if (offerBtn) offerBtn.addEventListener('click', () => { state.offerOpen = true; render(); const i = document.getElementById('pm-offer-input'); if (i) i.focus(); });

    const loanBtn = document.getElementById('pm-loan');
    if (loanBtn) loanBtn.addEventListener('click', requestLoan);

    const transferBtn = document.getElementById('pm-transfer');
    if (transferBtn) transferBtn.addEventListener('click', toggleTransfer);

    const cedBtn = document.getElementById('pm-ced');
    if (cedBtn) cedBtn.addEventListener('click', toggleCed);

    const roleBtn = document.getElementById('pm-role');
    if (roleBtn) roleBtn.addEventListener('click', toggleSection);

    const offerCancel = document.getElementById('pm-offer-cancel');
    if (offerCancel) offerCancel.addEventListener('click', () => { state.offerOpen = false; render(); });

    const offerConfirm = document.getElementById('pm-offer-confirm');
    if (offerConfirm) offerConfirm.addEventListener('click', confirmOffer);
  }

  function render() {
    const body = document.getElementById('pm-body');
    if (!body) return;
    body.innerHTML = buildBody();
    bindActions();
  }

  function setMsg(msg) {
    const el = document.getElementById('pm-msg');
    if (el) el.textContent = msg;
  }

  function confirmOffer() {
    const input = document.getElementById('pm-offer-input');
    const offer = Math.floor(Number(input ? input.value : 0));
    if (!offer || offer <= 0) { setMsg('Introduce una cantidad válida.'); return; }
    if (offer < state.player.value) {
      setMsg(`El club rechaza tu oferta de ${window.PocketManager.formatValue(offer)}. Valor de mercado: ${window.PocketManager.formatValue(state.player.value)}.`);
      return;
    }
    const res = window.PocketManager.executeTransfer(gameState.team, state.owner, state.player, offer);
    if (res && res.ok) {
      const name = state.player.name;
      closePlayerModal();
      showToast(`¡Fichaje completado! ${name}`);
      refreshAfterChange();
    } else {
      setMsg(res && res.reason ? res.reason : 'El club rechaza tu oferta.');
    }
  }

  function requestLoan() {
    const res = executeLoan(gameState.team, state.owner, state.player);
    if (res.ok) {
      const name = state.player.name;
      closePlayerModal();
      showToast(`¡Cesión completada! ${name} se une a tu plantilla`);
      refreshAfterChange();
    } else {
      setMsg(res.reason || 'El club rechaza la cesión.');
    }
  }

  function executeLoan(buyer, seller, player) {
    if (!buyer || !seller || !player) return { ok: false, reason: 'Datos inválidos' };
    if (buyer.id === seller.id) return { ok: false, reason: 'Mismo club' };
    if (window.PocketManager.isInjured && window.PocketManager.isInjured(player)) return { ok: false, reason: 'No se puede ceder a un jugador lesionado.' };
    if (window.PocketManager.getSquadState(seller).startingIds.indexOf(player.id) !== -1) return { ok: false, reason: 'El club rechaza la cesión: es un jugador clave de su once.' };
    const idx = seller.players.indexOf(player);
    if (idx === -1) return { ok: false, reason: 'Jugador no disponible' };
    seller.players.splice(idx, 1);
    player.loan = { isLoaned: true, parentTeam: seller.id, currentTeam: buyer.id };
    // Si el usuario cede a un jugador propio, guarda su línea base para mostrar solo las
    // estadísticas del periodo de cesión en la pestaña de cedidos.
    if (gameState.team && seller.id === gameState.team.id && window.PocketManager.getPlayerStats) {
      const b = window.PocketManager.getPlayerStats(player);
      player.loan.baselineStats = {
        apps: b.apps, goals: b.goals, assists: b.assists,
        ratingSum: b.ratingSum, yellows: b.yellows, reds: b.reds
      };
    }
    // Insertar en la sección correcta de la plantilla (no al final).
    if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.insertPlayerByPosition) {
      window.PocketManager.squadEngine.insertPlayerByPosition(buyer, player);
    } else {
      buyer.players.push(player);
    }
    // Dorsal en el club de destino: se limpia el del origen y se asigna uno libre.
    if (window.PocketManager.loanEngine && window.PocketManager.loanEngine.assignDorsalOnLoan) {
      try { window.PocketManager.loanEngine.assignDorsalOnLoan(buyer, player); } catch (e) {}
    }
    if (window.PocketManager.refreshLineup) {
      try { window.PocketManager.refreshLineup(buyer); } catch (e) {}
      try { window.PocketManager.refreshLineup(seller); } catch (e) {}
    }
    return { ok: true };
  }

  function toggleTransfer() {
    const p = state.player;
    p.transferListed = !p.transferListed;
    showToast(p.transferListed ? `${p.name} está en la lista de transferibles` : `${p.name} ya no está en la lista de transferibles`);
    render();
  }

  function toggleCed() {
    const p = state.player;
    p.loanListed = !p.loanListed;
    showToast(p.loanListed ? `${p.name} está en la lista de cedibles` : `${p.name} ya no está en la lista de cedibles`);
    render();
  }

  function toggleSection() {
    const team = gameState.team;
    if (!team) return;
    const inFirst = window.PocketManager.isPlayerInFirstTeam(team, state.player.id);
    const target = inFirst ? 'reserves' : 'first';
    const res = window.PocketManager.setPlayerSection
      ? window.PocketManager.setPlayerSection(team, state.player.id, target)
      : { ok: true };
    if (res && res.ok === false) {
      showToast(res.reason || 'No se puede cambiar la sección del jugador.');
      return;
    }
    const name = state.player.name;
    closePlayerModal();
    showToast(`${name} ahora está en ${inFirst ? 'el equipo de reservas' : 'el primer equipo'}`);
  }

  function refreshAfterChange() {
    const el = document.getElementById('header-club-budget');
    if (el && gameState.team) el.textContent = `Presupuesto: ${formatBudget(gameState.team.budget)}`;
    const active = document.querySelector('.screen.active');
    if (active && active.id === 'screen-transfers' && window.PocketManager.renderTransfers) {
      window.PocketManager.renderTransfers();
    } else if (active && active.id === 'screen-squad' && window.PocketManager.renderSquadScreen) {
      window.PocketManager.renderSquadScreen(gameState.team.id, true);
    }
  }

  function closePlayerModal() {
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.remove('open');
    state.player = null;
    state.owner = null;
    state.offerOpen = false;
  }

  function openPlayerModal(player, owner) {
    if (!player || !owner) return;
    state.player = player;
    state.owner = owner;
    state.offerOpen = false;
    render();
    const modal = document.getElementById('player-modal');
    if (modal) modal.classList.add('open');
  }

  const modalEl = document.getElementById('player-modal');
  if (modalEl) {
    modalEl.addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closePlayerModal();
    });
  }

  window.PocketManager.openPlayerModal = openPlayerModal;
  window.PocketManager.closePlayerModal = closePlayerModal;
  window.PocketManager.executeLoan = executeLoan;
})();
