import { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  poleHeight: 4.6,
  poleRadius: 0.06,
  poleColor: '#6b5a45',
  clothWidth: 2.05,
  clothHeight: 1.2,
} as const;

export interface BannerHandle {
  setGlow: (intensity: number) => void;
}

export interface BannerProps extends PlacementProps, AccentProps {}

/** Tall name banner on a pole — cloth flutters gently in the breeze. */
export const Banner = forwardRef<BannerHandle, BannerProps>(function Banner({ accent, ...placement }, ref) {
  const cloth = useRef<THREE.Group>(null);
  const trimMat = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setGlow: (intensity: number) => {
      glowRef.current = intensity;
    },
  }));

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (cloth.current) {
      cloth.current.rotation.z = Math.sin(t * 1.4) * 0.06;
      cloth.current.rotation.x = Math.sin(t * 1.1 + 0.5) * 0.03;
    }
    if (trimMat.current) {
      trimMat.current.emissiveIntensity = glowRef.current * 1.2;
    }
  });

  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, DEFAULTS.poleHeight / 2, 0]}>
        <cylinderGeometry args={[DEFAULTS.poleRadius, DEFAULTS.poleRadius * 1.2, DEFAULTS.poleHeight, 6]} />
        <meshStandardMaterial color={DEFAULTS.poleColor} flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.22, 0.28, 0.16, 6]} />
        <meshStandardMaterial color="#8a7a62" flatShading roughness={1} />
      </mesh>

      <group ref={cloth} position={[0, DEFAULTS.poleHeight - 0.35, 0.08]}>
        <mesh castShadow position={[0, 0, -0.02]}>
          <boxGeometry args={[DEFAULTS.clothWidth + 0.08, DEFAULTS.clothHeight + 0.08, 0.06]} />
          <meshStandardMaterial ref={trimMat} color={accent} emissive={accent} emissiveIntensity={0} flatShading />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <boxGeometry args={[DEFAULTS.clothWidth, DEFAULTS.clothHeight, 0.04]} />
          <meshStandardMaterial color="#faf6ef" flatShading roughness={0.85} />
        </mesh>
        <Text
          position={[0, 0.22, 0.06]}
          fontSize={0.18}
          letterSpacing={0.12}
          anchorX="center"
          anchorY="middle"
          color="#1a1028"
        >
          SK SAHIL PARVEZ
        </Text>
        <Text
          position={[0, -0.18, 0.06]}
          fontSize={0.12}
          letterSpacing={0.14}
          anchorX="center"
          anchorY="middle"
          color={accent}
        >
          SOFTWARE ENGINEER
        </Text>
      </group>
    </group>
  );
});
