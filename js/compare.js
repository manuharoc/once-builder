// compare.js — Lógica para comparar dos equipos interactivos

var compareStateA = { team: null, squad: [], lineup: {}, bench: [], formation: '4-3-3', jersey: {} };
var compareStateB = { team: null, squad: [], lineup: {}, bench: [], formation: '4-3-3', jersey: {} };

async function initCompareState(teamId, stateObj, jerseyConfig) {
  var team = MOCK_TEAMS.find(t => String(t.id) === String(teamId));
  var squad = await getTeamPlayers(teamId);
  
  stateObj.team = team;
  stateObj.squad = [...squad];
  stateObj.formation = '4-3-3'; // default
  stateObj.jersey = jerseyConfig;
  
  autoBuildLineup(stateObj);
}

function autoBuildLineup(stateObj) {
  stateObj.lineup = {};
  stateObj.bench = [];
  
  var gks = stateObj.squad.filter(p => p.position === 'Goalkeeper').sort((a,b) => (a.number||99) - (b.number||99));
  var defs = stateObj.squad.filter(p => p.position === 'Defender').sort((a,b) => (a.number||99) - (b.number||99));
  var mids = stateObj.squad.filter(p => p.position === 'Midfielder').sort((a,b) => (a.number||99) - (b.number||99));
  var atts = stateObj.squad.filter(p => p.position === 'Attacker').sort((a,b) => (a.number||99) - (b.number||99));

  var slots = FORMATIONS[stateObj.formation];
  
  slots.forEach(slot => {
    var cat = getSlotCategory(slot.id);
    var player = null;
    
    if (cat === 'GK' && gks.length > 0) player = gks.shift();
    else if (cat === 'DEF' && defs.length > 0) player = defs.shift();
    else if (cat === 'MID' && mids.length > 0) player = mids.shift();
    else if (cat === 'ATT' && atts.length > 0) player = atts.shift();
    // fallback
    else if (gks.length > 0) player = gks.shift();
    else if (defs.length > 0) player = defs.shift();
    else if (mids.length > 0) player = mids.shift();
    else if (atts.length > 0) player = atts.shift();
    
    if (player) {
      stateObj.lineup[slot.id] = player;
    }
  });

  // El resto va al banquillo
  stateObj.bench = [...gks, ...defs, ...mids, ...atts];
}

function changeFormation(stateObj, newFormation) {
  var oldLineup = Object.values(stateObj.lineup);
  stateObj.formation = newFormation;
  stateObj.lineup = {};
  
  // Re-meter a todos al squad temporalmente y reconstruir (para simplificar)
  // O podemos intentar reasignarlos a la nueva formación
  var gks = oldLineup.filter(p => p.position === 'Goalkeeper');
  var defs = oldLineup.filter(p => p.position === 'Defender');
  var mids = oldLineup.filter(p => p.position === 'Midfielder');
  var atts = oldLineup.filter(p => p.position === 'Attacker');
  
  var slots = FORMATIONS[newFormation];
  slots.forEach(slot => {
    var cat = getSlotCategory(slot.id);
    var player = null;
    if (cat === 'GK' && gks.length > 0) player = gks.shift();
    else if (cat === 'DEF' && defs.length > 0) player = defs.shift();
    else if (cat === 'MID' && mids.length > 0) player = mids.shift();
    else if (cat === 'ATT' && atts.length > 0) player = atts.shift();
    else if (gks.length > 0) player = gks.shift();
    else if (defs.length > 0) player = defs.shift();
    else if (mids.length > 0) player = mids.shift();
    else if (atts.length > 0) player = atts.shift();
    
    if (player) stateObj.lineup[slot.id] = player;
  });
  
  // Los sobrantes van al banquillo
  var leftover = [...gks, ...defs, ...mids, ...atts];
  stateObj.bench = stateObj.bench.concat(leftover);
}

function getPlayerById(stateObj, playerId) {
  return stateObj.squad.find(p => String(p.id) === String(playerId));
}

