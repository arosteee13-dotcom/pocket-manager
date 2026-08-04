window.PocketManager = window.PocketManager || {};
window.PocketManager.spainData = {
  country: "España",
  leagueName: "LaLiga EA Sports",
  maxSubs: 12,
  teams: [
    {
      id: "esp_madrid",
      name: "Real Madrid",
      shortName: "RMA",
      logo: "assets/logos/spain/madrid.png",
      primaryColor: "#ECBC30",
      secondaryColor: "#004966",
      budget: 120000000,
      ovr: 86,
      formation: "4-3-3",
      style: "Equilibrado",
      stadium: "Estadio Santiago Bernabéu",
      stadiumCapacity: 81044,
      trophies: [
        { name: "Mundial de Clubes", count: 5 },
        { name: "Champions League", count: 15 },
        { name: "Europa League", count: 2 },
        { name: "Supercopa de Europa", count: 6 },
        { name: "Copa Intercontinental de la FIFA", count: 1 },        
        { name: "Primera División", count: 36 },
        { name: "Copa del Rey", count: 20 },
        { name: "Supercopa de España", count: 13 }
      ],
      players: [
        // Porteros        
        { id: "es101", name: "Thibaut Courtois", nick: "Courtois", number: 1, flag: "🇧🇪", age: 34, stamina: 85, value: 11020000, ovr: 82, pos: "POR", foot: "Z", loan: null },
        { id: "es112", name: "Andriy Lunin", nick: "Lunin", number: 13, flag: "🇺🇦", age: 27, stamina: 92, value: 9360000, ovr: 59, pos: "POR", foot: "D", loan: null },
         // Defensas
        { id: "es116", name: "Denzel Dumfries", nick: "Dumfries", number: "", flag: "🇳🇱", age: 30, stamina: 89, value: 46110000, ovr: 85, pos: "LD", foot: "D", loan: null },
        { id: "es117", name: "Dean Huijsen", nick: "Huijsen", number: 24, flag: "🇪🇸", age: 21, stamina: 98, value: 67000000, ovr: 79, pos: "DFC", foot: "A", loan: null },
        { id: "es104", name: "Antonio Rüdiger", nick: "Rüdiger", number: 22, flag: "🇩🇪", age: 33, stamina: 86, value: 11140000, ovr: 85, pos: "DFC", foot: "D", loan: null },
        { id: "es118", name: "Trent Alexander-Arnold", nick: "Alexander-Arnold", number: 12, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 27, stamina: 92, value: 50790000, ovr: 81, pos: "LD", foot: "D", loan: null },
        { id: "es119", name: "Ibrahima Konaté", nick: "Konaté", number: "", flag: "🇫🇷", age: 27, stamina: 92, value: 45890000, ovr: 81, pos: "DFC", foot: "D", loan: null },
        { id: "es120", name: "Marc Cucurella", nick: "Cucurella", number: "", flag: "🇪🇸", age: 28, stamina: 91, value: 61270000, ovr: 85, pos: "LI", foot: "Z", loan: null },
        { id: "es121", name: "Álex Carreras", nick: "Carreras", number: "", flag: "🇪🇸", age: 23, stamina: 96, value: 42310000, ovr: 77, pos: "LI", foot: "Z", loan: null },
        { id: "es103", name: "Éder Militão", nick: "Militão", number: 3, flag: "🇧🇷", age: 28, stamina: 91, value: 21510000, ovr: 79, pos: "DFC", foot: "D", loan: null },
        { id: "es122", name: "Raúl Asencio", nick: "Asencio", number: 17, flag: "🇪🇸", age: 23, stamina: 96, value: 21880000, ovr: 70, pos: "DFC", foot: "D", loan: null },
        { id: "es123", name: "Ferland Mendy", nick: "Mendy", number: 23, flag: "🇫🇷", age: 31, stamina: 88, value: 5810000, ovr: 68, pos: "LI", foot: "Z", loan: null },
         // Centrocampistas
        { id: "es124", name: "Bernardo Silva", nick: "Bernardo", number: "", flag: "🇵🇹", age: 31, stamina: 88, value: 30090000, ovr: 81, pos: "MCO", foot: "Z", loan: null },
        { id: "es107", name: "Federico Valverde", nick: "Valverde", number: 8, flag: "🇺🇾", age: 28, stamina: 91, value: 102930000, ovr: 84, pos: "MC", foot: "D", loan: null },
        { id: "es108", name: "Jude Bellingham", nick: "Bellingham", number: 5, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 23, stamina: 96, value: 146470000, ovr: 83, pos: "MCO", foot: "D", loan: null },
        { id: "es106", name: "Aurelien Tchouaméni", nick: "Tchouaméni", number: 14, flag: "🇫🇷", age: 26, stamina: 93, value: 88010000, ovr: 81, pos: "MCD", foot: "D", loan: null },
        { id: "es125", name: "Arda Güler", nick: "Güler", number: 15, flag: "🇹🇷", age: 21, stamina: 98, value: 80710000, ovr: 75, pos: "MCO", foot: "Z", loan: null },
        { id: "es114", name: "Eduardo Camavinga", nick: "Camavinga", number: 6, flag: "🇫🇷", age: 23, stamina: 96, value: 52360000, ovr: 73, pos: "MC", foot: "Z", loan: null },
        { id: "es126", name: "Thiago Pitarch", nick: "Pitarch", number: 45, flag: "🇪🇸", age: 18, stamina: 99, value: 2050000, ovr: 51, pos: "MC", foot: "D", loan: null },
        { id: "es111", name: "Kylian Mbappé", nick: "Mbappé", number: 10, flag: "🇫🇷", age: 27, stamina: 92, value: 207470000, ovr: 89, pos: "DC", foot: "D", loan: null },
        // Delanteros        
        { id: "es110", name: "Vinícius Júnior", nick: "Vinícius", number: 7, flag: "🇧🇷", age: 26, stamina: 93, value: 150960000, ovr: 85, pos: "EI", foot: "D", loan: null },
        { id: "es109", name: "Rodrygo Goes", nick: "Rodrygo", number: 11, flag: "🇧🇷", age: 25, stamina: 94, value: 59620000, ovr: 77, pos: "ED", foot: "D", loan: null },
        { id: "es127", name: "Endrick Moreira", nick: "Endrick", number: "", flag: "🇧🇷", age: 20, stamina: 99, value: 39270000, ovr: 66, pos: "DC", foot: "Z", loan: null },
        { id: "es128", name: "Franco Mastantuono", nick: "Mastantuono", number: 30, flag: "🇦🇷", age: 18, stamina: 99, value: 44910000, ovr: 66, pos: "ED", foot: "Z", loan: null },
        { id: "es115", name: "Brahim Díaz", nick: "Brahim", number: 21, flag: "🇲🇦", age: 26, stamina: 93, value: 36680000, ovr: 72, pos: "ED", foot: "Z", loan: null },
        { id: "es129", name: "Gonzalo García", nick: "Gonzalo", number: 16, flag: "🇪🇸", age: 22, stamina: 97, value: 26690000, ovr: 69, pos: "DC", foot: "A", loan: null },
        { id: "es130", name: "Carlos Espí", nick: "Espí", number: "", flag: "🇪🇸", age: 21, stamina: 98, value: 16400000, ovr: 55, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_barcelona",
      name: "FC Barcelona",
      shortName: "BAR",
      logo: "assets/logos/spain/barcelona.png",
      primaryColor: "#AA1451",
      secondaryColor: "#0B469A",
      budget: 40000000,
      ovr: 85,
      formation: "4-2-3-1",
      style: "Ofensivo",
      stadium: "Spotify Camp Nou",
      stadiumCapacity: 99354,
      trophies: [
        { name: "Mundial de Clubes", count: 3 },
        { name: "Champions League", count: 5 },
        { name: "Primera División", count: 29 },
        { name: "Supercopa de Europa", count: 5 },
        { name: "Copa del Rey", count: 32 },
        { name: "Supercopa de España", count: 16 }
      ],
      players: [
        // Porteros        
        { id: "es201", name: "Marc-André ter Stegen", nick: "ter Stegen", number: 1, flag: "🇩🇪", age: 34, stamina: 85, value: 5110000, ovr: 78, pos: "POR", foot: "D", loan: null },
        { id: "es202", name: "Joan García", nick: "Joan García", number: 13, flag: "🇪🇸", age: 25, stamina: 94, value: 25620000, ovr: 72, pos: "POR", foot: "D", loan: null },
        { id: "es215", name: "Wojciech Szczęsny", nick: "Szczęsny", number: 25, flag: "🇵🇱", age: 36, stamina: 83, value: 1060000, ovr: 73, pos: "POR", foot: "D", loan: null },
        { id: "es213", name: "Áron Yaakobishvili", nick: "Yaakobishvili", number: "", flag: "🇭🇺", age: 20, stamina: 99, value: 1500000, ovr: 58, pos: "POR", foot: "A", loan: null },
        // Defensas
        { id: "es203", name: "Jules Koundé", nick: "Koundé", number: 23, flag: "🇫🇷", age: 27, stamina: 92, value: 74410000, ovr: 83, pos: "LD", foot: "D", loan: null },
        { id: "es206", name: "Alejandro Balde", nick: "Balde", number: 3, flag: "🇪🇸", age: 22, stamina: 97, value: 46880000, ovr: 76, pos: "LI", foot: "Z", loan: null },
        { id: "es205", name: "Pau Cubarsí", nick: "Cubarsí", number: 5, flag: "🇪🇸", age: 19, stamina: 99, value: 66800000, ovr: 75, pos: "DFC", foot: "D", loan: null },
        { id: "es217", name: "Andreas Christensen", nick: "Christensen", number: 15, flag: "🇩🇰", age: 30, stamina: 89, value: 14290000, ovr: 73, pos: "DFC", foot: "D", loan: null },
        { id: "es218", name: "Eric García", nick: "Eric García", number: 24, flag: "🇪🇸", age: 25, stamina: 94, value: 31220000, ovr: 74, pos: "DFC", foot: "D", loan: null },
        { id: "es204", name: "Ronald Araújo", nick: "Araújo", number: 4, flag: "🇺🇾", age: 27, stamina: 92, value: 20910000, ovr: 72, pos: "DFC", foot: "D", loan: null },
        { id: "es219", name: "Gerard Martín", nick: "Gerard Martín", number: 18, flag: "🇪🇸", age: 24, stamina: 95, value: 22830000, ovr: 67, pos: "DFC", foot: "Z", loan: null },
        { id: "es220", name: "Héctor Fort", nick: "Fort", number: "", flag: "🇪🇸", age: 20, stamina: 99, value: 8990000, ovr: 56, pos: "LD", foot: "D", loan: null },
        { id: "es221", name: "Álvaro Cortés", nick: "Cortés", number: 36, flag: "🇪🇸", age: 21, stamina: 98, value: 1410000, ovr: 55, pos: "DFC", foot: "D", loan: null },
        { id: "es222", name: "Xavi Espart", nick: "Espart", number: 42, flag: "🇪🇸", age: 19, stamina: 99, value: 3250000, ovr: 54, pos: "LD", foot: "D", loan: null },
        { id: "es223", name: "Jofre Torrents", nick: "Torrents", number: 26, flag: "🇪🇸", age: 19, stamina: 99, value: 540000, ovr: 47, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es209", name: "Pedri González", nick: "Pedri", number: 8, flag: "🇪🇸", age: 23, stamina: 96, value: 138970000, ovr: 80, pos: "MC", foot: "D", loan: null },
        { id: "es207", name: "Frenkie de Jong", nick: "de Jong", number: 21, flag: "🇳🇱", age: 29, stamina: 90, value: 42250000, ovr: 75, pos: "MC", foot: "D", loan: null },
        { id: "es224", name: "Dani Olmo", nick: "Olmo", number: 20, flag: "🇪🇸", age: 28, stamina: 91, value: 56720000, ovr: 75, pos: "MCO", foot: "D", loan: null },
        { id: "es214", name: "Fermín López", nick: "Fermín", number: 16, flag: "🇪🇸", age: 23, stamina: 96, value: 78050000, ovr: 73, pos: "MCO", foot: "D", loan: null },
        { id: "es208", name: "Pablo Gavi", nick: "Gavi", number: 6, flag: "🇪🇸", age: 21, stamina: 98, value: 42690000, ovr: 68, pos: "MC", foot: "D", loan: null },
        { id: "es225", name: "Marc Casadó", nick: "Casadó", number: 17, flag: "🇪🇸", age: 22, stamina: 97, value: 19190000, ovr: 67, pos: "MCD", foot: "D", loan: null },
        { id: "es226", name: "Marc Bernal", nick: "Bernal", number: 22, flag: "🇪🇸", age: 19, stamina: 99, value: 22560000, ovr: 54, pos: "MCD", foot: "Z", loan: null },
        { id: "es227", name: "Toni Fernández", nick: "Toni Fernández", number: 29, flag: "🇪🇸", age: 18, stamina: 99, value: 2790000, ovr: 57, pos: "MCO", foot: "Z", loan: null },
        { id: "es228", name: "Tommy Marqués", nick: "Marqués", number: 43, flag: "🇪🇸", age: 19, stamina: 99, value: 2120000, ovr: 44, pos: "MCD", foot: "D", loan: null },
        // Delanteros
        { id: "es210", name: "Lamine Yamal", nick: "Lamine Yamal", number: 10, flag: "🇪🇸", age: 19, stamina: 99, value: 213680000, ovr: 86, pos: "ED", foot: "Z", loan: null },
        { id: "es212", name: "Raphinha", nick: "Raphinha", number: 11, flag: "🇧🇷", age: 29, stamina: 90, value: 81420000, ovr: 84, pos: "EI", foot: "Z", loan: null },
        { id: "es229", name: "Anthony Gordon", nick: "Gordon", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 25, stamina: 94, value: 70580000, ovr: 81, pos: "EI", foot: "D", loan: null },
        { id: "es216", name: "Ferran Torres", nick: "Ferran Torres", number: 7, flag: "🇪🇸", age: 26, stamina: 93, value: 54530000, ovr: 76, pos: "DC", foot: "D", loan: null },
        { id: "es230", name: "Karim Adeyemi", nick: "Adeyemi", number: "", flag: "🇩🇪", age: 24, stamina: 95, value: 43200000, ovr: 78, pos: "ED", foot: "Z", loan: null },
        { id: "es231", name: "Roony Bardghji", nick: "Bardghji", number: 19, flag: "🇸🇪", age: 20, stamina: 99, value: 16910000, ovr: 57, pos: "ED", foot: "Z", loan: null },
        { id: "es232", name: "J. Bisiwu", nick: "Bisiwu", number: "", flag: "🇧🇪", age: 18, stamina: 99, value: 789000, ovr: 51, pos: "EI", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_atletico",
      name: "Atlético de Madrid",
      shortName: "ATM",
      logo: "assets/logos/spain/atletico.png",
      primaryColor: "#E91220",
      secondaryColor: "#FFFCFD",
      budget: 65000000,
      ovr: 83,
      formation: "5-3-2",
      style: "Defensivo",
      stadium: "Riyadh Air Metropolitano",
      stadiumCapacity: 70460,
      trophies: [
        { name: "Europa League", count: 3 },
        { name: "Supercopa de Europa", count: 3 },
        { name: "Primera División", count: 11 },
        { name: "Segunda División", count: 1 },
        { name: "Copa del Rey", count: 10 },
        { name: "Supercopa de España", count: 2 }
      ],
      players: [
        // Porteros
        { id: "es301", name: "Jan Oblak", nick: "Oblak", number: 13, flag: "🇸🇮", age: 33, stamina: 86, value: 20450000, ovr: 85, pos: "POR", foot: "D", loan: null },
        { id: "es312", name: "Juan Musso", nick: "Musso", number: 1, flag: "🇦🇷", age: 32, stamina: 87, value: 3060000, ovr: 65, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es316", name: "Dávid Hancko", nick: "Hancko", number: 17, flag: "🇸🇰", age: 28, stamina: 91, value: 55670000, ovr: 86, pos: "DFC", foot: "Z", loan: null },
        { id: "es317", name: "Alejandro Grimaldo", nick: "Grimaldo", number: "", flag: "🇪🇸", age: 30, stamina: 89, value: 29680000, ovr: 86, pos: "LI", foot: "Z", loan: null },
        { id: "es308", name: "Marcos Llorente", nick: "Llorente", number: 14, flag: "🇪🇸", age: 31, stamina: 88, value: 23760000, ovr: 84, pos: "LD", foot: "D", loan: null },
        { id: "es304", name: "Robin Le Normand", nick: "Le Normand", number: 24, flag: "🇪🇸", age: 29, stamina: 90, value: 38400000, ovr: 80, pos: "DFC", foot: "D", loan: null },
        { id: "es303", name: "José María Giménez", nick: "Giménez", number: 2, flag: "🇺🇾", age: 31, stamina: 88, value: 18160000, ovr: 77, pos: "DFC", foot: "D", loan: null },
        { id: "es302", name: "Nahuel Molina", nick: "Molina", number: 16, flag: "🇦🇷", age: 28, stamina: 91, value: 24730000, ovr: 76, pos: "LD", foot: "D", loan: null },
        { id: "es318", name: "Marc Pubill", nick: "Pubill", number: 18, flag: "🇪🇸", age: 23, stamina: 96, value: 27010000, ovr: 73, pos: "LD", foot: "D", loan: null },
        { id: "es319", name: "Matteo Ruggeri", nick: "Ruggeri", number: 3, flag: "🇮🇹", age: 24, stamina: 95, value: 27680000, ovr: 75, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es314", name: "Pablo Barrios", nick: "Barrios", number: 8, flag: "🇪🇸", age: 23, stamina: 96, value: 52230000, ovr: 82, pos: "MC", foot: "D", loan: null },
        { id: "es320", name: "Morten Hjulmand", nick: "Hjulmand", number: "", flag: "🇩🇰", age: 27, stamina: 92, value: 54410000, ovr: 80, pos: "MCD", foot: "D", loan: null },
        { id: "es306", name: "Koke Resurrección", nick: "Koke", number: 6, flag: "🇪🇸", age: 34, stamina: 85, value: 7580000, ovr: 80, pos: "MC", foot: "D", loan: null },
        { id: "es321", name: "Johnny Cardoso", nick: "Cardoso", number: 5, flag: "🇺🇸", age: 24, stamina: 95, value: 27140000, ovr: 76, pos: "MC", foot: "D", loan: null },
        { id: "es322", name: "Obed Vargas", nick: "Vargas", number: 21, flag: "🇲🇽", age: 20, stamina: 99, value: 25780000, ovr: 74, pos: "MC", foot: "D", loan: null },
        { id: "es323", name: "Kang-In Lee", nick: "Kang-In", number: "", flag: "🇰🇷", age: 25, stamina: 94, value: 30560000, ovr: 71, pos: "MCO", foot: "Z", loan: null },
        { id: "es324", name: "Rodrigo Mendoza", nick: "Mendoza", number: 4, flag: "🇪🇸", age: 21, stamina: 98, value: 18380000, ovr: 64, pos: "MC", foot: "D", loan: null },
        { id: "es325", name: "Thomas Lemar", nick: "Lemar", number: "", flag: "🇫🇷", age: 30, stamina: 89, value: 3450000, ovr: 59, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es310", name: "Julián Álvarez", nick: "Julián Álvarez", number: 19, flag: "🇦🇷", age: 26, stamina: 93, value: 120200000, ovr: 86, pos: "DC", foot: "D", loan: null },
        { id: "es311", name: "Alexander Sørloth", nick: "Sørloth", number: 9, flag: "🇳🇴", age: 30, stamina: 89, value: 43930000, ovr: 82, pos: "DC", foot: "Z", loan: null },
        { id: "es326", name: "Thiago Almada", nick: "Almada", number: 11, flag: "🇦🇷", age: 25, stamina: 94, value: 43380000, ovr: 75, pos: "EI", foot: "D", loan: null },
        { id: "es327", name: "Ademola Lookman", nick: "Lookman", number: 22, flag: "🇳🇬", age: 28, stamina: 91, value: 48040000, ovr: 81, pos: "EI", foot: "D", loan: null },
        { id: "es328", name: "Giuliano Simeone", nick: "Giuliano", number: 20, flag: "🇦🇷", age: 23, stamina: 96, value: 52290000, ovr: 80, pos: "ED", foot: "D", loan: null },
        { id: "es329", name: "Álex Baena", nick: "Baena", number: 10, flag: "🇪🇸", age: 25, stamina: 94, value: 46570000, ovr: 77, pos: "EI", foot: "D", loan: null },
        { id: "es330", name: "Carlos Martín", nick: "Martín", number: "", flag: "🇪🇸", age: 24, stamina: 95, value: 5860000, ovr: 63, pos: "EI", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es331", name: "Clément Lenglet", nick: "Lenglet", number: "", flag: "🇫🇷", age: 31, stamina: 88, value: 7100000, ovr: 76, pos: "DFC", foot: "Z", loan: { isLoaned: true, parentTeam: "esp_atletico", currentTeam: "Benfica" } },
        { id: "es332", name: "H. Moldovan", nick: "Moldovan", number: "", flag: "🇷🇴", age: 28, stamina: 91, value: 4730000, ovr: 61, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "esp_atletico", currentTeam: "Eyupspor" } }
      ]
    },
    {
      id: "esp_athletic",
      name: "Athletic Club",
      shortName: "ATH",
      logo: "assets/logos/spain/athletic.png",
      primaryColor: "#E1261B",
      secondaryColor: "#FEFEFE",
      budget: 35000000,
      ovr: 81,
      formation: "4-3-3",
      style: "Ofensivo",
      stadium: "San Mamés",
      stadiumCapacity: 53332,
      trophies: [
        { name: "Primera División", count: 8 },
        { name: "Copa del Rey", count: 24 },
        { name: "Supercopa de España", count: 3 }
      ],
      players: [
        // Porteros
        { id: "es401", name: "Unai Simón", nick: "Simón", number: 1, flag: "🇪🇸", age: 29, stamina: 100, value: 39250000, ovr: 81, pos: "POR", foot: "D", loan: null },
        { id: "es402", name: "Julen Agirrezabala", nick: "Agirrezabala", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 10190000, ovr: 75, pos: "POR", foot: "Z", loan: null },
        { id: "es403", name: "Álex Padilla", nick: "Padilla", number: 27, flag: "🇲🇽", age: 22, stamina: 100, value: 3640000, ovr: 58, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es404", name: "Dani Vivian", nick: "Vivian", number: 3, flag: "🇪🇸", age: 27, stamina: 100, value: 23950000, ovr: 83, pos: "DFC", foot: "D", loan: null },
        { id: "es405", name: "Aymeric Laporte", nick: "Laporte", number: 14, flag: "🇪🇸", age: 32, stamina: 100, value: 13550000, ovr: 77, pos: "DFC", foot: "Z", loan: null },
        { id: "es406", name: "Aitor Paredes", nick: "Paredes", number: 4, flag: "🇪🇸", age: 26, stamina: 100, value: 13300000, ovr: 77, pos: "DFC", foot: "D", loan: null },
        { id: "es407", name: "Yuri", nick: "Yuri", number: 17, flag: "🇪🇸", age: 36, stamina: 100, value: 1030000, ovr: 76, pos: "LI", foot: "Z", loan: null },
        { id: "es408", name: "Hugo Rincón", nick: "Rincón", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 5410000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es409", name: "Andoni Gorosabel", nick: "Gorosabel", number: 2, flag: "🇪🇸", age: 29, stamina: 100, value: 6460000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es410", name: "Jesús Areso", nick: "Areso", number: 12, flag: "🇪🇸", age: 27, stamina: 100, value: 8020000, ovr: 73, pos: "LD", foot: "D", loan: null },
        { id: "es411", name: "Yeray", nick: "Yeray", number: 5, flag: "🇪🇸", age: 31, stamina: 100, value: 3340000, ovr: 69, pos: "DFC", foot: "D", loan: null },
        { id: "es412", name: "Unai Egiluz", nick: "Egiluz", number: "", flag: "🇪🇸", age: 24, stamina: 100, value: 1080000, ovr: 67, pos: "DFC", foot: "D", loan: null },
        { id: "es413", name: "Adama Boiro", nick: "Boiro", number: 19, flag: "🇪🇸", age: 24, stamina: 100, value: 3880000, ovr: 62, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es414", name: "Oihan Sancet", nick: "Sancet", number: 8, flag: "🇪🇸", age: 26, stamina: 100, value: 28460000, ovr: 77, pos: "MCO", foot: "D", loan: null },
        { id: "es415", name: "Mikel Jauregizar", nick: "Jauregizar", number: 18, flag: "🇪🇸", age: 22, stamina: 100, value: 30720000, ovr: 74, pos: "MC", foot: "D", loan: null },
        { id: "es416", name: "Iñigo Ruiz De Galarreta", nick: "De Galarreta", number: 16, flag: "🇪🇸", age: 32, stamina: 100, value: 4870000, ovr: 72, pos: "MC", foot: "D", loan: null },
        { id: "es417", name: "Beñat Prados", nick: "Prados", number: 24, flag: "🇪🇸", age: 25, stamina: 100, value: 17990000, ovr: 68, pos: "MC", foot: "D", loan: null },
        { id: "es418", name: "Unai Vencedor", nick: "Vencedor", number: "30", flag: "🇪🇸", age: 25, stamina: 100, value: 4320000, ovr: 70, pos: "MC", foot: "D", loan: null },
        { id: "es419", name: "Peio Canales", nick: "Canales", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 6710000, ovr: 61, pos: "MCO", foot: "D", loan: null },
        { id: "es420", name: "Alejandro Rego", nick: "Rego", number: 30, flag: "🇪🇸", age: 23, stamina: 100, value: 3200000, ovr: 63, pos: "MC", foot: "D", loan: null },
        { id: "es421", name: "Beñat Gerenabarrena", nick: "Gerenabarrena", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 1530000, ovr: 63, pos: "MC", foot: "D", loan: null },
        { id: "es422", name: "Selton Sued", nick: "Sued", number: 44, flag: "🇪🇸", age: 19, stamina: 100, value: 1880000, ovr: 42, pos: "MC", foot: "D", loan: null },
        // Delanteros
        { id: "es423", name: "Iñaki Williams", nick: "Iñaki Williams", number: 9, flag: "🇬🇭", age: 32, stamina: 100, value: 17900000, ovr: 81, pos: "ED", foot: "D", loan: null },
        { id: "es424", name: "Gorka Guruzeta", nick: "Guruzeta", number: 11, flag: "🇪🇸", age: 29, stamina: 100, value: 12480000, ovr: 76, pos: "DC", foot: "D", loan: null },
        { id: "es425", name: "Álex Berenguer", nick: "Berenguer", number: 7, flag: "🇪🇸", age: 31, stamina: 100, value: 10010000, ovr: 77, pos: "EI", foot: "D", loan: null },
        { id: "es426", name: "Nico Williams", nick: "Nico Williams", number: 10, flag: "🇪🇸", age: 24, stamina: 100, value: 74620000, ovr: 82, pos: "EI", foot: "D", loan: null },
        { id: "es427", name: "Robert Navarro", nick: "Navarro", number: 23, flag: "🇪🇸", age: 24, stamina: 100, value: 12180000, ovr: 68, pos: "ED", foot: "D", loan: null },
        { id: "es428", name: "Álvaro Djaló", nick: "Djaló", number: "", flag: "🇬🇼", age: 26, stamina: 100, value: 5670000, ovr: 59, pos: "EI", foot: "D", loan: null },
        { id: "es429", name: "Maroan Sannadi", nick: "Sannadi", number: 21, flag: "🇲🇦", age: 25, stamina: 100, value: 3530000, ovr: 60, pos: "DC", foot: "D", loan: null },
        { id: "es430", name: "Nico Serrano", nick: "Serrano", number: 22, flag: "🇪🇸", age: 23, stamina: 100, value: 3960000, ovr: 61, pos: "EI", foot: "Z", loan: null },
        // Cedidos fuera
        { id: "es431", name: "Ibai Sanz", nick: "Sanz", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 842000, ovr: 58, pos: "DC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_athletic", currentTeam: "Córdoba CF" } },
        { id: "es432", name: "Eder García", nick: "García", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 1120000, ovr: 60, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_athletic", currentTeam: "Córdoba CF" } }
      ]
    },
    {
      id: "esp_celta",
      name: "RC Celta",
      shortName: "CEL",
      logo: "assets/logos/spain/celta.png",
      primaryColor: "#B2D2EF",
      secondaryColor: "#82A9C9",
      budget: 12000000,
      ovr: 79,
      formation: "3-4-3",
      style: "Equilibrado",
      stadium: "Estadio de Balaídos",
      stadiumCapacity: 24870,
      trophies: [
        { name: "Segunda División", count: 4 },
        { name: "Primera Federación", count: 1 },
        { name: "Segunda Federación", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es501", name: "Andrei Radu", nick: "Radu", number: 13, flag: "🇷🇴", age: 29, stamina: 100, value: 9320000, ovr: 74, pos: "POR", foot: "D", loan: null },
        { id: "es502", name: "Iván Villar", nick: "Villar", number: 1, flag: "🇪🇸", age: 29, stamina: 100, value: 1160000, ovr: 50, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es503", name: "Carl Starfelt", nick: "Starfelt", number: 2, flag: "🇸🇪", age: 31, stamina: 100, value: 7250000, ovr: 74, pos: "DFC", foot: "D", loan: null },
        { id: "es504", name: "Sergio Carreira", nick: "Carreira", number: 5, flag: "🇪🇸", age: 25, stamina: 100, value: 10740000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es505", name: "Javier Rodríguez", nick: "Javi Rodríguez", number: 20, flag: "🇪🇸", age: 23, stamina: 100, value: 14980000, ovr: 73, pos: "DFC", foot: "D", loan: null },
        { id: "es506", name: "Marcos Alonso", nick: "Alonso", number: 3, flag: "🇪🇸", age: 35, stamina: 100, value: 1700000, ovr: 74, pos: "DFC", foot: "Z", loan: null },
        { id: "es507", name: "Álvaro Núñez", nick: "Núñez", number: 15, flag: "🇪🇸", age: 26, stamina: 100, value: 6180000, ovr: 74, pos: "LD", foot: "D", loan: null },
        { id: "es508", name: "Javi Rueda", nick: "Rueda", number: 17, flag: "🇪🇸", age: 24, stamina: 100, value: 5660000, ovr: 70, pos: "LD", foot: "D", loan: null },
        { id: "es509", name: "Javi Galán", nick: "Galán", number: "", flag: "🇪🇸", age: 31, stamina: 100, value: 3920000, ovr: 72, pos: "LI", foot: "Z", loan: null },
        { id: "es510", name: "Unai Núñez", nick: "Unai Núñez", number: "", flag: "🇪🇸", age: 29, stamina: 100, value: 4730000, ovr: 69, pos: "DFC", foot: "D", loan: null },
        { id: "es511", name: "Carlos Domínguez", nick: "Domínguez", number: 24, flag: "🇪🇸", age: 25, stamina: 100, value: 4470000, ovr: 65, pos: "DFC", foot: "Z", loan: null },
        { id: "es512", name: "Yoel Lago", nick: "Lago", number: 29, flag: "🇪🇸", age: 22, stamina: 100, value: 5110000, ovr: 64, pos: "DFC", foot: "D", loan: null },
        { id: "es513", name: "Manu Fernández", nick: "Fernández", number: 12, flag: "🇪🇸", age: 25, stamina: 100, value: 1550000, ovr: 63, pos: "DFC", foot: "D", loan: null },
        { id: "es514", name: "Abdoulaye Faye", nick: "Faye", number: "", flag: "🇸🇳", age: 21, stamina: 100, value: 2380000, ovr: 56, pos: "DFC", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es515", name: "Ilaix Moriba", nick: "Moriba", number: 6, flag: "🇬🇳", age: 23, stamina: 100, value: 17990000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "es516", name: "Miguel Román", nick: "Román", number: 8, flag: "🇪🇸", age: 23, stamina: 100, value: 13240000, ovr: 65, pos: "MC", foot: "D", loan: null },
        { id: "es517", name: "Aleix Febas", nick: "Febas", number: 14, flag: "🇪🇸", age: 30, stamina: 100, value: 6190000, ovr: 73, pos: "MC", foot: "D", loan: null },
        { id: "es518", name: "Matías Vecino", nick: "Vecino", number: 21, flag: "🇺🇾", age: 34, stamina: 100, value: 2470000, ovr: 69, pos: "MC", foot: "D", loan: null },
        // Delanteros
        { id: "es519", name: "Borja Iglesias", nick: "Iglesias", number: 7, flag: "🇪🇸", age: 33, stamina: 100, value: 4810000, ovr: 75, pos: "DC", foot: "D", loan: null },
        { id: "es520", name: "Ferran Jutglà", nick: "Jutglà", number: 9, flag: "🇪🇸", age: 27, stamina: 100, value: 12920000, ovr: 75, pos: "ED", foot: "D", loan: null },
        { id: "es521", name: "Pablo Durán", nick: "Durán", number: 18, flag: "🇪🇸", age: 25, stamina: 100, value: 8600000, ovr: 71, pos: "DC", foot: "D", loan: null },
        { id: "es522", name: "Iago Aspas", nick: "Aspas", number: 10, flag: "🇪🇸", age: 39, stamina: 100, value: 728000, ovr: 72, pos: "DC", foot: "Z", loan: null },
        { id: "es523", name: "Williot Swedberg", nick: "Swedberg", number: 19, flag: "🇸🇪", age: 22, stamina: 100, value: 22660000, ovr: 68, pos: "EI", foot: "D", loan: null },
        { id: "es524", name: "Hugo Álvarez", nick: "Álvarez", number: 23, flag: "🇪🇸", age: 23, stamina: 100, value: 12690000, ovr: 67, pos: "EI", foot: "D", loan: null },
        { id: "es525", name: "Carles Pérez", nick: "Pérez", number: "", flag: "🇪🇸", age: 28, stamina: 100, value: 4260000, ovr: 66, pos: "ED", foot: "Z", loan: null },
        { id: "es526", name: "J. El-Abdellaoui", nick: "El-Abdellaoui", number: 39, flag: "🇲🇦", age: 20, stamina: 100, value: 10590000, ovr: 60, pos: "ED", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es529", name: "Damián Rodríguez", nick: "Damián", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 4100000, ovr: 57, pos: "MCD", foot: "Z", loan: { isLoaned: true, parentTeam: "esp_celta", currentTeam: "Cádiz CF" } }
      ]
    },
    {
      id: "esp_levantte",
      name: "Levante UD",
      shortName: "LEV",
      logo: "assets/logos/spain/levante.png",
      primaryColor: "#A4133C",
      secondaryColor: "#0E1B4D",
      budget: 6000000,
      ovr: 76,
      formation: "4-2-3-1",
      style: "Equilibrado",
      stadium: "Estadi Ciutat de València",
      stadiumCapacity: 26354,
      trophies: [
        { name: "Segunda División", count: 4 },
        { name: "Primera Federación", count: 5 },
        { name: "Segunda Federación", count: 7 }
      ],
      players: [
        // Porteros
        { id: "es601", name: "M. Ryan", nick: "Ryan", number: "", flag: "🇦🇺", age: 34, stamina: 100, value: 2580000, ovr: 76, pos: "POR", foot: "D", loan: null },
        { id: "es602", name: "Pablo Campos", nick: "Campos", number: 1, flag: "🇪🇸", age: 24, stamina: 100, value: 2770000, ovr: 64, pos: "POR", foot: "D", loan: null },
        { id: "es603", name: "Dani Martín", nick: "Martín", number: "", flag: "🇪🇸", age: 20, stamina: 100, value: 680000, ovr: 52, pos: "POR", foot: "D", loan: null },
        { id: "es604", name: "A. Primo", nick: "Primo", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 184000, ovr: 42, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es605", name: "Aïssa Mandi", nick: "Mandi", number: "", flag: "🇩🇿", age: 34, stamina: 100, value: 2500000, ovr: 76, pos: "DFC", foot: "D", loan: null },
        { id: "es606", name: "Dela", nick: "Dela", number: 4, flag: "🇪🇸", age: 27, stamina: 100, value: 5540000, ovr: 74, pos: "DFC", foot: "D", loan: null },
        { id: "es607", name: "U. Elgezabal", nick: "Elgezabal", number: 5, flag: "🇪🇸", age: 33, stamina: 100, value: 1240000, ovr: 75, pos: "DFC", foot: "D", loan: null },
        { id: "es608", name: "Jeremy Toljan", nick: "Toljan", number: 22, flag: "🇩🇪", age: 31, stamina: 100, value: 2690000, ovr: 72, pos: "LD", foot: "D", loan: null },
        { id: "es609", name: "Manu Sánchez", nick: "Sánchez", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 8290000, ovr: 73, pos: "LI", foot: "Z", loan: { isLoaned: true, parentTeam: "esp_celta", currentTeam: "esp_levantte" } },
        { id: "es610", name: "Xavi Grande", nick: "Grande", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 1190000, ovr: 57, pos: "LD", foot: "D", loan: null },
        { id: "es611", name: "Jorge Cabello", nick: "Cabello", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 2420000, ovr: 62, pos: "DFC", foot: "Z", loan: null },
        { id: "es612", name: "Nacho Pérez", nick: "Pérez", number: "", flag: "🇪🇸", age: 17, stamina: 100, value: 416000, ovr: 47, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es613", name: "Carlos Álvarez", nick: "Álvarez", number: 24, flag: "🇪🇸", age: 22, stamina: 100, value: 17610000, ovr: 73, pos: "MCO", foot: "Z", loan: null },
        { id: "es614", name: "K. Arriaga", nick: "Arriaga", number: 16, flag: "🇭🇳", age: 28, stamina: 100, value: 4990000, ovr: 70, pos: "MCD", foot: "D", loan: null },
        { id: "es615", name: "Oriol Rey", nick: "Rey", number: 20, flag: "🇪🇸", age: 28, stamina: 100, value: 3830000, ovr: 69, pos: "MCD", foot: "Z", loan: null },
        { id: "es616", name: "E. Bardeli", nick: "Bardeli", number: "", flag: "🇫🇷", age: 25, stamina: 100, value: 6570000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "es617", name: "Dani Requena", nick: "Requena", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 1570000, ovr: 60, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "Villarreal B", currentTeam: "esp_levantte" } },
        { id: "es618", name: "Olasagasti", nick: "Olasagasti", number: 8, flag: "🇪🇸", age: 25, stamina: 100, value: 3450000, ovr: 61, pos: "MC", foot: "Z", loan: null },
        { id: "es619", name: "Hugo Sotelo", nick: "Sotelo", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 7380000, ovr: 61, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_celta", currentTeam: "esp_levantte" } },
        { id: "es620", name: "Edgar Alcañiz", nick: "Alcañiz", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 215000, ovr: 49, pos: "MC", foot: "D", loan: null },
        // Delanteros
        { id: "es621", name: "Etta Eyong", nick: "Eyong", number: 21, flag: "🇨🇲", age: 22, stamina: 100, value: 15030000, ovr: 71, pos: "DC", foot: "D", loan: null },
        { id: "es622", name: "Roger Brugué", nick: "Brugué", number: 7, flag: "🇪🇸", age: 29, stamina: 100, value: 4330000, ovr: 72, pos: "EI", foot: "Z", loan: null },
        { id: "es623", name: "Iván Romero", nick: "Romero", number: 9, flag: "🇪🇸", age: 25, stamina: 100, value: 9140000, ovr: 68, pos: "DC", foot: "D", loan: null },
        { id: "es624", name: "Víctor García", nick: "García", number: 17, flag: "🇪🇸", age: 28, stamina: 100, value: 2410000, ovr: 69, pos: "ED", foot: "D", loan: null },
        { id: "es625", name: "T. Abed", nick: "Abed", number: 55, flag: "🇮🇱", age: 22, stamina: 100, value: 3070000, ovr: 61, pos: "ED", foot: "Z", loan: null },
        { id: "es626", name: "Yanis Musuayi", nick: "Musuayi", number: "", flag: "🇧🇪", age: 19, stamina: 100, value: 803000, ovr: 48, pos: "DC", foot: "D", loan: null },
        { id: "es627", name: "Paco Cortés", nick: "Cortés", number: 27, flag: "🇪🇸", age: 18, stamina: 100, value: 1530000, ovr: 51, pos: "EI", foot: "D", loan: null },
        { id: "es628", name: "Kareem Tunde", nick: "Tunde", number: 26, flag: "🇪🇸", age: 20, stamina: 100, value: 794000, ovr: 49, pos: "ED", foot: "Z", loan: null }
      ]
    },
    {
      id: "esp_alaves",
      name: "Deportivo Alavés",
      shortName: "ALA",
      logo: "assets/logos/spain/alaves.png",
      primaryColor: "#0432A4",
      secondaryColor: "#0E2A6E",
      budget: 6000000,
      ovr: 77,
      formation: "4-2-3-1",
      style: "Equilibrado",
      stadium: "Estadio de Mendizorroza",
      stadiumCapacity: 19840,
      trophies: [
        { name: "Segunda División", count: 4 },
        { name: "Primera Federación", count: 4 },
        { name: "Segunda Federación", count: 7 }
      ],
      players: [
        // Porteros
        { id: "es701", name: "Antonio Sivera", nick: "Sivera", number: 1, flag: "🇪🇸", age: 29, stamina: 100, value: 7220000, ovr: 76, pos: "POR", foot: "D", loan: null },
        { id: "es702", name: "Jesús Owono", nick: "Owono", number: "", flag: "🇬🇶", age: 25, stamina: 100, value: 1220000, ovr: 59, pos: "POR", foot: "A", loan: null },
        { id: "es703", name: "A. Rodríguez", nick: "Rodríguez", number: "", flag: "🇦🇷", age: 25, stamina: 100, value: 257000, ovr: 45, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es704", name: "N. Tenaglia", nick: "Tenaglia", number: 14, flag: "🇦🇷", age: 30, stamina: 100, value: 5520000, ovr: 75, pos: "LD", foot: "D", loan: null },
        { id: "es705", name: "Jonny", nick: "Jonny", number: 17, flag: "🇪🇸", age: 32, stamina: 100, value: 3060000, ovr: 72, pos: "LD", foot: "A", loan: null },
        { id: "es706", name: "F. Garcés", nick: "Garcés", number: 2, flag: "🇲🇾", age: 26, stamina: 100, value: 3200000, ovr: 72, pos: "DFC", foot: "D", loan: null },
        { id: "es707", name: "V. Koski", nick: "Koski", number: "", flag: "🇫🇮", age: 24, stamina: 100, value: 7360000, ovr: 71, pos: "DFC", foot: "D", loan: null },
        { id: "es708", name: "Moussa Diarra", nick: "Diarra", number: "", flag: "🇲🇱", age: 25, stamina: 100, value: 5090000, ovr: 66, pos: "DFC", foot: "Z", loan: null },
        { id: "es709", name: "Yusi Enríquez", nick: "Enríquez", number: 3, flag: "🇲🇦", age: 20, stamina: 100, value: 5310000, ovr: 61, pos: "LI", foot: "Z", loan: null },
        { id: "es710", name: "Nikola Maraš", nick: "Maraš", number: "", flag: "🇷🇸", age: 30, stamina: 100, value: 1450000, ovr: 61, pos: "DFC", foot: "D", loan: null },
        { id: "es711", name: "Hugo Novoa", nick: "Novoa", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 1590000, ovr: 55, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es712", name: "Antonio Blanco", nick: "Blanco", number: 8, flag: "🇪🇸", age: 26, stamina: 100, value: 12440000, ovr: 73, pos: "MCD", foot: "D", loan: null },
        { id: "es713", name: "Pablo Ibáñez", nick: "Ibáñez", number: 19, flag: "🇪🇸", age: 27, stamina: 100, value: 5510000, ovr: 68, pos: "MC", foot: "D", loan: null },
        { id: "es714", name: "C. Aleñá", nick: "Aleñá", number: 10, flag: "🇪🇸", age: 28, stamina: 100, value: 5450000, ovr: 68, pos: "MC", foot: "Z", loan: null },
        { id: "es715", name: "Ander Guevara", nick: "Guevara", number: 6, flag: "🇪🇸", age: 29, stamina: 100, value: 5370000, ovr: 65, pos: "MC", foot: "D", loan: null },
        { id: "es716", name: "Denis Suárez", nick: "Suárez", number: 4, flag: "🇪🇸", age: 32, stamina: 100, value: 2210000, ovr: 61, pos: "MCO", foot: "D", loan: null },
        { id: "es717", name: "Selu Diallo", nick: "Diallo", number: "", flag: "🇬🇳", age: 22, stamina: 100, value: 1060000, ovr: 59, pos: "MC", foot: "D", loan: null },
        { id: "es718", name: "Mikel Rodriguez", nick: "Rodriguez", number: "", flag: "🇪🇸", age: 24, stamina: 100, value: 1000000, ovr: 61, pos: "MC", foot: "D", loan: null },
        { id: "es719", name: "C. Protesoni", nick: "Protesoni", number: 23, flag: "🇺🇾", age: 28, stamina: 100, value: 2620000, ovr: 58, pos: "MCD", foot: "D", loan: null },
        { id: "es720", name: "Tomás Mendes", nick: "Mendes", number: "", flag: "🇬🇼", age: 21, stamina: 100, value: 490000, ovr: 53, pos: "MCD", foot: "D", loan: null },
        // Delanteros
        { id: "es721", name: "Lucas Boyé", nick: "Boyé", number: 15, flag: "🇦🇷", age: 30, stamina: 100, value: 6210000, ovr: 73, pos: "DC", foot: "D", loan: null },
        { id: "es722", name: "Miguel Rodríguez", nick: "Rodríguez", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 10900000, ovr: 69, pos: "ED", foot: "Z", loan: null },
        { id: "es723", name: "Toni Martínez", nick: "Martínez", number: 11, flag: "🇪🇸", age: 29, stamina: 100, value: 4950000, ovr: 67, pos: "DC", foot: "D", loan: null },
        { id: "es724", name: "Abde Rebbach", nick: "Rebbach", number: 21, flag: "🇩🇿", age: 27, stamina: 100, value: 3210000, ovr: 64, pos: "EI", foot: "D", loan: null },
        { id: "es725", name: "Ángel Pérez", nick: "Pérez", number: 7, flag: "🇪🇸", age: 24, stamina: 100, value: 2840000, ovr: 60, pos: "ED", foot: "D", loan: null },
        { id: "es726", name: "Aitor Mañas", nick: "Mañas", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 552000, ovr: 55, pos: "DC", foot: "Z", loan: null },
        { id: "es727", name: "Mariano Díaz", nick: "Mariano", number: 9, flag: "🇩🇴", age: 33, stamina: 100, value: 434000, ovr: 48, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es728", name: "Unai Ropero", nick: "Ropero", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 1200000, ovr: 58, pos: "DC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_alaves", currentTeam: "Racing Ferrol" } },
        { id: "es729", name: "Adrián Pica", nick: "Pica", number: "", flag: "🇪🇸", age: 24, stamina: 100, value: 900000, ovr: 56, pos: "DFC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_alaves", currentTeam: "Penafiel" } },
        { id: "es730", name: "Egoitz Muñoz", nick: "Muñoz", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 800000, ovr: 54, pos: "DFC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_alaves", currentTeam: "Córdoba CF" } },
        { id: "es731", name: "G. Albarracin", nick: "Albarracin", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 700000, ovr: 52, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_alaves", currentTeam: "NK Istra 1961" } }
      ]
    },
    {
      id: "esp_elche",
      name: "Elche CF",
      shortName: "ELC",
      logo: "assets/logos/spain/elche.png",
      primaryColor: "#15803D",
      secondaryColor: "#FFFFFF",
      budget: 5500000,
      ovr: 76,
      formation: "3-5-2",
      style: "Ofensivo",
      stadium: "Estadio Martínez Valero",
      stadiumCapacity: 31388,
      trophies: [
        { name: "Segunda División", count: 2 },
        { name: "Primera Federación", count: 7 }
      ],
      players: [
        // Porteros
        { id: "es801", name: "Matías Dituro", nick: "Dituro", number: 1, flag: "🇦🇷", age: 39, stamina: 100, value: 100000, ovr: 73, pos: "POR", foot: "D", loan: null },
        { id: "es802", name: "Alejandro Iturbe", nick: "Iturbe", number: 45, flag: "🇪🇸", age: 22, stamina: 100, value: 1400000, ovr: 60, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es803", name: "David Affengruber", nick: "Affengruber", number: 22, flag: "🇦🇹", age: 25, stamina: 100, value: 20000000, ovr: 78, pos: "DFC", foot: "D", loan: null },
        { id: "es804", name: "Víctor Chust", nick: "Chust", number: "", flag: "🇪🇸", age: 26, stamina: 100, value: 3500000, ovr: 74, pos: "DFC", foot: "A", loan: null },
        { id: "es805", name: "Matia Barzic", nick: "Barzic", number: "", flag: "🇭🇷", age: 22, stamina: 100, value: 1000000, ovr: 64, pos: "DFC", foot: "D", loan: null },
        { id: "es806", name: "John Donald", nick: "Donald", number: 18, flag: "🇪🇸", age: 25, stamina: 100, value: 1000000, ovr: 65, pos: "DFC", foot: "D", loan: null },
        { id: "es807", name: "Bambo Diaby", nick: "Diaby", number: "", flag: "🇪🇸", age: 28, stamina: 100, value: 800000, ovr: 56, pos: "DFC", foot: "D", loan: null },
        { id: "es808", name: "Pedro Bigas", nick: "Bigas", number: 6, flag: "🇪🇸", age: 36, stamina: 100, value: 300000, ovr: 75, pos: "DFC", foot: "Z", loan: null },
        { id: "es809", name: "Buba Sangaré", nick: "Sangaré", number: "", flag: "🇪🇸", age: 18, stamina: 100, value: 4500000, ovr: 45, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es810", name: "Marc Aguado", nick: "Aguado", number: 8, flag: "🇪🇸", age: 26, stamina: 100, value: 3500000, ovr: 67, pos: "MCD", foot: "Z", loan: null },
        { id: "es811", name: "Federico Redondo", nick: "Redondo", number: 5, flag: "🇦🇷", age: 23, stamina: 100, value: 2500000, ovr: 66, pos: "MCD", foot: "D", loan: null },
        { id: "es812", name: "Martim Neto", nick: "Neto", number: 16, flag: "🇵🇹", age: 23, stamina: 100, value: 4000000, ovr: 60, pos: "MC", foot: "D", loan: null },
        { id: "es813", name: "Gonzalo Villar", nick: "Villar", number: "", flag: "🇪🇸", age: 28, stamina: 100, value: 1800000, ovr: 63, pos: "MC", foot: "D", loan: null },
        { id: "es814", name: "Adam Boayar", nick: "Boayar", number: 32, flag: "🇲🇦", age: 20, stamina: 100, value: 800000, ovr: 52, pos: "MCO", foot: "D", loan: null },
        { id: "es815", name: "Ali Houary", nick: "Houary", number: "", flag: "🇲🇦", age: 20, stamina: 100, value: 300000, ovr: 56, pos: "MCO", foot: "D", loan: null },
        // Delanteros
        { id: "es816", name: "Germán Valera", nick: "Valera", number: 11, flag: "🇪🇸", age: 24, stamina: 100, value: 6000000, ovr: 70, pos: "EI", foot: "Z", loan: null },
        { id: "es817", name: "Lucas Cepeda", nick: "Cepeda", number: 24, flag: "🇨🇱", age: 23, stamina: 100, value: 2500000, ovr: 69, pos: "EI", foot: "Z", loan: null },
        { id: "es818", name: "Tete Morente", nick: "Morente", number: 15, flag: "🇪🇸", age: 29, stamina: 100, value: 1800000, ovr: 66, pos: "EI", foot: "D", loan: null },
        { id: "es819", name: "Yago Santiago", nick: "Yago", number: 7, flag: "🇪🇸", age: 23, stamina: 100, value: 1000000, ovr: 56, pos: "EI", foot: "D", loan: null },
        { id: "es820", name: "Rafa Núñez", nick: "Núñez", number: "", flag: "🇩🇴", age: 24, stamina: 100, value: 200000, ovr: 44, pos: "EI", foot: "D", loan: null },
        { id: "es821", name: "Grady Diangana", nick: "Diangana", number: 19, flag: "🇨🇩", age: 28, stamina: 100, value: 2000000, ovr: 62, pos: "ED", foot: "Z", loan: null },
        { id: "es822", name: "Josan", nick: "Josan", number: "", flag: "🇪🇸", age: 36, stamina: 100, value: 100000, ovr: 65, pos: "ED", foot: "D", loan: null },
        { id: "es823", name: "Fer Niño", nick: "Fer Niño", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 2000000, ovr: 72, pos: "DC", foot: "D", loan: null },
        { id: "es824", name: "Abiel Osorio", nick: "Osorio", number: "", flag: "🇦🇷", age: 24, stamina: 100, value: 1500000, ovr: 72, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es825", name: "Axel Werner", nick: "Werner", number: "", flag: "🇦🇷", age: 30, stamina: 100, value: 402000, ovr: 43, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "esp_elche", currentTeam: "Rosario Central" } }
      ]
    },
    {
      id: "esp_espanyol",
      name: "RCD Espanyol",
      shortName: "ESP",
      logo: "assets/logos/spain/espanyol.png",
      primaryColor: "#0070C0",
      secondaryColor: "#FFFFFF",
      budget: 8000000,
      ovr: 78,
      formation: "4-4-2",
      style: "Equilibrado",
      stadium: "Stage Front Stadium",
      stadiumCapacity: 40500,
      trophies: [
        { name: "Copa del Rey", count: 4 },
        { name: "Segunda División", count: 2 }
      ],
      players: [
        // Porteros
        { id: "es826", name: "Marko Dmitrovic", nick: "Dmitrovic", number: 13, flag: "🇷🇸", age: 34, stamina: 100, value: 700000, ovr: 76, pos: "POR", foot: "Z", loan: null },
        { id: "es827", name: "Ángel Fortuño", nick: "Fortuño", number: 1, flag: "🇪🇸", age: 24, stamina: 100, value: 300000, ovr: 52, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es828", name: "Clemens Riedel", nick: "Riedel", number: 38, flag: "🇩🇪", age: 23, stamina: 100, value: 4000000, ovr: 68, pos: "DFC", foot: "D", loan: null },
        { id: "es829", name: "Miguel Rubio", nick: "Rubio", number: 15, flag: "🇪🇸", age: 28, stamina: 100, value: 1500000, ovr: 73, pos: "DFC", foot: "D", loan: null },
        { id: "es830", name: "Pablo Ramón", nick: "Ramón", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 1400000, ovr: 60, pos: "DFC", foot: "D", loan: null },
        { id: "es831", name: "Leandro Cabrera", nick: "Cabrera", number: 6, flag: "🇺🇾", age: 35, stamina: 100, value: 900000, ovr: 77, pos: "DFC", foot: "Z", loan: null },
        { id: "es832", name: "Quilindschy Hartman", nick: "Hartman", number: "", flag: "🇳🇱", age: 24, stamina: 100, value: 16000000, ovr: 71, pos: "LI", foot: "Z", loan: { isLoaned: true, parentTeam: "Burnley", currentTeam: "esp_espanyol" } },
        { id: "es833", name: "Roger Hinojo", nick: "Hinojo", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 1000000, ovr: 61, pos: "LI", foot: "Z", loan: null },
        { id: "es834", name: "Omar El Hilali", nick: "El Hilali", number: 23, flag: "🇲🇦", age: 22, stamina: 100, value: 15000000, ovr: 74, pos: "LD", foot: "D", loan: null },
        { id: "es835", name: "Rubén Sánchez", nick: "Rubén", number: 2, flag: "🇪🇸", age: 25, stamina: 100, value: 1800000, ovr: 65, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es836", name: "Urko González", nick: "Urko", number: 4, flag: "🇪🇸", age: 25, stamina: 100, value: 12000000, ovr: 68, pos: "MCD", foot: "D", loan: null },
        { id: "es837", name: "Gabriel Moscardo", nick: "Moscardo", number: "", flag: "🇧🇷", age: 20, stamina: 100, value: 7000000, ovr: 55, pos: "MCD", foot: "D", loan: { isLoaned: true, parentTeam: "PSG", currentTeam: "esp_espanyol" } },
        { id: "es838", name: "Pol Lozano", nick: "Lozano", number: 10, flag: "🇪🇸", age: 26, stamina: 100, value: 6000000, ovr: 70, pos: "MC", foot: "D", loan: null },
        { id: "es839", name: "Edu Expósito", nick: "Expósito", number: 8, flag: "🇪🇸", age: 30, stamina: 100, value: 5000000, ovr: 69, pos: "MC", foot: "D", loan: null },
        { id: "es840", name: "Rafel Bauzà", nick: "Bauzà", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 1200000, ovr: 62, pos: "MC", foot: "D", loan: null },
        { id: "es841", name: "Álex Calatrava", nick: "Calatrava", number: "", flag: "🇪🇸", age: 26, stamina: 100, value: 4000000, ovr: 70, pos: "MCO", foot: "Z", loan: null },
        { id: "es842", name: "Javi Hernández", nick: "Hernández", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 1500000, ovr: 60, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es843", name: "Javi Puado", nick: "Puado", number: 7, flag: "🇪🇸", age: 28, stamina: 100, value: 7500000, ovr: 79, pos: "EI", foot: "D", loan: null },
        { id: "es844", name: "Pere Milla", nick: "Milla", number: 11, flag: "🇪🇸", age: 33, stamina: 100, value: 1000000, ovr: 66, pos: "EI", foot: "Z", loan: null },
        { id: "es845", name: "Tyrhys Dolan", nick: "Dolan", number: 24, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 24, stamina: 100, value: 10000000, ovr: 72, pos: "ED", foot: "D", loan: null },
        { id: "es846", name: "Jofre Carreras", nick: "Jofre", number: 17, flag: "🇪🇸", age: 25, stamina: 100, value: 3000000, ovr: 64, pos: "ED", foot: "D", loan: null },
        { id: "es847", name: "Roberto Fernández", nick: "Roberto", number: 9, flag: "🇪🇸", age: 24, stamina: 100, value: 10000000, ovr: 75, pos: "DC", foot: "D", loan: null },
        { id: "es848", name: "Marcos Fernández", nick: "Marcos", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 1500000, ovr: 63, pos: "DC", foot: "D", loan: null },
        { id: "es849", name: "Kike García", nick: "Kike", number: 19, flag: "🇪🇸", age: 36, stamina: 100, value: 700000, ovr: 74, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es850", name: "José Gragera", nick: "Gragera", number: "", flag: "🇪🇸", age: 26, stamina: 100, value: 1730000, ovr: 59, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_espanyol", currentTeam: "Burgos CF" } },
        { id: "es852", name: "Antoniu Roca", nick: "Antoniu", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 2900000, ovr: 55, pos: "ED", foot: "D", loan: { isLoaned: true, parentTeam: "esp_espanyol", currentTeam: "Mallorca" } }
      ]
    },
    {
      id: "esp_getafe",
      name: "Getafe CF",
      shortName: "GET",
      logo: "assets/logos/spain/getafe.png",
      primaryColor: "#0050A4",
      secondaryColor: "#003A73",
      budget: 8000000,
      ovr: 77,
      formation: "4-4-2",
      style: "Defensivo",
      stadium: "Coliseum",
      stadiumCapacity: 17000,
      trophies: [
        { name: "Primera Federación", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es853", name: "David Soria", nick: "Soria", number: 13, flag: "🇪🇸", age: 33, stamina: 100, value: 2800000, ovr: 77, pos: "POR", foot: "D", loan: null },
        { id: "es854", name: "Jiri Letacek", nick: "Letacek", number: 1, flag: "🇨🇿", age: 27, stamina: 100, value: 2000000, ovr: 49, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es855", name: "Abdel Abqar", nick: "Abqar", number: 3, flag: "🇲🇦", age: 27, stamina: 100, value: 3500000, ovr: 69, pos: "DFC", foot: "D", loan: null },
        { id: "es856", name: "Zaid Romero", nick: "Romero", number: "", flag: "🇦🇷", age: 26, stamina: 100, value: 2500000, ovr: 63, pos: "DFC", foot: "Z", loan: null },
        { id: "es857", name: "Juan Berrocal", nick: "Berrocal", number: "", flag: "🇪🇸", age: 27, stamina: 100, value: 1500000, ovr: 59, pos: "DFC", foot: "A", loan: null },
        { id: "es858", name: "Sebastián Boselli", nick: "Boselli", number: "", flag: "🇺🇾", age: 22, stamina: 100, value: 1500000, ovr: 64, pos: "DFC", foot: "D", loan: null },
        { id: "es859", name: "Dakonam Djené", nick: "Djené", number: 2, flag: "🇹🇬", age: 34, stamina: 100, value: 1400000, ovr: 75, pos: "DFC", foot: "D", loan: null },
        { id: "es860", name: "Jean Ives Valou", nick: "Valou", number: "", flag: "🇨🇮", age: 20, stamina: 100, value: 600000, ovr: 51, pos: "DFC", foot: "Z", loan: { isLoaned: true, parentTeam: "Villarreal B", currentTeam: "esp_getafe" } },
        { id: "es861", name: "Andrés García", nick: "García", number: 21, flag: "🇪🇸", age: 23, stamina: 100, value: 6000000, ovr: 61, pos: "LD", foot: "D", loan: { isLoaned: true, parentTeam: "eng_astonvilla", currentTeam: "esp_getafe" } },
        { id: "es862", name: "Kiko Femenía", nick: "Femenía", number: 17, flag: "🇪🇸", age: 35, stamina: 100, value: 700000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es863", name: "Ismael Bekhoucha", nick: "Bekhoucha", number: 31, flag: "🇲🇦", age: 21, stamina: 100, value: 300000, ovr: 51, pos: "LD", foot: "D", loan: null },
        { id: "es864", name: "Davinchi", nick: "Davinchi", number: 26, flag: "🇪🇸", age: 18, stamina: 100, value: 1000000, ovr: 59, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es865", name: "Mario Martín", nick: "Mario", number: 6, flag: "🇪🇸", age: 22, stamina: 100, value: 10000000, ovr: 62, pos: "MCD", foot: "D", loan: null },
        { id: "es866", name: "Yvan Neyou", nick: "Neyou", number: "", flag: "🇨🇲", age: 29, stamina: 100, value: 2000000, ovr: 60, pos: "MCD", foot: "D", loan: null },
        { id: "es867", name: "Ramón Terrats", nick: "Terrats", number: 8, flag: "🇪🇸", age: 25, stamina: 100, value: 3000000, ovr: 66, pos: "MC", foot: "Z", loan: null },
        { id: "es868", name: "Javi Muñoz", nick: "Muñoz", number: 14, flag: "🇪🇸", age: 31, stamina: 100, value: 1200000, ovr: 74, pos: "MC", foot: "D", loan: null },
        // Delanteros
        { id: "es869", name: "Juanmi", nick: "Juanmi", number: 7, flag: "🇪🇸", age: 33, stamina: 100, value: 1000000, ovr: 78, pos: "EI", foot: "D", loan: null },
        { id: "es870", name: "Álex Sancris", nick: "Sancris", number: 18, flag: "🇪🇸", age: 29, stamina: 100, value: 1500000, ovr: 68, pos: "ED", foot: "A", loan: null },
        { id: "es871", name: "Christantus Uche", nick: "Uche", number: "", flag: "🇳🇬", age: 23, stamina: 100, value: 12000000, ovr: 67, pos: "DC", foot: "A", loan: null },
        { id: "es872", name: "Martín Satriano", nick: "Satriano", number: "", flag: "🇺🇾", age: 25, stamina: 100, value: 10000000, ovr: 67, pos: "DC", foot: "D", loan: null },
        { id: "es873", name: "Borja Mayoral", nick: "Mayoral", number: 9, flag: "🇪🇸", age: 29, stamina: 100, value: 6000000, ovr: 72, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_malaga",
      name: "Málaga CF",
      shortName: "MAL",
      logo: "assets/logos/spain/malaga.png",
      primaryColor: "#0F8CD9",
      secondaryColor: "#1B3A6B",
      budget: 5000000,
      ovr: 75,
      formation: "4-2-3-1",
      style: "Equilibrado",
      stadium: "La Rosaleda",
      stadiumCapacity: 30044,
      trophies: [
        { name: "Segunda División", count: 1 },
        { name: "Primera Federación", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es874", name: "Alfonso Herrero", nick: "Herrero", number: 1, flag: "🇪🇸", age: 32, stamina: 100, value: 400000, ovr: 72, pos: "POR", foot: "D", loan: null },
        { id: "es875", name: "Carlos López", nick: "López", number: 13, flag: "🇪🇸", age: 21, stamina: 100, value: 100000, ovr: 42, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es876", name: "Fernando Calero", nick: "Calero", number: "", flag: "🇪🇸", age: 30, stamina: 100, value: 2000000, ovr: 67, pos: "DFC", foot: "D", loan: null },
        { id: "es877", name: "Diego Murillo", nick: "Murillo", number: 16, flag: "🇪🇸", age: 25, stamina: 100, value: 1500000, ovr: 70, pos: "DFC", foot: "D", loan: null },
        { id: "es878", name: "Einar Galilea", nick: "Galilea", number: 4, flag: "🇪🇸", age: 32, stamina: 100, value: 350000, ovr: 66, pos: "DFC", foot: "Z", loan: null },
        { id: "es879", name: "Álex Pastor", nick: "Pastor", number: "", flag: "🇪🇸", age: 26, stamina: 100, value: 300000, ovr: 70, pos: "DFC", foot: "D", loan: null },
        { id: "es880", name: "Ángel Recio", nick: "Recio", number: 36, flag: "🇪🇸", age: 23, stamina: 100, value: 300000, ovr: 49, pos: "DFC", foot: "D", loan: null },
        { id: "es881", name: "Moussa Diarra", nick: "Diarra", number: "", flag: "🇲🇱", age: 24, stamina: 100, value: 25000, ovr: 37, pos: "DFC", foot: "D", loan: null },
        { id: "es882", name: "Rafita Garrido", nick: "Rafita", number: 31, flag: "🇪🇸", age: 21, stamina: 100, value: 1000000, ovr: 53, pos: "LD", foot: "D", loan: null },
        { id: "es883", name: "Carlos Puga", nick: "Puga", number: 3, flag: "🇪🇸", age: 25, stamina: 100, value: 800000, ovr: 64, pos: "LD", foot: "D", loan: null },
        { id: "es884", name: "Dani Sánchez", nick: "Sánchez", number: 18, flag: "🇪🇸", age: 26, stamina: 100, value: 400000, ovr: 63, pos: "LI", foot: "Z", loan: null },
        { id: "es851", name: "José Salinas", nick: "Salinas", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 4650000, ovr: 68, pos: "LI", foot: "Z", loan: { isLoaned: true, parentTeam: "esp_espanyol", currentTeam: "esp_malaga" } },
        // Centrocampistas
        { id: "es885", name: "Izan Merino", nick: "Merino", number: 23, flag: "🇪🇸", age: 20, stamina: 100, value: 2000000, ovr: 66, pos: "MC", foot: "D", loan: null },
        { id: "es886", name: "Juanpe Jiménez", nick: "Juanpe", number: 8, flag: "🇪🇸", age: 30, stamina: 100, value: 300000, ovr: 51, pos: "MC", foot: "D", loan: null },
        { id: "es887", name: "Ramón Enríquez", nick: "Ramón", number: 6, flag: "🇪🇸", age: 25, stamina: 100, value: 200000, ovr: 45, pos: "MC", foot: "D", loan: null },
        { id: "es888", name: "Pablo Arriaza", nick: "Arriaza", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 50000, ovr: 50, pos: "MC", foot: "D", loan: null },
        { id: "es528", name: "Carlos Dotor", nick: "Dotor", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 1580000, ovr: 61, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_celta", currentTeam: "esp_malaga" } },
        { id: "es889", name: "Dani Lorenzo", nick: "Lorenzo", number: 22, flag: "🇪🇸", age: 23, stamina: 100, value: 1500000, ovr: 61, pos: "MCO", foot: "D", loan: null },
        { id: "es890", name: "Rafa Rodríguez", nick: "Rodríguez", number: 37, flag: "🇪🇸", age: 23, stamina: 100, value: 1000000, ovr: 56, pos: "MCO", foot: "D", loan: null },
        { id: "es891", name: "Aarón Ochoa", nick: "Ochoa", number: 35, flag: "🇮🇪", age: 19, stamina: 100, value: 800000, ovr: 53, pos: "MCO", foot: "D", loan: null },
        // Delanteros
        { id: "es892", name: "Joaquín Muñoz", nick: "Muñoz", number: 11, flag: "🇪🇸", age: 27, stamina: 100, value: 1500000, ovr: 67, pos: "EI", foot: "A", loan: null },
        { id: "es893", name: "Julen Lobete", nick: "Lobete", number: 24, flag: "🇪🇸", age: 25, stamina: 100, value: 1200000, ovr: 64, pos: "EI", foot: "D", loan: null },
        { id: "es899", name: "Juan Cruz", nick: "Juan Cruz", number: "", flag: "🇪🇸", age: 26, stamina: 100, value: 1800000, ovr: 66, pos: "EI", foot: "Z", loan: { isLoaned: true, parentTeam: "Leganés", currentTeam: "esp_malaga" } },
        { id: "es894", name: "David Larrubia", nick: "Larrubia", number: 10, flag: "🇪🇸", age: 24, stamina: 100, value: 5000000, ovr: 71, pos: "ED", foot: "Z", loan: null },
        { id: "es895", name: "Haitam Abaida", nick: "Haitam", number: 7, flag: "🇲🇦", age: 24, stamina: 100, value: 200000, ovr: 35, pos: "ED", foot: "Z", loan: null },
        { id: "es896", name: "Chupe", nick: "Chupe", number: 9, flag: "🇪🇸", age: 21, stamina: 100, value: 10000000, ovr: 66, pos: "DC", foot: "D", loan: null },
        { id: "es897", name: "Adrián Niño", nick: "Niño", number: 21, flag: "🇪🇸", age: 22, stamina: 100, value: 2000000, ovr: 61, pos: "DC", foot: "D", loan: null },
        { id: "es898", name: "Eneko Jauregi", nick: "Jauregi", number: 17, flag: "🇪🇸", age: 30, stamina: 100, value: 700000, ovr: 56, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_osasuna",
      name: "CA Osasuna",
      shortName: "OSA",
      logo: "assets/logos/spain/osasuna.png",
      primaryColor: "#C8102E",
      secondaryColor: "#1D2B53",
      budget: 10000000,
      ovr: 80,
      formation: "4-2-3-1",
      style: "Equilibrado",
      stadium: "El Sadar",
      stadiumCapacity: 23576,
      trophies: [
        { name: "Segunda División", count: 5 },
        { name: "Primera Federación", count: 6 }
      ],
      players: [
        // Porteros
        { id: "es900", name: "Sergio Herrera", nick: "Herrera", number: 1, flag: "🇪🇸", age: 33, stamina: 100, value: 2800000, ovr: 76, pos: "POR", foot: "D", loan: null },
        { id: "es901", name: "Aitor Fernández", nick: "Fernández", number: 13, flag: "🇪🇸", age: 35, stamina: 100, value: 500000, ovr: 57, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es902", name: "Alejandro Catena", nick: "Catena", number: 24, flag: "🇪🇸", age: 31, stamina: 100, value: 2600000, ovr: 77, pos: "DFC", foot: "D", loan: null },
        { id: "es903", name: "Enzo Boyomo", nick: "Boyomo", number: 22, flag: "🇨🇲", age: 24, stamina: 100, value: 15000000, ovr: 75, pos: "DFC", foot: "D", loan: null },
        { id: "es904", name: "Jorge Herrando", nick: "Herrando", number: 5, flag: "🇪🇸", age: 25, stamina: 100, value: 3500000, ovr: 68, pos: "DFC", foot: "Z", loan: null },
        { id: "es905", name: "Abel Bretones", nick: "Bretones", number: 23, flag: "🇪🇸", age: 25, stamina: 100, value: 3500000, ovr: 71, pos: "LI", foot: "Z", loan: null },
        { id: "es906", name: "Valentin Rosier", nick: "Rosier", number: 19, flag: "🇫🇷", age: 29, stamina: 100, value: 3000000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es907", name: "Íñigo Arguibide", nick: "Arguibide", number: 41, flag: "🇪🇸", age: 21, stamina: 100, value: 800000, ovr: 54, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es908", name: "Lucas Torró", nick: "Torró", number: 6, flag: "🇪🇸", age: 32, stamina: 100, value: 2500000, ovr: 74, pos: "MCD", foot: "D", loan: null },
        { id: "es909", name: "Iker Muñoz", nick: "Muñoz", number: 8, flag: "🇪🇸", age: 23, stamina: 100, value: 2000000, ovr: 63, pos: "MCD", foot: "D", loan: null },
        { id: "es910", name: "Jon Moncayola", nick: "Moncayola", number: 7, flag: "🇪🇸", age: 28, stamina: 100, value: 7000000, ovr: 73, pos: "MC", foot: "D", loan: null },
        { id: "es911", name: "Asier Osambela", nick: "Osambela", number: 29, flag: "🇪🇸", age: 21, stamina: 100, value: 1000000, ovr: 63, pos: "MC", foot: "D", loan: null },
        { id: "es912", name: "Aimar Oroz", nick: "Oroz", number: 10, flag: "🇪🇸", age: 24, stamina: 100, value: 7500000, ovr: 76, pos: "MCO", foot: "D", loan: null },
        { id: "es913", name: "Moi Gómez", nick: "Moi", number: 16, flag: "🇪🇸", age: 32, stamina: 100, value: 1500000, ovr: 65, pos: "MCO", foot: "D", loan: null },
        // Delanteros
        { id: "es914", name: "Raúl Moro", nick: "Moro", number: 15, flag: "🇪🇸", age: 23, stamina: 100, value: 3500000, ovr: 64, pos: "EI", foot: "D", loan: null },
        { id: "es915", name: "Jonathan Dubasin", nick: "Dubasin", number: "", flag: "🇪🇸", age: 26, stamina: 100, value: 4000000, ovr: 71, pos: "ED", foot: "D", loan: null },
        { id: "es916", name: "Rubén García", nick: "Rubén", number: 14, flag: "🇪🇸", age: 33, stamina: 100, value: 1600000, ovr: 72, pos: "ED", foot: "Z", loan: null },
        { id: "es917", name: "Kike Barja", nick: "Barja", number: 11, flag: "🇪🇸", age: 29, stamina: 100, value: 1500000, ovr: 57, pos: "ED", foot: "D", loan: null },
        { id: "es918", name: "Iker Benito", nick: "Benito", number: 2, flag: "🇪🇸", age: 23, stamina: 100, value: 1400000, ovr: 66, pos: "ED", foot: "D", loan: null },
        { id: "es919", name: "Raúl García", nick: "R. García", number: 9, flag: "🇪🇸", age: 25, stamina: 100, value: 3000000, ovr: 67, pos: "DC", foot: "D", loan: null },
        { id: "es920", name: "Ante Budimir", nick: "Budimir", number: 17, flag: "🇭🇷", age: 35, stamina: 100, value: 2800000, ovr: 83, pos: "DC", foot: "Z", loan: null }
      ]
    },
    {
      id: "esp_racing",
      name: "Racing de Santander",
      shortName: "RAC",
      logo: "assets/logos/spain/racing.png",
      primaryColor: "#0AA05C",
      secondaryColor: "#FFFFFF",
      budget: 5000000,
      ovr: 76,
      formation: "4-2-3-1",
      style: "Ofensivo",
      stadium: "El Sardinero",
      stadiumCapacity: 22122,
      trophies: [
        { name: "Segunda División", count: 3 },
        { name: "Primera Federación", count: 2 },
        { name: "Segunda Federación", count: 3 }
      ],
      players: [
        // Porteros
        { id: "es921", name: "Simon Eriksson", nick: "Eriksson", number: 13, flag: "🇸🇪", age: 20, stamina: 100, value: 2000000, ovr: 57, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es922", name: "Manu Hernando", nick: "Hernando", number: 4, flag: "🇪🇸", age: 28, stamina: 100, value: 1400000, ovr: 64, pos: "DFC", foot: "D", loan: null },
        { id: "es923", name: "Facundo González", nick: "González", number: 16, flag: "🇺🇾", age: 23, stamina: 100, value: 3000000, ovr: 56, pos: "DFC", foot: "Z", loan: null },
        { id: "es924", name: "Pedro Felipe", nick: "P. Felipe", number: "", flag: "🇧🇷", age: 22, stamina: 100, value: 589000, ovr: 47, pos: "DFC", foot: "D", loan: null },
        { id: "es925", name: "Álvaro Mantilla", nick: "Mantilla", number: 2, flag: "🇪🇸", age: 26, stamina: 100, value: 1200000, ovr: 66, pos: "LD", foot: "D", loan: null },
        { id: "es926", name: "Jorge Salinas", nick: "Salinas", number: 32, flag: "🇪🇸", age: 19, stamina: 100, value: 8000000, ovr: 63, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es927", name: "Maguette Gueye", nick: "Gueye", number: 14, flag: "🇸🇳", age: 23, stamina: 100, value: 2000000, ovr: 62, pos: "MCD", foot: "Z", loan: null },
        { id: "es928", name: "Gustavo Puerta", nick: "Puerta", number: 19, flag: "🇨🇴", age: 23, stamina: 100, value: 18000000, ovr: 64, pos: "MC", foot: "D", loan: null },
        { id: "es929", name: "Sergio Martínez", nick: "S. Martínez", number: 36, flag: "🇪🇸", age: 19, stamina: 100, value: 2000000, ovr: 50, pos: "MC", foot: "D", loan: null },
        { id: "es930", name: "Íñigo Sainz-Maza", nick: "Sainz-Maza", number: 6, flag: "🇪🇸", age: 28, stamina: 100, value: 1000000, ovr: 55, pos: "MC", foot: "D", loan: null },
        { id: "es931", name: "Sergio Canales", nick: "Canales", number: 8, flag: "🇪🇸", age: 35, stamina: 100, value: 3000000, ovr: 80, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es932", name: "Iñigo Vicente", nick: "Vicente", number: 10, flag: "🇪🇸", age: 28, stamina: 100, value: 7000000, ovr: 72, pos: "EI", foot: "D", loan: null },
        { id: "es933", name: "Andrés Martín", nick: "A. Martín", number: 11, flag: "🇪🇸", age: 27, stamina: 100, value: 8000000, ovr: 74, pos: "ED", foot: "Z", loan: null },
        { id: "es934", name: "Giorgi Guliashvili", nick: "Guliashvili", number: 7, flag: "🇬🇪", age: 24, stamina: 100, value: 3500000, ovr: 74, pos: "DC", foot: "D", loan: null },
        { id: "es935", name: "Asier Villalibre", nick: "Villalibre", number: 12, flag: "🇪🇸", age: 28, stamina: 100, value: 2000000, ovr: 59, pos: "DC", foot: "Z", loan: null },
        { id: "es936", name: "Juan Carlos Arana", nick: "Arana", number: 9, flag: "🇪🇸", age: 26, stamina: 100, value: 1000000, ovr: 66, pos: "DC", foot: "D", loan: null },
        { id: "es937", name: "Yassir Zabiri", nick: "Zabiri", number: 21, flag: "🇲🇦", age: 21, stamina: 100, value: 9000000, ovr: 55, pos: "DC", foot: "Z", loan: { isLoaned: true, parentTeam: "Stade Rennais", currentTeam: "esp_racing" } },
        // Cedidos fuera
        { id: "es938", name: "Jokin Ezkieta", nick: "Ezkieta", number: "", flag: "🇪🇸", age: 29, stamina: 100, value: 2720000, ovr: 73, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "esp_racing", currentTeam: "Cádiz" } },
        { id: "es939", name: "Aritz Aldasoro", nick: "Aldasoro", number: "", flag: "🇪🇸", age: 27, stamina: 100, value: 2560000, ovr: 67, pos: "MC", foot: "D", loan: { isLoaned: true, parentTeam: "esp_racing", currentTeam: "Real Oviedo" } }
      ]
    },
    {
      id: "esp_rayo",
      name: "Rayo Vallecano",
      shortName: "RAY",
      logo: "assets/logos/spain/rayo.png",
      primaryColor: "#E4002B",
      secondaryColor: "#FFFFFF",
      budget: 7000000,
      ovr: 80,
      formation: "4-2-3-1",
      style: "Ofensivo",
      stadium: "Campo de Fútbol de Vallecas",
      stadiumCapacity: 14708,
      trophies: [
        { name: "Segunda División", count: 1 },
        { name: "Primera Federación", count: 2 },
        { name: "Segunda Federación", count: 2 }
      ],
      players: [
        // Porteros
        { id: "es940", name: "Augusto Batalla", nick: "Batalla", number: 13, flag: "🇦🇷", age: 30, stamina: 100, value: 6000000, ovr: 78, pos: "POR", foot: "D", loan: null },
        { id: "es941", name: "Dani Cárdenas", nick: "Cárdenas", number: 1, flag: "🇪🇸", age: 29, stamina: 100, value: 1800000, ovr: 53, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es942", name: "Florian Lejeune", nick: "Lejeune", number: 24, flag: "🇫🇷", age: 35, stamina: 100, value: 1800000, ovr: 80, pos: "DFC", foot: "D", loan: null },
        { id: "es943", name: "Jozhua Vertrouwd", nick: "Vertrouwd", number: "", flag: "🇳🇱", age: 21, stamina: 100, value: 2000000, ovr: 66, pos: "DFC", foot: "Z", loan: null },
        { id: "es944", name: "Luiz Felipe", nick: "Luiz Felipe", number: 5, flag: "🇮🇹", age: 29, stamina: 100, value: 2000000, ovr: 65, pos: "DFC", foot: "D", loan: null },
        { id: "es945", name: "Nobel Mendy", nick: "Mendy", number: "", flag: "🇸🇳", age: 21, stamina: 100, value: 7500000, ovr: 61, pos: "DFC", foot: "Z", loan: null },
        { id: "es946", name: "Pelayo Fernández", nick: "Pelayo", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 500000, ovr: 53, pos: "DFC", foot: "D", loan: null },
        { id: "es947", name: "Andrei Rațiu", nick: "Rațiu", number: 2, flag: "🇷🇴", age: 28, stamina: 100, value: 18000000, ovr: 79, pos: "LD", foot: "D", loan: null },
        { id: "es948", name: "Iván Balliu", nick: "Balliu", number: 20, flag: "🇦🇱", age: 34, stamina: 100, value: 1000000, ovr: 69, pos: "LD", foot: "D", loan: null },
        { id: "es949", name: "Pep Chavarría", nick: "Chavarría", number: 3, flag: "🇪🇸", age: 28, stamina: 100, value: 10000000, ovr: 73, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "es950", name: "Pathé Ciss", nick: "Ciss", number: 6, flag: "🇸🇳", age: 32, stamina: 100, value: 1800000, ovr: 73, pos: "MC", foot: "D", loan: null },
        { id: "es951", name: "Óscar Valentín", nick: "Valentín", number: 23, flag: "🇪🇸", age: 31, stamina: 100, value: 2000000, ovr: 70, pos: "MC", foot: "D", loan: null },
        { id: "es952", name: "Pedro Díaz", nick: "Pedro Díaz", number: 4, flag: "🇪🇸", age: 28, stamina: 100, value: 3000000, ovr: 68, pos: "MC", foot: "D", loan: null },
        { id: "es953", name: "Unai López", nick: "Unai", number: 17, flag: "🇪🇸", age: 30, stamina: 100, value: 2500000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "es954", name: "Samu Becerra", nick: "Becerra", number: 28, flag: "🇪🇸", age: 20, stamina: 100, value: 300000, ovr: 47, pos: "MC", foot: "D", loan: null },
        { id: "es955", name: "Randy Nteka", nick: "Nteka", number: 11, flag: "🇦🇴", age: 28, stamina: 100, value: 1000000, ovr: 65, pos: "MCO", foot: "Z", loan: null },
        { id: "es956", name: "Isi Palazón", nick: "Isi", number: 7, flag: "🇪🇸", age: 31, stamina: 100, value: 2800000, ovr: 76, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es957", name: "Álvaro García", nick: "Á. García", number: 18, flag: "🇪🇸", age: 33, stamina: 100, value: 1500000, ovr: 76, pos: "EI", foot: "A", loan: null },
        { id: "es958", name: "Jorge de Frutos", nick: "De Frutos", number: 19, flag: "🇪🇸", age: 29, stamina: 100, value: 12000000, ovr: 76, pos: "ED", foot: "D", loan: null },
        { id: "es959", name: "Fran Pérez", nick: "Pérez", number: 21, flag: "🇪🇸", age: 23, stamina: 100, value: 2500000, ovr: 65, pos: "ED", foot: "D", loan: null },
        { id: "es960", name: "Alemão", nick: "Alemão", number: 9, flag: "🇧🇷", age: 28, stamina: 100, value: 4000000, ovr: 73, pos: "DC", foot: "D", loan: null },
        { id: "es961", name: "Sergio Camello", nick: "Camello", number: 10, flag: "🇪🇸", age: 25, stamina: 100, value: 3000000, ovr: 67, pos: "DC", foot: "D", loan: null },
        { id: "es962", name: "Raúl de Tomás", nick: "De Tomás", number: "", flag: "🇪🇸", age: 31, stamina: 100, value: 400000, ovr: 63, pos: "DC", foot: "D", loan: null },
        { id: "es963", name: "Etienne Eto'o", nick: "Eto'o", number: "", flag: "🇨🇲", age: 23, stamina: 100, value: 300000, ovr: 51, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_depor",
      name: "RC Deportivo",
      shortName: "DEP",
      logo: "assets/logos/spain/depor.png",
      primaryColor: "#1D4E9C",
      secondaryColor: "#FFFFFF",
      budget: 6000000,
      ovr: 80,
      formation: "4-2-3-1",
      style: "Ofensivo",
      stadium: "Riazor",
      stadiumCapacity: 32560,
      trophies: [
        { name: "Primera División", count: 1 },
        { name: "Copa del Rey", count: 2 },
        { name: "Segunda División", count: 6 },
        { name: "Supercopa de España", count: 3 },
        { name: "Primera Federación", count: 1 },
        { name: "Segunda Federación", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es964", name: "Leo Román", nick: "Román", number: 24, flag: "🇪🇸", age: 26, stamina: 100, value: 6000000, ovr: 67, pos: "POR", foot: "D", loan: null },
        { id: "es965", name: "Álvaro Ferllo", nick: "Ferllo", number: 25, flag: "🇪🇸", age: 28, stamina: 100, value: 2000000, ovr: 61, pos: "POR", foot: "D", loan: null },
        { id: "es966", name: "Germán Parreño", nick: "Parreño", number: 1, flag: "🇪🇸", age: 33, stamina: 100, value: 250000, ovr: 60, pos: "POR", foot: "D", loan: null },
        { id: "es967", name: "Eric Puerto", nick: "Puerto", number: 13, flag: "🇪🇸", age: 23, stamina: 100, value: 200000, ovr: 48, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es968", name: "Lucas Noubi", nick: "Noubi", number: 4, flag: "🇧🇪", age: 21, stamina: 100, value: 1500000, ovr: 61, pos: "DFC", foot: "D", loan: null },
        { id: "es969", name: "Dani Barcia", nick: "Barcia", number: 5, flag: "🇪🇸", age: 23, stamina: 100, value: 1200000, ovr: 64, pos: "DFC", foot: "Z", loan: null },
        { id: "es970", name: "Bright Ede", nick: "Ede", number: 22, flag: "🇵🇱", age: 19, stamina: 100, value: 600000, ovr: 46, pos: "DFC", foot: "Z", loan: null },
        { id: "es971", name: "Arnau Comas", nick: "Comas", number: 3, flag: "🇪🇸", age: 26, stamina: 100, value: 500000, ovr: 60, pos: "DFC", foot: "D", loan: null },
        { id: "es972", name: "Giacomo Quagliata", nick: "Quagliata", number: 12, flag: "🇮🇹", age: 26, stamina: 100, value: 2000000, ovr: 69, pos: "LI", foot: "Z", loan: null },
        { id: "es973", name: "Adrià Altimira", nick: "Altimira", number: 2, flag: "🇪🇸", age: 25, stamina: 100, value: 1800000, ovr: 66, pos: "LD", foot: "D", loan: null },
        { id: "es974", name: "Miguel Loureiro", nick: "Loureiro", number: 15, flag: "🇪🇸", age: 29, stamina: 100, value: 1200000, ovr: 73, pos: "LD", foot: "D", loan: null },
        { id: "es975", name: "Ximo Navarro", nick: "Ximo", number: 23, flag: "🇪🇸", age: 36, stamina: 100, value: 100000, ovr: 68, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es976", name: "Lorenzo Amatucci", nick: "Amatucci", number: 16, flag: "🇮🇹", age: 22, stamina: 100, value: 8000000, ovr: 72, pos: "MCD", foot: "D", loan: null },
        { id: "es977", name: "Diego Villares", nick: "Villares", number: 8, flag: "🇪🇸", age: 30, stamina: 100, value: 1000000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "es978", name: "Riki Rodríguez", nick: "Riki", number: 14, flag: "🇪🇸", age: 28, stamina: 100, value: 1500000, ovr: 67, pos: "MC", foot: "D", loan: null },
        { id: "es979", name: "Teun Gijselhart", nick: "Gijselhart", number: 17, flag: "🇳🇱", age: 21, stamina: 100, value: 650000, ovr: 56, pos: "MC", foot: "D", loan: null },
        { id: "es980", name: "Charlie Patiño", nick: "Patiño", number: 6, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 22, stamina: 100, value: 600000, ovr: 53, pos: "MC", foot: "Z", loan: null },
        { id: "es981", name: "José Ángel Jurado", nick: "José Ángel", number: 20, flag: "🇪🇸", age: 34, stamina: 100, value: 150000, ovr: 62, pos: "MC", foot: "Z", loan: null },
        { id: "es982", name: "Noé Carrillo", nick: "Carrillo", number: 37, flag: "🇪🇸", age: 19, stamina: 100, value: 1000000, ovr: 47, pos: "MC", foot: "D", loan: null },
        { id: "es983", name: "Mario Soriano", nick: "Soriano", number: 21, flag: "🇪🇸", age: 24, stamina: 100, value: 5000000, ovr: 73, pos: "MCO", foot: "D", loan: null },
        { id: "es984", name: "Jonathan Asp Jensen", nick: "Asp Jensen", number: 18, flag: "🇩🇰", age: 20, stamina: 100, value: 4000000, ovr: 61, pos: "MCO", foot: "D", loan: null },
        { id: "es985", name: "Jairo Noriega", nick: "Noriega", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 300000, ovr: 62, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es986", name: "Yeremay Hernández", nick: "Yeremay", number: 10, flag: "🇪🇸", age: 23, stamina: 100, value: 25000000, ovr: 76, pos: "EI", foot: "D", loan: null },
        { id: "es987", name: "David Mella", nick: "Mella", number: 11, flag: "🇪🇸", age: 21, stamina: 100, value: 5000000, ovr: 72, pos: "ED", foot: "Z", loan: null },
        { id: "es988", name: "Luismi Cruz", nick: "Luismi", number: 19, flag: "🇪🇸", age: 25, stamina: 100, value: 2000000, ovr: 69, pos: "ED", foot: "Z", loan: null },
        { id: "es989", name: "Pierre-Emerick Aubameyang", nick: "Aubameyang", number: 7, flag: "🇬🇦", age: 37, stamina: 100, value: 2500000, ovr: 81, pos: "DC", foot: "D", loan: null },
        { id: "es990", name: "Zakaria Eddahchouri", nick: "Eddahchouri", number: 9, flag: "🇳🇱", age: 26, stamina: 100, value: 2500000, ovr: 68, pos: "DC", foot: "D", loan: null },
        { id: "es991", name: "Bil Nsongo", nick: "Nsongo", number: 31, flag: "🇨🇲", age: 21, stamina: 100, value: 3000000, ovr: 48, pos: "DC", foot: "D", loan: null },
        { id: "es992", name: "Kevin Sánchez", nick: "K. Sánchez", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 400000, ovr: 57, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es993", name: "Diego Gómez", nick: "D. Gómez", number: "", flag: "🇪🇸", age: 22, stamina: 100, value: 957000, ovr: 55, pos: "ED", foot: "Z", loan: { isLoaned: true, parentTeam: "esp_depor", currentTeam: "Huesca" } }
      ]
    },
    {
      id: "esp_betis",
      name: "Real Betis",
      shortName: "BET",
      logo: "assets/logos/spain/betis.png",
      primaryColor: "#0E9E48",
      secondaryColor: "#FFFFFF",
      budget: 18000000,
      ovr: 84,
      formation: "4-2-3-1",
      style: "Ofensivo",
      stadium: "Benito Villamarín",
      stadiumCapacity: 60721,
      trophies: [
        { name: "Primera División", count: 1 },
        { name: "Copa del Rey", count: 3 },
        { name: "Segunda División", count: 7 },
        { name: "Segunda Federación", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es994", name: "Álvaro Valles", nick: "Valles", number: 1, flag: "🇪🇸", age: 29, stamina: 100, value: 7000000, ovr: 71, pos: "POR", foot: "D", loan: null },
        { id: "es995", name: "Diego Conde", nick: "Conde", number: "", flag: "🇪🇸", age: 27, stamina: 100, value: 3000000, ovr: 64, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "esp_villarreal", currentTeam: "esp_betis" } },
        // Defensas
        { id: "es996", name: "Natan", nick: "Natan", number: 4, flag: "🇧🇷", age: 25, stamina: 100, value: 25000000, ovr: 79, pos: "DFC", foot: "Z", loan: null },
        { id: "es997", name: "Marc Bartra", nick: "Bartra", number: 5, flag: "🇪🇸", age: 35, stamina: 100, value: 900000, ovr: 77, pos: "DFC", foot: "D", loan: null },
        { id: "es998", name: "Diego Llorente", nick: "Llorente", number: 3, flag: "🇪🇸", age: 32, stamina: 100, value: 2500000, ovr: 74, pos: "DFC", foot: "D", loan: null },
        { id: "es999", name: "Valentín Gómez", nick: "Gómez", number: 16, flag: "🇦🇷", age: 23, stamina: 100, value: 12000000, ovr: 72, pos: "DFC", foot: "Z", loan: null },
        { id: "es1000", name: "Junior Firpo", nick: "Firpo", number: 23, flag: "🇩🇴", age: 29, stamina: 100, value: 3500000, ovr: 72, pos: "LI", foot: "Z", loan: null },
        { id: "es1001", name: "Fran García", nick: "Fran", number: 11, flag: "🇪🇸", age: 26, stamina: 100, value: 10000000, ovr: 69, pos: "LI", foot: "Z", loan: null },
        { id: "es1002", name: "Ángel Ortiz", nick: "Ortiz", number: 40, flag: "🇪🇸", age: 22, stamina: 100, value: 4000000, ovr: 62, pos: "LD", foot: "D", loan: null },
        { id: "es1003", name: "Héctor Bellerín", nick: "Bellerín", number: 2, flag: "🇪🇸", age: 31, stamina: 100, value: 2400000, ovr: 67, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es1004", name: "Marc Roca", nick: "Roca", number: 21, flag: "🇪🇸", age: 29, stamina: 100, value: 4000000, ovr: 71, pos: "MCD", foot: "Z", loan: null },
        { id: "es1005", name: "Facundo Bernal", nick: "Bernal", number: 6, flag: "🇺🇾", age: 22, stamina: 100, value: 6000000, ovr: 65, pos: "MCD", foot: "D", loan: null },
        { id: "es1006", name: "Pablo Fornals", nick: "Fornals", number: 8, flag: "🇪🇸", age: 30, stamina: 100, value: 8000000, ovr: 79, pos: "MC", foot: "D", loan: null },
        { id: "es1007", name: "Álvaro Fidalgo", nick: "Fidalgo", number: 15, flag: "🇲🇽", age: 29, stamina: 100, value: 6000000, ovr: 79, pos: "MC", foot: "D", loan: null },
        { id: "es1008", name: "Nelson Deossa", nick: "Deossa", number: 18, flag: "🇨🇴", age: 26, stamina: 100, value: 9000000, ovr: 73, pos: "MC", foot: "Z", loan: null },
        { id: "es1009", name: "Isco", nick: "Isco", number: 22, flag: "🇪🇸", age: 34, stamina: 100, value: 3500000, ovr: 79, pos: "MCO", foot: "D", loan: null },
        { id: "es1010", name: "Giovani Lo Celso", nick: "Lo Celso", number: 20, flag: "🇦🇷", age: 30, stamina: 100, value: 8000000, ovr: 73, pos: "MCO", foot: "Z", loan: null },
        { id: "es1011", name: "Iker Losada", nick: "Losada", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 1800000, ovr: 60, pos: "MCO", foot: "D", loan: null },
        // Delanteros
        { id: "es1012", name: "Abde Ezzalzouli", nick: "Ez Abde", number: 10, flag: "🇲🇦", age: 24, stamina: 100, value: 40000000, ovr: 83, pos: "EI", foot: "D", loan: null },
        { id: "es1013", name: "Rodrigo Riquelme", nick: "Riquelme", number: 17, flag: "🇪🇸", age: 26, stamina: 100, value: 4000000, ovr: 66, pos: "EI", foot: "D", loan: null },
        { id: "es1014", name: "Antony", nick: "Antony", number: 7, flag: "🇧🇷", age: 26, stamina: 100, value: 40000000, ovr: 85, pos: "ED", foot: "Z", loan: null },
        { id: "es1015", name: "Pablo García", nick: "P. García", number: 52, flag: "🇪🇸", age: 20, stamina: 100, value: 8000000, ovr: 63, pos: "ED", foot: "Z", loan: null },
        { id: "es1016", name: "Aitor Ruibal", nick: "Ruibal", number: 24, flag: "🇪🇸", age: 30, stamina: 100, value: 4000000, ovr: 78, pos: "ED", foot: "D", loan: null },
        { id: "es1017", name: "Cucho Hernández", nick: "Cucho", number: 9, flag: "🇨🇴", age: 27, stamina: 100, value: 18000000, ovr: 80, pos: "DC", foot: "D", loan: null },
        { id: "es1018", name: "Gonzalo Petit", nick: "Petit", number: "", flag: "🇺🇾", age: 19, stamina: 100, value: 4000000, ovr: 58, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_sociedad",
      name: "Real Sociedad",
      shortName: "RSO",
      logo: "assets/logos/spain/sociedad.png",
      primaryColor: "#1B5FAF",
      secondaryColor: "#FFFFFF",
      budget: 30000000,
      ovr: 85,
      formation: "4-3-3",
      style: "Ofensivo",
      stadium: "Reale Arena",
      stadiumCapacity: 39500,
      trophies: [
        { name: "Primera División", count: 2 },
        { name: "Copa del Rey", count: 3 },
        { name: "Segunda División", count: 6 },
        { name: "Supercopa de España", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es1019", name: "Álex Remiro", nick: "Remiro", number: 1, flag: "🇪🇸", age: 31, stamina: 100, value: 9000000, ovr: 79, pos: "POR", foot: "D", loan: null },
        { id: "es1020", name: "Unai Marrero", nick: "Marrero", number: 13, flag: "🇪🇸", age: 24, stamina: 100, value: 1000000, ovr: 56, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es1021", name: "Jon Martín", nick: "J. Martín", number: 31, flag: "🇪🇸", age: 20, stamina: 100, value: 25000000, ovr: 68, pos: "DFC", foot: "D", loan: null },
        { id: "es1022", name: "Igor Zubeldia", nick: "Zubeldia", number: 5, flag: "🇪🇸", age: 29, stamina: 100, value: 6000000, ovr: 76, pos: "DFC", foot: "D", loan: null },
        { id: "es1023", name: "Jon Pacheco", nick: "Pacheco", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 5000000, ovr: 70, pos: "DFC", foot: "Z", loan: null },
        { id: "es1024", name: "Kazunari Kita", nick: "Kita", number: "", flag: "🇯🇵", age: 20, stamina: 100, value: 2000000, ovr: 49, pos: "DFC", foot: "Z", loan: null },
        { id: "es1025", name: "Sergio Gómez", nick: "S. Gómez", number: 17, flag: "🇪🇸", age: 25, stamina: 100, value: 15000000, ovr: 74, pos: "LI", foot: "Z", loan: null },
        { id: "es1026", name: "Javi López", nick: "J. López", number: "", flag: "🇪🇸", age: 24, stamina: 100, value: 5000000, ovr: 68, pos: "LI", foot: "Z", loan: null },
        { id: "es1027", name: "Aihen Muñoz", nick: "Aihen", number: 3, flag: "🇪🇸", age: 28, stamina: 100, value: 2500000, ovr: 70, pos: "LI", foot: "Z", loan: null },
        { id: "es1028", name: "Jon Aramburu", nick: "Aramburu", number: 2, flag: "🇻🇪", age: 24, stamina: 100, value: 15000000, ovr: 76, pos: "LD", foot: "D", loan: null },
        { id: "es1029", name: "Álvaro Odriozola", nick: "Odriozola", number: 20, flag: "🇪🇸", age: 30, stamina: 100, value: 800000, ovr: 52, pos: "LD", foot: "D", loan: null },
        { id: "es1030", name: "Iñaki Rupérez", nick: "Rupérez", number: "", flag: "🇪🇸", age: 23, stamina: 100, value: 200000, ovr: 64, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es1031", name: "Jon Gorrotxategi", nick: "Gorrotxategi", number: 4, flag: "🇪🇸", age: 24, stamina: 100, value: 25000000, ovr: 79, pos: "MCD", foot: "D", loan: null },
        { id: "es1032", name: "Beñat Turrientes", nick: "Turrientes", number: 8, flag: "🇪🇸", age: 24, stamina: 100, value: 10000000, ovr: 67, pos: "MC", foot: "D", loan: null },
        { id: "es1033", name: "Luka Sučić", nick: "Sučić", number: 24, flag: "🇭🇷", age: 23, stamina: 100, value: 10000000, ovr: 72, pos: "MC", foot: "Z", loan: null },
        { id: "es1034", name: "Carlos Soler", nick: "Soler", number: 18, flag: "🇪🇸", age: 29, stamina: 100, value: 7000000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "es1035", name: "Yangel Herrera", nick: "Herrera", number: 12, flag: "🇻🇪", age: 28, stamina: 100, value: 6000000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "es1036", name: "Arsen Zakharyan", nick: "Zakharyan", number: 21, flag: "🇷🇺", age: 23, stamina: 100, value: 9000000, ovr: 61, pos: "MCO", foot: "D", loan: null },
        { id: "es1037", name: "Pablo Marín", nick: "Marín", number: 15, flag: "🇪🇸", age: 23, stamina: 100, value: 7000000, ovr: 70, pos: "MCO", foot: "D", loan: null },
        { id: "es1038", name: "Mikel Goti", nick: "Goti", number: "", flag: "🇪🇸", age: 24, stamina: 100, value: 1000000, ovr: 65, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es1039", name: "Ander Barrenetxea", nick: "Barrenetxea", number: 7, flag: "🇪🇸", age: 24, stamina: 100, value: 18000000, ovr: 74, pos: "EI", foot: "D", loan: null },
        { id: "es1040", name: "Gonçalo Guedes", nick: "Guedes", number: 11, flag: "🇵🇹", age: 29, stamina: 100, value: 6000000, ovr: 72, pos: "EI", foot: "D", loan: null },
        { id: "es1041", name: "Takefusa Kubo", nick: "Kubo", number: 14, flag: "🇯🇵", age: 25, stamina: 100, value: 20000000, ovr: 83, pos: "ED", foot: "Z", loan: null },
        { id: "es1042", name: "Mikel Oyarzabal", nick: "Oyarzabal", number: 10, flag: "🇪🇸", age: 29, stamina: 100, value: 25000000, ovr: 86, pos: "DC", foot: "Z", loan: null },
        { id: "es1043", name: "Orri Óskarsson", nick: "Óskarsson", number: 9, flag: "🇮🇸", age: 21, stamina: 100, value: 20000000, ovr: 71, pos: "DC", foot: "D", loan: null },
        { id: "es1044", name: "Jon Karrikaburu", nick: "Karrikaburu", number: 19, flag: "🇪🇸", age: 23, stamina: 100, value: 1800000, ovr: 65, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_sevilla",
      name: "Sevilla FC",
      shortName: "SEV",
      logo: "assets/logos/spain/sevilla.png",
      primaryColor: "#E4002B",
      secondaryColor: "#FFFFFF",
      budget: 15000000,
      ovr: 82,
      formation: "4-2-3-1",
      style: "Equilibrado",
      stadium: "Ramón Sánchez-Pizjuán",
      stadiumCapacity: 43883,
      trophies: [
        { name: "Primera División", count: 1 },
        { name: "Europa League", count: 7 },
        { name: "Copa del Rey", count: 5 },
        { name: "Segunda División", count: 4 },
        { name: "Supercopa de España", count: 1 },
        { name: "Supercopa de Europa", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es1045", name: "Odysseas Vlachodimos", nick: "Vlachodimos", number: 1, flag: "🇬🇷", age: 32, stamina: 100, value: 3000000, ovr: 72, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "eng_newcastle", currentTeam: "esp_sevilla" } },
        { id: "es1046", name: "Fran González", nick: "F. González", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 3000000, ovr: 56, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es1047", name: "Kike Salas", nick: "Kike", number: 4, flag: "🇪🇸", age: 24, stamina: 100, value: 14000000, ovr: 72, pos: "DFC", foot: "Z", loan: null },
        { id: "es1048", name: "Arouna Sangante", nick: "Sangante", number: "", flag: "🇸🇳", age: 24, stamina: 100, value: 8000000, ovr: 70, pos: "DFC", foot: "D", loan: null },
        { id: "es1049", name: "Andrés Castrín", nick: "Castrín", number: 32, flag: "🇪🇸", age: 23, stamina: 100, value: 6000000, ovr: 61, pos: "DFC", foot: "D", loan: null },
        { id: "es1050", name: "Marcão", nick: "Marcão", number: 23, flag: "🇧🇷", age: 30, stamina: 100, value: 2500000, ovr: 62, pos: "DFC", foot: "Z", loan: null },
        { id: "es1051", name: "Fábio Cardoso", nick: "Cardoso", number: 15, flag: "🇵🇹", age: 32, stamina: 100, value: 1500000, ovr: 58, pos: "DFC", foot: "D", loan: null },
        { id: "es1052", name: "Federico Gattoni", nick: "Gattoni", number: 22, flag: "🇦🇷", age: 27, stamina: 100, value: 800000, ovr: 51, pos: "DFC", foot: "D", loan: null },
        { id: "es1053", name: "Oso", nick: "Oso", number: 36, flag: "🇪🇸", age: 23, stamina: 100, value: 10000000, ovr: 58, pos: "LI", foot: "Z", loan: null },
        { id: "es1054", name: "Gabriel Suazo", nick: "Suazo", number: 12, flag: "🇨🇱", age: 28, stamina: 100, value: 6000000, ovr: 76, pos: "LI", foot: "Z", loan: null },
        { id: "es1055", name: "Adrià Pedrosa", nick: "Pedrosa", number: "", flag: "🇪🇸", age: 28, stamina: 100, value: 2800000, ovr: 67, pos: "LI", foot: "Z", loan: null },
        { id: "es1056", name: "Julio Díaz", nick: "J. Díaz", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 1500000, ovr: 62, pos: "LI", foot: "Z", loan: null },
        { id: "es1057", name: "José Ángel Carmona", nick: "Carmona", number: 2, flag: "🇪🇸", age: 24, stamina: 100, value: 12000000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es1058", name: "Juanlu Sánchez", nick: "Juanlu", number: 16, flag: "🇪🇸", age: 22, stamina: 100, value: 10000000, ovr: 69, pos: "LD", foot: "D", loan: null },
        { id: "es1059", name: "Juan Iglesias", nick: "J. Iglesias", number: "", flag: "🇪🇸", age: 28, stamina: 100, value: 5000000, ovr: 74, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es1060", name: "Lucien Agoumé", nick: "Agoumé", number: 18, flag: "🇫🇷", age: 24, stamina: 100, value: 15000000, ovr: 71, pos: "MCD", foot: "D", loan: null },
        { id: "es1061", name: "Djibril Sow", nick: "Sow", number: 20, flag: "🇨🇭", age: 29, stamina: 100, value: 7500000, ovr: 76, pos: "MC", foot: "D", loan: null },
        { id: "es1062", name: "Jon Guridi", nick: "Guridi", number: "", flag: "🇪🇸", age: 31, stamina: 100, value: 1800000, ovr: 69, pos: "MC", foot: "Z", loan: null },
        { id: "es1063", name: "Manu Bueno", nick: "M. Bueno", number: 28, flag: "🇪🇸", age: 22, stamina: 100, value: 1500000, ovr: 57, pos: "MC", foot: "Z", loan: null },
        { id: "es1064", name: "Joan Jordán", nick: "Jordán", number: 8, flag: "🇪🇸", age: 32, stamina: 100, value: 1000000, ovr: 59, pos: "MC", foot: "D", loan: null },
        { id: "es1065", name: "Peque Fernández", nick: "Peque", number: 14, flag: "🇪🇸", age: 23, stamina: 100, value: 3000000, ovr: 62, pos: "MCO", foot: "D", loan: null },
        // Delanteros
        { id: "es1066", name: "Rubén Vargas", nick: "Vargas", number: 11, flag: "🇨🇭", age: 27, stamina: 100, value: 15000000, ovr: 74, pos: "EI", foot: "D", loan: null },
        { id: "es1067", name: "Chidera Ejuke", nick: "Ejuke", number: 21, flag: "🇳🇬", age: 28, stamina: 100, value: 4000000, ovr: 61, pos: "EI", foot: "D", loan: null },
        { id: "es1068", name: "Alfon González", nick: "Alfon", number: "", flag: "🇪🇸", age: 27, stamina: 100, value: 3000000, ovr: 66, pos: "EI", foot: "D", loan: null },
        { id: "es1069", name: "Isaac Romero", nick: "Romero", number: 7, flag: "🇪🇸", age: 26, stamina: 100, value: 5000000, ovr: 69, pos: "DC", foot: "Z", loan: null },
        { id: "es1070", name: "Rafa Mir", nick: "Mir", number: "", flag: "🇪🇸", age: 29, stamina: 100, value: 4000000, ovr: 73, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_valencia",
      name: "Valencia CF",
      shortName: "VAL",
      logo: "assets/logos/spain/valencia.png",
      primaryColor: "#191919",
      secondaryColor: "#FFFFFF",
      budget: 10000000,
      ovr: 81,
      formation: "4-2-3-1",
      style: "Equilibrado",
      stadium: "Mestalla",
      stadiumCapacity: 49430,
      trophies: [
        { name: "Primera División", count: 6 },
        { name: "Copa del Rey", count: 8 },
        { name: "Segunda División", count: 2 },
        { name: "Supercopa de Europa", count: 2 },
        { name: "Europa League", count: 1 },
        { name: "Supercopa de España", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es1071", name: "Stole Dimitrievski", nick: "Dimitrievski", number: 1, flag: "🇲🇰", age: 32, stamina: 100, value: 2000000, ovr: 71, pos: "POR", foot: "D", loan: null },
        { id: "es1072", name: "Cristian Rivero", nick: "Rivero", number: 13, flag: "🇪🇸", age: 28, stamina: 100, value: 100000, ovr: 44, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "es1073", name: "César Tárrega", nick: "Tárrega", number: 5, flag: "🇪🇸", age: 24, stamina: 100, value: 9000000, ovr: 74, pos: "DFC", foot: "D", loan: null },
        { id: "es1074", name: "Justin de Haas", nick: "De Haas", number: "", flag: "🇳🇱", age: 26, stamina: 100, value: 7000000, ovr: 71, pos: "DFC", foot: "Z", loan: null },
        { id: "es1075", name: "José Copete", nick: "Copete", number: 3, flag: "🇪🇸", age: 26, stamina: 100, value: 5000000, ovr: 67, pos: "DFC", foot: "Z", loan: null },
        { id: "es1076", name: "Mouctar Diakhaby", nick: "Diakhaby", number: "", flag: "🇬🇳", age: 29, stamina: 100, value: 1500000, ovr: 70, pos: "DFC", foot: "D", loan: null },
        { id: "es1077", name: "Iker Córdoba", nick: "Córdoba", number: "", flag: "🇪🇸", age: 20, stamina: 100, value: 500000, ovr: 53, pos: "DFC", foot: "Z", loan: null },
        { id: "es1078", name: "José Gayà", nick: "Gayà", number: 14, flag: "🇪🇸", age: 31, stamina: 100, value: 4000000, ovr: 72, pos: "LI", foot: "Z", loan: null },
        { id: "es1079", name: "Jesús Vázquez", nick: "Vázquez", number: 21, flag: "🇪🇸", age: 23, stamina: 100, value: 4000000, ovr: 62, pos: "LI", foot: "Z", loan: null },
        { id: "es1080", name: "Dimitri Foulquier", nick: "Foulquier", number: "", flag: "🇬🇵", age: 33, stamina: 100, value: 900000, ovr: 74, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es1081", name: "Pepelu", nick: "Pepelu", number: 18, flag: "🇪🇸", age: 27, stamina: 100, value: 8000000, ovr: 70, pos: "MCD", foot: "D", loan: null },
        { id: "es1082", name: "Guido Rodríguez", nick: "Guido", number: 2, flag: "🇦🇷", age: 32, stamina: 100, value: 4000000, ovr: 68, pos: "MCD", foot: "D", loan: null },
        { id: "es1083", name: "Aliou Dieng", nick: "Dieng", number: "", flag: "🇲🇱", age: 28, stamina: 100, value: 3000000, ovr: 71, pos: "MCD", foot: "D", loan: null },
        { id: "es1084", name: "Javi Guerra", nick: "Guerra", number: 8, flag: "🇪🇸", age: 23, stamina: 100, value: 25000000, ovr: 76, pos: "MC", foot: "D", loan: null },
        { id: "es1085", name: "Filip Ugrinić", nick: "Ugrinić", number: 23, flag: "🇨🇭", age: 27, stamina: 100, value: 6000000, ovr: 73, pos: "MC", foot: "D", loan: null },
        { id: "es1086", name: "André Almeida", nick: "Almeida", number: 10, flag: "🇵🇹", age: 26, stamina: 100, value: 6000000, ovr: 67, pos: "MCO", foot: "D", loan: null },
        { id: "es1087", name: "Dani Raba", nick: "Raba", number: 19, flag: "🇪🇸", age: 30, stamina: 100, value: 1200000, ovr: 66, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "es1088", name: "Arnaut Danjuma", nick: "Danjuma", number: 7, flag: "🇳🇱", age: 29, stamina: 100, value: 3000000, ovr: 67, pos: "EI", foot: "D", loan: null },
        { id: "es1089", name: "Ryunosuke Sato", nick: "Sato", number: "", flag: "🇯🇵", age: 19, stamina: 100, value: 2000000, ovr: 63, pos: "EI", foot: "D", loan: null },
        { id: "es1090", name: "Sergi Canós", nick: "Canós", number: "", flag: "🇪🇸", age: 29, stamina: 100, value: 600000, ovr: 59, pos: "EI", foot: "D", loan: null },
        { id: "es1091", name: "Diego López", nick: "Diego", number: 16, flag: "🇪🇸", age: 24, stamina: 100, value: 9000000, ovr: 81, pos: "ED", foot: "D", loan: null },
        { id: "es1092", name: "Luis Rioja", nick: "Rioja", number: 11, flag: "🇪🇸", age: 32, stamina: 100, value: 1800000, ovr: 74, pos: "ED", foot: "Z", loan: null },
        { id: "es1093", name: "Hugo Duro", nick: "Duro", number: 9, flag: "🇪🇸", age: 26, stamina: 100, value: 12000000, ovr: 73, pos: "DC", foot: "Z", loan: null },
        { id: "es1094", name: "Umar Sadiq", nick: "Sadiq", number: 6, flag: "🇳🇬", age: 29, stamina: 100, value: 4000000, ovr: 66, pos: "DC", foot: "D", loan: null },
        { id: "es1095", name: "Alberto Marí", nick: "Marí", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 600000, ovr: 52, pos: "DC", foot: "D", loan: null }
      ]
    },
    {
      id: "esp_villarreal",
      name: "Villarreal CF",
      shortName: "VIL",
      logo: "assets/logos/spain/villarreal.png",
      primaryColor: "#F9C31C",
      secondaryColor: "#1A4E8A",
      budget: 25000000,
      ovr: 85,
      formation: "4-4-2",
      style: "Ofensivo",
      stadium: "Estadio de la Cerámica",
      stadiumCapacity: 23500,
      trophies: [
        { name: "Europa League", count: 1 },
        { name: "Segunda Federación", count: 1 }
      ],
      players: [
        // Porteros
        { id: "es1096", name: "Péter Gulácsi", nick: "Gulácsi", number: "", flag: "🇭🇺", age: 36, stamina: 100, value: 1000000, ovr: 81, pos: "POR", foot: "D", loan: null },
        { id: "es1097", name: "Luiz Júnior", nick: "Luiz Júnior", number: 1, flag: "🇧🇷", age: 25, stamina: 100, value: 12000000, ovr: 72, pos: "POR", foot: "Z", loan: null },
        // Defensas
        { id: "es1098", name: "Renato Veiga", nick: "Veiga", number: 12, flag: "🇵🇹", age: 23, stamina: 100, value: 30000000, ovr: 73, pos: "DFC", foot: "Z", loan: null },
        { id: "es1099", name: "Logan Costa", nick: "Costa", number: 2, flag: "🇨🇻", age: 25, stamina: 100, value: 15000000, ovr: 69, pos: "DFC", foot: "D", loan: null },
        { id: "es1100", name: "Pau Navarro", nick: "Navarro", number: 6, flag: "🇪🇸", age: 21, stamina: 100, value: 15000000, ovr: 63, pos: "DFC", foot: "D", loan: null },
        { id: "es1101", name: "Juan Foyth", nick: "Foyth", number: 8, flag: "🇦🇷", age: 28, stamina: 100, value: 8000000, ovr: 80, pos: "DFC", foot: "D", loan: null },
        { id: "es1102", name: "Willy Kambwala", nick: "Kambwala", number: 5, flag: "🇫🇷", age: 21, stamina: 100, value: 3000000, ovr: 56, pos: "DFC", foot: "D", loan: null },
        { id: "es1103", name: "Carlos Romero", nick: "C. Romero", number: "", flag: "🇪🇸", age: 24, stamina: 100, value: 25000000, ovr: 75, pos: "LI", foot: "Z", loan: null },
        { id: "es1104", name: "Sergi Cardona", nick: "Cardona", number: 23, flag: "🇪🇸", age: 27, stamina: 100, value: 9000000, ovr: 74, pos: "LI", foot: "A", loan: null },
        { id: "es1105", name: "Santiago Mouriño", nick: "Mouriño", number: 15, flag: "🇺🇾", age: 24, stamina: 100, value: 20000000, ovr: 71, pos: "LD", foot: "D", loan: null },
        { id: "es1106", name: "Alex Freeman", nick: "Freeman", number: 3, flag: "🇺🇸", age: 21, stamina: 100, value: 10000000, ovr: 73, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "es1107", name: "Pape Gueye", nick: "Gueye", number: 18, flag: "🇸🇳", age: 27, stamina: 100, value: 40000000, ovr: 74, pos: "MC", foot: "Z", loan: null },
        { id: "es1108", name: "Santi Comesaña", nick: "Comesaña", number: 14, flag: "🇪🇸", age: 29, stamina: 100, value: 8000000, ovr: 76, pos: "MC", foot: "A", loan: null },
        { id: "es1109", name: "Carlos Macià", nick: "Macià", number: 37, flag: "🇪🇸", age: 17, stamina: 100, value: 3000000, ovr: 51, pos: "MC", foot: "D", loan: null },
        // Delanteros
        { id: "es1110", name: "Alberto Moleiro", nick: "Moleiro", number: 20, flag: "🇪🇸", age: 22, stamina: 100, value: 50000000, ovr: 75, pos: "EI", foot: "D", loan: null },
        { id: "es1111", name: "Thiago Fernández", nick: "Thiago", number: "", flag: "🇦🇷", age: 22, stamina: 100, value: 4500000, ovr: 61, pos: "EI", foot: "D", loan: null },
        { id: "es1112", name: "Ilias Akhomach", nick: "Akhomach", number: "", flag: "🇲🇦", age: 22, stamina: 100, value: 12000000, ovr: 61, pos: "ED", foot: "Z", loan: null },
        { id: "es1113", name: "Tajon Buchanan", nick: "Buchanan", number: 17, flag: "🇨🇦", age: 27, stamina: 100, value: 12000000, ovr: 72, pos: "ED", foot: "D", loan: null },
        { id: "es1114", name: "Nicolas Pépé", nick: "Pépé", number: 19, flag: "🇨🇮", age: 31, stamina: 100, value: 6000000, ovr: 74, pos: "ED", foot: "Z", loan: null },
        { id: "es1115", name: "Georges Mikautadze", nick: "Mikautadze", number: 9, flag: "🇬🇪", age: 25, stamina: 100, value: 30000000, ovr: 77, pos: "DC", foot: "D", loan: null },
        { id: "es1116", name: "Tani Oluwaseyi", nick: "Oluwaseyi", number: 21, flag: "🇨🇦", age: 26, stamina: 100, value: 7000000, ovr: 72, pos: "DC", foot: "Z", loan: null },
        { id: "es1117", name: "Ayoze Pérez", nick: "Ayoze", number: 22, flag: "🇪🇸", age: 33, stamina: 100, value: 5000000, ovr: 74, pos: "DC", foot: "D", loan: null },
        { id: "es1118", name: "Gerard Moreno", nick: "Gerard", number: 7, flag: "🇪🇸", age: 34, stamina: 100, value: 2500000, ovr: 72, pos: "DC", foot: "Z", loan: null },
        { id: "es1119", name: "Hugo López", nick: "H. López", number: 32, flag: "🇪🇸", age: 19, stamina: 100, value: 1000000, ovr: 51, pos: "DC", foot: "D", loan: null },
        { id: "es1120", name: "Álex Forés", nick: "Forés", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 700000, ovr: 57, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "es1121", name: "Arnau Tenas", nick: "Tenas", number: "", flag: "🇪🇸", age: 25, stamina: 100, value: 2720000, ovr: 53, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "esp_villarreal", currentTeam: "Mallorca" } }
      ]
    }
  ]
};