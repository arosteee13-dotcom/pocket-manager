window.PocketManager = window.PocketManager || {};
window.PocketManager.englandData = {
  country: "Inglaterra",
  leagueName: "Premier League",
  maxSubs: 12,
  teams: [
    {
      id: "eng_mancity",
      name: "Manchester City",
      shortName: "MCI",
      logo: "assets/logos/england/mancity.png",
      primaryColor: "#A8C9E7",
      secondaryColor: "#FEFFFE",
      budget: 95000000,
      ovr: 87,
      formation: "4-1-4-1",
      style: "Ofensivo",
      stadium: "Etihad Stadium",
      stadiumCapacity: 55017,
      trophies: [
        { name: "Mundial de Clubes", count: 1 },
        { name: "Champions League", count: 1 },
        { name: "Supercopa de Europa", count: 1 },
        { name: "Premier League", count: 10 },
        { name: "Championship", count: 7 },
        { name: "Community Shield", count: 7 },        
        { name: "FA Cup", count: 8 },
        { name: "EFL Cup", count: 9 }
      ],
      players: [
        // Porteros
        { id: "es101", name: "Gianluigi Donnarumma", nick: "Donnarumma", number: 25, flag: "🇮🇹", age: 27, stamina: 100, value: 59400000, ovr: 83, pos: "POR", foot: "D", loan: null },
        { id: "es102", name: "James Trafford", nick: "Trafford", number: 1, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 23, stamina: 100, value: 20650000, ovr: 73, pos: "POR", foot: "D", loan: null },
        { id: "es103", name: "Marcus Bettinelli", nick: "Bettinelli", number: 13, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 34, stamina: 100, value: 204000, ovr: 30, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "en116", name: "Marc Guéhi", nick: "Guéhi", number: 15, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 26, stamina: 100, value: 60690000, ovr: 87, pos: "DFC", foot: "D", loan: null },
        { id: "en103", name: "Rúben Dias", nick: "Rúben Dias", number: 3, flag: "🇵🇹", age: 29, stamina: 100, value: 66200000, ovr: 81, pos: "DFC", foot: "D", loan: null },
        { id: "en117", name: "Matheus Nunes", nick: "Nunes", number: 27, flag: "🇵🇹", age: 27, stamina: 100, value: 32490000, ovr: 76, pos: "LD", foot: "D", loan: null },
        { id: "en105", name: "Josko Gvardiol", nick: "Gvardiol", number: 24, flag: "🇭🇷", age: 24, stamina: 100, value: 88630000, ovr: 83, pos: "DFC", foot: "Z", loan: null },
        { id: "en118", name: "A. Khusanov", nick: "Khusanov", number: 45, flag: "🇺🇿", age: 22, stamina: 100, value: 30300000, ovr: 72, pos: "DFC", foot: "D", loan: null },
        { id: "en119", name: "R. Aït-Nouri", nick: "Aït-Nouri", number: 21, flag: "🇩🇿", age: 25, stamina: 100, value: 32050000, ovr: 75, pos: "LI", foot: "Z", loan: null },
        { id: "en120", name: "Vitor Reis", nick: "Reis", number: 14, flag: "🇧🇷", age: 20, stamina: 100, value: 21040000, ovr: 65, pos: "DFC", foot: "D", loan: null },
        { id: "en121", name: "Nico O'Reilly", nick: "O'Reilly", number: 28, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 21, stamina: 100, value: 31670000, ovr: 73, pos: "LI", foot: "Z", loan: null },
        { id: "en122", name: "Rico Lewis", nick: "Lewis", number: 82, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 21, stamina: 100, value: 30350000, ovr: 69, pos: "LD", foot: "D", loan: null },
        { id: "en123", name: "Issa Kaboré", nick: "Kaboré", number: "", flag: "🇧🇫", age: 25, stamina: 100, value: 4860000, ovr: 68, pos: "LD", foot: "D", loan: null },
        { id: "en124", name: "Juma Bah", nick: "Bah", number: "", flag: "🇸🇱", age: 20, stamina: 100, value: 6120000, ovr: 64, pos: "DFC", foot: "D", loan: null },
        { id: "en125", name: "Max Alleyne", nick: "Alleyne", number: 68, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 21, stamina: 100, value: 1100000, ovr: 61, pos: "DFC", foot: "A", loan: null },
         { id: "en126", name: "J. Wilson-Esbrand", nick: "Wilson-Esbrand", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 23, stamina: 100, value: 2680000, ovr: 56, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "en127", name: "Rayan Cherki", nick: "Cherki", number: 7, flag: "🇫🇷", age: 22, stamina: 100, value: 66520000, ovr: 78, pos: "MCO", foot: "Z", loan: null },
        { id: "en128", name: "Elliot Anderson", nick: "Anderson", number: 15, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 23, stamina: 100, value: 66050000, ovr: 80, pos: "MC", foot: "D", loan: null },
        { id: "en106", name: "Rodri Hernández", nick: "Rodri", number: 16, flag: "🇪🇸", age: 30, stamina: 100, value: 50580000, ovr: 79, pos: "MCD", foot: "D", loan: null },
        { id: "en129", name: "Jack Grealish", nick: "Grealish", number: 10, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 30, stamina: 100, value: 22450000, ovr: 79, pos: "MI", foot: "D", loan: null },
        { id: "en130", name: "T. Reijnders", nick: "Reijnders", number: 22, flag: "🇳🇱", age: 28, stamina: 100, value: 71190000, ovr: 82, pos: "MC", foot: "D", loan: null },
        { id: "en109", name: "Phil Foden", nick: "Foden", number: 47, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 26, stamina: 100, value: 79000000, ovr: 79, pos: "MCO", foot: "Z", loan: null },
        { id: "en131", name: "Nico González", nick: "Nico González", number: 23, flag: "🇪🇸", age: 24, stamina: 100, value: 43250000, ovr: 73, pos: "MCD", foot: "D", loan: null },
        { id: "en114", name: "Mateo Kovačić", nick: "Kovačić", number: 8, flag: "🇭🇷", age: 32, stamina: 100, value: 19800000, ovr: 74, pos: "MC", foot: "D", loan: null },
        { id: "en132", name: "C. Echeverri", nick: "Echeverri", number: "", flag: "🇦🇷", age: 20, stamina: 100, value: 18130000, ovr: 62, pos: "MCO", foot: "D", loan: null },
        { id: "en133", name: "Kalvin Phillips", nick: "Phillips", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 30, stamina: 100, value: 3880000, ovr: 58, pos: "MCD", foot: "D", loan: null },
        // Delanteros
        { id: "en110", name: "Erling Haaland", nick: "Haaland", number: 9, flag: "🇳🇴", age: 26, stamina: 100, value: 234580000, ovr: 91, pos: "DC", foot: "Z", loan: null },
        { id: "en111", name: "Jérémy Doku", nick: "Doku", number: 11, flag: "🇧🇪", age: 24, stamina: 100, value: 72750000, ovr: 76, pos: "EI", foot: "D", loan: null },
        { id: "en134", name: "O. Marmoush", nick: "Marmoush", number: 7, flag: "🇪🇬", age: 27, stamina: 100, value: 61350000, ovr: 79, pos: "DC", foot: "D", loan: null },
        { id: "en135", name: "Antoine Semenyo", nick: "Semenyo", number: 42, flag: "🇬🇭", age: 26, stamina: 100, value: 66720000, ovr: 84, pos: "ED", foot: "D", loan: null },
        { id: "en115", name: "Savinho Moreira", nick: "Savinho", number: 26, flag: "🇧🇷", age: 22, stamina: 100, value: 51880000, ovr: 72, pos: "EI", foot: "Z", loan: null },
        { id: "en136", name: "Jeremy Monga", nick: "Monga", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 17, stamina: 100, value: 11320000, ovr: 51, pos: "EI", foot: "D", loan: null },
        // Cedidos fuera
        { id: "en137", name: "Pierce Charles", nick: "Charles", number: "", flag: "🏴󠁧󠁢󠁮󠁩󠁲", age: 21, stamina: 100, value: 1420000, ovr: 59, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "eng_mancity", currentTeam: "Queens Park Rangers" } },
        { id: "en138", name: "Sverre Nypan", nick: "Nypan", number: "", flag: "🇳🇴", age: 19, stamina: 100, value: 13340000, ovr: 64, pos: "MC", foot: "A", loan: { isLoaned: true, parentTeam: "eng_mancity", currentTeam: "Lommel SK" } },
        { id: "en139", name: "Mathys Detourbet", nick: "Detourbet", number: "", flag: "🇫🇷", age: 19, stamina: 100, value: 11940000, ovr: 57, pos: "EI", foot: "D", loan: { isLoaned: true, parentTeam: "eng_mancity", currentTeam: "AS Monaco" } }
      ]
    },
    {
      id: "eng_arsenal",
      name: "Arsenal FC",
      shortName: "ARS",
      logo: "assets/logos/england/arsenal.png",
      primaryColor: "#E02E36",
      secondaryColor: "#FFFFFF",
      budget: 75000000,
      ovr: 85,
      formation: "4-3-3",
      style: "Equilibrado",
      stadium: "Emirates Stadium",
      stadiumCapacity: 60355,
      trophies: [
        { name: "Premier League", count: 14 },
        { name: "Community Shield", count: 16 },        
        { name: "FA Cup", count: 14 },
        { name: "EFL Cup", count: 2 }
      ],
      players: [
        // Porteros
        { id: "en201", name: "David Raya", nick: "Raya", number: 1, flag: "🇪🇸", age: 30, stamina: 100, value: 31190000, ovr: 86, pos: "POR", foot: "D", loan: null },
        { id: "en216", name: "Kepa", nick: "Kepa", number: 13, flag: "🇪🇸", age: 31, stamina: 100, value: 7050000, ovr: 73, pos: "POR", foot: "D", loan: null },
        { id: "en217", name: "Tommy Setford", nick: "Setford", number: 35, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 20, stamina: 100, value: 84000, ovr: 48, pos: "POR", foot: "D", loan: null },
        { id: "en228", name: "Illan Meslier", nick: "Meslier", number: "", flag: "🇫🇷", age: 26, stamina: 100, value: 7520000, ovr: 72, pos: "POR", foot: "Z", loan: null },
        // Defensas
        { id: "en203", name: "William Saliba", nick: "Saliba", number: 2, flag: "🇫🇷", age: 25, stamina: 100, value: 103700000, ovr: 89, pos: "DFC", foot: "D", loan: null },
        { id: "en204", name: "Gabriel Magalhães", nick: "Magalhães", number: 6, flag: "🇧🇷", age: 28, stamina: 100, value: 69810000, ovr: 87, pos: "DFC", foot: "Z", loan: null },
        { id: "en205", name: "Jurriën Timber", nick: "Timber", number: 12, flag: "🇳🇱", age: 25, stamina: 100, value: 64920000, ovr: 88, pos: "LD", foot: "D", loan: null },
        { id: "en218", name: "Piero Hincapié", nick: "Hincapié", number: 5, flag: "🇪🇨", age: 24, stamina: 100, value: 76100000, ovr: 86, pos: "DFC", foot: "Z", loan: null },
        { id: "en202", name: "Ben White", nick: "White", number: 4, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 28, stamina: 100, value: 26070000, ovr: 77, pos: "LD", foot: "D", loan: null },
        { id: "en213", name: "Riccardo Calafiori", nick: "Calafiori", number: 33, flag: "🇮🇹", age: 24, stamina: 100, value: 44300000, ovr: 77, pos: "LI", foot: "Z", loan: null },
        { id: "en219", name: "Cristhian Mosquera", nick: "Mosquera", number: 3, flag: "🇪🇸", age: 22, stamina: 100, value: 34240000, ovr: 76, pos: "DFC", foot: "D", loan: null },
        { id: "en220", name: "Lewis-Skelly", nick: "Lewis-Skelly", number: 49, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 19, stamina: 100, value: 31040000, ovr: 75, pos: "LI", foot: "Z", loan: null },
        // Centrocampistas
        { id: "en206", name: "Declan Rice", nick: "Rice", number: 41, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 27, stamina: 100, value: 138490000, ovr: 88, pos: "MC", foot: "D", loan: null },
        { id: "en221", name: "E. Eze", nick: "Eze", number: 10, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 28, stamina: 100, value: 56870000, ovr: 83, pos: "MCO", foot: "D", loan: null },
        { id: "en222", name: "M. Zubimendi", nick: "Zubimendi", number: 36, flag: "🇪🇸", age: 27, stamina: 100, value: 89050000, ovr: 84, pos: "MCD", foot: "D", loan: null },
        { id: "en208", name: "Mikel Merino", nick: "Merino", number: 23, flag: "🇪🇸", age: 30, stamina: 100, value: 55740000, ovr: 84, pos: "MC", foot: "Z", loan: null },
        { id: "en207", name: "Martin Ødegaard", nick: "Ødegaard", number: 8, flag: "🇳🇴", age: 27, stamina: 100, value: 78530000, ovr: 86, pos: "MCO", foot: "Z", loan: null },
        { id: "en223", name: "C. Nørgaard", nick: "Nørgaard", number: 16, flag: "🇩🇰", age: 32, stamina: 100, value: 11090000, ovr: 74, pos: "MCD", foot: "D", loan: null },
        { id: "en229", name: "Fábio Vieira", nick: "Vieira", number: "", flag: "🇵🇹", age: 26, stamina: 100, value: 19010000, ovr: 77, pos: "MCO", foot: "Z", loan: null },
        { id: "en230", name: "Ethan Nwaneri", nick: "Nwaneri", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 19, stamina: 100, value: 40850000, ovr: 66, pos: "MCO", foot: "Z", loan: null },
        // Delanteros
        { id: "en209", name: "Bukayo Saka", nick: "Saka", number: 7, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 24, stamina: 100, value: 152460000, ovr: 87, pos: "ED", foot: "Z", loan: null },
        { id: "en224", name: "V. Gyökeres", nick: "Gyökeres", number: 14, flag: "🇸🇪", age: 28, stamina: 100, value: 89050000, ovr: 90, pos: "DC", foot: "D", loan: null },
        { id: "en210", name: "Kai Havertz", nick: "Havertz", number: 29, flag: "🇩🇪", age: 27, stamina: 100, value: 67020000, ovr: 87, pos: "DC", foot: "Z", loan: null },
        { id: "en211", name: "Gabriel Martinelli", nick: "Martinelli", number: 11, flag: "🇧🇷", age: 25, stamina: 100, value: 60000000, ovr: 80, pos: "EI", foot: "D", loan: null },
        { id: "en215", name: "L. Trossard", nick: "Trossard", number: 19, flag: "🇧🇪", age: 30, stamina: 100, value: 30000000, ovr: 82, pos: "EI", foot: "D", loan: null },
        { id: "en225", name: "Noni Madueke", nick: "Madueke", number: 20, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 24, stamina: 100, value: 56470000, ovr: 76, pos: "ED", foot: "Z", loan: null },
        { id: "en226", name: "Gabriel Jesus", nick: "Jesus", number: 9, flag: "🇧🇷", age: 29, stamina: 100, value: 24350000, ovr: 74, pos: "DC", foot: "D", loan: null },
        { id: "en227", name: "M. Dowman", nick: "Dowman", number: 56, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 16, stamina: 100, value: 112000, ovr: 55, pos: "ED", foot: "Z", loan: null },
        { id: "en231", name: "C. Tzolis", nick: "Tzolis", number: "", flag: "🇬🇷", age: 24, stamina: 100, value: 61880000, ovr: 84, pos: "EI", foot: "D", loan: null },
        { id: "en232", name: "Reiss Nelson", nick: "Nelson", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 26, stamina: 100, value: 10860000, ovr: 57, pos: "EI", foot: "D", loan: null }
      ]
    },
    {
      id: "eng_bournemouth",
      name: "AFC Bournemouth",
      shortName: "BOU",
      logo: "assets/logos/england/bournemouth.png",
      primaryColor: "#DA291C",
      secondaryColor: "#000000",
      budget: 40000000,
      ovr: 82,
      formation: "4-2-3-1",
      style: "Ofensivo",
      stadium: "Vitality Stadium",
      stadiumCapacity: 11464,
      trophies: [
        { name: "Championship", count: 1 }
      ],
      players: [
        // Porteros
        { id: "en233", name: "Djordje Petrovic", nick: "Petrovic", number: 1, flag: "🇷🇸", age: 26, stamina: 100, value: 28000000, ovr: 79, pos: "POR", foot: "D", loan: null },
        { id: "en234", name: "Fraser Forster", nick: "Forster", number: 17, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 38, stamina: 100, value: 400000, ovr: 54, pos: "POR", foot: "D", loan: null },
        { id: "en235", name: "Will Dennis", nick: "Dennis", number: 40, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 26, stamina: 100, value: 325000, ovr: 52, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "en236", name: "António Silva", nick: "António Silva", number: 14, flag: "🇵🇹", age: 22, stamina: 100, value: 25000000, ovr: 76, pos: "DFC", foot: "D", loan: null },
        { id: "en237", name: "Bafodé Diakité", nick: "Diakité", number: 18, flag: "🇫🇷", age: 25, stamina: 100, value: 25000000, ovr: 77, pos: "DFC", foot: "D", loan: null },
        { id: "en238", name: "James Hill", nick: "Hill", number: 23, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 24, stamina: 100, value: 23000000, ovr: 62, pos: "DFC", foot: "D", loan: null },
        { id: "en239", name: "Veljko Milosavljević", nick: "Milosavljević", number: 44, flag: "🇷🇸", age: 19, stamina: 100, value: 20000000, ovr: 65, pos: "DFC", foot: "D", loan: null },
        { id: "en240", name: "Matai Akinmboni", nick: "Akinmboni", number: 45, flag: "🇺🇸", age: 19, stamina: 100, value: 1000000, ovr: 45, pos: "DFC", foot: "Z", loan: null },
        { id: "en241", name: "Adrien Truffert", nick: "Truffert", number: 3, flag: "🇫🇷", age: 24, stamina: 100, value: 30000000, ovr: 77, pos: "LI", foot: "Z", loan: null },
        { id: "en242", name: "Julio Soler", nick: "Soler", number: 6, flag: "🇦🇷", age: 21, stamina: 100, value: 8000000, ovr: 66, pos: "LI", foot: "Z", loan: null },
        { id: "en243", name: "Julián Araujo", nick: "Araujo", number: 2, flag: "🇲🇽", age: 24, stamina: 100, value: 8000000, ovr: 60, pos: "LD", foot: "D", loan: null },
        { id: "en244", name: "Max Aarons", nick: "Aarons", number: "", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 26, stamina: 100, value: 2500000, ovr: 63, pos: "LD", foot: "D", loan: null },
        { id: "en245", name: "Adam Smith", nick: "Smith", number: 15, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 35, stamina: 100, value: 300000, ovr: 70, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "en246", name: "Tyler Adams", nick: "Adams", number: 12, flag: "🇺🇸", age: 27, stamina: 100, value: 25000000, ovr: 73, pos: "MCD", foot: "D", loan: null },
        { id: "en247", name: "Ben Winterburn", nick: "Winterburn", number: 47, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 21, stamina: 100, value: 350000, ovr: 39, pos: "MCD", foot: "D", loan: null },
        { id: "en248", name: "Alex Scott", nick: "Scott", number: 8, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 22, stamina: 100, value: 50000000, ovr: 72, pos: "MC", foot: "D", loan: null },
        { id: "en249", name: "Alex Tóth", nick: "Tóth", number: 27, flag: "🇭🇺", age: 20, stamina: 100, value: 12000000, ovr: 71, pos: "MC", foot: "D", loan: null },
        { id: "en250", name: "Lewis Cook", nick: "Cook", number: 4, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 29, stamina: 100, value: 11000000, ovr: 72, pos: "MC", foot: "D", loan: null },
        { id: "en251", name: "Ryan Christie", nick: "Christie", number: 10, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", age: 31, stamina: 100, value: 8000000, ovr: 78, pos: "MC", foot: "Z", loan: null },
        { id: "en252", name: "Marcus Tavernier", nick: "Tavernier", number: 16, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 27, stamina: 100, value: 25000000, ovr: 75, pos: "MCO", foot: "Z", loan: null },
        { id: "en253", name: "Justin Kluivert", nick: "Kluivert", number: 19, flag: "🇳🇱", age: 27, stamina: 100, value: 25000000, ovr: 75, pos: "MCO", foot: "A", loan: null },
        // Delanteros
        { id: "en254", name: "Amine Adli", nick: "Adli", number: 21, flag: "🇲🇦", age: 26, stamina: 100, value: 20000000, ovr: 70, pos: "EI", foot: "Z", loan: null },
        { id: "en255", name: "Rayan", nick: "Rayan", number: 37, flag: "🇧🇷", age: 20, stamina: 100, value: 60000000, ovr: 76, pos: "ED", foot: "Z", loan: null },
        { id: "en256", name: "Ben Doak", nick: "Doak", number: 11, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", age: 20, stamina: 100, value: 15000000, ovr: 64, pos: "ED", foot: "D", loan: null },
        { id: "en257", name: "David Brooks", nick: "Brooks", number: 7, flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", age: 29, stamina: 100, value: 12000000, ovr: 67, pos: "ED", foot: "Z", loan: null },
        { id: "en258", name: "Junior Kroupi", nick: "Kroupi", number: 22, flag: "🇫🇷", age: 20, stamina: 100, value: 70000000, ovr: 80, pos: "DC", foot: "D", loan: null },
        { id: "en259", name: "Evanilson", nick: "Evanilson", number: 9, flag: "🇧🇷", age: 26, stamina: 100, value: 35000000, ovr: 79, pos: "DC", foot: "A", loan: null },
        { id: "en260", name: "Álvaro Rodríguez", nick: "Álvaro", number: 30, flag: "🇺🇾", age: 22, stamina: 100, value: 10000000, ovr: 69, pos: "DC", foot: "Z", loan: null },
        { id: "en261", name: "Enes Ünal", nick: "Ünal", number: 26, flag: "🇹🇷", age: 29, stamina: 100, value: 7000000, ovr: 59, pos: "DC", foot: "D", loan: null },
        { id: "en262", name: "Daniel Jebbison", nick: "Jebbison", number: "", flag: "🇨🇦", age: 22, stamina: 100, value: 6000000, ovr: 58, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "en263", name: "Alex Paulsen", nick: "Paulsen", number: "", flag: "🇳🇿", age: 24, stamina: 100, value: 2500000, ovr: 65, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "eng_bournemouth", currentTeam: "Motherwell" } },
        { id: "en264", name: "Álex Jiménez", nick: "Jiménez", number: "", flag: "🇪🇸", age: 21, stamina: 100, value: 20090000, ovr: 71, pos: "LD", foot: "D", loan: { isLoaned: true, parentTeam: "eng_bournemouth", currentTeam: "Fiorentina" } }
      ]
    },
    {
      id: "eng_astonvilla",
      name: "Aston Villa",
      shortName: "AVL",
      logo: "assets/logos/england/astonvilla.png",
      primaryColor: "#670E36",
      secondaryColor: "#95BFE5",
      budget: 50000000,
      ovr: 86,
      formation: "4-4-2",
      style: "Ofensivo",
      stadium: "Villa Park",
      stadiumCapacity: 42918,
      trophies: [
        { name: "Champions League", count: 1 },
        { name: "Premier League", count: 7 },
        { name: "Supercopa de Europa", count: 1 },
        { name: "Europa League", count: 1 },
        { name: "FA Cup", count: 7 },
        { name: "Championship", count: 2 },
        { name: "EFL Cup", count: 5 }
      ],
      players: [
        // Porteros
        { id: "en265", name: "Emiliano Martínez", nick: "Dibu", number: 23, flag: "🇦🇷", age: 33, stamina: 100, value: 12000000, ovr: 87, pos: "POR", foot: "D", loan: null },
        { id: "en266", name: "Marco Bizot", nick: "Bizot", number: 40, flag: "🇳🇱", age: 35, stamina: 100, value: 1500000, ovr: 73, pos: "POR", foot: "D", loan: null },
        // Defensas
        { id: "en267", name: "Ezri Konsa", nick: "Konsa", number: 4, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 28, stamina: 100, value: 45000000, ovr: 85, pos: "DFC", foot: "D", loan: null },
        { id: "en268", name: "Pau Torres", nick: "Pau Torres", number: 14, flag: "🇪🇸", age: 29, stamina: 100, value: 20000000, ovr: 81, pos: "DFC", foot: "Z", loan: null },
        { id: "en269", name: "Modou Kéba Cissé", nick: "Cissé", number: 48, flag: "🇸🇳", age: 21, stamina: 100, value: 6000000, ovr: 60, pos: "DFC", foot: "D", loan: null },
        { id: "en270", name: "Victor Lindelöf", nick: "Lindelöf", number: 3, flag: "🇸🇪", age: 32, stamina: 100, value: 5000000, ovr: 72, pos: "DFC", foot: "D", loan: null },
        { id: "en271", name: "Tyrone Mings", nick: "Mings", number: 5, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 33, stamina: 100, value: 3000000, ovr: 72, pos: "DFC", foot: "Z", loan: null },
        { id: "en272", name: "Ian Maatsen", nick: "Maatsen", number: 22, flag: "🇳🇱", age: 24, stamina: 100, value: 30000000, ovr: 76, pos: "LI", foot: "Z", loan: null },
        { id: "en273", name: "Lucas Digne", nick: "Digne", number: 12, flag: "🇫🇷", age: 33, stamina: 100, value: 6000000, ovr: 80, pos: "LI", foot: "Z", loan: null },
        { id: "en274", name: "Matty Cash", nick: "Cash", number: 2, flag: "🇵🇱", age: 28, stamina: 100, value: 22000000, ovr: 83, pos: "LD", foot: "D", loan: null },
        { id: "en275", name: "Kosta Nedeljković", nick: "Nedeljković", number: 32, flag: "🇷🇸", age: 20, stamina: 100, value: 6000000, ovr: 64, pos: "LD", foot: "D", loan: null },
        // Centrocampistas
        { id: "en276", name: "Amadou Onana", nick: "Onana", number: 24, flag: "🇧🇪", age: 24, stamina: 100, value: 45000000, ovr: 76, pos: "MCD", foot: "D", loan: null },
        { id: "en277", name: "Boubacar Kamara", nick: "Kamara", number: 8, flag: "🇫🇷", age: 26, stamina: 100, value: 40000000, ovr: 84, pos: "MCD", foot: "D", loan: null },
        { id: "en278", name: "Lamare Bogarde", nick: "Bogarde", number: 26, flag: "🇳🇱", age: 22, stamina: 100, value: 18000000, ovr: 65, pos: "MCD", foot: "D", loan: null },
        { id: "en279", name: "João Gomes", nick: "Gomes", number: 35, flag: "🇧🇷", age: 25, stamina: 100, value: 40000000, ovr: 77, pos: "MC", foot: "D", loan: null },
        { id: "en280", name: "John McGinn", nick: "McGinn", number: 7, flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", age: 31, stamina: 100, value: 13000000, ovr: 85, pos: "MC", foot: "Z", loan: null },
        { id: "en281", name: "Ross Barkley", nick: "Barkley", number: 6, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 32, stamina: 100, value: 4000000, ovr: 63, pos: "MC", foot: "D", loan: null },
        { id: "en282", name: "Johan Manzambi", nick: "Manzambi", number: 44, flag: "🇨🇭", age: 20, stamina: 100, value: 65000000, ovr: 70, pos: "MCO", foot: "D", loan: null },
        // Delanteros
        { id: "en283", name: "Alejandro Garnacho", nick: "Garnacho", number: 17, flag: "🇦🇷", age: 22, stamina: 100, value: 28000000, ovr: 76, pos: "EI", foot: "D", loan: { isLoaned: true, parentTeam: "Chelsea", currentTeam: "eng_astonvilla" } },
        { id: "en284", name: "Emiliano Buendía", nick: "Buendía", number: 10, flag: "🇦🇷", age: 29, stamina: 100, value: 16000000, ovr: 74, pos: "EI", foot: "D", loan: null },
        { id: "en285", name: "Samuel Iling-Junior", nick: "Iling", number: 33, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 22, stamina: 100, value: 6500000, ovr: 65, pos: "EI", foot: "Z", loan: null },
        { id: "en286", name: "Evann Guessand", nick: "Guessand", number: 29, flag: "🇨🇮", age: 25, stamina: 100, value: 25000000, ovr: 75, pos: "ED", foot: "D", loan: null },
        { id: "en287", name: "Leon Bailey", nick: "Bailey", number: 31, flag: "🇯🇲", age: 28, stamina: 100, value: 14000000, ovr: 73, pos: "ED", foot: "Z", loan: null },
        { id: "en288", name: "Alysson", nick: "Alysson", number: 47, flag: "🇧🇷", age: 20, stamina: 100, value: 10000000, ovr: 59, pos: "ED", foot: "Z", loan: null },
        { id: "en289", name: "Ollie Watkins", nick: "Watkins", number: 11, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 30, stamina: 100, value: 25000000, ovr: 86, pos: "DC", foot: "D", loan: null },
        { id: "en290", name: "Tammy Abraham", nick: "Abraham", number: 18, flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", age: 28, stamina: 100, value: 18000000, ovr: 76, pos: "DC", foot: "D", loan: null },
        // Cedidos fuera
        { id: "en291", name: "Joe Gauci", nick: "Gauci", number: "", flag: "🇦🇺", age: 26, stamina: 100, value: 1090000, ovr: 60, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "eng_astonvilla", currentTeam: "Lincoln City" } },
        { id: "en292", name: "Oliwier Zych", nick: "Zych", number: "", flag: "🇵🇱", age: 22, stamina: 100, value: 1850000, ovr: 61, pos: "POR", foot: "D", loan: { isLoaned: true, parentTeam: "eng_astonvilla", currentTeam: "Vitória Guimarães" } },
        { id: "en293", name: "Yasin Özcan", nick: "Özcan", number: "", flag: "🇹🇷", age: 20, stamina: 100, value: 8830000, ovr: 63, pos: "DFC", foot: "Z", loan: { isLoaned: true, parentTeam: "eng_astonvilla", currentTeam: "Beşiktaş" } }
      ]
    }
  ]
};