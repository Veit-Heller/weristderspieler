import { getLeague } from '../utils/getLeague';

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

const birthYearMap = {
  "Cristiano Ronaldo": 1985, "Lionel Messi": 1987, "Toni Kroos": 1990, "Robert Lewandowski": 1989,
  "Mohamed Salah": 1992, "Kylian Mbappé": 1999, "Erling Haaland": 2000, "Kevin De Bruyne": 1991,
  "Virgil van Dijk": 1991, "Manuel Neuer": 1986, "Luka Modrić": 1985, "Karim Benzema": 1988,
  "Neymar Jr": 1992, "Sergio Ramos": 1986, "Thiago Silva": 1984, "Gareth Bale": 1989,
  "Zlatan Ibrahimović": 1981, "Andrés Iniesta": 1984, "Wayne Rooney": 1985, "Andrea Pirlo": 1979,
  "Xabi Alonso": 1982, "Philipp Lahm": 1984, "David Beckham": 1975, "Ronaldinho": 1980,
  "Steven Gerrard": 1980, "Frank Lampard": 1978, "Arjen Robben": 1984, "Iker Casillas": 1981,
  "Gianluigi Buffon": 1978, "Paul Pogba": 1993, "Jude Bellingham": 2003, "Vinícius Júnior": 2000,
  "Jamal Musiala": 2003, "Pedri": 2002, "Bukayo Saka": 2001, "Federico Valverde": 1998,
  "Rafael Leão": 1999, "Alphonso Davies": 2000, "Achraf Hakimi": 1998, "Frenkie de Jong": 1997,
  "Marquinhos": 1994, "Rodri": 1996, "Bernardo Silva": 1994, "Son Heung-min": 1992,
  "Sadio Mané": 1992, "Raheem Sterling": 1994, "Harry Kane": 1993, "Lautaro Martínez": 1997,
  "Dušan Vlahović": 2000, "Victor Osimhen": 1999, "Casemiro": 1992, "Antoine Griezmann": 1991,
  "Marc-André ter Stegen": 1992, "Joshua Kimmich": 1995, "Marco Verratti": 1992, "Jan Oblak": 1993,
  "Rúben Dias": 1997, "João Cancelo": 1994, "Trent Alexander-Arnold": 1998, "Andrew Robertson": 1994,
  "İlkay Gündoğan": 1990, "İvan Rakitić": 1988, "Mats Hummels": 1989, "Marco Reus": 1989,
  "Pierre-Emerick Aubameyang": 1989, "Romelu Lukaku": 1993, "Eden Hazard": 1991, "Thibaut Courtois": 1992,
  "Alisson": 1992, "Ederson": 1993, "Riyad Mahrez": 1991, "Gabriel Jesus": 1997,
  "Philippe Coutinho": 1992, "Roberto Firmino": 1991, "Fabinho": 1993, "Allan": 1991,
  "Fred": 1993, "Lucas Paquetá": 1997, "Richarlison": 1997, "Raphinha": 1997,
  "Antony": 2000, "Bruno Guimarães": 1997, "João Félix": 1999, "Gonçalo Ramos": 2001,
  "Rafael Silva": 1993, "Diogo Jota": 1996, "Rúben Neves": 1997, "Matthijs de Ligt": 1999,
  "Memphis Depay": 1994, "Donny van de Beek": 1997, "Cody Gakpo": 1999, "Xavi Simons": 2003,
  "Wout Weghorst": 1992, "Luuk de Jong": 1990, "Denzel Dumfries": 1996, "Nathan Aké": 1995,
  "Daley Blind": 1990, "Georginio Wijnaldum": 1990, "Leroy Sané": 1995, "Serge Gnabry": 1995,
  "Kingsley Coman": 1996, "Leon Goretzka": 1994, "Mason Mount": 1998, "Phil Foden": 2000,
  "Marcus Rashford": 1997, "Jadon Sancho": 2000, "Declan Rice": 1998, "Kalvin Phillips": 1995,
  "Jack Grealish": 1995, "Reece James": 1999, "Ben Chilwell": 1996, "Luke Shaw": 1995,
  "John Stones": 1994, "Harry Maguire": 1993, "Kyle Walker": 1990, "Kieran Trippier": 1990,
  "Jordan Pickford": 1993, "Aaron Ramsdale": 1998, "Nick Pope": 1992, "Emiliano Martínez": 1992,
  "Ángel Di María": 1988, "Paulo Dybala": 1993, "Sergio Agüero": 1988, "Gonzalo Higuaín": 1988,
  "Javier Mascherano": 1984, "Javier Zanetti": 1973, "Esteban Cambiasso": 1980, "Diego Milito": 1979,
  "Carlos Tevez": 1984, "Fernando Torres": 1984, "David Villa": 1982, "Raúl": 1977,
  "Fernando Morientes": 1976, "Carles Puyol": 1978, "Gerard Piqué": 1987, "Xavi Hernández": 1980,
  "Sergio Busquets": 1988, "David Silva": 1986, "Juan Mata": 1988, "Cesc Fàbregas": 1987,
  "Santi Cazorla": 1985, "Fernando Hierro": 1968, "Luis Suárez": 1987, "Edinson Cavani": 1987,
  "Diego Forlán": 1979, "Darwin Núñez": 1999, "Rodrygo": 2000, "Eduardo Camavinga": 2002,
  "Aurélien Tchouaméni": 2000, "Jules Koundé": 1998, "Dayot Upamecano": 1998, "Ibrahima Konaté": 1999,
  "William Saliba": 2000, "Christopher Nkunku": 1997, "Ousmane Dembélé": 1997, "Marcus Thuram": 1997,
  "Randal Kolo Muani": 1998, "Mike Maignan": 1995, "Hugo Lloris": 1986, "Theo Hernández": 1997,
  "Lucas Hernández": 1996, "Ferland Mendy": 1995, "Benjamin Pavard": 1996, "Alessandro Bastoni": 1999,
  "Giorgio Chiellini": 1984, "Leonardo Bonucci": 1987, "Francesco Acerbi": 1988, "Nicolò Barella": 1997,
  "Jorginho": 1991, "Manuel Locatelli": 1997, "Sandro Tonali": 2000, "Gianluigi Donnarumma": 1999,
  "Ciro Immobile": 1990, "Lorenzo Insigne": 1991, "Federico Chiesa": 1997, "Domenico Berardi": 1994,
  "Giacomo Raspadori": 2000, "Takefusa Kubo": 2001, "Kaoru Mitoma": 1997, "Ritsu Dōan": 1998,
  "Daichi Kamada": 1996, "Hwang Hee-chan": 1996, "Lee Kang-in": 2001, "Kim Min-jae": 1996,
  "Mehdi Taremi": 1992, "Sardar Azmoun": 1994, "Alireza Jahanbakhsh": 1993, "Hakim Ziyech": 1993,
  "Youssef En-Nesyri": 1997, "Sofiane Boufal": 1993, "Yassine Bounou": 1991, "Noussair Mazraoui": 1997,
  "Ismaël Bennacer": 1997, "Riyad Mahrez": 1991, "Islam Slimani": 1988, "Yacine Brahimi": 1990
};

const enrichPlayerData = (player) => {
  const currentClub = player.clubs[player.clubs.length - 1];
  const birthYear = birthYearMap[player.name];
  return {
    ...player,
    nationality: nationalityMap[player.name] || "Unbekannt",
    age: birthYear ? new Date().getFullYear() - birthYear : 30,
    currentLeague: getLeague(currentClub),
    currentClub,
  };
};

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

export const PLAYERS_DATA = PLAYERS_DATA_RAW.map(enrichPlayerData);
