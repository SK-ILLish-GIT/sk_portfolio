import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  skinColor: '#ffe0bd',
  eyeColor: '#222222',
} as const;

export interface BlockCharacterProps extends PlacementProps, AccentProps {
  skinColor?: string;
}

/** Cute blocky low-poly avatar (body, head, eyes, arms). */
export function BlockCharacter({ accent, skinColor = DEFAULTS.skinColor, ...placement }: BlockCharacterProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color={skinColor} flatShading />
      </mesh>
      <mesh position={[-0.12, 1.32, 0.29]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color={DEFAULTS.eyeColor} />
      </mesh>
      <mesh position={[0.12, 1.32, 0.29]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color={DEFAULTS.eyeColor} />
      </mesh>
      <mesh castShadow position={[-0.48, 0.6, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh castShadow position={[0.48, 0.6, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
    </group>
  );
}
