import { useMemo } from 'react';
import * as THREE from 'three';
import { resolvePosition, type PlacementProps } from './types';

const DEFAULTS = {
  size: 0.8,
} as const;

let cachedTex: THREE.CanvasTexture | null = null;

/** Shared 128² "TNT" crate face — red body, dark bands, white label. */
function getTntTexture(): THREE.CanvasTexture {
  if (cachedTex) return cachedTex;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b9352b';
  ctx.fillRect(0, 0, 128, 128);
  ctx.fillStyle = '#8c241c';
  ctx.fillRect(0, 18, 128, 14);
  ctx.fillRect(0, 96, 128, 14);

  ctx.fillStyle = '#f7f2e6';
  ctx.font = '900 40px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('TNT', 64, 66);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  cachedTex = tex;
  return tex;
}

export interface TNTProps extends PlacementProps {
  size?: number;
  rotationY?: number;
  /** Show a little fuse on top. */
  fuse?: boolean;
}

/** Cosmetic low-poly TNT crate (no physics). */
export function TNT({ size = DEFAULTS.size, rotationY = 0, fuse = true, ...placement }: TNTProps) {
  const tex = useMemo(() => getTntTexture(), []);
  const [px, py, pz] = resolvePosition(placement);

  return (
    <group position={[px, py + size / 2, pz]} rotation={[0, rotationY, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial map={tex} roughness={0.8} />
      </mesh>
      {fuse && (
        <>
          <mesh castShadow position={[0, size * 0.62, 0]}>
            <cylinderGeometry args={[0.03, 0.03, size * 0.3, 5]} />
            <meshStandardMaterial color="#6b5a45" flatShading roughness={1} />
          </mesh>
          <mesh position={[0, size * 0.8, 0]}>
            <sphereGeometry args={[0.05, 6, 6]} />
            <meshStandardMaterial color="#ffd166" emissive="#ff7b00" emissiveIntensity={1.2} />
          </mesh>
        </>
      )}
    </group>
  );
}
