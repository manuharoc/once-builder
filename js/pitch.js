// pitch.js — con drag entre slots del campo

var _pitchCurrentFormation = '4-3-3';
var _slotAssignments = {};
var _currentJerseyConfig = { primary: '#10b981', secondary: '#ffffff', pattern: 'none' };
var _onSlotClickRef = null;
var _pitchContainerRef = null;

var SLOT_CATEGORIES = {
  GK:  ['GK'],
  DEF: ['LB', 'RB', 'CB1', 'CB2', 'CB3'],
  MID: ['LM', 'RM', 'CM1', 'CM2', 'CM3', 'CDM1', 'CDM2', 'AM'],
  ATT: ['LW', 'RW', 'ST1', 'ST2', 'ST']
};

function getSlotCategory(slotId) {
  var cats = Object.keys(SLOT_CATEGORIES);
  for (var i = 0; i < cats.length; i++) {
    if (SLOT_CATEGORIES[cats[i]].indexOf(slotId) !== -1) return cats[i];
  }
  return null;
}

function updateJerseyConfig(config) {
  _currentJerseyConfig = Object.assign({}, config);
  if (_pitchContainerRef && _pitchContainerRef.innerHTML !== '') {
    renderPitch(_pitchContainerRef, _pitchCurrentFormation, _onSlotClickRef);
  }
}

function isPlayerAssigned(playerId) {
  var keys = Object.keys(_slotAssignments);
  for (var i = 0; i < keys.length; i++) {
    if (String(_slotAssignments[keys[i]].id) === String(playerId)) return true;
  }
  return false;
}

function autoAssignPlayer(player) {
  if (isPlayerAssigned(player.id)) {
     return "already_assigned";
  }

  var newSlots = FORMATIONS[_pitchCurrentFormation];
  if (!newSlots) return false;

  var targetCat = null;
  if (player.position === 'Goalkeeper') targetCat = 'GK';
  else if (player.position === 'Defender') targetCat = 'DEF';
  else if (player.position === 'Midfielder') targetCat = 'MID';
  else if (player.position === 'Attacker') targetCat = 'ATT';

  if (!targetCat) return false;

  var targetSlot = null;
  for (var i = 0; i < newSlots.length; i++) {
    var s = newSlots[i];
    if (getSlotCategory(s.id) === targetCat && !_slotAssignments[s.id]) {
      targetSlot = s;
      break;
    }
  }

  if (targetSlot) {
    _slotAssignments[targetSlot.id] = { id: player.id, name: player.name, number: player.number };
    if (_pitchContainerRef) {
      renderPitch(_pitchContainerRef, _pitchCurrentFormation, _onSlotClickRef);
    }
    return true;
  }
  return false;
}

function unassignPlayer(playerId) {
  var keys = Object.keys(_slotAssignments);
  for (var i = 0; i < keys.length; i++) {
    if (String(_slotAssignments[keys[i]].id) === String(playerId)) {
       delete _slotAssignments[keys[i]];
       if (_pitchContainerRef) renderPitch(_pitchContainerRef, _pitchCurrentFormation, _onSlotClickRef);
       return true;
    }
  }
  return false;
}

