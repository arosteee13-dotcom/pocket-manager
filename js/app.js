const db = window.PocketManager.db;
const renderSquadScreen = window.PocketManager.renderSquadScreen;
const renderDashboard = window.PocketManager.renderDashboard;
const MatchSim = window.PocketManager.MatchSim;
const gameState = window.PocketManager.gameState;
const initNewGame = window.PocketManager.initNewGame;
const resetCreateForm = window.PocketManager.resetCreateForm;
const renderSelectLeague = window.PocketManager.renderSelectLeague;
const renderSelectTeam = window.PocketManager.renderSelectTeam;
const formatBudget = window.PocketManager.formatBudget;
const saveSystem = window.PocketManager.saveSystem;
const staminaEngine = window.PocketManager.staminaEngine;

const USER_TEAM_ID = 'esp_madrid';
const IN_GAME_SCREENS = ['screen-dashboard', 'screen-squad', 'screen-league', 'screen-market'];
const FLOW_SCREENS = ['screen-create-manager', 'screen-select-league', 'screen-select-team', 'screen-load-game'];

function initialsOf(name) {
  return String(name).split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase();
}

function renderLoadGame() {
  const listEl = document.getElementById('save-list');
  if (!listEl) return;
  const saves = saveSystem.listSaves();
  if (!saves.length) {
    listEl.innerHTML = `
      <div class="save-empty">
        <p>No hay partidas guardadas actualmente.</p>
      </div>`;
  } else {
    listEl.innerHTML = saves.map(s => `
      <div class="save-card" data-save-id="${s.saveId}">
        <span class="save-avatar" style="background:linear-gradient(135deg, ${s.teamColors.primary}, ${s.teamColors.secondary})">${initialsOf(s.teamName)}</span>
        <span class="save-info">
          <span class="save-team">${s.teamName}</span>
          <span class="save-manager">${s.managerFlag} ${s.managerName}</span>
          <span class="save-meta">Temporada ${s.currentSeason} · ${s.savedAt}</span>
        </span>
        <span class="save-actions">
          <button class="save-load" data-load="${s.saveId}">CARGAR</button>
          <button class="save-delete" data-delete="${s.saveId}">BORRAR</button>
        </span>
      </div>`).join('');
  }
}

const SCREEN_RENDERERS = {
  'screen-select-league': () => renderSelectLeague(),
  'screen-select-team': () => renderSelectTeam(),
  'screen-squad': () => renderSquadScreen(gameState.team ? gameState.team.id : USER_TEAM_ID),
  'screen-dashboard': () => renderDashboard(),
  'screen-load-game': () => renderLoadGame()
};

