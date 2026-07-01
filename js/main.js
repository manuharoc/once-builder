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
const loader = document.getElementById('loader');

let currentTeamId = null;
let currentPlayers = [];
let jerseyConfig = null;

// --- Notificaciones Toast ---
function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = isError 
    ? `<i class="fa-solid fa-circle-exclamation"></i> ${message}` 
    : `<i class="fa-solid fa-circle-check"></i> ${message}`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// --- Formaciones ---
getFormationNames().forEach(name => {
  const opt = document.createElement('option');
  opt.value = name;
  opt.textContent = name;
  formationSelect.appendChild(opt);
});

function draw() {
  renderPitch(pitchContainer, formationSelect.value, slot => {
    // Se puede expandir aquí, pero borrar jugador ahora se hace con dblclick
  });
}

formationSelect.addEventListener('change', draw);
draw();

// --- Camiseta ---
jerseyConfig = renderJerseyDesigner(jerseyContainer, {}, cfg => { jerseyConfig = cfg; });

// --- Búsqueda de equipo (API Mock) ---
teamSearchBtn.addEventListener('click', async () => {
  const query = teamSearchInput.value.trim();
  if (!query) {
    showToast('Introduce un nombre de equipo para buscar.', true);
    return;
  }

  loader.classList.remove('hidden');
  const teams = await searchTeamAPI(query);
  if (teams.length === 0) {
    loader.classList.add('hidden');
    showToast('Sin resultados. Añade jugadores manualmente abajo.', true);
    return;
  }

  const team = teams[0].team;
  const squad = await getSquadAPI(team.id);
  const savedTeam = await saveTeamWithPlayers(team, squad, 'api');
  currentTeamId = savedTeam.id;
  currentPlayers = await getTeamPlayers(currentTeamId);
  renderPlayerList();
  loader.classList.add('hidden');
  showToast(`Equipo cargado: ${team.name}`);
});

function renderPlayerList() {
  playerListEl.innerHTML = '';
  currentPlayers.forEach(p => {
    const li = document.createElement('li');
    
    // Estructura HTML para la lista
    li.innerHTML = `
      <span class="player-number-badge">${p.number || '-'}</span>
      <span class="player-name">${p.name}</span>
      <span class="player-pos-badge">${p.position ? p.position.substring(0,3) : '?'}</span>
    `;
    
    li.draggable = true;
    li.addEventListener('dragstart', e => {
      e.dataTransfer.setData('playerId', p.id);
      e.dataTransfer.setData('playerName', p.name);
      e.dataTransfer.setData('playerNumber', p.number || '');
    });
    playerListEl.appendChild(li);
  });
}

// --- Carga manual de jugador ---
manualPlayerForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentTeamId) {
    showToast('Primero busca un equipo o guárdalo.', true);
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
  showToast('Jugador añadido.');
});

// --- Guardar alineación ---
saveLineupBtn.addEventListener('click', () => {
  const lineup = exportLineup();
  lineup.jersey = jerseyConfig;
  console.log('Alineación exportada:', lineup);
  showToast('Alineación guardada (Revisa la consola)');
});

// Mensaje inicial
setTimeout(() => {
  showToast('Prueba a buscar "Real Madrid", "Barcelona", "City" o "Bayern"');
}, 1000);
