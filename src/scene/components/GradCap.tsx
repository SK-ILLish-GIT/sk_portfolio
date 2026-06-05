import { Float } from '@react-three/drei';
import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  color: '#222222',
  floatSpeed: 2.5,
  floatIntensity: 1,
  capSegments: 8,
} as const;

export interface GradCapProps extends PlacementProps {
  color?: string;
  floating?: boolean;
  floatSpeed?: number;
  floatIntensity?: number;
}

/** Mortarboard grad cap — flat top + cylindrical base. */
export function GradCap({
  color = DEFAULTS.color,
  floating = false,
  floatSpeed = DEFAULTS.floatSpeed,
  floatIntensity = DEFAULTS.floatIntensity,
  ...placement
}: GradCapProps) {
  const cap = (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.1, 0.9]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh position={[0, -0.18, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.3, DEFAULTS.capSegments]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  );

  if (!floating) {
    return <group position={resolvePosition(placement)}>{cap}</group>;
  }

  return (
    <group position={resolvePosition(placement)}>
      <Float speed={floatSpeed} floatIntensity={floatIntensity}>
        {cap}
      </Float>
    </group>
  );
}
