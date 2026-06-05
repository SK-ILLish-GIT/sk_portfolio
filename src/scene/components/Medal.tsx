import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  metalness: 0.6,
  roughness: 0.3,
  ringMetalness: 0.4,
  ringRoughness: 0.4,
  ringColor: '#ffffff',
  diskSegments: 12,
  ringSegments: 16,
} as const;

export interface MedalProps extends PlacementProps, AccentProps {
  metalness?: number;
  roughness?: number;
  ringColor?: string;
}

/** Flat accent disk with a white torus ring — achievement medal. */
export function Medal({
  accent,
  metalness = DEFAULTS.metalness,
  roughness = DEFAULTS.roughness,
  ringColor = DEFAULTS.ringColor,
  ...placement
}: MedalProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.1, DEFAULTS.diskSegments]} />
        <meshStandardMaterial color={accent} metalness={metalness} roughness={roughness} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.06]}>
        <torusGeometry args={[0.22, 0.06, 8, DEFAULTS.ringSegments]} />
        <meshStandardMaterial color={ringColor} metalness={DEFAULTS.ringMetalness} roughness={DEFAULTS.ringRoughness} />
      </mesh>
    </group>
  );
}
