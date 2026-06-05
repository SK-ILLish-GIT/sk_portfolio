import type { Vec3 } from '../../types/three';

/** Optional world offset — use `position` OR `x`/`y`/`z` shorthand, not both. */
export type PlacementProps = {
  x?: number;
  y?: number;
  z?: number;
  position?: Vec3;
};

export type AccentProps = {
  accent: string;
  emissiveIntensity?: number;
};

/** Merge shorthand coords into a Vec3 for `<group position={…}>`. */
export function resolvePosition({ x = 0, y = 0, z = 0, position }: PlacementProps): Vec3 {
  return position ?? [x, y, z];
}
