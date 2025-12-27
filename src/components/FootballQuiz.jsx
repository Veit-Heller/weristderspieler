import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

// Funktion zum zufälligen Mischen eines Arrays
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Funktion für Fuzzy-Matching - prüft ob der eingegebene Text dem Spielernamen ähnlich genug ist
// Toleriert bis zu 2 Rechtschreibfehler
const fuzzyMatch = (input, playerName, maxErrors = 2) => {
  // Normalisiere beide Strings (lowercase, entferne Leerzeichen am Anfang/Ende)
  const normalizedInput = input.trim().toLowerCase();
  const normalizedName = playerName.toLowerCase();
  
  // Wenn exakt gleich, return true
  if (normalizedInput === normalizedName) return true;
  
  // Extrahiere Nachnamen (letztes Wort)
  const nameParts = normalizedName.split(' ');
  const lastName = nameParts[nameParts.length - 1];
  
  // Prüfe ob Input genau dem Nachnamen entspricht
  if (normalizedInput === lastName) return true;
  
  // Prüfe ob Input im vollen Namen enthalten ist (für Teilstrings)
  if (normalizedName.includes(normalizedInput) || normalizedInput.includes(lastName)) {
    return true;
  }
  
  // Prüfe ob Input den Nachnamen enthält (auch wenn zusätzliche Wörter vorhanden sind)
  // z.B. "de bruine" sollte mit "Kevin De Bruyne" matchen
  const inputWords = normalizedInput.split(' ').filter(w => w.length > 0);
  if (inputWords.some(word => word === lastName || lastName.includes(word) || word.includes(lastName))) {
    return true;
  }
  
  // Levenshtein-Distanz für Nachnamen
  const levenshteinDistance = (str1, str2) => {
    const matrix = [];
    const len1 = str1.length;
    const len2 = str2.length;
    
    if (len1 === 0) return len2;
    if (len2 === 0) return len1;
    
    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[len2][len1];
  };
  
  // Prüfe Distanz zum vollen Namen
  const fullNameDistance = levenshteinDistance(normalizedInput, normalizedName);
  if (fullNameDistance <= maxErrors) return true;
  
  // Prüfe Distanz zum Nachnamen
  const lastNameDistance = levenshteinDistance(normalizedInput, lastName);
  if (lastNameDistance <= maxErrors) return true;
  
  // Prüfe auch Distanz für jedes Wort im Input zum Nachnamen
  for (const word of inputWords) {
    const wordDistance = levenshteinDistance(word, lastName);
    if (wordDistance <= maxErrors) return true;
  }
  
  return false;
};

