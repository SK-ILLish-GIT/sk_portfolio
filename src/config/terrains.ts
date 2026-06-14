// ============================================================================
// Selectable island ground themes. Default cartoon grass from user textures;
// Photo · * entries use Poly Haven textures.
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
}

const CARTOON_SAND = '/textures/sand-cartoon.jpg';
const STYLIZED = { stylized: true as const, sand: CARTOON_SAND, grassAccentLerp: 0.02 };

export const TERRAINS: Terrain[] = [
  {
    id: 'grass-canopy',
    label: 'Grass · Canopy',
    grass: '/textures/grass-canopy.png',
    grassTint: '#a8b0a4',
    grassRepeat: 0.2,
    ...STYLIZED,
  },
];

export const DEFAULT_TERRAIN = 'grass-canopy';

export const getTerrain = (id: string) => TERRAINS.find((t) => t.id === id) ?? TERRAINS[0];
