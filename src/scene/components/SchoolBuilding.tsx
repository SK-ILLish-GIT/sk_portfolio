import { resolvePosition, type AccentProps, type PlacementProps } from './types';

const DEFAULTS = {
  wallColor: '#f3ede1',
  roofColor: '#b8472e',
  windowColor: '#bfe3f2',
  doorColor: '#7a5230',
  trimColor: '#d6cab4',
  foundationColor: '#b9b3a6',
} as const;

export interface SchoolBuildingProps extends PlacementProps, AccentProps {
  width?: number;
  depth?: number;
  height?: number;
  floors?: number;
  cols?: number;
  wallColor?: string;
  roofColor?: string;
  /** Adds a clock tower with a clock face (for the college). */
  clock?: boolean;
  rotationY?: number;
}

/**
 * Low-poly school / college building: foundation, walls with a window grid,
 * a door, a hipped roof, and an optional clock tower. Tunable size + colors so
 * one component covers both small schools and the bigger college.
 */
export function SchoolBuilding({
  accent,
  width = 2.4,
  depth = 2,
  height = 1.8,
  floors = 2,
  cols = 3,
  wallColor = DEFAULTS.wallColor,
  roofColor = DEFAULTS.roofColor,
  clock = false,
  rotationY = 0,
  ...placement
}: SchoolBuildingProps) {
  const winW = 0.32;
  const winH = 0.42;
  const fz = depth / 2 + 0.01;

  // Window grid positions (front + back), leaving room for the door column.
  const windows: { x: number; y: number }[] = [];
  for (let f = 0; f < floors; f++) {
    const y = 0.5 + (f + 0.55) * ((height - 0.4) / floors);
    for (let c = 0; c < cols; c++) {
      const x = (c - (cols - 1) / 2) * (width / (cols + 0.2));
      // skip the center-bottom slot — that's the door
      if (f === 0 && Math.abs(x) < width / (cols + 0.2) / 2) continue;
      windows.push({ x, y });
    }
  }

  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      {/* foundation */}
      <mesh castShadow receiveShadow position={[0, 0.12, 0]}>
        <boxGeometry args={[width + 0.25, 0.24, depth + 0.25]} />
        <meshStandardMaterial color={DEFAULTS.foundationColor} flatShading roughness={1} />
      </mesh>
      {/* walls */}
      <mesh castShadow receiveShadow position={[0, 0.24 + height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={wallColor} flatShading roughness={0.9} />
      </mesh>

      {/* windows on front + back */}
      {windows.map((w, i) => (
        <group key={i}>
          <mesh position={[w.x, 0.24 + w.y, fz]}>
            <boxGeometry args={[winW, winH, 0.06]} />
            <meshStandardMaterial
              color={DEFAULTS.windowColor}
              emissive={DEFAULTS.windowColor}
              emissiveIntensity={0.25}
              flatShading
            />
          </mesh>
          <mesh position={[w.x, 0.24 + w.y, -fz]}>
            <boxGeometry args={[winW, winH, 0.06]} />
            <meshStandardMaterial
              color={DEFAULTS.windowColor}
              emissive={DEFAULTS.windowColor}
              emissiveIntensity={0.25}
              flatShading
            />
          </mesh>
        </group>
      ))}

      {/* door */}
      <mesh castShadow position={[0, 0.24 + 0.45, fz]}>
        <boxGeometry args={[0.5, 0.9, 0.08]} />
        <meshStandardMaterial color={DEFAULTS.doorColor} flatShading roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.24 + 0.92, fz + 0.02]}>
        <boxGeometry args={[0.56, 0.08, 0.06]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>

      {/* hipped roof (square pyramid scaled to the footprint) */}
      <group position={[0, 0.24 + height, 0]} scale={[width * 0.62, 1, depth * 0.62]}>
        <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[1, 0.7, 4]} />
          <meshStandardMaterial color={roofColor} flatShading roughness={1} />
        </mesh>
      </group>

      {clock && (
        <group position={[0, 0, 0]}>
          {/* tower */}
          <mesh castShadow position={[width / 2 - 0.45, 0.24 + height + 0.8, depth / 2 - 0.45]}>
            <boxGeometry args={[0.7, 2, 0.7]} />
            <meshStandardMaterial color={wallColor} flatShading roughness={0.9} />
          </mesh>
          {/* clock face */}
          <mesh
            position={[width / 2 - 0.45, 0.24 + height + 1.25, depth / 2 - 0.45 + 0.36]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
            <meshStandardMaterial color="#fbf6ec" flatShading />
          </mesh>
          <mesh position={[width / 2 - 0.45, 0.24 + height + 1.27, depth / 2 - 0.45 + 0.39]} rotation={[0, 0, 0.6]}>
            <boxGeometry args={[0.03, 0.16, 0.02]} />
            <meshStandardMaterial color="#26303f" />
          </mesh>
          {/* tower roof */}
          <mesh
            castShadow
            position={[width / 2 - 0.45, 0.24 + height + 2, depth / 2 - 0.45]}
            rotation={[0, Math.PI / 4, 0]}
          >
            <coneGeometry args={[0.62, 0.7, 4]} />
            <meshStandardMaterial color={accent} flatShading />
          </mesh>
        </group>
      )}
    </group>
  );
}
