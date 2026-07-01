import { getFormationNames } from './formations.js';
import { renderPitch, exportLineup, clearFormation } from './pitch.js';
import { renderJerseyDesigner } from './jersey.js';
import { searchTeamAPI, getSquadAPI, saveTeamWithPlayers, addManualPlayer, listTeams, getTeamPlayers } from './players.js';

const formationSelect = document.getElementById('formation-select');
const pitchContainer = document.getElementById('pitch-container');
const jerseyContainer = document.getElementById('jersey-container');
const playerListEl = document.getElementById('player-list');
const teamSearchInput = document.getElementById('team-search');
const teamSearchBtn = document.getElementById('team-search-btn');
const manualPlayerForm = document.getElementById('manual-player-form');
const saveLineupBtn = document.getElementById('save-lineup-btn');

let currentTeamId = null;
let currentPlayers = [];
let jerseyConfig = null;

// --- Formaciones ---
getFormationNames().forEach(name => {
  const opt = document.createElement('option');
  opt.value = name;
  opt.textContent = name;
  formationSelect.appendChild(opt);
});

function draw() {
  renderPitch(pitchContainer, formationSelect.value, slot => {
    console.log('Slot clickeado:', slot);
  });
}

formationSelect.addEventListener('change', draw);
draw();

// --- Camiseta ---
jerseyConfig = renderJerseyDesigner(jerseyContainer, {}, cfg => { jerseyConfig = cfg; });

// --- Búsqueda de equipo (API-Football con fallback manual) ---
teamSearchBtn.addEventListener('click', async () => {
  const query = teamSearchInput.value.trim();
  if (!query) return;

  const teams = await searchTeamAPI(query);
  if (teams.length === 0) {
    alert('Sin resultados en API-Football. Añade jugadores manualmente abajo.');
    return;
  }

  const team = teams[0].team;
  const squad = await getSquadAPI(team.id);
  const savedTeam = await saveTeamWithPlayers(team, squad, 'api');
  currentTeamId = savedTeam.id;
  currentPlayers = await getTeamPlayers(currentTeamId);
  renderPlayerList();
});

function renderPlayerList() {
  playerListEl.innerHTML = '';
  currentPlayers.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.number ?? '-'} ${p.name} (${p.position ?? '?'})`;
    li.draggable = true;
    li.addEventListener('dragstart', e => {
      e.dataTransfer.setData('playerId', p.id);
      e.dataTransfer.setData('playerName', p.name);
    });
    playerListEl.appendChild(li);
  });
}

// --- Carga manual de jugador ---
manualPlayerForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentTeamId) {
    alert('Primero busca o crea un equipo.');
    return;
  }
  const formData = new FormData(manualPlayerForm);
  const player = await addManualPlayer(currentTeamId, {
    name: formData.get('name'),
    position: formData.get('position'),
    number: Number(formData.get('number')) || null
  });
  currentPlayers.push(player);
  renderPlayerList();
  manualPlayerForm.reset();
});

// --- Guardar alineación ---
saveLineupBtn.addEventListener('click', () => {
  const lineup = exportLineup();
  lineup.jersey = jerseyConfig;
  console.log('Alineación exportada:', lineup);
  alert('Alineación exportada a consola (siguiente paso: guardar en Supabase tabla `lineups`).');
});
