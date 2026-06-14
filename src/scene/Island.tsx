import { useMemo, type ReactNode } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { mulberry32 } from '../lib/prng';
import { ISLAND } from '../config/scene';
import { getTerrain } from '../config/terrains';
import { buildShieldShape } from './islandShapes';
import type { Vec3 } from '../types/three';

interface IslandProps {
  position: Vec3;
  accent: string;
  radius?: number;
  seed?: number;
  terrainId: string;
  /** When set, the island is a "shield" with this apex (inscribed) angle in deg,
   *  the pivot corner at the near (-Z) end and the arc body stretching to +Z. */
  shieldDeg?: number;
  children?: ReactNode;
}

const TOP_Y = 0.9; // grass surface where props stand
const DEPTH = 3.8; // total slab thickness (extends below the waterline)
const GRASS_H = 0.38; // thin grassy lip — only a little green shows on the sides
const OVERHANG = 1.035; // grass laps slightly over the sand beach below

/** The island's 2D outline: an irregular rounded polygon (varied per seed). */
function buildShape(radius: number, seed: number) {
  const rng = mulberry32(Math.floor(seed * 5331) + 13);
  const sides = 4 + Math.floor(rng() * 3); // 4, 5 or 6 → square / pentagon / hex
  const rot = rng() * Math.PI * 2;
  const cornerR = radius * (0.18 + rng() * 0.14);

  const verts: THREE.Vector2[] = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2;
    const rr = radius * (0.9 + rng() * 0.18); // irregular per-corner radius
    verts.push(new THREE.Vector2(Math.cos(a) * rr, Math.sin(a) * rr));
  }

  const shape = new THREE.Shape();
  for (let i = 0; i < sides; i++) {
    const cur = verts[i];
    const prev = verts[(i - 1 + sides) % sides];
    const next = verts[(i + 1) % sides];
    const toPrev = prev.clone().sub(cur).normalize();
    const toNext = next.clone().sub(cur).normalize();
    const cr = Math.min(cornerR, prev.distanceTo(cur) * 0.45, next.distanceTo(cur) * 0.45);
    const entry = cur.clone().addScaledVector(toPrev, cr);
    const exit = cur.clone().addScaledVector(toNext, cr);
    if (i === 0) shape.moveTo(entry.x, entry.y);
    else shape.lineTo(entry.x, entry.y);
    shape.quadraticCurveTo(cur.x, cur.y, exit.x, exit.y);
  }
  shape.closePath();
  return shape;
}

function extrudeSlab(shape: THREE.Shape, depth: number, topY: number, bevel: number) {
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    steps: 1,
    curveSegments: 6,
  });
  geo.rotateX(-Math.PI / 2); // lay flat; extrude becomes vertical (0..depth in Y)
  geo.translate(0, topY - depth, 0); // seat the top cap at topY
  return geo;
}

/**
 * Two stacked slabs from the same varied rounded-polygon outline: a grassy top
 * (its short sides show green and overhang slightly) over a sand beach base —
 * the menawer-style grass lip + beach. Each island's outline differs by seed.
 */
function makeIslandGeometries(radius: number, seed: number, shieldDeg?: number) {
  const shape = shieldDeg ? buildShieldShape(radius, (shieldDeg * Math.PI) / 180) : buildShape(radius, seed);
  const grass = extrudeSlab(shape, GRASS_H, TOP_Y, 0.1);
  grass.scale(OVERHANG, 1, OVERHANG); // overhang the beach
  const sand = extrudeSlab(shape, DEPTH, TOP_Y - GRASS_H + 0.12, 0.35);
  return { grass, sand };
}

export default function Island({
  position,
  accent,
  radius = ISLAND.defaultRadius,
  seed = 1,
  terrainId,
  shieldDeg,
  children,
}: IslandProps) {
  const terrain = getTerrain(terrainId);

  const { grassMap, sandMap } = useTexture({ grassMap: terrain.grass, sandMap: terrain.sand });
  const stylized = terrain.stylized ?? false;
  const grassRepeat = terrain.grassRepeat ?? (stylized ? 0.18 : 0.42);
  useMemo(() => {
    [grassMap, sandMap].forEach((t) => {
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(grassRepeat, grassRepeat);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = stylized ? 1 : 4;
      t.needsUpdate = true;
    });
  }, [grassMap, sandMap, stylized, grassRepeat]);

  const accentLerp = terrain.grassAccentLerp ?? (stylized ? 0.04 : 0.22);
  const grass = useMemo(() => {
    const base = new THREE.Color(terrain.grassTint);
    return base.lerp(new THREE.Color(accent), accentLerp);
  }, [terrain.grassTint, accent, accentLerp]);

  const { grass: grassGeo, sand: sandGeo } = useMemo(
    () => makeIslandGeometries(radius, seed, shieldDeg),
    [radius, seed, shieldDeg],
  );

  const bushes = useMemo(() => {
    if (shieldDeg) return []; // keep the game field clear
    const rng = mulberry32(Math.floor(seed * 9973) + 7);
    return Array.from({ length: 5 }, () => {
      const angle = rng() * Math.PI * 2;
      const dist = radius * (0.3 + rng() * 0.4);
      const s = 0.35 + rng() * 0.5;
      return { x: Math.cos(angle) * dist, z: Math.sin(angle) * dist, s, rocky: rng() > 0.6 };
    });
  }, [radius, seed, shieldDeg]);

  return (
    <group position={[position[0], 0, position[2]]}>
      {/* sand beach base */}
      <mesh geometry={sandGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={sandMap}
          color={stylized ? '#d9cdb5' : '#efe2c0'}
          roughness={1}
          flatShading={stylized}
        />
      </mesh>
      {/* grassy top slab — its short overhanging sides show green */}
      <mesh geometry={grassGeo} castShadow receiveShadow>
        <meshStandardMaterial map={grassMap} color={grass} roughness={1} flatShading={stylized} />
      </mesh>

      {/* scattered bushes / rocks on the grass */}
      {bushes.map((b, i) => (
        <mesh key={i} castShadow position={[b.x, TOP_Y + 0.05 + b.s * 0.4, b.z]}>
          <icosahedronGeometry args={[b.s, 0]} />
          <meshStandardMaterial
            color={b.rocky ? '#9aa0a6' : new THREE.Color(grass).offsetHSL(0, 0, -0.1)}
            flatShading
            roughness={1}
          />
        </mesh>
      ))}

      {/* station-specific props sit on the grass */}
      <group position={[0, TOP_Y, 0]}>{children}</group>
    </group>
  );
}
