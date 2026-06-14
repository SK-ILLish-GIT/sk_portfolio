import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  count: 4,
  radius: 1.8,
  height: 1.4,
} as const;

export interface ButterfliesProps extends PlacementProps, AccentProps {
  count?: number;
  radius?: number;
  height?: number;
}

/** Low-poly butterflies orbiting a point with gentle wing flap. */
export function Butterflies({
  accent,
  count = DEFAULTS.count,
  radius = DEFAULTS.radius,
  height = DEFAULTS.height,
  ...placement
}: ButterfliesProps) {
  const root = useRef<THREE.Group>(null);
  const wingRefs = useRef<(THREE.Mesh | null)[]>([]);
  const seeds = useRef(
    Array.from({ length: count }, (_, i) => ({
      angle: (i / count) * Math.PI * 2,
      speed: 0.35 + (i % 3) * 0.12,
      yOff: (i % 2) * 0.4,
      color: i % 2 === 0 ? accent : '#ffd166',
    })),
  );

  useFrame((state) => {
    if (!root.current) return;
    const t = state.clock.getElapsedTime();
    root.current.children.forEach((butterfly, i) => {
      const s = seeds.current[i];
      if (!s) return;
      const a = s.angle + t * s.speed;
      butterfly.position.set(
        Math.cos(a) * radius,
        height + s.yOff + Math.sin(t * 2 + i) * 0.15,
        Math.sin(a) * radius * 0.6,
      );
      butterfly.rotation.y = -a + Math.PI / 2;
      const flap = Math.sin(t * 12 + i * 2) * 0.35;
      const left = wingRefs.current[i * 2];
      const right = wingRefs.current[i * 2 + 1];
      if (left) left.rotation.z = flap;
      if (right) right.rotation.z = -flap;
    });
  });

  return (
    <group ref={root} position={resolvePosition(placement)}>
      {Array.from({ length: count }).map((_, i) => (
        <group key={i}>
          <mesh>
            <sphereGeometry args={[0.025, 4, 4]} />
            <meshStandardMaterial color="#2a2a32" flatShading />
          </mesh>
          <mesh
            ref={(el) => {
              wingRefs.current[i * 2] = el;
            }}
            position={[-0.04, 0.01, 0]}
          >
            <boxGeometry args={[0.06, 0.002, 0.08]} />
            <meshStandardMaterial
              color={seeds.current[i]?.color ?? accent}
              flatShading
              emissive={accent}
              emissiveIntensity={0.15}
            />
          </mesh>
          <mesh
            ref={(el) => {
              wingRefs.current[i * 2 + 1] = el;
            }}
            position={[0.04, 0.01, 0]}
          >
            <boxGeometry args={[0.06, 0.002, 0.08]} />
            <meshStandardMaterial
              color={seeds.current[i]?.color ?? accent}
              flatShading
              emissive={accent}
              emissiveIntensity={0.15}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
