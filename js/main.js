import { getFormationNames } from './formations.js';
import { renderPitch, exportLineup, clearFormation, updateJerseyConfig } from './pitch.js';
import { renderJerseyDesigner } from './jersey.js';
import { searchTeamAPI, getSquadAPI, saveTeamWithPlayers, addManualPlayer, getTeamPlayers } from './players.js';

const mainLayout = document.getElementById('main-layout');
const welcomeScreen = document.getElementById('welcome-screen');
const wizardModal = document.getElementById('wizard-modal');

// DOM Elements
const pitchContainer = document.getElementById('pitch-container');
const jerseyContainer = document.getElementById('jersey-container');
const playerListEl = document.getElementById('player-list');
const manualPlayerForm = document.getElementById('manual-player-form');
const saveLineupBtn = document.getElementById('save-lineup-btn');

// Wizard Elements
const btnStartWizard = document.getElementById('start-wizard-btn');
const wizStep1 = document.getElementById('wizard-step-1');
const wizStep2 = document.getElementById('wizard-step-2');
const wizStep3 = document.getElementById('wizard-step-3');
const wizSearchInput = document.getElementById('wizard-team-search');
const wizSearchBtn = document.getElementById('wizard-team-search-btn');
const wizLoader = document.getElementById('wizard-loader');
const wizResult = document.getElementById('wizard-team-result');
const wizNext1 = document.getElementById('wizard-next-1');
const wizPrev2 = document.getElementById('wizard-prev-2');
const wizNext2 = document.getElementById('wizard-next-2');
const wizPrev3 = document.getElementById('wizard-prev-3');
const wizFinish = document.getElementById('wizard-finish');
const wizFormationSelect = document.getElementById('wizard-formation-select');
const mainFormationSelect = document.getElementById('main-formation-select');

let currentTeamId = null;
let currentPlayers = [];
let jerseyConfig = null;

function showToast(message, isError = false) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${isError ? 'error' : ''}`;
  toast.innerHTML = isError ? `<i class="fa-solid fa-circle-exclamation"></i> ${message}` : `<i class="fa-solid fa-circle-check"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Inicializar Formaciones
getFormationNames().forEach(name => {
  const opt1 = document.createElement('option'); opt1.value = name; opt1.textContent = name;
  const opt2 = document.createElement('option'); opt2.value = name; opt2.textContent = name;
  wizFormationSelect.appendChild(opt1);
  mainFormationSelect.appendChild(opt2);
});

// Jersey Designer (Step 2)
jerseyConfig = renderJerseyDesigner(jerseyContainer, {}, cfg => { jerseyConfig = cfg; updateJerseyConfig(cfg); });

// --- WIZARD FLOW ---
btnStartWizard.addEventListener('click', () => {
  welcomeScreen.classList.add('hidden');
  wizardModal.classList.remove('hidden');
  wizStep1.classList.remove('hidden');
});

wizSearchBtn.addEventListener('click', async () => {
  const query = wizSearchInput.value.trim();
  if (!query) return showToast('Introduce un nombre.', true);
  
  wizLoader.classList.remove('hidden');
  wizResult.classList.add('hidden');
  wizNext1.disabled = true;

  const teams = await searchTeamAPI(query);
  wizLoader.classList.add('hidden');

  if (teams.length === 0) {
    showToast('Sin resultados. Escribe Real Madrid o Barcelona.', true);
    return;
  }

  const team = teams[0].team;
  const squad = await getSquadAPI(team.id);
  const savedTeam = await saveTeamWithPlayers(team, squad, 'api');
  
  currentTeamId = savedTeam.id;
  currentPlayers = await getTeamPlayers(currentTeamId);
  
  wizResult.textContent = `✅ Equipo seleccionado: ${team.name} (${squad.length} jugadores)`;
  wizResult.classList.remove('hidden');
  wizNext1.disabled = false;
});

// Navegación Wizard
wizNext1.addEventListener('click', () => { wizStep1.classList.add('hidden'); wizStep2.classList.remove('hidden'); });
wizPrev2.addEventListener('click', () => { wizStep2.classList.add('hidden'); wizStep1.classList.remove('hidden'); });
wizNext2.addEventListener('click', () => { wizStep2.classList.add('hidden'); wizStep3.classList.remove('hidden'); });
wizPrev3.addEventListener('click', () => { wizStep3.classList.add('hidden'); wizStep2.classList.remove('hidden'); });

wizFinish.addEventListener('click', () => {
  wizardModal.classList.add('hidden');
  mainLayout.classList.remove('hidden');
  
  // Sincronizar selectores
  mainFormationSelect.value = wizFormationSelect.value;
  
  // Render inicial
  renderPlayerList();
  renderPitch(pitchContainer, mainFormationSelect.value, () => {});
  showToast('¡A construir tu once!');
});

// Cambios de formación en Main Layout
mainFormationSelect.addEventListener('change', e => {
  renderPitch(pitchContainer, e.target.value, () => {});
});

function renderPlayerList() {
  playerListEl.innerHTML = '';
  currentPlayers.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="player-number-badge">${p.number || '-'}</span><span class="player-name">${p.name}</span><span class="player-pos-badge">${p.position ? p.position.substring(0,3) : '?'}</span>`;
    li.draggable = true;
    li.addEventListener('dragstart', e => {
      e.dataTransfer.setData('playerId', p.id);
      e.dataTransfer.setData('playerName', p.name);
      e.dataTransfer.setData('playerNumber', p.number || '');
    });
    playerListEl.appendChild(li);
  });
}

// Carga manual
manualPlayerForm.addEventListener('submit', async e => {
  e.preventDefault();
  if (!currentTeamId) return showToast('Error: No hay equipo.', true);
  const formData = new FormData(manualPlayerForm);
  const player = await addManualPlayer(currentTeamId, {
    name: formData.get('name'), position: formData.get('position'), number: Number(formData.get('number')) || null
  });
  currentPlayers.push(player);
  renderPlayerList();
  manualPlayerForm.reset();
  showToast('Jugador añadido.');
});

saveLineupBtn.addEventListener('click', () => {
  const lineup = exportLineup();
  lineup.jersey = jerseyConfig;
  console.log('Alineación exportada:', lineup);
  showToast('Alineación guardada (Consola)');
});
