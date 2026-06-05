import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  color: '#dee2e6',
  radius: 0.12,
  height: 1.4,
  segments: 8,
} as const;

export interface ColumnProps extends PlacementProps {
  color?: string;
  radius?: number;
  height?: number;
}

/** Simple cylindrical pillar (temple / arch support). */
export function Column({
  color = DEFAULTS.color,
  radius = DEFAULTS.radius,
  height = DEFAULTS.height,
  ...placement
}: ColumnProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius, height, DEFAULTS.segments]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );
}
