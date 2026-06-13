import { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  woodColor: '#8b7355',
  metalColor: '#4a4a52',
  stoolColor: '#6b5a45',
} as const;

export interface WorkstationHandle {
  setGlow: (intensity: number) => void;
}

export interface WorkstationProps extends PlacementProps, AccentProps {
  rotation?: [number, number, number];
}

/** Mini desk setup: laptop, monitor, and stool — screens glow on intro. */
export const Workstation = forwardRef<WorkstationHandle, WorkstationProps>(function Workstation(
  { accent, rotation = [0, 0, 0], ...placement },
  ref,
) {
  const laptopScreen = useRef<THREE.MeshStandardMaterial>(null);
  const monitorScreen = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setGlow: (intensity: number) => {
      glowRef.current = intensity;
      if (laptopScreen.current) laptopScreen.current.emissiveIntensity = intensity * 1.4;
      if (monitorScreen.current) monitorScreen.current.emissiveIntensity = intensity * 1.6;
    },
  }));

  return (
    <group position={resolvePosition(placement)} rotation={rotation}>
      {/* desk */}
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[1.4, 0.08, 0.75]} />
        <meshStandardMaterial color={DEFAULTS.woodColor} flatShading roughness={1} />
      </mesh>
      {[
        [-0.58, 0.26, -0.28],
        [0.58, 0.26, -0.28],
        [-0.58, 0.26, 0.28],
        [0.58, 0.26, 0.28],
      ].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.52, 0.08]} />
          <meshStandardMaterial color={DEFAULTS.woodColor} flatShading roughness={1} />
        </mesh>
      ))}

      {/* laptop */}
      <group position={[-0.15, 0.58, 0.05]}>
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.55, 0.04, 0.38]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh position={[0, 0.22, -0.14]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[0.55, 0.38, 0.04]} />
          <meshStandardMaterial color="#2a2a32" flatShading />
        </mesh>
        <mesh position={[0, 0.22, -0.12]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[0.48, 0.32, 0.02]} />
          <meshStandardMaterial ref={laptopScreen} color={accent} emissive={accent} emissiveIntensity={0} flatShading />
        </mesh>
      </group>

      {/* monitor */}
      <group position={[0.35, 0.58, -0.05]}>
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.24, 0.08]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.38, 0]}>
          <boxGeometry args={[0.55, 0.38, 0.05]} />
          <meshStandardMaterial color="#2a2a32" flatShading />
        </mesh>
        <mesh position={[0, 0.38, 0.04]}>
          <boxGeometry args={[0.48, 0.32, 0.02]} />
          <meshStandardMaterial
            ref={monitorScreen}
            color={accent}
            emissive={accent}
            emissiveIntensity={0}
            flatShading
          />
        </mesh>
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.28, 0.04, 0.12]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
      </group>

      {/* stool */}
      <mesh castShadow position={[-0.55, 0.22, 0.45]}>
        <cylinderGeometry args={[0.22, 0.22, 0.06, 6]} />
        <meshStandardMaterial color={DEFAULTS.stoolColor} flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[-0.55, 0.12, 0.45]}>
        <cylinderGeometry args={[0.04, 0.04, 0.24, 5]} />
        <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
      </mesh>
    </group>
  );
});
