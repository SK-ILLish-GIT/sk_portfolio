import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import * as THREE from 'three';
import { Billboard, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  cycleMs: 2200,
  fadeSpeed: 4,
} as const;

export interface SpeechBubbleHandle {
  setOpacity: (opacity: number) => void;
}

export interface SpeechBubbleProps extends PlacementProps, AccentProps {
  messages: string[];
}

/** Billboard speech bubble that cycles through greeting messages. */
export const SpeechBubble = forwardRef<SpeechBubbleHandle, SpeechBubbleProps>(function SpeechBubble(
  { accent, messages, ...placement },
  ref,
) {
  const [index, setIndex] = useState(0);
  const bubbleMat = useRef<THREE.MeshStandardMaterial>(null);
  const tailMat = useRef<THREE.MeshStandardMaterial>(null);
  const labelRef = useRef<Group & { fillOpacity: number; sync: () => void }>(null);
  const targetOpacity = useRef(0);
  const currentOpacity = useRef(0);

  useImperativeHandle(ref, () => ({
    setOpacity: (opacity: number) => {
      targetOpacity.current = opacity;
    },
  }));

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, DEFAULTS.cycleMs);
    return () => window.clearInterval(id);
  }, [messages.length]);

  useFrame((_, delta) => {
    currentOpacity.current = THREE.MathUtils.lerp(
      currentOpacity.current,
      targetOpacity.current,
      delta * DEFAULTS.fadeSpeed,
    );
    const o = currentOpacity.current * 0.95;
    if (bubbleMat.current) bubbleMat.current.opacity = o;
    if (tailMat.current) tailMat.current.opacity = o;
    if (labelRef.current) {
      labelRef.current.fillOpacity = o;
      labelRef.current.sync();
    }
  });

  const label = messages[index] ?? messages[0] ?? '';

  return (
    <Billboard position={resolvePosition(placement)} follow lockX lockZ>
      <group>
        <mesh position={[0, 0, -0.02]}>
          <boxGeometry args={[1.35, 0.55, 0.08]} />
          <meshStandardMaterial ref={bubbleMat} color="#ffffff" transparent opacity={0} flatShading roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.32, 0]}>
          <coneGeometry args={[0.12, 0.2, 4]} />
          <meshStandardMaterial ref={tailMat} color="#ffffff" transparent opacity={0} flatShading />
        </mesh>
        <Text
          ref={labelRef}
          position={[0, 0, 0.04]}
          fontSize={0.18}
          anchorX="center"
          anchorY="middle"
          color={accent}
          outlineWidth={0.012}
          outlineColor="#ffffff"
          fillOpacity={0}
        >
          {label}
        </Text>
      </group>
    </Billboard>
  );
});
