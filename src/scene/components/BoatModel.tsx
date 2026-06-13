import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { SAILBOAT, type BoatOption } from '../../config/boats';

/** Loads a boat GLB, auto-fits its scale, seats it on the waterline, and points
 *  the bow along +Z (the body's forward axis). Static mesh — motion is driven
 *  by the physics body it lives inside. */
export function BoatModel({ option }: { option: BoatOption }) {
  const { scene } = useGLTF(option.path!);

  // Clone so swapping/re-mounting never mutates the cached source scene.
  const cloned = useMemo(() => scene.clone(true), [scene]);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = option.targetSize / maxDim;
    return {
      scale,
      offset: new THREE.Vector3(-center.x * scale, -box.min.y * scale + option.yOffset, -center.z * scale),
    };
  }, [cloned, option.targetSize, option.yOffset]);

  useEffect(() => {
    cloned.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [cloned]);

  return (
    <group rotation={[0, option.faceYaw, 0]} scale={fit.scale} position={fit.offset}>
      <primitive object={cloned} />
    </group>
  );
}

useGLTF.preload(SAILBOAT.path);
