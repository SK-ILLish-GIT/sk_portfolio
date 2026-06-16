// ============================================================================
// Sea voyage tuning — the ocean surface, the boat, and the route between
// islands. Wave *shape* lives in src/lib/waves.ts (shared by mesh + boat).
// ============================================================================

export const OCEAN = {
  /** Plane width (x); length + center are derived from the island spread.
   *  Sized so every edge sits well beyond the fog distance — the water fades to
   *  the sky color before the edge, so the mesh seam is never visible. */
  width: 460,
  segmentsX: 110,
  segmentsZ: 150,
  /** Margin added beyond the island span (each end) so the z-edges stay fogged. */
  margin: 340,
  surfaceColor: '#175a86',
  deepColor: '#0a3a5a',
  /** Cellular ripple density (larger = smaller, finer cells). */
  cellScale: 1.0,
  /** How fast the ripple/caustic pattern drifts (lower = calmer). */
  rippleSpeed: 0.06,
} as const;

export const BOAT = {
  /** Idle rock/pitch applied to the boat model. */
  rollAmp: 0.06,
  rollSpeed: 1.3,
  pitchAmp: 0.045,
  pitchSpeed: 1.05,
} as const;

// ----------------------------------------------------------------------------
// Free-roam boat physics (Rapier). The hull is a dynamic body that only yaws
// (pitch/roll are locked for stability and faked visually); a buoyancy spring
// keeps it riding the swell, thrust drives it, and water drag damps it.
// ----------------------------------------------------------------------------
export const BOAT_PHYSICS = {
  mass: 6,
  /** Forward thrust impulse per second at full throttle (W); reverse is weaker.
   *  Cranked up for dev — dial back before release. */
  thrust: 320,
  reverseFactor: 0.65,
  /** Yaw torque impulse per second (A/D). */
  turnTorque: 13,
  /** Water drag. */
  linearDamping: 1.4,
  angularDamping: 2.4,
  /** Explore mode ramps damping up to brake the boat quickly. */
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
