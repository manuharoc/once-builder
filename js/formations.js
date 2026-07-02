// formations.js - sin import/export, variables globales

const FORMATIONS = {
  "4-4-2": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LB",  label: "LI",  x: 15, y: 22 },
    { id: "CB1", label: "DFC", x: 38, y: 18 },
    { id: "CB2", label: "DFC", x: 62, y: 18 },
    { id: "RB",  label: "LD",  x: 85, y: 22 },
    { id: "LM",  label: "MI",  x: 15, y: 50 },
    { id: "CM1", label: "MC",  x: 38, y: 48 },
    { id: "CM2", label: "MC",  x: 62, y: 48 },
    { id: "RM",  label: "MD",  x: 85, y: 50 },
    { id: "ST1", label: "DC",  x: 40, y: 85 },
    { id: "ST2", label: "DC",  x: 60, y: 85 }
  ],

  "4-4-2 Rombo": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LB",  label: "LI",  x: 15, y: 22 },
    { id: "CB1", label: "DFC", x: 38, y: 18 },
    { id: "CB2", label: "DFC", x: 62, y: 18 },
    { id: "RB",  label: "LD",  x: 85, y: 22 },
    { id: "CDM", label: "MCD", x: 50, y: 38 },
    { id: "LM",  label: "MI",  x: 20, y: 55 },
    { id: "RM",  label: "MD",  x: 80, y: 55 },
    { id: "CAM", label: "MCO", x: 50, y: 68 },
    { id: "ST1", label: "DC",  x: 40, y: 88 },
    { id: "ST2", label: "DC",  x: 60, y: 88 }
  ],

  "4-3-3": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LB",  label: "LI",  x: 15, y: 25 },
    { id: "CB1", label: "DFC", x: 38, y: 20 },
    { id: "CB2", label: "DFC", x: 62, y: 20 },
    { id: "RB",  label: "LD",  x: 85, y: 25 },
    { id: "CM1", label: "MC",  x: 30, y: 50 },
    { id: "CM2", label: "MC",  x: 50, y: 45 },
    { id: "CM3", label: "MC",  x: 70, y: 50 },
    { id: "LW",  label: "EI",  x: 15, y: 78 },
    { id: "ST",  label: "DC",  x: 50, y: 85 },
    { id: "RW",  label: "ED",  x: 85, y: 78 }
  ],

  "4-2-3-1": [
    { id: "GK",   label: "POR", x: 50, y: 5  },
    { id: "LB",   label: "LI",  x: 15, y: 22 },
    { id: "CB1",  label: "DFC", x: 38, y: 18 },
    { id: "CB2",  label: "DFC", x: 62, y: 18 },
    { id: "RB",   label: "LD",  x: 85, y: 22 },
    { id: "CDM1", label: "MCD", x: 38, y: 38 },
    { id: "CDM2", label: "MCD", x: 62, y: 38 },
    { id: "LW",   label: "EI",  x: 15, y: 62 },
    { id: "CAM",  label: "MCO", x: 50, y: 60 },
    { id: "RW",   label: "ED",  x: 85, y: 62 },
    { id: "ST",   label: "DC",  x: 50, y: 88 }
  ],

  "4-1-4-1": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LB",  label: "LI",  x: 15, y: 22 },
    { id: "CB1", label: "DFC", x: 38, y: 18 },
    { id: "CB2", label: "DFC", x: 62, y: 18 },
    { id: "RB",  label: "LD",  x: 85, y: 22 },
    { id: "CDM", label: "MCD", x: 50, y: 35 },
    { id: "LM",  label: "MI",  x: 15, y: 55 },
    { id: "CM1", label: "MC",  x: 38, y: 55 },
    { id: "CM2", label: "MC",  x: 62, y: 55 },
    { id: "RM",  label: "MD",  x: 85, y: 55 },
    { id: "ST",  label: "DC",  x: 50, y: 85 }
  ],

  "3-5-2": [
    { id: "GK",   label: "POR", x: 50, y: 5  },
    { id: "CB1",  label: "DFC", x: 30, y: 20 },
    { id: "CB2",  label: "DFC", x: 50, y: 15 },
    { id: "CB3",  label: "DFC", x: 70, y: 20 },
    { id: "LWB",  label: "CI",  x: 10, y: 45 },
    { id: "CM1",  label: "MC",  x: 35, y: 45 },
    { id: "CM2",  label: "MC",  x: 50, y: 42 },
    { id: "CM3",  label: "MC",  x: 65, y: 45 },
    { id: "RWB",  label: "CD",  x: 90, y: 45 },
    { id: "ST1",  label: "DC",  x: 40, y: 85 },
    { id: "ST2",  label: "DC",  x: 60, y: 85 }
  ],

  "3-4-3": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "CB1", label: "DFC", x: 30, y: 20 },
    { id: "CB2", label: "DFC", x: 50, y: 15 },
    { id: "CB3", label: "DFC", x: 70, y: 20 },
    { id: "LM",  label: "MI",  x: 15, y: 50 },
    { id: "CM1", label: "MC",  x: 38, y: 48 },
    { id: "CM2", label: "MC",  x: 62, y: 48 },
    { id: "RM",  label: "MD",  x: 85, y: 50 },
    { id: "LW",  label: "EI",  x: 20, y: 82 },
    { id: "ST",  label: "DC",  x: 50, y: 88 },
    { id: "RW",  label: "ED",  x: 80, y: 82 }
  ],

  "5-3-2": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LWB", label: "CI",  x: 10, y: 25 },
    { id: "CB1", label: "DFC", x: 30, y: 18 },
    { id: "CB2", label: "DFC", x: 50, y: 15 },
    { id: "CB3", label: "DFC", x: 70, y: 18 },
    { id: "RWB", label: "CD",  x: 90, y: 25 },
    { id: "CM1", label: "MC",  x: 30, y: 50 },
    { id: "CM2", label: "MC",  x: 50, y: 45 },
    { id: "CM3", label: "MC",  x: 70, y: 50 },
    { id: "ST1", label: "DC",  x: 40, y: 85 },
    { id: "ST2", label: "DC",  x: 60, y: 85 }
  ],

  "5-4-1": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LWB", label: "CI",  x: 10, y: 25 },
    { id: "CB1", label: "DFC", x: 30, y: 18 },
    { id: "CB2", label: "DFC", x: 50, y: 15 },
    { id: "CB3", label: "DFC", x: 70, y: 18 },
    { id: "RWB", label: "CD",  x: 90, y: 25 },
    { id: "LM",  label: "MI",  x: 20, y: 52 },
    { id: "CM1", label: "MC",  x: 40, y: 48 },
    { id: "CM2", label: "MC",  x: 60, y: 48 },
    { id: "RM",  label: "MD",  x: 80, y: 52 },
    { id: "ST",  label: "DC",  x: 50, y: 88 }
  ],

  "4-5-1": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LB",  label: "LI",  x: 15, y: 22 },
    { id: "CB1", label: "DFC", x: 38, y: 18 },
    { id: "CB2", label: "DFC", x: 62, y: 18 },
    { id: "RB",  label: "LD",  x: 85, y: 22 },
    { id: "LM",  label: "MI",  x: 10, y: 50 },
    { id: "CM1", label: "MC",  x: 32, y: 48 },
    { id: "CM2", label: "MC",  x: 50, y: 45 },
    { id: "CM3", label: "MC",  x: 68, y: 48 },
    { id: "RM",  label: "MD",  x: 90, y: 50 },
    { id: "ST",  label: "DC",  x: 50, y: 85 }
  ],

  "4-4-1-1": [
    { id: "GK",  label: "POR", x: 50, y: 5  },
    { id: "LB",  label: "LI",  x: 15, y: 22 },
    { id: "CB1", label: "DFC", x: 38, y: 18 },
    { id: "CB2", label: "DFC", x: 62, y: 18 },
    { id: "RB",  label: "LD",  x: 85, y: 22 },
    { id: "LM",  label: "MI",  x: 15, y: 50 },
    { id: "CM1", label: "MC",  x: 38, y: 48 },
    { id: "CM2", label: "MC",  x: 62, y: 48 },
    { id: "RM",  label: "MD",  x: 85, y: 50 },
    { id: "SS",  label: "SD",  x: 50, y: 68 },
    { id: "ST",  label: "DC",  x: 50, y: 88 }
  ],

  "3-4-2-1": [
    { id: "GK",   label: "POR", x: 50, y: 5  },
    { id: "CB1",  label: "DFC", x: 30, y: 20 },
    { id: "CB2",  label: "DFC", x: 50, y: 15 },
    { id: "CB3",  label: "DFC", x: 70, y: 20 },
    { id: "LM",   label: "MI",  x: 15, y: 50 },
    { id: "CM1",  label: "MC",  x: 38, y: 48 },
    { id: "CM2",  label: "MC",  x: 62, y: 48 },
    { id: "RM",   label: "MD",  x: 85, y: 50 },
    { id: "CAM1", label: "MCO", x: 38, y: 68 },
    { id: "CAM2", label: "MCO", x: 62, y: 68 },
    { id: "ST",   label: "DC",  x: 50, y: 88 }
  ],

  "4-2-4": [
    { id: "GK",   label: "POR", x: 50, y: 5  },
    { id: "LB",   label: "LI",  x: 15, y: 22 },
    { id: "CB1",  label: "DFC", x: 38, y: 18 },
    { id: "CB2",  label: "DFC", x: 62, y: 18 },
    { id: "RB",   label: "LD",  x: 85, y: 22 },
    { id: "CM1",  label: "MC",  x: 38, y: 45 },
    { id: "CM2",  label: "MC",  x: 62, y: 45 },
    { id: "LW",   label: "EI",  x: 15, y: 80 },
    { id: "ST1",  label: "DC",  x: 40, y: 88 },
    { id: "ST2",  label: "DC",  x: 60, y: 88 },
    { id: "RW",   label: "ED",  x: 85, y: 80 }
  ]
};

function getFormationNames() {
  return Object.keys(FORMATIONS);
}
