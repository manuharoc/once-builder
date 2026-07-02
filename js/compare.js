// compare.js — Lógica para comparar dos equipos

async function autoGenerateLineup(teamId) {
  var players = await getTeamPlayers(teamId);
  var gks = players.filter(p => p.position === 'Goalkeeper').sort((a,b) => (a.number||99) - (b.number||99));
  var defs = players.filter(p => p.position === 'Defender').sort((a,b) => (a.number||99) - (b.number||99));
  var mids = players.filter(p => p.position === 'Midfielder').sort((a,b) => (a.number||99) - (b.number||99));
  var atts = players.filter(p => p.position === 'Attacker').sort((a,b) => (a.number||99) - (b.number||99));

  // Para un 4-3-3
  var lineup = [];
  if (gks.length > 0) lineup.push(gks[0]);
  for(var i=0; i<4 && i<defs.length; i++) lineup.push(defs[i]);
  for(var i=0; i<3 && i<mids.length; i++) lineup.push(mids[i]);
  for(var i=0; i<3 && i<atts.length; i++) lineup.push(atts[i]);

  return lineup;
}

function renderStaticPitch(container, formationName, lineup, jerseyConfig) {
  var slots = FORMATIONS[formationName];
  if (!slots) return;

  container.innerHTML = '';
  var pitch = document.createElement('div');
  pitch.className = 'pitch static';

  // Copia de lineup para ir sacando jugadores
  var availableGKs = lineup.filter(p => p.position === 'Goalkeeper');
  var availableDefs = lineup.filter(p => p.position === 'Defender');
  var availableMids = lineup.filter(p => p.position === 'Midfielder');
  var availableAtts = lineup.filter(p => p.position === 'Attacker');

  slots.forEach(function(slot) {
    var el = document.createElement('div');
    el.className = 'slot filled static-slot';
    el.style.left   = slot.x + '%';
    el.style.bottom = slot.y + '%';

    var cat = getSlotCategory(slot.id);
    var player = null;
    
    if (cat === 'GK' && availableGKs.length > 0) player = availableGKs.shift();
    else if (cat === 'DEF' && availableDefs.length > 0) player = availableDefs.shift();
    else if (cat === 'MID' && availableMids.length > 0) player = availableMids.shift();
    else if (cat === 'ATT' && availableAtts.length > 0) player = availableAtts.shift();
    else if (lineup.length > 0) player = lineup.shift(); // fallback a cualquiera

    if (player) {
      var chapaSVG = jerseySVG(Object.assign({}, jerseyConfig, { number: player.number || '' }));
      el.innerHTML = '<div class="slot-chapa">' + chapaSVG + '</div><span class="slot-name">' + player.name + '</span>';
    } else {
      el.innerHTML = '<div class="slot-empty">' + slot.label + '</div>';
    }

    pitch.appendChild(el);
  });

  container.appendChild(pitch);
}

// ── Inicialización UI de Compare ─────────────────────────────────────────────
var btnStartCompare = document.getElementById('start-compare-btn');
var compareModal    = document.getElementById('compare-modal');
var compareSelectA  = document.getElementById('compare-team-a');
var compareSelectB  = document.getElementById('compare-team-b');
var btnRunCompare   = document.getElementById('run-compare-btn');
var compareLayout   = document.getElementById('compare-layout');
var backToHomeBtn   = document.getElementById('back-to-home-btn');

var pitchContainerA = document.getElementById('pitch-container-a');
var pitchContainerB = document.getElementById('pitch-container-b');
var titleA = document.getElementById('compare-title-a');
var titleB = document.getElementById('compare-title-b');

if (btnStartCompare) {
  btnStartCompare.addEventListener('click', function() {
    welcomeScreen.classList.add('hidden');
    compareModal.classList.remove('hidden');
    
    // Rellenar selects
    var optionsHtml = '<option value="" disabled selected>Selecciona equipo...</option>';
    MOCK_TEAMS.forEach(t => {
      optionsHtml += '<option value="'+t.id+'">'+t.name+'</option>';
    });
    compareSelectA.innerHTML = optionsHtml;
    compareSelectB.innerHTML = optionsHtml;
  });
}

if (btnRunCompare) {
  btnRunCompare.addEventListener('click', async function() {
    var teamIdA = compareSelectA.value;
    var teamIdB = compareSelectB.value;

    if (!teamIdA || !teamIdB || teamIdA === teamIdB) {
      return showToast('Por favor, selecciona dos equipos diferentes.', true);
    }

    compareModal.classList.add('hidden');
    compareLayout.classList.remove('hidden');

    var teamA = MOCK_TEAMS.find(t => String(t.id) === teamIdA);
    var teamB = MOCK_TEAMS.find(t => String(t.id) === teamIdB);

    titleA.innerHTML = '<i class="fa-solid fa-shield"></i> ' + teamA.name;
    titleB.innerHTML = '<i class="fa-solid fa-shield"></i> ' + teamB.name;

    // Asegurarnos de que los jugadores están en localStorage (si no, los cargamos)
    await saveTeamWithPlayers(teamA, await getSquadAPI(teamA.id), 'mock');
    await saveTeamWithPlayers(teamB, await getSquadAPI(teamB.id), 'mock');

    var lineupA = await autoGenerateLineup(teamA.id);
    var lineupB = await autoGenerateLineup(teamB.id);

    // Renderizamos los campos
    var jerseyA = { primary: '#1e3a8a', secondary: '#ffffff', pattern: 'stripes-v' };
    var jerseyB = { primary: '#dc2626', secondary: '#ffffff', pattern: 'none' };
    
    // Podemos extraer colores si los tuviéramos, pero usamos fijos de prueba
    renderStaticPitch(pitchContainerA, '4-3-3', lineupA, jerseyA);
    renderStaticPitch(pitchContainerB, '4-3-3', lineupB, jerseyB);
  });
}

if (backToHomeBtn) {
  backToHomeBtn.addEventListener('click', function() {
    compareLayout.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
  });
}
