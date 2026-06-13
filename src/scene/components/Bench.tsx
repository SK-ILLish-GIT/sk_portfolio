import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  woodColor: '#9a6b3f',
  legColor: '#5c4326',
} as const;

export interface BenchProps extends PlacementProps {
  woodColor?: string;
  rotationY?: number;
}

/** Simple low-poly park bench (seat, backrest, legs). */
export function Bench({ woodColor = DEFAULTS.woodColor, rotationY = 0, ...placement }: BenchProps) {
  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 0.26, 0]}>
        <boxGeometry args={[1.1, 0.08, 0.36]} />
        <meshStandardMaterial color={woodColor} flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 0.46, -0.16]}>
        <boxGeometry args={[1.1, 0.32, 0.06]} />
        <meshStandardMaterial color={woodColor} flatShading roughness={1} />
      </mesh>
      {[-0.45, 0.45].map((x) => (
        <group key={x}>
          <mesh castShadow position={[x, 0.13, 0.13]}>
            <boxGeometry args={[0.07, 0.26, 0.07]} />
            <meshStandardMaterial color={DEFAULTS.legColor} flatShading />
          </mesh>
          <mesh castShadow position={[x, 0.13, -0.13]}>
            <boxGeometry args={[0.07, 0.26, 0.07]} />
            <meshStandardMaterial color={DEFAULTS.legColor} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}
