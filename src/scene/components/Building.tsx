import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  wallColor: '#e9ecef',
  bodySize: [1.4, 1.8, 1.2] as const,
  screenEmissive: 0.5,
  roofSegments: 4,
} as const;

export interface BuildingProps extends PlacementProps, AccentProps {
  wallColor?: string;
  screenEmissive?: number;
}

/** Small low-poly house with an emissive accent screen and pyramid roof. */
export function Building({
  accent,
  wallColor = DEFAULTS.wallColor,
  screenEmissive = DEFAULTS.screenEmissive,
  ...placement
}: BuildingProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[...DEFAULTS.bodySize]} />
        <meshStandardMaterial color={wallColor} flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0.61]}>
        <boxGeometry args={[1, 0.8, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={screenEmissive} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.1, 0.7, DEFAULTS.roofSegments]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
    </group>
  );
}
