import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RigidBody, BallCollider, type RapierRigidBody } from '@react-three/rapier';
import { SKILLS_GAME } from '../../config/skillsGame';
import type { Vec3 } from '../../types/three';

const PATH = '/models/angry-bird.glb';

export interface AngryBirdProps {
  position: Vec3;
  vel: Vec3;
  onSettle: () => void;
}

/** The angry-bird projectile: GLB model on a ball collider, launched with `vel`. */
export function AngryBird({ position, vel, onSettle }: AngryBirdProps) {
  const { scene } = useGLTF(PATH);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const body = useRef<RapierRigidBody>(null);
  const born = useRef(performance.now());

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const scale = SKILLS_GAME.bird.modelSize / (Math.max(size.x, size.y, size.z) || 1);
    return {
      scale,
      offset: new THREE.Vector3(-center.x * scale, -center.y * scale, -center.z * scale),
    };
  }, [cloned]);

  useEffect(() => {
    cloned.traverse((o) => {
      if (o instanceof THREE.Mesh) o.castShadow = true;
    });
  }, [cloned]);

  useEffect(() => {
    body.current?.setLinvel({ x: vel[0], y: vel[1], z: vel[2] }, true);
  }, [vel]);

  useFrame(() => {
    const b = body.current;
    if (!b) return;
    const age = performance.now() - born.current;
    const v = b.linvel();
    const slow = Math.hypot(v.x, v.y, v.z) < 0.7;
    if (age > SKILLS_GAME.bird.lifeMs || (slow && age > 900) || b.translation().y < SKILLS_GAME.breakY - 3) {
      onSettle();
    }
  });

  return (
    <RigidBody
      ref={body}
      position={position}
      colliders={false}
      restitution={SKILLS_GAME.bird.restitution}
      canSleep={false}
      ccd
    >
      <BallCollider args={[SKILLS_GAME.bird.radius]} mass={SKILLS_GAME.bird.mass} />
      <group scale={fit.scale} position={fit.offset}>
        <primitive object={cloned} />
      </group>
    </RigidBody>
  );
}

useGLTF.preload(PATH);
