import type { Vec3 } from '../types/three';

// ============================================================================
// Hero island GLB models — paths, scale, facing, and animation clip patterns.
// Assets: Quaternius CC0 (platformer character + animated animal).
// ============================================================================

export const HERO_LAYOUT = {
  /** Desk setup on the right edge of the island, facing out to the open sea (+X). */
  workspace: { x: 4.0, z: 0.5 },
  bubble: { x: 0.1, y: 3.5, z: 1.05 },
  banner: { z: -3.4 },
  pet: { x: -1.6, z: 1.4 },
  sparkles: { y: 3.0, z: 1.0 },
  nameStone: { x: -2.2, z: -2.6, rotationY: 0.35 },
  mailbox: { x: -2.8, z: 2.2 },
  dockSign: { x: 0, z: 2.8, rotationY: Math.PI },
  books: { x: 2.6, z: -0.8, rotationY: -0.5 },
  butterflies: { y: 0, z: 0 },
  ropeFence: [
    { x: -4.2, z: -1.5, rotationY: 0.9, length: 2.8 },
    { x: 4.0, z: -0.5, rotationY: -0.7, length: 2.6 },
    { x: 0.5, z: -3.8, rotationY: 0, length: 3.0 },
  ],
} as const;

export const HERO_BOOK_COLORS = ['#ffd166', '#06d6a0', '#4cc9f0', '#b5179e'] as const;

export const HERO_AVATAR = {
  path: '/models/hero-avatar.glb',
  targetSize: 1.58,
  /** Quaternius platformer character faces +Z by default (toward the camera). */
  faceYaw: 0,
  positionOffset: [0, 0, 0] as Vec3,
  idleClip: /CharacterArmature\|Idle$/,
  waveClip: /CharacterArmature\|Wave$/,
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

export const HERO_PET = {
  path: '/models/hero-pet.glb',
  targetSize: 0.62,
  /** Turn inward toward the avatar and camera. */
  faceYaw: 0.55,
  positionOffset: [0, 0, 0] as Vec3,
  /** Quaternius ShibaInu idle — swap GLB for Cat.glb from Ultimate Animated Animals if preferred. */
  idleClip: /AnimalArmature\|Idle_2$/,
} as const;