// Mapping von Club-Namen zu Logo-URLs (verwendet einen zuverlässigeren Logo-Service)
const getClubLogo = (clubName) => {
  // Verwende einen einfacheren Ansatz mit einem zuverlässigen Logo-Service
  const logoMap = {
    // Premier League - Verwende einen zuverlässigeren Service
    "Manchester United": "https://img.icons8.com/color/48/manchester-united.png",
    "Manchester City": "https://img.icons8.com/color/48/manchester-city.png",
    "Liverpool": "https://img.icons8.com/color/48/liverpool.png",
    "Chelsea": "https://img.icons8.com/color/48/chelsea.png",
    "Arsenal": "https://img.icons8.com/color/48/arsenal.png",
    "Tottenham Hotspur": "https://img.icons8.com/color/48/tottenham-hotspur.png",
    "Leicester City": "https://logos-world.net/wp-content/uploads/2020/06/Leicester-City-Logo.png",
    "West Ham United": "https://logos-world.net/wp-content/uploads/2020/06/West-Ham-Logo.png",
    "Everton": "https://logos-world.net/wp-content/uploads/2020/06/Everton-Logo.png",
    "Newcastle United": "https://logos-world.net/wp-content/uploads/2020/06/Newcastle-United-Logo.png",
    "Brighton & Hove Albion": "https://logos-world.net/wp-content/uploads/2020/06/Brighton-Hove-Albion-Logo.png",
    "Wolverhampton Wanderers": "https://logos-world.net/wp-content/uploads/2020/06/Wolves-Logo.png",
    "Aston Villa": "https://logos-world.net/wp-content/uploads/2020/06/Aston-Villa-Logo.png",
    "Leeds United": "https://logos-world.net/wp-content/uploads/2020/06/Leeds-United-Logo.png",
    "Southampton": "https://logos-world.net/wp-content/uploads/2020/06/Southampton-Logo.png",
    "Burnley": "https://logos-world.net/wp-content/uploads/2020/06/Burnley-Logo.png",
    "Watford": "https://logos-world.net/wp-content/uploads/2020/06/Watford-Logo.png",
    "Crystal Palace": "https://logos-world.net/wp-content/uploads/2020/06/Crystal-Palace-Logo.png",
    "Bournemouth": "https://logos-world.net/wp-content/uploads/2020/06/Bournemouth-Logo.png",
    "Fulham": "https://logos-world.net/wp-content/uploads/2020/06/Fulham-Logo.png",
    "Sheffield United": "https://logos-world.net/wp-content/uploads/2020/06/Sheffield-United-Logo.png",
    "Nottingham Forest": "https://logos-world.net/wp-content/uploads/2020/06/Nottingham-Forest-Logo.png",
    
    // La Liga
    "Real Madrid": "https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png",
    "FC Barcelona": "https://logos-world.net/wp-content/uploads/2020/06/Barcelona-Logo.png",
    "Atlético Madrid": "https://logos-world.net/wp-content/uploads/2020/06/Atletico-Madrid-Logo.png",
    "Sevilla FC": "https://logos-world.net/wp-content/uploads/2020/06/Sevilla-Logo.png",
    "Valencia": "https://logos-world.net/wp-content/uploads/2020/06/Valencia-Logo.png",
    "Villarreal": "https://logos-world.net/wp-content/uploads/2020/06/Villarreal-Logo.png",
    "Real Sociedad": "https://logos-world.net/wp-content/uploads/2020/06/Real-Sociedad-Logo.png",
    "Real Betis": "https://logos-world.net/wp-content/uploads/2020/06/Real-Betis-Logo.png",
    "Athletic Bilbao": "https://logos-world.net/wp-content/uploads/2020/06/Athletic-Bilbao-Logo.png",
    "Getafe": "https://logos-world.net/wp-content/uploads/2020/06/Getafe-Logo.png",
    "Mallorca": "https://logos-world.net/wp-content/uploads/2020/06/Mallorca-Logo.png",
    "Celta Vigo": "https://logos-world.net/wp-content/uploads/2020/06/Celta-Vigo-Logo.png",
    "Espanyol": "https://logos-world.net/wp-content/uploads/2020/06/Espanyol-Logo.png",
    "Deportivo La Coruña": "https://logos-world.net/wp-content/uploads/2020/06/Deportivo-La-Coruna-Logo.png",
    "Real Zaragoza": "https://logos-world.net/wp-content/uploads/2020/06/Real-Zaragoza-Logo.png",
    "Real Madrid Castilla": "https://logos-world.net/wp-content/uploads/2020/06/Real-Madrid-Logo.png",
    
    // Bundesliga
    "Bayern München": "https://logos-world.net/wp-content/uploads/2020/06/Bayern-Munich-Logo.png",
    "Borussia Dortmund": "https://logos-world.net/wp-content/uploads/2020/06/Borussia-Dortmund-Logo.png",
    "RB Leipzig": "https://logos-world.net/wp-content/uploads/2020/06/RB-Leipzig-Logo.png",
    "Bayer Leverkusen": "https://logos-world.net/wp-content/uploads/2020/06/Bayer-Leverkusen-Logo.png",
    "Borussia Mönchengladbach": "https://logos-world.net/wp-content/uploads/2020/06/Borussia-Monchengladbach-Logo.png",
    "Eintracht Frankfurt": "https://logos-world.net/wp-content/uploads/2020/06/Eintracht-Frankfurt-Logo.png",
    "Wolfsburg": "https://logos-world.net/wp-content/uploads/2020/06/Wolfsburg-Logo.png",
    "Werder Bremen": "https://logos-world.net/wp-content/uploads/2020/06/Werder-Bremen-Logo.png",
    "Hoffenheim": "https://logos-world.net/wp-content/uploads/2020/06/Hoffenheim-Logo.png",
    "Freiburg": "https://logos-world.net/wp-content/uploads/2020/06/Freiburg-Logo.png",
    "Schalke 04": "https://logos-world.net/wp-content/uploads/2020/06/Schalke-04-Logo.png",
    "VfB Stuttgart": "https://logos-world.net/wp-content/uploads/2020/06/VfB-Stuttgart-Logo.png",
    "1. FC Nürnberg": "https://logos-world.net/wp-content/uploads/2020/06/1-FC-Nurnberg-Logo.png",
    "VfL Bochum": "https://logos-world.net/wp-content/uploads/2020/06/VfL-Bochum-Logo.png",
    "Hamburger SV": "https://logos-world.net/wp-content/uploads/2020/06/Hamburger-SV-Logo.png",
    "Hansa Rostock": "https://logos-world.net/wp-content/uploads/2020/06/Hansa-Rostock-Logo.png",
    
    // Serie A
    "Juventus Turin": "https://logos-world.net/wp-content/uploads/2020/06/Juventus-Logo.png",
    "AC Mailand": "https://logos-world.net/wp-content/uploads/2020/06/AC-Milan-Logo.png",
    "Inter Mailand": "https://logos-world.net/wp-content/uploads/2020/06/Inter-Milan-Logo.png",
    "AS Rom": "https://logos-world.net/wp-content/uploads/2020/06/AS-Roma-Logo.png",
    "Napoli": "https://logos-world.net/wp-content/uploads/2020/06/Napoli-Logo.png",
    "Lazio": "https://logos-world.net/wp-content/uploads/2020/06/Lazio-Logo.png",
    "Atalanta": "https://logos-world.net/wp-content/uploads/2020/06/Atalanta-Logo.png",
    "Fiorentina": "https://logos-world.net/wp-content/uploads/2020/06/Fiorentina-Logo.png",
    "Sassuolo": "https://logos-world.net/wp-content/uploads/2020/06/Sassuolo-Logo.png",
    "Udinese": "https://logos-world.net/wp-content/uploads/2020/06/Udinese-Logo.png",
    "Brescia": "https://logos-world.net/wp-content/uploads/2020/06/Brescia-Logo.png",
    "Genoa": "https://logos-world.net/wp-content/uploads/2020/06/Genoa-Logo.png",
    "Siena": "https://logos-world.net/wp-content/uploads/2020/06/Siena-Logo.png",
    "Torino": "https://logos-world.net/wp-content/uploads/2020/06/Torino-Logo.png",
    "Palermo": "https://logos-world.net/wp-content/uploads/2020/06/Palermo-Logo.png",
    "Pescara": "https://logos-world.net/wp-content/uploads/2020/06/Pescara-Logo.png",
    
    // Ligue 1
    "PSG": "https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png",
    "Paris Saint-Germain": "https://logos-world.net/wp-content/uploads/2020/06/Paris-Saint-Germain-Logo.png",
    "Olympique Lyon": "https://logos-world.net/wp-content/uploads/2020/06/Olympique-Lyon-Logo.png",
    "Marseille": "https://logos-world.net/wp-content/uploads/2020/06/Olympique-Marseille-Logo.png",
    "Monaco": "https://logos-world.net/wp-content/uploads/2020/06/AS-Monaco-Logo.png",
    "AS Monaco": "https://logos-world.net/wp-content/uploads/2020/06/AS-Monaco-Logo.png",
    "Lille": "https://logos-world.net/wp-content/uploads/2020/06/Lille-Logo.png",
    "Nice": "https://logos-world.net/wp-content/uploads/2020/06/Nice-Logo.png",
    "Rennes": "https://logos-world.net/wp-content/uploads/2020/06/Rennes-Logo.png",
    "Saint-Étienne": "https://logos-world.net/wp-content/uploads/2020/06/Saint-Etienne-Logo.png",
    "Bordeaux": "https://logos-world.net/wp-content/uploads/2020/06/Bordeaux-Logo.png",
    "Nantes": "https://logos-world.net/wp-content/uploads/2020/06/Nantes-Logo.png",
    "Le Havre": "https://logos-world.net/wp-content/uploads/2020/06/Le-Havre-Logo.png",
    "Tours": "https://logos-world.net/wp-content/uploads/2020/06/Tours-Logo.png",
    "Dijon": "https://logos-world.net/wp-content/uploads/2020/06/Dijon-Logo.png",
    "Guingamp": "https://logos-world.net/wp-content/uploads/2020/06/Guingamp-Logo.png",
    "Brest": "https://logos-world.net/wp-content/uploads/2020/06/Brest-Logo.png",
    
    // Andere europäische Ligen
    "Benfica": "https://logos-world.net/wp-content/uploads/2020/06/Benfica-Logo.png",
    "FC Porto": "https://logos-world.net/wp-content/uploads/2020/06/FC-Porto-Logo.png",
    "Sporting Lissabon": "https://logos-world.net/wp-content/uploads/2020/06/Sporting-Lisbon-Logo.png",
    "Braga": "https://logos-world.net/wp-content/uploads/2020/06/Braga-Logo.png",
    "Rio Ave": "https://logos-world.net/wp-content/uploads/2020/06/Rio-Ave-Logo.png",
    
    "Ajax Amsterdam": "https://logos-world.net/wp-content/uploads/2020/06/Ajax-Logo.png",
    "PSV Eindhoven": "https://logos-world.net/wp-content/uploads/2020/06/PSV-Eindhoven-Logo.png",
    "Feyenoord": "https://logos-world.net/wp-content/uploads/2020/06/Feyenoord-Logo.png",
    "Heerenveen": "https://logos-world.net/wp-content/uploads/2020/06/Heerenveen-Logo.png",
    "FC Groningen": "https://logos-world.net/wp-content/uploads/2020/06/FC-Groningen-Logo.png",
    "Twente": "https://logos-world.net/wp-content/uploads/2020/06/Twente-Logo.png",
    "AZ Alkmaar": "https://logos-world.net/wp-content/uploads/2020/06/AZ-Alkmaar-Logo.png",
    "Vitesse": "https://logos-world.net/wp-content/uploads/2020/06/Vitesse-Logo.png",
    "Willem II": "https://logos-world.net/wp-content/uploads/2020/06/Willem-II-Logo.png",
    "Union SG": "https://logos-world.net/wp-content/uploads/2020/06/Union-SG-Logo.png",
    
    "Celtic Glasgow": "https://logos-world.net/wp-content/uploads/2020/06/Celtic-Logo.png",
    "Rangers": "https://logos-world.net/wp-content/uploads/2020/06/Rangers-Logo.png",
    
    "Shakhtar Donetsk": "https://logos-world.net/wp-content/uploads/2020/06/Shakhtar-Donetsk-Logo.png",
    "Dynamo Kyiv": "https://logos-world.net/wp-content/uploads/2020/06/Dynamo-Kyiv-Logo.png",
    
    "RB Salzburg": "https://logos-world.net/wp-content/uploads/2020/06/Red-Bull-Salzburg-Logo.png",
    "Red Bull Salzburg": "https://logos-world.net/wp-content/uploads/2020/06/Red-Bull-Salzburg-Logo.png",
    
    // Asiatische Ligen
    "Al-Nassr": "https://logos-world.net/wp-content/uploads/2020/06/Al-Nassr-Logo.png",
    "Al-Hilal": "https://logos-world.net/wp-content/uploads/2020/06/Al-Hilal-Logo.png",
    "Al-Ahli": "https://logos-world.net/wp-content/uploads/2020/06/Al-Ahli-Logo.png",
    "Al-Ittihad": "https://logos-world.net/wp-content/uploads/2020/06/Al-Ittihad-Logo.png",
    "Al-Rayyan": "https://logos-world.net/wp-content/uploads/2020/06/Al-Rayyan-Logo.png",
    "Al-Gharafa": "https://logos-world.net/wp-content/uploads/2020/06/Al-Gharafa-Logo.png",
    "Al-Wahda": "https://logos-world.net/wp-content/uploads/2020/06/Al-Wahda-Logo.png",
    "Al-Duhail": "https://logos-world.net/wp-content/uploads/2020/06/Al-Duhail-Logo.png",
    "Al-Ettifaq": "https://logos-world.net/wp-content/uploads/2020/06/Al-Ettifaq-Logo.png",
    
    // MLS & andere
    "Inter Miami": "https://logos-world.net/wp-content/uploads/2020/06/Inter-Miami-Logo.png",
    "Los Angeles FC": "https://logos-world.net/wp-content/uploads/2020/06/LAFC-Logo.png",
    "New York City FC": "https://logos-world.net/wp-content/uploads/2020/06/New-York-City-FC-Logo.png",
    "DC United": "https://logos-world.net/wp-content/uploads/2020/06/DC-United-Logo.png",
    "LA Galaxy": "https://logos-world.net/wp-content/uploads/2020/06/LA-Galaxy-Logo.png",
    "Toronto FC": "https://logos-world.net/wp-content/uploads/2020/06/Toronto-FC-Logo.png",
    
    // Weitere Clubs
    "Dinamo Zagreb": "https://logos-world.net/wp-content/uploads/2020/06/Dinamo-Zagreb-Logo.png",
    "Inter Zaprešić": "https://logos-world.net/wp-content/uploads/2020/06/Inter-Zapresic-Logo.png",
    "Partizan Belgrad": "https://logos-world.net/wp-content/uploads/2020/06/Partizan-Logo.png",
    "Flamengo": "https://logos-world.net/wp-content/uploads/2020/06/Flamengo-Logo.png",
    "Santos": "https://logos-world.net/wp-content/uploads/2020/06/Santos-Logo.png",
    "Corinthians": "https://logos-world.net/wp-content/uploads/2020/06/Corinthians-Logo.png",
    "Palmeiras": "https://logos-world.net/wp-content/uploads/2020/06/Palmeiras-Logo.png",
    "São Paulo": "https://logos-world.net/wp-content/uploads/2020/06/Sao-Paulo-Logo.png",
    "Internacional": "https://logos-world.net/wp-content/uploads/2020/06/Internacional-Logo.png",
    "Fluminense": "https://logos-world.net/wp-content/uploads/2020/06/Fluminense-Logo.png",
    "Vasco da Gama": "https://logos-world.net/wp-content/uploads/2020/06/Vasco-da-Gama-Logo.png",
    "Grêmio": "https://logos-world.net/wp-content/uploads/2020/06/Gremio-Logo.png",
    "Atlético Mineiro": "https://logos-world.net/wp-content/uploads/2020/06/Atletico-Mineiro-Logo.png",
    "Racing Club": "https://logos-world.net/wp-content/uploads/2020/06/Racing-Club-Logo.png",
    "Independiente": "https://logos-world.net/wp-content/uploads/2020/06/Independiente-Logo.png",
    "Boca Juniors": "https://logos-world.net/wp-content/uploads/2020/06/Boca-Juniors-Logo.png",
    "River Plate": "https://logos-world.net/wp-content/uploads/2020/06/River-Plate-Logo.png",
    "Nacional": "https://logos-world.net/wp-content/uploads/2020/06/Nacional-Logo.png",
    "Peñarol": "https://logos-world.net/wp-content/uploads/2020/06/Penarol-Logo.png",
    
    // Weitere Clubs
    "Groningen": "https://logos-world.net/wp-content/uploads/2020/06/FC-Groningen-Logo.png",
    "Charleroi": "https://logos-world.net/wp-content/uploads/2020/06/Charleroi-Logo.png",
    "Olimpija Ljubljana": "https://logos-world.net/wp-content/uploads/2020/06/Olimpija-Ljubljana-Logo.png",
    "Vissel Kobe": "https://logos-world.net/wp-content/uploads/2020/06/Vissel-Kobe-Logo.png",
    "Al-Sadd": "https://logos-world.net/wp-content/uploads/2020/06/Al-Sadd-Logo.png",
    "Galatasaray": "https://logos-world.net/wp-content/uploads/2020/06/Galatasaray-Logo.png",
    "Fenerbahçe": "https://logos-world.net/wp-content/uploads/2020/06/Fenerbahce-Logo.png",
    "Beşiktaş": "https://logos-world.net/wp-content/uploads/2020/06/Besiktas-Logo.png",
    "Como": "https://logos-world.net/wp-content/uploads/2020/06/Como-Logo.png",
    "Sagan Tosu": "https://logos-world.net/wp-content/uploads/2020/06/Sagan-Tosu-Logo.png",
    "FC Seoul": "https://logos-world.net/wp-content/uploads/2020/06/FC-Seoul-Logo.png",
    "Pohang Steelers": "https://logos-world.net/wp-content/uploads/2020/06/Pohang-Steelers-Logo.png",
    "FC Tokyo": "https://logos-world.net/wp-content/uploads/2020/06/FC-Tokyo-Logo.png",
    "Kawasaki Frontale": "https://logos-world.net/wp-content/uploads/2020/06/Kawasaki-Frontale-Logo.png",
    "Gamba Osaka": "https://logos-world.net/wp-content/uploads/2020/06/Gamba-Osaka-Logo.png",
    "Persepolis": "https://logos-world.net/wp-content/uploads/2020/06/Persepolis-Logo.png",
    "Rubin Kazan": "https://logos-world.net/wp-content/uploads/2020/06/Rubin-Kazan-Logo.png",
    "Rostov": "https://logos-world.net/wp-content/uploads/2020/06/Rostov-Logo.png",
    "Zenit St. Petersburg": "https://logos-world.net/wp-content/uploads/2020/06/Zenit-Logo.png",
    "Wydad Casablanca": "https://logos-world.net/wp-content/uploads/2020/06/Wydad-Casablanca-Logo.png",
    "CR Belouizdad": "https://logos-world.net/wp-content/uploads/2020/06/CR-Belouizdad-Logo.png",
    "Anderlecht": "https://logos-world.net/wp-content/uploads/2020/06/Anderlecht-Logo.png",
    "Genk": "https://logos-world.net/wp-content/uploads/2020/06/Genk-Logo.png",
    "Standard Liège": "https://logos-world.net/wp-content/uploads/2020/06/Standard-Liege-Logo.png",
    "Olympiakos": "https://logos-world.net/wp-content/uploads/2020/06/Olympiakos-Logo.png",
    "Panathinaikos": "https://logos-world.net/wp-content/uploads/2020/06/Panathinaikos-Logo.png",
    "AEK Athens": "https://logos-world.net/wp-content/uploads/2020/06/AEK-Athens-Logo.png",
    "Malmö FF": "https://logos-world.net/wp-content/uploads/2020/06/Malmo-FF-Logo.png",
    "Rosenborg": "https://logos-world.net/wp-content/uploads/2020/06/Rosenborg-Logo.png",
    "Molde FK": "https://logos-world.net/wp-content/uploads/2020/06/Molde-Logo.png",
    "Bryne FK": "https://logos-world.net/wp-content/uploads/2020/06/Bryne-Logo.png",
    "Lech Posen": "https://logos-world.net/wp-content/uploads/2020/06/Lech-Poznan-Logo.png",
    "Leganés": "https://logos-world.net/wp-content/uploads/2020/06/Leganes-Logo.png",
    "Málaga": "https://logos-world.net/wp-content/uploads/2020/06/Malaga-Logo.png",
    "Almería": "https://logos-world.net/wp-content/uploads/2020/06/Almeria-Logo.png",
    "Las Palmas": "https://logos-world.net/wp-content/uploads/2020/06/Las-Palmas-Logo.png",
    "Girona": "https://logos-world.net/wp-content/uploads/2020/06/Girona-Logo.png",
    "Hull City": "https://logos-world.net/wp-content/uploads/2020/06/Hull-City-Logo.png",
    "Derby County": "https://logos-world.net/wp-content/uploads/2020/06/Derby-County-Logo.png",
    "Wigan Athletic": "https://logos-world.net/wp-content/uploads/2020/06/Wigan-Athletic-Logo.png",
    "Huddersfield Town": "https://logos-world.net/wp-content/uploads/2020/06/Huddersfield-Town-Logo.png",
    "Preston North End": "https://logos-world.net/wp-content/uploads/2020/06/Preston-North-End-Logo.png",
    "Sunderland": "https://logos-world.net/wp-content/uploads/2020/06/Sunderland-Logo.png",
    "Charlton Athletic": "https://logos-world.net/wp-content/uploads/2020/06/Charlton-Athletic-Logo.png",
    "Bury": "https://logos-world.net/wp-content/uploads/2020/06/Bury-Logo.png",
    "Queen's Park": "https://logos-world.net/wp-content/uploads/2020/06/Queens-Park-Logo.png",
    "Dundee United": "https://logos-world.net/wp-content/uploads/2020/06/Dundee-United-Logo.png",
    "Rosario Central": "https://logos-world.net/wp-content/uploads/2020/06/Rosario-Central-Logo.png",
    "Instituto": "https://logos-world.net/wp-content/uploads/2020/06/Instituto-Logo.png",
    "Danubio": "https://logos-world.net/wp-content/uploads/2020/06/Danubio-Logo.png",
    "Figueirense": "https://logos-world.net/wp-content/uploads/2020/06/Figueirense-Logo.png",
    "América Mineiro": "https://logos-world.net/wp-content/uploads/2020/06/America-Mineiro-Logo.png",
    "Avaí": "https://logos-world.net/wp-content/uploads/2020/06/Avai-Logo.png",
    "Vitória Guimarães": "https://logos-world.net/wp-content/uploads/2020/06/Vitoria-Guimaraes-Logo.png",
    "Paços de Ferreira": "https://logos-world.net/wp-content/uploads/2020/06/Pacos-de-Ferreira-Logo.png",
    "Audax": "https://logos-world.net/wp-content/uploads/2020/06/Audax-Logo.png",
    "Athletico Paranaense": "https://logos-world.net/wp-content/uploads/2020/06/Athletico-Paranaense-Logo.png",
    "Sochaux": "https://logos-world.net/wp-content/uploads/2020/06/Sochaux-Logo.png",
    "Valenciennes": "https://logos-world.net/wp-content/uploads/2020/06/Valenciennes-Logo.png",
    "Livorno": "https://logos-world.net/wp-content/uploads/2020/06/Livorno-Logo.png",
    "Treviso": "https://logos-world.net/wp-content/uploads/2020/06/Treviso-Logo.png",
    "Bari": "https://logos-world.net/wp-content/uploads/2020/06/Bari-Logo.png",
    "Reggiana": "https://logos-world.net/wp-content/uploads/2020/06/Reggiana-Logo.png",
    "Chievo": "https://logos-world.net/wp-content/uploads/2020/06/Chievo-Logo.png",
    "Sorrento": "https://logos-world.net/wp-content/uploads/2020/06/Sorrento-Logo.png",
    "De Graafschap": "https://logos-world.net/wp-content/uploads/2020/06/De-Graafschap-Logo.png",
    "Sparta Rotterdam": "https://logos-world.net/wp-content/uploads/2020/06/Sparta-Rotterdam-Logo.png",
    "NEC": "https://logos-world.net/wp-content/uploads/2020/06/NEC-Logo.png",
    "Al Mokawloon": "https://logos-world.net/wp-content/uploads/2020/06/Al-Mokawloon-Logo.png",
    "FC Basel": "https://logos-world.net/wp-content/uploads/2020/06/FC-Basel-Logo.png",
    "AC Fiorentina": "https://logos-world.net/wp-content/uploads/2020/06/Fiorentina-Logo.png",
    "Alavés": "https://logos-world.net/wp-content/uploads/2020/06/Alaves-Logo.png",
    "Real Sociedad": "https://logos-world.net/wp-content/uploads/2020/06/Real-Sociedad-Logo.png",
  };
  
  // Wenn kein Logo gefunden, verwende einen Platzhalter mit den Initialen
  if (!logoMap[clubName]) {
    // Erstelle einen einfachen Platzhalter mit den ersten beiden Buchstaben
    const initials = clubName.substring(0, 2).toUpperCase();
    return null; // Wir zeigen dann nur den Text ohne Logo
  }
  
  return logoMap[clubName];
};

