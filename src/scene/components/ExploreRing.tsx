import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { EXPLORE } from '../../config/scene';
import { smooth } from '../../lib/math';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  y: 0.12,
  segments: 48,
  /** Ring thickness as a fraction of its radius. */
  thickness: 0.06,
} as const;

export interface ExploreRingProps extends PlacementProps, AccentProps {
  /** Outer radius of the explore zone (matches the boat's in-range distance). */
  radius: number;
  /** Boat is inside the zone — brighter and pulsing faster. */
  active?: boolean;
  /** Live boat position — the ring fades in only as the boat nears it. */
  posRef: { current: { x: number; z: number } };
}

/** A pulsing accent ring on the water marking an island's "press E to explore" zone. */
export function ExploreRing({ accent, radius, active = false, posRef, ...placement }: ExploreRingProps) {
  const ringMat = useRef<THREE.MeshBasicMaterial>(null);
  const discMat = useRef<THREE.MeshBasicMaterial>(null);
  const inner = radius * (1 - DEFAULTS.thickness);
  const [x, , z] = resolvePosition(placement);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pulse = Math.sin(t * (active ? 2.6 : 1.3));
    // Fade in by proximity: invisible past the reveal band, full at the zone edge.
    const dx = posRef.current.x - x;
    const dz = posRef.current.z - z;
    const dist = Math.hypot(dx, dz);
    const reveal = smooth(1 - (dist - radius) / EXPLORE.revealBand);
    if (ringMat.current) ringMat.current.opacity = reveal * ((active ? 0.6 : 0.32) + pulse * 0.14);
    if (discMat.current) discMat.current.opacity = reveal * ((active ? 0.14 : 0.06) + pulse * 0.03);
  });

  return (
    <group position={[x, DEFAULTS.y, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <mesh>
        <ringGeometry args={[inner, radius, DEFAULTS.segments]} />
        <meshBasicMaterial
          ref={ringMat}
          color={accent}
          transparent
          opacity={0.35}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0, -0.01]}>
        <circleGeometry args={[inner, DEFAULTS.segments]} />
        <meshBasicMaterial
          ref={discMat}
          color={accent}
          transparent
          opacity={0.08}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}
