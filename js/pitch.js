// pitch.js - sin import/export

var _pitchCurrentFormation = '4-3-3';
var _slotAssignments = {};
var _currentJerseyConfig = { primary: '#10b981', secondary: '#ffffff', pattern: 'none' };

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
  var container = document.getElementById('pitch-container');
  if (container && container.innerHTML !== '') {
    renderPitch(container, _pitchCurrentFormation, null);
  }
}

function renderPitch(container, formationName, onSlotClick) {
  var newSlots = FORMATIONS[formationName];
  if (!newSlots) return;

  if (formationName !== _pitchCurrentFormation) {
    var oldAssignments = Object.assign({}, _slotAssignments);
    _slotAssignments = {};

    // Paso 1: asignaciones exactas
    Object.keys(oldAssignments).forEach(function(oldId) {
      var slotExists = newSlots.some(function(s) { return s.id === oldId; });
      if (slotExists) {
        _slotAssignments[oldId] = oldAssignments[oldId];
        delete oldAssignments[oldId];
      }
    });

    // Paso 2: asignaciones por categoría
    Object.keys(oldAssignments).forEach(function(oldId) {
      var cat = getSlotCategory(oldId);
      var freeSlot = null;
      for (var i = 0; i < newSlots.length; i++) {
        var s = newSlots[i];
        if (getSlotCategory(s.id) === cat && !_slotAssignments[s.id]) {
          freeSlot = s;
          break;
        }
      }
      if (freeSlot) {
        _slotAssignments[freeSlot.id] = oldAssignments[oldId];
      }
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
      var chapaSVG = jerseySVG(Object.assign({}, _currentJerseyConfig, { number: assigned.number || '' }));
      el.innerHTML = '<div class="slot-chapa">' + chapaSVG + '</div><span class="slot-name">' + assigned.name + '</span>';
    } else {
      el.innerHTML = '<div class="slot-empty">' + slot.label + '</div>';
    }

    if (onSlotClick) {
      el.addEventListener('click', function() { onSlotClick(slot); });
    }

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
      var playerId    = e.dataTransfer.getData('playerId');
      var playerName  = e.dataTransfer.getData('playerName');
      var playerNumber = e.dataTransfer.getData('playerNumber');
      if (playerId) {
        _slotAssignments[slot.id] = { id: playerId, name: playerName, number: playerNumber };
        renderPitch(container, _pitchCurrentFormation, onSlotClick);
      }
    });

    pitch.appendChild(el);
  });

  container.appendChild(pitch);
}

function clearFormation() {
  _slotAssignments = {};
}

function exportLineup() {
  return {
    formation: _pitchCurrentFormation,
    slots: Object.keys(_slotAssignments).map(function(slotId) {
      var p = _slotAssignments[slotId];
      return { slotId: slotId, playerId: p.id, playerName: p.name, number: p.number };
    })
  };
}