// Hilfsfunktion um fehlende Spielerdaten abzuleiten
const enrichPlayerData = (player) => {
  const currentClub = player.clubs[player.clubs.length - 1];
  
  // Bestimme aktuelle Liga basierend auf Verein
  const getLeague = (club) => {
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
    return leagueMap[club] || "Unbekannt";
  };

  // Bestimme Nationalität basierend auf Name/Clubs
  const getNationality = (name, clubs) => {
    const nationalityMap = {
      "Cristiano Ronaldo": "Portugal", "Lionel Messi": "Argentinien", "Toni Kroos": "Deutschland",
      "Robert Lewandowski": "Polen", "Mohamed Salah": "Ägypten", "Kylian Mbappé": "Frankreich",
      "Erling Haaland": "Norwegen", "Kevin De Bruyne": "Belgien", "Virgil van Dijk": "Niederlande",
      "Manuel Neuer": "Deutschland", "Luka Modrić": "Kroatien", "Karim Benzema": "Frankreich",
      "Neymar Jr": "Brasilien", "Sergio Ramos": "Spanien", "Thiago Silva": "Brasilien",
      "Gareth Bale": "Wales", "Zlatan Ibrahimović": "Schweden", "Andrés Iniesta": "Spanien",
      "Wayne Rooney": "England", "Andrea Pirlo": "Italien", "Xabi Alonso": "Spanien",
      "Philipp Lahm": "Deutschland", "David Beckham": "England", "Ronaldinho": "Brasilien",
      "Steven Gerrard": "England", "Frank Lampard": "England", "Arjen Robben": "Niederlande",
      "Iker Casillas": "Spanien", "Gianluigi Buffon": "Italien", "Paul Pogba": "Frankreich",
      "Jude Bellingham": "England", "Vinícius Júnior": "Brasilien", "Jamal Musiala": "Deutschland",
      "Pedri": "Spanien", "Bukayo Saka": "England", "Federico Valverde": "Uruguay",
      "Rafael Leão": "Portugal", "Alphonso Davies": "Kanada", "Achraf Hakimi": "Marokko",
      "Frenkie de Jong": "Niederlande", "Marquinhos": "Brasilien", "Rodri": "Spanien",
      "Bernardo Silva": "Portugal", "Son Heung-min": "Südkorea", "Sadio Mané": "Senegal",
      "Raheem Sterling": "England", "Harry Kane": "England", "Lautaro Martínez": "Argentinien",
      "Dušan Vlahović": "Serbien", "Victor Osimhen": "Nigeria", "Casemiro": "Brasilien",
      "Antoine Griezmann": "Frankreich", "Marc-André ter Stegen": "Deutschland", "Joshua Kimmich": "Deutschland",
      "Marco Verratti": "Italien", "Jan Oblak": "Slowenien", "Rúben Dias": "Portugal",
      "João Cancelo": "Portugal", "Trent Alexander-Arnold": "England", "Andrew Robertson": "Schottland",
      "İlkay Gündoğan": "Deutschland", "İvan Rakitić": "Kroatien", "Mats Hummels": "Deutschland",
      "Marco Reus": "Deutschland", "Pierre-Emerick Aubameyang": "Gabun", "Romelu Lukaku": "Belgien",
      "Eden Hazard": "Belgien", "Thibaut Courtois": "Belgien", "Alisson": "Brasilien",
      "Ederson": "Brasilien", "Riyad Mahrez": "Algerien", "Gabriel Jesus": "Brasilien",
      "Philippe Coutinho": "Brasilien", "Roberto Firmino": "Brasilien", "Fabinho": "Brasilien",
      "Allan": "Brasilien", "Fred": "Brasilien", "Lucas Paquetá": "Brasilien",
      "Richarlison": "Brasilien", "Raphinha": "Brasilien", "Antony": "Brasilien",
      "Bruno Guimarães": "Brasilien", "João Félix": "Portugal", "Gonçalo Ramos": "Portugal",
      "Rafael Silva": "Portugal", "Diogo Jota": "Portugal", "Rúben Neves": "Portugal",
      "Matthijs de Ligt": "Niederlande", "Memphis Depay": "Niederlande", "Donny van de Beek": "Niederlande",
      "Cody Gakpo": "Niederlande", "Xavi Simons": "Niederlande", "Wout Weghorst": "Niederlande",
      "Luuk de Jong": "Niederlande", "Denzel Dumfries": "Niederlande", "Nathan Aké": "Niederlande",
      "Daley Blind": "Niederlande", "Georginio Wijnaldum": "Niederlande", "Leroy Sané": "Deutschland",
      "Serge Gnabry": "Deutschland", "Kingsley Coman": "Frankreich", "Leon Goretzka": "Deutschland",
      "Mason Mount": "England", "Phil Foden": "England", "Marcus Rashford": "England",
      "Jadon Sancho": "England", "Declan Rice": "England", "Kalvin Phillips": "England",
      "Jack Grealish": "England", "Reece James": "England", "Ben Chilwell": "England",
      "Luke Shaw": "England", "John Stones": "England", "Harry Maguire": "England",
      "Kyle Walker": "England", "Kieran Trippier": "England", "Jordan Pickford": "England",
      "Aaron Ramsdale": "England", "Nick Pope": "England", "Emiliano Martínez": "Argentinien",
      "Ángel Di María": "Argentinien", "Paulo Dybala": "Argentinien", "Sergio Agüero": "Argentinien",
      "Gonzalo Higuaín": "Argentinien", "Javier Mascherano": "Argentinien", "Javier Zanetti": "Argentinien",
      "Esteban Cambiasso": "Argentinien", "Diego Milito": "Argentinien", "Carlos Tevez": "Argentinien",
      "Fernando Torres": "Spanien", "David Villa": "Spanien", "Raúl": "Spanien",
      "Fernando Morientes": "Spanien", "Carles Puyol": "Spanien", "Gerard Piqué": "Spanien",
      "Xavi Hernández": "Spanien", "Sergio Busquets": "Spanien", "David Silva": "Spanien",
      "Juan Mata": "Spanien", "Cesc Fàbregas": "Spanien", "Santi Cazorla": "Spanien",
      "Fernando Hierro": "Spanien", "Luis Suárez": "Uruguay", "Edinson Cavani": "Uruguay",
      "Diego Forlán": "Uruguay", "Darwin Núñez": "Uruguay", "Rodrygo": "Brasilien",
      "Eduardo Camavinga": "Frankreich", "Aurélien Tchouaméni": "Frankreich", "Jules Koundé": "Frankreich",
      "Dayot Upamecano": "Frankreich", "Ibrahima Konaté": "Frankreich", "William Saliba": "Frankreich",
      "Christopher Nkunku": "Frankreich", "Ousmane Dembélé": "Frankreich", "Marcus Thuram": "Frankreich",
      "Randal Kolo Muani": "Frankreich", "Mike Maignan": "Frankreich", "Hugo Lloris": "Frankreich",
      "Theo Hernández": "Frankreich", "Lucas Hernández": "Frankreich", "Ferland Mendy": "Frankreich",
      "Benjamin Pavard": "Frankreich", "Alessandro Bastoni": "Italien", "Giorgio Chiellini": "Italien",
      "Leonardo Bonucci": "Italien", "Francesco Acerbi": "Italien", "Nicolò Barella": "Italien",
      "Jorginho": "Italien", "Manuel Locatelli": "Italien", "Sandro Tonali": "Italien",
      "Gianluigi Donnarumma": "Italien", "Ciro Immobile": "Italien", "Lorenzo Insigne": "Italien",
      "Federico Chiesa": "Italien", "Domenico Berardi": "Italien", "Giacomo Raspadori": "Italien",
      "Takefusa Kubo": "Japan", "Kaoru Mitoma": "Japan", "Ritsu Dōan": "Japan",
      "Daichi Kamada": "Japan", "Hwang Hee-chan": "Südkorea", "Lee Kang-in": "Südkorea",
      "Kim Min-jae": "Südkorea", "Mehdi Taremi": "Iran", "Sardar Azmoun": "Iran",
      "Alireza Jahanbakhsh": "Iran", "Hakim Ziyech": "Marokko", "Youssef En-Nesyri": "Marokko",
      "Sofiane Boufal": "Marokko", "Yassine Bounou": "Marokko", "Noussair Mazraoui": "Marokko",
      "Ismaël Bennacer": "Algerien", "Islam Slimani": "Algerien", "Yacine Brahimi": "Algerien"
    };
    return nationalityMap[name] || "Unbekannt";
  };

  // Bestimme Alter basierend auf Name (vereinfacht, sollte aus API kommen)
  const getAge = (name) => {
    const ageMap = {
      "Cristiano Ronaldo": 39, "Lionel Messi": 37, "Toni Kroos": 34, "Robert Lewandowski": 35,
      "Mohamed Salah": 32, "Kylian Mbappé": 25, "Erling Haaland": 24, "Kevin De Bruyne": 33,
      "Virgil van Dijk": 33, "Manuel Neuer": 38, "Luka Modrić": 39, "Karim Benzema": 36,
      "Neymar Jr": 32, "Sergio Ramos": 38, "Thiago Silva": 40, "Gareth Bale": 35,
      "Zlatan Ibrahimović": 43, "Andrés Iniesta": 40, "Wayne Rooney": 39, "Andrea Pirlo": 45,
      "Xabi Alonso": 42, "Philipp Lahm": 40, "David Beckham": 49, "Ronaldinho": 44,
      "Steven Gerrard": 44, "Frank Lampard": 46, "Arjen Robben": 40, "Iker Casillas": 43,
      "Gianluigi Buffon": 46, "Paul Pogba": 31, "Jude Bellingham": 21, "Vinícius Júnior": 24,
      "Jamal Musiala": 21, "Pedri": 22, "Bukayo Saka": 23, "Federico Valverde": 26,
      "Rafael Leão": 25, "Alphonso Davies": 24, "Achraf Hakimi": 26, "Frenkie de Jong": 27,
      "Marquinhos": 30, "Rodri": 28, "Bernardo Silva": 30, "Son Heung-min": 32,
      "Sadio Mané": 32, "Raheem Sterling": 30, "Harry Kane": 31, "Lautaro Martínez": 27,
      "Dušan Vlahović": 24, "Victor Osimhen": 25, "Casemiro": 32, "Antoine Griezmann": 33,
      "Marc-André ter Stegen": 32, "Joshua Kimmich": 29, "Marco Verratti": 32, "Jan Oblak": 31,
      "Rúben Dias": 27, "João Cancelo": 30, "Trent Alexander-Arnold": 26, "Andrew Robertson": 30,
      "İlkay Gündoğan": 34, "İvan Rakitić": 36, "Mats Hummels": 35, "Marco Reus": 35,
      "Pierre-Emerick Aubameyang": 35, "Romelu Lukaku": 31, "Eden Hazard": 33, "Thibaut Courtois": 32,
      "Alisson": 32, "Ederson": 31, "Riyad Mahrez": 33, "Gabriel Jesus": 27,
      "Philippe Coutinho": 32, "Roberto Firmino": 33, "Fabinho": 31, "Allan": 33,
      "Fred": 31, "Lucas Paquetá": 27, "Richarlison": 27, "Raphinha": 27,
      "Antony": 24, "Bruno Guimarães": 27, "João Félix": 25, "Gonçalo Ramos": 23,
      "Rafael Silva": 31, "Diogo Jota": 28, "Rúben Neves": 27, "Matthijs de Ligt": 25,
      "Memphis Depay": 30, "Donny van de Beek": 27, "Cody Gakpo": 25, "Xavi Simons": 21,
      "Wout Weghorst": 32, "Luuk de Jong": 34, "Denzel Dumfries": 28, "Nathan Aké": 29,
      "Daley Blind": 34, "Georginio Wijnaldum": 34, "Leroy Sané": 29, "Serge Gnabry": 29,
      "Kingsley Coman": 28, "Leon Goretzka": 30, "Mason Mount": 26, "Phil Foden": 24,
      "Marcus Rashford": 27, "Jadon Sancho": 24, "Declan Rice": 26, "Kalvin Phillips": 29,
      "Jack Grealish": 29, "Reece James": 25, "Ben Chilwell": 28, "Luke Shaw": 29,
      "John Stones": 30, "Harry Maguire": 31, "Kyle Walker": 34, "Kieran Trippier": 34,
      "Jordan Pickford": 31, "Aaron Ramsdale": 26, "Nick Pope": 32, "Emiliano Martínez": 32,
      "Ángel Di María": 36, "Paulo Dybala": 31, "Sergio Agüero": 36, "Gonzalo Higuaín": 36,
      "Javier Mascherano": 40, "Javier Zanetti": 51, "Esteban Cambiasso": 44, "Diego Milito": 45,
      "Carlos Tevez": 40, "Fernando Torres": 40, "David Villa": 42, "Raúl": 47,
      "Fernando Morientes": 48, "Carles Puyol": 46, "Gerard Piqué": 37, "Xavi Hernández": 44,
      "Sergio Busquets": 36, "David Silva": 38, "Juan Mata": 36, "Cesc Fàbregas": 37,
      "Santi Cazorla": 39, "Fernando Hierro": 56, "Luis Suárez": 37, "Edinson Cavani": 37,
      "Diego Forlán": 45, "Darwin Núñez": 25, "Rodrygo": 24, "Eduardo Camavinga": 22,
      "Aurélien Tchouaméni": 24, "Jules Koundé": 26, "Dayot Upamecano": 26, "Ibrahima Konaté": 25,
      "William Saliba": 24, "Christopher Nkunku": 27, "Ousmane Dembélé": 27, "Marcus Thuram": 27,
      "Randal Kolo Muani": 26, "Mike Maignan": 29, "Hugo Lloris": 38, "Theo Hernández": 27,
      "Lucas Hernández": 28, "Ferland Mendy": 29, "Benjamin Pavard": 28, "Alessandro Bastoni": 25,
      "Giorgio Chiellini": 40, "Leonardo Bonucci": 37, "Francesco Acerbi": 36, "Nicolò Barella": 27,
      "Jorginho": 33, "Manuel Locatelli": 27, "Sandro Tonali": 24, "Gianluigi Donnarumma": 25,
      "Ciro Immobile": 34, "Lorenzo Insigne": 33, "Federico Chiesa": 27, "Domenico Berardi": 30,
      "Giacomo Raspadori": 24, "Takefusa Kubo": 23, "Kaoru Mitoma": 27, "Ritsu Dōan": 26,
      "Daichi Kamada": 28, "Hwang Hee-chan": 28, "Lee Kang-in": 23, "Kim Min-jae": 28,
      "Mehdi Taremi": 32, "Sardar Azmoun": 30, "Alireza Jahanbakhsh": 31, "Hakim Ziyech": 31,
      "Youssef En-Nesyri": 27, "Sofiane Boufal": 31, "Yassine Bounou": 33, "Noussair Mazraoui": 27,
      "Ismaël Bennacer": 27, "Riyad Mahrez": 33, "Islam Slimani": 36, "Yacine Brahimi": 34
    };
    return ageMap[name] || 30; // Fallback auf 30 wenn unbekannt
  };

  return {
    ...player,
    nationality: player.nationality || getNationality(player.name, player.clubs),
    age: player.age || getAge(player.name),
    currentLeague: player.currentLeague || getLeague(currentClub),
    currentClub: player.currentClub || currentClub
  };
};

