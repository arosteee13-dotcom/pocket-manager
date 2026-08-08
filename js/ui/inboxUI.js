(function () {
  // Bandeja de entrada a pantalla completa: lista de correos y vista de detalle expandible.
  // Las ofertas de fichaje muestran escudo del emisor, propuesta económica, condiciones,
  // informe médico y los botones [ Aceptar Oferta ], [ Rechazar ] y [ Cancelar ].
  const gameState = window.PocketManager.gameState;

  function getInbox() {
    return window.PocketManager.inbox || null;
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  function updateBadge() {
    const inbox = getInbox();
    const badge = document.getElementById('inbox-badge');
    if (!badge) return;
    const team = gameState.team;
    const count = (inbox && team) ? inbox.unreadCount(team) : 0;
    badge.textContent = count > 9 ? '9+' : String(count);
    badge.classList.toggle('hidden', count === 0);
  }

  function itemBriefHtml(it) {
    return `
      <div class="inbox-item${it.unread ? ' inbox-unread' : ''}" data-item="${it.id}">
        <span class="inbox-icon">${it.icon}</span>
        <div class="inbox-text">
          <span class="inbox-title">${it.title}</span>
          <span class="inbox-msg">${it.body}</span>
          ${it.meta ? `<span class="inbox-meta">${it.meta}</span>` : ''}
        </div>
        <span class="inbox-chev">›</span>
      </div>`;
  }

  function renderList() {
    const listEl = document.getElementById('inbox-list');
    if (!listEl) return;
    const inbox = getInbox();
    const items = (inbox && gameState.team) ? inbox.collect(gameState.team) : [];
    if (!items.length) {
      listEl.innerHTML = '<p class="inbox-empty">No hay correos en la bandeja.</p>';
      return;
    }
    listEl.innerHTML = items.map(itemBriefHtml).join('');
  }

  function showView(name) {
    const listEl = document.getElementById('inbox-list');
    const detailEl = document.getElementById('inbox-detail');
    const backEl = document.getElementById('inbox-back');
    if (listEl) listEl.classList.toggle('hidden', name !== 'list');
    if (detailEl) detailEl.classList.toggle('hidden', name !== 'detail');
    if (backEl) backEl.classList.toggle('hidden', name !== 'detail');
  }

  function renderDetail(item) {
    const detailEl = document.getElementById('inbox-detail');
    if (!detailEl) return;
    if (item.type === 'offer' && item.offerId) {
      detailEl.innerHTML = offerDetailHtml(item.offerId);
    } else {
      detailEl.innerHTML = `
        <div class="inbox-detail-item">
          <div class="inbox-detail-icon">${item.icon}</div>
          <h4 class="inbox-detail-title">${item.title}</h4>
          <p class="inbox-detail-body">${item.body}</p>
          ${item.meta ? `<span class="inbox-detail-meta">${item.meta}</span>` : ''}
        </div>`;
    }
    showView('detail');
  }

  function offerDetailHtml(offerId) {
    const inbox = getInbox();
    const offer = (inbox && inbox.getOffer) ? inbox.getOffer(offerId) : null;
    if (!offer) return '<p class="inbox-empty">Esta oferta ya no está disponible.</p>';
    const buyer = window.PocketManager.db.getTeamById(offer.buyerTeamId);
    const shieldStyle = buyer
      ? `background:linear-gradient(135deg, ${buyer.primaryColor}, ${buyer.secondaryColor || buyer.primaryColor})`
      : 'background:var(--bg-card-light)';
    const isLoan = offer.kind === 'loan';
    const subject = isLoan ? 'Propuesta de cesión' : 'Oferta de fichaje';
    const economics = isLoan
      ? `<div class="inbox-offer-block">
          <span class="inbox-offer-label">Condiciones de la cesión</span>
          <span class="inbox-offer-cond">Cedido hasta final de temporada. Sin coste de traspaso.</span>
        </div>`
      : `<div class="inbox-offer-block">
          <span class="inbox-offer-label">Propuesta económica</span>
          <span class="inbox-offer-value">${window.PocketManager.formatValue(offer.fee)}</span>
          <span class="inbox-offer-sub">Pago al contado</span>
        </div>
        <div class="inbox-offer-block">
          <span class="inbox-offer-label">Condiciones de la oferta</span>
          <span class="inbox-offer-cond">Contrato de ${offer.contractYears} años con el nuevo club.</span>
        </div>`;
    const acceptLabel = isLoan ? 'Aceptar Cesión' : 'Aceptar Oferta';
    return `
      <div class="inbox-offer">
        <div class="inbox-offer-sender"${buyer ? ` data-team-id="${buyer.id}"` : ''}>
          <span class="inbox-offer-shield" style="${shieldStyle}">${buyer ? buyer.shortName : '—'}</span>
          <div class="inbox-offer-sender-text">
            <span class="inbox-offer-from">${buyer ? buyer.name : offer.buyerTeamName}</span>
            <span class="inbox-offer-subject">${subject}</span>
          </div>
        </div>
        <div class="inbox-offer-player">
          <span class="inbox-offer-flag">${offer.playerFlag || '⚽'}</span>
          <div class="inbox-offer-player-text">
            <span class="inbox-offer-name">${offer.playerName}</span>
            <span class="inbox-offer-meta">${offer.pos} · ${offer.age} años · OVR ${offer.ovr}</span>
            <span class="inbox-offer-mkt">Valor de mercado: ${offer.value !== undefined && offer.value !== null ? window.PocketManager.formatValue(offer.value) : '—'}</span>
          </div>
        </div>
        ${economics}
        <div class="inbox-offer-block">
          <span class="inbox-offer-label">Informe médico</span>
          <span class="inbox-offer-cond">🩺 ${offer.medical}</span>
        </div>
        <div class="inbox-offer-actions">
          <button class="btn btn-primary inbox-offer-accept" data-offer-action="accept" data-offer-id="${offer.id}">${acceptLabel}</button>
          <button class="btn btn-danger inbox-offer-reject" data-offer-action="reject" data-offer-id="${offer.id}">Rechazar</button>
          <button class="btn btn-secondary inbox-offer-cancel" data-offer-action="cancel" data-offer-id="${offer.id}">Cancelar</button>
        </div>
      </div>`;
  }

  function handleOfferAction(action, offerId) {
    const inbox = getInbox();
    if (!inbox) return;
    if (action === 'accept') {
      const res = inbox.acceptOffer(offerId);
      if (res && res.ok) {
        if (res.kind === 'loan') {
          showToast(`¡Cesión cerrada! ${res.player} se marcha cedido a ${res.buyer}`);
        } else {
          showToast(`¡Venta cerrada! ${res.player} al ${res.buyer} por ${window.PocketManager.formatValue(res.fee)}`);
        }
        renderList();
        updateBadge();
        showView('list');
      } else {
        showToast((res && res.reason) || 'No se pudo aceptar la oferta');
      }
      return;
    }
    if (action === 'reject') {
      const res = inbox.rejectOffer(offerId);
      if (res && res.ok) showToast(`Oferta por ${res.player} rechazada`);
      renderList();
      updateBadge();
      showView('list');
      return;
    }
    // cancel: cierra el detalle; la oferta sigue pendiente en la bandeja.
    showView('list');
  }

  function openInbox() {
    const inbox = getInbox();
    const modal = document.getElementById('inbox-modal');
    if (!modal) return;
    if (inbox && gameState.team) inbox.markAllRead(gameState.team);
    renderList();
    showView('list');
    updateBadge();
    modal.classList.add('open');
  }

  function closeInbox() {
    const modal = document.getElementById('inbox-modal');
    if (modal) modal.classList.remove('open');
  }

  function initInbox() {
    const btn = document.getElementById('btn-inbox-quick');
    if (btn) btn.addEventListener('click', openInbox);

    const close = document.getElementById('inbox-modal-close');
    if (close) close.addEventListener('click', closeInbox);

    const modal = document.getElementById('inbox-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeInbox();
      });
    }

    const back = document.getElementById('inbox-back');
    if (back) back.addEventListener('click', () => showView('list'));

    const listEl = document.getElementById('inbox-list');
    if (listEl) {
      listEl.addEventListener('click', (e) => {
        const item = e.target.closest('[data-item]');
        if (!item) return;
        const inbox = getInbox();
        if (!inbox || !gameState.team) return;
        const found = inbox.collect(gameState.team).find(it => it.id === item.dataset.item);
        if (found) renderDetail(found);
      });
    }

    const detailEl = document.getElementById('inbox-detail');
    if (detailEl) {
      detailEl.addEventListener('click', (e) => {
        const teamEl = e.target.closest('[data-team-id]');
        if (teamEl && window.PocketManager.openTeamView) {
          window.PocketManager.openTeamView(teamEl.dataset.teamId);
          closeInbox();
          return;
        }
        const btn = e.target.closest('[data-offer-action]');
        if (!btn) return;
        handleOfferAction(btn.dataset.offerAction, btn.dataset.offerId);
      });
    }

    updateBadge();
  }

  window.PocketManager.initInbox = initInbox;
  window.PocketManager.updateInboxBadge = updateBadge;
})();
