import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  color: '#f1f3f5',
  topRadius: 0.7,
  bottomRadius: 0.9,
  height: 0.8,
  segments: 12,
} as const;

export interface PodiumProps extends PlacementProps {
  color?: string;
  topRadius?: number;
  bottomRadius?: number;
  height?: number;
}

/** Short tapered cylinder pedestal. */
export function Podium({
  color = DEFAULTS.color,
  topRadius = DEFAULTS.topRadius,
  bottomRadius = DEFAULTS.bottomRadius,
  height = DEFAULTS.height,
  ...placement
}: PodiumProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[topRadius, bottomRadius, height, DEFAULTS.segments]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}
