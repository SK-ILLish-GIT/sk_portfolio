import { forwardRef, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';
import { CoffeeSteam } from './CoffeeSteam';

const DEFAULTS = {
  woodColor: '#8b7355',
  woodDark: '#6b5a45',
  metalColor: '#4a4a52',
  padColor: '#3a3a44',
  mugColor: '#f5f0e6',
} as const;

export interface WorkstationHandle {
  setGlow: (intensity: number) => void;
}

export interface WorkstationProps extends PlacementProps, AccentProps {
  rotation?: [number, number, number];
}

/** Full developer desk: table, laptop, monitor, keyboard, mouse, lamp, mug, chair. */
export const Workstation = forwardRef<WorkstationHandle, WorkstationProps>(function Workstation(
  { accent, rotation = [0, 0, 0], ...placement },
  ref,
) {
  const laptopScreen = useRef<THREE.MeshStandardMaterial>(null);
  const monitorScreen = useRef<THREE.MeshStandardMaterial>(null);
  const lampBulb = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setGlow: (intensity: number) => {
      glowRef.current = intensity;
      if (laptopScreen.current) laptopScreen.current.emissiveIntensity = intensity * 1.4;
      if (monitorScreen.current) monitorScreen.current.emissiveIntensity = intensity * 1.6;
      if (lampBulb.current) lampBulb.current.emissiveIntensity = intensity * 0.8 + 0.2;
    },
  }));

  const codeLines = [
    [-0.08, 0.05],
    [0.04, -0.02],
    [-0.06, -0.09],
    [0.02, -0.16],
  ] as const;

  return (
    <group position={resolvePosition(placement)} rotation={rotation}>
      {/* desk top + legs */}
      <mesh castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[1.55, 0.08, 0.82]} />
        <meshStandardMaterial color={DEFAULTS.woodColor} flatShading roughness={1} />
      </mesh>
      {[
        [-0.65, 0.26, -0.32],
        [0.65, 0.26, -0.32],
        [-0.65, 0.26, 0.32],
        [0.65, 0.26, 0.32],
      ].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]}>
          <boxGeometry args={[0.08, 0.52, 0.08]} />
          <meshStandardMaterial color={DEFAULTS.woodDark} flatShading roughness={1} />
        </mesh>
      ))}

      {/* laptop */}
      <group position={[-0.22, 0.58, 0.08]}>
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.52, 0.04, 0.36]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh position={[0, 0.2, -0.13]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[0.52, 0.36, 0.04]} />
          <meshStandardMaterial color="#2a2a32" flatShading />
        </mesh>
        <mesh position={[0, 0.2, -0.11]} rotation={[-0.55, 0, 0]}>
          <boxGeometry args={[0.46, 0.3, 0.02]} />
          <meshStandardMaterial ref={laptopScreen} color={accent} emissive={accent} emissiveIntensity={0} flatShading />
        </mesh>
        {codeLines.map(([x, y], i) => (
          <mesh key={i} position={[x, 0.2 + y * 0.55, -0.095]} rotation={[-0.55, 0, 0]}>
            <boxGeometry args={[0.14 + (i % 2) * 0.06, 0.012, 0.008]} />
            <meshStandardMaterial color="#1a1a22" flatShading />
          </mesh>
        ))}
      </group>

      {/* monitor */}
      <group position={[0.38, 0.58, -0.02]}>
        <mesh castShadow position={[0, 0.12, 0]}>
          <boxGeometry args={[0.08, 0.24, 0.08]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.38, 0]}>
          <boxGeometry args={[0.58, 0.38, 0.05]} />
          <meshStandardMaterial color="#2a2a32" flatShading />
        </mesh>
        <mesh position={[0, 0.38, 0.04]}>
          <boxGeometry args={[0.5, 0.32, 0.02]} />
          <meshStandardMaterial
            ref={monitorScreen}
            color={accent}
            emissive={accent}
            emissiveIntensity={0}
            flatShading
          />
        </mesh>
        {codeLines.map(([x, y], i) => (
          <mesh key={`m-${i}`} position={[x * 1.1, 0.38 + y, 0.055]}>
            <boxGeometry args={[0.16 + (i % 2) * 0.08, 0.014, 0.008]} />
            <meshStandardMaterial color="#1a1a22" flatShading />
          </mesh>
        ))}
        <mesh castShadow position={[0, 0.02, 0]}>
          <boxGeometry args={[0.3, 0.04, 0.14]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
      </group>

      {/* keyboard + mousepad + mouse */}
      <group position={[0.05, 0.57, 0.22]}>
        <mesh castShadow position={[0, 0.015, 0]}>
          <boxGeometry args={[0.42, 0.03, 0.14]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        {Array.from({ length: 12 }).map((_, i) => (
          <mesh key={i} position={[-0.15 + (i % 6) * 0.06, 0.035, -0.03 + Math.floor(i / 6) * 0.06]}>
            <boxGeometry args={[0.04, 0.012, 0.04]} />
            <meshStandardMaterial color="#353540" flatShading />
          </mesh>
        ))}
        <mesh position={[0.32, 0.012, 0.02]}>
          <boxGeometry args={[0.22, 0.02, 0.18]} />
          <meshStandardMaterial color={DEFAULTS.padColor} flatShading />
        </mesh>
        <mesh castShadow position={[0.34, 0.028, 0.02]}>
          <boxGeometry args={[0.06, 0.035, 0.1]} />
          <meshStandardMaterial color="#2a2a32" flatShading />
        </mesh>
      </group>

      {/* desk lamp */}
      <group position={[0.62, 0.58, 0.18]}>
        <mesh castShadow position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.06, 0.08, 0.08, 6]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.22, 0]} rotation={[0, 0, 0.35]}>
          <cylinderGeometry args={[0.025, 0.025, 0.32, 5]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh position={[0.1, 0.38, 0]} rotation={[0, 0, -0.8]}>
          <coneGeometry args={[0.1, 0.14, 6]} />
          <meshStandardMaterial ref={lampBulb} color="#fff5d6" emissive="#ffd166" emissiveIntensity={0.2} flatShading />
        </mesh>
      </group>

      {/* coffee mug + steam */}
      <group position={[-0.55, 0.58, -0.18]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.055, 0.1, 6]} />
          <meshStandardMaterial color={DEFAULTS.mugColor} flatShading roughness={0.8} />
        </mesh>
        <mesh position={[0.065, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.035, 0.012, 4, 8, Math.PI]} />
          <meshStandardMaterial color={DEFAULTS.mugColor} flatShading />
        </mesh>
        <CoffeeSteam y={0.12} />
      </group>

      {/* notebook on desk */}
      <mesh castShadow position={[-0.55, 0.585, 0.28]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[0.18, 0.02, 0.24]} />
        <meshStandardMaterial color="#ffd166" flatShading />
      </mesh>

      {/* chair — seat, back, legs, armrests */}
      <group position={[-0.55, 0, 0.62]}>
        <mesh castShadow position={[0, 0.38, 0]}>
          <boxGeometry args={[0.42, 0.06, 0.4]} />
          <meshStandardMaterial color="#3a3a44" flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.62, -0.16]}>
          <boxGeometry args={[0.38, 0.42, 0.06]} />
          <meshStandardMaterial color="#3a3a44" flatShading />
        </mesh>
        {[
          [-0.16, 0.18, -0.14],
          [0.16, 0.18, -0.14],
          [-0.16, 0.18, 0.14],
          [0.16, 0.18, 0.14],
        ].map(([x, y, z], i) => (
          <mesh key={i} castShadow position={[x, y, z]}>
            <cylinderGeometry args={[0.03, 0.035, 0.36, 5]} />
            <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
          </mesh>
        ))}
        <mesh castShadow position={[-0.22, 0.48, 0]}>
          <boxGeometry args={[0.04, 0.04, 0.28]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh castShadow position={[0.22, 0.48, 0]}>
          <boxGeometry args={[0.04, 0.04, 0.28]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
        <mesh castShadow position={[0, 0.08, 0]}>
          <cylinderGeometry args={[0.04, 0.05, 0.16, 5]} />
          <meshStandardMaterial color={DEFAULTS.metalColor} flatShading />
        </mesh>
      </group>
    </group>
  );
});
