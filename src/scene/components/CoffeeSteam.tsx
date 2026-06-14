import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  count: 4,
  color: '#e8e8f0',
} as const;

export interface CoffeeSteamProps extends PlacementProps {
  count?: number;
}

/** Subtle rising steam wisps above a mug — hoisted refs, no per-frame allocs. */
export function CoffeeSteam({ count = DEFAULTS.count, ...placement }: CoffeeSteamProps) {
  const group = useRef<THREE.Group>(null);
  const offsets = useRef(
    Array.from({ length: count }, (_, i) => ({
      phase: i * 1.7,
      x: (i - count / 2) * 0.04,
      z: ((i * 0.31) % 1) * 0.03 - 0.015,
    })),
  );

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const o = offsets.current[i];
      if (!o) return;
      const rise = ((t * 0.55 + o.phase) % 1.2) / 1.2;
      child.position.y = rise * 0.22;
      child.position.x = o.x + Math.sin(t * 2 + o.phase) * 0.015;
      child.position.z = o.z + Math.cos(t * 1.6 + o.phase) * 0.012;
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = (1 - rise) * 0.35;
    });
  });

  return (
    <group ref={group} position={resolvePosition(placement)}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i}>
          <sphereGeometry args={[0.018 + (i % 2) * 0.006, 4, 4]} />
          <meshStandardMaterial color={DEFAULTS.color} transparent opacity={0.25} flatShading depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
}
