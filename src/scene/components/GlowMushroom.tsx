import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  height: 1,
  stemColor: '#e8f5e9',
  emissiveIntensity: 0.55,
  capSegments: 8,
  stemSegments: 6,
} as const;

export interface GlowMushroomProps extends PlacementProps, AccentProps {
  height?: number;
  stemColor?: string;
}

/** Glowing cap mushroom — accent color drives cap + emissive. */
export function GlowMushroom({
  accent,
  height = DEFAULTS.height,
  stemColor = DEFAULTS.stemColor,
  emissiveIntensity = DEFAULTS.emissiveIntensity,
  ...placement
}: GlowMushroomProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, 0.22 * height, 0]}>
        <cylinderGeometry args={[0.05 * height, 0.07 * height, 0.45 * height, DEFAULTS.stemSegments]} />
        <meshStandardMaterial color={stemColor} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.52 * height, 0]}>
        <sphereGeometry args={[0.18 * height, DEFAULTS.capSegments, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={emissiveIntensity} flatShading />
      </mesh>
    </group>
  );
}
