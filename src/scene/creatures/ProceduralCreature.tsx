import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useCreatureMotion } from '../../hooks/useCreatureMotion';
import { CREATURE_ENTRY } from '../../config/creature';
import type { Phase } from '../../config/intro';

/** Built-in low-poly guide creature (fallback when no GLB model is selected). */
export default function ProceduralCreature({ phase, accent }: { phase: Phase; accent: string }) {
  const body = useRef<THREE.Group>(null);
  const wingL = useRef<THREE.Group>(null);
  const wingR = useRef<THREE.Group>(null);

  useCreatureMotion(body, phase);

  useFrame((state) => {
    const flap = Math.sin(state.clock.getElapsedTime() * 11) * 0.6;
    if (wingL.current) wingL.current.rotation.z = 0.25 + flap;
    if (wingR.current) wingR.current.rotation.z = -0.25 - flap;
  });

  return (
    <group ref={body} scale={0.55} position={CREATURE_ENTRY}>
      <mesh castShadow scale={[0.6, 0.5, 1.5]}>
        <octahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color="#26303f" flatShading roughness={0.8} />
      </mesh>
      <group ref={wingL} position={[0.12, 0.05, 0]}>
        <mesh castShadow position={[0.85, 0, 0]}>
          <coneGeometry args={[0.28, 1.7, 4]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} flatShading />
        </mesh>
      </group>
      <group ref={wingR} position={[-0.12, 0.05, 0]}>
        <mesh castShadow position={[-0.85, 0, 0]} rotation={[0, Math.PI, 0]}>
          <coneGeometry args={[0.28, 1.7, 4]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.25} flatShading />
        </mesh>
      </group>
    </group>
  );
}
