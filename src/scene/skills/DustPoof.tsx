import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Vec3 } from '../../types/three';

const LIFE = 0.6; // seconds
const PUFFS: Vec3[] = [
  [0, 0, 0],
  [0.18, 0.1, 0.05],
  [-0.15, 0.08, -0.06],
  [0.05, 0.16, -0.1],
];

/** A short-lived dust burst that expands + fades, then calls `onDone`. */
export function DustPoof({ position, onDone }: { position: Vec3; onDone: () => void }) {
  const group = useRef<THREE.Group>(null);
  const born = useRef(performance.now());
  const mats = useRef<(THREE.MeshStandardMaterial | null)[]>([]);

  useFrame(() => {
    const t = (performance.now() - born.current) / 1000 / LIFE;
    if (t >= 1) {
      onDone();
      return;
    }
    if (group.current) group.current.scale.setScalar(0.4 + t * 1.5);
    mats.current.forEach((m) => {
      if (m) m.opacity = (1 - t) * 0.7;
    });
  });

  return (
    <group ref={group} position={position}>
      {PUFFS.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.16, 6, 6]} />
          <meshStandardMaterial
            ref={(el) => {
              mats.current[i] = el;
            }}
            color="#d9cfbf"
            transparent
            opacity={0.7}
            depthWrite={false}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}
