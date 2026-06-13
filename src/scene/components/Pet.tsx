import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  bodyColor: '#f4a261',
  bellyColor: '#ffe8d6',
  earColor: '#e76f51',
} as const;

export interface PetProps extends PlacementProps {
  bodyColor?: string;
}

/** Small blocky cat companion with idle hop and tail wag. */
export function Pet({ bodyColor = DEFAULTS.bodyColor, ...placement }: PetProps) {
  const root = useRef<THREE.Group>(null);
  const tail = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (root.current) {
      root.current.position.y = Math.abs(Math.sin(t * 2.8)) * 0.06;
    }
    if (tail.current) {
      tail.current.rotation.y = Math.sin(t * 4.5) * 0.35;
    }
  });

  return (
    <group ref={root} position={resolvePosition(placement)}>
      <mesh castShadow position={[0, 0.18, 0]}>
        <boxGeometry args={[0.38, 0.28, 0.55]} />
        <meshStandardMaterial color={bodyColor} flatShading />
      </mesh>
      <mesh position={[0, 0.14, 0.08]}>
        <boxGeometry args={[0.28, 0.12, 0.35]} />
        <meshStandardMaterial color={DEFAULTS.bellyColor} flatShading />
      </mesh>
      <mesh castShadow position={[0, 0.38, 0.22]}>
        <boxGeometry args={[0.32, 0.28, 0.32]} />
        <meshStandardMaterial color={bodyColor} flatShading />
      </mesh>
      <mesh position={[-0.1, 0.5, 0.18]} rotation={[0, 0, 0.25]}>
        <boxGeometry args={[0.1, 0.14, 0.06]} />
        <meshStandardMaterial color={DEFAULTS.earColor} flatShading />
      </mesh>
      <mesh position={[0.1, 0.5, 0.18]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.1, 0.14, 0.06]} />
        <meshStandardMaterial color={DEFAULTS.earColor} flatShading />
      </mesh>
      <mesh position={[-0.08, 0.4, 0.38]}>
        <boxGeometry args={[0.05, 0.05, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.08, 0.4, 0.38]}>
        <boxGeometry args={[0.05, 0.05, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <group ref={tail} position={[0, 0.28, -0.28]}>
        <mesh castShadow position={[0, 0.08, -0.12]} rotation={[0.4, 0, 0]}>
          <boxGeometry args={[0.08, 0.28, 0.08]} />
          <meshStandardMaterial color={bodyColor} flatShading />
        </mesh>
      </group>
    </group>
  );
}
