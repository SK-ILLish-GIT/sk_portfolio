import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, AdaptiveDpr, Preload } from '@react-three/drei';
import * as THREE from 'three';
import { stations } from '../data/portfolio';
import Island from './Island';
import StationProps from './StationProps';
import CameraRig from './CameraRig';
import Clouds from './Clouds';

interface ExperienceProps {
  active: number;
  setActive: (i: number) => void;
  scrollTo: { index: number; nonce: number };
}

export default function Experience({ setActive, scrollTo }: ExperienceProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 45, position: [0, 3, 12], near: 0.1, far: 200 }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog('#cfe8ff', 22, 90);
      }}
    >
      <hemisphereLight args={['#eaf6ff', '#caa472', 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 16, 10]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={60}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      <Suspense fallback={null}>
        <ScrollControls pages={stations.length} damping={0.28}>
          <CameraRig setActive={setActive} scrollTo={scrollTo} />
          {stations.map((s, i) => (
            <Island key={s.id} position={s.position} accent={s.accent} seed={i + 1}>
              <StationProps id={s.id} accent={s.accent} />
            </Island>
          ))}
        </ScrollControls>
        <Clouds />
        <Preload all />
      </Suspense>

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
