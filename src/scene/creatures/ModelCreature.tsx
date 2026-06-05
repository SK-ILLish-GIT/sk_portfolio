import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useCreatureMotion } from '../../hooks/useCreatureMotion';
import { CREATURE_ENTRY } from '../../config/creature';
import type { CreatureOption } from './creatures';
import type { Phase } from '../../config/intro';

/** Loads a creature GLB, auto-fits its scale, and plays its flight animation. */
export default function ModelCreature({
  option,
  phase,
  accent,
}: {
  option: CreatureOption;
  phase: Phase;
  accent: string;
}) {
  const body = useRef<THREE.Group>(null);
  const model = useRef<THREE.Group>(null);
  const glow = useRef<THREE.PointLight>(null);
  const actionRef = useRef<THREE.AnimationAction | null>(null);

  const { scene, animations } = useGLTF(option.path!);
  const { actions, names } = useAnimations(animations, model);

  useCreatureMotion(body, phase);

  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = (option.targetSize ?? 2) / maxDim;
    return { scale, offset: center.multiplyScalar(-scale) };
  }, [scene, option.targetSize]);

  useEffect(() => {
    scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [scene]);

  useEffect(() => {
    if (!names.length) return;
    const name = names.find((n) => option.clipMatch?.test(n)) ?? names[0];
    const action = actions[name];
    action?.reset().fadeIn(0.3).setEffectiveTimeScale(1.15).play();
    actionRef.current = action ?? null;
    return () => {
      action?.fadeOut(0.2);
    };
  }, [actions, names, option.clipMatch]);

  useFrame((_, delta) => {
    if (glow.current && body.current) {
      glow.current.position.copy(body.current.position);
      glow.current.position.y -= 0.3;
      glow.current.intensity = phase === 'loading' ? 0 : 0.7;
    }
    if (actionRef.current) {
      const target = phase === 'live' ? 1.05 : 1.2;
      actionRef.current.setEffectiveTimeScale(
        THREE.MathUtils.lerp(actionRef.current.getEffectiveTimeScale(), target, delta * 2),
      );
    }
  });

  return (
    <group ref={body} position={CREATURE_ENTRY}>
      <group ref={model} rotation={[0, option.faceYaw ?? 0, 0]} scale={fit.scale} position={fit.offset}>
        <primitive object={scene} />
      </group>
      <pointLight ref={glow} color={accent} intensity={0} distance={7} />
    </group>
  );
}

useGLTF.preload('/models/stork.glb');
