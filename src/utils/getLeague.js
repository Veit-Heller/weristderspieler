const leagueMap = {
  // Premier League
  "Manchester United": "Premier League", "Manchester City": "Premier League", "Liverpool": "Premier League",
  "Chelsea": "Premier League", "Arsenal": "Premier League", "Tottenham Hotspur": "Premier League",
  "Leicester City": "Premier League", "West Ham United": "Premier League", "Everton": "Premier League",
  "Newcastle United": "Premier League", "Brighton & Hove Albion": "Premier League", "Wolverhampton Wanderers": "Premier League",
  "Aston Villa": "Premier League", "Leeds United": "Premier League", "Southampton": "Premier League",
  "Burnley": "Premier League", "Watford": "Premier League", "Crystal Palace": "Premier League",
  "Bournemouth": "Premier League", "Fulham": "Premier League", "Sheffield United": "Premier League",
  "Nottingham Forest": "Premier League",
  // La Liga
  "Real Madrid": "La Liga", "FC Barcelona": "La Liga", "Atlético Madrid": "La Liga",
  "Sevilla FC": "La Liga", "Valencia": "La Liga", "Villarreal": "La Liga",
  "Real Sociedad": "La Liga", "Real Betis": "La Liga", "Athletic Bilbao": "La Liga",
  "Getafe": "La Liga", "Mallorca": "La Liga", "Celta Vigo": "La Liga",
  "Espanyol": "La Liga", "Girona": "La Liga",
  // Bundesliga
  "Bayern München": "Bundesliga", "Borussia Dortmund": "Bundesliga", "RB Leipzig": "Bundesliga",
  "Bayer Leverkusen": "Bundesliga", "Borussia Mönchengladbach": "Bundesliga", "Eintracht Frankfurt": "Bundesliga",
  "Wolfsburg": "Bundesliga", "Werder Bremen": "Bundesliga", "Hoffenheim": "Bundesliga",
  "Freiburg": "Bundesliga", "Schalke 04": "Bundesliga", "VfB Stuttgart": "Bundesliga",
  "VfL Bochum": "Bundesliga", "Hamburger SV": "Bundesliga",
  // Serie A
  "Juventus Turin": "Serie A", "AC Mailand": "Serie A", "Inter Mailand": "Serie A",
  "AS Rom": "Serie A", "Napoli": "Serie A", "Lazio": "Serie A",
  "Atalanta": "Serie A", "Fiorentina": "Serie A", "Sassuolo": "Serie A",
  "Udinese": "Serie A",
  // Ligue 1
  "PSG": "Ligue 1", "Paris Saint-Germain": "Ligue 1", "Olympique Lyon": "Ligue 1",
  "Marseille": "Ligue 1", "Monaco": "Ligue 1", "AS Monaco": "Ligue 1",
  "Lille": "Ligue 1", "Nice": "Ligue 1", "Rennes": "Ligue 1",
  // Andere
  "Al-Nassr": "Saudi Pro League", "Al-Hilal": "Saudi Pro League", "Al-Ahli": "Saudi Pro League",
  "Al-Ittihad": "Saudi Pro League", "Inter Miami": "MLS", "Los Angeles FC": "MLS",
  "New York City FC": "MLS", "LA Galaxy": "MLS", "Toronto FC": "MLS"
};

export const getLeague = (club) => leagueMap[club] || "Unbekannt";
