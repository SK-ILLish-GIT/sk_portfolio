import { useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { mulberry32 } from '../lib/prng';
import { ISLAND } from '../config/scene';
import type { Vec3 } from '../types/three';

interface IslandProps {
  position: Vec3;
  accent: string;
  radius?: number;
  seed?: number;
  children?: ReactNode;
}

/**
 * A reusable low-poly floating island: a flat-shaded grass disc on top of a
 * rocky cone underside, with a few procedurally scattered bushes/rocks.
 * Knows nothing about content — props are placed on top via `children`.
 */
export default function Island({ position, accent, radius = ISLAND.defaultRadius, seed = 1, children }: IslandProps) {
  const bushes = useMemo(() => {
    const rng = mulberry32(Math.floor(seed * 9973) + 7);
    const count = 5;
    return Array.from({ length: count }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = radius * (0.4 + rng() * 0.5);
      const s = 0.35 + rng() * 0.5;
      return {
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        s,
        rocky: rng() > 0.6,
      };
    });
  }, [radius, seed]);

  const grass = useMemo(() => new THREE.Color(accent).lerp(new THREE.Color('#7bdcb5'), 0.55), [accent]);

  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.6} floatingRange={[-0.25, 0.25]}>
      <group position={position}>
        {/* grass top */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[radius, radius * 0.92, 0.9, 9]} />
          <meshStandardMaterial color={grass} flatShading roughness={0.95} />
        </mesh>
        {/* soil ring */}
        <mesh position={[0, -0.7, 0]}>
          <cylinderGeometry args={[radius * 0.92, radius * 0.62, 0.9, 9]} />
          <meshStandardMaterial color={'#7a5230'} flatShading roughness={1} />
        </mesh>
        {/* rocky underside */}
        <mesh castShadow position={[0, -2.6, 0]}>
          <coneGeometry args={[radius * 0.62, 3.4, 8]} />
          <meshStandardMaterial color={'#5c3d22'} flatShading roughness={1} />
        </mesh>

        {/* scattered bushes / rocks */}
        {bushes.map((b, i) => (
          <mesh key={i} castShadow position={[b.x, 0.5 + b.s * 0.4, b.z]}>
            <icosahedronGeometry args={[b.s, 0]} />
            <meshStandardMaterial
              color={b.rocky ? '#9aa0a6' : new THREE.Color(grass).offsetHSL(0, 0, -0.08)}
              flatShading
              roughness={1}
            />
          </mesh>
        ))}

        {/* station-specific props sit on the grass */}
        <group position={[0, 0.45, 0]}>{children}</group>
      </group>
    </Float>
  );
}
