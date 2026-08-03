(function () {
  const STYLE_STATS = {
    Ofensivo: { attack: 1.15, concede: 1.10 },
    Equilibrado: { attack: 1.00, concede: 1.00 },
    Defensivo: { attack: 0.85, concede: 0.90 }
  };
  const BASE_EVENT = 0.10;
  const BASE_GOAL = 0.35;
  const YELLOW_PROB = 0.045;
  const RED_PROB = 0.008;
  const ASSIST_PROB = 0.70;
  const INJURY_BASE = 0.0002;
  const INJURY_LOW_STAMINA = 0.004; // se multiplica por (70 - stamina) / 70 cuando stamina < 70

  function engine() {
    return window.PocketManager.staminaEngine || { isInjured: () => false, isUnavailable: () => false, randomizeInjury: (p) => (p.injury = { isInjured: true, weeksLeft: 2, type: 'Muscular' }) };
  }

  function styleStats(team) {
    const style = window.PocketManager.getTeamStyle ? window.PocketManager.getTeamStyle(team) : (team.style || 'Equilibrado');
    return STYLE_STATS[style] || STYLE_STATS.Equilibrado;
  }

  function groupOf(pos) {
    if (pos === 'POR') return 'POR';
    if (['DFC', 'LI', 'LD', 'CAI', 'CAD'].indexOf(pos) !== -1) return 'DEF';
    if (['MCD', 'MC', 'MCO', 'MI', 'MD'].indexOf(pos) !== -1) return 'MED';
    return 'DEL';
  }

  function startersOf(team) {
    if (!window.PocketManager.getSquadState) return [];
    const ids = window.PocketManager.getSquadState(team).startingIds || [];
    return ids.map(id => team.players.find(p => p.id === id)).filter(Boolean);
  }

  // Jugadores en el campo este minuto (excluye expulsados, lesionados y sancionados)
  function onPitch(team) {
    return startersOf(team).filter(p => !p._sentOff && !engine().isUnavailable(p));
  }

  function pickWeighted(list) {
    if (!list.length) return null;
    const total = list.reduce((a, p) => a + p.ovr, 0);
    if (total <= 0) return list[Math.floor(Math.random() * list.length)];
    let r = Math.random() * total;
    for (const p of list) {
      r -= p.ovr;
      if (r <= 0) return p;
    }
    return list[list.length - 1];
  }

  function pickScorer(starters) {
    const del = starters.filter(p => groupOf(p.pos) === 'DEL');
    const med = starters.filter(p => groupOf(p.pos) === 'MED');
    const pool = del.length ? del : (med.length ? med : starters.filter(p => p.pos !== 'POR'));
    return pickWeighted(pool);
  }

  function pickAssister(starters, scorer) {
    const med = starters.filter(p => groupOf(p.pos) === 'MED' && p.id !== scorer.id);
    const del = starters.filter(p => groupOf(p.pos) === 'DEL' && p.id !== scorer.id);
    const pool = med.length ? med : (del.length ? del : starters.filter(p => p.pos !== 'POR' && p.id !== scorer.id));
    if (!pool.length) return null;
    return Math.random() < ASSIST_PROB ? pickWeighted(pool) : null;
  }

  // Sustitución automática (modo SIMULAR) ante lesión: entra el mejor suplente sano
  function autoSub(team, injuredId) {
    const PM = window.PocketManager;
    if (!PM.getSquadState || !PM.doSwap) return;
    const squad = PM.getSquadState(team);
    const bench = squad.subIds.map(id => team.players.find(p => p.id === id)).filter(Boolean);
    const healthy = bench.filter(p => !engine().isUnavailable(p));
    const best = healthy.filter(p => p.pos !== 'POR').sort((a, b) => b.ovr - a.ovr)[0] || healthy[0];
    if (best) PM.doSwap(team, injuredId, best.id);
  }

  class MatchSim {
    constructor(homeTeam, awayTeam, onMinute) {
      this.homeTeam = homeTeam;
      this.awayTeam = awayTeam;
      this.onMinute = onMinute || function () {};
      this.homeGoals = 0;
      this.awayGoals = 0;
      this.minute = 0;
      this.paused = false;
      this.finished = false;
      this.interval = null;
      this.events = [];
      this.minutesPlayed = {};
      this.minutesPlayed[homeTeam.id] = {};
      this.minutesPlayed[awayTeam.id] = {};
      this.liveRatings = {};
      this.liveRatings[homeTeam.id] = {};
      this.liveRatings[awayTeam.id] = {};
      this.ratingEvents = {};
      this.ratingEvents[homeTeam.id] = {};
      this.ratingEvents[awayTeam.id] = {};
      this.goals = {};
      this.goals[homeTeam.id] = {};
      this.goals[awayTeam.id] = {};
      this.assists = {};
      this.assists[homeTeam.id] = {};
      this.assists[awayTeam.id] = {};
      this.yellows = {};
      this.yellows[homeTeam.id] = {};
      this.yellows[awayTeam.id] = {};
      this.reds = {};
      this.reds[homeTeam.id] = {};
      this.reds[awayTeam.id] = {};
      this.scorersList = {};
      this.scorersList[homeTeam.id] = [];
      this.scorersList[awayTeam.id] = [];
      for (const t of [homeTeam, awayTeam]) {
        for (const p of t.players) delete p._sentOff;
      }
      this._computeChances();
    }

    _ovr(list) {
      if (!list.length) return 0;
      return list.reduce((a, p) => a + p.ovr, 0) / list.length;
    }

    _computeChances() {
      const homeOv = this._ovr(startersOf(this.homeTeam));
      const awayOv = this._ovr(startersOf(this.awayTeam));
      const hs = styleStats(this.homeTeam);
      const as = styleStats(this.awayTeam);
      const homePower = homeOv * hs.attack * 1.05; // +5% factor campo para el local
      const awayPower = awayOv * as.attack;
      const total = homePower + awayPower;
      this.homeChance = total ? (homePower / total) * 100 : 50;
      this.eventRate = BASE_EVENT * ((hs.attack + as.attack) / 2);
    }

    _teamBias(team) {
      const gf = team === this.homeTeam ? this.homeGoals : this.awayGoals;
      const ga = team === this.homeTeam ? this.awayGoals : this.homeGoals;
      const lead = Math.max(-2, Math.min(2, gf - ga));
      return lead * 0.4;
    }

    _posPhase(team, player) {
      const gf = team === this.homeTeam ? this.homeGoals : this.awayGoals;
      const ga = team === this.homeTeam ? this.awayGoals : this.homeGoals;
      const clean = ga === 0;
      const g = groupOf(player.pos);
      if (g === 'POR') return clean ? 0.5 : Math.max(-0.6, -0.15 * ga);
      if (g === 'DEF') return clean ? 0.4 : Math.max(-0.5, -0.12 * ga);
      if (g === 'MED') return Math.min(0.6, 0.15 * gf);
      return Math.min(0.8, 0.25 * gf); // DEL
    }

    _addEvent(teamId, playerId, delta) {
      this.ratingEvents[teamId][playerId] = (this.ratingEvents[teamId][playerId] || 0) + delta;
    }

    _rating(team, playerId) {
      const p = team.players.find(x => x.id === playerId);
      if (!p) return 6.0;
      return Math.max(0, Math.min(10,
        6.0 + this._teamBias(team) + this._posPhase(team, p) + (this.ratingEvents[team.id][playerId] || 0)));
    }

    _track(ev) {
      this.events.push(ev);
      const side = ev.team === 'home' ? this.homeTeam : this.awayTeam;
      if (ev.player) {
        if (ev.type === 'goal') {
          this._addEvent(side.id, ev.player.id, 1.0);
          this.goals[side.id][ev.player.id] = (this.goals[side.id][ev.player.id] || 0) + 1;
          for (const p of onPitch(side)) {
            if (p.id !== ev.player.id) this._addEvent(side.id, p.id, 0.1);
          }
        } else if (ev.type === 'assist') {
          this._addEvent(side.id, ev.player.id, 0.5);
          this.assists[side.id][ev.player.id] = (this.assists[side.id][ev.player.id] || 0) + 1;
        } else if (ev.type === 'yellow') {
          this._addEvent(side.id, ev.player.id, -0.4);
          this.yellows[side.id][ev.player.id] = (this.yellows[side.id][ev.player.id] || 0) + 1;
        } else if (ev.type === 'red') {
          this._addEvent(side.id, ev.player.id, -1.5);
          this.reds[side.id][ev.player.id] = (this.reds[side.id][ev.player.id] || 0) + 1;
        } else if (ev.type === 'injury') {
          this._addEvent(side.id, ev.player.id, -0.5);
        }
      }
      if (ev.player && window.PocketManager.getPlayerStats) {
        const s = window.PocketManager.getPlayerStats(ev.player);
        if (!s) return;
        if (ev.type === 'goal') s.goals++;
        if (ev.type === 'assist') s.assists++;
        if (ev.type === 'yellow') s.yellows++;
        if (ev.type === 'red') s.reds++;
      }
    }

    stepMinute() {
      this.minute++;
      const homeStarters = onPitch(this.homeTeam);
      const awayStarters = onPitch(this.awayTeam);
      const minuteEvents = [];

      // Minutos jugados
      const countMinutes = (teamId, list) => {
        const m = this.minutesPlayed[teamId];
        for (const p of list) m[p.id] = (m[p.id] || 0) + 1;
      };
      countMinutes(this.homeTeam.id, homeStarters);
      countMinutes(this.awayTeam.id, awayStarters);

      // Recalcular valoración en vivo según el resultado actual y los eventos
      const refreshRatings = (teamId, list, team) => {
        for (const p of list) this.liveRatings[teamId][p.id] = this._rating(team, p.id);
      };
      refreshRatings(this.homeTeam.id, homeStarters, this.homeTeam);
      refreshRatings(this.awayTeam.id, awayStarters, this.awayTeam);

      const track = (ev) => {
        this._track(ev);
        if (ev.text) minuteEvents.push(ev);
      };

      // Ocasión / gol
      if (Math.random() < this.eventRate) {
        const isHome = Math.random() * 100 < this.homeChance;
        const attacker = isHome ? this.homeTeam : this.awayTeam;
        const defender = isHome ? this.awayTeam : this.homeTeam;
        const starters = isHome ? homeStarters : awayStarters;
        const conversion = BASE_GOAL * styleStats(attacker).attack * styleStats(defender).concede;

        if (Math.random() < conversion) {
          const scorer = pickScorer(starters);
          if (scorer) {
            if (isHome) this.homeGoals++; else this.awayGoals++;
            const assist = pickAssister(starters, scorer);
            if (assist) track({ minute: this.minute, type: 'assist', team: isHome ? 'home' : 'away', player: assist, text: null });
            const assistText = assist ? ` (Asistencia: ${assist.name})` : '';
            track({ minute: this.minute, type: 'goal', team: isHome ? 'home' : 'away', player: scorer, text: `⚽ Gol de ${scorer.name}${assistText}` });
            this.scorersList[attacker.id].push({ player: scorer, assist: assist || null });
          }
        } else {
          const attPool = starters.filter(p => p.pos !== 'POR' && (groupOf(p.pos) === 'DEL' || groupOf(p.pos) === 'MED'));
          const shooter = pickWeighted(attPool);
          if (shooter) this._addEvent(attacker.id, shooter.id, 0.15);
        }
      }

      // Tarjeta amarilla
      if (Math.random() < YELLOW_PROB) {
        const isHome = Math.random() * 100 < this.homeChance;
        const starters = isHome ? homeStarters : awayStarters;
        const p = pickWeighted(starters.filter(x => x.pos !== 'POR'));
        if (p) track({ minute: this.minute, type: 'yellow', team: isHome ? 'home' : 'away', player: p, text: `🟨 Amarilla para ${p.name}.` });
      }

      // Expulsión
      if (Math.random() < RED_PROB) {
        const isHome = Math.random() * 100 < this.homeChance;
        const starters = isHome ? homeStarters : awayStarters;
        const p = pickWeighted(starters.filter(x => x.pos !== 'POR'));
        if (p) {
          p._sentOff = true;
          track({ minute: this.minute, type: 'red', team: isHome ? 'home' : 'away', player: p, text: `🟥 ¡Expulsado ${p.name}!` });
        }
      }

      // Lesión: riesgo incrementado si stamina < 70
      for (const side of [['home', this.homeTeam, homeStarters], ['away', this.awayTeam, awayStarters]]) {
        const starters = side[2];
        for (const p of starters) {
          if (p.pos === 'POR') continue;
          const st = p.stamina;
          let prob = INJURY_BASE;
          if (st < 70) prob += INJURY_LOW_STAMINA * ((70 - st) / 70);
          if (Math.random() < prob) {
            const injury = engine().randomizeInjury(p);
            track({ minute: this.minute, type: 'injury', team: side[0], player: p, text: `🩹 ¡Lesión de ${p.name}! (${injury.type}, ${injury.weeksLeft} sem)` });
            break;
          }
        }
      }

      return minuteEvents;
    }

    _recordRatings() {
      const recordTeam = (team) => {
        const starters = startersOf(team);
        for (const p of starters) {
          const s = window.PocketManager.getPlayerStats ? window.PocketManager.getPlayerStats(p) : null;
          if (!s) continue;
          s.apps++;
          s.ratingSum += this._rating(team, p.id);
        }
      };
      recordTeam(this.homeTeam);
      recordTeam(this.awayTeam);
    }

    finish() {
      if (this.finished) return;
      this.finished = true;
      this.stop();
      const refresh = (teamId, list, team) => {
        for (const p of list) this.liveRatings[teamId][p.id] = this._rating(team, p.id);
      };
      refresh(this.homeTeam.id, onPitch(this.homeTeam), this.homeTeam);
      refresh(this.awayTeam.id, onPitch(this.awayTeam), this.awayTeam);
      this._recordRatings();
      this.onMinute({
        minute: 90,
        homeGoals: this.homeGoals,
        awayGoals: this.awayGoals,
        events: [],
        liveRatings: this.liveRatings,
        goals: this.goals,
        assists: this.assists,
        yellows: this.yellows,
        reds: this.reds,
        scorersList: this.scorersList,
        isFinished: true
      });
    }

    start() {
      this.interval = setInterval(() => {
        if (this.paused || this.finished) return;
        const events = this.stepMinute();
        this.onMinute({
          minute: this.minute,
          homeGoals: this.homeGoals,
          awayGoals: this.awayGoals,
          events,
          liveRatings: this.liveRatings,
          goals: this.goals,
          assists: this.assists,
          yellows: this.yellows,
          reds: this.reds,
          scorersList: this.scorersList,
          isFinished: false
        });
        if (this.minute >= 90) this.finish();
      }, 120);
    }

    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }

    togglePause() {
      this.paused = !this.paused;
      return this.paused;
    }
  }

  // Simulación instantánea (opción SIMULAR): ejecuta los 90 minutos al momento.
  function simulateInstant(homeTeam, awayTeam) {
    const sim = new MatchSim(homeTeam, awayTeam, function () {});
    while (sim.minute < 90) {
      const minuteEvents = sim.stepMinute();
      for (const ev of minuteEvents) {
        // En SIMULAR: lesión -> sustitución automática; expulsión -> se juega con uno menos
        if (ev.type === 'injury') {
          autoSub(ev.team === 'home' ? homeTeam : awayTeam, ev.player.id);
        }
      }
    }
    sim._recordRatings();
    const scorers = {};
    for (const ev of sim.events) {
      if (ev.type === 'goal') {
        const key = ev.team + '|' + (ev.player ? ev.player.id : '');
        scorers[key] = (scorers[key] || 0) + 1;
      }
    }
    return {
      homeGoals: sim.homeGoals,
      awayGoals: sim.awayGoals,
      events: sim.events,
      scorers,
      homeTeam,
      awayTeam,
      minutesPlayed: sim.minutesPlayed
    };
  }

  window.PocketManager.MatchSim = MatchSim;
  window.PocketManager.simulateInstant = simulateInstant;
})();
