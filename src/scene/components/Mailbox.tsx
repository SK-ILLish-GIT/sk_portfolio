import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  postColor: '#8a5a2b',
  doorColor: '#ffffff',
  flagColor: '#e63946',
  postSegments: 6,
} as const;

export interface MailboxProps extends PlacementProps, AccentProps {
  postColor?: string;
  doorColor?: string;
  flagColor?: string;
}

/** Wooden-post mailbox with accent body, white door, and red flag. */
export function Mailbox({
  accent,
  postColor = DEFAULTS.postColor,
  doorColor = DEFAULTS.doorColor,
  flagColor = DEFAULTS.flagColor,
  ...placement
}: MailboxProps) {
  return (
    <group position={resolvePosition(placement)}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 1.8, DEFAULTS.postSegments]} />
        <meshStandardMaterial color={postColor} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[0.8, 0.55, 1]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh position={[0, 1.9, 0.5]}>
        <boxGeometry args={[0.7, 0.4, 0.05]} />
        <meshStandardMaterial color={doorColor} flatShading />
      </mesh>
      <mesh castShadow position={[0.45, 2.15, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color={flagColor} flatShading />
      </mesh>
      <mesh position={[0.6, 2.25, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial color={flagColor} flatShading />
      </mesh>
    </group>
  );
}
