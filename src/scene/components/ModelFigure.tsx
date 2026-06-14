import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { HERO_WORKSPACE } from '../../config/heroModels';
import { resolvePosition, type PlacementProps } from './types';
import type { Vec3 } from '../../types/three';

export interface ModelFigureConfig {
  path: string;
  targetSize: number;
  faceYaw: number;
  positionOffset?: Vec3;
  idleClip: RegExp;
  waveClip?: RegExp;
}

export interface ModelFigureProps extends PlacementProps {
  config: ModelFigureConfig;
  wave?: boolean;
  bob?: boolean;
}

function findClip(names: string[], pattern: RegExp) {
  return names.find((n) => pattern.test(n));
}

/** Loads a rigged GLB, auto-fits scale, and plays idle / wave clips. */
export function ModelFigure({ config, wave = false, bob = false, x, y, z, position }: ModelFigureProps) {
  const root = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const baseY = useRef(resolvePosition({ x, y, z, position })[1]);
  const idleAction = useRef<THREE.AnimationAction | null>(null);
  const waveAction = useRef<THREE.AnimationAction | null>(null);

  const { scene, animations } = useGLTF(config.path);
  const { actions, names } = useAnimations(animations, model);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = config.targetSize / maxDim;
    const [ox = 0, oy = 0, oz = 0] = config.positionOffset ?? [0, 0, 0];
    const offset = new THREE.Vector3(-center.x * scale + ox, -box.min.y * scale + oy, -center.z * scale + oz);
    return { scale, offset };
  }, [scene, config.targetSize, config.positionOffset]);

  useEffect(() => {
    baseY.current = resolvePosition({ x, y, z, position })[1];
  }, [x, y, z, position]);

  useEffect(() => {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    const idleName = findClip(names, config.idleClip);
    const waveName = config.waveClip ? findClip(names, config.waveClip) : undefined;
    idleAction.current = idleName ? (actions[idleName] ?? null) : null;
    waveAction.current = waveName ? (actions[waveName] ?? null) : null;

    idleAction.current?.reset().fadeIn(0.2).play();
    return () => {
      idleAction.current?.fadeOut(0.2);
      waveAction.current?.fadeOut(0.2);
    };
  }, [actions, names, config.idleClip, config.waveClip]);

  useEffect(() => {
    if (!config.waveClip) return;
    const idle = idleAction.current;
    const waveClip = waveAction.current;
    if (wave && waveClip) {
      waveClip.setLoop(THREE.LoopRepeat, Infinity);
      idle?.fadeOut(0.25);
      waveClip.reset().fadeIn(0.25).play();
    } else if (idle) {
      waveClip?.fadeOut(0.25);
      idle.reset().fadeIn(0.25).play();
    }
  }, [wave, config.waveClip]);

  useFrame((state) => {
    if (!root.current) return;
    if (bob) {
      root.current.position.y = baseY.current + Math.sin(state.clock.getElapsedTime() * 1.8) * 0.04;
    }
  });

  return (
    <group ref={root} position={resolvePosition({ x, y, z, position })}>
      <group ref={model} rotation={[0, config.faceYaw, 0]} scale={fit.scale} position={fit.offset}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/** Preload the hero desk GLB so the welcome scene appears without pop-in. */
useGLTF.preload(HERO_WORKSPACE.path);
