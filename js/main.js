// main.js - sin import/export

var mainLayout        = document.getElementById('main-layout');
var welcomeScreen     = document.getElementById('welcome-screen');
var wizardModal       = document.getElementById('wizard-modal');
var pitchContainer    = document.getElementById('pitch-container');
var jerseyContainer   = document.getElementById('jersey-container');
var playerListEl      = document.getElementById('player-list');
var manualPlayerForm  = document.getElementById('manual-player-form');
var saveLineupBtn     = document.getElementById('save-lineup-btn');

var btnStartWizard        = document.getElementById('start-wizard-btn');
var wizStep1              = document.getElementById('wizard-step-1');
var wizStep2              = document.getElementById('wizard-step-2');
var wizStep3              = document.getElementById('wizard-step-3');
var wizSearchInput        = document.getElementById('wizard-team-search');
var wizSearchBtn          = document.getElementById('wizard-team-search-btn');
var wizLoader             = document.getElementById('wizard-loader');
var wizResult             = document.getElementById('wizard-team-result');
var wizNext1              = document.getElementById('wizard-next-1');
var wizPrev2              = document.getElementById('wizard-prev-2');
var wizNext2              = document.getElementById('wizard-next-2');
var wizPrev3              = document.getElementById('wizard-prev-3');
var wizFinish             = document.getElementById('wizard-finish');
var wizFormationSelect    = document.getElementById('wizard-formation-select');
var mainFormationSelect   = document.getElementById('main-formation-select');

var currentTeamId  = null;
var currentPlayers = [];
var jerseyConfig   = null;

function showToast(message, isError) {
  var container = document.getElementById('toast-container');
  var toast = document.createElement('div');
  toast.className = 'toast' + (isError ? ' error' : '');
  toast.innerHTML = isError
    ? '<i class="fa-solid fa-circle-exclamation"></i> ' + message
    : '<i class="fa-solid fa-circle-check"></i> '       + message;
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// Poblar selectores de formación
getFormationNames().forEach(function(name) {
  var opt1 = document.createElement('option'); opt1.value = name; opt1.textContent = name;
  var opt2 = document.createElement('option'); opt2.value = name; opt2.textContent = name;
  wizFormationSelect.appendChild(opt1);
  mainFormationSelect.appendChild(opt2);
});

// Jersey Designer (Paso 2 del Wizard)
jerseyConfig = renderJerseyDesigner(jerseyContainer, {}, function(cfg) {
  jerseyConfig = cfg;
  updateJerseyConfig(cfg);
});

// --- WIZARD ---
btnStartWizard.addEventListener('click', function() {
  welcomeScreen.classList.add('hidden');
  wizardModal.classList.remove('hidden');
});

wizSearchBtn.addEventListener('click', async function() {
  var query = wizSearchInput.value.trim();
  if (!query) return showToast('Introduce un nombre de equipo.', true);

  wizLoader.classList.remove('hidden');
  wizResult.classList.add('hidden');
  wizNext1.disabled = true;

  var teams = await searchTeamAPI(query);
  wizLoader.classList.add('hidden');

  if (teams.length === 0) {
    showToast('Sin resultados. Prueba: Real Madrid, Barcelona, City, Bayern.', true);
    return;
  }

  var team  = teams[0].team;
  var squad = await getSquadAPI(team.id);
  var saved = await saveTeamWithPlayers(team, squad, 'api');

  currentTeamId  = saved.id;
  currentPlayers = await getTeamPlayers(currentTeamId);

  wizResult.textContent = '✅ ' + team.name + ' (' + squad.length + ' jugadores)';
  wizResult.classList.remove('hidden');
  wizNext1.disabled = false;
});

// Navegación por pasos
wizNext1.addEventListener('click', function() { wizStep1.classList.add('hidden'); wizStep2.classList.remove('hidden'); });
wizPrev2.addEventListener('click', function() { wizStep2.classList.add('hidden'); wizStep1.classList.remove('hidden'); });
wizNext2.addEventListener('click', function() { wizStep2.classList.add('hidden'); wizStep3.classList.remove('hidden'); });
wizPrev3.addEventListener('click', function() { wizStep3.classList.add('hidden'); wizStep2.classList.remove('hidden'); });

wizFinish.addEventListener('click', function() {
  wizardModal.classList.add('hidden');
  mainLayout.classList.remove('hidden');
  mainFormationSelect.value = wizFormationSelect.value;
  renderPlayerList();
  renderPitch(pitchContainer, mainFormationSelect.value, null);
  showToast('¡A construir tu once!');
});

// Cambio de formación desde el main
mainFormationSelect.addEventListener('change', function(e) {
  renderPitch(pitchContainer, e.target.value, null);
});

function renderPlayerList() {
  playerListEl.innerHTML = '';
  currentPlayers.forEach(function(p) {
    var li = document.createElement('li');
    var pos = p.position ? p.position.substring(0, 3) : '?';
    li.innerHTML =
      '<span class="player-number-badge">' + (p.number || '-') + '</span>' +
      '<span class="player-name">'  + p.name + '</span>' +
      '<span class="player-pos-badge">' + pos + '</span>';
    li.draggable = true;
    li.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('playerId',     p.id);
      e.dataTransfer.setData('playerName',   p.name);
      e.dataTransfer.setData('playerNumber', p.number || '');
    });
    playerListEl.appendChild(li);
  });
}

// Añadir jugador manual
manualPlayerForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentTeamId) return showToast('No hay equipo seleccionado.', true);
  var formData = new FormData(manualPlayerForm);
  var player = await addManualPlayer(currentTeamId, {
    name:     formData.get('name'),
    position: formData.get('position'),
    number:   Number(formData.get('number')) || null
  });
  currentPlayers.push(player);
  renderPlayerList();
  manualPlayerForm.reset();
  showToast('Jugador añadido.');
});

// Guardar alineación
saveLineupBtn.addEventListener('click', function() {
  var lineup = exportLineup();
  lineup.jersey = jerseyConfig;
  console.log('Alineación exportada:', lineup);
  showToast('Alineación guardada (ver Consola)');
});
