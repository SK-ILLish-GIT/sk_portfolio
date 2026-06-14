import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  size: 0.38,
  color: '#3a8f3e',
} as const;

export interface BushProps extends PlacementProps {
  size?: number;
  color?: string;
  rotationY?: number;
}

/** Small low-poly shrub — icosahedron blob grounded on the grass. */
export function Bush({ size = DEFAULTS.size, color = DEFAULTS.color, rotationY = 0, x, y, z, position }: BushProps) {
  const [px, py, pz] = resolvePosition({ x, y, z, position });
  return (
    <mesh castShadow position={[px, py + size * 0.9, pz]} rotation={[0, rotationY, 0]}>
      <icosahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} flatShading roughness={1} />
    </mesh>
  );
}
