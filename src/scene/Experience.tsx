import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, AdaptiveDpr, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { stations } from '../data/portfolio';
import { CAMERA, RENDERER, FOG, LIGHTS, SCROLL, ISLAND } from '../config/scene';
import type { Phase } from '../config/intro';
import Island from './Island';
import StationProps from './props';
import CameraRig from './CameraRig';
import Clouds from './Clouds';
import GuideCreature from './creatures/GuideCreature';

interface ExperienceProps {
  active: number;
  setActive: (i: number) => void;
  scrollTo: { index: number; nonce: number };
  phase: Phase;
  creatureId: string;
}

export default function Experience({ setActive, scrollTo, phase, creatureId }: ExperienceProps) {
  return (
    <Canvas
      shadows
      dpr={RENDERER.dpr}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: CAMERA.fov, position: CAMERA.position, near: CAMERA.near, far: CAMERA.far }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog(FOG.color, FOG.near, FOG.far);
      }}
    >
      <hemisphereLight args={[LIGHTS.hemisphere.sky, LIGHTS.hemisphere.ground, LIGHTS.hemisphere.intensity]} />
      <ambientLight intensity={LIGHTS.ambient.intensity} />
      <directionalLight
        position={LIGHTS.directional.position}
        intensity={LIGHTS.directional.intensity}
        castShadow
        shadow-mapSize={[LIGHTS.directional.shadowMapSize, LIGHTS.directional.shadowMapSize]}
        shadow-camera-far={LIGHTS.directional.shadowCameraFar}
        shadow-camera-left={-LIGHTS.directional.shadowCameraExtent}
        shadow-camera-right={LIGHTS.directional.shadowCameraExtent}
        shadow-camera-top={LIGHTS.directional.shadowCameraExtent}
        shadow-camera-bottom={-LIGHTS.directional.shadowCameraExtent}
      />

      <Suspense fallback={null}>
        <ScrollControls pages={stations.length} damping={SCROLL.damping}>
          <CameraRig setActive={setActive} scrollTo={scrollTo} phase={phase} />
          {stations.map((s, i) => (
            <Island
              key={s.id}
              position={s.position}
              accent={s.accent}
              seed={i + 1}
              radius={s.id === 'hero' ? ISLAND.heroRadius : ISLAND.defaultRadius}
            >
              <StationProps id={s.id} accent={s.accent} phase={phase} />
            </Island>
          ))}
          {phase !== 'loading' && (
            <pointLight
              position={LIGHTS.heroAccent.position}
              color={stations[0].accent}
              intensity={phase === 'intro' ? LIGHTS.heroAccent.introIntensity : LIGHTS.heroAccent.liveIntensity}
              distance={LIGHTS.heroAccent.distance}
            />
          )}
          <GuideCreature optionId={creatureId} phase={phase} accent={stations[0].accent} />
        </ScrollControls>
        <Clouds />
        <Preload all />
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
