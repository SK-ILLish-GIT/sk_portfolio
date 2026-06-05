// ============================================================================
// Guide-creature (stork) flight tuning: entry, idle orbit, and scroll-follow.
// ============================================================================

import type { Vec3 } from '../types/three';

/** Off-screen point the creature glides in from (upper-left, behind fog). */
export const CREATURE_ENTRY: Vec3 = [-14, 9.5, 24];

/** Continuous circle the creature flies around the welcome island. */
export const ORBIT = {
  radius: 6.2,
  height: 3.9,
  speed: 0.32,
  /** Where on the circle the creature joins after gliding in (PI = left). */
  entryAngle: Math.PI,
  /** Vertical bob amplitude + frequency. */
  bobAmplitude: 0.35,
  bobSpeed: 0.65,
  /** Look-ahead angle so the model faces its travel direction. */
  lookAhead: 0.3,
  bankAmount: 0.2,
} as const;

export const FOLLOW = {
  /** Smoothing while orbiting during intro vs. live. */
  orbitLerpIntro: 0.12,
  orbitLerpLive: 0.045,
  /** Below this scroll offset the creature stays in its welcome orbit. */
  orbitThreshold: 0.015,
  /** Offset from the targeted island while flying between stations. */
  offset: { sway: 1.4, swaySpeed: 0.8, y: 3.2, z: 4.5 },
  travelLerp: 0.04,
  bankGain: 2.5,
  bankLerp: 0.12,
} as const;
