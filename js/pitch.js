import { FORMATIONS } from './formations.js';

let currentFormation = '4-3-3';
let slotAssignments = {}; // slotId -> player object

export function renderPitch(container, formationName, onSlotClick) {
  currentFormation = formationName;
  const slots = FORMATIONS[formationName];
  container.innerHTML = '';

  const pitch = document.createElement('div');
  pitch.className = 'pitch';

  slots.forEach(slot => {
    const el = document.createElement('div');
    el.className = 'slot';
    el.dataset.slotId = slot.id;
    el.style.left = `${slot.x}%`;
    el.style.bottom = `${slot.y}%`;

    const assigned = slotAssignments[slot.id];
    if (assigned) {
      el.classList.add('filled');
      el.innerHTML = `<div class="slot-jersey" style="background: var(--bg-color)">${assigned.number || ''}</div><span class="slot-name">${assigned.name}</span>`;
    } else {
      el.innerHTML = `<div class="slot-empty">${slot.label}</div>`;
    }

    el.addEventListener('click', () => onSlotClick(slot));
    
    // Doble click para remover jugador
    el.addEventListener('dblclick', () => {
      if (assigned) {
        delete slotAssignments[slot.id];
        renderPitch(container, currentFormation, onSlotClick);
      }
    });

    el.addEventListener('dragenter', e => {
      e.preventDefault();
      el.classList.add('drag-over');
    });

    el.addEventListener('dragleave', e => {
      e.preventDefault();
      el.classList.remove('drag-over');
    });

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
