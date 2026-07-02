// players.js — mock expandido con las 5 grandes ligas europeas + drag entre chapas del campo

var MOCK_TEAMS = [
  // LaLiga
  { id: 1,  name: 'Real Madrid',       code: 'RMA', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 2,  name: 'Barcelona',          code: 'FCB', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 3,  name: 'Atletico Madrid',    code: 'ATM', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 4,  name: 'Sevilla',            code: 'SEV', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 5,  name: 'Real Betis',         code: 'BET', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 6,  name: 'Athletic Bilbao',    code: 'ATH', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 7,  name: 'Villarreal',         code: 'VIL', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 8,  name: 'Valencia',           code: 'VAL', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 9,  name: 'Real Sociedad',      code: 'RSO', country: 'Spain',     logo: '', league: 'LaLiga' },
  { id: 10, name: 'Osasuna',            code: 'OSA', country: 'Spain',     logo: '', league: 'LaLiga' },
  // Premier League
  { id: 11, name: 'Manchester City',    code: 'MCI', country: 'England',   logo: '', league: 'Premier League' },
  { id: 12, name: 'Arsenal',            code: 'ARS', country: 'England',   logo: '', league: 'Premier League' },
  { id: 13, name: 'Liverpool',          code: 'LIV', country: 'England',   logo: '', league: 'Premier League' },
  { id: 14, name: 'Chelsea',            code: 'CHE', country: 'England',   logo: '', league: 'Premier League' },
  { id: 15, name: 'Manchester United',  code: 'MUN', country: 'England',   logo: '', league: 'Premier League' },
  { id: 16, name: 'Tottenham',          code: 'TOT', country: 'England',   logo: '', league: 'Premier League' },
  { id: 17, name: 'Newcastle',          code: 'NEW', country: 'England',   logo: '', league: 'Premier League' },
  { id: 18, name: 'Aston Villa',        code: 'AVL', country: 'England',   logo: '', league: 'Premier League' },
  { id: 19, name: 'West Ham',           code: 'WHU', country: 'England',   logo: '', league: 'Premier League' },
  { id: 20, name: 'Brighton',           code: 'BHA', country: 'England',   logo: '', league: 'Premier League' },
  // Serie A
  { id: 21, name: 'Juventus',           code: 'JUV', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 22, name: 'Inter Milan',        code: 'INT', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 23, name: 'AC Milan',           code: 'ACM', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 24, name: 'Napoli',             code: 'NAP', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 25, name: 'AS Roma',            code: 'ROM', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 26, name: 'Lazio',              code: 'LAZ', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 27, name: 'Fiorentina',         code: 'FIO', country: 'Italy',     logo: '', league: 'Serie A' },
  { id: 28, name: 'Atalanta',           code: 'ATA', country: 'Italy',     logo: '', league: 'Serie A' },
  // Bundesliga
  { id: 31, name: 'Bayern Munich',      code: 'BAY', country: 'Germany',   logo: '', league: 'Bundesliga' },
  { id: 32, name: 'Borussia Dortmund',  code: 'BVB', country: 'Germany',   logo: '', league: 'Bundesliga' },
  { id: 33, name: 'Bayer Leverkusen',   code: 'B04', country: 'Germany',   logo: '', league: 'Bundesliga' },
  { id: 34, name: 'RB Leipzig',         code: 'RBL', country: 'Germany',   logo: '', league: 'Bundesliga' },
  { id: 35, name: 'Eintracht Frankfurt',code: 'SGE', country: 'Germany',   logo: '', league: 'Bundesliga' },
  { id: 36, name: 'Borussia Monchengladbach', code: 'BMG', country: 'Germany', logo: '', league: 'Bundesliga' },
  { id: 37, name: 'Wolfsburg',          code: 'WOB', country: 'Germany',   logo: '', league: 'Bundesliga' },
  // Ligue 1
  { id: 41, name: 'Paris Saint-Germain', code: 'PSG', country: 'France',   logo: '', league: 'Ligue 1' },
  { id: 42, name: 'Marseille',           code: 'OM',  country: 'France',   logo: '', league: 'Ligue 1' },
  { id: 43, name: 'Monaco',              code: 'ASM', country: 'France',   logo: '', league: 'Ligue 1' },
  { id: 44, name: 'Lyon',                code: 'OL',  country: 'France',   logo: '', league: 'Ligue 1' },
  { id: 45, name: 'Lille',               code: 'LIL', country: 'France',   logo: '', league: 'Ligue 1' }
];

