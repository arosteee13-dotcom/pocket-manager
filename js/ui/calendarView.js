(function () {
  // Calendario: SOLO los partidos de mi equipo, en vista semanal deslizable.
  // Barra superior con chips de semana (S1…Stotal) + flechas; abajo, la semana
  // seleccionada en una tarjeta grande (1-2 partidos, slot Miércoles/Domingo).
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const calendar = window.PocketManager.calendar;
  let bound = false;
  let lastFixtures = [];
  let highlightWeek = null;
  let selectedWeek = null;
  let lastRenderedCurrent = null;

  function badgeHtml(team, cls) {
    return `<span class="${cls}" style="background:linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})">${team.shortName}</span>`;
  }

  function compLabel(f) {
    if (f.compType === 'league') return 'LIGA';
    if (f.compId === 'copa_del_rey') return 'COPA';
    if (f.compId === 'supercopa_de_espana') return 'SUPERC';
    return 'COPA';
  }

  function compCls(f) {
    if (f.compType === 'league') return 'cal-comp-liga';
    if (f.compId === 'copa_del_rey') return 'cal-comp-copa';
    return 'cal-comp-super';
  }

  function fixtureKey(f) {
    return `${f.week}|${f.compId}|${f.match.homeId}|${f.match.awayId}`;
  }

  function findFixture(key) {
    return lastFixtures.find(f => fixtureKey(f) === key) || null;
  }

  // Autoscroll del chip activo hasta que sea visible (diferido tras la animación de
  // entrada del screen `screenIn`, 0.25s, para que el cálculo no se desvíe).
  function scrollActiveChip() {
    const root = document.getElementById('calendar-root');
    if (!root) return;
    const chip = root.querySelector('.cal-chip.active') || root.querySelector('.cal-chip.current');
    if (!chip || !chip.scrollIntoView) return;

    const doScroll = () => {
      try { chip.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' }); } catch (e) {}
    };

    const screen = document.getElementById('screen-calendar');
    if (!screen || !document.body.contains(screen)) { doScroll(); return; }

    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      screen.removeEventListener('animationend', onEnd);
      clearTimeout(backup);
      doScroll();
    };
    const onEnd = (ev) => { if (ev.target === screen) finish(); };
    screen.addEventListener('animationend', onEnd);
    const backup = setTimeout(finish, 320);
  }

  function renderCalendar() {
    const root = document.getElementById('calendar-root');
    if (!root) return;
    const team = gameState.team;
    if (!team) {
      root.innerHTML = '<p class="calendar-empty">No hay equipo activo.</p>';
      return;
    }
    if (!calendar || !calendar.allUserFixtures) {
      root.innerHTML = '<p class="calendar-empty">Aún no hay calendario. Empieza una partida.</p>';
      return;
    }

    const fixtures = calendar.allUserFixtures(team.id);
    lastFixtures = fixtures;
    const currentWeek = calendar.currentUserWeek(team.id);
    const totalWeeks = calendar.totalWeeks ? calendar.totalWeeks(team.id) : 39;

    // Snap a la semana actual cuando la jornada avanza; conserva la elección al navegar.
    if (selectedWeek === null || lastRenderedCurrent !== currentWeek) {
      selectedWeek = highlightWeek || currentWeek;
    } else if (highlightWeek) {
      selectedWeek = highlightWeek;
    }
    lastRenderedCurrent = currentWeek;
    highlightWeek = null;

    const week = Math.max(1, Math.min(totalWeeks, Number(selectedWeek) || currentWeek));

    const byWeek = {};
    for (const f of fixtures) {
      (byWeek[f.week] = byWeek[f.week] || []).push(f);
    }

    root.innerHTML = `
      <div class="cal-nav">
        <button class="cal-nav-btn" data-cal="prev" aria-label="Semana anterior">‹</button>
        <div class="cal-chips">${chipsHtml(totalWeeks, currentWeek, week)}</div>
        <button class="cal-nav-btn" data-cal="next" aria-label="Semana siguiente">›</button>
      </div>
      <div class="cal-sheet">${sheetHtml(week, byWeek[week] || [], team, currentWeek)}</div>
    `;

    scrollActiveChip();
    bind();
  }

  function chipsHtml(totalWeeks, currentWeek, selected) {
    let html = '';
    for (let w = 1; w <= totalWeeks; w++) {
      const cls = ['cal-chip', w === currentWeek ? 'current' : '', w === selected ? 'active' : ''].filter(Boolean).join(' ');
      html += `<button class="${cls}" data-week="${w}">S${w}</button>`;
    }
    return html;
  }

  function sheetHtml(week, fixtures, team, currentWeek) {
    const isBreak = week === (calendar && calendar.WEEK_BREAK);
    const double = fixtures.length >= 2;
    const tags = [];
    if (!fixtures.length) tags.push('Descanso');
    if (double) tags.push('Doble jornada');
    if (isBreak && !fixtures.length) tags.push('Parón');
    const tagHtml = tags.length
      ? `<span class="cal-week-tags">${tags.map(t => `<span class="cal-week-tag">${t}</span>`).join('')}</span>`
      : '';

    const head = `<div class="cal-week-head"><span class="cal-week-title">Semana ${week}</span>${tagHtml}</div>`;

    if (!fixtures.length) {
      return `<div class="cal-week" data-week="${week}">${head}<p class="cal-rest">Sin partidos. Descanso.</p></div>`;
    }
    return `<div class="cal-week" data-week="${week}">${head}<div class="cal-week-matches">${fixtures.map(f => matchCardHtml(f, team, currentWeek)).join('')}</div></div>`;
  }

  function matchCardHtml(f, team, currentWeek) {
    const home = db.getTeamById(f.match.homeId);
    const away = db.getTeamById(f.match.awayId);
    const rival = f.isHome ? away : home;
    const played = !!f.match.played || !!f.match.winnerId;
    const playable = !played && f.week === currentWeek;
    const slotLabel = calendar && calendar.SLOT_LABELS ? (calendar.SLOT_LABELS[f.slot] || '') : '';
    const rivalName = rival ? rival.shortName : '—';
    const result = played ? `${f.match.homeGoals} - ${f.match.awayGoals}` : 'vs';
    const side = f.isHome ? 'Local' : 'Visitante';
    const key = fixtureKey(f);
    const stateCls = played ? 'finished' : (playable ? 'next' : 'future');
    const stateLabel = played ? 'Finalizado' : (playable ? 'Tu próximo partido' : 'Pendiente');

    return `
      <div class="cal-match ${stateCls}" data-key="${key}">
        <div class="cal-match-top">
          <span class="cal-slot">${slotLabel}</span>
          <span class="cal-comp ${compCls(f)}">${compLabel(f)}</span>
          ${f.roundLabel ? `<span class="cal-round">${f.roundLabel}</span>` : ''}
        </div>
        <div class="cal-match-teams">
          ${badgeHtml(team, 'cal-badge')}
          <span class="cal-score">${result}</span>
          ${rival ? badgeHtml(rival, 'cal-badge') : '<span class="cal-badge"></span>'}
        </div>
        <div class="cal-match-meta">
          <span class="cal-side ${f.isHome ? 'home' : 'away'}">${side}</span>
          <span class="cal-state ${stateCls}">${stateLabel}</span>
        </div>
        <div class="cal-match-actions">
          ${playable ? `
            <button class="cal-btn-play" data-action="play" data-key="${key}">▶ JUGAR</button>
            <button class="cal-btn-sim" data-action="sim" data-key="${key}">SIMULAR</button>` : ''}
          ${played ? `<button class="cal-btn-details" data-action="details" data-key="${key}">Ver detalles</button>` : ''}
        </div>
      </div>`;
  }

  function openMatchDetails(f) {
    const body = document.getElementById('match-details-body');
    if (!body) return;
    const match = f.match;
    const home = db.getTeamById(match.homeId);
    const away = db.getTeamById(match.awayId);
    const sum = match.summary || { goals: [], yellows: [], reds: [] };
    const sideName = (side) => (side === 'home' ? (home ? home.shortName : '—') : (away ? away.shortName : '—'));
    const goals = sum.goals.map(g =>
      `<div class="md-row"><span class="md-row-name">⚽ ${g.name}${g.assist ? ` <span class="md-assist">🅰️ ${g.assist}</span>` : ''}</span><span class="md-row-side">${sideName(g.side)}</span></div>`).join('');
    const yellows = sum.yellows.map(c =>
      `<div class="md-row"><span class="md-row-name">🟨 ${c.name}</span><span class="md-row-side">${sideName(c.side)}</span></div>`).join('');
    const reds = sum.reds.map(c =>
      `<div class="md-row"><span class="md-row-name">🟥 ${c.name}</span><span class="md-row-side">${sideName(c.side)}</span></div>`).join('');

    body.innerHTML = `
      <div class="md-score">${match.homeGoals} - ${match.awayGoals}</div>
      <div class="md-teams"><span>${home ? home.shortName : '—'}</span><span>${away ? away.shortName : '—'}</span></div>
      <div class="md-section-title">Goles</div>
      ${goals || '<p class="md-none">Sin goles.</p>'}
      <div class="md-section-title">Tarjetas</div>
      ${(yellows + reds) || '<p class="md-none">Sin tarjetas.</p>'}`;

    const modal = document.getElementById('match-details-modal');
    if (modal) modal.classList.add('open');
  }

  // Abre el calendario resaltando la semana indicada.
  function openCalendarAt(week) {
    highlightWeek = Number(week) || null;
    document.dispatchEvent(new CustomEvent('nav', { detail: 'screen-calendar' }));
  }

  function bind() {
    if (bound) return;
    bound = true;

    const root = document.getElementById('calendar-root');
    if (root) {
      const chipsEl = () => root.querySelector('.cal-chips');
      let dragState = null;

      // Rueda del ratón sobre la franja de semanas -> scroll horizontal.
      root.addEventListener('wheel', (e) => {
        const chips = chipsEl();
        if (!chips || e.deltaY === 0) return;
        if (e.target && !chips.contains(e.target)) return;
        if (chips.scrollWidth <= chips.clientWidth) return;
        const max = chips.scrollWidth - chips.clientWidth;
        const next = Math.max(0, Math.min(max, chips.scrollLeft + e.deltaY));
        if (next !== chips.scrollLeft) {
          e.preventDefault();
          chips.scrollLeft = next;
        }
      }, { passive: false });

      // Arrastre con el ratón (el táctil usa el pan nativo de touch-action: pan-x).
      root.addEventListener('pointerdown', (e) => {
        if (e.pointerType !== 'mouse') return;
        const chips = chipsEl();
        if (!chips || !chips.contains(e.target)) return;
        dragState = { startX: e.clientX, scrollLeft: chips.scrollLeft, moved: false };
      });
      root.addEventListener('pointermove', (e) => {
        if (!dragState) return;
        const chips = chipsEl();
        if (!chips) return;
        const dx = e.clientX - dragState.startX;
        if (Math.abs(dx) > 5) dragState.moved = true;
        chips.scrollLeft = dragState.scrollLeft - dx;
      });
      const endDrag = () => {
        // Si hubo arrastre, suprime el clic posterior (no saltar de semana al arrastrar).
        if (dragState && dragState.moved) {
          const suppress = (ev) => {
            ev.stopPropagation();
            document.removeEventListener('click', suppress, true);
          };
          document.addEventListener('click', suppress, true);
        }
        dragState = null;
      };
      root.addEventListener('pointerup', endDrag);
      root.addEventListener('pointercancel', endDrag);

      root.addEventListener('click', (e) => {
        const team = gameState.team;
        const totalWeeks = (team && calendar && calendar.totalWeeks) ? calendar.totalWeeks(team.id) : 39;

        const nav = e.target.closest('[data-cal]');
        if (nav) {
          const dir = nav.dataset.cal === 'prev' ? -1 : 1;
          selectedWeek = Math.max(1, Math.min(totalWeeks, (Number(selectedWeek) || 1) + dir));
          renderCalendar();
          return;
        }

        const chip = e.target.closest('[data-week]');
        if (chip) {
          selectedWeek = Number(chip.dataset.week);
          renderCalendar();
          return;
        }

        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const key = btn.dataset.key;
        const f = key ? findFixture(key) : null;
        if (!f) return;
        const action = btn.dataset.action;
        if (action === 'play' || action === 'sim') {
          const ev = action === 'play' ? 'start-match' : 'simulate-match';
          document.dispatchEvent(new CustomEvent(ev, {
            detail: { match: f.match, week: f.week, compId: f.compId, jornada: f.jornada }
          }));
        } else if (action === 'details') {
          openMatchDetails(f);
        }
      });
    }

    const modal = document.getElementById('match-details-modal');
    if (modal) {
      document.getElementById('match-details-close').addEventListener('click', () => modal.classList.remove('open'));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    }
  }

  window.PocketManager.renderCalendar = renderCalendar;
  window.PocketManager.openCalendarAt = openCalendarAt;
})();
