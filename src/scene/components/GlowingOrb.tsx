import { Float } from '@react-three/drei';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  radius: 0.4,
  emissiveIntensity: 0.5,
  floatSpeed: 3,
  floatIntensity: 1.4,
} as const;

export interface GlowingOrbProps extends PlacementProps, AccentProps {
  radius?: number;
  /** When true, wraps the orb in a `<Float>` for gentle bobbing. */
  floating?: boolean;
  floatSpeed?: number;
  floatIntensity?: number;
}

/** Emissive icosahedron — optionally floats in place. */
export function GlowingOrb({
  accent,
  radius = DEFAULTS.radius,
  emissiveIntensity = DEFAULTS.emissiveIntensity,
  floating = false,
  floatSpeed = DEFAULTS.floatSpeed,
  floatIntensity = DEFAULTS.floatIntensity,
  ...placement
}: GlowingOrbProps) {
  const orb = (
    <mesh position={floating ? [0, 0, 0] : resolvePosition(placement)}>
      <icosahedronGeometry args={[radius, 0]} />
      <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={emissiveIntensity} flatShading />
    </mesh>
  );

  if (!floating) return orb;

  return (
    <group position={resolvePosition(placement)}>
      <Float speed={floatSpeed} floatIntensity={floatIntensity}>
        {orb}
      </Float>
    </group>
  );
}
