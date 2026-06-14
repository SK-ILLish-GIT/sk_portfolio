import { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, Preload } from '@react-three/drei';
import { Physics, RigidBody, CylinderCollider, ConvexHullCollider, type RapierRigidBody } from '@react-three/rapier';
import * as THREE from 'three';
import { stations } from '../data/portfolio';
import { CAMERA, RENDERER, FOG, LIGHTS, ISLAND } from '../config/scene';
import { BOAT_PHYSICS } from '../config/ocean';
import { SKILLS_GAME } from '../config/skillsGame';
import { shieldColliderPoints } from './islandShapes';
import type { Phase } from '../config/intro';
import { useKeyboard } from '../hooks/useKeyboard';
import Island from './Island';
import StationProps from './props';
import CameraRig from './CameraRig';
import Clouds from './Clouds';
import Ocean from './Ocean';
import BoatController from './BoatController';
import { ExploreRing } from './components';

interface ExperienceProps {
  active: number;
  setActive: (i: number) => void;
  docked: number;
  setDocked: (i: number) => void;
  exploring: number;
  phase: Phase;
  headingRef: React.MutableRefObject<number>;
  posRef: React.MutableRefObject<{ x: number; z: number }>;
  terrainId: string;
}

function islandRadius(s: (typeof stations)[number]): number {
  return s.radius ?? (s.id === 'hero' ? ISLAND.heroRadius : ISLAND.defaultRadius);
}

// Convex-hull floor + boat wall for the Skills shield (computed once).
const SKILLS_HULL = shieldColliderPoints(
  SKILLS_GAME.radius * 0.99,
  (SKILLS_GAME.apexDeg * Math.PI) / 180,
  SKILLS_GAME.topY,
  SKILLS_GAME.colliderDepth,
);

export default function Experience({
  setActive,
  docked,
  setDocked,
  exploring,
  phase,
  headingRef,
  posRef,
  terrainId,
}: ExperienceProps) {
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
        <Physics gravity={[0, -9.81, 0]} numSolverIterations={12} numAdditionalFrictionIterations={8}>
          <CameraRig phase={phase} bodyRef={boatBody} exploring={exploring} />

          {stations.map((s, i) => {
            const radius = islandRadius(s);
            const isSkills = s.id === 'skills';
            return (
              <group key={s.id}>
                <Island
                  position={s.position}
                  accent={s.accent}
                  seed={i + 1}
                  radius={radius}
                  terrainId={terrainId}
                  shieldDeg={isSkills ? SKILLS_GAME.apexDeg : undefined}
                >
                  <StationProps id={s.id} accent={s.accent} phase={phase} exploringActive={exploring === i} />
                </Island>
                {/* Boat wall + crate floor. Skills uses a convex-hull shield that
                    matches its shape; other islands use a simple cylinder. */}
                {isSkills ? (
                  <RigidBody type="fixed" colliders={false} position={[s.position[0], 0, s.position[2]]}>
                    <ConvexHullCollider args={[SKILLS_HULL]} />
                  </RigidBody>
                ) : (
                  <RigidBody type="fixed" colliders={false} position={[s.position[0], 0, s.position[2]]}>
                    <CylinderCollider args={[2.5, radius * 1.05]} />
                  </RigidBody>
                )}
              </group>
            );
          })}

          {/* "Press E to explore" zones — hidden while already exploring an island */}
          {phase === 'live' &&
            exploring < 0 &&
            stations.map((s, i) => (
              <ExploreRing
                key={`ring-${s.id}`}
                accent={s.accent}
                x={s.position[0]}
                z={s.position[2]}
                radius={islandRadius(s) * 1.05 + BOAT_PHYSICS.dockRange}
                active={docked === i}
                posRef={posRef}
              />
            ))}

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
            exploring={exploring}
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
