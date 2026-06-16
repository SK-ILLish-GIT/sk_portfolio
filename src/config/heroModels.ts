import type { Vec3 } from '../types/three';

// ============================================================================
// Hero island GLB models — paths, scale, facing, and animation clip patterns.
// Assets: Quaternius CC0 (platformer character + animated animal).
// ============================================================================

export const HERO_LAYOUT = {
  /** Desk setup on the right edge of the island, facing out to the open sea (+X). */
  workspace: { x: 4.0, z: 0.5 },
} as const;

// Desk-only setup (table, laptop, chair, books) — the seated man + armature were
// stripped from the source GLB. Static, no animation clip.
export const HERO_WORKSPACE = {
  path: '/models/hero-desk.glb',
  /** Largest dimension the model is fit to — bump this to scale the whole setup. */
  targetSize: 4.2,
  /** Yaw so the desk faces right toward the sea (+X). Adjust by ±Math.PI/2 to reorient. */
  faceYaw: Math.PI / 2,
  positionOffset: [0, 0, 0] as Vec3,
  /** No animation in the desk-only model; kept for the shared config shape. */
  idleClip: /Animation/,
} as const;
