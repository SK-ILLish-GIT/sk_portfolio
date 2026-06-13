import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stations } from '../data/portfolio';
import { CLOUDS } from '../config/scene';
import { mulberry32 } from '../lib/prng';
import { CloudPuff } from './components';

/** Low-poly drifting clouds scattered through the scene for atmosphere. */
export default function Clouds() {
  const group = useRef<THREE.Group>(null);

  const puffs = useMemo(() => {
    const rng = mulberry32(CLOUDS.seed);
    const minZ = Math.min(...stations.map((s) => s.position[2])) - 10;
    const list = [];
    for (let i = 0; i < CLOUDS.count; i++) {
      const z = rng() * (minZ - 10) + 5;
      // Keep puffs out of the island slab: low sea below, high deck above.
      const y =
        rng() < CLOUDS.lowFraction ? CLOUDS.lowY - rng() * CLOUDS.lowYRange : CLOUDS.highY + rng() * CLOUDS.highYRange;
      list.push({
        x: (rng() - 0.5) * CLOUDS.spreadX,
        y,
        z,
        s: CLOUDS.minScale + rng() * CLOUDS.scaleRange,
        speed: CLOUDS.minSpeed + rng() * CLOUDS.speedRange,
        phase: rng() * Math.PI * 2,
      });
    }
    return list;
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.children.forEach((c, i) => {
      const p = puffs[i];
      c.position.x += p.speed * delta;
      if (c.position.x > CLOUDS.wrapX) c.position.x = -CLOUDS.wrapX;
      c.position.y = p.y + Math.sin(t * CLOUDS.bobSpeed + p.phase) * CLOUDS.bobAmplitude;
    });
  });

  return (
    <group ref={group}>
      {puffs.map((p, i) => (
        <group key={i} position={[p.x, p.y, p.z]}>
          <CloudPuff scale={p.s} />
        </group>
      ))}
    </group>
  );
}
