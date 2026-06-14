import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  targetSize: 2.4,
} as const;

export interface TreeModelProps extends PlacementProps {
  path: string;
  targetSize?: number;
  rotationY?: number;
}

/** Low-poly tree from a GLB — auto-scaled and grounded at the placement point. */
export function TreeModel({ path, targetSize = DEFAULTS.targetSize, rotationY = 0, ...placement }: TreeModelProps) {
  const { scene } = useGLTF(path);
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = targetSize / (Math.max(size.x, size.y, size.z) || 1);
    return {
      scale,
      offset: new THREE.Vector3(-center.x * scale, -box.min.y * scale, -center.z * scale),
    };
  }, [cloned, targetSize]);

  useEffect(() => {
    cloned.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [cloned]);

  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      <group scale={fit.scale} position={fit.offset}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}
