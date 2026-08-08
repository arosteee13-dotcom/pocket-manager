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

  // Rondas de una copa para mostrar en el subapartado: se muestran todas las rondas
  // construidas (incluidas las clasificatorias 1/128·1/64·1/32 y Previa 1-3), omitiendo las
  // literalmente llamadas "Fase previa" y agrupando las dos piernas de la Semifinal en una
  // sola entrada. Se añaden también las rondas del plan aún no construidas como "pendientes",
  // de modo que el panel muestra el torneo completo: Copa del Rey (1/128·1/64·1/32·1/16·
  // Octavos·Cuartos·Semifinal·Final) y copas inglesas (EFL Cup 1/128→Final; FA Cup Previa 1-3
  // + 1/1024→Final). Devuelve [{ label, rounds: [round...], pending }].
  // Competiciones continentales mostradas al seleccionar "Continentales".
  const CONTINENTAL_COMPETITIONS = [
    { id: 'uefa_champions_league', name: 'UEFA Champions League', short: 'CHA' },
    { id: 'uefa_europa_league', name: 'UEFA Europa League', short: 'EUR' },
    { id: 'uefa_conference_league', name: 'UEFA Conference League', short: 'CON' },
    { id: 'uefa_super_cup', name: 'Supercopa de Europa', short: 'SUP' },
    { id: 'club_world_cup', name: 'Copa Intercontinental de la FIFA', short: 'INTER' }
  ];

  function continentalComp(id) {
    return CONTINENTAL_COMPETITIONS.find(c => c.id === id) || CONTINENTAL_COMPETITIONS[0];
  }

  // Mini-tabla de la fase de grupos de la Champions (por grupo).
  function uclGroupsHtml(ucl) {
    const engine = window.PocketManager.continentalEngine;
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
    return (ucl.groups || []).map(g => {
      const rows = engine && engine.classifyGroup ? engine.classifyGroup(ucl, g.id) : [];
      const body = rows.map((r, i) => {
        const t = db.getTeamById(r.teamId);
        const dg = (r.gf || 0) - (r.gc || 0);
        return `
        <div class="st-row${i < 2 ? ' ascenso' : ''}" data-team-id="${r.teamId}">
          <span class="st-c-pos"><i>${i + 1}</i></span>
          <span class="st-c-team">${t ? badgeHtml(t, 'st-badge') : ''}<span class="st-team-name">${t ? t.name : '—'}</span></span>
          <span class="st-c-num st-pts">${r.pts}</span>
          <span class="st-c-num">${r.pj}</span>
          <span class="st-c-num">${r.g}</span>
          <span class="st-c-num">${r.e}</span>
          <span class="st-c-num">${r.p}</span>
          <span class="st-c-num">${r.gf}</span>
          <span class="st-c-num">${r.gc}</span>
          <span class="st-c-num st-c-dg">${dg > 0 ? '+' + dg : dg}</span>
        </div>`;
      }).join('');
      return `<h4 class="st-group-title">${g.name}</h4><div class="st-table">${head}${body}</div>`;
    }).join('');
  }

  // Cuadro de eliminatorias (knockout de la Champions o torneos especiales).
  function tieRoundsHtml(rounds, winnerTeamName) {
    const html = (rounds || []).map(r => {
      const lines = r.matches.map(m => {
        const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
        const played = m.played || m.winnerId;
        const center = played ? `${m.homeGoals} - ${m.awayGoals}` : 'vs';
        const pen = m.penalties ? `<span class="cup-note">pen ${m.penalties.home}-${m.penalties.away}</span>` : '';
        const leg = m.leg ? `<span class="cup-note">${m.leg === 1 ? 'ida' : 'vuelta'}</span>` : '';
        const side = (t, rev) => `
          <span class="cup-team${rev ? ' rev' : ''}${t ? '' : ' empty'}"${t ? ` data-team-id="${t.id}"` : ''}>
            ${t ? badgeHtml(t, 'cup-badge') : '<span class="cup-badge empty"></span>'}
            <span class="cup-name">${t ? t.name : '—'}</span>
          </span>`;
        return `<div class="cup-match">
          ${side(home)}
          <span class="cup-center"><span class="cup-score">${center}</span>${pen}${leg}</span>
          ${side(away, true)}
        </div>`;
      }).join('');
      return `<div class="cup-round"><div class="cup-round-title">${r.round}</div><div class="cup-round-matches">${lines}</div></div>`;
    }).join('');
    const win = winnerTeamName ? `<div class="cup-winner">🏆 Campeón: ${winnerTeamName}</div>` : '';
    return `${html}${win}`;
  }

  function continentalPanelHtml(comp) {
    const cont = window.PocketManager.continentalEngine;
    // Mientras las competiciones continentales no estén configuradas, panel "Próximamente".
    if (!cont || !cont.CONTINENTALS_ENABLED) {
      return '<div class="st-empty" style="padding:24px">🔜 <strong>Próximamente</strong> · Las competiciones continentales aún no están configuradas.</div>';
    }
    const ucl = gameState.seasons ? gameState.seasons['uefa_champions_league'] : null;
    if (comp.id === 'uefa_champions_league') {
      if (!ucl) return '<p class="st-empty">Sin datos de Champions.</p>';
      if (ucl.phase === 'knockout' && ucl.knockout) {
        return tieRoundsHtml(ucl.knockout.rounds, ucl.winner ? (db.getTeamById(ucl.winner) || {}).name : null);
      }
      return uclGroupsHtml(ucl);
    }
    if (comp.id === 'uefa_europa_league' || comp.id === 'uefa_conference_league') {
      return '<div class="st-empty" style="padding:24px">🔜 <strong>Próximamente</strong> · Disponible en la Fase 2 (junto a la UEFA Europa League).</div>';
    }
    if (comp.id === 'uefa_super_cup') {
      return '<div class="st-empty" style="padding:24px">⏳ <strong>A definir</strong> · La Supercopa de Europa se activará cuando exista la UEFA Europa League (Fase 2).</div>';
    }
    if (comp.id === 'club_world_cup') {
      const cwc = gameState.seasons ? gameState.seasons['club_world_cup'] : null;
      if (!cwc || !cwc.rounds) return '<p class="st-empty">Sin datos.</p>';
      return tieRoundsHtml(cwc.rounds, cwc.winner ? (db.getTeamById(cwc.winner) || {}).name : null);
    }
    return '<p class="st-empty">Sin datos.</p>';
  }

  // Render del modo "Continentales".
  function renderContinental() {
    const trigger = document.getElementById('st-countries-trigger');
    if (trigger) {
      trigger.innerHTML = `
        <span class="nat-flag">🌐</span>
        <span class="selected-nat">Continentales</span>
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`;
    }
    const comp = continentalComp(state.competitionId);
    state.competitionId = comp.id;

    const compsEl = document.getElementById('st-comps');
    if (compsEl) {
      compsEl.innerHTML = CONTINENTAL_COMPETITIONS.map(c => `
        <button class="st-comp${c.id === state.competitionId ? ' active' : ''}" data-comp="${c.id}">
          <span class="st-comp-logo">${c.short}</span>
          <span class="st-comp-name">${c.name}</span>
        </button>`).join('');
    }
    const groupsEl = document.getElementById('st-groups');
    if (groupsEl) groupsEl.style.display = 'none';
    const leadersEl = document.getElementById('st-leaders');
    if (leadersEl) leadersEl.innerHTML = '';
    ['st-top10-scorers', 'st-top10-assists'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const tableEl = document.getElementById('st-table');
    if (tableEl) tableEl.innerHTML = continentalPanelHtml(comp);
    const legendEl = document.getElementById('st-legend');
    if (legendEl) legendEl.innerHTML = '';
  }

  function displayRounds(cup) {
    const rounds = (cup && cup.rounds) || [];
    const out = [];

    // Todas las rondas construidas (fase clasificatoria + fase final).
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
        out.push({ label: 'Semifinal', rounds: legs, pending: false });
        i = j - 1;
        continue;
      }
      out.push({ label: roundLabel(r.round), rounds: [r], pending: false });
    }

    // Rondas del plan aún no construidas (pendientes).
    //  - Copas inglesas (EFL Cup / FA Cup): el cup guarda su plan en `_plan` y su progreso en
    //    `_planIdx` (índice de la última ronda del plan construida).
    //  - EFL Trophy: plan de eliminatorias `TROPHY_KNOCKOUT` y progreso en `_knockIdx`.
    //  - Copa del Rey: plan fijo `MAIN_PLAN` y las construidas desde `phase2Start`.
    let plan = null;
    let builtCount = 0;
    if (cup && Array.isArray(cup._plan)) {
      plan = cup._plan;
      builtCount = Math.max(0, (cup._planIdx || 0) + 1);
    } else if (cup && cup.mode === 'trophy') {
      plan = window.PocketManager.englandEngine && window.PocketManager.englandEngine.TROPHY_KNOCKOUT;
      builtCount = cup._knockIdx !== undefined ? Math.max(0, cup._knockIdx + 1) : 0;
    } else if (cup && cup.phase2Start !== undefined) {
      plan = window.PocketManager.cupEngine && window.PocketManager.cupEngine.MAIN_PLAN;
      builtCount = Math.max(0, rounds.length - cup.phase2Start);
    }
    if (plan) {
      for (let p = builtCount; p < plan.length; p++) {
        const name = plan[p].name;
        if (/^semifinal/i.test(name)) {
          if (p + 1 < plan.length && /^semifinal/i.test(plan[p + 1].name)) p++;
          if (out.length && out[out.length - 1].label === 'Semifinal') continue;
          out.push({ label: 'Semifinal', rounds: [], pending: true });
          continue;
        }
        out.push({ label: roundLabel(name), rounds: [], pending: true });
      }
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

  // Zonas de la EFL Championship (24 equipos): 1-2 ascenso directo, 3-8 playoffs de ascenso,
  // 9-21 permanencia, 22-24 descenso a League One.
  function championshipZoneOf(index, n) {
    if (!n || n <= 0) return 'permanencia';
    if (index < 2) return 'ascenso';
    if (index < 8) return 'playoffsAscenso';
    if (index >= n - 3) return 'descenso';
    return 'permanencia';
  }

  // Zona por competición: Hypermotion y Championship usan sus propias zonas; el resto el esquema europeo.
  function zoneOfComp(comp, index, n) {
    if (comp && String(comp.id || '').indexOf('hypermotion') !== -1) return hypermotionZoneOf(index, n);
    if (comp && String(comp.id || '').indexOf('championship') !== -1) return championshipZoneOf(index, n);
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
        <span class="st-leader-main" data-team-id="${t.id}">
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
        <div class="st-top-row" data-team-id="${t.id}">
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
    const shortNameOf = (id) => { const t = db.getTeamById(id); return t ? t.shortName : '—'; };
    const badge = (t, win) => t
      ? `<span class="cup-badge${win ? ' win' : ''}" style="background:linear-gradient(135deg, ${t.primaryColor}, ${t.secondaryColor || t.primaryColor})">${t.shortName}</span>`
      : '<span class="cup-badge empty"></span>';
    const name = (t, win) => `<span class="cup-name${win ? ' win' : ''}">${t ? t.name : '—'}</span>`;
    const matchLine = (m) => {
      const home = db.getTeamById(m.homeId), away = db.getTeamById(m.awayId);
      const homeW = !!(m.played && m.winnerId === m.homeId);
      const awayW = !!(m.played && m.winnerId === m.awayId);
      let center;
      if (!m.played) {
        center = '<span class="cup-vs">vs</span>';
      } else {
        const pen = m.penalties ? `<span class="cup-note">pen ${m.penalties.home}-${m.penalties.away}</span>` : '';
        const extra = m.etGoals ? '<span class="cup-note">prórr.</span>' : '';
        const leg = m.leg ? `<span class="cup-note">${m.leg === 1 ? 'ida' : 'vuelta'}</span>` : '';
        center = `<span class="cup-score">${m.homeGoals} - ${m.awayGoals}</span>${extra}${pen}${leg}`;
      }
      return `<div class="cup-match">
        <span class="cup-team${home ? '' : ' empty'}"${home ? ` data-team-id="${home.id}"` : ''}>${badge(home, homeW)}${name(home, homeW)}</span>
        <span class="cup-center">${center}</span>
        <span class="cup-team rev${away ? '' : ' empty'}"${away ? ` data-team-id="${away.id}"` : ''}>${name(away, awayW)}${badge(away, awayW)}</span>
      </div>`;
    };
    // Fase de grupos del EFL Trophy: cada grupo (Norte/Sur A-H) como mini-clasificación,
    // ordenada por puntos, con los 2 primeros (que avanzan) resaltados.
    const groupStageHtml = (cup) => {
      const groups = (cup && cup.groups) || [];
      if (!groups.length) return '<p class="st-empty">Sin grupos.</p>';
      const groupMatches = (cup.rounds || []).filter(r => r.groups).flatMap(r => r.matches || []);
      const renderGroup = (g) => {
        const rows = {};
        for (const id of g) rows[id] = { teamId: id, pj: 0, pts: 0, gf: 0, ga: 0 };
        for (const m of groupMatches) {
          if (g.indexOf(m.homeId) === -1 || g.indexOf(m.awayId) === -1) continue;
          const h = rows[m.homeId], a = rows[m.awayId];
          if (!h || !a) continue;
          const hg = m.homeGoals || 0, ag = m.awayGoals || 0;
          h.pj++; a.pj++;
          h.gf += hg; h.ga += ag; a.gf += ag; a.ga += hg;
          if (hg > ag) h.pts += 3;
          else if (hg < ag) a.pts += 3;
          else { h.pts++; a.pts++; }
        }
        const sorted = Object.values(rows)
          .sort((x, y) => (y.pts - x.pts) || ((y.gf - y.ga) - (x.gf - x.ga)) || (y.gf - x.gf) || String(x.teamId).localeCompare(String(y.teamId)));
        return `
        <div class="tg-group">
          <div class="tg-title">${g.name || g.id}</div>
          ${sorted.map((s, i) => {
            const t = db.getTeamById(s.teamId);
            return `<div class="tg-row${i < 2 ? ' top' : ''}">
              ${badge(t, false)}
              <span class="tg-name">${t ? t.name : '—'}</span>
              <span class="tg-num">${s.pj}</span>
              <span class="tg-num">${s.gf}</span>
              <span class="tg-num">${s.ga}</span>
              <span class="tg-pts">${s.pts}</span>
            </div>`;
          }).join('')}
        </div>`;
      };
      const section = (title, list) => list.length
        ? `<div class="tg-section"><div class="tg-section-title">${title}</div>${list.map(renderGroup).join('')}</div>`
        : '';
      const norte = groups.filter(g => /norte/i.test(g.name || ''));
      const sur = groups.filter(g => /sur/i.test(g.name || ''));
      return section('Norte', norte) + section('Sur', sur);
    };

    const display = displayRounds(cup);
    const list = (state.round !== null && display[state.round]) ? [display[state.round]] : display;
    const rounds = list.map(d => {
      if (!d.rounds.length) {
        return `
        <div class="cup-round pending">
          <div class="cup-round-title">${d.label}<span class="cup-pending-tag">Pendiente</span></div>
          <p class="cup-pending-note">Se definirá al completarse la ronda anterior.</p>
        </div>`;
      }
      const pending = !d.rounds.every(x => x.completed);
      const gr = d.rounds[0];
      if (gr && gr.groups) {
        return `
        <div class="cup-round">
          <div class="cup-round-title">${d.label}</div>
          ${groupStageHtml(cup)}
        </div>`;
      }
      return `
      <div class="cup-round">
        <div class="cup-round-title">${d.label}${pending ? ' · pendiente' : ''}</div>
        <div class="cup-round-matches">${d.rounds.map(r => r.matches.map(matchLine).join('')).join('')}</div>
      </div>`;
    }).join('');
    const winner = cup.winner ? `<div class="cup-winner">🏆 Campeón: ${shortNameOf(cup.winner)}</div>` : '';
    return rounds + winner;
  }

  function renderStandings() {
    if (state.continental) { renderContinental(); bind(); return; }
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
          `<button class="subtab${state.round === i ? ' active' : ''}${d.pending ? ' pending' : ''}" data-round="${i}">${d.label}</button>`
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
    const isCont = !!state.continental;
    // "Continentales" siempre primero y fijo (ajeno al orden alfabético y a la búsqueda).
    const contItem = `
      <button class="nat-option${isCont ? ' selected' : ''}" data-country="Continentales">
        <span class="nat-flag">🌐</span>
        <span class="nat-name">Continentales</span>
        ${isCont ? '<span class="nat-check">✓</span>' : ''}
      </button>`;
    const items = countries()
      .slice()
      .sort((a, b) => String(a.name).localeCompare(String(b.name)))
      .filter(c => !nq || normalize(c.name).includes(nq))
      .map(c => `
        <button class="nat-option${!isCont && c.name === state.country ? ' selected' : ''}" data-country="${c.name}">
          <span class="nat-flag">${flagForCountry(c.name)}</span>
          <span class="nat-name">${c.name}</span>
          ${!isCont && c.name === state.country ? '<span class="nat-check">✓</span>' : ''}
        </button>`)
      .join('');
    list.innerHTML = contItem + (items || '');
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
        // Clic en un equipo de la clasificación o de un cuadro de copa -> su plantilla (solo lectura).
        const teamEl = e.target.closest('[data-team-id]');
        if (!teamEl) return;
        if (window.PocketManager.openTeamView) window.PocketManager.openTeamView(teamEl.dataset.teamId);
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
      state.group = null;
      state.round = null;
      state.topOpen = null;
      if (opt.dataset.country === 'Continentales') {
        state.continental = true;
        state.competitionId = 'uefa_champions_league';
      } else {
        state.continental = false;
        state.country = opt.dataset.country;
        state.competitionId = null;
      }
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
      if (link) {
        state.topOpen = state.topOpen === link.dataset.top ? null : link.dataset.top;
        renderStandings();
        return;
      }
      const teamEl = e.target.closest('[data-team-id]');
      if (teamEl && window.PocketManager.openTeamView) window.PocketManager.openTeamView(teamEl.dataset.teamId);
    });
  }

  window.PocketManager.renderStandings = renderStandings;
})();
