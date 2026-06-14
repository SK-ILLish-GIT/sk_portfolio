import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { resolvePosition, type PlacementProps } from './types';

const PATH = '/models/angry-bird.glb';

export interface StaticBirdProps extends PlacementProps {
  /** GLB to render (defaults to the projectile bird). */
  path?: string;
  targetSize?: number;
  rotationY?: number;
  /** Play the model's first (idle) animation clip. */
  animate?: boolean;
}

/** A non-physics bird model — used for cosmetic mascots / ammo piles. */
export function StaticBird({
  path = PATH,
  targetSize = 0.9,
  rotationY = 0,
  animate = false,
  ...placement
}: StaticBirdProps) {
  const group = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(path);
  // Animated mascots use the live scene (so the skeleton drives it); static
  // copies clone so the same GLB can be placed multiple times.
  const obj = useMemo(() => (animate ? scene : scene.clone(true)), [scene, animate]);
  const { actions, names } = useAnimations(animations, group);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(obj);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = targetSize / (Math.max(size.x, size.y, size.z) || 1);
    return {
      scale,
      offset: new THREE.Vector3(-center.x * scale, -box.min.y * scale, -center.z * scale),
    };
  }, [obj, targetSize]);

  useEffect(() => {
    obj.traverse((o) => {
      if (o instanceof THREE.Mesh) o.castShadow = true;
    });
  }, [obj]);

  useEffect(() => {
    if (!animate) return;
    const name = names[0];
    const action = name ? actions[name] : null;
    action?.reset().fadeIn(0.3).play();
    return () => {
      action?.fadeOut(0.3);
    };
  }, [animate, actions, names]);

  return (
    <group ref={group} position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      <group scale={fit.scale} position={fit.offset}>
        <primitive object={obj} />
      </group>
    </group>
  );
}

useGLTF.preload(PATH);
