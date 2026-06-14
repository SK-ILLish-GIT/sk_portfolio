import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  color: '#d8b24a',
  bandColor: '#b3863a',
  radius: 0.45,
  length: 0.95,
} as const;

export interface HayBaleProps extends PlacementProps {
  rotationY?: number;
  color?: string;
}

/** Low-poly hay bale — a cylinder lying on its side with twine bands. */
export function HayBale({ rotationY = 0, color = DEFAULTS.color, ...placement }: HayBaleProps) {
  const { radius, length } = DEFAULTS;
  const [px, py, pz] = resolvePosition(placement);
  return (
    <group position={[px, py + radius, pz]} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[radius, radius, length, 12]} />
        <meshStandardMaterial color={color} flatShading roughness={1} />
      </mesh>
      {[-0.2, 0.2].map((bx) => (
        <mesh key={bx} position={[bx, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[radius * 1.02, radius * 1.02, 0.06, 12]} />
          <meshStandardMaterial color={DEFAULTS.bandColor} flatShading roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
