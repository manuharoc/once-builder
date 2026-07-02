// main.js — Once Builder

// ── Referencias al DOM ───────────────────────────────────────────────────────
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

// ── Estado global ────────────────────────────────────────────────────────────
var currentTeamId      = null;
var currentPlayers     = [];   // ← UNA SOLA variable, usada en todas partes
var jerseyConfig       = null;

// ── Toast ────────────────────────────────────────────────────────────────────
function showToast(message, isError) {
  var c = document.getElementById('toast-container');
  var t = document.createElement('div');
  t.className = 'toast' + (isError ? ' error' : '');
  t.innerHTML = (isError
    ? '<i class="fa-solid fa-circle-exclamation"></i> '
    : '<i class="fa-solid fa-circle-check"></i> ') + message;
  c.appendChild(t);
  setTimeout(function() {
    t.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(function() { t.remove(); }, 300);
  }, 3000);
}

// ── Poblar selectores de formación ───────────────────────────────────────────
getFormationNames().forEach(function(name) {
  var o1 = document.createElement('option'); o1.value = name; o1.textContent = name;
  var o2 = document.createElement('option'); o2.value = name; o2.textContent = name;
  wizFormationSelect.appendChild(o1);
  mainFormationSelect.appendChild(o2);
});

// ── Jersey Designer ──────────────────────────────────────────────────────────
jerseyConfig = renderJerseyDesigner(jerseyContainer, {}, function(cfg) {
  jerseyConfig = cfg;
  updateJerseyConfig(cfg);
});

