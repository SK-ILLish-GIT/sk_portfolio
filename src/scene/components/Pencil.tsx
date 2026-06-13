import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  bodyColor: '#f4c430',
  tipColor: '#d9a066',
  leadColor: '#3a3a3a',
  eraserColor: '#ef9a9a',
  bandColor: '#cfcfcf',
} as const;

export interface PencilProps extends PlacementProps {
  length?: number;
  bodyColor?: string;
  rotation?: [number, number, number];
}

/** An oversized hexagonal pencil — body, sharpened tip, eraser. */
export function Pencil({
  length = 2.4,
  bodyColor = DEFAULTS.bodyColor,
  rotation = [0, 0, 0],
  ...placement
}: PencilProps) {
  const r = 0.16;
  return (
    <group position={resolvePosition(placement)} rotation={rotation}>
      {/* body (hex prism along Y) */}
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[r, r, length, 6]} />
        <meshStandardMaterial color={bodyColor} flatShading roughness={0.8} />
      </mesh>
      {/* sharpened wood tip */}
      <mesh castShadow position={[0, length / 2 + 0.16, 0]}>
        <coneGeometry args={[r, 0.34, 6]} />
        <meshStandardMaterial color={DEFAULTS.tipColor} flatShading />
      </mesh>
      {/* lead */}
      <mesh position={[0, length / 2 + 0.33, 0]}>
        <coneGeometry args={[0.05, 0.12, 6]} />
        <meshStandardMaterial color={DEFAULTS.leadColor} flatShading />
      </mesh>
      {/* metal band + eraser */}
      <mesh position={[0, -length / 2 - 0.04, 0]}>
        <cylinderGeometry args={[r + 0.01, r + 0.01, 0.12, 6]} />
        <meshStandardMaterial color={DEFAULTS.bandColor} metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh castShadow position={[0, -length / 2 - 0.18, 0]}>
        <cylinderGeometry args={[r, r, 0.18, 6]} />
        <meshStandardMaterial color={DEFAULTS.eraserColor} flatShading />
      </mesh>
    </group>
  );
}
