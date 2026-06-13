import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const DEFAULTS = {
  color: '#eaf7ff',
  segments: 28,
} as const;

export interface FoamRingProps {
  /** Island radius the foam hugs. */
  radius: number;
  /** Height above the waterline. */
  y?: number;
  phase?: number;
}

/** A soft white foam ring lapping an island's shoreline, gently pulsing. */
export function FoamRing({ radius, y = 0.16, phase = 0 }: FoamRingProps) {
  const mat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!mat.current) return;
    const t = state.clock.getElapsedTime();
    mat.current.opacity = 0.42 + Math.sin(t * 1.2 + phase) * 0.16;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]}>
      <ringGeometry args={[radius * 1.0, radius * 1.26, DEFAULTS.segments]} />
      <meshBasicMaterial
        ref={mat}
        color={DEFAULTS.color}
        transparent
        opacity={0.5}
        depthWrite={false}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