// ── Botones de liga (Wizard paso 1) ──────────────────────────────────────────
getAllLeagues().forEach(function(league) {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'league-btn secondary-btn';
  btn.textContent = league;
  btn.addEventListener('click', function() {
    document.querySelectorAll('.league-btn').forEach(function(b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderTeamGrid(getTeamsByLeague(league));
  });
  leagueBtnsEl.appendChild(btn);
});

// ── Grid de equipos ──────────────────────────────────────────────────────────
function renderTeamGrid(teams) {
  teamResultsEl.innerHTML = '';
  teams.forEach(function(t) {
    var card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML =
      '<span class="team-code">' + t.code + '</span>' +
      '<span class="team-name-small">' + t.name + '</span>';
    card.addEventListener('click', function() {
      document.querySelectorAll('.team-card').forEach(function(c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      selectTeam(t);
    });
    teamResultsEl.appendChild(card);
  });
}

// ── Seleccionar equipo ───────────────────────────────────────────────────────
async function selectTeam(team) {
  wizLoader.classList.remove('hidden');
  wizResult.classList.add('hidden');
  wizNext1.disabled = true;

  var squad  = await getSquadAPI(team.id);
  var saved  = await saveTeamWithPlayers(team, squad, 'api');
  currentTeamId  = saved.id;
  currentPlayers = await getTeamPlayers(currentTeamId);

  wizLoader.classList.add('hidden');
  wizResult.textContent = '✅ ' + team.name +
    (squad.length ? ' (' + squad.length + ' jugadores)' : '');
  wizResult.classList.remove('hidden');
  wizNext1.disabled = false;
}

// ── Búsqueda por texto ───────────────────────────────────────────────────────
wizSearchBtn.addEventListener('click', async function() {
  var query = wizSearchInput.value.trim();
  if (!query) return showToast('Introduce un nombre de equipo.', true);
  wizLoader.classList.remove('hidden');
  var teams = await searchTeamAPI(query);
  wizLoader.classList.add('hidden');
  if (!teams.length) return showToast('Sin resultados. Prueba con LaLiga, Premier…', true);
  renderTeamGrid(teams.map(function(r) { return r.team; }));
});

// ── Navegación del Wizard ────────────────────────────────────────────────────
btnStartWizard.addEventListener('click', function() {
  welcomeScreen.classList.add('hidden');
  wizardModal.classList.remove('hidden');
});
wizNext1.addEventListener('click',  function() { wizStep1.classList.add('hidden'); wizStep2.classList.remove('hidden'); });
wizPrev2.addEventListener('click',  function() { wizStep2.classList.add('hidden'); wizStep1.classList.remove('hidden'); });
wizNext2.addEventListener('click',  function() { wizStep2.classList.add('hidden'); wizStep3.classList.remove('hidden'); });
wizPrev3.addEventListener('click',  function() { wizStep3.classList.add('hidden'); wizStep2.classList.remove('hidden'); });

document.getElementById('reset-data-btn').addEventListener('click', function() {
  if (confirm('Esto borrará todas las alineaciones y plantillas guardadas y recargará los datos por defecto. ¿Estás seguro?')) {
    localStorage.clear();
    location.reload();
  }
});

// ── Finalizar Wizard → mostrar layout principal ──────────────────────────────
wizFinish.addEventListener('click', function() {
  wizardModal.classList.add('hidden');
  mainLayout.classList.remove('hidden');
  mainFormationSelect.value = wizFormationSelect.value;
  renderPlayerList();
  renderPitch(pitchContainer, mainFormationSelect.value, null);
  showToast('¡A construir tu once! Pulsa o arrastra un jugador para colocarlo.');
});

// ── Cambio de formación ──────────────────────────────────────────────────────
mainFormationSelect.addEventListener('change', function(e) {
  renderPitch(pitchContainer, e.target.value, null);
});

// ── Render lista de jugadores ────────────────────────────────────────────────
function renderPlayerList() {
  if (!currentPlayers || !currentPlayers.length) return;

  playerListEl.innerHTML = '';

  currentPlayers.forEach(function(p) {
    var li = document.createElement('li');
    li.draggable = true;

    // Marcar si ya está en el campo
    if (isPlayerAssigned(p.id)) {
      li.classList.add('in-pitch');
    }

    li.innerHTML =
      '<span class="player-number-badge">' + (p.number || '-') + '</span>' +
      '<span class="player-name">' + p.name + '</span>' +
      '<span class="player-pos-badge">' + (p.position ? p.position.substring(0, 3).toUpperCase() : '?') + '</span>' +
      '<button class="delete-player-btn" title="Borrar jugador"><i class="fa-solid fa-trash"></i></button>';

    // Arrastrar
    li.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('playerId',     p.id);
      e.dataTransfer.setData('playerName',   p.name);
      e.dataTransfer.setData('playerNumber', p.number || '');
    });

    // Clic en la papelera para borrar
    var delBtn = li.querySelector('.delete-player-btn');
    delBtn.addEventListener('click', async function(e) {
      e.stopPropagation();
      if (confirm('¿Seguro que quieres borrar a ' + p.name + '?')) {
        await deletePlayer(p.id);
        unassignPlayer(p.id);
        currentPlayers = currentPlayers.filter(function(cp) { return cp.id !== p.id; });
        renderPlayerList();
        showToast(p.name + ' eliminado de la plantilla.');
      }
    });

    // Clic → auto-asignar / quitar
    li.addEventListener('click', function() {
      var res = autoAssignPlayer(p);
      if (res === 'already_assigned') {
        unassignPlayer(p.id);
        showToast(p.name + ' quitado del once.');
      } else if (res === true) {
        showToast(p.name + ' añadido al once.');
      } else {
        showToast('No hay hueco libre para esa posición. Arrástralo manualmente.', true);
      }
    });

    playerListEl.appendChild(li);
  });
}

// Re-renderizar lista cuando el campo cambie (para actualizar el estado in-pitch)
document.addEventListener('pitchChanged', function() {
  if (currentPlayers && currentPlayers.length) {
    renderPlayerList();
  }
});

// ── Añadir jugador manual ────────────────────────────────────────────────────
manualPlayerForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  if (!currentTeamId) return showToast('No hay equipo seleccionado.', true);
  var fd = new FormData(manualPlayerForm);
  var player = await addManualPlayer(currentTeamId, {
    name:     fd.get('name'),
    position: fd.get('position'),
    number:   Number(fd.get('number')) || null
  });
  currentPlayers.push(player);
  renderPlayerList();
  manualPlayerForm.reset();
  showToast('Jugador añadido.');
});

// ── Guardar alineación ───────────────────────────────────────────────────────
saveLineupBtn.addEventListener('click', function() {
  var lineup = exportLineup();
  lineup.jersey = jerseyConfig;
  console.log('Alineación exportada:', lineup);
  showToast('Alineación guardada (ver Consola).');
});

// Botón Atrás en Builder
document.getElementById('main-back-btn').addEventListener('click', function() {
  document.getElementById('main-layout').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
});

// Botón Cancelar Wizard
document.getElementById('cancel-wizard-btn').addEventListener('click', function() {
  document.getElementById('wizard-modal').classList.add('hidden');
  document.getElementById('welcome-screen').classList.remove('hidden');
  // Reset steps just in case
  document.getElementById('wizard-step-1').classList.remove('hidden');
  document.getElementById('wizard-step-2').classList.add('hidden');
  document.getElementById('wizard-step-3').classList.add('hidden');
});