// Beispieldaten - Später könntest du diese aus einer API laden
const PLAYERS_DATA_RAW = [
  {
    id: 1,
    name: "Cristiano Ronaldo",
    clubs: ["Sporting Lissabon", "Manchester United", "Real Madrid", "Juventus Turin", "Al-Nassr"],
    options: ["Cristiano Ronaldo", "Luis Figo", "Bruno Fernandes", "Nani"]
  },
  {
    id: 2,
    name: "Lionel Messi",
    clubs: ["FC Barcelona", "PSG", "Inter Miami"],
    options: ["Neymar Jr", "Lionel Messi", "Angel Di Maria", "Luis Suarez"]
  },
  {
    id: 3,
    name: "Toni Kroos",
    clubs: ["Hansa Rostock", "Bayer Leverkusen", "Bayern München", "Real Madrid"],
    options: ["Thomas Müller", "Toni Kroos", "Mesut Özil", "Bastian Schweinsteiger"]
  },
  {
    id: 4,
    name: "Robert Lewandowski",
    clubs: ["Lech Posen", "Borussia Dortmund", "Bayern München", "FC Barcelona"],
    options: ["Robert Lewandowski", "Mario Götze", "Marco Reus", "Pierre-Emerick Aubameyang"]
  },
  {
    id: 5,
    name: "Mohamed Salah",
    clubs: ["Al Mokawloon", "FC Basel", "Chelsea", "AC Fiorentina", "AS Rom", "Liverpool"],
    options: ["Mohamed Salah", "Sadio Mané", "Roberto Firmino", "Diogo Jota"]
  },
  {
    id: 6,
    name: "Kylian Mbappé",
    clubs: ["AS Monaco", "PSG", "Real Madrid"],
    options: ["Kylian Mbappé", "Ousmane Dembélé", "Antoine Griezmann", "Karim Benzema"]
  },
  {
    id: 7,
    name: "Erling Haaland",
    clubs: ["Bryne FK", "Molde FK", "RB Salzburg", "Borussia Dortmund", "Manchester City"],
    options: ["Erling Haaland", "Jadon Sancho", "Jude Bellingham", "Karim Adeyemi"]
  },
  {
    id: 8,
    name: "Kevin De Bruyne",
    clubs: ["KRC Genk", "Chelsea", "Werder Bremen", "Wolfsburg", "Manchester City"],
    options: ["Kevin De Bruyne", "Eden Hazard", "Romelu Lukaku", "Thibaut Courtois"]
  },
  {
    id: 9,
    name: "Virgil van Dijk",
    clubs: ["Groningen", "Celtic Glasgow", "Southampton", "Liverpool"],
    options: ["Virgil van Dijk", "Matthijs de Ligt", "Frenkie de Jong", "Memphis Depay"]
  },
  {
    id: 10,
    name: "Manuel Neuer",
    clubs: ["Schalke 04", "Bayern München"],
    options: ["Manuel Neuer", "Marc-André ter Stegen", "Bernd Leno", "Kevin Trapp"]
  },
  {
    id: 11,
    name: "Luka Modrić",
    clubs: ["Dinamo Zagreb", "Inter Zaprešić", "Tottenham Hotspur", "Real Madrid"],
    options: ["Luka Modrić", "Ivan Rakitić", "Mateo Kovačić", "Marcelo Brozović"]
  },
  {
    id: 12,
    name: "Karim Benzema",
    clubs: ["Olympique Lyon", "Real Madrid", "Al-Ittihad"],
    options: ["Karim Benzema", "Olivier Giroud", "Antoine Griezmann", "Kylian Mbappé"]
  },
  {
    id: 13,
    name: "Neymar Jr",
    clubs: ["Santos", "FC Barcelona", "PSG", "Al-Hilal"],
    options: ["Neymar Jr", "Philippe Coutinho", "Gabriel Jesus", "Casemiro"]
  },
  {
    id: 14,
    name: "Sergio Ramos",
    clubs: ["Sevilla FC", "Real Madrid", "PSG", "Sevilla FC"],
    options: ["Sergio Ramos", "Gerard Piqué", "Carles Puyol", "Iker Casillas"]
  },
  {
    id: 15,
    name: "Thiago Silva",
    clubs: ["Fluminense", "FC Porto", "AC Mailand", "Paris Saint-Germain", "Chelsea"],
    options: ["Thiago Silva", "David Luiz", "Marquinhos", "Alex Sandro"]
  },
  {
    id: 16,
    name: "Gareth Bale",
    clubs: ["Southampton", "Tottenham Hotspur", "Real Madrid", "Los Angeles FC"],
    options: ["Gareth Bale", "Aaron Ramsey", "Ryan Giggs", "Daniel James"]
  },
  {
    id: 17,
    name: "Zlatan Ibrahimović",
    clubs: ["Malmö FF", "Ajax Amsterdam", "Juventus Turin", "Inter Mailand", "FC Barcelona", "AC Mailand", "PSG", "Manchester United", "LA Galaxy", "AC Mailand"],
    options: ["Zlatan Ibrahimović", "Henrik Larsson", "Fredrik Ljungberg", "Emil Forsberg"]
  },
  {
    id: 18,
    name: "Andrés Iniesta",
    clubs: ["FC Barcelona", "Vissel Kobe"],
    options: ["Andrés Iniesta", "Xavi Hernández", "Sergio Busquets", "David Silva"]
  },
  {
    id: 19,
    name: "Wayne Rooney",
    clubs: ["Everton", "Manchester United", "DC United", "Derby County"],
    options: ["Wayne Rooney", "Michael Owen", "Steven Gerrard", "Frank Lampard"]
  },
  {
    id: 20,
    name: "Andrea Pirlo",
    clubs: ["Brescia", "Inter Mailand", "AC Mailand", "Juventus Turin", "New York City FC"],
    options: ["Andrea Pirlo", "Gennaro Gattuso", "Claudio Marchisio", "Marco Verratti"]
  },
  {
    id: 21,
    name: "Xabi Alonso",
    clubs: ["Real Sociedad", "Liverpool", "Real Madrid", "Bayern München"],
    options: ["Xabi Alonso", "Iker Casillas", "Fernando Torres", "David Villa"]
  },
  {
    id: 22,
    name: "Philipp Lahm",
    clubs: ["Bayern München"],
    options: ["Philipp Lahm", "Bastian Schweinsteiger", "Thomas Müller", "Manuel Neuer"]
  },
  {
    id: 23,
    name: "David Beckham",
    clubs: ["Manchester United", "Real Madrid", "LA Galaxy", "AC Mailand", "Paris Saint-Germain"],
    options: ["David Beckham", "Ryan Giggs", "Paul Scholes", "Gary Neville"]
  },
  {
    id: 24,
    name: "Ronaldinho",
    clubs: ["Grêmio", "Paris Saint-Germain", "FC Barcelona", "AC Mailand", "Flamengo", "Atlético Mineiro"],
    options: ["Ronaldinho", "Rivaldo", "Kaká", "Robinho"]
  },
  {
    id: 25,
    name: "Steven Gerrard",
    clubs: ["Liverpool", "LA Galaxy"],
    options: ["Steven Gerrard", "Jamie Carragher", "Fernando Torres", "Luis Suárez"]
  },
  {
    id: 26,
    name: "Frank Lampard",
    clubs: ["West Ham United", "Swansea City", "Chelsea", "Manchester City", "New York City FC"],
    options: ["Frank Lampard", "John Terry", "Didier Drogba", "Ashley Cole"]
  },
  {
    id: 27,
    name: "Arjen Robben",
    clubs: ["FC Groningen", "PSV Eindhoven", "Chelsea", "Real Madrid", "Bayern München", "FC Groningen"],
    options: ["Arjen Robben", "Wesley Sneijder", "Robin van Persie", "Ruud van Nistelrooy"]
  },
  {
    id: 28,
    name: "Iker Casillas",
    clubs: ["Real Madrid", "FC Porto"],
    options: ["Iker Casillas", "Sergio Ramos", "Raúl", "Fernando Hierro"]
  },
  {
    id: 29,
    name: "Gianluigi Buffon",
    clubs: ["Parma", "Juventus Turin", "Paris Saint-Germain", "Juventus Turin", "Parma"],
    options: ["Gianluigi Buffon", "Gianluigi Donnarumma", "Andrea Pirlo", "Giorgio Chiellini"]
  },
  {
    id: 30,
    name: "Paul Pogba",
    clubs: ["Le Havre", "Manchester United", "Juventus Turin", "Manchester United", "Juventus Turin"],
    options: ["Paul Pogba", "N'Golo Kanté", "Antoine Griezmann", "Olivier Giroud"]
  },
  {
    id: 31,
    name: "Jude Bellingham",
    clubs: ["Birmingham City", "Borussia Dortmund", "Real Madrid"],
    options: ["Jude Bellingham", "Mason Mount", "Phil Foden", "Bukayo Saka"]
  },
  {
    id: 32,
    name: "Vinícius Júnior",
    clubs: ["Flamengo", "Real Madrid"],
    options: ["Vinícius Júnior", "Rodrygo", "Gabriel Martinelli", "Antony"]
  },
  {
    id: 33,
    name: "Jamal Musiala",
    clubs: ["Southampton", "Chelsea", "Bayern München"],
    options: ["Jamal Musiala", "Florian Wirtz", "Kai Havertz", "Timo Werner"]
  },
  {
    id: 34,
    name: "Pedri",
    clubs: ["Las Palmas", "FC Barcelona"],
    options: ["Pedri", "Gavi", "Ansu Fati", "Ferrán Torres"]
  },
  {
    id: 35,
    name: "Bukayo Saka",
    clubs: ["Arsenal"],
    options: ["Bukayo Saka", "Emile Smith Rowe", "Gabriel Martinelli", "Eddie Nketiah"]
  },
  {
    id: 36,
    name: "Federico Valverde",
    clubs: ["Peñarol", "Real Madrid Castilla", "Deportivo La Coruña", "Real Madrid"],
    options: ["Federico Valverde", "Rodrygo", "Eduardo Camavinga", "Aurélien Tchouaméni"]
  },
  {
    id: 37,
    name: "Rafael Leão",
    clubs: ["Sporting Lissabon", "Lille", "AC Mailand"],
    options: ["Rafael Leão", "João Félix", "Gonçalo Ramos", "Rafael Silva"]
  },
  {
    id: 38,
    name: "Alphonso Davies",
    clubs: ["Vancouver Whitecaps", "Bayern München"],
    options: ["Alphonso Davies", "Jonathan David", "Cyle Larin", "Tajon Buchanan"]
  },
  {
    id: 39,
    name: "Achraf Hakimi",
    clubs: ["Real Madrid", "Borussia Dortmund", "Inter Mailand", "PSG"],
    options: ["Achraf Hakimi", "Hakim Ziyech", "Youssef En-Nesyri", "Sofiane Boufal"]
  },
  {
    id: 40,
    name: "Frenkie de Jong",
    clubs: ["Willem II", "Ajax Amsterdam", "FC Barcelona"],
    options: ["Frenkie de Jong", "Matthijs de Ligt", "Donny van de Beek", "Memphis Depay"]
  },
  {
    id: 41,
    name: "Marquinhos",
    clubs: ["Corinthians", "AS Rom", "PSG"],
    options: ["Marquinhos", "Thiago Silva", "David Luiz", "Alex Sandro"]
  },
  {
    id: 42,
    name: "Rodri",
    clubs: ["Villarreal", "Atlético Madrid", "Manchester City"],
    options: ["Rodri", "Saúl Ñíguez", "Koke", "Marcos Llorente"]
  },
  {
    id: 43,
    name: "Bernardo Silva",
    clubs: ["Benfica", "AS Monaco", "Manchester City"],
    options: ["Bernardo Silva", "João Cancelo", "Rúben Dias", "Rafael Leão"]
  },
  {
    id: 44,
    name: "Son Heung-min",
    clubs: ["FC Seoul", "Hamburger SV", "Bayer Leverkusen", "Tottenham Hotspur"],
    options: ["Son Heung-min", "Park Ji-sung", "Ki Sung-yueng", "Lee Chung-yong"]
  },
  {
    id: 45,
    name: "Sadio Mané",
    clubs: ["Metz", "Red Bull Salzburg", "Southampton", "Liverpool", "Bayern München", "Al-Nassr"],
    options: ["Sadio Mané", "Mohamed Salah", "Roberto Firmino", "Diogo Jota"]
  },
  {
    id: 46,
    name: "Raheem Sterling",
    clubs: ["Queens Park Rangers", "Liverpool", "Manchester City", "Chelsea"],
    options: ["Raheem Sterling", "Jadon Sancho", "Marcus Rashford", "Bukayo Saka"]
  },
  {
    id: 47,
    name: "Harry Kane",
    clubs: ["Tottenham Hotspur", "Bayern München"],
    options: ["Harry Kane", "Jamie Vardy", "Marcus Rashford", "Mason Mount"]
  },
  {
    id: 48,
    name: "Lautaro Martínez",
    clubs: ["Racing Club", "Inter Mailand"],
    options: ["Lautaro Martínez", "Paulo Dybala", "Ángel Di María", "Sergio Agüero"]
  },
  {
    id: 49,
    name: "Dušan Vlahović",
    clubs: ["Partizan Belgrad", "Fiorentina", "Juventus Turin"],
    options: ["Dušan Vlahović", "Sergej Milinković-Savić", "Aleksandar Mitrović", "Luka Jović"]
  },
  {
    id: 50,
    name: "Victor Osimhen",
    clubs: ["VfL Wolfsburg", "Charleroi", "Lille", "Napoli"],
    options: ["Victor Osimhen", "Kelechi Iheanacho", "Alex Iwobi", "Wilfred Ndidi"]
  },
  {
    id: 51,
    name: "Kylian Mbappé",
    clubs: ["AS Monaco", "PSG", "Real Madrid"],
    options: ["Kylian Mbappé", "Ousmane Dembélé", "Antoine Griezmann", "Karim Benzema"]
  },
  {
    id: 52,
    name: "Luka Modrić",
    clubs: ["Dinamo Zagreb", "Inter Zaprešić", "Tottenham Hotspur", "Real Madrid"],
    options: ["Luka Modrić", "Ivan Rakitić", "Mateo Kovačić", "Marcelo Brozović"]
  },
  {
    id: 53,
    name: "Casemiro",
    clubs: ["São Paulo", "Real Madrid", "Manchester United"],
    options: ["Casemiro", "Fabinho", "Fred", "Allan"]
  },
  {
    id: 54,
    name: "Antoine Griezmann",
    clubs: ["Real Sociedad", "Atlético Madrid", "FC Barcelona", "Atlético Madrid"],
    options: ["Antoine Griezmann", "Olivier Giroud", "Karim Benzema", "Kylian Mbappé"]
  },
  {
    id: 55,
    name: "Marc-André ter Stegen",
    clubs: ["Borussia Mönchengladbach", "FC Barcelona"],
    options: ["Marc-André ter Stegen", "Manuel Neuer", "Bernd Leno", "Kevin Trapp"]
  },
  {
    id: 56,
    name: "Joshua Kimmich",
    clubs: ["VfB Stuttgart", "RB Leipzig", "Bayern München"],
    options: ["Joshua Kimmich", "Leon Goretzka", "Serge Gnabry", "Leroy Sané"]
  },
  {
    id: 57,
    name: "Marco Verratti",
    clubs: ["Pescara", "PSG", "Al-Arabi"],
    options: ["Marco Verratti", "Jorginho", "Nicolò Barella", "Manuel Locatelli"]
  },
  {
    id: 58,
    name: "Jan Oblak",
    clubs: ["Olimpija Ljubljana", "Benfica", "Atlético Madrid"],
    options: ["Jan Oblak", "Samir Handanović", "Josip Iličić", "Benjamin Šeško"]
  },
  {
    id: 59,
    name: "Rúben Dias",
    clubs: ["Benfica", "Manchester City"],
    options: ["Rúben Dias", "João Cancelo", "Bernardo Silva", "Rafael Leão"]
  },
  {
    id: 60,
    name: "João Cancelo",
    clubs: ["Benfica", "Valencia", "Inter Mailand", "Juventus Turin", "Manchester City", "Bayern München", "Barcelona"],
    options: ["João Cancelo", "Rúben Dias", "Bernardo Silva", "Rafael Leão"]
  },
  {
    id: 61,
    name: "Trent Alexander-Arnold",
    clubs: ["Liverpool"],
    options: ["Trent Alexander-Arnold", "Andy Robertson", "Virgil van Dijk", "Mohamed Salah"]
  },
  {
    id: 62,
    name: "Andrew Robertson",
    clubs: ["Queen's Park", "Dundee United", "Hull City", "Liverpool"],
    options: ["Andrew Robertson", "Trent Alexander-Arnold", "Virgil van Dijk", "Alisson"]
  },
  {
    id: 63,
    name: "İlkay Gündoğan",
    clubs: ["VfL Bochum", "1. FC Nürnberg", "Borussia Dortmund", "Manchester City", "FC Barcelona"],
    options: ["İlkay Gündoğan", "Mesut Özil", "Emre Can", "Leroy Sané"]
  },
  {
    id: 64,
    name: "İvan Rakitić",
    clubs: ["FC Basel", "Schalke 04", "Sevilla FC", "FC Barcelona", "Sevilla FC"],
    options: ["İvan Rakitić", "Luka Modrić", "Mateo Kovačić", "Marcelo Brozović"]
  },
  {
    id: 65,
    name: "Mats Hummels",
    clubs: ["Bayern München", "Borussia Dortmund", "Bayern München", "Borussia Dortmund"],
    options: ["Mats Hummels", "Jérôme Boateng", "Benedikt Höwedes", "Per Mertesacker"]
  },
  {
    id: 66,
    name: "Marco Reus",
    clubs: ["Borussia Dortmund", "Borussia Mönchengladbach", "Borussia Dortmund"],
    options: ["Marco Reus", "Mario Götze", "Julian Brandt", "Mats Hummels"]
  },
  {
    id: 67,
    name: "Pierre-Emerick Aubameyang",
    clubs: ["AC Mailand", "Dijon", "Lille", "AS Monaco", "Saint-Étienne", "Borussia Dortmund", "Arsenal", "FC Barcelona", "Chelsea", "Marseille"],
    options: ["Pierre-Emerick Aubameyang", "Alexandre Lacazette", "Olivier Giroud", "Karim Benzema"]
  },
  {
    id: 68,
    name: "Romelu Lukaku",
    clubs: ["Anderlecht", "Chelsea", "West Bromwich Albion", "Everton", "Manchester United", "Inter Mailand", "Chelsea", "AS Rom", "Chelsea"],
    options: ["Romelu Lukaku", "Eden Hazard", "Kevin De Bruyne", "Thibaut Courtois"]
  },
  {
    id: 69,
    name: "Eden Hazard",
    clubs: ["Lille", "Chelsea", "Real Madrid"],
    options: ["Eden Hazard", "Romelu Lukaku", "Kevin De Bruyne", "Thibaut Courtois"]
  },
  {
    id: 70,
    name: "Thibaut Courtois",
    clubs: ["Genk", "Atlético Madrid", "Chelsea", "Real Madrid"],
    options: ["Thibaut Courtois", "Simon Mignolet", "Eden Hazard", "Kevin De Bruyne"]
  },
  {
    id: 71,
    name: "Alisson",
    clubs: ["Internacional", "AS Rom", "Liverpool"],
    options: ["Alisson", "Ederson", "Gabriel Jesus", "Roberto Firmino"]
  },
  {
    id: 72,
    name: "Ederson",
    clubs: ["Benfica", "Manchester City"],
    options: ["Ederson", "Alisson", "Gabriel Jesus", "Roberto Firmino"]
  },
  {
    id: 73,
    name: "Riyad Mahrez",
    clubs: ["Le Havre", "Leicester City", "Manchester City", "Al-Ahli"],
    options: ["Riyad Mahrez", "Islam Slimani", "Yacine Brahimi", "Sofiane Feghouli"]
  },
  {
    id: 74,
    name: "Gabriel Jesus",
    clubs: ["Palmeiras", "Manchester City", "Arsenal"],
    options: ["Gabriel Jesus", "Roberto Firmino", "Philippe Coutinho", "Casemiro"]
  },
  {
    id: 75,
    name: "Philippe Coutinho",
    clubs: ["Vasco da Gama", "Inter Mailand", "Espanyol", "Liverpool", "FC Barcelona", "Bayern München", "Aston Villa", "Al-Duhail"],
    options: ["Philippe Coutinho", "Roberto Firmino", "Gabriel Jesus", "Casemiro"]
  },
  {
    id: 76,
    name: "Roberto Firmino",
    clubs: ["Figueirense", "Hoffenheim", "Liverpool", "Al-Ahli"],
    options: ["Roberto Firmino", "Philippe Coutinho", "Gabriel Jesus", "Casemiro"]
  },
  {
    id: 77,
    name: "Fabinho",
    clubs: ["Fluminense", "Rio Ave", "AS Monaco", "Liverpool", "Al-Ittihad"],
    options: ["Fabinho", "Casemiro", "Fred", "Allan"]
  },
  {
    id: 78,
    name: "Allan",
    clubs: ["Vasco da Gama", "Udinese", "Napoli", "Everton", "Al-Wahda"],
    options: ["Allan", "Casemiro", "Fabinho", "Fred"]
  },
  {
    id: 79,
    name: "Fred",
    clubs: ["Internacional", "Shakhtar Donetsk", "Manchester United", "Fenerbahçe"],
    options: ["Fred", "Casemiro", "Fabinho", "Allan"]
  },
  {
    id: 80,
    name: "Lucas Paquetá",
    clubs: ["Flamengo", "AC Mailand", "Olympique Lyon", "West Ham United"],
    options: ["Lucas Paquetá", "Philippe Coutinho", "Roberto Firmino", "Gabriel Jesus"]
  },
  {
    id: 81,
    name: "Richarlison",
    clubs: ["América Mineiro", "Fluminense", "Watford", "Everton", "Tottenham Hotspur"],
    options: ["Richarlison", "Gabriel Jesus", "Roberto Firmino", "Philippe Coutinho"]
  },
  {
    id: 82,
    name: "Raphinha",
    clubs: ["Avaí", "Vitória Guimarães", "Sporting Lissabon", "Rennes", "Leeds United", "FC Barcelona"],
    options: ["Raphinha", "Gabriel Jesus", "Roberto Firmino", "Philippe Coutinho"]
  },
  {
    id: 83,
    name: "Antony",
    clubs: ["São Paulo", "Ajax Amsterdam", "Manchester United"],
    options: ["Antony", "Gabriel Jesus", "Raphinha", "Richarlison"]
  },
  {
    id: 84,
    name: "Bruno Guimarães",
    clubs: ["Audax", "Athletico Paranaense", "Olympique Lyon", "Newcastle United"],
    options: ["Bruno Guimarães", "Casemiro", "Fabinho", "Fred"]
  },
  {
    id: 85,
    name: "João Félix",
    clubs: ["Benfica", "Atlético Madrid", "Chelsea", "FC Barcelona"],
    options: ["João Félix", "Rafael Leão", "Gonçalo Ramos", "Bernardo Silva"]
  },
  {
    id: 86,
    name: "Gonçalo Ramos",
    clubs: ["Benfica", "Paris Saint-Germain"],
    options: ["Gonçalo Ramos", "João Félix", "Rafael Leão", "Bernardo Silva"]
  },
  {
    id: 87,
    name: "Rafael Silva",
    clubs: ["Benfica", "Braga", "Real Betis"],
    options: ["Rafael Silva", "Rafael Leão", "João Félix", "Gonçalo Ramos"]
  },
  {
    id: 88,
    name: "Diogo Jota",
    clubs: ["Paços de Ferreira", "Atlético Madrid", "Wolverhampton Wanderers", "Liverpool"],
    options: ["Diogo Jota", "Roberto Firmino", "Mohamed Salah", "Sadio Mané"]
  },
  {
    id: 89,
    name: "Rúben Neves",
    clubs: ["FC Porto", "Wolverhampton Wanderers", "Al-Hilal"],
    options: ["Rúben Neves", "João Moutinho", "Bernardo Silva", "Rúben Dias"]
  },
  {
    id: 90,
    name: "Matthijs de Ligt",
    clubs: ["Ajax Amsterdam", "Juventus Turin", "Bayern München"],
    options: ["Matthijs de Ligt", "Virgil van Dijk", "Frenkie de Jong", "Memphis Depay"]
  },
  {
    id: 91,
    name: "Memphis Depay",
    clubs: ["PSV Eindhoven", "Manchester United", "Olympique Lyon", "FC Barcelona", "Atlético Madrid"],
    options: ["Memphis Depay", "Virgil van Dijk", "Frenkie de Jong", "Matthijs de Ligt"]
  },
  {
    id: 92,
    name: "Donny van de Beek",
    clubs: ["Ajax Amsterdam", "Manchester United", "Everton", "Eintracht Frankfurt"],
    options: ["Donny van de Beek", "Frenkie de Jong", "Matthijs de Ligt", "Memphis Depay"]
  },
  {
    id: 93,
    name: "Cody Gakpo",
    clubs: ["PSV Eindhoven", "Liverpool"],
    options: ["Cody Gakpo", "Memphis Depay", "Frenkie de Jong", "Virgil van Dijk"]
  },
  {
    id: 94,
    name: "Xavi Simons",
    clubs: ["FC Barcelona", "Paris Saint-Germain", "PSV Eindhoven", "RB Leipzig", "Paris Saint-Germain"],
    options: ["Xavi Simons", "Frenkie de Jong", "Memphis Depay", "Cody Gakpo"]
  },
  {
    id: 95,
    name: "Wout Weghorst",
    clubs: ["Emmen", "Heracles Almelo", "AZ Alkmaar", "Wolfsburg", "Burnley", "Beşiktaş", "Manchester United", "Hoffenheim"],
    options: ["Wout Weghorst", "Memphis Depay", "Luuk de Jong", "Vincent Janssen"]
  },
  {
    id: 96,
    name: "Luuk de Jong",
    clubs: ["De Graafschap", "Twente", "Borussia Mönchengladbach", "PSV Eindhoven", "Sevilla FC", "FC Barcelona", "PSV Eindhoven"],
    options: ["Luuk de Jong", "Wout Weghorst", "Memphis Depay", "Vincent Janssen"]
  },
  {
    id: 97,
    name: "Denzel Dumfries",
    clubs: ["Sparta Rotterdam", "Heerenveen", "PSV Eindhoven", "Inter Mailand"],
    options: ["Denzel Dumfries", "Virgil van Dijk", "Nathan Aké", "Daley Blind"]
  },
  {
    id: 98,
    name: "Nathan Aké",
    clubs: ["Feyenoord", "Watford", "Bournemouth", "Manchester City"],
    options: ["Nathan Aké", "Virgil van Dijk", "Denzel Dumfries", "Daley Blind"]
  },
  {
    id: 99,
    name: "Daley Blind",
    clubs: ["Ajax Amsterdam", "Manchester United", "Ajax Amsterdam", "Bayern München", "Girona"],
    options: ["Daley Blind", "Virgil van Dijk", "Nathan Aké", "Denzel Dumfries"]
  },
  {
    id: 100,
    name: "Georginio Wijnaldum",
    clubs: ["Feyenoord", "PSV Eindhoven", "Newcastle United", "Liverpool", "Paris Saint-Germain", "AS Rom", "Al-Ettifaq"],
    options: ["Georginio Wijnaldum", "Frenkie de Jong", "Memphis Depay", "Virgil van Dijk"]
  },
  {
    id: 101,
    name: "Leroy Sané",
    clubs: ["Schalke 04", "Manchester City", "Bayern München"],
    options: ["Leroy Sané", "Serge Gnabry", "Kingsley Coman", "Thomas Müller"]
  },
  {
    id: 102,
    name: "Serge Gnabry",
    clubs: ["Arsenal", "West Bromwich Albion", "Werder Bremen", "Bayern München"],
    options: ["Serge Gnabry", "Leroy Sané", "Kingsley Coman", "Thomas Müller"]
  },
  {
    id: 103,
    name: "Kingsley Coman",
    clubs: ["Paris Saint-Germain", "Juventus Turin", "Bayern München"],
    options: ["Kingsley Coman", "Leroy Sané", "Serge Gnabry", "Thomas Müller"]
  },
  {
    id: 104,
    name: "Leon Goretzka",
    clubs: ["VfL Bochum", "Schalke 04", "Bayern München"],
    options: ["Leon Goretzka", "Joshua Kimmich", "Serge Gnabry", "Leroy Sané"]
  },
  {
    id: 105,
    name: "Mason Mount",
    clubs: ["Vitesse", "Derby County", "Chelsea", "Manchester United"],
    options: ["Mason Mount", "Jude Bellingham", "Phil Foden", "Bukayo Saka"]
  },
  {
    id: 106,
    name: "Phil Foden",
    clubs: ["Manchester City"],
    options: ["Phil Foden", "Mason Mount", "Jude Bellingham", "Bukayo Saka"]
  },
  {
    id: 107,
    name: "Marcus Rashford",
    clubs: ["Manchester United"],
    options: ["Marcus Rashford", "Mason Greenwood", "Jadon Sancho", "Anthony Martial"]
  },
  {
    id: 108,
    name: "Jadon Sancho",
    clubs: ["Watford", "Manchester City", "Borussia Dortmund", "Manchester United"],
    options: ["Jadon Sancho", "Marcus Rashford", "Raheem Sterling", "Bukayo Saka"]
  },
  {
    id: 109,
    name: "Declan Rice",
    clubs: ["West Ham United", "Arsenal"],
    options: ["Declan Rice", "Mason Mount", "Jude Bellingham", "Kalvin Phillips"]
  },
  {
    id: 110,
    name: "Kalvin Phillips",
    clubs: ["Leeds United", "Manchester City", "West Ham United"],
    options: ["Kalvin Phillips", "Declan Rice", "Mason Mount", "Jude Bellingham"]
  },
  {
    id: 111,
    name: "Jack Grealish",
    clubs: ["Notts County", "Aston Villa", "Manchester City"],
    options: ["Jack Grealish", "Mason Mount", "Phil Foden", "Bukayo Saka"]
  },
  {
    id: 112,
    name: "Reece James",
    clubs: ["Wigan Athletic", "Chelsea"],
    options: ["Reece James", "Trent Alexander-Arnold", "Kyle Walker", "Ben Chilwell"]
  },
  {
    id: 113,
    name: "Ben Chilwell",
    clubs: ["Huddersfield Town", "Leicester City", "Chelsea"],
    options: ["Ben Chilwell", "Luke Shaw", "Andrew Robertson", "Kieran Trippier"]
  },
  {
    id: 114,
    name: "Luke Shaw",
    clubs: ["Southampton", "Manchester United"],
    options: ["Luke Shaw", "Ben Chilwell", "Andrew Robertson", "Kieran Trippier"]
  },
  {
    id: 115,
    name: "John Stones",
    clubs: ["Barnsley", "Everton", "Manchester City"],
    options: ["John Stones", "Harry Maguire", "Kyle Walker", "Ben Chilwell"]
  },
  {
    id: 116,
    name: "Harry Maguire",
    clubs: ["Sheffield United", "Hull City", "Leicester City", "Manchester United"],
    options: ["Harry Maguire", "John Stones", "Kyle Walker", "Ben Chilwell"]
  },
  {
    id: 117,
    name: "Kyle Walker",
    clubs: ["Sheffield United", "Tottenham Hotspur", "Manchester City"],
    options: ["Kyle Walker", "Kieran Trippier", "Trent Alexander-Arnold", "Reece James"]
  },
  {
    id: 118,
    name: "Kieran Trippier",
    clubs: ["Manchester City", "Barnsley", "Burnley", "Tottenham Hotspur", "Atlético Madrid", "Newcastle United"],
    options: ["Kieran Trippier", "Kyle Walker", "Trent Alexander-Arnold", "Reece James"]
  },
  {
    id: 119,
    name: "Jordan Pickford",
    clubs: ["Darlington", "Alfreton Town", "Burton Albion", "Preston North End", "Sunderland", "Everton"],
    options: ["Jordan Pickford", "Nick Pope", "Aaron Ramsdale", "Dean Henderson"]
  },
  {
    id: 120,
    name: "Aaron Ramsdale",
    clubs: ["Sheffield United", "AFC Bournemouth", "Arsenal"],
    options: ["Aaron Ramsdale", "Jordan Pickford", "Nick Pope", "Dean Henderson"]
  },
  {
    id: 121,
    name: "Nick Pope",
    clubs: ["Charlton Athletic", "Bury", "Burnley", "Newcastle United"],
    options: ["Nick Pope", "Jordan Pickford", "Aaron Ramsdale", "Dean Henderson"]
  },
  {
    id: 122,
    name: "Emiliano Martínez",
    clubs: ["Independiente", "Arsenal", "Reading", "Getafe", "Aston Villa"],
    options: ["Emiliano Martínez", "Sergio Romero", "Franco Armani", "Gerónimo Rulli"]
  },
  {
    id: 123,
    name: "Ángel Di María",
    clubs: ["Rosario Central", "Benfica", "Real Madrid", "Manchester United", "Paris Saint-Germain", "Juventus Turin", "Benfica"],
    options: ["Ángel Di María", "Sergio Agüero", "Paulo Dybala", "Lautaro Martínez"]
  },
  {
    id: 124,
    name: "Paulo Dybala",
    clubs: ["Instituto", "Palermo", "Juventus Turin", "AS Rom"],
    options: ["Paulo Dybala", "Ángel Di María", "Lautaro Martínez", "Sergio Agüero"]
  },
  {
    id: 125,
    name: "Sergio Agüero",
    clubs: ["Independiente", "Atlético Madrid", "Manchester City", "FC Barcelona"],
    options: ["Sergio Agüero", "Paulo Dybala", "Ángel Di María", "Lautaro Martínez"]
  },
  {
    id: 126,
    name: "Gonzalo Higuaín",
    clubs: ["River Plate", "Real Madrid", "Napoli", "Juventus Turin", "AC Mailand", "Chelsea", "Inter Mailand"],
    options: ["Gonzalo Higuaín", "Sergio Agüero", "Paulo Dybala", "Ángel Di María"]
  },
  {
    id: 127,
    name: "Javier Mascherano",
    clubs: ["River Plate", "Corinthians", "West Ham United", "Liverpool", "FC Barcelona", "Hebei China Fortune"],
    options: ["Javier Mascherano", "Javier Zanetti", "Esteban Cambiasso", "Diego Milito"]
  },
  {
    id: 128,
    name: "Javier Zanetti",
    clubs: ["Talleres", "Banfield", "Inter Mailand"],
    options: ["Javier Zanetti", "Javier Mascherano", "Esteban Cambiasso", "Diego Milito"]
  },
  {
    id: 129,
    name: "Esteban Cambiasso",
    clubs: ["Independiente", "Real Madrid", "Inter Mailand", "Leicester City", "Olympiakos"],
    options: ["Esteban Cambiasso", "Javier Mascherano", "Javier Zanetti", "Diego Milito"]
  },
  {
    id: 130,
    name: "Diego Milito",
    clubs: ["Racing Club", "Genoa", "Real Zaragoza", "Inter Mailand"],
    options: ["Diego Milito", "Sergio Agüero", "Gonzalo Higuaín", "Carlos Tevez"]
  },
  {
    id: 131,
    name: "Carlos Tevez",
    clubs: ["Boca Juniors", "Corinthians", "West Ham United", "Manchester United", "Manchester City", "Juventus Turin", "Shanghai Shenhua", "Boca Juniors"],
    options: ["Carlos Tevez", "Sergio Agüero", "Diego Milito", "Gonzalo Higuaín"]
  },
  {
    id: 132,
    name: "Fernando Torres",
    clubs: ["Atlético Madrid", "Liverpool", "Chelsea", "AC Mailand", "Atlético Madrid", "Sagan Tosu"],
    options: ["Fernando Torres", "David Villa", "Raúl", "Fernando Morientes"]
  },
  {
    id: 133,
    name: "David Villa",
    clubs: ["Sporting Gijón", "Real Zaragoza", "Valencia", "FC Barcelona", "Atlético Madrid", "New York City FC", "Melbourne City", "Vissel Kobe"],
    options: ["David Villa", "Fernando Torres", "Raúl", "Fernando Morientes"]
  },
  {
    id: 134,
    name: "Raúl",
    clubs: ["Real Madrid", "Schalke 04", "Al-Sadd", "New York Cosmos"],
    options: ["Raúl", "Fernando Torres", "David Villa", "Fernando Morientes"]
  },
  {
    id: 135,
    name: "Fernando Morientes",
    clubs: ["Albacete", "Real Zaragoza", "Real Madrid", "AS Monaco", "Liverpool", "Valencia", "Olympique Marseille"],
    options: ["Fernando Morientes", "Raúl", "Fernando Torres", "David Villa"]
  },
  {
    id: 136,
    name: "Carles Puyol",
    clubs: ["FC Barcelona"],
    options: ["Carles Puyol", "Gerard Piqué", "Sergio Ramos", "Iker Casillas"]
  },
  {
    id: 137,
    name: "Gerard Piqué",
    clubs: ["FC Barcelona", "Manchester United", "Real Zaragoza", "FC Barcelona"],
    options: ["Gerard Piqué", "Carles Puyol", "Sergio Ramos", "Iker Casillas"]
  },
  {
    id: 138,
    name: "Xavi Hernández",
    clubs: ["FC Barcelona", "Al-Sadd"],
    options: ["Xavi Hernández", "Andrés Iniesta", "Sergio Busquets", "David Silva"]
  },
  {
    id: 139,
    name: "Sergio Busquets",
    clubs: ["FC Barcelona", "Inter Miami"],
    options: ["Sergio Busquets", "Xavi Hernández", "Andrés Iniesta", "David Silva"]
  },
  {
    id: 140,
    name: "David Silva",
    clubs: ["Valencia", "Manchester City", "Real Sociedad"],
    options: ["David Silva", "Xavi Hernández", "Andrés Iniesta", "Sergio Busquets"]
  },
  {
    id: 141,
    name: "Juan Mata",
    clubs: ["Real Madrid Castilla", "Valencia", "Chelsea", "Manchester United", "Galatasaray", "Vissel Kobe"],
    options: ["Juan Mata", "David Silva", "Santi Cazorla", "Cesc Fàbregas"]
  },
  {
    id: 142,
    name: "Cesc Fàbregas",
    clubs: ["FC Barcelona", "Arsenal", "FC Barcelona", "Chelsea", "AS Monaco", "Como"],
    options: ["Cesc Fàbregas", "Juan Mata", "David Silva", "Santi Cazorla"]
  },
  {
    id: 143,
    name: "Santi Cazorla",
    clubs: ["Villarreal", "Málaga", "Arsenal", "Villarreal", "Al-Sadd"],
    options: ["Santi Cazorla", "Juan Mata", "Cesc Fàbregas", "David Silva"]
  },
  {
    id: 144,
    name: "Fernando Hierro",
    clubs: ["Valladolid", "Real Madrid", "Al-Rayyan", "Bolton Wanderers"],
    options: ["Fernando Hierro", "Raúl", "Iker Casillas", "Sergio Ramos"]
  },
  {
    id: 145,
    name: "Luis Suárez",
    clubs: ["Nacional", "Groningen", "Ajax Amsterdam", "Liverpool", "FC Barcelona", "Atlético Madrid", "Nacional", "Grêmio"],
    options: ["Luis Suárez", "Edinson Cavani", "Diego Forlán", "Darwin Núñez"]
  },
  {
    id: 146,
    name: "Edinson Cavani",
    clubs: ["Danubio", "Palermo", "Napoli", "Paris Saint-Germain", "Manchester United", "Valencia", "Boca Juniors"],
    options: ["Edinson Cavani", "Luis Suárez", "Diego Forlán", "Darwin Núñez"]
  },
  {
    id: 147,
    name: "Diego Forlán",
    clubs: ["Independiente", "Manchester United", "Villarreal", "Atlético Madrid", "Internacional", "Cerezo Osaka", "Peñarol", "Mumbai City", "Kitchee"],
    options: ["Diego Forlán", "Luis Suárez", "Edinson Cavani", "Darwin Núñez"]
  },
  {
    id: 148,
    name: "Darwin Núñez",
    clubs: ["Peñarol", "Almería", "Benfica", "Liverpool"],
    options: ["Darwin Núñez", "Luis Suárez", "Edinson Cavani", "Diego Forlán"]
  },
  {
    id: 149,
    name: "Federico Valverde",
    clubs: ["Peñarol", "Real Madrid Castilla", "Deportivo La Coruña", "Real Madrid"],
    options: ["Federico Valverde", "Rodrygo", "Eduardo Camavinga", "Aurélien Tchouaméni"]
  },
  {
    id: 150,
    name: "Rodrygo",
    clubs: ["Santos", "Real Madrid"],
    options: ["Rodrygo", "Vinícius Júnior", "Eduardo Camavinga", "Federico Valverde"]
  },
  {
    id: 151,
    name: "Eduardo Camavinga",
    clubs: ["Rennes", "Real Madrid"],
    options: ["Eduardo Camavinga", "Aurélien Tchouaméni", "Federico Valverde", "Rodrygo"]
  },
  {
    id: 152,
    name: "Aurélien Tchouaméni",
    clubs: ["Bordeaux", "AS Monaco", "Real Madrid"],
    options: ["Aurélien Tchouaméni", "Eduardo Camavinga", "Federico Valverde", "Rodrygo"]
  },
  {
    id: 153,
    name: "Jules Koundé",
    clubs: ["Bordeaux", "Sevilla FC", "FC Barcelona"],
    options: ["Jules Koundé", "Dayot Upamecano", "Ibrahima Konaté", "William Saliba"]
  },
  {
    id: 154,
    name: "Dayot Upamecano",
    clubs: ["Valenciennes", "RB Salzburg", "RB Leipzig", "Bayern München"],
    options: ["Dayot Upamecano", "Jules Koundé", "Ibrahima Konaté", "William Saliba"]
  },
  {
    id: 155,
    name: "Ibrahima Konaté",
    clubs: ["Sochaux", "RB Leipzig", "Liverpool"],
    options: ["Ibrahima Konaté", "Jules Koundé", "Dayot Upamecano", "William Saliba"]
  },
  {
    id: 156,
    name: "William Saliba",
    clubs: ["Saint-Étienne", "Nice", "Marseille", "Arsenal"],
    options: ["William Saliba", "Jules Koundé", "Dayot Upamecano", "Ibrahima Konaté"]
  },
  {
    id: 157,
    name: "Christopher Nkunku",
    clubs: ["Paris Saint-Germain", "RB Leipzig", "Chelsea"],
    options: ["Christopher Nkunku", "Kylian Mbappé", "Ousmane Dembélé", "Antoine Griezmann"]
  },
  {
    id: 158,
    name: "Ousmane Dembélé",
    clubs: ["Rennes", "Borussia Dortmund", "FC Barcelona", "Paris Saint-Germain"],
    options: ["Ousmane Dembélé", "Kylian Mbappé", "Antoine Griezmann", "Christopher Nkunku"]
  },
  {
    id: 159,
    name: "Marcus Thuram",
    clubs: ["Sochaux", "Guingamp", "Borussia Mönchengladbach", "Inter Mailand"],
    options: ["Marcus Thuram", "Kylian Mbappé", "Antoine Griezmann", "Ousmane Dembélé"]
  },
  {
    id: 160,
    name: "Randal Kolo Muani",
    clubs: ["Nantes", "Eintracht Frankfurt", "Paris Saint-Germain"],
    options: ["Randal Kolo Muani", "Kylian Mbappé", "Marcus Thuram", "Ousmane Dembélé"]
  },
  {
    id: 161,
    name: "Mike Maignan",
    clubs: ["Paris Saint-Germain", "Lille", "AC Mailand"],
    options: ["Mike Maignan", "Hugo Lloris", "Alphonse Areola", "Steve Mandanda"]
  },
  {
    id: 162,
    name: "Hugo Lloris",
    clubs: ["Nice", "Tottenham Hotspur", "Los Angeles FC"],
    options: ["Hugo Lloris", "Mike Maignan", "Alphonse Areola", "Steve Mandanda"]
  },
  {
    id: 163,
    name: "Theo Hernández",
    clubs: ["Atlético Madrid", "Alavés", "Real Sociedad", "AC Mailand"],
    options: ["Theo Hernández", "Lucas Hernández", "Ferland Mendy", "Benjamin Pavard"]
  },
  {
    id: 164,
    name: "Lucas Hernández",
    clubs: ["Atlético Madrid", "Bayern München", "Paris Saint-Germain"],
    options: ["Lucas Hernández", "Theo Hernández", "Ferland Mendy", "Benjamin Pavard"]
  },
  {
    id: 165,
    name: "Ferland Mendy",
    clubs: ["Le Havre", "Lyon", "Real Madrid"],
    options: ["Ferland Mendy", "Theo Hernández", "Lucas Hernández", "Benjamin Pavard"]
  },
  {
    id: 166,
    name: "Benjamin Pavard",
    clubs: ["Lille", "VfB Stuttgart", "Bayern München", "Inter Mailand"],
    options: ["Benjamin Pavard", "Theo Hernández", "Lucas Hernández", "Ferland Mendy"]
  },
  {
    id: 167,
    name: "Alessandro Bastoni",
    clubs: ["Atalanta", "Inter Mailand"],
    options: ["Alessandro Bastoni", "Giorgio Chiellini", "Leonardo Bonucci", "Francesco Acerbi"]
  },
  {
    id: 168,
    name: "Giorgio Chiellini",
    clubs: ["Livorno", "Fiorentina", "Juventus Turin", "Los Angeles FC"],
    options: ["Giorgio Chiellini", "Leonardo Bonucci", "Alessandro Bastoni", "Francesco Acerbi"]
  },
  {
    id: 169,
    name: "Leonardo Bonucci",
    clubs: ["Inter Mailand", "Treviso", "Bari", "Juventus Turin", "AC Mailand", "Juventus Turin", "Union Berlin"],
    options: ["Leonardo Bonucci", "Giorgio Chiellini", "Alessandro Bastoni", "Francesco Acerbi"]
  },
  {
    id: 170,
    name: "Francesco Acerbi",
    clubs: ["Reggiana", "Chievo", "Sassuolo", "Lazio", "Inter Mailand"],
    options: ["Francesco Acerbi", "Giorgio Chiellini", "Leonardo Bonucci", "Alessandro Bastoni"]
  },
  {
    id: 171,
    name: "Nicolò Barella",
    clubs: ["Cagliari", "Inter Mailand"],
    options: ["Nicolò Barella", "Marco Verratti", "Jorginho", "Manuel Locatelli"]
  },
  {
    id: 172,
    name: "Jorginho",
    clubs: ["Verona", "Napoli", "Chelsea", "Arsenal"],
    options: ["Jorginho", "Nicolò Barella", "Marco Verratti", "Manuel Locatelli"]
  },
  {
    id: 173,
    name: "Manuel Locatelli",
    clubs: ["AC Mailand", "Sassuolo", "Juventus Turin"],
    options: ["Manuel Locatelli", "Nicolò Barella", "Jorginho", "Marco Verratti"]
  },
  {
    id: 174,
    name: "Sandro Tonali",
    clubs: ["Brescia", "AC Mailand", "Newcastle United"],
    options: ["Sandro Tonali", "Nicolò Barella", "Manuel Locatelli", "Jorginho"]
  },
  {
    id: 175,
    name: "Gianluigi Donnarumma",
    clubs: ["AC Mailand", "Paris Saint-Germain"],
    options: ["Gianluigi Donnarumma", "Gianluigi Buffon", "Salvatore Sirigu", "Mattia Perin"]
  },
  {
    id: 176,
    name: "Ciro Immobile",
    clubs: ["Sorrento", "Juventus Turin", "Siena", "Genoa", "Torino", "Borussia Dortmund", "Sevilla FC", "Lazio"],
    options: ["Ciro Immobile", "Andrea Belotti", "Lorenzo Insigne", "Federico Chiesa"]
  },
  {
    id: 177,
    name: "Lorenzo Insigne",
    clubs: ["Napoli", "Toronto FC"],
    options: ["Lorenzo Insigne", "Ciro Immobile", "Andrea Belotti", "Federico Chiesa"]
  },
  {
    id: 178,
    name: "Federico Chiesa",
    clubs: ["Fiorentina", "Juventus Turin"],
    options: ["Federico Chiesa", "Lorenzo Insigne", "Ciro Immobile", "Andrea Belotti"]
  },
  {
    id: 179,
    name: "Domenico Berardi",
    clubs: ["Sassuolo"],
    options: ["Domenico Berardi", "Lorenzo Insigne", "Federico Chiesa", "Ciro Immobile"]
  },
  {
    id: 180,
    name: "Giacomo Raspadori",
    clubs: ["Sassuolo", "Napoli"],
    options: ["Giacomo Raspadori", "Ciro Immobile", "Andrea Belotti", "Lorenzo Insigne"]
  },
  {
    id: 181,
    name: "Rafael Leão",
    clubs: ["Sporting Lissabon", "Lille", "AC Mailand"],
    options: ["Rafael Leão", "João Félix", "Gonçalo Ramos", "Rafael Silva"]
  },
  {
    id: 182,
    name: "Takefusa Kubo",
    clubs: ["FC Tokyo", "FC Barcelona", "Mallorca", "Villarreal", "Getafe", "Real Sociedad"],
    options: ["Takefusa Kubo", "Kaoru Mitoma", "Ritsu Dōan", "Daichi Kamada"]
  },
  {
    id: 183,
    name: "Kaoru Mitoma",
    clubs: ["Kawasaki Frontale", "Union SG", "Brighton & Hove Albion"],
    options: ["Kaoru Mitoma", "Takefusa Kubo", "Ritsu Dōan", "Daichi Kamada"]
  },
  {
    id: 184,
    name: "Ritsu Dōan",
    clubs: ["Gamba Osaka", "FC Groningen", "PSV Eindhoven", "Freiburg"],
    options: ["Ritsu Dōan", "Takefusa Kubo", "Kaoru Mitoma", "Daichi Kamada"]
  },
  {
    id: 185,
    name: "Daichi Kamada",
    clubs: ["Sagan Tosu", "Eintracht Frankfurt", "Lazio", "Crystal Palace"],
    options: ["Daichi Kamada", "Takefusa Kubo", "Kaoru Mitoma", "Ritsu Dōan"]
  },
  {
    id: 186,
    name: "Hwang Hee-chan",
    clubs: ["Pohang Steelers", "Red Bull Salzburg", "Hamburger SV", "Wolverhampton Wanderers"],
    options: ["Hwang Hee-chan", "Son Heung-min", "Lee Kang-in", "Kim Min-jae"]
  },
  {
    id: 187,
    name: "Lee Kang-in",
    clubs: ["Valencia", "Mallorca", "Paris Saint-Germain"],
    options: ["Lee Kang-in", "Son Heung-min", "Hwang Hee-chan", "Kim Min-jae"]
  },
  {
    id: 188,
    name: "Kim Min-jae",
    clubs: ["Gyeongnam", "Beijing Guoan", "Fenerbahçe", "Napoli", "Bayern München"],
    options: ["Kim Min-jae", "Son Heung-min", "Hwang Hee-chan", "Lee Kang-in"]
  },
  {
    id: 189,
    name: "Mehdi Taremi",
    clubs: ["Persepolis", "Al-Gharafa", "Rio Ave", "FC Porto"],
    options: ["Mehdi Taremi", "Sardar Azmoun", "Alireza Jahanbakhsh", "Karim Ansarifard"]
  },
  {
    id: 190,
    name: "Sardar Azmoun",
    clubs: ["Rubin Kazan", "Rostov", "Zenit St. Petersburg", "Bayer Leverkusen", "AS Rom"],
    options: ["Sardar Azmoun", "Mehdi Taremi", "Alireza Jahanbakhsh", "Karim Ansarifard"]
  },
  {
    id: 191,
    name: "Alireza Jahanbakhsh",
    clubs: ["NEC", "AZ Alkmaar", "Brighton & Hove Albion", "Feyenoord"],
    options: ["Alireza Jahanbakhsh", "Mehdi Taremi", "Sardar Azmoun", "Karim Ansarifard"]
  },
  {
    id: 192,
    name: "Hakim Ziyech",
    clubs: ["Heerenveen", "Twente", "Ajax Amsterdam", "Chelsea", "Galatasaray"],
    options: ["Hakim Ziyech", "Achraf Hakimi", "Youssef En-Nesyri", "Sofiane Boufal"]
  },
  {
    id: 193,
    name: "Youssef En-Nesyri",
    clubs: ["Málaga", "Leganés", "Sevilla FC"],
    options: ["Youssef En-Nesyri", "Hakim Ziyech", "Achraf Hakimi", "Sofiane Boufal"]
  },
  {
    id: 194,
    name: "Sofiane Boufal",
    clubs: ["Angers", "Lille", "Southampton", "Celta Vigo", "Angers", "Al-Rayyan"],
    options: ["Sofiane Boufal", "Hakim Ziyech", "Achraf Hakimi", "Youssef En-Nesyri"]
  },
  {
    id: 195,
    name: "Yassine Bounou",
    clubs: ["Wydad Casablanca", "Atlético Madrid", "Girona", "Sevilla FC", "Al-Hilal"],
    options: ["Yassine Bounou", "Munir El Haddadi", "Noussair Mazraoui", "Achraf Hakimi"]
  },
  {
    id: 196,
    name: "Noussair Mazraoui",
    clubs: ["Ajax Amsterdam", "Bayern München"],
    options: ["Noussair Mazraoui", "Achraf Hakimi", "Hakim Ziyech", "Yassine Bounou"]
  },
  {
    id: 197,
    name: "Ismaël Bennacer",
    clubs: ["Arsenal", "Tours", "Empoli", "AC Mailand"],
    options: ["Ismaël Bennacer", "Riyad Mahrez", "Islam Slimani", "Yacine Brahimi"]
  },
  {
    id: 198,
    name: "Riyad Mahrez",
    clubs: ["Le Havre", "Leicester City", "Manchester City", "Al-Ahli"],
    options: ["Riyad Mahrez", "Islam Slimani", "Yacine Brahimi", "Sofiane Feghouli"]
  },
  {
    id: 199,
    name: "Islam Slimani",
    clubs: ["CR Belouizdad", "Sporting Lissabon", "Leicester City", "Newcastle United", "Fenerbahçe", "Monaco", "Lyon", "Brest", "Anderlecht"],
    options: ["Islam Slimani", "Riyad Mahrez", "Yacine Brahimi", "Sofiane Feghouli"]
  },
  {
    id: 200,
    name: "Yacine Brahimi",
    clubs: ["Rennes", "Granada", "FC Porto", "Al-Rayyan", "Al-Gharafa"],
    options: ["Yacine Brahimi", "Riyad Mahrez", "Islam Slimani", "Sofiane Feghouli"]
  }
];

