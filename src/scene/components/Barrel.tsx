import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  color: '#9c6b3f',
  bandColor: '#5d4326',
  radius: 0.32,
  height: 0.8,
} as const;

export interface BarrelProps extends PlacementProps {
  rotationY?: number;
  color?: string;
}

/** Low-poly wooden barrel — banded cylinder grounded on the grass. */
export function Barrel({ rotationY = 0, color = DEFAULTS.color, ...placement }: BarrelProps) {
  const { radius, height } = DEFAULTS;
  const [px, py, pz] = resolvePosition(placement);
  return (
    <group position={[px, py + height / 2, pz]} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius * 0.9, height, 10]} />
        <meshStandardMaterial color={color} flatShading roughness={0.9} />
      </mesh>
      {[-0.22, 0.22].map((by) => (
        <mesh key={by} position={[0, by, 0]}>
          <cylinderGeometry args={[radius * 1.03, radius * 1.03, 0.08, 10]} />
          <meshStandardMaterial color={DEFAULTS.bandColor} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
