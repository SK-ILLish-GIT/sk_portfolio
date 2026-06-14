import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Text } from '@react-three/drei';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  rockColor: '#8a8578',
  rockDark: '#6b665c',
  mossColor: '#4a8f5c',
  flowerColors: ['#ff8fab', '#ffd166', '#4cc9f0'] as const,
  rotationY: 0,
} as const;

export interface OrganicNameStoneHandle {
  setGlow: (intensity: number) => void;
}

export interface OrganicNameStoneProps extends PlacementProps, AccentProps {
  name?: string;
  rotationY?: number;
}

/** Irregular low-poly boulder with engraved name, moss, cracks, and tiny flowers. */
export const OrganicNameStone = forwardRef<OrganicNameStoneHandle, OrganicNameStoneProps>(function OrganicNameStone(
  { accent, name = 'SK Sahil Parvez', rotationY = DEFAULTS.rotationY, ...placement },
  ref,
) {
  const textMat = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef(0);

  useImperativeHandle(ref, () => ({
    setGlow: (intensity: number) => {
      glowRef.current = intensity;
      if (textMat.current) textMat.current.emissiveIntensity = intensity * 0.9;
    },
  }));

  const rockGeo = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(0.55, 0);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const n = 0.85 + Math.sin(x * 4.1 + y * 3.7) * 0.08 + Math.cos(z * 5.2) * 0.06;
      pos.setXYZ(i, x * n * 1.15, y * n * 0.72 + 0.08, z * n * 1.05);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      {/* main boulder */}
      <mesh castShadow receiveShadow geometry={rockGeo} position={[0, 0.42, 0]}>
        <meshStandardMaterial color={DEFAULTS.rockColor} flatShading roughness={0.95} />
      </mesh>

      {/* chipped side chunks */}
      {[
        [-0.38, 0.18, 0.22],
        [0.35, 0.12, -0.28],
        [0.12, 0.08, 0.42],
      ].map(([x, y, z], i) => (
        <mesh key={i} castShadow position={[x, y, z]} scale={[0.35 + i * 0.05, 0.22, 0.3]}>
          <dodecahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial color={DEFAULTS.rockDark} flatShading roughness={1} />
        </mesh>
      ))}

      {/* crack lines */}
      {[
        [0.05, 0.55, 0.38, 0.02, 0.35, 0.04],
        [-0.15, 0.48, 0.35, 0.04, 0.25, 0.03],
      ].map(([x, y, z, sx, sy, sz], i) => (
        <mesh key={`crack-${i}`} position={[x, y, z]} rotation={[0.2, 0.4, 0.15]}>
          <boxGeometry args={[sx, sy, sz]} />
          <meshStandardMaterial color="#3d3a34" flatShading />
        </mesh>
      ))}

      {/* moss patches */}
      {[
        [-0.28, 0.22, 0.15],
        [0.32, 0.28, -0.1],
        [-0.08, 0.15, -0.35],
      ].map(([x, y, z], i) => (
        <mesh key={`moss-${i}`} position={[x, y, z]} scale={[0.5 + i * 0.1, 0.15, 0.45]}>
          <sphereGeometry args={[0.18, 5, 4]} />
          <meshStandardMaterial color={DEFAULTS.mossColor} flatShading roughness={1} />
        </mesh>
      ))}

      {/* tiny flowers */}
      {[
        [-0.42, 0.08, 0.05],
        [0.45, 0.1, 0.08],
        [0.05, 0.06, -0.42],
      ].map(([x, y, z], i) => (
        <group key={`flower-${i}`} position={[x, y, z]}>
          <mesh position={[0, 0.06, 0]}>
            <cylinderGeometry args={[0.008, 0.01, 0.12, 4]} />
            <meshStandardMaterial color="#5a8f4a" flatShading />
          </mesh>
          <mesh position={[0, 0.14, 0]}>
            <sphereGeometry args={[0.045, 5, 4]} />
            <meshStandardMaterial color={DEFAULTS.flowerColors[i % 3]} flatShading />
          </mesh>
        </group>
      ))}

      {/* engraved name */}
      <Text
        position={[0, 0.58, 0.48]}
        rotation={[-0.12, 0, 0]}
        fontSize={0.11}
        maxWidth={1.1}
        letterSpacing={0.02}
        anchorX="center"
        anchorY="middle"
        color="#f5f0e6"
      >
        {name}
        <meshStandardMaterial ref={textMat} color="#f5f0e6" emissive={accent} emissiveIntensity={0} flatShading />
      </Text>
    </group>
  );
});
