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
    el.style.left   = slot.x + '%';
    el.style.bottom = slot.y + '%';

    var assigned = _slotAssignments[slot.id];
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

        if (targetPlayer) {
          _slotAssignments[sourceSlotId] = targetPlayer;
        } else {
          delete _slotAssignments[sourceSlotId];
        }
        _slotAssignments[slot.id] = { id: playerId, name: playerName, number: playerNumber };
      } else {
        // Viene del banquillo → asignar directamente
        _slotAssignments[slot.id] = { id: playerId, name: playerName, number: playerNumber };
      }

      renderPitch(container, _pitchCurrentFormation, onSlotClick);
    });

    pitch.appendChild(el);
  });

  container.appendChild(pitch);
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
