// main.js

var mainLayout        = document.getElementById('main-layout');
var welcomeScreen     = document.getElementById('welcome-screen');
var wizardModal       = document.getElementById('wizard-modal');
var pitchContainer    = document.getElementById('pitch-container');
var jerseyContainer   = document.getElementById('jersey-container');
var playerListEl      = document.getElementById('player-list');
var manualPlayerForm  = document.getElementById('manual-player-form');
var saveLineupBtn     = document.getElementById('save-lineup-btn');

var btnStartWizard      = document.getElementById('start-wizard-btn');
var wizStep1            = document.getElementById('wizard-step-1');
var wizStep2            = document.getElementById('wizard-step-2');
var wizStep3            = document.getElementById('wizard-step-3');
var wizSearchInput      = document.getElementById('wizard-team-search');
var wizSearchBtn        = document.getElementById('wizard-team-search-btn');
var wizLoader           = document.getElementById('wizard-loader');
var wizResult           = document.getElementById('wizard-team-result');
var wizNext1            = document.getElementById('wizard-next-1');
var wizPrev2            = document.getElementById('wizard-prev-2');
var wizNext2            = document.getElementById('wizard-next-2');
var wizPrev3            = document.getElementById('wizard-prev-3');
var wizFinish           = document.getElementById('wizard-finish');
var wizFormationSelect  = document.getElementById('wizard-formation-select');
var mainFormationSelect = document.getElementById('main-formation-select');
var teamResultsEl       = document.getElementById('team-results');
var leagueBtnsEl        = document.getElementById('league-buttons');

var currentTeamId  = null;
var currentPlayers = [];
var jerseyConfig   = null;

// ── Toast ───────────────────────────────────────────────────────────────
function showToast(message, isError) {
  var c = document.getElementById('toast-container');
  var t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.innerHTML = (isError ? '<i class="fa-solid fa-circle-exclamation"></i> ' : '<i class="fa-solid fa-circle-check"></i> ') + message;
  c.appendChild(t);
  setTimeout(function() {
    t.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(function(){ t.remove(); }, 300);
  }, 3000);
}

// ── Formaciones ─────────────────────────────────────────────────────────
getFormationNames().forEach(function(name) {
  var o1 = document.createElement('option'); o1.value = name; o1.textContent = name;
  var o2 = document.createElement('option'); o2.value = name; o2.textContent = name;
  wizFormationSelect.appendChild(o1);
  mainFormationSelect.appendChild(o2);
});

// ── Jersey Designer ─────────────────────────────────────────────────────
jerseyConfig = renderJerseyDesigner(jerseyContainer, {}, function(cfg) {
  jerseyConfig = cfg;
  updateJerseyConfig(cfg);
});

// ── Liga Buttons (Wizard paso 1) ─────────────────────────────────────────
var allLeagues = getAllLeagues();
allLeagues.forEach(function(league) {
  var btn = document.createElement('button');
  btn.className = 'league-btn secondary-btn';
  btn.textContent = league;
  btn.addEventListener('click', function() {
    document.querySelectorAll('.league-btn').forEach(function(b){ b.classList.remove('active'); });
    btn.classList.add('active');
    renderTeamGrid(getTeamsByLeague(league));
  });
  leagueBtnsEl.appendChild(btn);
});

function renderTeamGrid(teams) {
  teamResultsEl.innerHTML = '';
  teams.forEach(function(t) {
    var card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = '<span class="team-code">' + t.code + '</span><span class="team-name-small">' + t.name + '</span>';
    card.addEventListener('click', function() {
      document.querySelectorAll('.team-card').forEach(function(c){ c.classList.remove('selected'); });
      card.classList.add('selected');
      selectTeam(t);
    });
    teamResultsEl.appendChild(card);
  });
}

async function selectTeam(team) {
  wizLoader.classList.remove('hidden');
  wizResult.classList.add('hidden');
  wizNext1.disabled = true;

  var squad = await getSquadAPI(team.id);
  var saved = await saveTeamWithPlayers(team, squad, 'api');
  currentTeamId  = saved.id;
  currentPlayers = await getTeamPlayers(currentTeamId);

  wizLoader.classList.add('hidden');
  wizResult.textContent = '✅ ' + team.name + (squad.length ? ' (' + squad.length + ' jugadores)' : '');
  wizResult.classList.remove('hidden');
  wizNext1.disabled = false;
}