document.addEventListener("DOMContentLoaded", () => {
  const tabbar = document.getElementById("app-tabbar");

  let toastTimer = null;
  let pendingDeleteId = null;

  // --- Sistema de partidos ---
  const MATCH_SUBS_LIMIT = 5;
  let liveEngine = null;
  let liveMatch = null;
  let pendingResult = null;
  let changesSelected = null;
  let forcedOutId = null;
  let matchSubsUsed = 0;

  // Recuperación de stamina antes de un partido (entre jornadas)
  function applyPreMatchRecovery(jornada) {
    const team = gameState.team;
    if (!team || !gameState.season || !staminaEngine.recoverStamina) return;
    const se = gameState.season;
    const last = window.PocketManager.season.lastPlayedJornada(se, team.id);
    const weeks = Math.max(1, (Number(jornada) || 1) - last);
    const country = db.getCountryData(team.id);
    const leagueTeams = country ? country.teams : [team];
    staminaEngine.recoverStamina(leagueTeams, weeks);
  }

  function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.add('hidden'), 2600);
  }

  function openModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('open');
  }

  function closeModal(id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('open');
  }

  function showScreen(screenId) {
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    const target = document.getElementById(screenId);
    if (target) target.classList.add("active");

    tabbar.classList.toggle("hidden", !IN_GAME_SCREENS.includes(screenId));

    const appHeader = document.getElementById('app-header');
    appHeader.classList.toggle('is-empty', screenId === 'screen-main-menu');
    appHeader.classList.toggle('hidden-flow', FLOW_SCREENS.includes(screenId));

    document.querySelectorAll(".tab-item").forEach(t => {
      t.classList.toggle("active", t.dataset.target === screenId);
    });

    const renderer = SCREEN_RENDERERS[screenId];
    if (renderer) renderer();
  }

  function applyCareerToUI() {
    const team = gameState.team;
    if (!team) return;

    const badge = document.getElementById("header-club-badge");
    badge.textContent = team.shortName;
    badge.style.background = `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})`;
    document.getElementById("header-club-name").textContent = team.name;
    document.getElementById("header-club-budget").textContent = `Presupuesto: ${formatBudget(team.budget)}`;

    showScreen("screen-dashboard");
  }

  document.querySelectorAll(".tab-item").forEach(tab => {
    tab.addEventListener("click", () => showScreen(tab.dataset.target));
  });

  document.getElementById("btn-new-game").addEventListener("click", () => {
    resetCreateForm();
    showScreen("screen-create-manager");
  });

  document.getElementById("btn-load-game").addEventListener("click", () => {
    showScreen("screen-load-game");
  });

  document.getElementById("btn-back-load").addEventListener("click", () => showScreen("screen-main-menu"));
  document.getElementById("btn-back-load-bottom").addEventListener("click", () => showScreen("screen-main-menu"));

  document.getElementById("save-list").addEventListener("click", (e) => {
    const loadBtn = e.target.closest("[data-load]");
    if (loadBtn) {
      const data = saveSystem.loadSave(loadBtn.dataset.load);
      if (data) {
        applyCareerToUI();
        showToast("Partida cargada");
      }
      return;
    }
    const delBtn = e.target.closest("[data-delete]");
    if (delBtn) {
      pendingDeleteId = delBtn.dataset.delete;
      openModal("confirm-modal");
    }
  });

  document.getElementById("btn-settings-quick").addEventListener("click", () => openModal("settings-modal"));
  document.getElementById("settings-modal-close").addEventListener("click", () => closeModal("settings-modal"));
  document.getElementById("btn-save-game").addEventListener("click", () => {
    const result = saveSystem.saveCurrentGame();
    closeModal("settings-modal");
    if (result) {
      showToast(result.persistent ? "Partida guardada correctamente" : "Partida guardada (solo en esta sesión)");
    }
  });
  document.getElementById("btn-back-to-menu").addEventListener("click", () => {
    closeModal("settings-modal");
    showScreen("screen-main-menu");
  });

  document.getElementById("confirm-modal-close").addEventListener("click", () => closeModal("confirm-modal"));
  document.getElementById("confirm-cancel").addEventListener("click", () => closeModal("confirm-modal"));
  document.getElementById("confirm-delete").addEventListener("click", () => {
    if (pendingDeleteId) {
      saveSystem.deleteSave(pendingDeleteId);
      pendingDeleteId = null;
    }
    closeModal("confirm-modal");
    renderLoadGame();
    showToast("Partida eliminada");
  });

  // --- Partido en directo ---
  function teamBadgeEl(elId, team) {
    const el = document.getElementById(elId);
    if (!el) return;
    el.textContent = team.shortName;
    el.style.background = `linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})`;
  }

  function ratingColor(v) {
    if (v >= 7) return '#16A34A';
    if (v >= 6) return '#D97706';
    return '#DC2626';
  }

  function renderScorers(data) {
    const list = data.scorersList || {};
    const fmt = (team) => (list[team.id] || []).map(g => {
      const name = g.player ? (g.player.nick || g.player.name.split(' ').pop()) : '?';
      const a = g.assist ? ` (🅰️ ${g.assist.nick || g.assist.name.split(' ').pop()})` : '';
      return `⚽ ${name}${a}`;
    }).join('<br>');
    const homeEl = document.getElementById('match-scorers-home');
    const awayEl = document.getElementById('match-scorers-away');
    if (homeEl) homeEl.innerHTML = fmt(liveMatch.home) || '—';
    if (awayEl) awayEl.innerHTML = fmt(liveMatch.away) || '—';
  }

  function renderLiveRatings(data) {
    const lr = data.liveRatings || {};
    const yellows = data.yellows || {};
    const reds = data.reds || {};
    const goals = data.goals || {};
    const assists = data.assists || {};
    const renderCol = (team, headId, listId) => {
      const head = document.getElementById(headId);
      if (head) head.textContent = team.shortName;
      const list = document.getElementById(listId);
      if (!list) return;
      const squad = window.PocketManager.getSquadState(team);
      const rows = squad.startingIds.map(id => {
        const p = team.players.find(x => x.id === id);
        if (!p) return '';
        const val = (lr[team.id] && lr[team.id][id] !== undefined) ? lr[team.id][id] : 6.0;
        const marks = [];
        if (goals[team.id] && goals[team.id][id]) marks.push(`⚽${goals[team.id][id] > 1 ? goals[team.id][id] : ''}`);
        if (assists[team.id] && assists[team.id][id]) marks.push(`🅰️${assists[team.id][id] > 1 ? assists[team.id][id] : ''}`);
        if (yellows[team.id] && yellows[team.id][id]) marks.push('🟨');
        if ((reds[team.id] && reds[team.id][id]) || p._sentOff) marks.push('🟥');
        if (window.PocketManager.isInjured(p)) marks.push('🩹');
        const markHtml = marks.length ? ` <span class="lr-marks">${marks.join(' ')}</span>` : '';
        return `<div class="lr-row"><span class="lr-name">${p.nick || p.name.split(' ').pop()}${markHtml}</span><span class="lr-val" style="color:${ratingColor(val)}">${val.toFixed(1)}</span></div>`;
      }).join('');
      list.innerHTML = rows;
    };
    renderCol(liveMatch.home, 'lr-home-head', 'lr-home');
    renderCol(liveMatch.away, 'lr-away-head', 'lr-away');
  }

  function setupLiveMatch(match, jornada) {
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    if (!home || !away) return;
    liveMatch = { home, away, match, jornada };
    applyPreMatchRecovery(jornada);
    forcedOutId = null;

    teamBadgeEl('home-logo', home);
    document.getElementById('home-name').textContent = home.name;
    teamBadgeEl('away-logo', away);
    document.getElementById('away-name').textContent = away.name;

    document.getElementById('match-scorers-home').textContent = '—';
    document.getElementById('match-scorers-away').textContent = '—';
    renderLiveRatings({ liveRatings: {} });

    document.getElementById('match-score').textContent = '0 - 0';
    document.getElementById('match-timer').textContent = "00'";

    const pauseBtn = document.getElementById('btn-match-pause');
    const changesBtn = document.getElementById('btn-match-changes');
    const continueBtn = document.getElementById('btn-match-continue');
    pauseBtn.disabled = false;
    pauseBtn.textContent = 'Pausar';
    changesBtn.disabled = false;
    continueBtn.classList.add('hidden');

    changesSelected = null;
    matchSubsUsed = 0;
    updateSubsIndicator();
    setNotice('');

    liveEngine = new MatchSim(home, away, (data) => {
      document.getElementById('match-score').textContent = `${data.homeGoals} - ${data.awayGoals}`;
      document.getElementById('match-timer').textContent = `${String(data.minute).padStart(2, '0')}'`;
      (data.events || []).forEach(ev => {
        if (ev.type === 'injury' && isUserTeam(ev.team)) {
          handleForcedChange(ev);
        }
      });
      renderScorers(data);
      renderLiveRatings(data);
      if (data.isFinished) {
        pauseBtn.disabled = true;
        changesBtn.disabled = true;
        continueBtn.classList.remove('hidden');
      }
    });
    liveEngine.start();
  }

  function isUserTeam(side) {
    if (!liveMatch || !gameState.team) return false;
    const id = side === 'home' ? liveMatch.home.id : liveMatch.away.id;
    return id === gameState.team.id;
  }

  function setNotice(msg) {
    const el = document.getElementById('mc-notice');
    if (!el) return;
    if (msg) {
      el.textContent = msg;
      el.classList.remove('hidden');
    } else {
      el.classList.add('hidden');
    }
  }

  function handleForcedChange(ev) {
    if (!liveEngine || liveEngine.finished) return;
    if (!liveEngine.paused) {
      liveEngine.togglePause();
      document.getElementById('btn-match-pause').textContent = 'Reanudar';
    }
    const playerName = ev.player ? ev.player.name : 'Un jugador';
    changesSelected = ev.player ? ev.player.id : null;
    forcedOutId = ev.player ? ev.player.id : null;
    setNotice(ev.type === 'red' ? `🟥 ¡Jugador Expulsado! ${playerName}. Toca un suplente para sustituirlo.` : `🩹 ¡Jugador Lesionado! ${playerName}. Toca un suplente para sustituirlo.`);
    renderChangesView();
    openModal('match-changes-modal');
  }

  document.getElementById('btn-match-pause').addEventListener('click', () => {
    if (!liveEngine) return;
    const paused = liveEngine.togglePause();
    document.getElementById('btn-match-pause').textContent = paused ? 'Reanudar' : 'Pausar';
  });

  document.getElementById('btn-match-continue').addEventListener('click', () => {
    if (!liveEngine || !liveMatch) return;
    pendingResult = {
      result: {
        homeGoals: liveEngine.homeGoals,
        awayGoals: liveEngine.awayGoals,
        events: liveEngine.events,
        homeTeam: liveMatch.home,
        awayTeam: liveMatch.away,
        minutesPlayed: liveEngine.minutesPlayed
      },
      match: liveMatch.match,
      jornada: liveMatch.jornada
    };
    liveEngine.stop();
    commitResult();
  });

  function updateSubsIndicator() {
    const used = matchSubsUsed;
    const remaining = Math.max(0, MATCH_SUBS_LIMIT - used);
    const remEl = document.getElementById('mc-remaining');
    if (remEl) {
      remEl.textContent = `Cambios: ${used}/${MATCH_SUBS_LIMIT}`;
      remEl.classList.toggle('empty', remaining === 0);
    }
    const btn = document.getElementById('btn-match-changes');
    if (btn) btn.textContent = `Cambios (${used}/${MATCH_SUBS_LIMIT})`;
  }

  function renderChangesView() {
    const team = gameState.team;
    if (!team) return;
    const squad = window.PocketManager.getSquadState(team);
    squad.selected = changesSelected;

    const fv = document.getElementById('mc-formation-value');
    if (fv) fv.textContent = window.PocketManager.getFormation(team);
    const sv = document.getElementById('mc-style-value');
    if (sv) sv.textContent = window.PocketManager.getTeamStyle(team);

    const live = liveEngine ? {
      ratings: liveEngine.liveRatings,
      yellows: liveEngine.yellows,
      reds: liveEngine.reds,
      goals: liveEngine.goals,
      colorFn: ratingColor
    } : null;

    const fieldEl = document.getElementById('mc-field');
    if (fieldEl) fieldEl.outerHTML = window.PocketManager.buildField(team, 'mc-field', live);

    const supEl = document.getElementById('mc-suplentes');
    if (supEl) {
      supEl.innerHTML = window.PocketManager.buildSuplentes(team, live);
      supEl.classList.toggle('changes-locked', matchSubsUsed >= MATCH_SUBS_LIMIT);
    }

    updateSubsIndicator();
  }

  document.getElementById('btn-match-changes').addEventListener('click', () => {
    if (!liveEngine || !gameState.team) return;
    if (!liveEngine.paused) {
      liveEngine.togglePause();
      document.getElementById('btn-match-pause').textContent = 'Reanudar';
    }
    renderChangesView();
    openModal('match-changes-modal');
  });

  document.getElementById('match-changes-close').addEventListener('click', () => {
    changesSelected = null;
    forcedOutId = null;
    closeModal('match-changes-modal');
    setNotice('');
  });
  document.getElementById('match-changes-modal').addEventListener('click', (e) => {
    if (e.target.closest('#mc-formation')) { window.PocketManager.openFormationModal(); return; }
    if (e.target.closest('#mc-style')) { window.PocketManager.openStyleModal(gameState.team); return; }

    const playerEl = e.target.closest('.field-player, .bench-card');
    if (playerEl) {
      const team = gameState.team;
      if (!team) return;
      const pid = playerEl.dataset.playerId;
      const squad = window.PocketManager.getSquadState(team);
      const isStarter = squad.startingIds.indexOf(pid) !== -1;
      if (isStarter) {
        const p = team.players.find(x => x.id === pid);
        if (p && p._sentOff) {
          showToast('Expulsado: no puede ser sustituido en el partido');
          return;
        }
        if (changesSelected && changesSelected !== pid) {
          window.PocketManager.doSwap(team, changesSelected, pid);
          changesSelected = null;
        } else if (!(changesSelected === pid && pid === forcedOutId)) {
          changesSelected = changesSelected === pid ? null : pid;
        }
      } else if (changesSelected) {
        if (matchSubsUsed >= MATCH_SUBS_LIMIT) {
          showToast('No quedan más cambios');
          return;
        }
        const incoming = team.players.find(x => x.id === pid);
        if (incoming && window.PocketManager.isUnavailable(incoming)) {
          showToast('No puede jugar por lesión/sanción');
          return;
        }
        window.PocketManager.doSwap(team, changesSelected, pid);
        if (changesSelected === forcedOutId) forcedOutId = null;
        matchSubsUsed++;
        changesSelected = null;
      } else if (forcedOutId) {
        // Sustitución directa del lesionado (cuenta como cambio)
        if (matchSubsUsed >= MATCH_SUBS_LIMIT) {
          showToast('No quedan más cambios');
          return;
        }
        const fs = window.PocketManager.getSquadState(team);
        if (fs.startingIds.indexOf(forcedOutId) !== -1) {
          const incoming = team.players.find(x => x.id === pid);
          if (incoming && window.PocketManager.isUnavailable(incoming)) {
            showToast('No puede jugar por lesión/sanción');
            return;
          }
          window.PocketManager.doSwap(team, forcedOutId, pid);
          matchSubsUsed++;
          forcedOutId = null;
        }
      }
      renderChangesView();
      return;
    }

    if (e.target === e.currentTarget) {
      changesSelected = null;
      forcedOutId = null;
      closeModal('match-changes-modal');
      setNotice('');
    }
  });

  document.addEventListener('tactics-changed', () => {
    if (document.getElementById('match-changes-modal').classList.contains('open')) {
      changesSelected = null;
      renderChangesView();
    }
  });

  // --- Resultado / resumen ---
  function buildScorers(result) {
    const lines = [];
    for (const ev of result.events) {
      if (ev.type === 'goal' && ev.player) {
        const side = ev.team === 'home' ? result.homeTeam : result.awayTeam;
        lines.push(`<div class="mr-scorer"><span>${ev.player.name}</span><b>${side.shortName}</b></div>`);
      }
    }
    return lines.join('');
  }

  function showResultModal(result, match, jornada) {
    pendingResult = { result, match, jornada };
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    const body = document.getElementById('match-result-body');
    const scorers = buildScorers(result);
    body.innerHTML = `
      <div class="mr-score">${result.homeGoals} - ${result.awayGoals}</div>
      <div class="mr-teams"><span>${home ? home.shortName : '—'}</span><span>${away ? away.shortName : '—'}</span></div>
      <div class="mr-scorers-title">Goleadores</div>
      <div class="mr-scorers">${scorers || '<p class="mr-none">Sin goles.</p>'}</div>`;
    openModal('match-result-modal');
  }

  function commitResult() {
    if (!pendingResult) return;
    const { result, match, jornada } = pendingResult;
    const se = gameState.season || window.PocketManager.season.initSeason(gameState.team);
    window.PocketManager.season.applyMatchResult(se, match, result.homeGoals, result.awayGoals);

    // Stamina tras el partido (según minutos jugados)
    const minutes = result.minutesPlayed || {};
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    if (home) staminaEngine.applyMatchStamina(home, minutes[home.id]);
    if (away) staminaEngine.applyMatchStamina(away, minutes[away.id]);

    // Recuperación entre jornadas (semanas transcurridas hasta el próximo partido)
    const played = Number(jornada) || 1;
    const next = window.PocketManager.season.nextFixture(se, gameState.team.id);
    const weeks = next ? Math.max(1, next.jornada - played) : 1;
    const country = db.getCountryData(gameState.team.id);
    const leagueTeams = country ? country.teams : [gameState.team];
    staminaEngine.applyWeeklyRecovery(leagueTeams, weeks);

    // Sanciones por expulsión (tras la recuperación para que se pierda el próximo partido)
    for (const ev of result.events || []) {
      if (ev.type === 'red' && ev.player && !ev.player.suspension) {
        ev.player.suspension = { isSuspended: true, matchesLeft: 1 };
      }
    }

    if (window.PocketManager.refreshLineup) window.PocketManager.refreshLineup(gameState.team);

    pendingResult = null;
    closeModal('match-result-modal');
    try { saveSystem.saveCurrentGame(); } catch (e) {}
    showScreen('screen-dashboard');
  }

  document.getElementById('match-result-continue').addEventListener('click', commitResult);
  document.getElementById('match-result-close').addEventListener('click', commitResult);

  document.addEventListener('start-match', (e) => {
    const { match, jornada } = e.detail || {};
    if (!match) return;
    setupLiveMatch(match, jornada);
    showScreen('screen-match');
  });

  document.addEventListener('simulate-match', (e) => {
    const { match, jornada } = e.detail || {};
    if (!match) return;
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    if (!home || !away) return;
    applyPreMatchRecovery(jornada);
    const result = window.PocketManager.simulateInstant(home, away);
    showResultModal(result, match, jornada);
  });

  document.addEventListener("nav", (e) => {
    showScreen(e.detail);
  });

  document.addEventListener("career-started", () => {
    saveSystem.setActiveSaveId(saveSystem.newSaveId());
    if (!gameState.currentDate) gameState.currentDate = new Date().toLocaleDateString("es-ES");
    if (gameState.team) {
      window.PocketManager.setFormation(gameState.team.formation || "4-3-3");
      if (staminaEngine && staminaEngine.resetFitness) staminaEngine.resetFitness(gameState.team);
    }
    applyCareerToUI();
  });

  initNewGame();
});
