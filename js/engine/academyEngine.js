(function () {
  // Academia (cantera): genera jugadores ficticios en la Semana 20 (Enero) de cada temporada.
  // El club del usuario recibe 4-6 canteranos que quedan pendientes de decisión en su bandeja
  // de Academia (promocionar a reservas o descartar). Los clubes de la CPU reciben 2-3
  // canteranos que se asignan automáticamente a sus reservas (solo de sesión).
  const db = window.PocketManager.db;
  const gameState = window.PocketManager.gameState;

  const SPANISH_FIRST = ['Álvaro', 'Adrián', 'Alejandro', 'Alberto', 'Antonio', 'Ángel', 'Borja', 'Carlos', 'Daniel', 'David', 'Diego', 'Fran', 'Francisco', 'Gabriel', 'Guillermo', 'Hugo', 'Iker', 'Ismael', 'Iván', 'Jaime', 'Javier', 'Jesús', 'Joaquín', 'Jorge', 'José', 'Juan', 'Julio', 'Kike', 'Luis', 'Manuel', 'Marcos', 'Mario', 'Mateo', 'Miguel', 'Nacho', 'Nico', 'Óscar', 'Pablo', 'Pedro', 'Raúl', 'Rubén', 'Samuel', 'Sergio', 'Víctor', 'Xavi', 'Yago', 'Aleix', 'Ferran', 'Izan', 'Asier', 'Unai', 'Aitor', 'Gorka', 'Iñigo', 'Jon', 'Mikel'];
  const SPANISH_LAST = ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez', 'Navarro', 'Torres', 'Domínguez', 'Vázquez', 'Ramos', 'Gil', 'Ramírez', 'Serrano', 'Blanco', 'Molina', 'Morales', 'Suárez', 'Ortega', 'Delgado', 'Castro', 'Ortiz', 'Rubio', 'Marín', 'Sanz', 'Iglesias', 'Medina', 'Garrido', 'Cortés', 'Castillo', 'Santos', 'Lozano', 'Guerrero', 'Cano', 'Prieto', 'Méndez', 'Calvo', 'Cruz', 'Vega', 'Fuentes', 'Campos', 'Herrera', 'Peña', 'Cabrera', 'Reyes', 'Aguilar', 'Vidal', 'Carrasco', 'Hidalgo', 'Camacho', 'Moya', 'Rojas', 'Santiago', 'Marcos', 'Márquez', 'Gallego', 'Roldán', 'Vera', 'Bravo', 'Roca', 'Palacios'];

  const POSITIONS = ['POR', 'DFC', 'DFC', 'LD', 'LI', 'MCD', 'MC', 'MCO', 'MI', 'MD', 'EI', 'ED', 'DC', 'DC'];
  const FOOT_POOL = ['D', 'D', 'D', 'D', 'Z', 'Z', 'A'];

  let youthSeq = 0;

  function randInt(a, b) {
    return a + Math.floor(Math.random() * (b - a + 1));
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // Valor de mercado consistente con el generador de plantillas (tools/gen_*).
  function ageMult(age) {
    if (age < 20) return 1.35;
    if (age <= 25) return 1.25;
    if (age <= 28) return 1.05;
    if (age <= 31) return 0.8;
    if (age <= 34) return 0.55;
    return 0.4;
  }

  function valueFor(ovr, age) {
    return Math.max(20000, Math.round((ovr - 50) * (ovr - 50) * 2600 * ageMult(age) / 1000) * 1000);
  }

  // Etiqueta de potencial estimado a partir del potencial oculto.
  function potentialLabel(potential) {
    if (potential >= 85) return 'Estrella Potencial';
    if (potential >= 80) return 'Gran Promesa';
    if (potential >= 74) return 'Promesa';
    if (potential >= 68) return 'Canterano útil';
    return 'Perfil bajo';
  }

  function potentialCls(potential) {
    if (potential >= 85) return 'acad-pot-star';
    if (potential >= 80) return 'acad-pot-great';
    if (potential >= 74) return 'acad-pot-good';
    if (potential >= 68) return 'acad-pot-mid';
    return 'acad-pot-low';
  }

  // Media general del club (para escalar la calidad de la cantera).
  function teamBase(team) {
    if (!team) return 75;
    const ovr = Number(team.ovr || 0);
    if (ovr) return ovr;
    if (window.PocketManager.getTeamRating) {
      try {
        const r = window.PocketManager.getTeamRating(team);
        if (r) return r;
      } catch (e) {}
    }
    return 75;
  }

  // Media actual de un canterano: muy por debajo de la media del club, y aún menor en
  // clubes más débiles.
  function youthCurrentBase(team) {
    return Math.max(40, Math.min(62, Math.round(teamBase(team) - 28)));
  }

  // Crea un canterano ficticio. `teamId` se usa para el id único; `team` escala la media.
  function createYouth(teamId, team) {
    youthSeq++;
    const first = pick(SPANISH_FIRST);
    const last = pick(SPANISH_LAST);
    const base = youthCurrentBase(team);
    const lo = Math.max(40, base);
    const hi = Math.min(70, base + 4);
    const potential = Math.max(58, Math.min(88, base + randInt(10, 26)));
    const age = randInt(16, 19);
    return {
      id: 'youth_' + teamId + '_' + gameState.currentSeason + '_' + youthSeq,
      name: first + ' ' + last,
      nick: last,
      number: null,
      flag: '🇪🇸',
      age,
      stamina: randInt(90, 100),
      pos: pick(POSITIONS),
      foot: pick(FOOT_POOL),
      loan: null,
      potential,
      ovrRange: [lo, hi],
      valueRange: [valueFor(lo, age), valueFor(hi, age)],
      ovr: null
    };
  }

  // Convierte un canterano en jugador real (OVR concreto dentro del rango estimado).
  function materializeYouth(youth) {
    const ovr = youth.ovr !== null && youth.ovr !== undefined
      ? youth.ovr
      : randInt(youth.ovrRange[0], youth.ovrRange[1]);
    return {
      id: youth.id,
      name: youth.name,
      nick: youth.nick,
      number: youth.number || null,
      flag: youth.flag,
      age: youth.age,
      stamina: youth.stamina,
      value: valueFor(ovr, youth.age),
      ovr,
      pos: youth.pos,
      foot: youth.foot,
      loan: null
    };
  }

  // Estado de la academia del usuario (solo lectura: no crea el estado).
  function academyList() {
    if (!gameState.academy || gameState.academy.season !== gameState.currentSeason) return [];
    if (!Array.isArray(gameState.academy.list)) return [];
    return gameState.academy.list;
  }

  // Crea (si hace falta) el estado de la academia de la temporada actual.
  function ensureAcademyState() {
    if (!gameState.academy || gameState.academy.season !== gameState.currentSeason) {
      gameState.academy = { season: gameState.currentSeason || 1, list: [] };
    }
    if (!Array.isArray(gameState.academy.list)) gameState.academy.list = [];
    return gameState.academy;
  }

  function academyCount() {
    return academyList().length;
  }

  // Genera los canteranos de un equipo de la CPU y los añade a sus reservas.
  function generateCpuYouth(team) {
    if (!team || !team.players) return 0;
    const squadEngine = window.PocketManager.squadEngine;
    if (!squadEngine || !squadEngine.insertPlayerByPosition) return 0;
    const n = randInt(2, 3);
    let done = 0;
    for (let i = 0; i < n; i++) {
      if (team.players.length >= 40) break;
      const youth = createYouth(team.id, team);
      const player = materializeYouth(youth);
      try { squadEngine.insertPlayerByPosition(team, player); } catch (e) { team.players.push(player); }
      done++;
    }
    if (squadEngine.assignAutomaticNumbers) {
      try { squadEngine.assignAutomaticNumbers(team); } catch (e) {}
    }
    return done;
  }

  // Semana actual del usuario (0 si no hay calendario).
  function currentWeek() {
    const team = gameState.team;
    const calendar = window.PocketManager.calendar;
    if (!team || !calendar || !calendar.currentUserWeek) return 0;
    try { return calendar.currentUserWeek(team.id); } catch (e) { return 0; }
  }

  // Disparo único por temporada: en la Semana 20 (Enero) se genera la cantera del usuario
  // y se auto-asignan los canteranos de la CPU.
  function maybeGenerateYouth() {
    if (!gameState.team) return false;
    if (gameState.academy && gameState.academy.season === gameState.currentSeason) return false; // ya generada
    if (currentWeek() < 20) return false;

    ensureAcademyState();

    // Usuario: 4-6 canteranos en la lista de Academia.
    const userCount = randInt(4, 6);
    for (let i = 0; i < userCount; i++) {
      academyList().push(createYouth(gameState.team.id, gameState.team));
    }

    // CPU: asignación automática a reservas (solo sesión).
    if (db.getAllTeams) {
      for (const team of db.getAllTeams()) {
        if (team.id === gameState.team.id) continue;
        try { generateCpuYouth(team); } catch (e) {}
      }
    }
    return true;
  }

  // Promociona a un canterano al grupo de Reservas del equipo del usuario.
  function promoteYouth(teamId, youthId) {
    const team = db.getTeamById(teamId);
    const list = academyList();
    const idx = list.findIndex(y => y.id === youthId);
    if (idx === -1) return { ok: false, reason: 'Canterano no encontrado' };
    if (!team) return { ok: false, reason: 'Club no disponible' };

    const youth = list[idx];
    const player = materializeYouth(youth);
    const squadEngine = window.PocketManager.squadEngine;

    try {
      if (squadEngine && squadEngine.insertPlayerByPosition) {
        squadEngine.insertPlayerByPosition(team, player);
      } else {
        team.players.push(player);
      }
      if (squadEngine && squadEngine.assignAutomaticNumbers) {
        squadEngine.assignAutomaticNumbers(team);
      }
      // Lo fuerza a aparecer en "Equipo Reservas".
      if (window.PocketManager.setPlayerSection) {
        window.PocketManager.setPlayerSection(team, player.id, 'reserves');
      } else if (window.PocketManager.refreshLineup) {
        window.PocketManager.refreshLineup(team);
      }
    } catch (e) {
      return { ok: false, reason: 'No se pudo promocionar al canterano' };
    }

    list.splice(idx, 1);
    return { ok: true, player };
  }

  // Descarta a un canterano de la lista de la Academia.
  function discardYouth(teamId, youthId) {
    const list = academyList();
    const idx = list.findIndex(y => y.id === youthId);
    if (idx === -1) return { ok: false, reason: 'Canterano no encontrado' };
    const youth = list[idx];
    list.splice(idx, 1);
    return { ok: true, name: youth.name };
  }

  window.PocketManager.academyEngine = {
    maybeGenerateYouth,
    academyList,
    academyCount,
    promoteYouth,
    discardYouth,
    potentialLabel,
    potentialCls
  };
})();
