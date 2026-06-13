import { Text } from '@react-three/drei';
import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  postColor: '#7a5230',
  boardColor: '#a8743f',
} as const;

export interface SignboardProps extends PlacementProps, AccentProps {
  label?: string;
  rotationY?: number;
}

/** A two-post wooden signboard with a routed label. */
export function Signboard({ accent, label = 'CAMPUS', rotationY = 0, ...placement }: SignboardProps) {
  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      {[-0.7, 0.7].map((x) => (
        <mesh key={x} castShadow position={[x, 0.5, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 1, 6]} />
          <meshStandardMaterial color={DEFAULTS.postColor} flatShading roughness={1} />
        </mesh>
      ))}
      <mesh castShadow position={[0, 0.85, 0]}>
        <boxGeometry args={[1.9, 0.55, 0.1]} />
        <meshStandardMaterial color={DEFAULTS.boardColor} flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.85, 0.055]}>
        <boxGeometry args={[1.7, 0.38, 0.04]} />
        <meshStandardMaterial color="#f3e9d6" flatShading />
      </mesh>
      <Text
        position={[0, 0.85, 0.09]}
        fontSize={0.2}
        letterSpacing={0.04}
        anchorX="center"
        anchorY="middle"
        color={accent}
      >
        {label}
      </Text>
    </group>
  );
}