function renderPitch(container, formationName, onSlotClick) {
  _pitchContainerRef = container;
  _onSlotClickRef = onSlotClick;
  var newSlots = FORMATIONS[formationName];
  if (!newSlots) return;

  if (formationName !== _pitchCurrentFormation) {
    var oldAssignments = Object.assign({}, _slotAssignments);
    _slotAssignments = {};

    // Paso 1: posiciones exactas
    Object.keys(oldAssignments).forEach(function(oldId) {
      if (newSlots.some(function(s){ return s.id === oldId; })) {
        _slotAssignments[oldId] = oldAssignments[oldId];
        delete oldAssignments[oldId];
      }
    });

    // Paso 2: misma categoría
    Object.keys(oldAssignments).forEach(function(oldId) {
      var cat = getSlotCategory(oldId);
      var freeSlot = null;
      for (var i = 0; i < newSlots.length; i++) {
        var s = newSlots[i];
        if (getSlotCategory(s.id) === cat && !_slotAssignments[s.id]) {
          freeSlot = s; break;
        }
      }
      if (freeSlot) _slotAssignments[freeSlot.id] = oldAssignments[oldId];
    });

    _pitchCurrentFormation = formationName;
  }

  container.innerHTML = '';
  var pitch = document.createElement('div');
  pitch.className = 'pitch';

  newSlots.forEach(function(slot) {
    var el = document.createElement('div');
    el.className = 'slot';
    el.dataset.slotId = slot.id;
    
    // Si tiene una posición personalizada, la usamos; si no, la de la formación
    var assigned = _slotAssignments[slot.id];
    var posX = slot.x;
    var posY = slot.y;
    if (assigned && assigned.customX !== undefined) {
      posX = assigned.customX;
      posY = assigned.customY;
    }
    
    el.style.left   = posX + '%';
    el.style.bottom = posY + '%';

    if (assigned) {
      el.classList.add('filled');
      // El slot lleno es arrastrable (para intercambiar posiciones)
      el.draggable = true;
      el.dataset.sourceSlotId = slot.id;
      var chapaSVG = jerseySVG(Object.assign({}, _currentJerseyConfig, { number: assigned.number || '' }));
      el.innerHTML = '<div class="slot-chapa">' + chapaSVG + '</div><span class="slot-name">' + assigned.name + '</span>';

      // Drag START desde el campo (chapa -> chapa)
      el.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('sourceSlotId', slot.id);
        e.dataTransfer.setData('playerId',     assigned.id);
        e.dataTransfer.setData('playerName',   assigned.name);
        e.dataTransfer.setData('playerNumber', assigned.number || '');
        el.classList.add('dragging');
      });

      el.addEventListener('dragend', function() {
        el.classList.remove('dragging');
      });

    } else {
      el.innerHTML = '<div class="slot-empty">' + slot.label + '</div>';
    }

    if (onSlotClick) {
      el.addEventListener('click', function() { onSlotClick(slot); });
    }

    // Doble click -> quitar jugador
    el.addEventListener('dblclick', function() {
      if (_slotAssignments[slot.id]) {
        delete _slotAssignments[slot.id];
        renderPitch(container, _pitchCurrentFormation, onSlotClick);
      }
    });

    el.addEventListener('dragenter', function(e) { e.preventDefault(); el.classList.add('drag-over'); });
    el.addEventListener('dragleave', function(e) { e.preventDefault(); el.classList.remove('drag-over'); });
    el.addEventListener('dragover',  function(e) { e.preventDefault(); });

    el.addEventListener('drop', function(e) {
      e.stopPropagation(); // Evitar que el campo atrape este drop
      e.preventDefault();
      el.classList.remove('drag-over');

      var sourceSlotId = e.dataTransfer.getData('sourceSlotId');
      var playerId     = e.dataTransfer.getData('playerId');
      var playerName   = e.dataTransfer.getData('playerName');
      var playerNumber = e.dataTransfer.getData('playerNumber');

      if (!playerId) return;

      if (sourceSlotId) {
        // Viene de otro slot del campo → intercambiar
        var sourcePlayer = _slotAssignments[sourceSlotId];
        var targetPlayer = _slotAssignments[slot.id];

        // Mantenemos las posiciones personalizadas si intercambiamos
        var sCustomX = sourcePlayer.customX;
        var sCustomY = sourcePlayer.customY;
        
        if (targetPlayer) {
          var tCustomX = targetPlayer.customX;
          var tCustomY = targetPlayer.customY;
          
          targetPlayer.customX = sCustomX;
          targetPlayer.customY = sCustomY;
          _slotAssignments[sourceSlotId] = targetPlayer;
          
          sourcePlayer.customX = tCustomX;
          sourcePlayer.customY = tCustomY;
        } else {
          // El slot original se queda vacío
          delete sourcePlayer.customX;
          delete sourcePlayer.customY;
          delete _slotAssignments[sourceSlotId];
        }
        
        _slotAssignments[slot.id] = { 
          id: playerId, name: playerName, number: playerNumber,
          customX: sourcePlayer.customX, customY: sourcePlayer.customY
        };
      } else {
        // Viene del banquillo → asignar directamente
        _slotAssignments[slot.id] = { id: playerId, name: playerName, number: playerNumber };
      }

      renderPitch(container, _pitchCurrentFormation, onSlotClick);
    });

    pitch.appendChild(el);
  });

  // Drop sobre cualquier parte del césped (movimiento libre)
  pitch.addEventListener('dragover', function(e) { e.preventDefault(); });
  pitch.addEventListener('drop', function(e) {
    e.preventDefault();
    var sourceSlotId = e.dataTransfer.getData('sourceSlotId');
    if (!sourceSlotId || !_slotAssignments[sourceSlotId]) return;

    var rect = pitch.getBoundingClientRect();
    
    // Calculamos coordenada respecto a la esquina superior izquierda del campo
    // Restamos 24px que es la mitad de la chapa (48x48)
    var x = e.clientX - rect.left - 24;
    var y = e.clientY - rect.top - 24;

    var percentX = (x / rect.width) * 100;
    var percentBottom = 100 - ((y + 48) / rect.height) * 100; // Ajustamos bottom

    percentX = Math.max(0, Math.min(100, percentX));
    percentBottom = Math.max(0, Math.min(100, percentBottom));

    _slotAssignments[sourceSlotId].customX = percentX;
    _slotAssignments[sourceSlotId].customY = percentBottom;

    renderPitch(container, _pitchCurrentFormation, onSlotClick);
  });

  container.appendChild(pitch);
  
  // Notificar al resto de la app que el once ha cambiado
  document.dispatchEvent(new Event('pitchChanged'));
}

function clearFormation() { _slotAssignments = {}; }

function exportLineup() {
  return {
    formation: _pitchCurrentFormation,
    slots: Object.keys(_slotAssignments).map(function(slotId) {
      var p = _slotAssignments[slotId];
      return { slotId: slotId, playerId: p.id, playerName: p.name, number: p.number };
    })
  };
}
