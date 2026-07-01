// Mock de datos locales
const MOCK_TEAMS = [
  { id: 1, name: 'Real Madrid', code: 'RMA', country: 'Spain', logo: '' },
  { id: 2, name: 'Barcelona', code: 'FCB', country: 'Spain', logo: '' },
  { id: 3, name: 'Manchester City', code: 'MCI', country: 'England', logo: '' },
  { id: 4, name: 'Bayern Munich', code: 'BAY', country: 'Germany', logo: '' }
];

const MOCK_SQUADS = {
  1: [
    { id: 101, name: 'Thibaut Courtois', position: 'Goalkeeper', number: 1 },
    { id: 102, name: 'Dani Carvajal', position: 'Defender', number: 2 },
    { id: 103, name: 'Eder Militao', position: 'Defender', number: 3 },
    { id: 104, name: 'David Alaba', position: 'Defender', number: 4 },
    { id: 105, name: 'Jude Bellingham', position: 'Midfielder', number: 5 },
    { id: 106, name: 'Vinicius Junior', position: 'Attacker', number: 7 },
    { id: 107, name: 'Rodrygo', position: 'Attacker', number: 11 },
    { id: 108, name: 'Luka Modric', position: 'Midfielder', number: 10 },
    { id: 109, name: 'Toni Kroos', position: 'Midfielder', number: 8 },
    { id: 110, name: 'Federico Valverde', position: 'Midfielder', number: 15 },
    { id: 111, name: 'Aurelien Tchouameni', position: 'Midfielder', number: 18 }
  ],
  2: [
    { id: 201, name: 'Marc-Andre ter Stegen', position: 'Goalkeeper', number: 1 },
    { id: 202, name: 'Ronald Araujo', position: 'Defender', number: 4 },
    { id: 203, name: 'Pedri', position: 'Midfielder', number: 8 },
    { id: 204, name: 'Robert Lewandowski', position: 'Attacker', number: 9 },
    { id: 205, name: 'Lamine Yamal', position: 'Attacker', number: 27 },
    { id: 206, name: 'Frenkie de Jong', position: 'Midfielder', number: 21 },
    { id: 207, name: 'Jules Kounde', position: 'Defender', number: 23 },
    { id: 208, name: 'Ilkay Gundogan', position: 'Midfielder', number: 22 }
  ],
  3: [
    { id: 301, name: 'Ederson', position: 'Goalkeeper', number: 31 },
    { id: 302, name: 'Ruben Dias', position: 'Defender', number: 3 },
    { id: 303, name: 'Kevin De Bruyne', position: 'Midfielder', number: 17 },
    { id: 304, name: 'Erling Haaland', position: 'Attacker', number: 9 },
    { id: 305, name: 'Rodri', position: 'Midfielder', number: 16 },
    { id: 306, name: 'Bernardo Silva', position: 'Midfielder', number: 20 },
    { id: 307, name: 'Phil Foden', position: 'Attacker', number: 47 },
    { id: 308, name: 'Kyle Walker', position: 'Defender', number: 2 }
  ]
};

function getLocalData(key, defaultVal) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setLocalData(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export async function searchTeamAPI(teamName) {
  // Simular delay de red para que los loaders se vean
  await new Promise(r => setTimeout(r, 600));
  const query = teamName.toLowerCase();
  const results = MOCK_TEAMS.filter(t => t.name.toLowerCase().includes(query));
  return results.map(t => ({ team: t }));
}

export async function getSquadAPI(apiTeamId) {
  await new Promise(r => setTimeout(r, 400));
  return MOCK_SQUADS[apiTeamId] || [];
}

export async function saveTeamWithPlayers(team, players, source = 'api') {
  const savedTeams = getLocalData('ob_teams', []);
  const savedPlayers = getLocalData('ob_players', []);
  
  let existingTeam = savedTeams.find(t => t.api_team_id === team.id);
  if (!existingTeam) {
    existingTeam = { id: Date.now().toString(), name: team.name, api_team_id: team.id };
    savedTeams.push(existingTeam);
    setLocalData('ob_teams', savedTeams);
    
    const newPlayers = players.map(p => ({
      id: p.id || Math.random().toString(36).substr(2, 9),
      team_id: existingTeam.id,
      name: p.name,
      position: p.position,
      number: p.number
    }));
    savedPlayers.push(...newPlayers);
    setLocalData('ob_players', savedPlayers);
  }
  return existingTeam;
}

export async function addManualPlayer(teamId, player) {
  const savedPlayers = getLocalData('ob_players', []);
  const newPlayer = {
    id: 'manual_' + Date.now().toString(),
    team_id: teamId,
    ...player
  };
  savedPlayers.push(newPlayer);
  setLocalData('ob_players', savedPlayers);
  return newPlayer;
}

export async function getTeamPlayers(teamId) {
  const savedPlayers = getLocalData('ob_players', []);
  return savedPlayers.filter(p => p.team_id === teamId).sort((a, b) => (a.number || 99) - (b.number || 99));
}

export async function listTeams() {
  return getLocalData('ob_teams', []);
}
