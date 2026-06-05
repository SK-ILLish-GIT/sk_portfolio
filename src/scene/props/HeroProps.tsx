import { useRef } from 'react';
import * as THREE from 'three';
import { Sparkles, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { INTRO, type Phase } from '../../config/intro';
import { smooth } from '../../lib/math';
import { GlowMushroom, Tree } from '../components';

const PILLAR_X = 1.85;

/** The welcome gate: stone arch, hanging name plaque, lanterns, and flora. */
export default function HeroProps({ accent, phase = 'live' }: { accent: string; phase?: Phase }) {
  const startRef = useRef<number | null>(null);
  const frameMat = useRef<THREE.MeshStandardMaterial>(null);
  const vineL = useRef<THREE.MeshStandardMaterial>(null);
  const vineR = useRef<THREE.MeshStandardMaterial>(null);
  const keystoneMat = useRef<THREE.MeshStandardMaterial>(null);
  const lanternMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const signLight = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    let glow = 1;
    if (phase === 'loading') {
      glow = 0;
    } else {
      if (startRef.current === null) startRef.current = state.clock.getElapsedTime();
      const t = state.clock.getElapsedTime() - startRef.current;
      glow = smooth((t - INTRO.glowStart) / (INTRO.glowEnd - INTRO.glowStart));
    }
    if (frameMat.current) frameMat.current.emissiveIntensity = glow * 0.9;
    if (vineL.current) vineL.current.emissiveIntensity = glow * 1.4;
    if (vineR.current) vineR.current.emissiveIntensity = glow * 1.4;
    if (keystoneMat.current) keystoneMat.current.emissiveIntensity = glow * 2.0;
    lanternMats.current.forEach((m) => {
      m.emissiveIntensity = 0.2 + glow * 1.1;
    });
    if (signLight.current) signLight.current.intensity = glow * 2.5;
  });

  return (
    <group>
      {/* path stones */}
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.05, 1.5 + i * 0.1]} rotation={[-Math.PI / 2, 0, i * 0.25]}>
          <cylinderGeometry args={[0.2, 0.24, 0.07, 6]} />
          <meshStandardMaterial color="#9a8b72" flatShading roughness={1} />
        </mesh>
      ))}

      {/* pillars */}
      {[-PILLAR_X, PILLAR_X].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh castShadow position={[0, 0.22, 0]}>
            <boxGeometry args={[0.85, 0.44, 0.85]} />
            <meshStandardMaterial color="#7a6a55" flatShading roughness={1} />
          </mesh>
          <mesh castShadow position={[0, 1.6, 0]}>
            <cylinderGeometry args={[0.26, 0.34, 2.85, 8]} />
            <meshStandardMaterial color="#b5a48d" flatShading roughness={1} />
          </mesh>
          <mesh castShadow position={[0, 3.15, 0]}>
            <boxGeometry args={[0.7, 0.28, 0.7]} />
            <meshStandardMaterial color="#9a8b72" flatShading />
          </mesh>
          <mesh position={[x < 0 ? 0.2 : -0.2, 1.5, 0.2]} rotation={[0, 0, x < 0 ? 0.22 : -0.22]}>
            <cylinderGeometry args={[0.045, 0.045, 2.6, 5]} />
            <meshStandardMaterial
              ref={x < 0 ? vineL : vineR}
              color="#3f7d4a"
              emissive={accent}
              emissiveIntensity={0}
              flatShading
            />
          </mesh>
          <mesh position={[0, 3.45, 0.28]}>
            <boxGeometry args={[0.2, 0.26, 0.2]} />
            <meshStandardMaterial
              ref={(m) => {
                if (m) lanternMats.current[x < 0 ? 0 : 1] = m;
              }}
              color={accent}
              emissive={accent}
              emissiveIntensity={0.2}
              flatShading
            />
          </mesh>
        </group>
      ))}

      {/* curved stone arch */}
      <mesh castShadow position={[0, 3.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.05, 0.14, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#c4b59a" flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 3.72, 0.08]} rotation={[0, Math.PI / 4, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial ref={keystoneMat} color={accent} emissive={accent} emissiveIntensity={0} flatShading />
      </mesh>

      {/* hanging sign plaque */}
      {[-0.55, 0.55].map((x) => (
        <mesh key={x} position={[x, 3.05, 0.22]}>
          <cylinderGeometry args={[0.03, 0.03, 0.45, 5]} />
          <meshStandardMaterial color="#5c4326" flatShading />
        </mesh>
      ))}
      <group position={[0, 2.35, 0.38]}>
        <mesh castShadow position={[0, 0, -0.02]}>
          <boxGeometry args={[2.9, 1.55, 0.14]} />
          <meshStandardMaterial ref={frameMat} color="#3d2818" emissive={accent} emissiveIntensity={0} flatShading />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <boxGeometry args={[2.65, 1.35, 0.05]} />
          <meshStandardMaterial color="#faf6ef" flatShading roughness={0.8} />
        </mesh>
        {/* metal corner studs */}
        {[
          [-1.22, 0.6],
          [1.22, 0.6],
          [-1.22, -0.6],
          [1.22, -0.6],
        ].map(([cx, cy], i) => (
          <mesh key={i} position={[cx, cy, 0.07]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#8a7a62" metalness={0.4} roughness={0.5} />
          </mesh>
        ))}
        <pointLight ref={signLight} position={[0, 0, 0.45]} color={accent} intensity={0} distance={5} />

        <Text
          position={[0, 0.52, 0.09]}
          fontSize={0.13}
          letterSpacing={0.22}
          anchorX="center"
          anchorY="middle"
          color={accent}
        >
          WELCOME
        </Text>
        <Text
          position={[0, 0.22, 0.09]}
          fontSize={0.36}
          anchorX="center"
          anchorY="middle"
          color="#1a1028"
          outlineWidth={0.022}
          outlineColor="#ffffff"
        >
          SK Sahil
        </Text>
        <Text
          position={[0, -0.14, 0.09]}
          fontSize={0.36}
          anchorX="center"
          anchorY="middle"
          color="#1a1028"
          outlineWidth={0.022}
          outlineColor="#ffffff"
        >
          Parvez
        </Text>
        <mesh position={[0, -0.42, 0.09]}>
          <boxGeometry args={[1.8, 0.025, 0.02]} />
          <meshStandardMaterial color={accent} />
        </mesh>
        <Text
          position={[0, -0.58, 0.09]}
          fontSize={0.15}
          letterSpacing={0.16}
          anchorX="center"
          anchorY="middle"
          color={accent}
          outlineWidth={0.008}
          outlineColor="#ffffff"
        >
          SOFTWARE ENGINEER
        </Text>
      </group>

      {/* flora */}
      <Tree x={-3.5} z={-1.3} height={1.3} foliageColor="#45c486" />
      <Tree x={3.2} z={1.5} height={1.0} foliageColor="#55d6a0" />
      <GlowMushroom x={-2.6} z={1.0} accent={accent} />
      <GlowMushroom x={2.5} z={0.8} accent={accent} height={0.85} />

      {phase !== 'loading' && (
        <Sparkles
          count={24}
          scale={[4.5, 3, 2.5]}
          position={[0, 2.6, 0.4]}
          size={1.6}
          speed={0.3}
          color={accent}
          opacity={0.5}
        />
      )}
    </group>
  );
}
