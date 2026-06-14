import * as THREE from 'three';

/**
 * Procedural stylized-grass material — same approach as the Ocean: a
 * MeshStandardMaterial whose diffuse is overridden in `onBeforeCompile` with
 * world-space value-noise. Low-frequency patches give soft light/dark mottling
 * and a higher-frequency band adds faint blade speckle, all derived from the
 * material's base `color` (so each island's tint still drives the look). No
 * texture, no animation — cheap and crisp.
 */
export function createGrassMaterial(base: THREE.Color, flat = true): THREE.MeshStandardMaterial {
  const mat = new THREE.MeshStandardMaterial({ color: base, roughness: 1, flatShading: flat });

  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vWPosG;')
      .replace(
        '#include <begin_vertex>',
        '#include <begin_vertex>\nvWPosG = (modelMatrix * vec4(transformed, 1.0)).xyz;',
      );

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        varying vec3 vWPosG;
        float gHash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float gNoise(vec2 p){
          vec2 i = floor(p); vec2 fr = fract(p);
          vec2 u = fr * fr * (3.0 - 2.0 * fr);
          float a = gHash(i), b = gHash(i + vec2(1.0, 0.0));
          float c = gHash(i + vec2(0.0, 1.0)), d = gHash(i + vec2(1.0, 1.0));
          return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
        }
        float gFbm(vec2 p){
          float v = 0.0, a = 0.5;
          for (int i = 0; i < 4; i++) { v += a * gNoise(p); p *= 2.0; a *= 0.5; }
          return v;
        }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        {
          vec2 q = vWPosG.xz;
          float patches = gFbm(q * 0.16);
          float blades = gNoise(q * 3.4);
          vec3 base = diffuseColor.rgb;
          vec3 dark = base * 0.70;
          vec3 light = mix(base, vec3(1.0), 0.16);
          vec3 col = mix(dark, light, smoothstep(0.15, 0.85, patches));
          col = mix(col, dark, smoothstep(0.6, 1.0, blades) * 0.3);
          diffuseColor.rgb = col;
        }`,
      );
  };

  return mat;
}
