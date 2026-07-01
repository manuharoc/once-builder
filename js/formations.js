// Coordenadas en % sobre el campo (0,0 = esquina superior izq. = portería propia arriba)
// x: 0-100 (ancho), y: 0-100 (largo, 0=portería propia, 100=portería rival)

export const FORMATIONS = {
  "4-3-3": [
    { id: "GK", label: "POR", x: 50, y: 5 },
    { id: "LB", label: "LI", x: 15, y: 25 },
    { id: "CB1", label: "DFC", x: 38, y: 20 },
    { id: "CB2", label: "DFC", x: 62, y: 20 },
    { id: "RB", label: "LD", x: 85, y: 25 },
    { id: "CM1", label: "MC", x: 30, y: 50 },
    { id: "CM2", label: "MC", x: 50, y: 45 },
    { id: "CM3", label: "MC", x: 70, y: 50 },
    { id: "LW", label: "EI", x: 15, y: 78 },
    { id: "ST", label: "DC", x: 50, y: 85 },
    { id: "RW", label: "ED", x: 85, y: 78 }
  ],
  "4-4-2": [
    { id: "GK", label: "POR", x: 50, y: 5 },
    { id: "LB", label: "LI", x: 15, y: 25 },
    { id: "CB1", label: "DFC", x: 38, y: 20 },
    { id: "CB2", label: "DFC", x: 62, y: 20 },
    { id: "RB", label: "LD", x: 85, y: 25 },
    { id: "LM", label: "MI", x: 15, y: 52 },
    { id: "CM1", label: "MC", x: 38, y: 48 },
    { id: "CM2", label: "MC", x: 62, y: 48 },
    { id: "RM", label: "MD", x: 85, y: 52 },
    { id: "ST1", label: "DC", x: 38, y: 85 },
    { id: "ST2", label: "DC", x: 62, y: 85 }
  ],
  "3-5-2": [
    { id: "GK", label: "POR", x: 50, y: 5 },
    { id: "CB1", label: "DFC", x: 25, y: 20 },
    { id: "CB2", label: "DFC", x: 50, y: 16 },
    { id: "CB3", label: "DFC", x: 75, y: 20 },
    { id: "LM", label: "CI", x: 10, y: 50 },
    { id: "CM1", label: "MC", x: 35, y: 45 },
    { id: "CM2", label: "MC", x: 65, y: 45 },
    { id: "RM", label: "CD", x: 90, y: 50 },
    { id: "AM", label: "MCO", x: 50, y: 62 },
    { id: "ST1", label: "DC", x: 38, y: 85 },
    { id: "ST2", label: "DC", x: 62, y: 85 }
  ],
  "4-2-3-1": [
    { id: "GK", label: "POR", x: 50, y: 5 },
    { id: "LB", label: "LI", x: 15, y: 25 },
    { id: "CB1", label: "DFC", x: 38, y: 20 },
    { id: "CB2", label: "DFC", x: 62, y: 20 },
    { id: "RB", label: "LD", x: 85, y: 25 },
    { id: "CDM1", label: "MCD", x: 38, y: 42 },
    { id: "CDM2", label: "MCD", x: 62, y: 42 },
    { id: "LW", label: "MI", x: 15, y: 65 },
    { id: "AM", label: "MCO", x: 50, y: 68 },
    { id: "RW", label: "MD", x: 85, y: 65 },
    { id: "ST", label: "DC", x: 50, y: 88 }
  ],
  "3-4-3": [
    { id: "GK", label: "POR", x: 50, y: 5 },
    { id: "CB1", label: "DFC", x: 25, y: 20 },
    { id: "CB2", label: "DFC", x: 50, y: 16 },
    { id: "CB3", label: "DFC", x: 75, y: 20 },
    { id: "LM", label: "MI", x: 12, y: 50 },
    { id: "CM1", label: "MC", x: 38, y: 48 },
    { id: "CM2", label: "MC", x: 62, y: 48 },
    { id: "RM", label: "MD", x: 88, y: 50 },
    { id: "LW", label: "EI", x: 18, y: 80 },
    { id: "ST", label: "DC", x: 50, y: 88 },
    { id: "RW", label: "ED", x: 82, y: 80 }
  ],
  "5-3-2": [
    { id: "GK", label: "POR", x: 50, y: 5 },
    { id: "LB", label: "LI", x: 10, y: 28 },
    { id: "CB1", label: "DFC", x: 30, y: 18 },
    { id: "CB2", label: "DFC", x: 50, y: 15 },
    { id: "CB3", label: "DFC", x: 70, y: 18 },
    { id: "RB", label: "LD", x: 90, y: 28 },
    { id: "CM1", label: "MC", x: 30, y: 50 },
    { id: "CM2", label: "MC", x: 50, y: 45 },
    { id: "CM3", label: "MC", x: 70, y: 50 },
    { id: "ST1", label: "DC", x: 38, y: 85 },
    { id: "ST2", label: "DC", x: 62, y: 85 }
  ]
};

export function getFormationNames() {
  return Object.keys(FORMATIONS);
}
