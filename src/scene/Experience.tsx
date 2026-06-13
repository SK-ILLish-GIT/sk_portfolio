import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { Physics, RigidBody, CylinderCollider, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { stations } from '../data/portfolio';
import { CAMERA, RENDERER, FOG, LIGHTS, ISLAND } from '../config/scene';
import type { Phase } from '../config/intro';
import { useKeyboard } from '../hooks/useKeyboard';
import Island from './Island';
import StationProps from './props';
import CameraRig from './CameraRig';
import Clouds from './Clouds';
import Ocean from './Ocean';
import BoatController from './BoatController';

interface ExperienceProps {
  active: number;
  setActive: (i: number) => void;
  setDocked: (i: number) => void;
  phase: Phase;
  headingRef: React.MutableRefObject<number>;
  posRef: React.MutableRefObject<{ x: number; z: number }>;
}

export default function Experience({ setActive, setDocked, phase, headingRef, posRef }: ExperienceProps) {
  const boatBody = useRef<RapierRigidBody | null>(null);
  const input = useKeyboard();

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
        <Physics gravity={[0, -9.81, 0]}>
          <CameraRig phase={phase} bodyRef={boatBody} />

          {stations.map((s, i) => {
            const radius = s.id === 'hero' ? ISLAND.heroRadius : ISLAND.defaultRadius;
            return (
              <group key={s.id}>
                <Island position={s.position} accent={s.accent} seed={i + 1} radius={radius}>
                  <StationProps id={s.id} accent={s.accent} phase={phase} />
                </Island>
                {/* static hull-blocking collider around the island's shoreline */}
                <RigidBody type="fixed" colliders={false} position={[s.position[0], 0, s.position[2]]}>
                  <CylinderCollider args={[2.5, radius * 1.05]} />
                </RigidBody>
              </group>
            );
          })}

          {phase !== 'loading' && (
            <pointLight
              position={LIGHTS.heroAccent.position}
              color={stations[0].accent}
              intensity={phase === 'intro' ? LIGHTS.heroAccent.introIntensity : LIGHTS.heroAccent.liveIntensity}
              distance={LIGHTS.heroAccent.distance}
            />
          )}

          <BoatController
            phase={phase}
            bodyRef={boatBody}
            input={input}
            headingRef={headingRef}
            posRef={posRef}
            onNearest={setActive}
            onDock={setDocked}
          />
        </Physics>

        <Ocean />
        <Clouds />
        <Preload all />
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
