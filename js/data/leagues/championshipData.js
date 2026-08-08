(function () {
  // EFL Championship: segunda división inglesa (24 clubes, 46 jornadas). Los equipos ya
  // existen en englandData.divisionTeams con division 'championship' (logos, ovr, estadios,
  // jugadores...). Aquí se REUBICAN fuera de divisionTeams para formar la liga jugable
  // (mismo modelo que la LaLiga Hypermotion en España) y se aplican las reglas del club:
  // presupuesto, formación y estilo (mentality -> style del juego).
  const englandData = window.PocketManager.englandData;

  const champTeams = englandData.divisionTeams.filter(function (t) { return t.division === 'championship'; });
  englandData.divisionTeams = englandData.divisionTeams.filter(function (t) { return t.division !== 'championship'; });

  // Overrides por id: budget / formation / style / primaryColor / secondaryColor.
  const OVERRIDES = [
    { id: 'eng_c_birmingham-city', budget: 18000000, formation: '4-2-3-1', style: 'Ofensivo', primaryColor: '#0000FF', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_blackburn-rovers', budget: 12000000, formation: '4-2-3-1', style: 'Equilibrado', primaryColor: '#000080', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_bolton-wanderers', budget: 10000000, formation: '3-5-2', style: 'Equilibrado', primaryColor: '#FFFFFF', secondaryColor: '#000080' },
    { id: 'eng_c_bristol-city', budget: 14000000, formation: '4-2-3-1', style: 'Equilibrado', primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_burnley', budget: 35000000, formation: '4-3-3', style: 'Ofensivo', primaryColor: '#6C1D45', secondaryColor: '#99D6EA' },
    { id: 'eng_c_cardiff-city', budget: 15000000, formation: '4-2-3-1', style: 'Defensivo', primaryColor: '#0054A6', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_charlton-athletic', budget: 9000000, formation: '4-3-3', style: 'Equilibrado', primaryColor: '#D00027', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_derby-county', budget: 11000000, formation: '4-3-3', style: 'Defensivo', primaryColor: '#FFFFFF', secondaryColor: '#000000' },
    { id: 'eng_c_lincoln-city', budget: 7000000, formation: '3-4-2-1', style: 'Defensivo', primaryColor: '#D00027', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_middlesbrough', budget: 22000000, formation: '4-2-3-1', style: 'Ofensivo', primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_millwall', budget: 11000000, formation: '4-4-2', style: 'Defensivo', primaryColor: '#001A4C', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_norwich-city', budget: 25000000, formation: '4-3-3', style: 'Ofensivo', primaryColor: '#FFF200', secondaryColor: '#00A651' },
    { id: 'eng_c_portsmouth', budget: 10000000, formation: '4-2-3-1', style: 'Equilibrado', primaryColor: '#001489', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_preston-north-end', budget: 12000000, formation: '3-5-2', style: 'Defensivo', primaryColor: '#FFFFFF', secondaryColor: '#000080' },
    { id: 'eng_c_queens-park-rangers', budget: 13000000, formation: '4-2-3-1', style: 'Equilibrado', primaryColor: '#0054A6', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_sheffield-united', budget: 32000000, formation: '3-5-2', style: 'Ofensivo', primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_southampton', budget: 38000000, formation: '4-3-3', style: 'Ofensivo', primaryColor: '#D00027', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_stoke-city', budget: 20000000, formation: '4-3-3', style: 'Equilibrado', primaryColor: '#E30613', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_swansea-city', budget: 16000000, formation: '4-2-3-1', style: 'Ofensivo', primaryColor: '#FFFFFF', secondaryColor: '#000000' },
    { id: 'eng_c_watford', budget: 28000000, formation: '4-3-3', style: 'Ofensivo', primaryColor: '#FBEE23', secondaryColor: '#000000' },
    { id: 'eng_c_west-bromwich-albion', budget: 26000000, formation: '4-2-3-1', style: 'Ofensivo', primaryColor: '#001A4C', secondaryColor: '#FFFFFF' },
    { id: 'eng_c_west-ham-united', budget: 45000000, formation: '4-2-3-1', style: 'Ofensivo', primaryColor: '#7A263A', secondaryColor: '#1BB1E7' },
    { id: 'eng_c_wolves', budget: 42000000, formation: '3-4-3', style: 'Ofensivo', primaryColor: '#FDB913', secondaryColor: '#231F20' },
    { id: 'eng_c_wrexham-afc', budget: 15000000, formation: '3-5-2', style: 'Ofensivo', primaryColor: '#E30613', secondaryColor: '#FFFFFF' }
  ];
  const overrides = {};
  OVERRIDES.forEach(function (o) { overrides[o.id] = o; });

  champTeams.forEach(function (t) {
    const o = overrides[t.id];
    if (!o) return;
    if (o.budget != null) t.budget = o.budget;
    if (o.formation) t.formation = o.formation;
    if (o.style) t.style = o.style;
    if (o.primaryColor) t.primaryColor = o.primaryColor;
    if (o.secondaryColor) t.secondaryColor = o.secondaryColor;
  });

  window.PocketManager.championshipData = {
    country: 'Inglaterra',
    leagueName: 'EFL Championship',
    maxSubs: 5,
    teams: champTeams
  };
})();
