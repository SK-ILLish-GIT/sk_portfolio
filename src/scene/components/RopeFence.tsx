import { useMemo } from 'react';
import * as THREE from 'three';
import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  postColor: '#a8895c',
  ropeColor: '#cbb48b',
  postCount: 5,
} as const;

export interface RopeFenceProps extends PlacementProps {
  length?: number;
  rotationY?: number;
}

/** Short posts with sagging rope rails — partial island edge fencing. */
export function RopeFence({ length = 3.2, rotationY = 0, ...placement }: RopeFenceProps) {
  const posts = DEFAULTS.postCount;
  const ropeCurve = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-length / 2, 0.38, 0),
      new THREE.Vector3(-length / 4, 0.32, 0),
      new THREE.Vector3(0, 0.36, 0),
      new THREE.Vector3(length / 4, 0.3, 0),
      new THREE.Vector3(length / 2, 0.35, 0),
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.018, 4, false);
  }, [length]);

  const lowerRope = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-length / 2, 0.22, 0),
      new THREE.Vector3(-length / 4, 0.18, 0),
      new THREE.Vector3(0, 0.21, 0),
      new THREE.Vector3(length / 4, 0.17, 0),
      new THREE.Vector3(length / 2, 0.2, 0),
    ]);
    return new THREE.TubeGeometry(curve, 16, 0.016, 4, false);
  }, [length]);

  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      {Array.from({ length: posts }).map((_, i) => {
        const x = -length / 2 + (i / (posts - 1)) * length;
        return (
          <mesh key={i} castShadow position={[x, 0.28, 0]}>
            <cylinderGeometry args={[0.05, 0.06, 0.56, 5]} />
            <meshStandardMaterial color={DEFAULTS.postColor} flatShading roughness={1} />
          </mesh>
        );
      })}
      <mesh geometry={ropeCurve}>
        <meshStandardMaterial color={DEFAULTS.ropeColor} flatShading roughness={0.9} />
      </mesh>
      <mesh geometry={lowerRope}>
        <meshStandardMaterial color={DEFAULTS.ropeColor} flatShading roughness={0.9} />
      </mesh>
    </group>
  );
}