var MOCK_SQUADS = {
  // Real Madrid
  1: [
    { id: 101, name: 'Thibaut Courtois',    position: 'Goalkeeper', number: 1  },
    { id: 102, name: 'Dani Carvajal',       position: 'Defender',   number: 2  },
    { id: 103, name: 'Eder Militao',        position: 'Defender',   number: 3  },
    { id: 104, name: 'David Alaba',         position: 'Defender',   number: 4  },
    { id: 105, name: 'Ferland Mendy',       position: 'Defender',   number: 23 },
    { id: 106, name: 'Nacho',               position: 'Defender',   number: 6  },
    { id: 107, name: 'Luka Modric',         position: 'Midfielder', number: 10 },
    { id: 108, name: 'Toni Kroos',          position: 'Midfielder', number: 8  },
    { id: 109, name: 'Federico Valverde',   position: 'Midfielder', number: 15 },
    { id: 110, name: 'Aurelien Tchouameni', position: 'Midfielder', number: 18 },
    { id: 111, name: 'Eduardo Camavinga',   position: 'Midfielder', number: 12 },
    { id: 112, name: 'Jude Bellingham',     position: 'Midfielder', number: 5  },
    { id: 113, name: 'Vinicius Junior',     position: 'Attacker',   number: 7  },
    { id: 114, name: 'Rodrygo',             position: 'Attacker',   number: 11 },
    { id: 115, name: 'Joselu',              position: 'Attacker',   number: 14 },
    { id: 116, name: 'Brahim Diaz',         position: 'Attacker',   number: 21 }
  ],
  // Barcelona
  2: [
    { id: 201, name: 'Marc-Andre ter Stegen', position: 'Goalkeeper', number: 1  },
    { id: 202, name: 'Ronald Araujo',          position: 'Defender',   number: 4  },
    { id: 203, name: 'Andreas Christensen',    position: 'Defender',   number: 15 },
    { id: 204, name: 'Jules Kounde',            position: 'Defender',   number: 23 },
    { id: 205, name: 'Alejandro Balde',         position: 'Defender',   number: 3  },
    { id: 206, name: 'Pedri',                   position: 'Midfielder', number: 8  },
    { id: 207, name: 'Frenkie de Jong',         position: 'Midfielder', number: 21 },
    { id: 208, name: 'Ilkay Gundogan',          position: 'Midfielder', number: 22 },
    { id: 209, name: 'Gavi',                    position: 'Midfielder', number: 6  },
    { id: 210, name: 'Lamine Yamal',            position: 'Attacker',   number: 27 },
    { id: 211, name: 'Raphinha',                position: 'Attacker',   number: 11 },
    { id: 212, name: 'Robert Lewandowski',      position: 'Attacker',   number: 9  },
    { id: 213, name: 'Ansu Fati',               position: 'Attacker',   number: 10 }
  ],
  // Atletico Madrid
  3: [
    { id: 301, name: 'Jan Oblak',           position: 'Goalkeeper', number: 13 },
    { id: 302, name: 'Jose Gimenez',        position: 'Defender',   number: 2  },
    { id: 303, name: 'Stefan Savic',        position: 'Defender',   number: 15 },
    { id: 304, name: 'Axel Witsel',         position: 'Midfielder', number: 20 },
    { id: 305, name: 'Koke',               position: 'Midfielder', number: 6  },
    { id: 306, name: 'Marcos Llorente',     position: 'Midfielder', number: 14 },
    { id: 307, name: 'Antoine Griezmann',   position: 'Attacker',   number: 7  },
    { id: 308, name: 'Alvaro Morata',       position: 'Attacker',   number: 9  },
    { id: 309, name: 'Rodrigo De Paul',     position: 'Midfielder', number: 5  }
  ],
  // Sevilla
  4: [
    { id: 401, name: 'Yassine Bounou',   position: 'Goalkeeper', number: 13 },
    { id: 402, name: 'Jesus Navas',       position: 'Defender',   number: 2  },
    { id: 403, name: 'Nemanja Gudelj',    position: 'Midfielder', number: 5  },
    { id: 404, name: 'Ivan Rakitic',      position: 'Midfielder', number: 10 },
    { id: 405, name: 'Lucas Ocampos',     position: 'Attacker',   number: 5  },
    { id: 406, name: 'En-Nesyri',         position: 'Attacker',   number: 14 }
  ],
  // Real Betis
  5: [
    { id: 501, name: 'Rui Silva',         position: 'Goalkeeper', number: 13 },
    { id: 502, name: 'Hector Bellerin',   position: 'Defender',   number: 2  },
    { id: 503, name: 'Nabil Fekir',       position: 'Midfielder', number: 8  },
    { id: 504, name: 'Sergio Canales',    position: 'Midfielder', number: 10 },
    { id: 505, name: 'Borja Iglesias',    position: 'Attacker',   number: 9  },
    { id: 506, name: 'Willian Jose',      position: 'Attacker',   number: 17 }
  ],
  // Athletic Bilbao
  6: [
    { id: 601, name: 'Unai Simon',        position: 'Goalkeeper', number: 1  },
    { id: 602, name: 'Dani Vivian',       position: 'Defender',   number: 5  },
    { id: 603, name: 'Inaki Williams',    position: 'Attacker',   number: 9  },
    { id: 604, name: 'Nico Williams',     position: 'Attacker',   number: 11 },
    { id: 605, name: 'Mikel Vesga',       position: 'Midfielder', number: 14 },
    { id: 606, name: 'Alex Berenguer',    position: 'Attacker',   number: 21 }
  ],
  // Villarreal
  7: [
    { id: 701, name: 'Geronimo Rulli',    position: 'Goalkeeper', number: 13 },
    { id: 702, name: 'Juan Foyth',        position: 'Defender',   number: 17 },
    { id: 703, name: 'Gerard Moreno',     position: 'Attacker',   number: 7  },
    { id: 704, name: 'Yeremi Pino',       position: 'Attacker',   number: 19 },
    { id: 705, name: 'Dani Parejo',       position: 'Midfielder', number: 4  },
    { id: 706, name: 'Alex Baena',        position: 'Midfielder', number: 12 }
  ],
  // Valencia
  8: [
    { id: 801, name: 'Giorgi Mamardashvili', position: 'Goalkeeper', number: 1  },
    { id: 802, name: 'Jose Luis Gaya',        position: 'Defender',   number: 14 },
    { id: 803, name: 'Carlos Soler',          position: 'Midfielder', number: 26 },
    { id: 804, name: 'Hugo Duro',             position: 'Attacker',   number: 9  },
    { id: 805, name: 'Justin Kluivert',       position: 'Attacker',   number: 7  }
  ],
  // Real Sociedad
  9: [
    { id: 901, name: 'Alex Remiro',       position: 'Goalkeeper', number: 25 },
    { id: 902, name: 'Aritz Elustondo',   position: 'Defender',   number: 5  },
    { id: 903, name: 'Martin Zubimendi',  position: 'Midfielder', number: 4  },
    { id: 904, name: 'Mikel Oyarzabal',   position: 'Attacker',   number: 10 },
    { id: 905, name: 'David Silva',       position: 'Midfielder', number: 21 },
    { id: 906, name: 'Alexander Isak',    position: 'Attacker',   number: 18 }
  ],
  // Osasuna
  10: [
    { id: 1001, name: 'Sergio Herrera',   position: 'Goalkeeper', number: 25 },
    { id: 1002, name: 'Budimir',          position: 'Attacker',   number: 9  },
    { id: 1003, name: 'Manu Sanchez',     position: 'Defender',   number: 17 },
    { id: 1004, name: 'Lucas Torro',      position: 'Midfielder', number: 5  }
  ],
  // Manchester City
  11: [
    { id: 1101, name: 'Ederson',          position: 'Goalkeeper', number: 31 },
    { id: 1102, name: 'Kyle Walker',      position: 'Defender',   number: 2  },
    { id: 1103, name: 'Ruben Dias',       position: 'Defender',   number: 3  },
    { id: 1104, name: 'Manuel Akanji',    position: 'Defender',   number: 25 },
    { id: 1105, name: 'Josko Gvardiol',   position: 'Defender',   number: 24 },
    { id: 1106, name: 'Rodri',            position: 'Midfielder', number: 16 },
    { id: 1107, name: 'Kevin De Bruyne',  position: 'Midfielder', number: 17 },
    { id: 1108, name: 'Bernardo Silva',   position: 'Midfielder', number: 20 },
    { id: 1109, name: 'Phil Foden',       position: 'Attacker',   number: 47 },
    { id: 1110, name: 'Erling Haaland',   position: 'Attacker',   number: 9  },
    { id: 1111, name: 'Jeremy Doku',      position: 'Attacker',   number: 11 },
    { id: 1112, name: 'Jack Grealish',    position: 'Attacker',   number: 10 }
  ],
  // Arsenal
  12: [
    { id: 1201, name: 'David Raya',       position: 'Goalkeeper', number: 22 },
    { id: 1202, name: 'Ben White',        position: 'Defender',   number: 4  },
    { id: 1203, name: 'William Saliba',   position: 'Defender',   number: 12 },
    { id: 1204, name: 'Gabriel Magalhaes',position: 'Defender',   number: 6  },
    { id: 1205, name: 'Oleksandr Zinchenko', position: 'Defender', number: 35 },
    { id: 1206, name: 'Thomas Partey',    position: 'Midfielder', number: 5  },
    { id: 1207, name: 'Martin Odegaard',  position: 'Midfielder', number: 8  },
    { id: 1208, name: 'Declan Rice',      position: 'Midfielder', number: 41 },
    { id: 1209, name: 'Bukayo Saka',      position: 'Attacker',   number: 7  },
    { id: 1210, name: 'Leandro Trossard', position: 'Attacker',   number: 19 },
    { id: 1211, name: 'Gabriel Martinelli', position: 'Attacker', number: 11 },
    { id: 1212, name: 'Kai Havertz',      position: 'Attacker',   number: 29 }
  ],
  // Liverpool
  13: [
    { id: 1301, name: 'Alisson Becker',   position: 'Goalkeeper', number: 1  },
    { id: 1302, name: 'Trent Alexander-Arnold', position: 'Defender', number: 66 },
    { id: 1303, name: 'Virgil van Dijk',  position: 'Defender',   number: 4  },
    { id: 1304, name: 'Joel Matip',       position: 'Defender',   number: 32 },
    { id: 1305, name: 'Andrew Robertson', position: 'Defender',   number: 26 },
    { id: 1306, name: 'Jordan Henderson', position: 'Midfielder', number: 14 },
    { id: 1307, name: 'Thiago Alcantara', position: 'Midfielder', number: 6  },
    { id: 1308, name: 'Mohamed Salah',    position: 'Attacker',   number: 11 },
    { id: 1309, name: 'Luis Diaz',        position: 'Attacker',   number: 23 },
    { id: 1310, name: 'Darwin Nunez',     position: 'Attacker',   number: 9  },
    { id: 1311, name: 'Cody Gakpo',       position: 'Attacker',   number: 18 }
  ],
  // Chelsea
  14: [
    { id: 1401, name: 'Robert Sanchez',   position: 'Goalkeeper', number: 1  },
    { id: 1402, name: 'Reece James',      position: 'Defender',   number: 24 },
    { id: 1403, name: 'Thiago Silva',     position: 'Defender',   number: 6  },
    { id: 1404, name: 'Levi Colwill',     position: 'Defender',   number: 26 },
    { id: 1405, name: 'Ben Chilwell',     position: 'Defender',   number: 21 },
    { id: 1406, name: 'Moises Caicedo',   position: 'Midfielder', number: 25 },
    { id: 1407, name: 'Enzo Fernandez',   position: 'Midfielder', number: 8  },
    { id: 1408, name: 'Cole Palmer',      position: 'Attacker',   number: 20 },
    { id: 1409, name: 'Nicolas Jackson',  position: 'Attacker',   number: 15 },
    { id: 1410, name: 'Raheem Sterling',  position: 'Attacker',   number: 17 }
  ],
  // Manchester United
  15: [
    { id: 1501, name: 'Andre Onana',       position: 'Goalkeeper', number: 24 },
    { id: 1502, name: 'Victor Lindelof',   position: 'Defender',   number: 2  },
    { id: 1503, name: 'Raphael Varane',    position: 'Defender',   number: 19 },
    { id: 1504, name: 'Luke Shaw',         position: 'Defender',   number: 23 },
    { id: 1505, name: 'Casemiro',          position: 'Midfielder', number: 18 },
    { id: 1506, name: 'Bruno Fernandes',   position: 'Midfielder', number: 8  },
    { id: 1507, name: 'Rasmus Hojlund',    position: 'Attacker',   number: 11 },
    { id: 1508, name: 'Marcus Rashford',   position: 'Attacker',   number: 10 }
  ],
  // Tottenham
  16: [
    { id: 1601, name: 'Guglielmo Vicario', position: 'Goalkeeper', number: 1  },
    { id: 1602, name: 'Pedro Porro',       position: 'Defender',   number: 23 },
    { id: 1603, name: 'Cristian Romero',   position: 'Defender',   number: 17 },
    { id: 1604, name: 'Micky van de Ven',  position: 'Defender',   number: 37 },
    { id: 1605, name: 'Destiny Udogie',    position: 'Defender',   number: 38 },
    { id: 1606, name: 'Yves Bissouma',     position: 'Midfielder', number: 29 },
    { id: 1607, name: 'James Maddison',    position: 'Midfielder', number: 10 },
    { id: 1608, name: 'Son Heung-min',     position: 'Attacker',   number: 7  },
    { id: 1609, name: 'Richarlison',       position: 'Attacker',   number: 9  }
  ],
  // Newcastle
  17: [
    { id: 1701, name: 'Nick Pope',         position: 'Goalkeeper', number: 22 },
    { id: 1702, name: 'Kieran Trippier',   position: 'Defender',   number: 2  },
    { id: 1703, name: 'Fabian Schar',      position: 'Defender',   number: 5  },
    { id: 1704, name: 'Sandro Tonali',     position: 'Midfielder', number: 8  },
    { id: 1705, name: 'Bruno Guimaraes',   position: 'Midfielder', number: 39 },
    { id: 1706, name: 'Alexander Isak',    position: 'Attacker',   number: 14 },
    { id: 1707, name: 'Callum Wilson',     position: 'Attacker',   number: 13 }
  ],
  // Aston Villa
  18: [
    { id: 1801, name: 'Emiliano Martinez',  position: 'Goalkeeper', number: 1  },
    { id: 1802, name: 'Ezri Konsa',          position: 'Defender',   number: 4  },
    { id: 1803, name: 'Tyrone Mings',        position: 'Defender',   number: 5  },
    { id: 1804, name: 'John McGinn',         position: 'Midfielder', number: 7  },
    { id: 1805, name: 'Douglas Luiz',        position: 'Midfielder', number: 6  },
    { id: 1806, name: 'Ollie Watkins',       position: 'Attacker',   number: 11 },
    { id: 1807, name: 'Leon Bailey',         position: 'Attacker',   number: 31 }
  ],
  // Juventus
  21: [
    { id: 2101, name: 'Wojciech Szczesny',  position: 'Goalkeeper', number: 1  },
    { id: 2102, name: 'Danilo',             position: 'Defender',   number: 13 },
    { id: 2103, name: 'Gleison Bremer',     position: 'Defender',   number: 3  },
    { id: 2104, name: 'Alex Sandro',        position: 'Defender',   number: 12 },
    { id: 2105, name: 'Adrien Rabiot',      position: 'Midfielder', number: 25 },
    { id: 2106, name: 'Manuel Locatelli',   position: 'Midfielder', number: 5  },
    { id: 2107, name: 'Filip Kostic',       position: 'Attacker',   number: 11 },
    { id: 2108, name: 'Federico Chiesa',    position: 'Attacker',   number: 7  },
    { id: 2109, name: 'Dusan Vlahovic',     position: 'Attacker',   number: 9  }
  ],
  // Inter Milan
  22: [
    { id: 2201, name: 'Andre Onana',         position: 'Goalkeeper', number: 24 },
    { id: 2202, name: 'Denzel Dumfries',     position: 'Defender',   number: 2  },
    { id: 2203, name: 'Stefan de Vrij',      position: 'Defender',   number: 6  },
    { id: 2204, name: 'Milan Skriniar',      position: 'Defender',   number: 37 },
    { id: 2205, name: 'Alessandro Bastoni',  position: 'Defender',   number: 95 },
    { id: 2206, name: 'Nicolo Barella',      position: 'Midfielder', number: 23 },
    { id: 2207, name: 'Marcelo Brozovic',    position: 'Midfielder', number: 77 },
    { id: 2208, name: 'Henrikh Mkhitaryan',  position: 'Midfielder', number: 22 },
    { id: 2209, name: 'Romelu Lukaku',       position: 'Attacker',   number: 90 },
    { id: 2210, name: 'Lautaro Martinez',    position: 'Attacker',   number: 10 },
    { id: 2211, name: 'Edin Dzeko',          position: 'Attacker',   number: 9  }
  ],
  // AC Milan
  23: [
    { id: 2301, name: 'Mike Maignan',       position: 'Goalkeeper', number: 16 },
    { id: 2302, name: 'Davide Calabria',    position: 'Defender',   number: 2  },
    { id: 2303, name: 'Fikayo Tomori',      position: 'Defender',   number: 23 },
    { id: 2304, name: 'Theo Hernandez',     position: 'Defender',   number: 19 },
    { id: 2305, name: 'Sandro Tonali',      position: 'Midfielder', number: 8  },
    { id: 2306, name: 'Ismael Bennacer',    position: 'Midfielder', number: 4  },
    { id: 2307, name: 'Rafael Leao',        position: 'Attacker',   number: 17 },
    { id: 2308, name: 'Olivier Giroud',     position: 'Attacker',   number: 9  },
    { id: 2309, name: 'Christian Pulisic',  position: 'Attacker',   number: 11 }
  ],
  // Napoli
  24: [
    { id: 2401, name: 'Alex Meret',          position: 'Goalkeeper', number: 1  },
    { id: 2402, name: 'Giovanni Di Lorenzo', position: 'Defender',   number: 22 },
    { id: 2403, name: 'Kim Min-jae',          position: 'Defender',   number: 5  },
    { id: 2404, name: 'Mario Rui',            position: 'Defender',   number: 6  },
    { id: 2405, name: 'Stanislav Lobotka',    position: 'Midfielder', number: 68 },
    { id: 2406, name: 'Piotr Zielinski',      position: 'Midfielder', number: 20 },
    { id: 2407, name: 'Khvicha Kvaratskhelia', position: 'Attacker',  number: 77 },
    { id: 2408, name: 'Victor Osimhen',       position: 'Attacker',   number: 9  }
  ],
  // Bayern Munich
  31: [
    { id: 3101, name: 'Manuel Neuer',        position: 'Goalkeeper', number: 1  },
    { id: 3102, name: 'Noussair Mazraoui',   position: 'Defender',   number: 40 },
    { id: 3103, name: 'Dayot Upamecano',     position: 'Defender',   number: 2  },
    { id: 3104, name: 'Min-jae Kim',          position: 'Defender',   number: 5  },
    { id: 3105, name: 'Alphonso Davies',     position: 'Defender',   number: 19 },
    { id: 3106, name: 'Joshua Kimmich',      position: 'Midfielder', number: 6  },
    { id: 3107, name: 'Leon Goretzka',       position: 'Midfielder', number: 8  },
    { id: 3108, name: 'Jamal Musiala',       position: 'Midfielder', number: 42 },
    { id: 3109, name: 'Thomas Muller',       position: 'Attacker',   number: 25 },
    { id: 3110, name: 'Leroy Sane',          position: 'Attacker',   number: 10 },
    { id: 3111, name: 'Harry Kane',          position: 'Attacker',   number: 9  },
    { id: 3112, name: 'Serge Gnabry',        position: 'Attacker',   number: 7  }
  ],
  // Borussia Dortmund
  32: [
    { id: 3201, name: 'Gregor Kobel',        position: 'Goalkeeper', number: 1  },
    { id: 3202, name: 'Mats Hummels',        position: 'Defender',   number: 15 },
    { id: 3203, name: 'Nico Schlotterbeck',  position: 'Defender',   number: 4  },
    { id: 3204, name: 'Raphael Guerreiro',   position: 'Defender',   number: 13 },
    { id: 3205, name: 'Emre Can',            position: 'Midfielder', number: 23 },
    { id: 3206, name: 'Jude Bellingham',     position: 'Midfielder', number: 22 },
    { id: 3207, name: 'Marco Reus',          position: 'Attacker',   number: 11 },
    { id: 3208, name: 'Julian Brandt',       position: 'Attacker',   number: 19 },
    { id: 3209, name: 'Sebastien Haller',    position: 'Attacker',   number: 9  },
    { id: 3210, name: 'Felix Nmecha',        position: 'Midfielder', number: 8  }
  ],
  // Bayer Leverkusen
  33: [
    { id: 3301, name: 'Lukáš Hrádecký',      position: 'Goalkeeper', number: 1  },
    { id: 3302, name: 'Jonathan Tah',         position: 'Defender',   number: 4  },
    { id: 3303, name: 'Edmond Tapsoba',       position: 'Defender',   number: 5  },
    { id: 3304, name: 'Granit Xhaka',         position: 'Midfielder', number: 34 },
    { id: 3305, name: 'Florian Wirtz',        position: 'Midfielder', number: 10 },
    { id: 3306, name: 'Alejandro Grimaldo',   position: 'Defender',   number: 12 },
    { id: 3307, name: 'Granit Xhaka',         position: 'Midfielder', number: 34 },
    { id: 3308, name: 'Patrik Schick',        position: 'Attacker',   number: 14 },
    { id: 3309, name: 'Callum Hudson-Odoi',   position: 'Attacker',   number: 7  }
  ],
  // PSG
  41: [
    { id: 4101, name: 'Gianluigi Donnarumma', position: 'Goalkeeper', number: 99 },
    { id: 4102, name: 'Achraf Hakimi',         position: 'Defender',   number: 2  },
    { id: 4103, name: 'Marquinhos',            position: 'Defender',   number: 5  },
    { id: 4104, name: 'Presnel Kimpembe',      position: 'Defender',   number: 3  },
    { id: 4105, name: 'Nuno Mendes',           position: 'Defender',   number: 25 },
    { id: 4106, name: 'Marco Verratti',        position: 'Midfielder', number: 6  },
    { id: 4107, name: 'Vitinha',               position: 'Midfielder', number: 17 },
    { id: 4108, name: 'Ousmane Dembele',       position: 'Attacker',   number: 10 },
    { id: 4109, name: 'Kylian Mbappe',         position: 'Attacker',   number: 7  },
    { id: 4110, name: 'Randal Kolo Muani',     position: 'Attacker',   number: 23 }
  ],
  // Monaco
  43: [
    { id: 4301, name: 'Radoslaw Majecki',     position: 'Goalkeeper', number: 1  },
    { id: 4302, name: 'Wilfried Singo',        position: 'Defender',   number: 27 },
    { id: 4303, name: 'Axel Disasi',           position: 'Defender',   number: 6  },
    { id: 4304, name: 'Takumi Minamino',       position: 'Attacker',   number: 18 },
    { id: 4305, name: 'Wissam Ben Yedder',     position: 'Attacker',   number: 10 }
  ],
  // Marseille
  42: [
    { id: 4201, name: 'Pau Lopez',            position: 'Goalkeeper', number: 16 },
    { id: 4202, name: 'Jonathan Clauss',       position: 'Defender',   number: 17 },
    { id: 4203, name: 'Samuel Gigot',          position: 'Defender',   number: 5  },
    { id: 4204, name: 'Alexis Sanchez',        position: 'Attacker',   number: 70 },
    { id: 4205, name: 'Pierre-Emerick Aubameyang', position: 'Attacker', number: 9 }
  ]
};

