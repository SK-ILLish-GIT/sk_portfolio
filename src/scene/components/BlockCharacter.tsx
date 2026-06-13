import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  skinColor: '#ffe0bd',
  eyeColor: '#222222',
  hairColor: '#2a1a10',
} as const;

export interface BlockCharacterProps extends PlacementProps, AccentProps {
  skinColor?: string;
  hairColor?: string;
  wave?: boolean;
  bob?: boolean;
  hair?: boolean;
  smile?: boolean;
}

/** Cute blocky low-poly avatar (body, head, eyes, arms). */
export function BlockCharacter({
  accent,
  skinColor = DEFAULTS.skinColor,
  hairColor = DEFAULTS.hairColor,
  wave = false,
  bob = false,
  hair = false,
  smile = false,
  ...placement
}: BlockCharacterProps) {
  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Mesh>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!wave && !bob) return;
    const t = state.clock.getElapsedTime();

    if (bob && root.current) {
      root.current.position.y = Math.sin(t * 1.8) * 0.04;
    }
    if (bob && torso.current) {
      const breath = 1 + Math.sin(t * 2.2) * 0.025;
      torso.current.scale.set(1, breath, 1);
    }
    if (wave && armR.current) {
      armR.current.rotation.z = -0.35 + Math.sin(t * 6) * 0.55;
    }
  });

  return (
    <group ref={root} position={resolvePosition(placement)}>
      <mesh ref={torso} castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color={skinColor} flatShading />
      </mesh>
      {hair && (
        <mesh castShadow position={[0, 1.52, -0.02]}>
          <boxGeometry args={[0.58, 0.22, 0.58]} />
          <meshStandardMaterial color={hairColor} flatShading />
        </mesh>
      )}
      <mesh position={[-0.12, 1.32, 0.29]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color={DEFAULTS.eyeColor} />
      </mesh>
      <mesh position={[0.12, 1.32, 0.29]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color={DEFAULTS.eyeColor} />
      </mesh>
      {smile && (
        <mesh position={[0, 1.18, 0.29]}>
          <boxGeometry args={[0.14, 0.04, 0.04]} />
          <meshStandardMaterial color="#c45c5c" flatShading />
        </mesh>
      )}
      <group ref={armL} position={[-0.48, 0.95, 0]}>
        <mesh castShadow position={[0, -0.35, 0]}>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color={accent} flatShading />
        </mesh>
      </group>
      <group ref={armR} position={[0.48, 0.95, 0]}>
        <mesh castShadow position={[0, -0.35, 0]}>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color={accent} flatShading />
        </mesh>
      </group>
    </group>
  );
}
