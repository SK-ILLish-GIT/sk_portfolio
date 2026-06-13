import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  color: '#cbb48b',
  postColor: '#a8895c',
} as const;

export interface FenceProps extends PlacementProps {
  length?: number;
  rotationY?: number;
  color?: string;
}

/** A low picket fence segment (posts + two rails). */
export function Fence({ length = 2.4, rotationY = 0, color = DEFAULTS.color, ...placement }: FenceProps) {
  const posts = Math.max(2, Math.round(length / 0.6));
  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      {[0.18, 0.42].map((y) => (
        <mesh key={y} castShadow position={[0, y, 0]}>
          <boxGeometry args={[length, 0.05, 0.05]} />
          <meshStandardMaterial color={color} flatShading roughness={1} />
        </mesh>
      ))}
      {Array.from({ length: posts }).map((_, i) => {
        const x = -length / 2 + (i / (posts - 1)) * length;
        return (
          <mesh key={i} castShadow position={[x, 0.28, 0]}>
            <boxGeometry args={[0.08, 0.56, 0.08]} />
            <meshStandardMaterial color={DEFAULTS.postColor} flatShading roughness={1} />
          </mesh>
        );
      })}
    </group>
  );
}
