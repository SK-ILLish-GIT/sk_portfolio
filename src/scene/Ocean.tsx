import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { stations } from '../data/portfolio';
import { OCEAN } from '../config/ocean';

// Size + center the sea to cover the whole archipelago (with generous margin),
// however far the islands are scattered.
const zsO = stations.map((s) => s.position[2]);
const CENTER: [number, number, number] = [0, 0, (Math.max(...zsO) + Math.min(...zsO)) / 2];
const LENGTH = Math.max(...zsO) - Math.min(...zsO) + 2 * OCEAN.margin;

const DEEP = new THREE.Color(OCEAN.deepColor);
const SURF = new THREE.Color(OCEAN.surfaceColor);
const f = (n: number) => n.toFixed(4);

/**
 * Clean stylized sea: a flat plane shaded by a procedural animated cellular
 * (voronoi) ripple — light cells with brighter rims drifting over a deep→shallow
 * gradient. Flat geometry keeps it crisp (no choppy facets) and the standard
 * material's fog fades the far water into the sky so no edge is ever visible.
 */
export default function Ocean() {
  const uTime = useRef({ value: 0 });

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({ color: OCEAN.surfaceColor, roughness: 0.5, metalness: 0.04 });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uTime.current;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
        .replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvWPos = (modelMatrix * vec4(transformed, 1.0)).xyz;',
        );
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <common>',
          `#include <common>
          varying vec3 vWPos;
          uniform float uTime;
          vec2 wHash(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
          // Voronoi returning F1 (nearest) and the F2-F1 edge gap (small at borders),
          // with slowly drifting cell points → soft caustic veins.
          vec2 wVoro(vec2 p){
            vec2 n = floor(p); vec2 fr = fract(p);
            float md1 = 8.0; float md2 = 8.0;
            for (int j = -1; j <= 1; j++) {
              for (int i = -1; i <= 1; i++) {
                vec2 g = vec2(float(i), float(j));
                vec2 o = wHash(n + g);
                o = 0.5 + 0.5 * sin(uTime * ${f(OCEAN.rippleSpeed)} + 6.2831 * o);
                float d = dot(g + o - fr, g + o - fr);
                if (d < md1) { md2 = md1; md1 = d; } else if (d < md2) { md2 = d; }
              }
            }
            return vec2(sqrt(md1), sqrt(md2) - sqrt(md1));
          }`,
        )
        .replace(
          '#include <color_fragment>',
          `#include <color_fragment>
          {
            vec2 vo = wVoro(vWPos.xz * ${f(OCEAN.cellScale)});
            vec3 deep = vec3(${f(DEEP.r)}, ${f(DEEP.g)}, ${f(DEEP.b)});
            vec3 surf = vec3(${f(SURF.r)}, ${f(SURF.g)}, ${f(SURF.b)});
            // Very soft, low-contrast base with faint caustic veins so the sea
            // reads as a calm backdrop rather than grabbing focus.
            vec3 col = mix(mix(surf, deep, 0.22), surf, smoothstep(0.0, 0.9, vo.x));
            float vein = 1.0 - smoothstep(0.0, 0.10, vo.y);
            col = mix(col, surf + vec3(0.06, 0.07, 0.08), vein * 0.25);
            diffuseColor.rgb = col;
          }`,
        );
    };
    return mat;
  }, []);

  useFrame((state) => {
    uTime.current.value = state.clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={CENTER} receiveShadow material={material}>
      <planeGeometry args={[OCEAN.width, LENGTH, 24, 32]} />
    </mesh>
  );
}
