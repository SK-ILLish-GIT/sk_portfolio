import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  height: 1,
  foliageColor: '#2f9e44',
  trunkColor: '#8a5a2b',
  trunkHeight: 0.8,
  trunkRadiusTop: 0.12,
  trunkRadiusBottom: 0.16,
  trunkSegments: 6,
  coneSegments: 7,
} as const;

export interface TreeProps extends PlacementProps {
  /** Scales the foliage cone; trunk stays fixed. */
  height?: number;
  foliageColor?: string;
  trunkColor?: string;
}

/** Low-poly pine: brown cylinder trunk + green cone foliage. */
export function Tree({
  height = DEFAULTS.height,
  foliageColor = DEFAULTS.foliageColor,
  trunkColor = DEFAULTS.trunkColor,
  ...placement
}: TreeProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry
          args={[DEFAULTS.trunkRadiusTop, DEFAULTS.trunkRadiusBottom, DEFAULTS.trunkHeight, DEFAULTS.trunkSegments]}
        />
        <meshStandardMaterial color={trunkColor} flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 0.9 + height * 0.3, 0]}>
        <coneGeometry args={[0.55 * height, 1.1 * height, DEFAULTS.coneSegments]} />
        <meshStandardMaterial color={foliageColor} flatShading roughness={1} />
      </mesh>
    </group>
  );
}
