// The boat's sea route between islands. Pure + framework-free: both the camera
// rig and the boat call these with the current scroll offset so they always
// agree on where the voyage is, without sharing mutable state.

import { clamp01, smooth } from './math';

type Vec3 = readonly [number, number, number];

/** Minimal write target — a THREE.Vector3 satisfies this via `.set`. */
export interface Settable {
  set(x: number, y: number, z: number): void;
}

/** Which segment of the route `offset` (0..1) falls on, plus the eased fraction. */
function segmentAt(count: number, offset: number) {
  const p = clamp01(offset) * (count - 1);
  const i = Math.min(Math.floor(p), count - 2);
  return { i, f: smooth(p - i) };
}

/**
 * Boat position along the route: island X/Z interpolated, pulled `frontZ`
 * toward the camera (+Z) so the boat floats in the water in front of each
 * island. Y is sea level (0) — wave bob is layered on by the caller.
 */
export function voyagePosition(points: readonly Vec3[], offset: number, frontZ: number, out: Settable) {
  const { i, f } = segmentAt(points.length, offset);
  const a = points[i];
  const b = points[i + 1] ?? a;
  out.set(a[0] + (b[0] - a[0]) * f, 0, a[2] + (b[2] - a[2]) * f + frontZ);
}

/** Center of the island currently being visited/approached (for the camera gaze). */
export function voyageIslandCenter(points: readonly Vec3[], offset: number, out: Settable) {
  const { i, f } = segmentAt(points.length, offset);
  const a = points[i];
  const b = points[i + 1] ?? a;
  out.set(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f);
}

/** Boat yaw (radians) so a +Z-facing model points along its travel direction. */
export function voyageHeading(points: readonly Vec3[], offset: number): number {
  const { i } = segmentAt(points.length, offset);
  const a = points[i];
  const b = points[i + 1] ?? a;
  const dx = b[0] - a[0];
  const dz = b[2] - a[2];
  if (Math.abs(dx) < 1e-4 && Math.abs(dz) < 1e-4) return 0;
  return Math.atan2(dx, dz);
}
