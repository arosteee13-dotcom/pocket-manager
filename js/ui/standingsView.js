(function () {
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;
  const season = window.PocketManager.season;
  const nationalities = window.PocketManager.nationalities || [];
  const getPlayerStats = window.PocketManager.getPlayerStats;

  const COUNTRY_FLAG_OVERRIDES = { 'Inglaterra': 'GB-ENG' };
  const state = { country: null, competitionId: null, group: null, round: null, topOpen: null };
  let bound = false;

  function normalize(s) {
    return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  function flagFromCode(code) {
    if (!code) return '🌍';
    const upper = String(code).toUpperCase();

    // Código ISO alfa-2 -> bandera regional (🇪🇸, 🇬🇧…)
    if (upper.length === 2) {
      return String.fromCodePoint(...[...upper].map(c => 0x1F1E6 + c.charCodeAt(0) - 65));
    }

    // Subdivisión "XX-YYY" -> secuencia de etiquetas (🏴󠁧󠁢󠁥󠁮󠁧󠁿 Inglaterra, etc.)
    const parts = upper.split('-');
    if (parts.length === 2 && parts[0].length === 2 && parts[1].length === 3) {
      const tags = [...(parts[0] + parts[1]).toLowerCase()].map(c => 0xE0000 + c.charCodeAt(0));
      return String.fromCodePoint(0x1F3F4, ...tags, 0xE007F);
    }

    return '🌍';
  }

  function flagForCountry(name) {
    // Prioridad a las banderas de país (Inglaterra -> 🇬🇧) antes que la subdivisión
    const override = COUNTRY_FLAG_OVERRIDES[name];
    if (override) return flagFromCode(override);
    const found = nationalities.find(n => n.name === name);
    if (found) return flagFromCode(found.code);
    return '🌍';
  }

  function initialsOf(s) {
    return String(s || '').replace(/[^A-Za-zÁÉÍÓÚÑ]/g, '').slice(0, 3).toUpperCase();
  }

  function badgeHtml(team, cls) {
    return `<span class="${cls}" style="background:linear-gradient(135deg, ${team.primaryColor}, ${team.secondaryColor || team.primaryColor})">${team.shortName}</span>`;
  }

  // Etiqueta corta de una ronda de copa: 1/N se mantiene, 1/8 -> Octavos,
  // Cuartos/Semifinal/Final normalizados; el resto conserva su nombre oficial.
  function roundLabel(name) {
    const n = String(name || '');
    if (n === 'Final') return 'Final';
    if (/semifinal/i.test(n)) return 'Semifinal';
    if (/cuartos/i.test(n)) return 'Cuartos';
    if (n === 'Treintaidosavos de final') return '1/32';
    if (n === 'Dieciseisavos de final') return '1/16';
    const m = n.match(/^1\/(\d+)$/);
    if (m) {
      if (Number(m[1]) === 8) return 'Octavos';
      return n; // 1/16, 1/32, 1/64, 1/128…
    }
    return n; // Ronda 1-5, Fase previa, Grupo N/M, …
  }

  // Rondas de una copa para mostrar en el subapartado: se omiten las fases previas de la
  // Copa del Rey (clasificatorias de divisiones) y se agrupan las dos piernas de la
  // Semifinal en una sola entrada. Devuelve [{ label, rounds: [round...] }].
  function displayRounds(cup) {
    const rounds = (cup && cup.rounds) || [];
    const out = [];
    for (let i = 0; i < rounds.length; i++) {
      const r = rounds[i];
      if (/^fase previa/i.test(String(r.round || ''))) continue;
      if (/^semifinal/i.test(String(r.round || ''))) {
        const legs = [r];
        let j = i + 1;
        while (j < rounds.length && /^semifinal/i.test(String(rounds[j].round || ''))) {
          legs.push(rounds[j]);
          j++;
        }
        out.push({ label: 'Semifinal', rounds: legs });
        i = j - 1;
        continue;
      }
      out.push({ label: roundLabel(r.round), rounds: [r] });
    }
    return out;
  }

  function avatarHtml(p) {
    const hasNum = p.number !== undefined && p.number !== null && p.number !== '';
    return hasNum ? `<b>${p.number}</b>` : '<i></i>';
  }

  function countries() {
    return db.getCountries() || [];
  }

  function competitionsOf(countryName) {
    return db.getCompetitions(countryName) || [];
  }

  function userCountry() {
    if (gameState.team) {
      const c = db.getCountryData(gameState.team.id);
      if (c) return c.country;
    }
    const all = countries();
    return all.length ? all[0].name : null;
  }

  function currentCompetition() {
    return competitionsOf(state.country).find(c => c.id === state.competitionId) ||
      competitionsOf(state.country)[0] || null;
  }

  // Clasificación real de la competición (todas las ligas se simulan en paralelo).
  function seasonFor(comp) {
    if (!comp) return null;
    if (comp.type === 'cup') {
      return gameState.seasons ? (gameState.seasons[comp.id] || null) : null;
    }
    const saved = gameState.seasons ? gameState.seasons[comp.id] : null;
    if (saved) return saved;
    return comp.teams.length ? window.PocketManager.season.initSeason(comp.teams[0]) : null;
  }

  // Zonas de clasificación: etiqueta y color por zona (esquema para liga de 20 equipos).
  const ZONE_META = {
    champ: { label: 'Campeón', color: '#A8E026' },
    champions: { label: 'Champions League', color: '#30D32B' },
    europa: { label: 'Europa League', color: '#2BD396' },
    conference: { label: 'Fase Previa Conference League', color: '#5B97E2' },
    permanencia: { label: 'Permanencia', color: '#B0B0B0' },
    descenso: { label: 'Descenso', color: '#EF3A4B' },
    ascenso: { label: 'Ascenso Directo', color: '#1B7A36' },
    playoffsAscenso: { label: 'Playoffs de Ascenso', color: '#8BC57F' }
  };

  // La Premier League no tiene plaza de Conference League (su permanencia empieza en el 6).
  function hasConferenceFor(comp) {
    return !(comp && comp.name === 'Premier League');
  }

  // Zona según la posición (0-based). Exacta para n=20 (1 / 2-4 / 5 / 6 / 7-17 / 18-20);
  // se escala proporcionalmente para otras ligas y en ligas muy pequeñas solo campeón + permanencia.
  // En la Premier League (hasConference=false) no existe la zona `conference`.
  function zoneOf(index, n, hasConference) {
    if (!n || n <= 0) return 'permanencia';
    if (n < 6) return index === 0 ? 'champ' : 'permanencia';
    const R = n / 20;
    const scaled = (ref, min) => Math.max(min, Math.round(ref * R));
    const champions = scaled(3, 0);
    const europa = scaled(1, 0);
    const conference = hasConference === false ? 0 : scaled(1, 0);
    const descenso = scaled(3, 1);
    let p = 1; // campeón
    if (index < p) return 'champ';
    if (index < (p += champions)) return 'champions';
    if (index < (p += europa)) return 'europa';
    if (index < (p += conference)) return 'conference';
    if (index >= n - descenso) return 'descenso';
    return 'permanencia';
  }

  // Zonas de LaLiga Hypermotion (22 equipos): 1-2 ascenso, 3-6 playoffs, 7-18 permanencia, 19-22 descenso.
  function hypermotionZoneOf(index, n) {
    if (!n || n <= 0) return 'permanencia';
    if (index < 2) return 'ascenso';
    if (index < 6) return 'playoffsAscenso';
    if (index >= n - 4) return 'descenso';
    return 'permanencia';
  }

  // Zona por competición: Hypermotion usa sus propias zonas; el resto el esquema europeo.
  function zoneOfComp(comp, index, n) {
    if (comp && String(comp.id || '').indexOf('hypermotion') !== -1) return hypermotionZoneOf(index, n);
    return zoneOf(index, n, hasConferenceFor(comp));
  }

  // Zonas presentes en una liga de `n` equipos, en orden canónico (para la leyenda).
  function zonesFor(n, comp) {
    const order = ['champ', 'champions', 'europa', 'conference', 'ascenso', 'playoffsAscenso', 'permanencia', 'descenso'];
    const present = new Set();
    if (n && n > 0) {
      for (let i = 0; i < n; i++) present.add(zoneOfComp(comp, i, n));
    }
    return order.filter(z => present.has(z));
  }

  // Leyenda dinámica: solo las zonas que aplican a la liga seleccionada.
  function legendHtml(n, comp) {
    const zones = zonesFor(n, comp);
    if (!zones.length) return '';
    return `<div class="st-legend">${zones.map(z => {
      const meta = ZONE_META[z] || { label: z, color: '#B0B0B0' };
      return `<span class="st-legend-item"><i class="st-legend-dot" style="background:${meta.color}"></i>${meta.label}</span>`;
    }).join('')}</div>`;
  }


  function leaderData(comp) {
    const scorers = [];
    const assisters = [];
    for (const t of comp.teams) {
      for (const p of t.players) {
        const s = getPlayerStats(p);
        scorers.push({ p, t, s });
        assisters.push({ p, t, s });
      }
    }
    const better = (a, b, key) => {
      if (!b) return true;
      if (a.s[key] !== b.s[key]) return a.s[key] > b.s[key];
      return (a.p.ovr || 0) > (b.p.ovr || 0);
    };
    let scorer = null, assister = null;
    for (const it of scorers) if (it.s.goals > 0 && better(it, scorer, 'goals')) scorer = it;
    for (const it of assisters) if (it.s.assists > 0 && better(it, assister, 'assists')) assister = it;
    const topScorers = scorers.filter(x => x.s.goals > 0)
      .sort((a, b) => (b.s.goals - a.s.goals) || (b.s.assists - a.s.assists) || (b.p.ovr - a.p.ovr)).slice(0, 10);
    const topAssisters = assisters.filter(x => x.s.assists > 0)
      .sort((a, b) => (b.s.assists - a.s.assists) || (b.s.goals - a.s.goals) || (b.p.ovr - a.p.ovr)).slice(0, 10);
    return { scorer, assister, topScorers, topAssisters };
  }

  function leaderCard(title, icon, item, statKey, dataTop) {
    const valLabel = statKey === 'goals' ? 'goles' : 'asistencias';
    if (!item) {
      return `
        <div class="st-leader">
          <span class="st-leader-title">${icon} ${title}</span>
          <span class="st-leader-empty">Sin datos de ${valLabel}</span>
        </div>`;
    }
    const { p, t, s } = item;
    const val = statKey === 'goals' ? s.goals : s.assists;
    return `
      <div class="st-leader">
        <span class="st-leader-title">${icon} ${title}</span>
        <span class="st-leader-main">
          <span class="st-leader-avatar-wrap">
            <span class="st-leader-avatar">${avatarHtml(p)}</span>
            ${badgeHtml(t, 'st-leader-badge')}
          </span>
          <span class="st-leader-info">
            <span class="st-leader-name">${p.flag ? p.flag + ' ' : ''}${p.name}</span>
            <span class="st-leader-club">${t.name}</span>
          </span>
          <span class="st-leader-val">${val}</span>
        </span>
        <button class="st-leader-link" data-top="${dataTop}">Ver top 10 ➔</button>
      </div>`;
  }

  function top10Html(title, list, statKey) {
    if (!list.length) return '';
    const rows = list.map((item, i) => {
      const { p, t, s } = item;
      const val = statKey === 'goals' ? s.goals : s.assists;
      return `
        <div class="st-top-row">
          <span class="st-top-pos">${i + 1}</span>
          <span class="st-top-avatar-wrap">
            <span class="st-top-avatar">${avatarHtml(p)}</span>
            ${badgeHtml(t, 'st-top-badge')}
          </span>
          <span class="st-top-info">
            <span class="st-top-name">${p.flag ? p.flag + ' ' : ''}${p.name}</span>
            <span class="st-top-club">${t.shortName}</span>
          </span>
          <span class="st-top-val">${val}</span>
        </div>`;
    }).join('');
    return `<h4 class="st-top-title">${title}</h4><div class="st-top-list">${rows}</div>`;
  }

  function tableHtml(comp) {
    const se = seasonFor(comp);
    if (!se) return '<p class="st-empty">Sin datos de clasificación.</p>';
    const rows = window.PocketManager.season.sortedStandings(se);
    if (!rows.length) return '<p class="st-empty">Sin equipos.</p>';
    const userTeamId = gameState.team ? gameState.team.id : null;
    const n = rows.length;
    const head = `
      <div class="st-head">
        <span class="st-c-pos">#</span>
        <span class="st-c-team">EQUIPO</span>
        <span class="st-c-num">PTS</span>
        <span class="st-c-num">PJ</span>
        <span class="st-c-num">PG</span>
        <span class="st-c-num">PE</span>
        <span class="st-c-num">PP</span>
        <span class="st-c-num">GF</span>
        <span class="st-c-num">GC</span>
        <span class="st-c-num st-c-dg">DG</span>
      </div>`;
    const body = rows.map((s, i) => {
      const team = db.getTeamById(s.teamId);
      const zone = zoneOfComp(comp, i, n);
      const dg = (s.gf || 0) - (s.gc || 0);
      const dgStr = dg > 0 ? '+' + dg : String(dg);
      const user = team && userTeamId && team.id === userTeamId ? ' user' : '';
      return `
        <div class="st-row ${zone}${user}" data-team-id="${s.teamId}">
          <span class="st-c-pos"><i>${i + 1}</i></span>
          <span class="st-c-team">${team ? badgeHtml(team, 'st-badge') : ''}<span class="st-team-name">${team ? team.name : '—'}</span></span>
          <span class="st-c-num st-pts">${s.pts}</span>
          <span class="st-c-num">${s.pj}</span>
          <span class="st-c-num">${s.g}</span>
          <span class="st-c-num">${s.e}</span>
          <span class="st-c-num">${s.p}</span>
          <span class="st-c-num">${s.gf}</span>
          <span class="st-c-num">${s.gc}</span>
          <span class="st-c-num st-c-dg">${dgStr}</span>
        </div>`;
    }).join('');
    return head + body;
  }

  // Panel de una competición de copa: rondas con resultados y campeón (en vez de tabla).
  function cupPanelHtml(comp) {
    const cup = gameState.seasons[comp.id];
    if (!cup || !cup.rounds) return '<p class="st-empty">Sin datos.</p>';
    const nameOf = (id) => { const t = db.getTeamById(id); return t ? t.shortName : '—'; };
    const matchLine = (m) => {
      const home = nameOf(m.homeId), away = nameOf(m.awayId);
      if (!m.played) {
        return `<div class="cup-match"><span class="cup-mh">${home}</span><span class="cup-vs">vs</span><span class="cup-ma">${away}</span></div>`;
      }
      const score = `${m.homeGoals} - ${m.awayGoals}`;
      const pen = m.penalties ? `<small class="cup-note">pen ${m.penalties.home}-${m.penalties.away}</small>` : '';
      const extra = m.etGoals ? `<small class="cup-note">prórr.</small>` : '';
      const leg = m.leg ? `<small class="cup-note">${m.leg === 1 ? 'ida' : 'vuelta'}</small>` : '';
      const homeW = m.winnerId === m.homeId ? ' cup-win' : '';
      const awayW = m.winnerId === m.awayId ? ' cup-win' : '';
      return `<div class="cup-match">
        <span class="cup-mh${homeW}">${home}</span>
        <span class="cup-score">${score}${extra}${pen}${leg}</span>
        <span class="cup-ma${awayW}">${away}</span>
      </div>`;
    };
    const display = displayRounds(cup);
    const list = (state.round !== null && display[state.round]) ? [display[state.round]] : display;
    const rounds = list.map(d => {
      const pending = !d.rounds.every(x => x.completed);
      return `
      <div class="cup-round">
        <div class="cup-round-title">${d.label}${pending ? ' · pendiente' : ''}</div>
        ${d.rounds.map(r => r.matches.map(matchLine).join('')).join('')}
      </div>`;
    }).join('');
    const winner = cup.winner ? `<div class="cup-winner">🏆 Campeón: ${nameOf(cup.winner)}</div>` : '';
    return rounds + winner;
  }

  function renderStandings() {
    if (!state.country || !competitionsOf(state.country).length) {
      state.country = state.country || userCountry();
    }
    if (!competitionsOf(state.country).some(c => c.id === state.competitionId)) {
      const comps = competitionsOf(state.country);
      state.competitionId = comps.length ? comps[0].id : null;
      state.group = null;
      state.round = null;
      state.topOpen = null;
    }
    const comp = currentCompetition();

    const trigger = document.getElementById('st-countries-trigger');
    if (trigger) {
      trigger.innerHTML = `
        <span class="nat-flag">${flagForCountry(state.country)}</span>
        <span class="selected-nat">${state.country}</span>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    }

    const compsEl = document.getElementById('st-comps');
    if (compsEl) {
      compsEl.innerHTML = competitionsOf(state.country).map(c => `
        <button class="st-comp${c.id === state.competitionId ? ' active' : ''}" data-comp="${c.id}">
          <span class="st-comp-logo">${initialsOf(c.name)}</span>
          <span class="st-comp-name">${c.name}</span>
        </button>`).join('');
    }

    const groupsEl = document.getElementById('st-groups');
    if (groupsEl) {
      const cup = (comp && comp.type === 'cup') ? gameState.seasons[comp.id] : null;
      const rounds = (cup && cup.rounds && cup.rounds.length) ? displayRounds(cup) : null;
      if (rounds) {
        // Subapartado de rondas en las copas: un chip por ronda (por defecto la primera).
        if (state.round === null || state.round < 0 || state.round >= rounds.length) state.round = 0;
        groupsEl.style.display = 'flex';
        groupsEl.innerHTML = rounds.map((d, i) =>
          `<button class="subtab${state.round === i ? ' active' : ''}" data-round="${i}">${d.label}</button>`
        ).join('');
      } else {
        const groups = comp && comp.groups;
        groupsEl.style.display = groups && groups.length ? 'flex' : 'none';
        if (groups && groups.length) {
          groupsEl.innerHTML = groups.map(g => `
            <button class="subtab${state.group === g.id ? ' active' : ''}" data-group="${g.id}">${g.name}</button>`).join('');
        }
      }
    }

    const leadersEl = document.getElementById('st-leaders');
    const topS = document.getElementById('st-top10-scorers');
    const topA = document.getElementById('st-top10-assists');
    const isCup = comp && comp.type === 'cup';
    if (comp && !isCup) {
      const ld = leaderData(comp);
      if (leadersEl) {
        leadersEl.innerHTML = leaderCard('MÁXIMO GOLEADOR', '⚽', ld.scorer, 'goals', 'scorers') +
          leaderCard('MÁXIMO ASISTENTE', '👟', ld.assister, 'assists', 'assists');
      }
      if (topS) {
        topS.innerHTML = top10Html('⚽ Top 10 goleadores', ld.topScorers, 'goals');
        topS.style.display = state.topOpen === 'scorers' ? 'block' : 'none';
      }
      if (topA) {
        topA.innerHTML = top10Html('👟 Top 10 asistentes', ld.topAssisters, 'assists');
        topA.style.display = state.topOpen === 'assists' ? 'block' : 'none';
      }
    } else {
      if (leadersEl) leadersEl.innerHTML = '';
      if (topS) topS.style.display = 'none';
      if (topA) topA.style.display = 'none';
    }

    const tableEl = document.getElementById('st-table');
    if (tableEl) {
      tableEl.innerHTML = isCup ? cupPanelHtml(comp) : (comp ? tableHtml(comp) : '<p class="st-empty">Sin competiciones.</p>');
    }

    // Leyenda dinámica bajo la tabla (solo las zonas que aplican a esta liga)
    const legendEl = document.getElementById('st-legend');
    if (legendEl) legendEl.innerHTML = (!isCup && comp) ? legendHtml(comp.teams ? comp.teams.length : 0, comp) : '';

    bind();
  }

  function renderCountryList(q) {
    const list = document.getElementById('standings-country-list');
    if (!list) return;
    const nq = normalize(q);
    const items = countries()
      .filter(c => !nq || normalize(c.name).includes(nq))
      .map(c => `
        <button class="nat-option${c.name === state.country ? ' selected' : ''}" data-country="${c.name}">
          <span class="nat-flag">${flagForCountry(c.name)}</span>
          <span class="nat-name">${c.name}</span>
          ${c.name === state.country ? '<span class="nat-check">✓</span>' : ''}
        </button>`)
      .join('');
    list.innerHTML = items || '<p class="nat-empty">Sin resultados</p>';
  }

  function bind() {
    if (bound) return;
    bound = true;

    const trigger = document.getElementById('st-countries-trigger');
    const modal = document.getElementById('standings-country-modal');
    const search = document.getElementById('standings-country-search');
    const list = document.getElementById('standings-country-list');

    // Clic en un equipo de la clasificación -> ver su plantilla completa (solo lectura)
    const tableEl = document.getElementById('st-table');
    if (tableEl) {
      tableEl.addEventListener('click', (e) => {
        const row = e.target.closest('.st-row[data-team-id]');
        if (!row) return;
        const teamId = row.dataset.teamId;
        if (window.PocketManager.renderSquadScreen) {
          document.dispatchEvent(new CustomEvent('nav', { detail: 'screen-squad' }));
          window.PocketManager.renderSquadScreen(teamId, false, true);
        }
      });
    }

    if (trigger) {
      trigger.addEventListener('click', () => {
        search.value = '';
        renderCountryList('');
        modal.classList.add('open');
        search.focus();
      });
    }
    document.getElementById('standings-country-close').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    search.addEventListener('input', () => renderCountryList(search.value));
    list.addEventListener('click', (e) => {
      const opt = e.target.closest('.nat-option');
      if (!opt) return;
      state.country = opt.dataset.country;
      state.competitionId = null;
      state.group = null;
      state.round = null;
      state.topOpen = null;
      modal.classList.remove('open');
      renderStandings();
    });

    const compsEl = document.getElementById('st-comps');
    compsEl.addEventListener('click', (e) => {
      const btn = e.target.closest('.st-comp');
      if (!btn) return;
      state.competitionId = btn.dataset.comp;
      state.round = null;
      state.topOpen = null;
      renderStandings();
    });

    const groupsEl = document.getElementById('st-groups');
    groupsEl.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-group]');
      if (!pill) return;
      state.group = pill.dataset.group;
      renderStandings();
    });
    groupsEl.addEventListener('click', (e) => {
      const pill = e.target.closest('[data-round]');
      if (!pill) return;
      state.round = Number(pill.dataset.round);
      renderStandings();
    });

    const leadersEl = document.getElementById('st-leaders');
    leadersEl.addEventListener('click', (e) => {
      const link = e.target.closest('[data-top]');
      if (!link) return;
      state.topOpen = state.topOpen === link.dataset.top ? null : link.dataset.top;
      renderStandings();
    });
  }

  window.PocketManager.renderStandings = renderStandings;
})();
