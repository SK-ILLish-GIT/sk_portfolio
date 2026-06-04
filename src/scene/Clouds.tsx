import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stations } from '../data/portfolio';

/** Low-poly drifting clouds scattered through the scene for atmosphere. */
export default function Clouds() {
  const group = useRef<THREE.Group>(null);

  const puffs = useMemo(() => {
    const rng = mulberry32(42);
    const minZ = Math.min(...stations.map((s) => s.position[2])) - 10;
    const list = [];
    for (let i = 0; i < 22; i++) {
      const z = rng() * (minZ - 10) + 5;
      list.push({
        x: (rng() - 0.5) * 40,
        y: (rng() - 0.5) * 14,
        z,
        s: 1 + rng() * 2,
        speed: 0.2 + rng() * 0.4,
      });
    }
    return list;
  }, []);

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.children.forEach((c, i) => {
      c.position.x += puffs[i].speed * delta;
      if (c.position.x > 24) c.position.x = -24;
    });
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]} scale={p.s}>
          <Puff />
        </group>
      ))}
    </group>
  );
}

function Puff() {
  return (
    <group>
      {[
        [0, 0, 0, 1],
        [0.8, -0.1, 0, 0.7],
        [-0.8, -0.1, 0.1, 0.7],
        [0.3, 0.3, -0.2, 0.6],
      ].map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[s, 0]} />
          <meshStandardMaterial color="#ffffff" flatShading roughness={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
