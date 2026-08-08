(function () {
  // Bandeja de entrada: notificaciones derivadas del estado de la partida.
  // No hay modelo de mensajes propio: los mensajes se generan en caliente a partir
  // de gameState.season / seasons / transfers. Lo único persistido es el registro de
  // leídos (gameState.inbox.seen) para calcular el badge de no leídos.
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;

  const ICONS = {
    result: '📊',
    fixture: '📅',
    form: '📈',
    transfer: '🔄',
    budget: '💰',
    offer: '📨',
    callup: '📞'
  };

  function seenState() {
    if (!gameState.inbox) gameState.inbox = { seen: [], offers: [] };
    if (!Array.isArray(gameState.inbox.seen)) gameState.inbox.seen = [];
    return gameState.inbox.seen;
  }

  function offersState() {
    if (!gameState.inbox) gameState.inbox = { seen: [], offers: [] };
    if (!Array.isArray(gameState.inbox.offers)) gameState.inbox.offers = [];
    return gameState.inbox.offers;
  }

  function fmtMoney(n) {
    return window.PocketManager.formatValue ? window.PocketManager.formatValue(n) : String(n);
  }

  // Ofertas de fichaje pendientes por los jugadores del usuario.
  function offerItems() {
    const seen = seenState();
    return offersState()
      .filter(o => o.status === 'pending')
      .map(o => {
        const buyer = db.getTeamById(o.buyerTeamId);
        const isLoan = o.kind === 'loan';
        return {
          id: 'offer-' + o.id,
          week: o.week || 0,
          icon: ICONS.offer,
          title: isLoan ? 'Propuesta de cesión por ' + (o.playerName || 'jugador')
                        : 'Oferta por ' + (o.playerName || 'jugador'),
          body: isLoan
            ? `${buyer ? buyer.name : o.buyerTeamName} quiere la cesión de ${o.playerName} por una temporada.`
            : `${buyer ? buyer.name : o.buyerTeamName} quiere fichar a ${o.playerName} por ${fmtMoney(o.fee)}.`,
          meta: isLoan ? 'Propuesta de cesión' : 'Oferta de fichaje',
          type: 'offer',
          offerId: o.id,
          unread: seen.indexOf('offer-' + o.id) === -1
        };
      });
  }

  function compLabel(f) {
    if (f.compType === 'league') return 'Liga';
    if (f.compId === 'copa_del_rey') return 'Copa del Rey';
    if (f.compId === 'supercopa_de_espana') return 'Supercopa';
    if (f.compId === 'coppa_italia') return 'Coppa Italia';
    if (f.compId === 'supercoppa_italiana') return 'Supercoppa';
    return f.compName || 'Competición';
  }

  function userLeagueCompId(teamId) {
    const country = db.getCountryData(teamId);
    if (!country) return null;
    const comp = (db.getCompetitions(country.country) || []).find(c => c.type !== 'cup' && c.teams && c.teams.some(t => t.id === teamId));
    return comp ? comp.id : null;
  }

  // Último partido disputado del equipo (liga) y su resultado.
  function lastResult(teamId) {
    const leagueId = userLeagueCompId(teamId);
    const se = leagueId ? gameState.seasons[leagueId] : null;
    if (!se || !se.jornadas) return null;
    for (let i = se.jornadas.length - 1; i >= 0; i--) {
      const j = se.jornadas[i];
      const m = j.matches.find(x => x.homeId === teamId || x.awayId === teamId);
      if (m && m.played) {
        const rivalId = m.homeId === teamId ? m.awayId : m.homeId;
        const rival = db.getTeamById(rivalId);
        const isHome = m.homeId === teamId;
        const gf = isHome ? m.homeGoals : m.awayGoals;
        const ga = isHome ? m.awayGoals : m.homeGoals;
        const res = gf > ga ? 'V' : (gf < ga ? 'D' : 'E');
        return { jornada: i + 1, rival: rival ? rival.name : '—', gf, ga, res, isHome };
      }
    }
    return null;
  }

  // Convierte un fixture del calendario en notificación de próximo partido.
  function nextFixtureItem(teamId) {
    const calendar = window.PocketManager.calendar;
    if (!calendar || !calendar.nextUserFixture) return null;
    const next = calendar.nextUserFixture(teamId);
    if (!next) return null;
    const rivalId = next.match.homeId === teamId ? next.match.awayId : next.match.homeId;
    const rival = db.getTeamById(rivalId);
    const slotLabel = calendar.SLOT_LABELS ? (calendar.SLOT_LABELS[next.slot] || '') : '';
    const localia = next.isHome ? 'Local' : 'Visitante';
    return {
      id: 'fixture-' + next.week,
      week: next.week,
      icon: ICONS.fixture,
      title: 'Próximo partido',
      body: `${compLabel(next)} · ${localia} contra ${rival ? rival.name : '—'}`,
      meta: `Semana ${next.week} · Slot ${next.slot} (${slotLabel})`
    };
  }

  function formItem(teamId) {
    const se = gameState.season;
    if (!se) return null;
    const form = (se.form && se.form[teamId]) || [];
    if (!form.length) return null;
    const last5 = form.slice(-5);
    const v = last5.filter(r => r === 'W').length;
    const e = last5.filter(r => r === 'E').length;
    const d = last5.filter(r => r === 'L').length;
    return {
      id: 'form-' + last5.join(''),
      week: 0,
      icon: ICONS.form,
      title: 'Racha de forma',
      body: `En los últimos 5 partidos: ${v} victorias, ${e} empates y ${d} derrotas.`,
      meta: 'Últimos 5 partidos'
    };
  }

  function transferItems(teamId) {
    const list = (gameState.transfers || []).filter(t => t.teamId === teamId || t.from === teamId || t.to === teamId);
    if (!list.length) return [];
    return list.slice(-3).reverse().map(t => {
      const p = t.playerName || t.player || 'jugador';
      const dir = (t.teamId === teamId || t.to === teamId) ? 'fichaje' : 'venta';
      return {
        id: 'transfer-' + (t.id || (p + '-' + (t.week || 0))),
        week: t.week || 0,
        icon: ICONS.transfer,
        title: dir === 'fichaje' ? 'Nuevo fichaje' : 'Traspaso completado',
        body: `Se ha completado el traspaso de ${p} (${dir}).`,
        meta: t.budget ? `${window.PocketManager.formatBudget ? window.PocketManager.formatBudget(t.budget) : t.budget}` : 'Mercado de fichajes'
      };
    });
  }

  function budgetItem(team) {
    if (!team || team.budget >= 10000000) return null;
    return {
      id: 'budget-low',
      week: 0,
      icon: ICONS.budget,
      title: 'Presupuesto bajo',
      body: `El presupuesto del club es de ${window.PocketManager.formatBudget ? window.PocketManager.formatBudget(team.budget) : team.budget}. Gestiona bien tus recursos.`,
      meta: 'Aviso financiero'
    };
  }

  // Llamadas / devoluciones del primer equipo (filiales). Generadas por parentChildEngine.
  function callUpItems() {
    const seen = seenState();
    return (gameState.callUpLog || []).map(c => ({
      id: 'callup-' + c.id,
      week: c.week || 0,
      icon: ICONS.callup,
      title: c.action === 'callup' ? 'Llamada del primer equipo' : 'Regreso al filial',
      body: c.action === 'callup'
        ? `${c.teamName} convoca a ${c.playerName} (${c.pos}).`
        : `${c.playerName} regresa al filial desde ${c.teamName}.`,
      meta: 'Filial',
      type: 'callup',
      unread: seen.indexOf('callup-' + c.id) === -1
    }));
  }

  // Todos los mensajes derivados, ordenados por relevancia (fecha -> tipo).
  function collect(team) {
    const teamId = team ? team.id : null;
    if (!teamId) return [];
    const seen = seenState();
    const items = offerItems();
    items.push.apply(items, callUpItems());
    const lr = lastResult(teamId);
    if (lr) {
      const resLabel = lr.res === 'V' ? 'Victoria' : (lr.res === 'D' ? 'Derrota' : 'Empate');
      items.push({
        id: 'result-' + lr.jornada,
        week: lr.jornada,
        icon: ICONS.result,
        title: resLabel + ' ' + lr.gf + ' - ' + lr.ga,
        body: `${lr.isHome ? 'Como local' : 'Como visitante'} frente a ${lr.rival}.`,
        meta: 'Jornada ' + lr.jornada
      });
    }
    const nf = nextFixtureItem(teamId);
    if (nf) items.push(nf);
    const fm = formItem(teamId);
    if (fm) items.push(fm);
    items.push.apply(items, transferItems(teamId));
    const bg = budgetItem(team);
    if (bg) items.push(bg);

    return items.map(it => {
      if (it.unread !== undefined) return it;
      return { ...it, unread: seen.indexOf(it.id) === -1 };
    });
  }

  function unreadCount(team) {
    return collect(team).filter(it => it.unread).length;
  }

  function markAllRead(team) {
    const seen = seenState();
    for (const it of collect(team)) {
      if (seen.indexOf(it.id) === -1) seen.push(it.id);
    }
    if (seen.length > 300) seen.splice(0, seen.length - 300);
  }

  // --- Ofertas de fichaje ---
  function listOffers() {
    return offersState();
  }

  function getOffer(id) {
    return offersState().find(o => o.id === id) || null;
  }

  function addOffer(offer) {
    if (!offer || !offer.id) return false;
    const offers = offersState();
    if (offers.some(o => o.id === offer.id)) return false;
    if (offers.some(o => o.playerId === offer.playerId && o.status === 'pending')) return false;
    offers.push({ ...offer, status: offer.status || 'pending' });
    return true;
  }

  // Acepta la oferta: si es una cesión ejecuta executeLoan; si no, el traspaso (dinero al
  // presupuesto + jugador al comprador).
  function acceptOffer(id) {
    const offers = offersState();
    const o = offers.find(x => x.id === id);
    if (!o) return { ok: false, reason: 'Oferta no encontrada' };
    if (o.status !== 'pending') return { ok: false, reason: 'Oferta ya resuelta' };
    const userTeam = gameState.team;
    const buyer = db.getTeamById(o.buyerTeamId);
    if (!userTeam || !buyer) return { ok: false, reason: 'Club no disponible' };
    const player = userTeam.players.find(p => p.id === o.playerId);
    if (!player) return { ok: false, reason: 'El jugador ya no está en la plantilla' };

    const isLoan = o.kind === 'loan';
    const executor = isLoan ? window.PocketManager.executeLoan : window.PocketManager.executeTransfer;
    if (!executor) return { ok: false, reason: 'Motor de traspasos no disponible' };

    const res = isLoan
      ? executor(buyer, userTeam, player)
      : executor(buyer, userTeam, player, o.fee);

    if (res && res.ok) {
      o.status = 'accepted';
      offers.splice(offers.indexOf(o), 1);
      return { ok: true, kind: isLoan ? 'loan' : 'transfer', player: player.name, fee: o.fee, buyer: buyer.name };
    }
    return { ok: false, reason: (res && res.reason) || 'No se pudo completar la operación' };
  }

  function rejectOffer(id) {
    const offers = offersState();
    const idx = offers.findIndex(x => x.id === id);
    if (idx === -1) return { ok: false, reason: 'Oferta no encontrada' };
    const o = offers[idx];
    offers.splice(idx, 1);
    return { ok: true, player: o.playerName || '' };
  }

  window.PocketManager.inbox = {
    collect,
    unreadCount,
    markAllRead,
    listOffers,
    getOffer,
    addOffer,
    acceptOffer,
    rejectOffer
  };
})();
