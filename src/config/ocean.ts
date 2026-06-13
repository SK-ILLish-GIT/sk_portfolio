// ============================================================================
// Sea voyage tuning — the ocean surface, the boat, and the route between
// islands. Wave *shape* lives in src/lib/waves.ts (shared by mesh + boat).
// ============================================================================

export const OCEAN = {
  /** Plane width (x); length + center are derived from the island spread. */
  width: 320,
  segmentsX: 96,
  segmentsZ: 120,
  surfaceColor: '#2f97cf',
  deepColor: '#1668a0',
} as const;

export const VOYAGE = {
  /** How far in front of each island (toward the camera) the boat floats —
   *  beyond the beach radius so it sits in open water, not on the sand. */
  frontZ: 7.5,
  /** Smoothing for the boat's heading as it turns between islands. */
  headingLerp: 0.05,
} as const;

export const BOAT = {
  scale: 1,
  /** Wave bob coupling + idle rock/pitch. */
  bobGain: 1,
  rollAmp: 0.06,
  rollSpeed: 1.3,
  pitchAmp: 0.045,
  pitchSpeed: 1.05,
  /** Extra roll when turning into a new heading. */
  bankGain: 1.6,
  bankLerp: 0.06,
} as const;

// ----------------------------------------------------------------------------
// Free-roam boat physics (Rapier). The hull is a dynamic body that only yaws
// (pitch/roll are locked for stability and faked visually); a buoyancy spring
// keeps it riding the swell, thrust drives it, and water drag damps it.
// ----------------------------------------------------------------------------
export const BOAT_PHYSICS = {
  mass: 6,
  /** Forward thrust impulse per second at full throttle (W); reverse is weaker. */
  thrust: 34,
  reverseFactor: 0.45,
  /** Yaw torque impulse per second (A/D). */
  turnTorque: 13,
  /** Water drag. */
  linearDamping: 1.4,
  angularDamping: 2.4,
  /** Anchor (Space) ramps damping up to brake quickly. */
  anchorDamping: 6,
  /** Buoyancy spring toward the wave surface: stiffness k, damping c. */
  buoyancyK: 60,
  buoyancyC: 14,
  /** Hull rides this far above the sampled wave height (waterline offset). */
  floatLine: 0.35,
  /** Speed (m/s) used to normalize visual lean/bank. */
  refSpeed: 6,
  /** Soft circular bound — beyond this from the route, nudge the boat back. */
  boundsPull: 10,
  hull: { halfX: 0.7, halfY: 0.45, halfZ: 1.5 },
  /** Spawn out in front of the hero island (clear of its collider), facing it. */
  spawn: [0, 0.35, 12] as [number, number, number],
  spawnYaw: Math.PI,
  /** Extra distance beyond an island's shoreline that still counts as "docked". */
  dockRange: 5,
} as const;
