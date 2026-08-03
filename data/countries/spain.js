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
      budget: 85000000,
      ovr: 86,
      formation: "4-3-3",
      style: "Ofensivo",
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
      budget: 60000000,
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
      budget: 50000000,
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
    }
  ]
};