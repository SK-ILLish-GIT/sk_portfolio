const PUFF_BLOBS: [number, number, number, number][] = [
  [0, 0, 0, 1],
  [0.8, -0.1, 0, 0.7],
  [-0.8, -0.1, 0.1, 0.7],
  [0.3, 0.3, -0.2, 0.6],
];

const DEFAULTS = {
  color: '#ffffff',
  opacity: 0.9,
  segments: 0,
} as const;

export interface CloudPuffProps {
  color?: string;
  opacity?: number;
  scale?: number;
}

/** Single low-poly cloud cluster made of overlapping icosahedrons. */
export function CloudPuff({ color = DEFAULTS.color, opacity = DEFAULTS.opacity, scale = 1 }: CloudPuffProps) {
  return (
    <group scale={scale}>
      {PUFF_BLOBS.map(([x, y, z, s], i) => (
        <mesh key={i} position={[x, y, z]}>
          <icosahedronGeometry args={[s, DEFAULTS.segments]} />
          <meshStandardMaterial color={color} flatShading roughness={1} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}
