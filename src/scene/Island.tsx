import { useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { mulberry32 } from '../lib/prng';
import { ISLAND } from '../config/scene';
import { FoamRing } from './components';
import type { Vec3 } from '../types/three';

interface IslandProps {
  position: Vec3;
  accent: string;
  radius?: number;
  seed?: number;
  children?: ReactNode;
}

/**
 * A low-poly island sitting in the sea: a rocky base rising from below the
 * waterline, a sandy beach ring where the water meets land, and a flat grass
 * top that the station props stand on. Anchored at sea level (y ≈ 0) — the
 * ocean laps around it, so no floating bob.
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
    <group position={[position[0], 0, position[2]]}>
      {/* submerged rocky base anchoring the island to the seabed */}
      <mesh position={[0, -2.4, 0]}>
        <coneGeometry args={[radius * 1.05, 5.2, 9]} />
        <meshStandardMaterial color={'#6b5640'} flatShading roughness={1} />
      </mesh>
      {/* sandy beach ring meeting the waterline */}
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <cylinderGeometry args={[radius * 1.04, radius * 1.18, 0.5, 10]} />
        <meshStandardMaterial color={'#e7d39a'} flatShading roughness={1} />
      </mesh>
      {/* grass top */}
      <mesh castShadow receiveShadow position={[0, 0.55, 0]}>
        <cylinderGeometry args={[radius * 0.92, radius, 0.7, 10]} />
        <meshStandardMaterial color={grass} flatShading roughness={0.95} />
      </mesh>
      {/* foam lapping the shoreline */}
      <FoamRing radius={radius} phase={seed} />

      {/* scattered bushes / rocks */}
      {bushes.map((b, i) => (
        <mesh key={i} castShadow position={[b.x, 0.95 + b.s * 0.4, b.z]}>
          <icosahedronGeometry args={[b.s, 0]} />
          <meshStandardMaterial
            color={b.rocky ? '#9aa0a6' : new THREE.Color(grass).offsetHSL(0, 0, -0.08)}
            flatShading
            roughness={1}
          />
        </mesh>
      ))}

      {/* station-specific props sit on the grass */}
      <group position={[0, 0.9, 0]}>{children}</group>
    </group>
  );
}
