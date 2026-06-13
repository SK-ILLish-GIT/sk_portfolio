// ============================================================================
// Scene tuning constants — camera, renderer, lights, fog, scroll, islands.
// Adjust the *feel* of the 3D world here instead of hunting through components.
// ============================================================================

import type { Vec3 } from '../types/three';

export const RENDERER = {
  /** Device-pixel-ratio clamp: [min, max]. Higher max = sharper but heavier. */
  dpr: [1, 1.8] as [number, number],
} as const;

export const CAMERA = {
  fov: 58,
  near: 0.1,
  far: 220,
  position: [0, 3, 12] as Vec3,
} as const;

export const FOG = {
  /** Sea-horizon haze: distant islands + ocean fade into a soft blue. */
  color: '#bfe3f2',
  near: 26,
  far: 105,
} as const;

export const LIGHTS = {
  hemisphere: { sky: '#eaf6ff', ground: '#caa472', intensity: 0.9 },
  ambient: { intensity: 0.35 },
  directional: {
    position: [8, 16, 10] as Vec3,
    intensity: 1.6,
    shadowMapSize: 1024,
    shadowCameraFar: 60,
    /** Symmetric orthographic shadow frustum half-extent. */
    shadowCameraExtent: 20,
  },
  /** Pink key light that blooms over the hero island during the intro. */
  heroAccent: {
    position: [0, 4.5, 2] as Vec3,
    introIntensity: 2.2,
    liveIntensity: 1.1,
    distance: 14,
  },
} as const;

export const SCROLL = {
  damping: 0.28,
} as const;

export const ISLAND = {
  heroRadius: 7.2,
  defaultRadius: 5.4,
} as const;

// ----------------------------------------------------------------------------
// Camera rig: a boat-riding chase cam. Sits behind + above the sailing boat
// (which floats in front of each island) and keeps its gaze on the island.
// ----------------------------------------------------------------------------
export const CAMERA_RIG = {
  /** Where the camera starts, out over the open sea, before the intro fly-in. */
  introFrom: [5, 18, 42] as Vec3,
  /** Chase offset from the boat: height, distance behind, and look-ahead distance.
   *  Pulled back + raised for a wide, cinematic open-ocean view. */
  chase: { up: 8.5, back: 16, lookAhead: 9 },
  /** Where the camera looks (ahead of the boat) raised a touch. */
  lookOffset: { y: 1.6 },
  /** Gentle camera bob so the horizon rocks with the swell (kept subtle). */
  bobGain: 0.18,
  parallax: { x: 1.2, y: 0.6 },
  followLerp: 0.1,
  introLerp: 0.2,
} as const;

// ----------------------------------------------------------------------------
// Clouds: drifting low-poly puffs in the sky above the sea. With a literal
// ocean below, all puffs now sit in the high deck (no low band underwater).
// ----------------------------------------------------------------------------
export const CLOUDS = {
  count: 24,
  seed: 42,
  spreadX: 44,
  /** No low cloud band over open water — keep them all up in the sky. */
  lowFraction: 0,
  lowY: -8,
  lowYRange: 7,
  /** High deck: bottoms at highY, extending upward by highYRange. */
  highY: 10,
  highYRange: 8,
  minScale: 1,
  scaleRange: 2,
  minSpeed: 0.2,
  speedRange: 0.4,
  wrapX: 24,
  /** Gentle vertical bob so each layer feels alive (per-puff phase). */
  bobAmplitude: 0.5,
  bobSpeed: 0.25,
} as const;
