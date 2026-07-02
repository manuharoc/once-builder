// players.js - sin import/export, localStorage mock

const MOCK_TEAMS = [
  { id: 1, name: 'Real Madrid',      code: 'RMA', country: 'Spain',   logo: '' },
  { id: 2, name: 'Barcelona',        code: 'FCB', country: 'Spain',   logo: '' },
  { id: 3, name: 'Manchester City',  code: 'MCI', country: 'England', logo: '' },
  { id: 4, name: 'Bayern Munich',    code: 'BAY', country: 'Germany', logo: '' }
];

const MOCK_SQUADS = {
  1: [
    { id: 101, name: 'Thibaut Courtois',   position: 'Goalkeeper', number: 1  },
    { id: 102, name: 'Dani Carvajal',      position: 'Defender',   number: 2  },
    { id: 103, name: 'Eder Militao',       position: 'Defender',   number: 3  },
    { id: 104, name: 'David Alaba',        position: 'Defender',   number: 4  },
    { id: 105, name: 'Jude Bellingham',    position: 'Midfielder', number: 5  },
    { id: 106, name: 'Vinicius Junior',    position: 'Attacker',   number: 7  },
    { id: 107, name: 'Rodrygo',            position: 'Attacker',   number: 11 },
    { id: 108, name: 'Luka Modric',        position: 'Midfielder', number: 10 },
    { id: 109, name: 'Toni Kroos',         position: 'Midfielder', number: 8  },
    { id: 110, name: 'Federico Valverde',  position: 'Midfielder', number: 15 },
    { id: 111, name: 'Aurelien Tchouameni', position: 'Midfielder', number: 18 }
  ],
  2: [
    { id: 201, name: 'Marc-Andre ter Stegen', position: 'Goalkeeper', number: 1  },
    { id: 202, name: 'Ronald Araujo',          position: 'Defender',   number: 4  },
    { id: 203, name: 'Pedri',                  position: 'Midfielder', number: 8  },
    { id: 204, name: 'Robert Lewandowski',     position: 'Attacker',   number: 9  },
    { id: 205, name: 'Lamine Yamal',           position: 'Attacker',   number: 27 },
    { id: 206, name: 'Frenkie de Jong',        position: 'Midfielder', number: 21 },
    { id: 207, name: 'Jules Kounde',           position: 'Defender',   number: 23 },
    { id: 208, name: 'Ilkay Gundogan',         position: 'Midfielder', number: 22 }
  ],
  3: [
    { id: 301, name: 'Ederson',         position: 'Goalkeeper', number: 31 },
    { id: 302, name: 'Ruben Dias',      position: 'Defender',   number: 3  },
    { id: 303, name: 'Kevin De Bruyne', position: 'Midfielder', number: 17 },
    { id: 304, name: 'Erling Haaland',  position: 'Attacker',   number: 9  },
    { id: 305, name: 'Rodri',           position: 'Midfielder', number: 16 },
    { id: 306, name: 'Bernardo Silva',  position: 'Midfielder', number: 20 },
    { id: 307, name: 'Phil Foden',      position: 'Attacker',   number: 47 },
    { id: 308, name: 'Kyle Walker',     position: 'Defender',   number: 2  }
  ],
  4: [
    { id: 401, name: 'Manuel Neuer',    position: 'Goalkeeper', number: 1  },
    { id: 402, name: 'Joshua Kimmich',  position: 'Midfielder', number: 6  },
    { id: 403, name: 'Thomas Muller',   position: 'Attacker',   number: 25 },
    { id: 404, name: 'Leroy Sane',      position: 'Attacker',   number: 10 },
    { id: 405, name: 'Jamal Musiala',   position: 'Midfielder', number: 42 },
    { id: 406, name: 'Leon Goretzka',   position: 'Midfielder', number: 8  },
    { id: 407, name: 'Dayot Upamecano', position: 'Defender',   number: 2  }
  ]
};

function getLocalData(key, defaultVal) {
  try {
    var val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch(e) { return defaultVal; }
}

function setLocalData(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
}

async function searchTeamAPI(teamName) {
  await new Promise(function(r) { setTimeout(r, 500); });
  var query = teamName.toLowerCase();
  var results = MOCK_TEAMS.filter(function(t) { return t.name.toLowerCase().indexOf(query) !== -1; });
  return results.map(function(t) { return { team: t }; });
}

async function getSquadAPI(apiTeamId) {
  await new Promise(function(r) { setTimeout(r, 300); });
  return MOCK_SQUADS[apiTeamId] || [];
}

async function saveTeamWithPlayers(team, players, source) {
  var savedTeams   = getLocalData('ob_teams',   []);
  var savedPlayers = getLocalData('ob_players', []);

  var existingTeam = null;
  for (var i = 0; i < savedTeams.length; i++) {
    if (savedTeams[i].api_team_id === team.id) { existingTeam = savedTeams[i]; break; }
  }

  if (!existingTeam) {
    existingTeam = { id: Date.now().toString(), name: team.name, api_team_id: team.id };
    savedTeams.push(existingTeam);
    setLocalData('ob_teams', savedTeams);

    var newPlayers = players.map(function(p) {
      return {
        id: p.id ? String(p.id) : Math.random().toString(36).substr(2, 9),
        team_id: existingTeam.id,
        name: p.name,
        position: p.position || null,
        number: p.number || null
      };
    });
    savedPlayers = savedPlayers.concat(newPlayers);
    setLocalData('ob_players', savedPlayers);
  }
  return existingTeam;
}

async function addManualPlayer(teamId, player) {
  var savedPlayers = getLocalData('ob_players', []);
  var newPlayer = Object.assign({ id: 'manual_' + Date.now(), team_id: teamId }, player);
  savedPlayers.push(newPlayer);
  setLocalData('ob_players', savedPlayers);
  return newPlayer;
}

async function getTeamPlayers(teamId) {
  var savedPlayers = getLocalData('ob_players', []);
  return savedPlayers
    .filter(function(p) { return p.team_id === teamId; })
    .sort(function(a, b) { return (a.number || 99) - (b.number || 99); });
}
