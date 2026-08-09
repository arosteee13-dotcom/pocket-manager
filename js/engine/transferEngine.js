(function () {
  // Generador de ofertas de fichaje por los jugadores del usuario.
  // Cada semana (mercado) evalúa si un club de la CPU quiere fichar a un jugador de la
  // plantilla del usuario y, si lo hace, crea una oferta y la envía a la bandeja de entrada.
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;

  let offerSeq = 0;

  function newOfferId() {
    offerSeq++;
    return 'of_' + Date.now() + '_' + offerSeq + '_' + Math.random().toString(36).slice(2, 7);
  }

  function groupOf(pos) {
    if (pos === 'POR') return 'POR';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'DEF';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'MED';
    return 'DEL';
  }

  const GROUPS = ['POR', 'DEF', 'MED', 'DEL'];

  // Probabilidad semanal de que un club de la CPU pregunte por `p`.
  // Base por media (a más OVR más interés), edad (jóvenes más demandados) y la lista de
  // transferibles multiplica claramente el interés. Estar en la lista de cedibles también
  // aumenta un poco el interés del resto del mercado.
  function offerProbability(p) {
    let prob = 0.05;
    prob += (p.ovr / 100) * 0.10;            // hasta +0.10 por media
    if (p.age <= 21) prob += 0.12;
    else if (p.age <= 26) prob += 0.07;
    else if (p.age <= 30) prob += 0.03;
    else if (p.age >= 34) prob -= 0.03;
    if (p.transferListed) prob = prob * 3 + 0.15; // en la lista de transferibles: mucho más probable
    else if (p.loanListed) prob += 0.08;          // en la lista de cedibles: un poco más de interés
    return Math.max(0.01, Math.min(0.7, prob));
  }

  // ¿Un club necesita refuerzos en el grupo del jugador? Necesita <2 disponibles o su
  // mejor OVR en ese grupo por debajo de la media del club.
  function needsGroup(team, group) {
    const players = team.players.filter(p => {
      if (window.PocketManager.isInjured && window.PocketManager.isInjured(p)) return false;
      if (window.PocketManager.isLoanedOut && window.PocketManager.isLoanedOut(team, p)) return false;
      return true;
    });
    const counts = { POR: 0, DEF: 0, MED: 0, DEL: 0 };
    const best = { POR: 0, DEF: 0, MED: 0, DEL: 0 };
    let sum = 0;
    for (const p of players) {
      const g = groupOf(p.pos);
      counts[g]++;
      sum += p.ovr;
      if (p.ovr > best[g]) best[g] = p.ovr;
    }
    const avg = players.length ? sum / players.length : 0;
    return counts[group] < 2 || (counts[group] > 0 && best[group] < avg - 4);
  }

  // Precio de la oferta: valor de mercado con una ligera variación.
  function offerFee(p) {
    const variation = 0.85 + Math.random() * 0.3;
    return Math.round((p.value || 0) * variation);
  }

  // Años de contrato ofrecidos (condiciones de la oferta).
  function offerContractYears(p) {
    if (p.age >= 33) return 1 + Math.floor(Math.random() * 2);
    return 2 + Math.floor(Math.random() * 3);
  }

  // Informe médico resumido a partir de la edad, la energía y lesiones del jugador.
  function medicalReport(p) {
    if (window.PocketManager.isInjured && window.PocketManager.isInjured(p)) {
      return 'No apto: el jugador arrastra una lesión activa (' + (p.injury.type || 'Muscular') + ').';
    }
    const st = Number(p.stamina);
    if (isFinite(st) && st < 70) return 'Riesgo moderado de lesión: carga física acumulada elevada.';
    if (p.age >= 32) return 'Informe médico favorable; vigilar su desgaste por edad.';
    if (p.age <= 24 && isFinite(st) && st >= 85) return 'Físicamente en plena forma. Apto sin observaciones.';
    return 'Informe médico favorable. Apto para competir.';
  }

  // Un comprador de la CPU que pueda pagar el precio y necesite esa posición.
  function pickBuyer(player, fee) {
    const userTeam = gameState.team;
    const group = groupOf(player.pos);
    const teams = db.getAllTeams().filter(t => t.id !== (userTeam ? userTeam.id : null));
    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = teams[i]; teams[i] = teams[j]; teams[j] = tmp;
    }
    for (const team of teams) {
      if (!team.budget || team.budget < fee) continue;
      if (team.players.length >= 40) continue;
      if (!needsGroup(team, group)) continue;
      return team;
    }
    // Si ningún club tiene necesidad clara, aceptar cualquier comprador solvente.
    for (const team of teams) {
      if (!team.budget || team.budget < fee) continue;
      if (team.players.length >= 40) continue;
      return team;
    }
    return null;
  }

  // Semana actual del usuario (0 si el calendario no está disponible).
  function currentWeek() {
    const userTeam = gameState.team;
    return (window.PocketManager.calendar && window.PocketManager.calendar.currentUserWeek && userTeam)
      ? window.PocketManager.calendar.currentUserWeek(userTeam.id)
      : 0;
  }

  // Ventana de fichajes: el mercado solo está abierto en las semanas 1-6 y 19-22.
  // Semana 0 (sin calendario) o fuera de esos rangos => mercado cerrado.
  function isTransferWindowOpen() {
    const week = currentWeek();
    if (week >= 1 && week <= 6) return true;
    if (week >= 19 && week <= 22) return true;
    return false;
  }

  // Chequeo semanal de ofertas. Itera la plantilla del usuario y genera ofertas según la
  // probabilidad de cada jugador. Máximo `maxOffers` por chequeo (por defecto 2).
  function runTransferOffers(maxOffers) {
    const userTeam = gameState.team;
    const inbox = window.PocketManager.inbox;
    if (!userTeam || !inbox || !db.getAllTeams) return 0;
    if (!isTransferWindowOpen()) return 0;

    const pendingByPlayer = new Set();
    for (const o of (gameState.inbox && gameState.inbox.offers) || []) {
      if (o.status === 'pending') pendingByPlayer.add(o.playerId);
    }

    let done = 0;
    const cap = Math.max(0, Number(maxOffers) || 2);
    const candidates = userTeam.players.filter(p => {
      if (pendingByPlayer.has(p.id)) return false;      // ya hay una oferta pendiente
      if (window.PocketManager.isInjured && window.PocketManager.isInjured(p)) return false;
      if (p.loan && p.loan.isLoaned) return false;
      return true;
    });

    for (const p of candidates) {
      if (done >= cap) break;
      if (Math.random() > offerProbability(p)) continue;

      const fee = offerFee(p);
      const buyer = pickBuyer(p, fee);
      if (!buyer) continue;

      const offer = {
        id: newOfferId(),
        kind: 'transfer',
        playerId: p.id,
        playerName: p.name,
        playerFlag: p.flag || '',
        pos: p.pos,
        age: p.age,
        ovr: p.ovr,
        value: p.value,
        buyerTeamId: buyer.id,
        buyerTeamName: buyer.name,
        fee,
        contractYears: offerContractYears(p),
        medical: medicalReport(p),
        week: currentWeek(),
        status: 'pending',
        createdAt: Date.now()
      };
      const added = inbox.addOffer(offer);
      if (added) {
        done++;
        pendingByPlayer.add(p.id);
      }
    }

    if (done > 0 && window.PocketManager.updateInboxBadge) {
      try { window.PocketManager.updateInboxBadge(); } catch (e) {}
    }
    return done;
  }

  // Un club de la CPU dispuesto a pedir la cesión de `player` (no hace falta presupuesto).
  function pickLoanBuyer(player) {
    const userTeam = gameState.team;
    const group = groupOf(player.pos);
    const teams = db.getAllTeams().filter(t => t.id !== (userTeam ? userTeam.id : null));
    for (let i = teams.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = teams[i]; teams[i] = teams[j]; teams[j] = tmp;
    }
    for (const team of teams) {
      if (team.players.length >= 40) continue;
      if (!needsGroup(team, group)) continue;
      return team;
    }
    for (const team of teams) {
      if (team.players.length >= 40) continue;
      return team;
    }
    return null;
  }

  // Genera una propuesta de cesión para un jugador marcado como CEDIBLE y la envía a la
  // bandeja de entrada. Devuelve la oferta creada (o null). No se ofrece a titulares del
  // once (la cesión de un titular la rechaza el motor de cesiones).
  function generateLoanOffer(player) {
    const userTeam = gameState.team;
    const inbox = window.PocketManager.inbox;
    if (!userTeam || !player || !inbox) return null;
    if (!player.loanListed) return null;
    if (player.loan && player.loan.isLoaned) return null;
    if (window.PocketManager.isInjured && window.PocketManager.isInjured(player)) return null;
    if (window.PocketManager.getSquadState) {
      try {
        const startingIds = window.PocketManager.getSquadState(userTeam).startingIds || [];
        if (startingIds.indexOf(player.id) !== -1) return null; // titular: no se cede
      } catch (e) {}
    }
    // No duplicar: si ya hay una oferta pendiente (fichaje o cesión) de este jugador.
    const pending = (gameState.inbox && gameState.inbox.offers) || [];
    if (pending.some(o => o.playerId === player.id && o.status === 'pending')) return null;

    const buyer = pickLoanBuyer(player);
    if (!buyer) return null;

    const offer = {
      id: newOfferId(),
      kind: 'loan',
      playerId: player.id,
      playerName: player.name,
      playerFlag: player.flag || '',
      pos: player.pos,
      age: player.age,
      ovr: player.ovr,
      value: player.value,
      buyerTeamId: buyer.id,
      buyerTeamName: buyer.name,
      medical: medicalReport(player),
      week: currentWeek(),
      status: 'pending',
      createdAt: Date.now()
    };
    const added = inbox.addOffer(offer);
    if (!added) return null;
    return offer;
  }

  // Chequeo semanal de propuestas de cesión para los jugadores en la lista de cedibles.
  // Máximo `limit` propuestas por chequeo (por defecto 1).
  function runLoanOffers(limit) {
    const userTeam = gameState.team;
    if (!userTeam) return 0;
    if (!isTransferWindowOpen()) return 0;
    const cap = Math.max(0, Number(limit) || 1);
    let done = 0;
    const candidates = userTeam.players.filter(p => p.loanListed && !(p.loan && p.loan.isLoaned));
    for (const p of candidates) {
      if (done >= cap) break;
      if (generateLoanOffer(p)) done++;
    }
    if (done > 0 && window.PocketManager.updateInboxBadge) {
      try { window.PocketManager.updateInboxBadge(); } catch (e) {}
    }
    return done;
  }

  window.PocketManager.runTransferOffers = runTransferOffers;
  window.PocketManager.generateLoanOffer = generateLoanOffer;
  window.PocketManager.runLoanOffers = runLoanOffers;
  window.PocketManager.isTransferWindowOpen = isTransferWindowOpen;
})();
