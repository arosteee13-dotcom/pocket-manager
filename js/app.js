const db = window.PocketManager.db;
const renderSquadScreen = window.PocketManager.renderSquadScreen;
const renderDashboard = window.PocketManager.renderDashboard;
const renderTransfers = window.PocketManager.renderTransfers;
const renderStandings = window.PocketManager.renderStandings;
const renderCalendar = window.PocketManager.renderCalendar;
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
const IN_GAME_SCREENS = ['screen-dashboard', 'screen-squad', 'screen-calendar', 'screen-standings', 'screen-transfers'];
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
  'screen-transfers': () => renderTransfers(),
  'screen-standings': () => renderStandings(),
  'screen-calendar': () => renderCalendar(),
  'screen-load-game': () => renderLoadGame()
};

document.addEventListener("DOMContentLoaded", () => {
  const tabbar = document.getElementById("app-tabbar");

  if (window.PocketManager.initInbox) window.PocketManager.initInbox();
  if (window.PocketManager.initBudget) window.PocketManager.initBudget();

  let toastTimer = null;
  let pendingDeleteId = null;

  // --- Sistema de partidos ---
  const MATCH_SUBS_LIMIT = 5;
  let liveEngine = null;
  let liveMatch = null;
  let pendingResult = null;
  let pendingSeasonSummary = null;
  let changesSelected = null;
  let forcedOutId = null;
  let matchSubsUsed = 0;

  // Recuperación de stamina antes de un partido (entre jornadas)
  // Recuperación de stamina antes de un partido según la SEMANA del calendario.
  // Si es el 2º partido de la misma semana (doble jornada), no hay descanso.
  function applyPreMatchRecovery(week) {
    const team = gameState.team;
    if (!team || !staminaEngine.recoverStamina) return;
    if (!window.PocketManager.calendar || !window.PocketManager.calendar.lastPlayedUserWeek) return;
    const lastWeek = window.PocketManager.calendar.lastPlayedUserWeek(team.id);
    const weeks = Math.max(0, (Number(week) || 1) - lastWeek);
    if (weeks <= 0) return; // mismo partido de la semana: sin descanso
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
        if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.ensureAllTeamsDorsals) {
          window.PocketManager.squadEngine.ensureAllTeamsDorsals();
        }
        // Reponer temporadas de todas las ligas (si el save es antiguo y no las trae).
        initAllSeasons();
        // Reponer la Copa del Rey de la temporada (si el save es antiguo y no la trae).
        initCups();
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
  document.getElementById("squad-view-back").addEventListener("click", () => {
    document.dispatchEvent(new CustomEvent("nav", { detail: "screen-standings" }));
  });
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

  function setupLiveMatch(match, week, compId, jornada) {
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    if (!home || !away) return;
    liveMatch = { home, away, match, week, compId, jornada };
    applyPreMatchRecovery(week);
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
      jornada: liveMatch.jornada,
      week: liveMatch.week,
      compId: liveMatch.compId
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
          if (changesSelected && changesSelected !== pid && changesSelected !== forcedOutId) {
            // Recolocar al titular seleccionado en la posición del expulsado (no cuenta como cambio)
            window.PocketManager.doSwap(team, changesSelected, pid);
            changesSelected = null;
          } else {
            showToast('Expulsado: no puede ser sustituido. Toca otro titular para recolocarlo aquí.');
          }
          renderChangesView();
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

  function showResultModal(result, match, week, compId, jornada) {
    pendingResult = { result, match, week, compId, jornada };
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

  // Simula el resto de partidos de la jornada (los que no son del usuario) para que la
  // clasificación quede completa y los jugadores cedidos en clubes de la liga acumulen stats.
  function simulateLeagueRest(jornada) {
    const se = gameState.season;
    if (!se || !se.jornadas) return;
    const j = se.jornadas[Number(jornada) - 1];
    if (!j) return;
    for (const m of j.matches) {
      if (m.played) continue;
      if (m.homeId === gameState.team.id || m.awayId === gameState.team.id) continue;
      const home = db.getTeamById(m.homeId);
      const away = db.getTeamById(m.awayId);
      if (!home || !away) continue;
      const sim = new MatchSim(home, away, function () {});
      while (sim.minute < 90) sim.stepMinute();
      sim._recordRatings();
      window.PocketManager.season.applyMatchResult(se, m, sim.homeGoals, sim.awayGoals);
      if (window.PocketManager.calendar && window.PocketManager.calendar.buildMatchSummary) {
        m.summary = window.PocketManager.calendar.buildMatchSummary(sim.events);
      }
      const mins = sim.minutesPlayed || {};
      if (mins[home.id]) staminaEngine.applyMatchStamina(home, mins[home.id]);
      if (mins[away.id]) staminaEngine.applyMatchStamina(away, mins[away.id]);
    }
    // Playoffs de liga (Hypermotion y EFL Championship) al completar las jornadas regulares.
    if (window.PocketManager.spanishEngine && window.PocketManager.spanishEngine.advance) {
      try { window.PocketManager.spanishEngine.advance(se, se.compId || userLeagueCompId()); } catch (e) {}
    }
    if (window.PocketManager.englandEngine && window.PocketManager.englandEngine.championshipAdvance) {
      try { window.PocketManager.englandEngine.championshipAdvance(se, se.compId || userLeagueCompId()); } catch (e) {}
    }
  }

  // Id de la competición de liga del equipo del usuario.
  function userLeagueCompId() {
    if (!gameState.team) return null;
    const country = db.getCountryData(gameState.team.id);
    if (!country) return null;
    const comp = (db.getCompetitions(country.country) || []).find(c => c.type !== 'cup' && c.teams && c.teams.some(t => t.id === gameState.team.id));
    return comp ? comp.id : null;
  }

  // Motor de copas según el país (España -> cupEngine; Inglaterra -> englandEngine; Italia -> italyEngine).
  function cupEngineFor(countryName) {
    if (countryName === 'Inglaterra') return window.PocketManager.englandEngine || null;
    if (countryName === 'Italia') return window.PocketManager.italyEngine || null;
    return window.PocketManager.cupEngine || null;
  }

  // Construye la copa de `comp` para `season` con el motor del país. Idempotente por temporada.
  function buildCountryCup(countryName, comp, season) {
    const engine = cupEngineFor(countryName);
    if (!engine) return null;
    try {
      if (countryName === 'Inglaterra') {
        if (comp.id === 'community_shield') {
          const shield = gameState.englandShield || {};
          if (!shield.championId || !shield.faCupWinnerId) return null;
          return engine.buildCommunityShield({ season, championId: shield.championId, faCupWinnerId: shield.faCupWinnerId });
        }
        if (comp.id === 'efl_cup') return engine.buildEflCup({ season });
        if (comp.id === 'fa_cup') return engine.buildFaCup({ season });
        if (comp.id === 'efl_trophy') return engine.buildEflTrophy({ season });
        return null;
      }
      if (countryName === 'España') {
        if (comp.id === 'copa_del_rey') {
          const participants = db.getCupParticipants(countryName) || [];
          if (participants.length < 4) return null;
          return engine.buildCup(participants.map(t => t.id), { season });
        }
        // La Supercopa se construye al cerrar temporada (necesita los resultados previos).
        return null;
      }
      if (countryName === 'Italia') {
        if (comp.id === 'coppa_italia') {
          return engine.buildCoppaItalia({ season });
        }
        // La Supercoppa Italiana se construye al cerrar temporada.
        return null;
      }
    } catch (e) {
      if (window.console && console.warn) console.warn('[cups] buildCountryCup:', comp.id, e);
    }
    return null;
  }

  // Construye las copas de TODOS los países (se simulan en paralelo). Idempotente: no pisa
  // una copa ya creada para la misma temporada.
  function initCups() {
    if (!gameState.seasons) gameState.seasons = {};
    if (!gameState.team) return;
    const countries = db.getCountries ? db.getCountries() : [];
    for (const c of countries) {
      const comps = (db.getCompetitions(c.name) || []).filter(x => x.type === 'cup');
      for (const comp of comps) {
        const existing = gameState.seasons[comp.id];
        if (existing && existing.season === gameState.currentSeason) continue;
        // Primera edición de la Supercopa de España (temporada 1): sin resultados previos
        // de liga/copa, se fijan los cruces (FC Barcelona vs Atlético · Real Sociedad vs Real Madrid).
        if (comp.id === 'supercopa_de_espana' && (gameState.currentSeason || 1) === 1) {
          const engine = window.PocketManager.cupEngine;
          const first = engine && engine.buildSupercopaFirstEdition
            ? engine.buildSupercopaFirstEdition({ season: 1 })
            : null;
          if (first) gameState.seasons[comp.id] = first;
          continue;
        }
        // Primera edición de la Community Shield (temporada 1): sin resultados previos
        // de liga/copa, se fija el cruce (Arsenal vs Manchester City).
        if (comp.id === 'community_shield' && (gameState.currentSeason || 1) === 1) {
          const engine = window.PocketManager.englandEngine;
          const first = engine && engine.buildCommunityShieldFirstEdition
            ? engine.buildCommunityShieldFirstEdition({ season: 1 })
            : null;
          if (first) gameState.seasons[comp.id] = first;
          continue;
        }
        // Primera edición de la Supercoppa Italiana (temporada 1): cruce de los 2 mejores por ovr.
        if (comp.id === 'supercoppa_italiana' && (gameState.currentSeason || 1) === 1) {
          const engine = window.PocketManager.italyEngine;
          const first = engine && engine.buildSupercoppaFirstEdition
            ? engine.buildSupercoppaFirstEdition({ season: 1 })
            : null;
          if (first) gameState.seasons[comp.id] = first;
          continue;
        }
        const cup = buildCountryCup(c.name, comp, gameState.currentSeason);
        if (cup) gameState.seasons[comp.id] = cup;
      }
    }
    // Competiciones continentales (UEFA Champions League) de la temporada en curso.
    if (window.PocketManager.continentalEngine && window.PocketManager.continentalEngine.buildSeason) {
      try { window.PocketManager.continentalEngine.buildSeason(gameState.currentSeason); } catch (e) {}
    }
  }

  // Avanza las competiciones continentales (Champions) según la semana actual del usuario:
  // simula los partidos europeos de la CPU y respeta el partido pendiente de su equipo.
  function advanceContinentals() {
    const engine = window.PocketManager.continentalEngine;
    if (!engine || !engine.advanceWeekForAll) return;
    if (!gameState.seasons || !gameState.team) return;
    const calendar = window.PocketManager.calendar;
    const teamId = gameState.team.id;
    const currentWeek = calendar && calendar.currentUserWeek ? calendar.currentUserWeek(teamId) : 0;
    try { engine.advanceWeekForAll(currentWeek, { skipTeamId: teamId, isUserWeek: true }); } catch (e) {}
  }

  // ¿El equipo del usuario tiene un partido europeo pendiente en `week`? (Prioridad sobre la copa.)
  function userHasContinentalMatch(week) {
    const engine = window.PocketManager.continentalEngine;
    if (!engine || !engine.userFixtureWeek || !gameState.team) return false;
    try {
      const ucl = gameState.seasons['uefa_champions_league'];
      return engine.userFixtureWeek(ucl, gameState.team.id) === week;
    } catch (e) { return false; }
  }

  // Avanza las rondas de las competiciones de copa de TODOS los países según la semana actual
  // del usuario. En la semana de una ronda se respeta el partido del usuario en su país (para
  // que lo juegue); el resto de copas se auto-simula en segundo plano.
  function advanceCups() {
    const calendar = window.PocketManager.calendar;
    if (!gameState.seasons || !gameState.team) return;
    const teamId = gameState.team.id;
    const currentWeek = calendar && calendar.currentUserWeek ? calendar.currentUserWeek(teamId) : 0;
    const userCountry = db.getCountryData(teamId);
    const countries = db.getCountries ? db.getCountries() : [];
    for (const c of countries) {
      const comps = (db.getCompetitions(c.name) || []).filter(x => x.type === 'cup');
      for (const comp of comps) {
        const cup = gameState.seasons[comp.id];
        if (!cup || cup.finished) continue;
        const engine = cupEngineFor(c.name);
        if (!engine || !engine.playRound) continue;
        for (let i = 0; i < cup.rounds.length; i++) {
          const r = cup.rounds[i];
          if (r.completed) continue;
          if (r.atWeek > currentWeek) break;
          const isUserCountry = !!(userCountry && userCountry.country === c.name);
          // Si el usuario tiene Champions en esta semana, su copa doméstica se auto-simula (prioridad europea).
          const hasContinental = isUserCountry && userHasContinentalMatch(currentWeek);
          const skip = (isUserCountry && r.atWeek === currentWeek && !hasContinental) ? { skipTeamId: teamId } : null;
          try { engine.playRound(cup, i, skip); } catch (e) {}
        }
      }
    }
    syncEnglandSeason();
    awardFinishedCupTrophies();
    // Filiales: el primer equipo (CPU) cubre posiciones descubiertas con jugadores del filial.
    if (window.PocketManager.parentChildEngine && window.PocketManager.parentChildEngine.weeklyCallUps) {
      try { window.PocketManager.parentChildEngine.weeklyCallUps(); } catch (e) {}
    }
  }

  // Cuando la liga inglesa termina, captura los datos del Community Shield de la próxima
  // temporada y limpia las copas inglesas ya jugadas.
  function syncEnglandSeason(le) {
    le = le || gameState.seasons['inglaterra_league'];
    if (!le || !le.jornadas) return;
    const finished = le.jornadas.every(j => j.matches.every(m => m.played));
    if (!finished) return;
    const fa = gameState.seasons['fa_cup'];
    const champ = window.PocketManager.season.sortedStandings(le)[0];
    if (champ && fa && fa.finished) {
      gameState.englandShield = { championId: champ.teamId, faCupWinnerId: fa.winner };
    }
    ['community_shield', 'efl_cup', 'fa_cup', 'efl_trophy'].forEach(id => { delete gameState.seasons[id]; });
  }

  // Otorga (una sola vez) el trofeo de cada copa que haya terminado, tanto si la final la
  // jugó el usuario como si se auto-simuló.
  function awardFinishedCupTrophies() {
    if (!gameState.team) return;
    const countries = db.getCountries ? db.getCountries() : [];
    for (const c of countries) {
      const comps = (db.getCompetitions(c.name) || []).filter(x => x.type === 'cup');
      for (const comp of comps) {
        const cup = gameState.seasons ? gameState.seasons[comp.id] : null;
        if (!cup || !cup.finished || cup._trophyAwarded) continue;
        const engine = cupEngineFor(c.name);
        if (!engine || !engine.awardCompetitionTrophy) continue;
        try {
          const tr = engine.awardCompetitionTrophy(cup);
          cup._trophyAwarded = true;
          if (tr) showToast(`🏆 ${tr.team.name} gana la ${tr.trophyName} (${tr.count})`);
        } catch (e) {}
      }
    }
  }

  // Crea una temporada persistente para TODAS las competiciones del juego (una liga por país),
  // de modo que todas se simulan en paralelo estés o no en ese país. Idempotente: no pisa
  // temporadas ya existentes (importa para la carga de partidas).
  function initAllSeasons() {
    const countries = db.getCountries ? db.getCountries() : [];
    if (!gameState.seasons) gameState.seasons = {};
    for (const c of countries) {
      const comps = db.getCompetitions(c.name) || [];
      for (const comp of comps) {
        if (comp.type === 'cup') continue; // las copas se gestionan en initCups/advanceCups
        if (!comp.teams || !comp.teams.length) continue;
        if (!gameState.seasons[comp.id]) {
          gameState.seasons[comp.id] = window.PocketManager.season.initSeason(comp.teams[0], comp.id);
        }
      }
    }
    // La temporada de la liga del usuario apunta a su competición.
    if (gameState.team) {
      const userComp = (db.getCompetitions((db.getCountryData(gameState.team.id) || {}).country) || []).find(c => c.type !== 'cup' && c.teams && c.teams.some(t => t.id === gameState.team.id));
      if (userComp && gameState.seasons[userComp.id]) gameState.season = gameState.seasons[userComp.id];
    }
    return gameState.seasons;
  }

  // Avanza UNA jornada de cada liga en la que el usuario no juega (1 jornada por partido del
  // usuario, así todas avanzan en sintonía). Si una liga ajena termina, su campeón suma el
  // título de liga al palmarés y la temporada se reinicia.
  function advanceForeignLeagues() {
    if (!gameState.seasons || !gameState.team) return;
    const comps = [];
    for (const c of (db.getCountries ? db.getCountries() : [])) {
      const cs = db.getCompetitions(c.name) || [];
      for (const comp of cs) {
        // Saltar la liga del usuario: la gestiona el flujo normal (simulateLeagueRest).
        if (comp.teams && comp.teams.some(t => t.id === gameState.team.id)) continue;
        if (comp.teams && comp.teams.length) comps.push(comp);
      }
    }
    for (const comp of comps) {
      if (comp.type === 'cup') continue; // las copas avanzan con advanceCups
      let se = gameState.seasons[comp.id];
      // Liga ya cerrada (España, Inglaterra o Italia): el reinicio (con ascensos/descensos)
      // ocurre en el cierre global de temporada.
      if (se && (se._spainComplete || se._englandComplete || se._italyComplete)) continue;
      if (!se) se = gameState.seasons[comp.id] = window.PocketManager.season.initSeason(comp.teams[0], comp.id);
      let idx = se.jornadas.findIndex(jj => jj.matches.some(m => !m.played));
      if (idx === -1) {
        // Temporada completa: título al campeón + reinicio.
        // Inglaterra: capturar campeón PL + ganador de FA Cup para el Community Shield.
        if (comp.id === 'inglaterra_league') {
          try { syncEnglandSeason(se); } catch (e) {}
        }
        // España: diferir el reinicio hasta el cierre global (ascensos/descensos).
        if (window.PocketManager.spanishEngine && window.PocketManager.spanishEngine.isSpanishLeague(comp.id)) {
          if (window.PocketManager.seasonEngine && window.PocketManager.seasonEngine.awardLeagueTitle) {
            try { window.PocketManager.seasonEngine.awardLeagueTitle(se); } catch (e) {}
          }
          se._spainComplete = true;
          continue;
        }
        // Inglaterra: diferir el reinicio (Premier y Championship) hasta el cierre global para
        // calcular ascensos/descensos (Premier <-> Championship <-> League One).
        const isEnglishLeague = comp.id === 'inglaterra_league' ||
          (window.PocketManager.englandEngine && window.PocketManager.englandEngine.isChampionship(comp.id));
        if (isEnglishLeague) {
          if (window.PocketManager.seasonEngine && window.PocketManager.seasonEngine.awardLeagueTitle) {
            try { window.PocketManager.seasonEngine.awardLeagueTitle(se); } catch (e) {}
          }
          se._englandComplete = true;
          continue;
        }
        // Italia: diferir el reinicio de la Serie A hasta el cierre global (Serie A <-> Serie B).
        if (comp.id === 'italia_league' && window.PocketManager.italyEngine) {
          if (window.PocketManager.seasonEngine && window.PocketManager.seasonEngine.awardLeagueTitle) {
            try { window.PocketManager.seasonEngine.awardLeagueTitle(se); } catch (e) {}
          }
          se._italyComplete = true;
          continue;
        }
        if (window.PocketManager.seasonEngine && window.PocketManager.seasonEngine.awardLeagueTitle) {
          try { window.PocketManager.seasonEngine.awardLeagueTitle(se); } catch (e) {}
        }
        for (const t of comp.teams) if (staminaEngine.resetFitness) staminaEngine.resetFitness(t);
        se = gameState.seasons[comp.id] = window.PocketManager.season.initSeason(comp.teams[0], comp.id);
        idx = 0;
      }
      const j = se.jornadas[idx];
      for (const m of j.matches) {
        if (m.played) continue;
        const home = db.getTeamById(m.homeId);
        const away = db.getTeamById(m.awayId);
        if (!home || !away) continue;
        const sim = new MatchSim(home, away, function () {});
        while (sim.minute < 90) sim.stepMinute();
        sim._recordRatings();
        window.PocketManager.season.applyMatchResult(se, m, sim.homeGoals, sim.awayGoals);
        if (window.PocketManager.calendar && window.PocketManager.calendar.buildMatchSummary) {
          m.summary = window.PocketManager.calendar.buildMatchSummary(sim.events);
        }
        // Stamina de los equipos de ligas ajenas (para que las rotaciones de la CPU funcionen).
        const mins = sim.minutesPlayed || {};
        if (mins[home.id]) staminaEngine.applyMatchStamina(home, mins[home.id]);
        if (mins[away.id]) staminaEngine.applyMatchStamina(away, mins[away.id]);
      }
      // Playoffs de liga (Hypermotion y EFL Championship) al completar las jornadas regulares.
      if (window.PocketManager.spanishEngine && window.PocketManager.spanishEngine.advance) {
        try { window.PocketManager.spanishEngine.advance(se, comp.id); } catch (e) {}
      }
      if (window.PocketManager.englandEngine && window.PocketManager.englandEngine.championshipAdvance) {
        try { window.PocketManager.englandEngine.championshipAdvance(se, comp.id); } catch (e) {}
      }
      // Recuperación semanal de los equipos de la liga ajena.
      if (staminaEngine.recoverStamina) {
        try { staminaEngine.recoverStamina(comp.teams, 1); } catch (e) {}
      }
    }
  }

  // Avanza estadísticas sintéticas plausibles de los cedidos cuyo club no está en la base
  // de datos (fuera de la liga, p. ej. QPR, Lommel, AS Monaco). Así la pestaña de
  // estadísticas de cedidos muestra progreso real.
  function advanceOutOfLeagueLoans() {
    const team = gameState.team;
    if (!team) return;
    const loans = db.getLoanedOut(team.id);
    for (const { player: p } of loans) {
      const dest = p.loan && p.loan.currentTeam ? db.getTeamById(p.loan.currentTeam) : null;
      if (dest) continue; // club en la liga: sus partidos se simulan de verdad
      const s = window.PocketManager.getPlayerStats(p);
      if (Math.random() > 0.85) continue; // ~15% de jornadas sin jugar
      s.apps++;
      s.ratingSum += 5.6 + Math.random() * 2.0;
      if (p.pos === 'POR') continue;
      if (Math.random() < 0.10) s.goals++;
      if (Math.random() < 0.08) s.assists++;
      if (Math.random() < 0.05) s.yellows++;
      if (Math.random() < 0.01) s.reds++;
    }
  }

  function commitResult() {
    if (!pendingResult) return;
    const { result, match, jornada, compId } = pendingResult;

    // --- Partido continental (Champions) del usuario ---
    const cupSeason = compId && gameState.seasons[compId];
    if (cupSeason && cupSeason.type === 'continental') {
      const cont = window.PocketManager.continentalEngine;
      if (cont && cont.applyResult) {
        try { cont.applyResult(cupSeason, match, result); } catch (e) {}
      }
      if (window.PocketManager.refreshLineup) window.PocketManager.refreshLineup(gameState.team);
      awardFinishedCupTrophies();
      pendingResult = null;
      closeModal('match-result-modal');
      try { saveSystem.saveCurrentGame(); } catch (e) {}
      showScreen('screen-dashboard');
      return;
    }

    // --- Partido de copa (España o Inglaterra) ---
    if (cupSeason && cupSeason.type === 'cup') {
      const cupEngine = cupEngineFor(cupSeason.country);
      if (cupEngine && cupEngine.applyCupResult) {
        try { cupEngine.applyCupResult(cupSeason, match, result); } catch (e) {}
      }
      if (window.PocketManager.refreshLineup) window.PocketManager.refreshLineup(gameState.team);
      // Trofeo si la competición acaba con esta final jugada por el usuario.
      awardFinishedCupTrophies();
      pendingResult = null;
      closeModal('match-result-modal');
      try { saveSystem.saveCurrentGame(); } catch (e) {}
      showScreen('screen-dashboard');
      return;
    }

    const se = gameState.season || window.PocketManager.season.initSeason(gameState.team);
    window.PocketManager.season.applyMatchResult(se, match, result.homeGoals, result.awayGoals);
    if (window.PocketManager.calendar && window.PocketManager.calendar.buildMatchSummary) {
      match.summary = window.PocketManager.calendar.buildMatchSummary(result.events);
    }
    // Playoffs de liga (Hypermotion y EFL Championship) al completar las jornadas regulares.
    if (window.PocketManager.spanishEngine && window.PocketManager.spanishEngine.advance) {
      try { window.PocketManager.spanishEngine.advance(se, se.compId || userLeagueCompId()); } catch (e) {}
    }
    if (window.PocketManager.englandEngine && window.PocketManager.englandEngine.championshipAdvance) {
      try { window.PocketManager.englandEngine.championshipAdvance(se, se.compId || userLeagueCompId()); } catch (e) {}
    }

    // Stamina tras el partido (según minutos jugados)
    const minutes = result.minutesPlayed || {};
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    if (home) staminaEngine.applyMatchStamina(home, minutes[home.id]);
    if (away) staminaEngine.applyMatchStamina(away, minutes[away.id]);

    // Simular el resto de la jornada (clasificación completa + stats de cedidos en la liga)
    simulateLeagueRest(jornada);
    // Stats sintéticas para cedidos en clubes fuera de la liga
    advanceOutOfLeagueLoans();
    // Avanzar una jornada de cada liga ajena (simulación en paralelo de todas las competiciones)
    advanceForeignLeagues();
    // Avanzar las rondas de la Copa del Rey según las jornadas de liga completadas
    advanceCups();
    // Avanzar la jornada europea (Champions) de la semana actual
    advanceContinentals();

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

    // Mercado: la IA realiza fichajes puntuales tras cada jornada
    if (window.PocketManager.runAITransfers) window.PocketManager.runAITransfers(2);
    if (window.PocketManager.runAILoans) window.PocketManager.runAILoans(1);
    // Ofertas de la CPU por jugadores del usuario (chequeo semanal).
    if (window.PocketManager.runTransferOffers) window.PocketManager.runTransferOffers(2);
    if (window.PocketManager.runLoanOffers) window.PocketManager.runLoanOffers(1);
    // Cantera: genera a los canteranos en la Semana 20 (idempotente por temporada).
    if (window.PocketManager.academyEngine && window.PocketManager.academyEngine.maybeGenerateYouth) {
      try { window.PocketManager.academyEngine.maybeGenerateYouth(); } catch (e) {}
    }

    // Fin de temporada: evolución de medias + título de liga + arranque de la nueva temporada
    if (!window.PocketManager.season.nextFixture(se, gameState.team.id) && window.PocketManager.seasonEngine) {
      const changes = window.PocketManager.seasonEngine.updatePlayerRatingsAtSeasonEnd(db.getAllTeams());
      let trophy = null;
      if (window.PocketManager.seasonEngine.awardLeagueTitle) {
        try { trophy = window.PocketManager.seasonEngine.awardLeagueTitle(se); } catch (e) {}
      }
      const country = db.getCountryData(gameState.team.id);
      const leagueTeams = country ? country.teams : [gameState.team];
      for (const t of leagueTeams) if (staminaEngine.resetFitness) staminaEngine.resetFitness(t);
      try { db.returnLoans(); } catch (e) {}
      // Rellenar dorsales de los jugadores que vuelven de cesión (evita que bloqueen el partido)
      if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.ensureAllTeamsDorsals) {
        try { window.PocketManager.squadEngine.ensureAllTeamsDorsals(); } catch (e) {}
      }
      // Supercopa de España de la próxima temporada (se jugará en la semana 18):
      // se construye al cerrar la temporada con los resultados de esta (liga + Copa).
      const cupEngine = window.PocketManager.cupEngine;
      if (cupEngine) {
        const cup = gameState.seasons['copa_del_rey'];
        const leagueOrder = window.PocketManager.season.sortedStandings(se).map(s => s.teamId);
        const cupFinalists = cup && cup.finished ? [cup.winner, cup.runnerUp] : [];
        if (leagueOrder.length >= 2 && cupFinalists.length === 2) {
          try {
            const supercopa = cupEngine.buildSupercopa(leagueOrder, cupFinalists, { season: (gameState.currentSeason || 1) + 1 });
            if (supercopa) gameState.seasons['supercopa_de_espana'] = supercopa;
          } catch (e) {}
        }
        // Nueva temporada: nueva Copa del Rey (se crea en initCups)
        delete gameState.seasons['copa_del_rey'];
      }
      // Competiciones continentales: regenerar la Champions (y los torneos especiales) para la
      // próxima temporada usando la clasificación doméstica final (aún no reiniciada).
      if (window.PocketManager.continentalEngine && window.PocketManager.continentalEngine.seasonEnd) {
        try { window.PocketManager.continentalEngine.seasonEnd(); } catch (e) {}
      }
      // Ascensos/descensos de las ligas españolas (LaLiga <-> Hypermotion <-> Primera RFEF)
      // al cierre global de temporada. Reinicia también esas temporadas.
      if (window.PocketManager.spanishEngine && window.PocketManager.spanishEngine.seasonEnd) {
        try { window.PocketManager.spanishEngine.seasonEnd(); } catch (e) {}
      }
      // Ascensos/descensos de las ligas inglesas (Premier <-> Championship <-> League One).
      if (window.PocketManager.englandEngine && window.PocketManager.englandEngine.englandSeasonEnd) {
        try { window.PocketManager.englandEngine.englandSeasonEnd(); } catch (e) {}
      }
      // Supercoppa Italiana de la próxima temporada (Final Four: campeón/subcampeón de
      // Serie A + campeón/subcampeón de Coppa; duplicados -> 3º/4º de Serie A).
      if (window.PocketManager.italyEngine && window.PocketManager.italyEngine.buildSupercoppa) {
        const itSe = gameState.seasons['italia_league'];
        const coppa = gameState.seasons['coppa_italia'];
        if (itSe && itSe.jornadas) {
          const order = window.PocketManager.season.sortedStandings(itSe).map(s => s.teamId);
          if (order.length >= 2 && coppa && coppa.finished && coppa.winner && coppa.runnerUp) {
            try {
              const si = window.PocketManager.italyEngine.buildSupercoppa({
                season: (gameState.currentSeason || 1) + 1,
                leagueTop: order,
                cupFinalists: [coppa.winner, coppa.runnerUp]
              });
              if (si) gameState.seasons['supercoppa_italiana'] = si;
            } catch (e) {}
          }
        }
      }
      // Ascensos/descensos de la Serie A <-> Serie B y reinicio de la temporada italiana.
      if (window.PocketManager.italyEngine && window.PocketManager.italyEngine.seasonEnd) {
        try { window.PocketManager.italyEngine.seasonEnd(); } catch (e) {}
      }
      gameState.currentSeason = (gameState.currentSeason || 1) + 1;
      const userCompId = userLeagueCompId();
      gameState.season = window.PocketManager.season.initSeason(gameState.team, userCompId);
      if (userCompId) gameState.seasons[userCompId] = gameState.season;
      if (window.PocketManager.setFormation) window.PocketManager.setFormation(gameState.team.formation || '4-3-3');
      initCups();
      pendingSeasonSummary = { changes, trophy };
    }

    pendingResult = null;
    closeModal('match-result-modal');
    try { saveSystem.saveCurrentGame(); } catch (e) {}
    showScreen('screen-dashboard');
    if (pendingSeasonSummary) {
      showSeasonSummary(pendingSeasonSummary);
      pendingSeasonSummary = null;
    }
  }

  document.getElementById('match-result-continue').addEventListener('click', commitResult);
  document.getElementById('match-result-close').addEventListener('click', commitResult);

  // Muestra el resumen de cambios de media y títulos (liga + copa + supercopa) al cierre de temporada
  function showSeasonSummary(summary) {
    const body = document.getElementById('season-summary-body');
    const modal = document.getElementById('season-summary-modal');
    if (!body || !modal) return;
    const changes = summary ? summary.changes : null;
    const trophy = summary ? summary.trophy : null;
    const extra = summary && summary.trophies ? summary.trophies : [];

    let html = '';
    if (trophy && trophy.team) {
      html += `<div class="ss-trophy">🏆 ${trophy.team.name} gana la ${trophy.trophyName} (${trophy.count})</div>`;
    }
    for (const t of extra) {
      if (t && t.team) {
        html += `<div class="ss-trophy">🏆 ${t.team.name} gana la ${t.trophyName} (${t.count})</div>`;
      }
    }
    if (!changes || !changes.length) {
      html += '<p class="season-summary-empty">Sin cambios destacados de media esta temporada.</p>';
    } else {
      const rows = changes.map(c => `
        <div class="ss-row">
          <span class="ss-player">${c.flag ? c.flag + ' ' : ''}${c.name}<small class="ss-team">${c.team || ''}</small></span>
          <span class="ss-change">${c.from} ➔ ${c.to} <b class="${c.delta > 0 ? 'ss-up' : 'ss-down'}">${c.delta > 0 ? '+' : ''}${c.delta}</b></span>
        </div>`).join('');
      html += `<div class="ss-list">${rows}</div>`;
    }
    body.innerHTML = html;
    modal.classList.add('open');
  }
  document.getElementById('season-summary-continue').addEventListener('click', () => {
    document.getElementById('season-summary-modal').classList.remove('open');
  });

  // Bloquea el inicio del partido si algún titular/convocado del equipo del usuario
  // no tiene dorsal asignado. Devuelve true si se puede jugar.
  function validateUserDorsals(match) {
    const team = gameState.team;
    if (!team) return true;
    if (!(match.homeId === team.id || match.awayId === team.id)) return true;
    const squadEngine = window.PocketManager.squadEngine;
    if (!squadEngine || !squadEngine.validateMatchDorsals) return true;
    const offender = squadEngine.validateMatchDorsals(team);
    if (offender && offender.player) {
      showToast(`Debes asignar un dorsal a ${offender.player.name} para poder jugar`);
      return false;
    }
    return true;
  }

  document.addEventListener('start-match', (e) => {
    const { match, week, compId, jornada } = e.detail || {};
    if (!match) return;
    if (!validateUserDorsals(match)) return;
    setupLiveMatch(match, week, compId, jornada);
    showScreen('screen-match');
  });

  document.addEventListener('simulate-match', (e) => {
    const { match, week, compId, jornada } = e.detail || {};
    if (!match) return;
    if (!validateUserDorsals(match)) return;
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    if (!home || !away) return;
    applyPreMatchRecovery(week);
    const result = window.PocketManager.simulateInstant(home, away);
    showResultModal(result, match, week, compId, jornada);
  });

  document.addEventListener("nav", (e) => {
    showScreen(e.detail);
  });

  document.addEventListener("career-started", () => {
    saveSystem.setActiveSaveId(saveSystem.newSaveId());
    if (!gameState.currentDate) gameState.currentDate = new Date().toLocaleDateString("es-ES");
    if (gameState.team) {
      try { window.PocketManager.setFormation(gameState.team.formation || "4-3-3"); } catch (e) {}
      // Limpia el estado de alineación/once residual de una partida anterior (mismo id de equipo).
      if (window.PocketManager.restoreRuntime) { try { window.PocketManager.restoreRuntime(gameState.team, {}); } catch (e) {} }
    }
    // Nueva partida: toda la stamina al 100% (y sin lesiones/sanciones), también si en esta
    // misma sesión se jugó otra carrera y los objetos de los jugadores quedaron mutados.
    if (staminaEngine && staminaEngine.resetFitness) {
      try { for (const t of db.getAllTeams()) staminaEngine.resetFitness(t); } catch (e) {}
    }
    if (window.PocketManager.squadEngine && window.PocketManager.squadEngine.ensureAllTeamsDorsals) {
      window.PocketManager.squadEngine.ensureAllTeamsDorsals();
    }
    // Temporadas persistentes para TODAS las ligas (se simulan en paralelo).
    initAllSeasons();
    // Copa del Rey de la temporada (fase previa auto-simulada).
    initCups();
    // Refuerzo: la stamina del equipo del usuario siempre al 100 al empezar la carrera.
    if (gameState.team && staminaEngine && staminaEngine.resetFitness) {
      try { staminaEngine.resetFitness(gameState.team); } catch (e) {}
    }
    applyCareerToUI();
    if (window.PocketManager.updateInboxBadge) window.PocketManager.updateInboxBadge();
    if (window.PocketManager.updateBudgetBadge) window.PocketManager.updateBudgetBadge();
    if (window.PocketManager.runAITransfers && gameState.season) {
      window.PocketManager.runAITransfers(8); // mercado de inicio de temporada
      if (window.PocketManager.runAILoans) window.PocketManager.runAILoans(3);
    }
  });

  initNewGame();
});
