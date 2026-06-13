import type { Vec3 } from '../types/three';

// ============================================================================
// Hero island GLB models — paths, scale, facing, and animation clip patterns.
// Assets: Quaternius CC0 (platformer character + animated animal).
// ============================================================================

export const HERO_LAYOUT = {
  avatar: { z: 1.0 },
  bubble: { x: 0.1, y: 3.5, z: 1.05 },
  banner: { z: -3.4 },
  desk: { x: 1.85, z: 0.05, rotation: [0, -0.65, 0] as Vec3 },
  pet: { x: -1.0, z: 0.8 },
  sparkles: { y: 3.0, z: 1.0 },
} as const;

export const HERO_AVATAR = {
  path: '/models/hero-avatar.glb',
  targetSize: 1.58,
  /** Quaternius platformer character faces +Z by default (toward the camera). */
  faceYaw: 0,
  positionOffset: [0, 0, 0] as Vec3,
  idleClip: /CharacterArmature\|Idle$/,
  waveClip: /CharacterArmature\|Wave$/,
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
