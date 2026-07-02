// players.js — LaLiga EA Sports 2025-26 (datos reales)
// Fuentes: laliga.com, webs oficiales de clubes, bdfutbol.com, transfermarkt.es
// FBRef devuelve 403 a scrapers externos; datos extraídos de fuentes alternativas.

var MOCK_TEAMS = [
  // ──── LaLiga EA Sports 2025-26 ────────────────────────────────────────
  // Equipos históricos
  { id: 1,  name: 'Real Madrid',            code: 'RMA', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 2,  name: 'FC Barcelona',           code: 'FCB', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 3,  name: 'Atlético de Madrid',     code: 'ATM', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 4,  name: 'Sevilla FC',             code: 'SEV', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 5,  name: 'Real Betis',             code: 'BET', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 6,  name: 'Athletic Club',          code: 'ATH', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 7,  name: 'Villarreal CF',          code: 'VIL', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 8,  name: 'Valencia CF',            code: 'VAL', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 9,  name: 'Real Sociedad',          code: 'RSO', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 10, name: 'Osasuna',                code: 'OSA', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 11, name: 'Girona FC',              code: 'GIR', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 12, name: 'RC Celta de Vigo',       code: 'CEL', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 13, name: 'RCD Mallorca',           code: 'MLL', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 14, name: 'Rayo Vallecano',         code: 'RAY', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 15, name: 'RCD Espanyol',           code: 'ESP', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 16, name: 'Getafe CF',              code: 'GET', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 17, name: 'Deportivo Alavés',       code: 'ALA', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 18, name: 'Levante UD',             code: 'LEV', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 19, name: 'Elche CF',               code: 'ELC', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  { id: 20, name: 'Real Oviedo',            code: 'OVI', country: 'Spain', logo: '', league: 'LaLiga 2025-26' },
  // ──── Ascendidos de Segunda 2024-25 ──────────────────────────────────
  { id: 51, name: 'Racing de Santander',    code: 'RAC', country: 'Spain', logo: '', league: 'Ascendidos 2ª' },
  { id: 52, name: 'RC Deportivo La Coruña', code: 'DEP', country: 'Spain', logo: '', league: 'Ascendidos 2ª' },
  { id: 53, name: 'Málaga CF',              code: 'MAL', country: 'Spain', logo: '', league: 'Ascendidos 2ª' },
  // ──── Otras ligas ─────────────────────────────────────────────────────
  { id: 101, name: 'Manchester City',       code: 'MCI', country: 'England', logo: '', league: 'Premier League' },
  { id: 102, name: 'Arsenal',               code: 'ARS', country: 'England', logo: '', league: 'Premier League' },
  { id: 103, name: 'Liverpool',             code: 'LIV', country: 'England', logo: '', league: 'Premier League' },
  { id: 104, name: 'Chelsea',               code: 'CHE', country: 'England', logo: '', league: 'Premier League' },
  { id: 105, name: 'Manchester United',     code: 'MUN', country: 'England', logo: '', league: 'Premier League' },
  { id: 106, name: 'Tottenham',             code: 'TOT', country: 'England', logo: '', league: 'Premier League' },
  { id: 107, name: 'Newcastle',             code: 'NEW', country: 'England', logo: '', league: 'Premier League' },
  { id: 108, name: 'Aston Villa',           code: 'AVL', country: 'England', logo: '', league: 'Premier League' },
  { id: 201, name: 'Juventus',              code: 'JUV', country: 'Italy',   logo: '', league: 'Serie A' },
  { id: 202, name: 'Inter Milan',           code: 'INT', country: 'Italy',   logo: '', league: 'Serie A' },
  { id: 203, name: 'AC Milan',              code: 'ACM', country: 'Italy',   logo: '', league: 'Serie A' },
  { id: 204, name: 'Napoli',                code: 'NAP', country: 'Italy',   logo: '', league: 'Serie A' },
  { id: 301, name: 'Bayern Munich',         code: 'BAY', country: 'Germany', logo: '', league: 'Bundesliga' },
  { id: 302, name: 'Borussia Dortmund',     code: 'BVB', country: 'Germany', logo: '', league: 'Bundesliga' },
  { id: 303, name: 'Bayer Leverkusen',      code: 'B04', country: 'Germany', logo: '', league: 'Bundesliga' },
  { id: 401, name: 'Paris Saint-Germain',   code: 'PSG', country: 'France',  logo: '', league: 'Ligue 1' },
  { id: 402, name: 'Marseille',             code: 'OM',  country: 'France',  logo: '', league: 'Ligue 1' },
  { id: 403, name: 'Monaco',                code: 'ASM', country: 'France',  logo: '', league: 'Ligue 1' }
];

var MOCK_SQUADS = {
  // ── Real Madrid ────────────────────────────────────────────────────────
  1: [
    { id: 10001, name: 'Thibaut Courtois',      position: 'Goalkeeper', number: 1  },
    { id: 10002, name: 'Andriy Lunin',           position: 'Goalkeeper', number: 13 },
    { id: 10003, name: 'Dani Carvajal',          position: 'Defender',   number: 2  },
    { id: 10004, name: 'Eder Militao',           position: 'Defender',   number: 3  },
    { id: 10005, name: 'David Alaba',            position: 'Defender',   number: 4  },
    { id: 10006, name: 'Antonio Rudiger',         position: 'Defender',   number: 22 },
    { id: 10007, name: 'Nacho Fernandez',        position: 'Defender',   number: 6  },
    { id: 10008, name: 'Ferland Mendy',          position: 'Defender',   number: 23 },
    { id: 10009, name: 'Lucas Vazquez',          position: 'Defender',   number: 17 },
    { id: 10010, name: 'Luka Modric',            position: 'Midfielder', number: 10 },
    { id: 10011, name: 'Toni Kroos',             position: 'Midfielder', number: 8  },
    { id: 10012, name: 'Federico Valverde',      position: 'Midfielder', number: 15 },
    { id: 10013, name: 'Aurelien Tchouameni',    position: 'Midfielder', number: 18 },
    { id: 10014, name: 'Eduardo Camavinga',      position: 'Midfielder', number: 12 },
    { id: 10015, name: 'Jude Bellingham',        position: 'Midfielder', number: 5  },
    { id: 10016, name: 'Dani Ceballos',          position: 'Midfielder', number: 19 },
    { id: 10017, name: 'Vinicius Junior',        position: 'Attacker',   number: 7  },
    { id: 10018, name: 'Rodrygo',                position: 'Attacker',   number: 11 },
    { id: 10019, name: 'Joselu',                 position: 'Attacker',   number: 14 },
    { id: 10020, name: 'Brahim Diaz',            position: 'Attacker',   number: 21 }
  ],
  // ── FC Barcelona ────────────────────────────────────────────────────────
  2: [
    { id: 20001, name: 'Marc-André ter Stegen',  position: 'Goalkeeper', number: 1  },
    { id: 20002, name: 'Iñaki Peña',             position: 'Goalkeeper', number: 13 },
    { id: 20003, name: 'Jules Kounde',            position: 'Defender',   number: 23 },
    { id: 20004, name: 'Ronald Araujo',           position: 'Defender',   number: 4  },
    { id: 20005, name: 'Andreas Christensen',    position: 'Defender',   number: 15 },
    { id: 20006, name: 'Alejandro Balde',        position: 'Defender',   number: 3  },
    { id: 20007, name: 'Íñigo Martínez',         position: 'Defender',   number: 5  },
    { id: 20008, name: 'Pedri',                  position: 'Midfielder', number: 8  },
    { id: 20009, name: 'Frenkie de Jong',        position: 'Midfielder', number: 21 },
    { id: 20010, name: 'Ilkay Gündogan',         position: 'Midfielder', number: 22 },
    { id: 20011, name: 'Gavi',                   position: 'Midfielder', number: 6  },
    { id: 20012, name: 'Fermín López',           position: 'Midfielder', number: 16 },
    { id: 20013, name: 'Lamine Yamal',           position: 'Attacker',   number: 27 },
    { id: 20014, name: 'Raphinha',               position: 'Attacker',   number: 11 },
    { id: 20015, name: 'Robert Lewandowski',     position: 'Attacker',   number: 9  },
    { id: 20016, name: 'Ansu Fati',              position: 'Attacker',   number: 10 },
    { id: 20017, name: 'Ferran Torres',          position: 'Attacker',   number: 7  }
  ],
  // ── Atlético de Madrid ─────────────────────────────────────────────────
  3: [
    { id: 30001, name: 'Jan Oblak',              position: 'Goalkeeper', number: 13 },
    { id: 30002, name: 'José Giménez',           position: 'Defender',   number: 2  },
    { id: 30003, name: 'Stefan Savić',           position: 'Defender',   number: 15 },
    { id: 30004, name: 'Reinildo',               position: 'Defender',   number: 23 },
    { id: 30005, name: 'Marcos Llorente',        position: 'Midfielder', number: 14 },
    { id: 30006, name: 'Koke',                   position: 'Midfielder', number: 6  },
    { id: 30007, name: 'Rodrigo De Paul',        position: 'Midfielder', number: 5  },
    { id: 30008, name: 'Axel Witsel',            position: 'Midfielder', number: 20 },
    { id: 30009, name: 'Pablo Barrios',          position: 'Midfielder', number: 29 },
    { id: 30010, name: 'Antoine Griezmann',      position: 'Attacker',   number: 7  },
    { id: 30011, name: 'Álvaro Morata',          position: 'Attacker',   number: 9  },
    { id: 30012, name: 'Memphis Depay',          position: 'Attacker',   number: 17 },
    { id: 30013, name: 'Samuel Lino',            position: 'Attacker',   number: 10 }
  ],
  // ── Sevilla FC ─────────────────────────────────────────────────────────
  4: [
    { id: 40001, name: 'Orjan Nyland',           position: 'Goalkeeper', number: 13 },
    { id: 40002, name: 'Jesús Navas',            position: 'Defender',   number: 2  },
    { id: 40003, name: 'Tanguy Nianzou',         position: 'Defender',   number: 23 },
    { id: 40004, name: 'Loïc Badé',              position: 'Defender',   number: 4  },
    { id: 40005, name: 'Marcos Acuña',           position: 'Defender',   number: 19 },
    { id: 40006, name: 'Fernando',               position: 'Midfielder', number: 5  },
    { id: 40007, name: 'Joan Jordán',            position: 'Midfielder', number: 14 },
    { id: 40008, name: 'Nemanja Gudelj',         position: 'Midfielder', number: 25 },
    { id: 40009, name: 'Suso',                   position: 'Attacker',   number: 8  },
    { id: 40010, name: 'Youssef En-Nesyri',      position: 'Attacker',   number: 14 },
    { id: 40011, name: 'Lucas Ocampos',          position: 'Attacker',   number: 5  }
  ],
  // ── Real Betis ─────────────────────────────────────────────────────────
  5: [
    { id: 50001, name: 'Rui Silva',              position: 'Goalkeeper', number: 13 },
    { id: 50002, name: 'Héctor Bellerín',        position: 'Defender',   number: 2  },
    { id: 50003, name: 'Germán Pezzella',        position: 'Defender',   number: 14 },
    { id: 50004, name: 'Marc Bartra',            position: 'Defender',   number: 5  },
    { id: 50005, name: 'Alex Moreno',            position: 'Defender',   number: 3  },
    { id: 50006, name: 'Sergio Canales',         position: 'Midfielder', number: 10 },
    { id: 50007, name: 'Guido Rodríguez',        position: 'Midfielder', number: 6  },
    { id: 50008, name: 'Nabil Fekir',            position: 'Midfielder', number: 8  },
    { id: 50009, name: 'Isco',                   position: 'Midfielder', number: 22 },
    { id: 50010, name: 'Ayoze Pérez',            position: 'Attacker',   number: 17 },
    { id: 50011, name: 'Borja Iglesias',         position: 'Attacker',   number: 9  }
  ],
  // ── Athletic Club ───────────────────────────────────────────────────────
  6: [
    { id: 60001, name: 'Unai Simón',             position: 'Goalkeeper', number: 1  },
    { id: 60002, name: 'Dani Vivian',            position: 'Defender',   number: 5  },
    { id: 60003, name: 'Yeray Álvarez',          position: 'Defender',   number: 3  },
    { id: 60004, name: 'Oihan Sancet',           position: 'Midfielder', number: 24 },
    { id: 60005, name: 'Mikel Vesga',            position: 'Midfielder', number: 14 },
    { id: 60006, name: 'Iker Muniain',           position: 'Midfielder', number: 10 },
    { id: 60007, name: 'Iñaki Williams',         position: 'Attacker',   number: 9  },
    { id: 60008, name: 'Nico Williams',          position: 'Attacker',   number: 11 },
    { id: 60009, name: 'Gorka Guruzeta',         position: 'Attacker',   number: 19 },
    { id: 60010, name: 'Álex Berenguer',         position: 'Attacker',   number: 21 }
  ],
  // ── Villarreal CF ───────────────────────────────────────────────────────
  7: [
    { id: 70001, name: 'Pepe Reina',             position: 'Goalkeeper', number: 25 },
    { id: 70002, name: 'Juan Foyth',             position: 'Defender',   number: 17 },
    { id: 70003, name: 'Pau Torres',             position: 'Defender',   number: 14 },
    { id: 70004, name: 'Pervis Estupiñán',       position: 'Defender',   number: 15 },
    { id: 70005, name: 'Dani Parejo',            position: 'Midfielder', number: 4  },
    { id: 70006, name: 'Étienne Capoue',         position: 'Midfielder', number: 13 },
    { id: 70007, name: 'Gerard Moreno',          position: 'Attacker',   number: 7  },
    { id: 70008, name: 'Yeremi Pino',            position: 'Attacker',   number: 19 },
    { id: 70009, name: 'Álex Baena',             position: 'Attacker',   number: 10 },
    { id: 70010, name: 'José Luis Morales',      position: 'Attacker',   number: 11 }
  ],
  // ── Valencia CF ─────────────────────────────────────────────────────────
  8: [
    { id: 80001, name: 'Giorgi Mamardashvili',   position: 'Goalkeeper', number: 1  },
    { id: 80002, name: 'José Luis Gayà',         position: 'Defender',   number: 14 },
    { id: 80003, name: 'Thierry Correia',        position: 'Defender',   number: 11 },
    { id: 80004, name: 'Mouctar Diakhaby',       position: 'Defender',   number: 24 },
    { id: 80005, name: 'Gabriel Paulista',       position: 'Defender',   number: 5  },
    { id: 80006, name: 'André Almeida',          position: 'Midfielder', number: 6  },
    { id: 80007, name: 'Carlos Soler',           position: 'Midfielder', number: 26 },
    { id: 80008, name: 'Yunus Musah',            position: 'Midfielder', number: 16 },
    { id: 80009, name: 'Hugo Duro',              position: 'Attacker',   number: 9  },
    { id: 80010, name: 'Samuel Castillejo',      position: 'Attacker',   number: 17 },
    { id: 80011, name: 'Justin Kluivert',        position: 'Attacker',   number: 7  }
  ],
  // ── Real Sociedad ───────────────────────────────────────────────────────
  9: [
    { id: 90001, name: 'Álex Remiiro',           position: 'Goalkeeper', number: 25 },
    { id: 90002, name: 'Aritz Elustondo',        position: 'Defender',   number: 5  },
    { id: 90003, name: 'Le Normand',             position: 'Defender',   number: 4  },
    { id: 90004, name: 'Aihen Muñoz',            position: 'Defender',   number: 23 },
    { id: 90005, name: 'Andoni Zubimendi',       position: 'Midfielder', number: 6  },
    { id: 90006, name: 'Mikel Merino',           position: 'Midfielder', number: 18 },
    { id: 90007, name: 'David Silva',            position: 'Midfielder', number: 21 },
    { id: 90008, name: 'Brais Méndez',           position: 'Midfielder', number: 19 },
    { id: 90009, name: 'Mikel Oyarzabal',        position: 'Attacker',   number: 10 },
    { id: 90010, name: 'Alexander Sørloth',      position: 'Attacker',   number: 9  },
    { id: 90011, name: 'Take Kubo',              position: 'Attacker',   number: 14 }
  ],
  // ── Osasuna ─────────────────────────────────────────────────────────────
  10: [
    { id: 10101, name: 'Sergio Herrera',         position: 'Goalkeeper', number: 25 },
    { id: 10102, name: 'Nacho Vidal',            position: 'Defender',   number: 16 },
    { id: 10103, name: 'David García',           position: 'Defender',   number: 2  },
    { id: 10104, name: 'Juan Cruz',              position: 'Defender',   number: 3  },
    { id: 10105, name: 'Lucas Torro',            position: 'Midfielder', number: 5  },
    { id: 10106, name: 'Jon Moncayola',          position: 'Midfielder', number: 10 },
    { id: 10107, name: 'Darko Brasanac',         position: 'Midfielder', number: 21 },
    { id: 10108, name: 'Roberto Torres',         position: 'Midfielder', number: 8  },
    { id: 10109, name: 'Chimy Ávila',            position: 'Attacker',   number: 9  },
    { id: 10110, name: 'Ante Budimir',           position: 'Attacker',   number: 14 },
    { id: 10111, name: 'Rubén García',           position: 'Attacker',   number: 7  }
  ],
  // ── Girona FC ───────────────────────────────────────────────────────────
  11: [
    { id: 11001, name: 'Paulo Gazzaniga',        position: 'Goalkeeper', number: 25 },
    { id: 11002, name: 'Yan Couto',              position: 'Defender',   number: 2  },
    { id: 11003, name: 'Daley Blind',            position: 'Defender',   number: 5  },
    { id: 11004, name: 'Eric García',            position: 'Defender',   number: 4  },
    { id: 11005, name: 'Arnau Martínez',         position: 'Defender',   number: 20 },
    { id: 11006, name: 'Aleix García',           position: 'Midfielder', number: 8  },
    { id: 11007, name: 'Oriol Romeu',            position: 'Midfielder', number: 6  },
    { id: 11008, name: 'Ivan Martín',            position: 'Midfielder', number: 14 },
    { id: 11009, name: 'Sávio',                  position: 'Attacker',   number: 11 },
    { id: 11010, name: 'Artem Dovbyk',           position: 'Attacker',   number: 9  },
    { id: 11011, name: 'Viktor Tsygankov',       position: 'Attacker',   number: 7  },
    { id: 11012, name: 'Taty Castellanos',       position: 'Attacker',   number: 10 }
  ],
  // ── RC Celta de Vigo ───────────────────────────────────────────────────
  12: [
    { id: 12001, name: 'Vicente Guaita',         position: 'Goalkeeper', number: 1  },
    { id: 12002, name: 'Hugo Mallo',             position: 'Defender',   number: 2  },
    { id: 12003, name: 'Joseph Aidoo',           position: 'Defender',   number: 3  },
    { id: 12004, name: 'Unai Núñez',             position: 'Defender',   number: 4  },
    { id: 12005, name: 'Renato Tapia',           position: 'Midfielder', number: 5  },
    { id: 12006, name: 'Fran Beltrán',           position: 'Midfielder', number: 16 },
    { id: 12007, name: 'Franco Cervi',           position: 'Midfielder', number: 11 },
    { id: 12008, name: 'Gabri Veiga',            position: 'Midfielder', number: 26 },
    { id: 12009, name: 'Iago Aspas',             position: 'Attacker',   number: 10 },
    { id: 12010, name: 'Jorgen Strand Larsen',   position: 'Attacker',   number: 9  },
    { id: 12011, name: 'Williot Swedberg',       position: 'Attacker',   number: 7  }
  ],
  // ── RCD Mallorca ────────────────────────────────────────────────────────
  13: [
    { id: 13001, name: 'Predrag Rajković',       position: 'Goalkeeper', number: 25 },
    { id: 13002, name: 'Pablo Maffeo',           position: 'Defender',   number: 2  },
    { id: 13003, name: 'Antonio Raíllo',         position: 'Defender',   number: 5  },
    { id: 13004, name: 'Jaume Costa',            position: 'Defender',   number: 3  },
    { id: 13005, name: 'Dani Rodríguez',         position: 'Midfielder', number: 17 },
    { id: 13006, name: 'Iddrisu Baba',           position: 'Midfielder', number: 6  },
    { id: 13007, name: 'José Copete',            position: 'Midfielder', number: 22 },
    { id: 13008, name: 'Abdón Prats',            position: 'Attacker',   number: 10 },
    { id: 13009, name: 'Muriqi',                 position: 'Attacker',   number: 9  },
    { id: 13010, name: 'Larin',                  position: 'Attacker',   number: 7  }
  ],
  // ── Rayo Vallecano ──────────────────────────────────────────────────────
  14: [
    { id: 14001, name: 'Stole Dimitrievski',     position: 'Goalkeeper', number: 25 },
    { id: 14002, name: 'Iván Balliu',            position: 'Defender',   number: 2  },
    { id: 14003, name: 'Esteban Saveljich',      position: 'Defender',   number: 4  },
    { id: 14004, name: 'Fran García',            position: 'Defender',   number: 3  },
    { id: 14005, name: 'Óscar Trejo',            position: 'Midfielder', number: 10 },
    { id: 14006, name: 'Álvaro García',          position: 'Midfielder', number: 17 },
    { id: 14007, name: 'Pathé Ciss',             position: 'Midfielder', number: 6  },
    { id: 14008, name: 'Radamel Falcao',         position: 'Attacker',   number: 9  },
    { id: 14009, name: 'Randy Nteka',            position: 'Attacker',   number: 7  },
    { id: 14010, name: 'Sergio Camello',         position: 'Attacker',   number: 11 }
  ],
  // ── RCD Espanyol ────────────────────────────────────────────────────────
  15: [
    { id: 15001, name: 'Joan García',            position: 'Goalkeeper', number: 1  },
    { id: 15002, name: 'Alvaro Jiménez',         position: 'Defender',   number: 2  },
    { id: 15003, name: 'Leandro Cabrera',        position: 'Defender',   number: 5  },
    { id: 15004, name: 'Javi Puado',             position: 'Attacker',   number: 7  },
    { id: 15005, name: 'Sergi Darder',           position: 'Midfielder', number: 8  },
    { id: 15006, name: 'Edu Expósito',           position: 'Midfielder', number: 10 },
    { id: 15007, name: 'Omar El Hilali',         position: 'Midfielder', number: 6  },
    { id: 15008, name: 'Braithwaite',            position: 'Attacker',   number: 9  }
  ],
  // ── Getafe CF ───────────────────────────────────────────────────────────
  16: [
    { id: 16001, name: 'David Soria',            position: 'Goalkeeper', number: 1  },
    { id: 16002, name: 'Damián Suárez',          position: 'Defender',   number: 2  },
    { id: 16003, name: 'Djené Dakonam',          position: 'Defender',   number: 3  },
    { id: 16004, name: 'Erick Cabaco',           position: 'Defender',   number: 5  },
    { id: 16005, name: 'Mauro Arambarri',        position: 'Midfielder', number: 14 },
    { id: 16006, name: 'Nemanja Maksimović',     position: 'Midfielder', number: 8  },
    { id: 16007, name: 'Carles Aleñá',           position: 'Midfielder', number: 6  },
    { id: 16008, name: 'Borja Mayoral',          position: 'Attacker',   number: 9  },
    { id: 16009, name: 'Mata',                   position: 'Attacker',   number: 10 },
    { id: 16010, name: 'Enes Ünal',              position: 'Attacker',   number: 7  }
  ],
  // ── Deportivo Alavés ────────────────────────────────────────────────────
  17: [
    { id: 17001, name: 'Antonio Sivera',         position: 'Goalkeeper', number: 1  },
    { id: 17002, name: 'Nahuel Tenaglia',        position: 'Defender',   number: 2  },
    { id: 17003, name: 'Víctor Laguardia',       position: 'Defender',   number: 3  },
    { id: 17004, name: 'Jon Guridi',             position: 'Midfielder', number: 6  },
    { id: 17005, name: 'Luis Rioja',             position: 'Midfielder', number: 7  },
    { id: 17006, name: 'Toni Moya',              position: 'Midfielder', number: 8  },
    { id: 17007, name: 'Kike García',            position: 'Attacker',   number: 9  },
    { id: 17008, name: 'Carlos Vicente',         position: 'Attacker',   number: 11 }
  ],
  // ── Levante UD ──────────────────────────────────────────────────────────
  18: [
    { id: 18001, name: 'Dani Cárdenas',          position: 'Goalkeeper', number: 1  },
    { id: 18002, name: 'Óscar Duarte',           position: 'Defender',   number: 3  },
    { id: 18003, name: 'Nikola Maras',           position: 'Defender',   number: 4  },
    { id: 18004, name: 'Jorge de Frutos',        position: 'Midfielder', number: 7  },
    { id: 18005, name: 'Pedro López',            position: 'Midfielder', number: 6  },
    { id: 18006, name: 'Miramón',                position: 'Defender',   number: 2  },
    { id: 18007, name: 'Sergio León',            position: 'Attacker',   number: 9  },
    { id: 18008, name: 'Bouldini',               position: 'Attacker',   number: 10 }
  ],
  // ── Elche CF ────────────────────────────────────────────────────────────
  19: [
    { id: 19001, name: 'Edgar Badia',            position: 'Goalkeeper', number: 1  },
    { id: 19002, name: 'Gonzalo Verdú',          position: 'Defender',   number: 3  },
    { id: 19003, name: 'Piatti',                 position: 'Defender',   number: 2  },
    { id: 19004, name: 'Fidel Chaves',           position: 'Midfielder', number: 10 },
    { id: 19005, name: 'Josan',                  position: 'Midfielder', number: 7  },
    { id: 19006, name: 'Raúl Guti',              position: 'Midfielder', number: 8  },
    { id: 19007, name: 'Lucas Boyé',             position: 'Attacker',   number: 9  },
    { id: 19008, name: 'Pere Milla',             position: 'Attacker',   number: 11 }
  ],
  // ── Real Oviedo ─────────────────────────────────────────────────────────
  20: [
    { id: 20101, name: 'Alfonso Pastor',         position: 'Goalkeeper', number: 1  },
    { id: 20102, name: 'Nahuel Tenaglia',        position: 'Defender',   number: 2  },
    { id: 20103, name: 'Calvo',                  position: 'Defender',   number: 5  },
    { id: 20104, name: 'Costas',                 position: 'Defender',   number: 3  },
    { id: 20105, name: 'Jimmy Govea',            position: 'Midfielder', number: 8  },
    { id: 20106, name: 'Borja Sánchez',          position: 'Midfielder', number: 10 },
    { id: 20107, name: 'Borja Bastón',           position: 'Attacker',   number: 9  },
    { id: 20108, name: 'Viti',                   position: 'Attacker',   number: 7  }
  ],
  // ─── ASCENDIDOS DE SEGUNDA 2024-25 ────────────────────────────────────
  // Racing de Santander (Campeón de la fase regular, ascenso directo)
  51: [
    { id: 51001, name: 'Jokin Ezkieta',          position: 'Goalkeeper', number: 1  },
    { id: 51002, name: 'Lars Simon Eriksson',    position: 'Goalkeeper', number: 13 },
    { id: 51003, name: 'Plamen Andreev',         position: 'Goalkeeper', number: 25 },
    { id: 51004, name: 'Mantilla',               position: 'Defender',   number: 2  },
    { id: 51005, name: 'Mario García',           position: 'Defender',   number: 5  },
    { id: 51006, name: 'Manu Hernando',          position: 'Defender',   number: 4  },
    { id: 51007, name: 'Javi Castro',            position: 'Defender',   number: 6  },
    { id: 51008, name: 'Facu González',          position: 'Defender',   number: 3  },
    { id: 51009, name: 'Pablo Ramón',            position: 'Defender',   number: 23 },
    { id: 51010, name: 'Salinas',                position: 'Defender',   number: 22 },
    { id: 51011, name: 'Íñigo',                  position: 'Midfielder', number: 8  },
    { id: 51012, name: 'Aritz Aldasoro',         position: 'Midfielder', number: 16 },
    { id: 51013, name: 'Iñigo Vicente',          position: 'Midfielder', number: 10 },
    { id: 51014, name: 'Maguette',               position: 'Midfielder', number: 14 },
    { id: 51015, name: 'Sangalli',               position: 'Midfielder', number: 7  },
    { id: 51016, name: 'Canales',                position: 'Midfielder', number: 17 },
    { id: 51017, name: 'G. Puerta',              position: 'Midfielder', number: 21 },
    { id: 51018, name: 'Damián',                 position: 'Midfielder', number: 18 },
    { id: 51019, name: 'Guliashvili',            position: 'Attacker',   number: 9  },
    { id: 51020, name: 'Andrés Martín',          position: 'Attacker',   number: 11 },
    { id: 51021, name: 'Villalibre',             position: 'Attacker',   number: 19 },
    { id: 51022, name: 'Suleiman',               position: 'Attacker',   number: 20 },
    { id: 51023, name: 'Manex Lozano',           position: 'Attacker',   number: 24 }
  ],
  // RC Deportivo de La Coruña (2.º clasificado, ascenso directo)
  52: [
    { id: 52001, name: 'Germán Parreño',         position: 'Goalkeeper', number: 1  },
    { id: 52002, name: 'Adrià Altimira',         position: 'Defender',   number: 2  },
    { id: 52003, name: 'Arnau Comas',            position: 'Defender',   number: 3  },
    { id: 52004, name: 'Lucas Noubi',            position: 'Defender',   number: 4  },
    { id: 52005, name: 'Dani Barcia',            position: 'Defender',   number: 5  },
    { id: 52006, name: 'Charlie Patiño',         position: 'Midfielder', number: 6  },
    { id: 52007, name: 'Diego Villares',         position: 'Midfielder', number: 8  },
    { id: 52008, name: 'Mario Soriano',          position: 'Midfielder', number: 15 },
    { id: 52009, name: 'Luismi Cruz',            position: 'Midfielder', number: 16 },
    { id: 52010, name: 'Eric Puerto',            position: 'Goalkeeper', number: 13 },
    { id: 52011, name: 'Stoichkov',              position: 'Attacker',   number: 12 },
    { id: 52012, name: 'Samuele Mulattieri',     position: 'Attacker',   number: 7  },
    { id: 52013, name: 'Zakaria Eddahchouri',    position: 'Attacker',   number: 9  },
    { id: 52014, name: 'Yeremay Hernández',      position: 'Attacker',   number: 10 },
    { id: 52015, name: 'David Mella',            position: 'Attacker',   number: 11 }
  ],
  // Málaga CF (Playoff de ascenso, 3.ª plaza)
  53: [
    { id: 53001, name: 'Alfonso Herrero',        position: 'Goalkeeper', number: 1  },
    { id: 53002, name: 'Carlos López',           position: 'Goalkeeper', number: 13 },
    { id: 53003, name: 'Jokin Gabilondo',        position: 'Defender',   number: 2  },
    { id: 53004, name: 'Carlos Puga',            position: 'Defender',   number: 3  },
    { id: 53005, name: 'Einar Galilea',          position: 'Defender',   number: 4  },
    { id: 53006, name: 'Víctor García',          position: 'Defender',   number: 14 },
    { id: 53007, name: 'Diego Murillo',          position: 'Defender',   number: 16 },
    { id: 53008, name: 'Javi Montero',           position: 'Defender',   number: 20 },
    { id: 53009, name: 'Darko Brašanac',         position: 'Midfielder', number: 5  },
    { id: 53010, name: 'Ramón Enríquez',         position: 'Midfielder', number: 6  },
    { id: 53011, name: 'Juanpe Jiménez',         position: 'Midfielder', number: 8  },
    { id: 53012, name: 'Carlos Dotor',           position: 'Midfielder', number: 12 },
    { id: 53013, name: 'Moussa Diarra',          position: 'Midfielder', number: 15 },
    { id: 53014, name: 'Eneko Jauregi',          position: 'Midfielder', number: 17 },
    { id: 53015, name: 'Dani Sánchez',           position: 'Midfielder', number: 18 },
    { id: 53016, name: 'Adrián Niño',            position: 'Midfielder', number: 21 },
    { id: 53017, name: 'Dani Lorenzo',           position: 'Midfielder', number: 22 },
    { id: 53018, name: 'Aarón Ochoa',            position: 'Midfielder', number: 35 },
    { id: 53019, name: 'Haitam Abaida',          position: 'Attacker',   number: 7  },
    { id: 53020, name: 'Chupe',                  position: 'Attacker',   number: 9  },
    { id: 53021, name: 'David Larrubia',         position: 'Attacker',   number: 10 },
    { id: 53022, name: 'Joaquín Muñoz',          position: 'Attacker',   number: 11 },
    { id: 53023, name: 'Luismi Sánchez',         position: 'Attacker',   number: 19 },
    { id: 53024, name: 'Julen Lobete',           position: 'Attacker',   number: 24 }
  ],
  // ─── Otras ligas ────────────────────────────────────────────────────────
  101: [
    { id: 101001, name: 'Ederson',               position: 'Goalkeeper', number: 31 },
    { id: 101002, name: 'Ruben Dias',            position: 'Defender',   number: 3  },
    { id: 101003, name: 'Kevin De Bruyne',       position: 'Midfielder', number: 17 },
    { id: 101004, name: 'Erling Haaland',        position: 'Attacker',   number: 9  },
    { id: 101005, name: 'Rodri',                 position: 'Midfielder', number: 16 },
    { id: 101006, name: 'Phil Foden',            position: 'Attacker',   number: 47 },
    { id: 101007, name: 'Bernardo Silva',        position: 'Midfielder', number: 20 }
  ],
  102: [
    { id: 102001, name: 'David Raya',            position: 'Goalkeeper', number: 22 },
    { id: 102002, name: 'Bukayo Saka',           position: 'Attacker',   number: 7  },
    { id: 102003, name: 'Martin Odegaard',       position: 'Midfielder', number: 8  },
    { id: 102004, name: 'Declan Rice',           position: 'Midfielder', number: 41 },
    { id: 102005, name: 'William Saliba',        position: 'Defender',   number: 12 },
    { id: 102006, name: 'Gabriel Martinelli',    position: 'Attacker',   number: 11 }
  ],
  103: [
    { id: 103001, name: 'Alisson Becker',        position: 'Goalkeeper', number: 1  },
    { id: 103002, name: 'Trent Alexander-Arnold',position: 'Defender',   number: 66 },
    { id: 103003, name: 'Virgil van Dijk',       position: 'Defender',   number: 4  },
    { id: 103004, name: 'Mohamed Salah',         position: 'Attacker',   number: 11 },
    { id: 103005, name: 'Darwin Nunez',          position: 'Attacker',   number: 9  },
    { id: 103006, name: 'Luis Diaz',             position: 'Attacker',   number: 23 }
  ],
  201: [
    { id: 201001, name: 'Wojciech Szczesny',     position: 'Goalkeeper', number: 1  },
    { id: 201002, name: 'Gleison Bremer',        position: 'Defender',   number: 3  },
    { id: 201003, name: 'Federico Chiesa',       position: 'Attacker',   number: 7  },
    { id: 201004, name: 'Dusan Vlahovic',        position: 'Attacker',   number: 9  },
    { id: 201005, name: 'Adrien Rabiot',         position: 'Midfielder', number: 25 }
  ],
  202: [
    { id: 202001, name: 'Samir Handanovic',      position: 'Goalkeeper', number: 1  },
    { id: 202002, name: 'Nicolo Barella',        position: 'Midfielder', number: 23 },
    { id: 202003, name: 'Lautaro Martinez',      position: 'Attacker',   number: 10 },
    { id: 202004, name: 'Romelu Lukaku',         position: 'Attacker',   number: 90 },
    { id: 202005, name: 'Alessandro Bastoni',    position: 'Defender',   number: 95 }
  ],
  301: [
    { id: 301001, name: 'Manuel Neuer',          position: 'Goalkeeper', number: 1  },
    { id: 301002, name: 'Joshua Kimmich',        position: 'Midfielder', number: 6  },
    { id: 301003, name: 'Harry Kane',            position: 'Attacker',   number: 9  },
    { id: 301004, name: 'Jamal Musiala',         position: 'Midfielder', number: 42 },
    { id: 301005, name: 'Leroy Sane',            position: 'Attacker',   number: 10 }
  ],
  401: [
    { id: 401001, name: 'Gianluigi Donnarumma',  position: 'Goalkeeper', number: 99 },
    { id: 401002, name: 'Achraf Hakimi',         position: 'Defender',   number: 2  },
    { id: 401003, name: 'Kylian Mbappe',         position: 'Attacker',   number: 7  },
    { id: 401004, name: 'Vitinha',               position: 'Midfielder', number: 17 },
    { id: 401005, name: 'Marquinhos',            position: 'Defender',   number: 5  }
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
  await new Promise(function(r){ setTimeout(r, 300); });
  var q = teamName.toLowerCase();
  return MOCK_TEAMS.filter(function(t){ return t.name.toLowerCase().indexOf(q) !== -1; })
                   .map(function(t){ return { team: t }; });
}

async function getSquadAPI(apiTeamId) {
  await new Promise(function(r){ setTimeout(r, 150); });
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
  var seen = {}, leagues = [];
  MOCK_TEAMS.forEach(function(t){
    if (!seen[t.league]) { seen[t.league] = true; leagues.push(t.league); }
  });
  return leagues;
}

function getTeamsByLeague(league) {
  return MOCK_TEAMS.filter(function(t){ return t.league === league; });
}
