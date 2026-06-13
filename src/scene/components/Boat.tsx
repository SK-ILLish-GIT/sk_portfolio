import { useMemo } from 'react';
import * as THREE from 'three';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  hullColor: '#7a4a22',
  hullDarkColor: '#5e3717',
  deckColor: '#c79a5e',
  sailColor: '#f7f1e3',
  mastColor: '#4a3526',
} as const;

export interface BoatProps extends PlacementProps, Partial<AccentProps> {
  scale?: number;
}

/** Low-poly sailboat — wooden hull, deck, mast, triangular sail, and a flag.
 *  Bow points along +Z so it can be yawed to face its travel direction. */
export function Boat({ accent = '#ff8fab', scale = 1, ...placement }: BoatProps) {
  // Triangular mainsail (right-triangle in the Y/Z plane, hugging the mast).
  const sailGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute([0, 0.05, -0.05, 0, 2.05, -0.05, 0, 0.05, 1.5], 3));
    g.computeVertexNormals();
    return g;
  }, []);

  return (
    <group position={resolvePosition(placement)} scale={scale}>
      {/* hull */}
      <mesh castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[1.15, 0.5, 2.6]} />
        <meshStandardMaterial color={DEFAULTS.hullColor} flatShading roughness={0.85} />
      </mesh>
      {/* pointed bow (diamond box rotated 45°) */}
      <mesh castShadow position={[0, 0.18, 1.5]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[0.81, 0.5, 0.81]} />
        <meshStandardMaterial color={DEFAULTS.hullDarkColor} flatShading roughness={0.85} />
      </mesh>
      {/* deck */}
      <mesh position={[0, 0.44, -0.1]}>
        <boxGeometry args={[1.0, 0.08, 2.1]} />
        <meshStandardMaterial color={DEFAULTS.deckColor} flatShading roughness={0.9} />
      </mesh>
      {/* little cabin */}
      <mesh castShadow position={[0, 0.62, -0.75]}>
        <boxGeometry args={[0.7, 0.34, 0.6]} />
        <meshStandardMaterial color={DEFAULTS.hullDarkColor} flatShading roughness={0.85} />
      </mesh>

      {/* mast */}
      <mesh castShadow position={[0, 1.4, 0.1]}>
        <cylinderGeometry args={[0.05, 0.06, 2.3, 6]} />
        <meshStandardMaterial color={DEFAULTS.mastColor} flatShading />
      </mesh>
      {/* boom */}
      <mesh position={[0, 0.62, 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 1.2, 5]} />
        <meshStandardMaterial color={DEFAULTS.mastColor} flatShading />
      </mesh>

      {/* mainsail — angled off the mast so it catches the eye (and the wind) */}
      <mesh position={[0, 0.5, 0.12]} rotation={[0, 0.5, 0]} geometry={sailGeo}>
        <meshStandardMaterial color={DEFAULTS.sailColor} flatShading side={THREE.DoubleSide} roughness={0.95} />
      </mesh>

      {/* pennant flag at the masthead */}
      <mesh position={[0.0, 2.45, 0.22]}>
        <boxGeometry args={[0.02, 0.18, 0.34]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} flatShading />
      </mesh>
    </group>
  );
}