function renderCompareTeam(side, stateObj) {
  var pitchContainer = document.getElementById(side === 'A' ? 'pitch-container-a' : 'pitch-container-b');
  var benchContainer = document.getElementById(side === 'A' ? 'bench-list-a' : 'bench-list-b');
  var formationSelect = document.getElementById(side === 'A' ? 'compare-formation-a' : 'compare-formation-b');
  
  formationSelect.value = stateObj.formation;
  
  var slots = FORMATIONS[stateObj.formation];
  pitchContainer.innerHTML = '';
  
  var pitch = document.createElement('div');
  pitch.className = 'pitch static';
  
  slots.forEach(function(slot) {
    var el = document.createElement('div');
    el.className = 'slot';
    el.dataset.slotId = slot.id;
    el.dataset.side = side;
    el.style.left = slot.x + '%';
    el.style.bottom = slot.y + '%';
    
    var player = stateObj.lineup[slot.id];
    
    if (player) {
      el.classList.add('filled');
      el.draggable = true;
      el.dataset.playerId = player.id;
      var chapaSVG = jerseySVG(Object.assign({}, stateObj.jersey, { number: player.number || '' }));
      el.innerHTML = '<div class="slot-chapa">' + chapaSVG + '</div><span class="slot-name">' + player.name + '</span>';
    } else {
      el.innerHTML = '<div class="slot-empty">' + slot.label + '</div>';
    }
    
    // Eventos Drag & Drop de Slot
    el.addEventListener('dragstart', function(e) {
      if (!el.classList.contains('filled')) return;
      e.dataTransfer.setData('sourceSlotId', slot.id);
      e.dataTransfer.setData('sourceSide', side);
      e.dataTransfer.setData('playerId', player.id);
      el.classList.add('dragging');
    });
    
    el.addEventListener('dragend', function() { el.classList.remove('dragging'); });
    el.addEventListener('dragenter', function(e) { e.preventDefault(); el.classList.add('drag-over'); });
    el.addEventListener('dragleave', function(e) { e.preventDefault(); el.classList.remove('drag-over'); });
    el.addEventListener('dragover', function(e) { e.preventDefault(); });
    
    el.addEventListener('drop', function(e) {
      e.preventDefault(); e.stopPropagation();
      el.classList.remove('drag-over');
      
      var sourceSide = e.dataTransfer.getData('sourceSide');
      var sourceSlotId = e.dataTransfer.getData('sourceSlotId');
      var sourceBench = e.dataTransfer.getData('sourceBench');
      var playerId = e.dataTransfer.getData('playerId');
      
      if (sourceSide !== side) return; // No mezclar equipos
      
      var targetPlayerId = el.dataset.playerId;
      
      if (sourceBench === 'true') {
        // Viene del banquillo
        var pToPitch = stateObj.bench.find(p => String(p.id) === playerId);
        stateObj.bench = stateObj.bench.filter(p => String(p.id) !== playerId);
        
        if (targetPlayerId) {
           // Intercambio con el banquillo
           var pToBench = stateObj.lineup[slot.id];
           stateObj.bench.push(pToBench);
        }
        stateObj.lineup[slot.id] = pToPitch;
        
      } else if (sourceSlotId) {
        // Intercambio en el campo
        var sourcePlayer = stateObj.lineup[sourceSlotId];
        var targetPlayer = stateObj.lineup[slot.id];
        
        if (targetPlayer) {
          stateObj.lineup[sourceSlotId] = targetPlayer;
        } else {
          delete stateObj.lineup[sourceSlotId];
        }
        stateObj.lineup[slot.id] = sourcePlayer;
      }
      
      renderCompareTeam(side, stateObj);
    });
    
    // Clic simple abre el modal de sustitutos
    el.addEventListener('click', function() {
       openSubstituteModal(side, slot.id, stateObj);
    });
    
    // Doble clic manda al banquillo
    el.addEventListener('dblclick', function() {
       if (stateObj.lineup[slot.id]) {
           stateObj.bench.push(stateObj.lineup[slot.id]);
           delete stateObj.lineup[slot.id];
           renderCompareTeam(side, stateObj);
       }
    });
    
    pitch.appendChild(el);
  });
  
  pitchContainer.appendChild(pitch);
  
  // Renderizar banquillo
  benchContainer.innerHTML = '';
  stateObj.bench.forEach(function(player) {
    var li = document.createElement('li');
    li.draggable = true;
    li.innerHTML = '<span class="player-number-badge">' + (player.number || '-') + '</span>' +
                   '<span class="player-name">' + player.name + '</span>' +
                   '<span class="player-pos-badge">' + (player.position ? player.position.substring(0, 3).toUpperCase() : '?') + '</span>';
                   
    li.addEventListener('dragstart', function(e) {
       e.dataTransfer.setData('sourceBench', 'true');
       e.dataTransfer.setData('sourceSide', side);
       e.dataTransfer.setData('playerId', player.id);
    });
    
    benchContainer.appendChild(li);
  });
  
  // Soltar en banquillo para sacar del campo
  benchContainer.addEventListener('dragover', function(e) { e.preventDefault(); });
  benchContainer.addEventListener('drop', function(e) {
      e.preventDefault();
      var sourceSide = e.dataTransfer.getData('sourceSide');
      var sourceSlotId = e.dataTransfer.getData('sourceSlotId');
      
      if (sourceSide === side && sourceSlotId) {
          if (stateObj.lineup[sourceSlotId]) {
              stateObj.bench.push(stateObj.lineup[sourceSlotId]);
              delete stateObj.lineup[sourceSlotId];
              renderCompareTeam(side, stateObj);
          }
      }
  });
}

// ── Inicialización UI de Compare ─────────────────────────────────────────────
var btnStartCompare = document.getElementById('start-compare-btn');
var compareModal    = document.getElementById('compare-modal');
var compareSelectA  = document.getElementById('compare-team-a');
var compareSelectB  = document.getElementById('compare-team-b');
var btnRunCompare   = document.getElementById('run-compare-btn');
var compareLayout   = document.getElementById('compare-layout');
var backToHomeBtn   = document.getElementById('back-to-home-btn');

