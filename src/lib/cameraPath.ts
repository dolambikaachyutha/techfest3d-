import * as THREE from "three";
import { SECTION, SECTION_RANGES } from "./constants";

// ============================================
// CAMERA SPLINE PATH
// Continuous CatmullRomCurve3 through 3D space
// Each section gets a cluster of control points
// ============================================

const controlPoints = [
  // BOOT (0) - Start position
  new THREE.Vector3(0, 0, 8),
  
  // HERO (1) - Core center stage
  new THREE.Vector3(0, 0.5, 6),
  new THREE.Vector3(0, 1, 4),
  
  // AI - NEURAL CITY (2) - Fly into the neural network
  new THREE.Vector3(-2, 2, 0),
  new THREE.Vector3(-4, 3, -4),
  new THREE.Vector3(-3, 2.5, -8),
  
  // ROBOTICS - ASSEMBLY LINE (3) - Sweep through the bay
  new THREE.Vector3(0, 1.5, -12),
  new THREE.Vector3(3, 2, -16),
  new THREE.Vector3(5, 1, -20),
  
  // SPACE - COSMIC TRANSIT (4) - Ascend into deep space
  new THREE.Vector3(4, 5, -24),
  new THREE.Vector3(2, 8, -28),
  new THREE.Vector3(-1, 10, -32),
  
  // QUANTUM - SUPERPOSITION (5) - Descend into abstraction
  new THREE.Vector3(-3, 6, -36),
  new THREE.Vector3(-5, 4, -40),
  new THREE.Vector3(-3, 3, -44),
  
  // SUSTAINABILITY - LIVING CITY (6) - Golden hour sweep
  new THREE.Vector3(0, 2, -48),
  new THREE.Vector3(3, 3, -52),
  new THREE.Vector3(5, 2, -56),
  
  // HUMAN INNOVATION - CONVERGENCE (7) - All colors merge
  new THREE.Vector3(2, 4, -60),
  new THREE.Vector3(0, 5, -64),
  new THREE.Vector3(-2, 3, -68),
  
  // FINALE (8) - Pull back to reveal HUD anchor
  new THREE.Vector3(0, 2, -72),
];

// Create the main camera spline
export const cameraCurve = new THREE.CatmullRomCurve3(
  controlPoints,
  false, // not closed
  "catmullrom",
  0.5 // tension
);

// ============================================
// GET CAMERA STATE AT PROGRESS
// ============================================

export interface CameraState {
  position: THREE.Vector3;
  lookAt: THREE.Vector3;
  sectionIndex: number;
  sectionProgress: number; // 0-1 within current section
}

export function getCameraState(progress: number): CameraState {
  // Clamp progress
  const p = Math.max(0, Math.min(1, progress));
  
  // Get position and tangent from curve
  const position = cameraCurve.getPointAt(p);
  const tangent = cameraCurve.getTangentAt(p);
  
  // Look ahead along the tangent for look-at target
  const lookAheadP = Math.min(1, p + 0.02);
  const lookAt = cameraCurve.getPointAt(lookAheadP);
  
  // Determine current section
  let sectionIndex = 0;
  let sectionProgress = 0;
  
  for (const [section, range] of Object.entries(SECTION_RANGES)) {
    const [start, end] = range;
    if (p >= start && p < end) {
      sectionIndex = parseInt(section);
      sectionProgress = (p - start) / (end - start);
      break;
    }
    if (p >= end) {
      sectionIndex = parseInt(section);
      sectionProgress = 1;
    }
  }
  
  return {
    position,
    lookAt,
    sectionIndex,
    sectionProgress,
  };
}

// Get camera position for a specific section center
export function getSectionCameraTarget(sectionIndex: number): number {
  const range = SECTION_RANGES[sectionIndex];
  if (!range) return 0;
  return (range[0] + range[1]) / 2;
}
