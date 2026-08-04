(function () {
  // Sistema de clubes filiales / equipos B (familias de clubes).
  // Relaciones leídas de los datos: team.parentClubId (filial -> primer equipo) y
  // team.farmTeamId (primer equipo -> filial).
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;

  function groupOf(pos) {
    if (pos === 'POR') return 'POR';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'DEF';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'MED';
    return 'DEL';
  }

  const GROUPS = ['POR', 'DEF', 'MED', 'DEL'];

  function parentOf(team) {
    if (!team || !team.parentClubId) return null;
    return db.getTeamById(team.parentClubId) || null;
  }

  function farmOf(team) {
    if (!team || !team.farmTeamId) return null;
    return db.getTeamById(team.farmTeamId) || null;
  }

  function isFilial(team) {
    return !!(team && team.parentClubId);
  }

  function isFirstTeam(team) {
    return !!(team && team.farmTeamId);
  }

  function logCallUp(week, player, firstTeam, action) {
    if (!gameState.callUpLog) gameState.callUpLog = [];
    gameState.callUpLog.push({
      id: 'cu_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
      week: week || 0,
      playerName: player.name,
      playerFlag: player.flag || '',
      pos: player.pos,
      teamId: firstTeam.id,
      teamName: firstTeam.name,
      action
    });
    if (gameState.callUpLog.length > 200) gameState.callUpLog.splice(0, gameState.callUpLog.length - 200);
  }

  // Mueve un jugador entre dos plantillas y reajusta dorsal/once de ambos clubes.
  function movePlayer(fromTeam, toTeam, player) {
    const idx = fromTeam.players.indexOf(player);
    if (idx === -1) return false;
    fromTeam.players.splice(idx, 1);
    const squadEngine = window.PocketManager.squadEngine;
    if (squadEngine && squadEngine.insertPlayerByPosition) {
      try { squadEngine.insertPlayerByPosition(toTeam, player); } catch (e) { toTeam.players.push(player); }
    } else {
      toTeam.players.push(player);
    }
    if (squadEngine && squadEngine.assignAutomaticNumbers) {
      try { squadEngine.assignAutomaticNumbers(toTeam); } catch (e) {}
    }
    if (window.PocketManager.refreshLineup) {
      try { window.PocketManager.refreshLineup(fromTeam); } catch (e) {}
      try { window.PocketManager.refreshLineup(toTeam); } catch (e) {}
    }
    return true;
  }

  // Sube un jugador del filial al primer equipo (permanente).
  function promote(filial, playerId) {
    const first = parentOf(filial);
    if (!first) return { ok: false, reason: 'Este club no tiene primer equipo.' };
    const player = filial.players.find(p => p.id === playerId);
    if (!player) return { ok: false, reason: 'Jugador no encontrado.' };
    if (player.loan && player.loan.isLoaned) return { ok: false, reason: 'No se puede subir a un jugador cedido.' };
    if (!movePlayer(filial, first, player)) return { ok: false, reason: 'No se pudo mover al jugador.' };
    player.division = null; // primer equipo
    return { ok: true, player, from: filial.name, to: first.name };
  }

  // Baja un jugador del primer equipo al filial (permanente).
  function demote(first, playerId) {
    const filial = farmOf(first);
    if (!filial) return { ok: false, reason: 'Este club no tiene filial.' };
    const player = first.players.find(p => p.id === playerId);
    if (!player) return { ok: false, reason: 'Jugador no encontrado.' };
    if (player.loan && player.loan.isLoaned) return { ok: false, reason: 'No se puede bajar a un jugador cedido.' };
    if (!movePlayer(first, filial, player)) return { ok: false, reason: 'No se pudo mover al jugador.' };
    player.division = 'segunda';
    return { ok: true, player, from: first.name, to: filial.name };
  }

  // --- Llamadas de la CPU (usuario entrena al filial) ---

  function unavailableOf() {
    return window.PocketManager.isUnavailable || (() => false);
  }

  // ¿Hay algún titular del grupo no disponible (lesión/sanción)?
  function groupNeedsCover(first, group) {
    const unavailable = unavailableOf();
    const squad = window.PocketManager.getSquadState ? window.PocketManager.getSquadState(first) : null;
    const startingIds = squad && squad.startingIds ? squad.startingIds : [];
    for (const id of startingIds) {
      const p = first.players.find(x => x.id === id);
      if (p && groupOf(p.pos) === group && unavailable(p)) return true;
    }
    return false;
  }

  // Llama a un jugador del filial al primer equipo (temporal, con marca de cesión).
  function callUp(first, filial, player, week) {
    if (!movePlayer(filial, first, player)) return false;
    player.loan = { isLoaned: true, parentTeam: filial.id, currentTeam: first.id, callUp: true };
    logCallUp(week, player, first, 'callup');
    return true;
  }

  // Devuelve un jugador convocado al filial.
  function returnCallUp(first, filial, player, week) {
    if (!movePlayer(first, filial, player)) return false;
    player.loan = null;
    logCallUp(week, player, first, 'return');
    return true;
  }

  // Chequeo semanal: si el equipo del usuario es un filial y su primer equipo lo controla la
  // CPU, cubre las posiciones descubiertas por lesión/sanción y devuelve a los no necesarios.
  function weeklyCallUps() {
    const userTeam = gameState.team;
    if (!userTeam || !isFilial(userTeam)) return 0;
    const first = parentOf(userTeam);
    if (!first) return 0;
    const calendar = window.PocketManager.calendar;
    const week = calendar && calendar.currentUserWeek ? calendar.currentUserWeek(userTeam.id) : 0;
    if (gameState._callUpsWeek === week) return 0; // ya procesado esta semana
    gameState._callUpsWeek = week;

    const unavailable = unavailableOf();
    let done = 0;

    for (const group of GROUPS) {
      const needs = groupNeedsCover(first, group);
      const calledUp = first.players.filter(p => p.loan && p.loan.callUp && p.loan.parentTeam === userTeam.id && groupOf(p.pos) === group);

      // Devolver convocados que ya no se necesitan.
      if (!needs) {
        for (const p of calledUp.slice()) {
          if (returnCallUp(first, userTeam, p, week)) done++;
        }
        continue;
      }

      // Cubrir titulares lesionados/sancionados: un convocado por cada titular ausente.
      const squad = window.PocketManager.getSquadState ? window.PocketManager.getSquadState(first) : null;
      const startingIds = squad && squad.startingIds ? squad.startingIds : [];
      const absent = startingIds.filter(id => {
        const p = first.players.find(x => x.id === id);
        return p && groupOf(p.pos) === group && unavailable(p);
      }).length;
      const needed = Math.max(0, absent - calledUp.length);
      if (needed <= 0) continue;

      const candidates = userTeam.players
        .filter(p => groupOf(p.pos) === group && !(p.loan && p.loan.isLoaned) && !unavailable(p))
        .sort((a, b) => (b.ovr - a.ovr) || String(a.id).localeCompare(String(b.id)));
      for (let i = 0; i < needed && i < candidates.length; i++) {
        if (callUp(first, userTeam, candidates[i], week)) done++;
      }
    }

    if (done > 0 && window.PocketManager.updateInboxBadge) {
      try { window.PocketManager.updateInboxBadge(); } catch (e) {}
    }
    return done;
  }

  window.PocketManager.parentChildEngine = {
    parentOf,
    farmOf,
    isFilial,
    isFirstTeam,
    promote,
    demote,
    weeklyCallUps,
    groupOf
  };
})();
