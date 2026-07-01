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
    el.innerHTML = assigned
      ? `<div class="slot-jersey"></div><span class="slot-name">${assigned.name}</span>`
      : `<div class="slot-empty">${slot.label}</div>`;

    el.addEventListener('click', () => onSlotClick(slot));
    el.addEventListener('dragover', e => e.preventDefault());
    el.addEventListener('drop', e => {
      e.preventDefault();
      const playerId = e.dataTransfer.getData('playerId');
      const playerName = e.dataTransfer.getData('playerName');
      if (playerId) {
        slotAssignments[slot.id] = { id: playerId, name: playerName };
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
      playerName: player.name
    }))
  };
}