// Spielerdaten anreichern
const PLAYERS_DATA = PLAYERS_DATA_RAW.map(enrichPlayerData);

export default function FootballQuiz() {
  // Spieler-Liste beim Start zufällig mischen
  const shuffledPlayers = useMemo(() => {
    return shuffleArray(PLAYERS_DATA);
  }, []);
  
  const [mode, setMode] = useState(null); // null = Auswahl, 'training' = Training, 'competition' = Wettkampf
  const [currentLevel, setCurrentLevel] = useState(0);
  const [streak, setStreak] = useState(0); // Wie viele richtige Antworten in Folge (nur Training)
  const [points, setPoints] = useState(0); // Startpunkte für Wettkampf (0, max 500 möglich)
  const [gameState, setGameState] = useState('playing'); // 'playing', 'finished'
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showStreakReset, setShowStreakReset] = useState(false);
  const [inputValue, setInputValue] = useState(''); // Für Wettkampf-Modus
  const [showTipsModal, setShowTipsModal] = useState(false); // Tipps-Modal
  const [revealedTips, setRevealedTips] = useState({}); // Welche Tipps wurden bereits gekauft
  const [tipsCostThisRound, setTipsCostThisRound] = useState(0); // Kosten für Tipps in dieser Runde
  const [showAllStations, setShowAllStations] = useState(false); // Alle Stationen anzeigen
  const [stationsSorted, setStationsSorted] = useState(false); // Stationen sortiert anzeigen

  const currentPlayer = shuffledPlayers[currentLevel];
  
  // Optionen für den aktuellen Spieler zufällig mischen
  const shuffledOptions = useMemo(() => {
    return shuffleArray(currentPlayer.options);
  }, [currentLevel]);

  // Stationen für Anzeige vorbereiten - nur neu berechnen wenn sich Spieler oder Einstellungen ändern
  const stationsToShow = useMemo(() => {
    let stations = [...currentPlayer.clubs];
    
    // Wenn sortiert, alphabetisch sortieren
    if (stationsSorted) {
      stations = [...stations].sort();
    }
    
    // Wenn nicht alle Stationen angezeigt werden sollen, nur 4 zufällige nehmen
    if (!showAllStations) {
      const shuffled = shuffleArray([...currentPlayer.clubs]);
      stations = shuffled.slice(0, 4);
    }
    
    return stations;
  }, [currentLevel, showAllStations, stationsSorted, currentPlayer]);

  const handleAnswer = (answer) => {
    if (selectedAnswer) return;
    setSelectedAnswer(answer);
    
    if (answer === currentPlayer.name) {
      // Richtige Antwort - Streak erhöhen
      const newStreak = streak + 1;
      setStreak(newStreak);
      
      // Bei 5 richtigen Antworten gewonnen!
      if (newStreak >= 5) {
        setTimeout(() => {
          setGameState('finished');
        }, 1500);
        return;
      }
      
      // Nächste Frage
    setTimeout(() => {
        if (currentLevel < shuffledPlayers.length - 1) {
        setCurrentLevel(currentLevel + 1);
        setSelectedAnswer(null);
      } else {
        setGameState('finished');
      }
    }, 1500);
    } else {
      // Falsche Antwort - Streak zurücksetzen
      setShowStreakReset(true);
      setTimeout(() => {
        setStreak(0);
        setShowStreakReset(false);
        if (currentLevel < shuffledPlayers.length - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedAnswer(null);
        } else {
          setGameState('finished');
        }
      }, 2000);
    }
  };

  const handleCompetitionSubmit = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || selectedAnswer) return;
    
    const isCorrect = fuzzyMatch(inputValue.trim(), currentPlayer.name);
    setSelectedAnswer(inputValue.trim());
    
    if (isCorrect) {
      // Richtige Antwort - 100 Punkte minus Tipp-Kosten dieser Runde
      const pointsThisRound = Math.max(0, 100 - tipsCostThisRound);
      const newPoints = points + pointsThisRound;
      setPoints(newPoints);
      
      // Nächste Frage (maximal 5 Durchgänge im Wettkampf)
      setTimeout(() => {
        const maxLevel = 5; // 5 Durchgänge im Wettkampf
        if (currentLevel < maxLevel - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedAnswer(null);
          setInputValue('');
          setRevealedTips({}); // Tipps zurücksetzen für nächsten Spieler
          setTipsCostThisRound(0); // Tipp-Kosten zurücksetzen
          setShowAllStations(false); // Stationen-Anzeige zurücksetzen
          setStationsSorted(false); // Sortierung zurücksetzen
        } else {
          setGameState('finished');
        }
      }, 1500);
    } else {
      // Falsche Antwort - 0 Punkte (nichts addieren)
      // Nächste Frage (maximal 5 Durchgänge im Wettkampf)
      setTimeout(() => {
        const maxLevel = 5; // 5 Durchgänge im Wettkampf
        if (currentLevel < maxLevel - 1) {
          setCurrentLevel(currentLevel + 1);
          setSelectedAnswer(null);
          setInputValue('');
          setRevealedTips({}); // Tipps zurücksetzen für nächsten Spieler
          setTipsCostThisRound(0); // Tipp-Kosten zurücksetzen
          setShowAllStations(false); // Stationen-Anzeige zurücksetzen
          setStationsSorted(false); // Sortierung zurücksetzen
        } else {
          setGameState('finished');
        }
      }, 2000);
    }
  };

  // Tipp kaufen
  const buyTip = (tipType) => {
    const tipCosts = {
      age: 15,
      nationality: 20,
      allStations: 20,
      currentClub: 20,
      sortStations: 20
    };
    
    const cost = tipCosts[tipType];
    // Tipps kosten keine Punkte direkt, sondern reduzieren die möglichen Punkte dieser Runde
    if (!revealedTips[tipType]) {
      setTipsCostThisRound(tipsCostThisRound + cost);
      setRevealedTips({ ...revealedTips, [tipType]: true });
      
      // Spezielle Aktionen für bestimmte Tipps
      if (tipType === 'allStations') {
        setShowAllStations(true);
      }
      if (tipType === 'sortStations') {
        setStationsSorted(true);
      }
    }
  };

  // Modus-Auswahlbildschirm
  if (mode === null) {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
        <div className="mb-12 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider mb-2">
            WER IST DER SPIELER?
      </h1>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-12 bg-white/30"></div>
            <div className="h-px w-24 bg-white/50"></div>
            <div className="h-px w-12 bg-white/30"></div>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMode('training');
              setStreak(0);
              setCurrentLevel(0);
              setGameState('playing');
              setSelectedAnswer(null);
              setShowStreakReset(false);
            }}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 p-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            🎯 Training
            <p className="text-sm font-normal mt-2 opacity-90">
              Multiple Choice - Wähle aus 4 Optionen
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setMode('competition');
              setPoints(0);
              setCurrentLevel(0);
              setGameState('playing');
              setSelectedAnswer(null);
              setInputValue('');
              setRevealedTips({});
              setTipsCostThisRound(0);
              setShowAllStations(false);
              setStationsSorted(false);
            }}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-shadow"
          >
            ⚡ Wettkampf
            <p className="text-sm font-normal mt-2 opacity-90">
              5 Durchgänge - 100 Punkte pro richtige Antwort. Tipps verfügbar!
            </p>
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <div className="mb-8 text-center">
        {/* Titel mit subtiler Fußball-Ästhetik */}
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider mb-2">
          WER IST DER SPIELER?
        </h1>
        {/* Dezente Linie wie ein Fußballfeld */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="h-px w-12 bg-white/30"></div>
          <div className="h-px w-24 bg-white/50"></div>
          <div className="h-px w-12 bg-white/30"></div>
        </div>
        {/* Modus-Anzeige */}
        <div className="mt-4">
          <span className="text-xs uppercase tracking-widest text-slate-400">
            {mode === 'training' ? '🎯 Training' : '⚡ Wettkampf'}
          </span>
        </div>
      </div>

      {gameState === 'playing' ? (
        <div className="w-full max-w-md">
          {/* Punkteanzeige für Wettkampf */}
          {mode === 'competition' && (() => {
            const maxPossiblePoints = 500 - (currentLevel * 100); // Maximal noch mögliche Punkte
            const pointsThisRound = Math.max(0, 100 - tipsCostThisRound); // Punkte die in dieser Runde noch möglich sind
            return (
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 shadow-xl mb-6 border border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-xs uppercase tracking-widest mb-1">Punkte</p>
                    <p className="text-3xl font-bold text-white">{points}</p>
                    <p className="text-purple-200 text-xs mt-1">Durchgang {currentLevel + 1} von 5</p>
                    {tipsCostThisRound > 0 && (
                      <p className="text-yellow-300 text-xs mt-1">Diese Runde: {pointsThisRound} Punkte möglich</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-purple-100 text-xs uppercase tracking-widest mb-1">Noch möglich</p>
                    <p className="text-2xl font-bold text-white">{maxPossiblePoints}</p>
                    <p className="text-purple-200 text-xs mt-1">von 500 max</p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Club-Liste */}
          <div className="bg-slate-800 rounded-2xl p-6 shadow-xl mb-6 border border-slate-700">
            <p className="text-slate-400 text-sm mb-4 uppercase tracking-widest">
              {showAllStations ? 'Alle Stationen' : '4 ausgewählte Stationen'}
            </p>
            <div className="flex flex-wrap gap-2">
              {stationsToShow.map((club, index) => (
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={`${currentPlayer.id}-${index}-${club}`}
                  className="bg-slate-700 px-3 py-1.5 rounded-full text-sm font-medium border border-slate-600"
                >
                  {club}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Tipps-Button für Wettkampf */}
          {mode === 'competition' && (
            <div className="mb-4">
              <button
                onClick={() => setShowTipsModal(true)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 p-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
              >
                💡 Tipps
              </button>
            </div>
          )}

          {/* Antwort-Optionen - Training Modus */}
          {mode === 'training' && (
          <div className="grid grid-cols-1 gap-3">
              {shuffledOptions.map((option) => {
              const isCorrect = option === currentPlayer.name;
              const isSelected = selectedAnswer === option;
              
              let bgColor = "bg-slate-800";
              if (selectedAnswer) {
                if (isCorrect) bgColor = "bg-green-500 border-green-400";
                else if (isSelected) bgColor = "bg-red-500 border-red-400";
              }

              return (
                <motion.button
                  whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                  whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={!!selectedAnswer}
                  className={`${bgColor} p-4 rounded-xl border border-slate-700 transition-colors duration-300 text-left font-semibold`}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
          )}

          {/* Input-Feld - Wettkampf Modus */}
          {mode === 'competition' && (
            <form onSubmit={handleCompetitionSubmit} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={!!selectedAnswer}
                  placeholder="Spielername eingeben..."
                  className={`w-full p-4 rounded-xl border-2 text-lg font-semibold bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ${
                    selectedAnswer 
                      ? fuzzyMatch(selectedAnswer, currentPlayer.name)
                        ? 'bg-green-500 border-green-400'
                        : 'bg-red-500 border-red-400'
                      : ''
                  }`}
                  autoFocus
                />
                {selectedAnswer && (
                  <div className="mt-2 text-center">
                    {fuzzyMatch(selectedAnswer, currentPlayer.name) ? (
                      <p className="text-green-400 font-semibold">✓ Richtig! Es ist {currentPlayer.name}</p>
                    ) : (
                      <p className="text-red-400 font-semibold">✗ Falsch! Es ist {currentPlayer.name}</p>
                    )}
                  </div>
                )}
              </div>
              {!selectedAnswer && (
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-xl font-bold text-lg hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bestätigen
                </button>
              )}
            </form>
          )}

          {/* Fußball-Streak-Anzeige - nur im Trainingsmodus */}
          {mode === 'training' && (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">5 in Folge zum Sieg!</p>
              <div className="flex gap-3 items-center relative">
                {[1, 2, 3, 4, 5].map((ballNumber) => (
                  <div key={ballNumber} className="relative w-12 h-12 flex items-center justify-center">
                    {/* Platzhalter bleibt immer sichtbar */}
                    <div className="absolute w-8 h-8 rounded-full border-2 border-slate-500 border-dashed"></div>
                    
                    {/* Fußball fällt langsam nacheinander */}
                    {streak >= ballNumber && !showStreakReset ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className="text-4xl relative z-10"
                      >
                        ⚽
                      </motion.span>
                    ) : showStreakReset && streak >= ballNumber ? (
                      <motion.span
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: 200, opacity: 0 }}
                        transition={{ 
                          duration: 1.2,
                          delay: (ballNumber - 1) * 0.15,
                          ease: "easeIn"
                        }}
                        className="text-4xl relative z-10"
                      >
                        ⚽
                      </motion.span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center bg-slate-800 p-10 rounded-3xl shadow-2xl border border-slate-700"
        >
          {mode === 'training' ? (
            streak >= 5 ? (
              <>
                <h2 className="text-4xl font-bold mb-4">🎉 Gewonnen! 🎉</h2>
                <p className="text-xl mb-6 text-slate-300 text-balance">
                  Du hast 5 richtige Antworten in Folge geschafft!
                </p>
                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="text-4xl"
                    >
                      ⚽
                    </motion.span>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">Spiel beendet! ⚽️</h2>
                <p className="text-xl mb-6 text-slate-300 text-balance">
                  Du hattest einen Streak von {streak} richtigen Antworten.
                </p>
              </>
            )
          ) : (
            <>
              <h2 className="text-4xl font-bold mb-4">Wettkampf beendet! ⚽️</h2>
              <p className="text-xl mb-6 text-slate-300 text-balance">
                Du hast {points} von 500 möglichen Punkten erreicht!
              </p>
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 mb-6">
                <p className="text-3xl font-bold text-white text-center">{points} Punkte</p>
              </div>
            </>
          )}
          <div className="flex gap-4">
            <button 
              onClick={() => {
                setMode(null);
                setCurrentLevel(0);
                setStreak(0);
                setPoints(0);
                setGameState('playing');
                setSelectedAnswer(null);
                setInputValue('');
                setShowStreakReset(false);
                setRevealedTips({});
                setTipsCostThisRound(0);
                setShowAllStations(false);
                setStationsSorted(false);
              }}
              className="bg-slate-700 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
            >
              Modus wählen
            </button>
          <button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 rounded-full font-bold hover:shadow-lg transition-shadow"
          >
            Nochmal spielen
          </button>
          </div>
        </motion.div>
      )}

      {/* Tipps-Modal */}
      {showTipsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">💡 Tipps</h3>
              <button
                onClick={() => setShowTipsModal(false)}
                className="text-slate-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {/* Alter */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Alter</span>
                  {revealedTips.age ? (
                    <span className="text-green-400 font-bold">{currentPlayer.age} Jahre</span>
                  ) : (
                    <button
                      onClick={() => buyTip('age')}
                      disabled={tipsCostThisRound + 15 > 100}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        tipsCostThisRound + 15 <= 100
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      15 Punkte
                    </button>
                  )}
                </div>
              </div>

              {/* Nationalität */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Nationalität</span>
                  {revealedTips.nationality ? (
                    <span className="text-green-400 font-bold">{currentPlayer.nationality}</span>
                  ) : (
                    <button
                      onClick={() => buyTip('nationality')}
                      disabled={tipsCostThisRound + 20 > 100}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        tipsCostThisRound + 20 <= 100
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      20 Punkte
                    </button>
                  )}
                </div>
              </div>

              {/* Alle Vereinsstationen anzeigen */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Alle Vereinsstationen anzeigen</span>
                  {revealedTips.allStations ? (
                    <span className="text-green-400 font-bold">✓ Aktiviert</span>
                  ) : (
                    <button
                      onClick={() => buyTip('allStations')}
                      disabled={tipsCostThisRound + 20 > 100}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        tipsCostThisRound + 20 <= 100
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      20 Punkte
                    </button>
                  )}
                </div>
              </div>

              {/* Aktueller Verein */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Aktueller Verein</span>
                  {revealedTips.currentClub ? (
                    <span className="text-green-400 font-bold">{currentPlayer.currentClub}</span>
                  ) : (
                    <button
                      onClick={() => buyTip('currentClub')}
                      disabled={tipsCostThisRound + 20 > 100}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        tipsCostThisRound + 20 <= 100
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      20 Punkte
                    </button>
                  )}
                </div>
              </div>

              {/* Vereinsstationen sortieren */}
              <div className="bg-slate-700 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">Vereinsstationen sortieren</span>
                  {revealedTips.sortStations ? (
                    <span className="text-green-400 font-bold">✓ Sortiert</span>
                  ) : (
                    <button
                      onClick={() => buyTip('sortStations')}
                      disabled={tipsCostThisRound + 20 > 100}
                      className={`px-4 py-2 rounded-lg font-bold text-sm ${
                        tipsCostThisRound + 20 <= 100
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                          : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      20 Punkte
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 text-center space-y-2">
              <p className="text-slate-400 text-sm">
                Gesamtpunkte: <span className="text-white font-bold">{points}</span>
              </p>
              <p className="text-yellow-300 text-sm">
                Diese Runde möglich: <span className="font-bold">{Math.max(0, 100 - tipsCostThisRound)}</span> von 100 Punkten
              </p>
              {tipsCostThisRound > 0 && (
                <p className="text-red-300 text-xs">
                  Tipp-Kosten diese Runde: {tipsCostThisRound} Punkte
                </p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

