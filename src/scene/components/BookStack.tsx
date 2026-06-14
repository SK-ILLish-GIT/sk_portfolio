import { resolvePosition, type PlacementProps } from './types';

const COVERS = ['#c0392b', '#2e86c1', '#27ae60', '#8e44ad', '#e67e22'] as const;
const PAGE = '#f7f1e3';

export interface BookStackProps extends PlacementProps {
  count?: number;
  rotationY?: number;
  /** Override default cover palette (one color per book). */
  coverColors?: string[];
}

/** A leaning stack of chunky low-poly books. */
export function BookStack({ count = 3, rotationY = 0, coverColors, ...placement }: BookStackProps) {
  const books = Array.from({ length: count });
  let y = 0;
  return (
    <group position={resolvePosition(placement)} rotation={[0, rotationY, 0]}>
      {books.map((_, i) => {
        const w = 1.1 - i * 0.12;
        const d = 0.8 - i * 0.08;
        const h = 0.2;
        const yaw = (i % 2 === 0 ? 1 : -1) * (0.06 + i * 0.03);
        y += h;
        const cy = y - h / 2;
        return (
          <group key={i} position={[0, cy, 0]} rotation={[0, yaw, 0]}>
            {/* cover */}
            <mesh castShadow>
              <boxGeometry args={[w, h, d]} />
              <meshStandardMaterial
                color={(coverColors ?? COVERS)[i % (coverColors?.length ?? COVERS.length)]}
                flatShading
                roughness={0.85}
              />
            </mesh>
            {/* page block (slightly inset, lighter) */}
            <mesh position={[0.02, 0, 0]}>
              <boxGeometry args={[w - 0.06, h - 0.06, d - 0.04]} />
              <meshStandardMaterial color={PAGE} flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
