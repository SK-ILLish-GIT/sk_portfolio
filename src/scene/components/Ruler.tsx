import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  bodyColor: '#f4c430',
  tickColor: '#3a3a3a',
} as const;

export interface RulerProps extends PlacementProps {
  length?: number;
  bodyColor?: string;
  rotation?: [number, number, number];
}

/** A flat wooden ruler with tick marks along one edge. */
export function Ruler({
  length = 2.6,
  bodyColor = DEFAULTS.bodyColor,
  rotation = [0, 0, 0],
  ...placement
}: RulerProps) {
  const ticks = Math.floor(length / 0.22);
  return (
    <group position={resolvePosition(placement)} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[length, 0.06, 0.34]} />
        <meshStandardMaterial color={bodyColor} flatShading roughness={0.8} />
      </mesh>
      {Array.from({ length: ticks }).map((_, i) => {
        const x = -length / 2 + 0.18 + i * 0.22;
        const tall = i % 5 === 0;
        return (
          <mesh key={i} position={[x, 0.035, 0.1]}>
            <boxGeometry args={[0.02, 0.02, tall ? 0.14 : 0.08]} />
            <meshStandardMaterial color={DEFAULTS.tickColor} />
          </mesh>
        );
      })}
    </group>
  );
}
