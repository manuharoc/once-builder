import { FORMATIONS } from './formations.js';
import { jerseySVG } from './jersey.js';

let currentFormation = '4-3-3';
let slotAssignments = {}; 
let currentJerseyConfig = { primary: '#10b981', secondary: '#ffffff', pattern: 'none' };

const SLOT_CATEGORIES = {
  GK: ['GK'],
  DEF: ['LB', 'RB', 'CB1', 'CB2', 'CB3'],
  MID: ['LM', 'RM', 'CM1', 'CM2', 'CM3', 'CDM1', 'CDM2', 'AM'],
  ATT: ['LW', 'RW', 'ST1', 'ST2', 'ST']
};

function getCategory(slotId) {
  for (const [cat, ids] of Object.entries(SLOT_CATEGORIES)) {
    if (ids.includes(slotId)) return cat;
  }
  return null;
}

export function updateJerseyConfig(config) {
  currentJerseyConfig = config;
  // Redraw if pitch exists
  const container = document.getElementById('pitch-container');
  if (container && container.innerHTML !== '') {
    renderPitch(container, currentFormation, () => {});
  }
}

export function renderPitch(container, formationName, onSlotClick) {
  const newSlots = FORMATIONS[formationName];
  
  if (formationName !== currentFormation) {
    const oldAssignments = { ...slotAssignments };
    slotAssignments = {};
    
    // 1. Asignaciones exactas
    for (const [oldId, player] of Object.entries(oldAssignments)) {
      if (newSlots.find(s => s.id === oldId)) {
        slotAssignments[oldId] = player;
        delete oldAssignments[oldId];
      }
    }
    
    // 2. Asignaciones por categoría
    for (const [oldId, player] of Object.entries(oldAssignments)) {
      const cat = getCategory(oldId);
      const emptySlotInCat = newSlots.find(s => getCategory(s.id) === cat && !slotAssignments[s.id]);
      if (emptySlotInCat) {
        slotAssignments[emptySlotInCat.id] = player;
      }
      // Los jugadores no reasignados se pierden (vuelven al banquillo)
    }
    currentFormation = formationName;
  }

  container.innerHTML = '';
  const pitch = document.createElement('div');
  pitch.className = 'pitch';

  newSlots.forEach(slot => {
    const el = document.createElement('div');
    el.className = 'slot';
    el.dataset.slotId = slot.id;
    el.style.left = `${slot.x}%`;
    el.style.bottom = `${slot.y}%`;

    const assigned = slotAssignments[slot.id];
    if (assigned) {
      el.classList.add('filled');
      const chapaSVG = jerseySVG({ ...currentJerseyConfig, number: assigned.number || '' });
      el.innerHTML = `<div class="slot-chapa">${chapaSVG}</div><span class="slot-name">${assigned.name}</span>`;
    } else {
      el.innerHTML = `<div class="slot-empty">${slot.label}</div>`;
    }

    el.addEventListener('click', () => onSlotClick?.(slot));
    
    el.addEventListener('dblclick', () => {
      if (assigned) {
        delete slotAssignments[slot.id];
        renderPitch(container, currentFormation, onSlotClick);
      }
    });

    el.addEventListener('dragenter', e => { e.preventDefault(); el.classList.add('drag-over'); });
    el.addEventListener('dragleave', e => { e.preventDefault(); el.classList.remove('drag-over'); });
    el.addEventListener('dragover', e => e.preventDefault());

    el.addEventListener('drop', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
      const playerId = e.dataTransfer.getData('playerId');
      const playerName = e.dataTransfer.getData('playerName');
      const playerNumber = e.dataTransfer.getData('playerNumber');
      if (playerId) {
        slotAssignments[slot.id] = { id: playerId, name: playerName, number: playerNumber };
        renderPitch(container, currentFormation, onSlotClick);
      }
    });

    pitch.appendChild(el);
  });

  container.appendChild(pitch);
}

export function assignPlayerToSlot(slotId, player) {
  slotAssignments[slotId] = player;
}

export function clearFormation() {
  slotAssignments = {};
}

export function getSlotAssignments() {
  return slotAssignments;
}

export function exportLineup() {
  return {
    formation: currentFormation,
    slots: Object.entries(slotAssignments).map(([slotId, player]) => ({
      slotId,
      playerId: player.id,
      playerName: player.name,
      number: player.number
    }))
  };
}