// ── Wizard: búsqueda por texto ───────────────────────────────────────────
wizSearchBtn.addEventListener('click', async function() {
  var query = wizSearchInput.value.trim();
  if (!query) return showToast('Introduce un nombre de equipo.', true);
  wizLoader.classList.remove('hidden');
  var teams = await searchTeamAPI(query);
  wizLoader.classList.add('hidden');
  if (!teams.length) return showToast('Sin resultados. Prueba LaLiga, Premier League…', true);
  renderTeamGrid(teams.map(function(r){ return r.team; }));
});

// ── Wizard: navegación de pasos ──────────────────────────────────────────
btnStartWizard.addEventListener('click', function() {
  welcomeScreen.classList.add('hidden');
  wizardModal.classList.remove('hidden');
});

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
  showToast('¡A construir tu once! Arrastra chapas para intercambiarlas.');
});

// ── Cambio de formación ─────────────────────────────────────────────────
mainFormationSelect.addEventListener('change', function(e) {
  renderPitch(pitchContainer, e.target.value, null);
});

// ── Render plantilla ─────────────────────────────────────────────────────
function renderPlayerList() {
  if (!currentTeamPlayers) return;
  var filterPos = document.querySelector('.pos-btn.active').dataset.pos;
  var list = document.getElementById('player-list');
  list.innerHTML = '';
  
  var filtered = currentTeamPlayers;
  if (filterPos !== 'ALL') {
    filtered = currentTeamPlayers.filter(function(p) { return p.position === filterPos; });
  }

  filtered.forEach(function(p) {
    var li = document.createElement('li');
    li.className = 'player-item';
    li.draggable = true;
    
    // Si ya está asignado al once, marcamos visualmente
    if (isPlayerAssigned(p.id)) {
      li.classList.add('in-pitch');
    }

    li.innerHTML = '<span class="player-num">' + (p.number || '-') + '</span>' +
                   '<span class="player-name">' + p.name + '</span>' +
                   '<span class="player-pos">' + (p.position ? p.position.substring(0,3).toUpperCase() : '') + '</span>';

    // Manejador Drag & Drop original
    li.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('playerId', p.id);
      e.dataTransfer.setData('playerName', p.name);
      e.dataTransfer.setData('playerNumber', p.number || '');
    });
    
    // Nuevo: Auto-asignación al hacer clic
    li.addEventListener('click', function() {
      var res = autoAssignPlayer(p);
      if (res === "already_assigned") {
        unassignPlayer(p.id);
      } else if (res === true) {
        // RenderPlayerList se re-llamará por el evento pitchChanged
      } else {
        showToast('No hay hueco libre para ' + (p.position || 'esta posición') + '. Usa arrastrar y soltar.', true);
      }
    });

    list.appendChild(li);
  });
}

// Escuchar cambios en el once para actualizar la vista de la lista (opacidad en-pitch)
document.addEventListener('pitchChanged', function() {
  if (currentTeamPlayers) {
    renderPlayerList();
  }
});

// ── Añadir jugador manual ────────────────────────────────────────────────
manualPlayerForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentTeamId) return showToast('No hay equipo seleccionado.', true);
  var fd = new FormData(manualPlayerForm);
  var player = await addManualPlayer(currentTeamId, {
    name: fd.get('name'), position: fd.get('position'), number: Number(fd.get('number')) || null
  });
  currentPlayers.push(player);
  renderPlayerList();
  manualPlayerForm.reset();
  showToast('Jugador añadido.');
});

// ── Guardar alineación ───────────────────────────────────────────────────
saveLineupBtn.addEventListener('click', function() {
  var lineup = exportLineup();
  lineup.jersey = jerseyConfig;
  console.log('Alineación exportada:', lineup);
  showToast('Alineación guardada (ver Consola)');
});