var formationSelectA = document.getElementById('compare-formation-a');
var formationSelectB = document.getElementById('compare-formation-b');
var titleA = document.getElementById('compare-title-a');
var titleB = document.getElementById('compare-title-b');

function populateFormations(selectEl) {
  var html = '';
  Object.keys(FORMATIONS).forEach(function(f) {
    html += '<option value="'+f+'">'+f+'</option>';
  });
  selectEl.innerHTML = html;
}

if (btnStartCompare) {
  btnStartCompare.addEventListener('click', function() {
    welcomeScreen.classList.add('hidden');
    compareModal.classList.remove('hidden');
    
    var optionsHtml = '<option value="" disabled selected>Selecciona equipo...</option>';
    MOCK_TEAMS.forEach(t => {
      optionsHtml += '<option value="'+t.id+'">'+t.name+'</option>';
    });
    compareSelectA.innerHTML = optionsHtml;
    compareSelectB.innerHTML = optionsHtml;
    
    populateFormations(formationSelectA);
    populateFormations(formationSelectB);
  });
}

formationSelectA.addEventListener('change', function(e) {
  changeFormation(compareStateA, e.target.value);
  renderCompareTeam('A', compareStateA);
});

formationSelectB.addEventListener('change', function(e) {
  changeFormation(compareStateB, e.target.value);
  renderCompareTeam('B', compareStateB);
});

if (btnRunCompare) {
  btnRunCompare.addEventListener('click', async function() {
    var teamIdA = compareSelectA.value;
    var teamIdB = compareSelectB.value;

    if (!teamIdA || !teamIdB || teamIdA === teamIdB) {
      return showToast('Por favor, selecciona dos equipos diferentes.', true);
    }

    compareModal.classList.add('hidden');
    compareLayout.classList.remove('hidden');

    var jerseyA = { primary: '#1e3a8a', secondary: '#ffffff', pattern: 'stripes-v' };
    var jerseyB = { primary: '#dc2626', secondary: '#ffffff', pattern: 'none' };
    
    await initCompareState(teamIdA, compareStateA, jerseyA);
    await initCompareState(teamIdB, compareStateB, jerseyB);

    titleA.innerHTML = '<i class="fa-solid fa-shield"></i> ' + compareStateA.team.name;
    titleB.innerHTML = '<i class="fa-solid fa-shield"></i> ' + compareStateB.team.name;

    renderCompareTeam('A', compareStateA);
    renderCompareTeam('B', compareStateB);
  });
}

if (backToHomeBtn) {
  backToHomeBtn.addEventListener('click', function() {
    compareLayout.classList.add('hidden');
    welcomeScreen.classList.remove('hidden');
  });
}

// ── Modal de Sustitutos ──────────────────────────────────────────────────────
var subModal = document.getElementById('substitute-modal');
var closeSubBtn = document.getElementById('close-substitute-btn');
var subList = document.getElementById('substitute-list');

if (closeSubBtn) {
  closeSubBtn.addEventListener('click', function() {
    subModal.classList.add('hidden');
  });
}

function openSubstituteModal(side, slotId, stateObj) {
  var cat = getSlotCategory(slotId);
  var targetPos = cat === 'GK' ? 'Goalkeeper' : (cat === 'DEF' ? 'Defender' : (cat === 'MID' ? 'Midfielder' : 'Attacker'));
  
  var candidates = stateObj.bench.filter(p => p.position === targetPos);
  if (candidates.length === 0) {
    candidates = stateObj.bench; // Mostrar todos si no hay de la posición
  }
  
  subList.innerHTML = '';
  
  if (candidates.length === 0) {
    var debugLi = document.createElement('li');
    debugLi.innerHTML = '<span style="color:red;">Error: Banquillo vacío. Squad: ' + stateObj.squad.length + ' | Lineup: ' + Object.keys(stateObj.lineup).length + '</span>';
    subList.appendChild(debugLi);
  }
  
  candidates.forEach(function(player) {
    var li = document.createElement('li');
    li.style.cursor = 'pointer';
    li.innerHTML = '<span class="player-number-badge">' + (player.number || '-') + '</span>' +
                   '<span class="player-name">' + player.name + '</span>' +
                   '<span class="player-pos-badge">' + (player.position ? player.position.substring(0, 3).toUpperCase() : '?') + '</span>';
                   
    li.addEventListener('click', function() {
      var targetPlayerId = stateObj.lineup[slotId] ? stateObj.lineup[slotId].id : null;
      var pToPitch = stateObj.bench.find(p => String(p.id) === String(player.id));
      
      // Quitar del banquillo
      stateObj.bench = stateObj.bench.filter(p => String(p.id) !== String(player.id));
      
      // Añadir al banquillo el que estaba en el campo (si había)
      if (targetPlayerId) {
         stateObj.bench.push(stateObj.lineup[slotId]);
      }
      
      // Poner en el campo
      stateObj.lineup[slotId] = pToPitch;
      
      renderCompareTeam(side, stateObj);
      subModal.classList.add('hidden');
    });
    
    subList.appendChild(li);
  });
  
  subModal.classList.remove('hidden');
}
