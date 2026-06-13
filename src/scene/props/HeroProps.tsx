import { useRef, useState } from 'react';
import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { greetings } from '../../data/portfolio';
import { INTRO, type Phase } from '../../config/intro';
import { HERO_AVATAR, HERO_LAYOUT, HERO_PET } from '../../config/heroModels';
import { smooth } from '../../lib/math';
import {
  Banner,
  GlowMushroom,
  ModelFigure,
  SpeechBubble,
  Tree,
  Workstation,
  type BannerHandle,
  type SpeechBubbleHandle,
  type WorkstationHandle,
} from '../components';

/** Hero welcome scene: waving avatar, speech bubble, banner, workstation, and pet. */
export default function HeroProps({ accent, phase = 'live' }: { accent: string; phase?: Phase }) {
  const startRef = useRef<number | null>(null);
  const bannerRef = useRef<BannerHandle>(null);
  const deskRef = useRef<WorkstationHandle>(null);
  const bubbleRef = useRef<SpeechBubbleHandle>(null);
  const [waveActive, setWaveActive] = useState(false);

  useFrame((state) => {
    let glow = 0;
    if (phase !== 'loading') {
      if (startRef.current === null) startRef.current = state.clock.getElapsedTime();
      const t = state.clock.getElapsedTime() - startRef.current;
      glow = smooth((t - INTRO.glowStart) / (INTRO.glowEnd - INTRO.glowStart));
    }
    bannerRef.current?.setGlow(glow);
    deskRef.current?.setGlow(glow);
    bubbleRef.current?.setOpacity(glow);

    const shouldWave = phase === 'live' || glow > 0.95;
    setWaveActive((prev) => (prev === shouldWave ? prev : shouldWave));
  });

  const { avatar, bubble, banner, desk, pet, sparkles } = HERO_LAYOUT;

  return (
    <group>
      {/* path stones */}
      {[-1.6, -0.8, 0, 0.8, 1.6].map((x, i) => (
        <mesh key={i} castShadow position={[x, 0.05, 1.5 + i * 0.1]} rotation={[-Math.PI / 2, 0, i * 0.25]}>
          <cylinderGeometry args={[0.2, 0.24, 0.07, 6]} />
          <meshStandardMaterial color="#9a8b72" flatShading roughness={1} />
        </mesh>
      ))}

      <Banner ref={bannerRef} accent={accent} z={banner.z} />

      <ModelFigure config={HERO_AVATAR} wave={waveActive} bob z={avatar.z} />

      <SpeechBubble ref={bubbleRef} accent={accent} messages={[...greetings]} x={bubble.x} y={bubble.y} z={bubble.z} />

      <Workstation ref={deskRef} accent={accent} x={desk.x} z={desk.z} rotation={desk.rotation} />

      <ModelFigure config={HERO_PET} x={pet.x} z={pet.z} />

      {/* flora */}
      <Tree x={-3.5} z={-1.3} height={1.3} foliageColor="#45c486" />
      <Tree x={3.2} z={1.5} height={1.0} foliageColor="#55d6a0" />
      <GlowMushroom x={-2.6} z={1.0} accent={accent} />
      <GlowMushroom x={2.5} z={0.8} accent={accent} height={0.85} />

      {phase !== 'loading' && (
        <Sparkles
          count={24}
          scale={[4.5, 3, 2.5]}
          position={[0, sparkles.y, sparkles.z]}
          size={1.6}
          speed={0.3}
          color={accent}
          opacity={0.5}
        />
      )}
    </group>
  );
}
