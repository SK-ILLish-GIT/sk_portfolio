// ============================================================================
// Island ground theme — procedural grass shader (finalized).
// ============================================================================

export interface Terrain {
  id: string;
  label: string;
  grass: string;
  sand: string;
  /** Multiplied onto the grass texture (per-island accent is layered on top). */
  grassTint: string;
  /** Flat-shaded stylized islands — softer repeat, cartoon sand color. */
  stylized?: boolean;
  /** How much each island's accent tints the grass (stylized defaults low). */
  grassAccentLerp?: number;
  /** UV tile scale for the grass map (stylized default 0.18). */
  grassRepeat?: number;
  /** Render the grass top with the procedural shader instead of a texture. */
  shader?: boolean;
}

const CARTOON_SAND = '/textures/sand-cartoon.jpg';
const STYLIZED = { stylized: true as const, sand: CARTOON_SAND, grassAccentLerp: 0.04 };

export const TERRAINS: Terrain[] = [
  {
    id: 'grass-shader',
    label: 'Grass · Shader',
    // `grass` is unused when `shader` is on, but kept valid so the loader is happy.
    grass: '/textures/grass-canopy.png',
    grassTint: '#5f9d52',
    shader: true,
    ...STYLIZED,
  },
];

export const DEFAULT_TERRAIN = 'grass-shader';

export const getTerrain = (id: string) => TERRAINS.find((t) => t.id === id) ?? TERRAINS[0];
