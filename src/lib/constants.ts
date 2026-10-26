// ============================================
// TECHFEST 2027 — CONSTANTS
// ============================================

export const COLORS = {
  void: "#05060A",
  deepSlate: "#0C1220",
  signalCyan: "#4CE0D2",
  plasmaMagenta: "#FF3D8A",
  solarAmber: "#FFB347",
  quantumViolet: "#8B5CF6",
  ice: "#EAF2FF",
  iceDim: "#9AACC4",
  circuitLine: "rgba(76, 224, 210, 0.15)",
} as const;

export const SECTION_ACCENTS = {
  0: COLORS.void, // boot
  1: COLORS.signalCyan, // hero
  2: COLORS.signalCyan, // AI
  3: "#5B8DEF", // Robotics (steel-blue)
  4: "#6366F1", // Space (deep indigo)
  5: COLORS.quantumViolet, // Quantum
  6: COLORS.solarAmber, // Sustainability
  7: COLORS.ice, // Human Innovation
  8: COLORS.ice, // finale
} as const;

export const SECTION_LABELS = [
  "SYS_INIT",
  "HOME",
  "SEC_01 // ARTIFICIAL INTELLIGENCE",
  "SEC_02 // ROBOTICS",
  "SEC_03 // SPACE EXPLORATION",
  "SEC_04 // QUANTUM REALM",
  "SEC_05 // SUSTAINABILITY",
  "SEC_06 // HUMAN INNOVATION",
  "CONVERGENCE",
] as const;

// Section indices
export const SECTION = {
  BOOT: 0,
  HERO: 1,
  AI: 2,
  ROBOTICS: 3,
  SPACE: 4,
  QUANTUM: 5,
  SUSTAINABILITY: 6,
  HUMAN: 7,
  FINALE: 8,
} as const;

export const TOTAL_SECTIONS = 9;

// Camera path ranges (normalized 0-1 progress per section)
export const SECTION_RANGES: Record<number, [number, number]> = {
  [SECTION.BOOT]: [0, 0.04],
  [SECTION.HERO]: [0.04, 0.12],
  [SECTION.AI]: [0.12, 0.24],
  [SECTION.ROBOTICS]: [0.24, 0.36],
  [SECTION.SPACE]: [0.36, 0.48],
  [SECTION.QUANTUM]: [0.48, 0.58],
  [SECTION.SUSTAINABILITY]: [0.58, 0.68],
  [SECTION.HUMAN]: [0.68, 0.78],
  [SECTION.FINALE]: [0.78, 0.82],
};

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
  wide: 1536,
} as const;

// Animation timing
export const TIMING = {
  sectionFade: 1.2,
  uiReveal: 0.6,
  cameraTransition: 1.5,
  bootDuration: 5,
} as const;
