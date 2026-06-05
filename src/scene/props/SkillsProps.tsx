import { useMemo } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import { skillGroups } from '../../data/portfolio';

/** A ring of floating cubes — one per skill group. */
export default function SkillsProps({ accent }: { accent: string }) {
  const cubes = useMemo(() => {
    return skillGroups.map((_, i) => {
      const angle = (i / skillGroups.length) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 1.7,
        z: Math.sin(angle) * 1.7,
        y: 1.2 + (i % 3) * 0.5,
        s: 0.55,
      };
    });
  }, []);

  return (
    <group>
      {cubes.map((c, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={1.4} rotationIntensity={1.2}>
          <mesh castShadow position={[c.x, c.y, c.z]}>
            <boxGeometry args={[c.s, c.s, c.s]} />
            <meshStandardMaterial
              color={new THREE.Color(accent).offsetHSL((i * 0.06) % 1, 0, 0)}
              flatShading
              metalness={0.1}
              roughness={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}