function getLocalData(key, defaultVal) {
  try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : defaultVal; }
  catch(e) { return defaultVal; }
}
function setLocalData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

async function searchTeamAPI(teamName) {
  await new Promise(function(r){ setTimeout(r, 400); });
  var q = teamName.toLowerCase();
  return MOCK_TEAMS.filter(function(t){ return t.name.toLowerCase().indexOf(q) !== -1; })
                   .map(function(t){ return { team: t }; });
}

async function getSquadAPI(apiTeamId) {
  await new Promise(function(r){ setTimeout(r, 200); });
  return MOCK_SQUADS[apiTeamId] || [];
}

async function saveTeamWithPlayers(team, players, source) {
  var savedTeams   = getLocalData('ob_teams', []);
  var savedPlayers = getLocalData('ob_players', []);
  var existing = null;
  for (var i=0; i<savedTeams.length; i++) {
    if (savedTeams[i].api_team_id === team.id) { existing = savedTeams[i]; break; }
  }
  if (!existing) {
    existing = { id: Date.now().toString(), name: team.name, api_team_id: team.id };
    savedTeams.push(existing);
    setLocalData('ob_teams', savedTeams);
    var newPlayers = players.map(function(p){
      return { id: String(p.id || Math.random().toString(36).substr(2,9)), team_id: existing.id, name: p.name, position: p.position||null, number: p.number||null };
    });
    setLocalData('ob_players', savedPlayers.concat(newPlayers));
  }
  return existing;
}

async function addManualPlayer(teamId, player) {
  var savedPlayers = getLocalData('ob_players', []);
  var np = Object.assign({ id: 'manual_'+Date.now(), team_id: teamId }, player);
  savedPlayers.push(np);
  setLocalData('ob_players', savedPlayers);
  return np;
}

async function getTeamPlayers(teamId) {
  var all = getLocalData('ob_players', []);
  return all.filter(function(p){ return p.team_id === teamId; })
            .sort(function(a,b){ return (a.number||99)-(b.number||99); });
}

function getAllLeagues() {
  var leagues = {};
  MOCK_TEAMS.forEach(function(t){ leagues[t.league] = true; });
  return Object.keys(leagues);
}

function getTeamsByLeague(league) {
  return MOCK_TEAMS.filter(function(t){ return t.league === league; });
}
