import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { SKILLS_GAME } from '../../config/skillsGame';
import type { Vec3 } from '../../types/three';

const PATH = '/models/cannon.glb';

export interface CannonTune {
  pos: Vec3;
  faceYaw: number;
  targetSize: number;
  /** Extra model-space euler [pitch, yaw, roll] applied before the fit offset. */
  modelRot: Vec3;
}

export interface CannonProps {
  /** Aim direction: yaw around Y, pitch (elevation) up from horizontal. */
  aim: { yaw: number; pitch: number };
  tune?: CannonTune;
}

/** Cannon prop, seated on the grass at the apex, rotating to face the aim. */
export function Cannon({ aim, tune }: CannonProps) {
  const { scene } = useGLTF(PATH);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  const c = SKILLS_GAME.cannon;
  const pos = tune?.pos ?? c.pos;
  const faceYaw = tune?.faceYaw ?? c.faceYaw;
  const targetSize = tune?.targetSize ?? c.targetSize;
  const modelRot = tune?.modelRot ?? c.modelRot;

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

  const muzzleRef = useRef<THREE.Object3D>(null);
  const baseRef = useRef<THREE.Object3D>(null);
  const barrel = useRef(new THREE.Vector3());
  const base = useRef(new THREE.Vector3());

  useFrame(() => {
    if (!import.meta.env.DEV || !muzzleRef.current || !baseRef.current) return;
    muzzleRef.current.getWorldPosition(barrel.current);
    baseRef.current.getWorldPosition(base.current);
    barrel.current.sub(base.current).normalize();
    (window as Window & { __cannonBarrelDir?: { x: number; y: number; z: number } }).__cannonBarrelDir = {
      x: barrel.current.x,
      y: barrel.current.y,
      z: barrel.current.z,
    };
  });

  return (
    <group position={pos} rotation={[0, aim.yaw + faceYaw, 0]}>
      <group rotation={[-aim.pitch, 0, 0]}>
        <group rotation={modelRot}>
          <group scale={fit.scale} position={fit.offset}>
            <object3D ref={baseRef} />
            <object3D ref={muzzleRef} position={[-1, 0, 0]} />
            <primitive object={cloned} />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload(PATH);
