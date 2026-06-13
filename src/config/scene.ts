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
  fov: 45,
  near: 0.1,
  far: 200,
  position: [0, 3, 12] as Vec3,
} as const;

export const FOG = {
  color: '#cfe8ff',
  near: 22,
  far: 90,
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
  heroRadius: 5.8,
  defaultRadius: 4,
} as const;

// ----------------------------------------------------------------------------
// Camera rig: how the camera flies in and tracks islands on scroll.
// ----------------------------------------------------------------------------
export const CAMERA_RIG = {
  /** Where the camera starts, deep in the fog, before the intro fly-in. */
  introFrom: [2, 8, 28] as Vec3,
  /** Per-island camera anchor, derived from the island's position. */
  camOffset: { xFactor: 0.45, y: 3, z: 12 },
  lookOffset: { y: 1 },
  parallax: { x: 1.4, y: 0.8 },
  followLerp: 0.12,
  introLerp: 0.2,
} as const;

// ----------------------------------------------------------------------------
// Clouds: drifting low-poly puffs that fill the background.
// Islands occupy y ≈ -1.5…2 (bottoms down to ~-5.8, tops up to ~5.8), so puffs
// are kept in two bands — a low "sea" below and a high deck above — and never
// drift through that middle slab.
// ----------------------------------------------------------------------------
export const CLOUDS = {
  count: 26,
  seed: 42,
  spreadX: 44,
  /** Share of puffs forming the low cloud sea (rest sit in the high deck). */
  lowFraction: 0.6,
  /** Low sea: tops at lowY, extending downward by lowYRange. */
  lowY: -8,
  lowYRange: 7,
  /** High deck: bottoms at highY, extending upward by highYRange. */
  highY: 9,
  highYRange: 7,
  minScale: 1,
  scaleRange: 2,
  minSpeed: 0.2,
  speedRange: 0.4,
  wrapX: 24,
  /** Gentle vertical bob so each layer feels alive (per-puff phase). */
  bobAmplitude: 0.5,
  bobSpeed: 0.25,
} as const;
