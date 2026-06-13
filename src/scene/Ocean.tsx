import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OCEAN } from '../config/ocean';
import { clamp01 } from '../lib/math';
import { waveHeight } from '../lib/waves';

const WAVE_AMP = 0.74; // sum of wave amplitudes in lib/waves.ts
const DEEP = new THREE.Color(OCEAN.deepColor);
const SURF = new THREE.Color(OCEAN.surfaceColor);
const FOAM = new THREE.Color('#d6f0fb');
const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * Low-poly animated sea. A flat-shaded plane whose vertices are displaced each
 * frame by the shared `waveHeight` swell — the same function the boat bobs on,
 * so hull and water stay in sync. The plane lies in the X/Z world plane after a
 * -90° rotation, so wave height maps to the geometry's local Z component.
 */
export default function Ocean() {
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const base = useRef<Float32Array | null>(null);

  // Snapshot the flat plane's local positions once so we can re-displace from
  // a clean baseline every frame, and seed a vertex-color buffer for the sea
  // gradient + crest foam.
  const { baseline, colors } = useMemo(() => {
    const g = new THREE.PlaneGeometry(OCEAN.width, OCEAN.length, OCEAN.segmentsX, OCEAN.segmentsZ);
    const positions = g.attributes.position.array.slice() as Float32Array;
    return { baseline: positions, colors: new Float32Array(positions.length) };
  }, []);

  useFrame((state) => {
    const geom = geomRef.current;
    if (!geom) return;
    if (!base.current) base.current = baseline;
    const pos = geom.attributes.position;
    const col = geom.attributes.color;
    const arr = pos.array as Float32Array;
    const carr = col.array as Float32Array;
    const t = state.clock.getElapsedTime();
    const [cx, , cz] = OCEAN.center;

    for (let k = 0; k < arr.length; k += 3) {
      const lx = base.current[k];
      const ly = base.current[k + 1];
      // After the mesh's -90° X rotation: worldX = lx + cx, worldZ = -ly + cz.
      const h = waveHeight(lx + cx, -ly + cz, t);
      arr[k] = lx;
      arr[k + 1] = ly;
      arr[k + 2] = h;

      // Deep troughs → surface → white foam on the crests.
      const d = clamp01((h + WAVE_AMP) / (2 * WAVE_AMP));
      const foam = smoothstep(0.74, 1, d) * 0.9;
      carr[k] = THREE.MathUtils.lerp(THREE.MathUtils.lerp(DEEP.r, SURF.r, d), FOAM.r, foam);
      carr[k + 1] = THREE.MathUtils.lerp(THREE.MathUtils.lerp(DEEP.g, SURF.g, d), FOAM.g, foam);
      carr[k + 2] = THREE.MathUtils.lerp(THREE.MathUtils.lerp(DEEP.b, SURF.b, d), FOAM.b, foam);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    geom.computeVertexNormals();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={OCEAN.center} receiveShadow>
      <planeGeometry ref={geomRef} args={[OCEAN.width, OCEAN.length, OCEAN.segmentsX, OCEAN.segmentsZ]}>
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </planeGeometry>
      <meshStandardMaterial vertexColors flatShading roughness={0.5} metalness={0.05} />
    </mesh>
  );
}
