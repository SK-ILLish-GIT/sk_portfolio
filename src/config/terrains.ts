// ============================================================================
// Selectable island ground themes (CC0 grass + sand textures from Poly Haven).
// The dropdown swaps which pair every island uses. `grassTint` lightly recolors
// the (darkish) grass texture so each theme reads distinctly.
// ============================================================================

export interface Terrain {
  id: string;
  label: string;
  grass: string;
  sand: string;
  /** Multiplied onto the grass texture (per-island accent is layered on top). */
  grassTint: string;
}

export const TERRAINS: Terrain[] = [
  { id: 'meadow', label: 'Meadow', grass: '/textures/grass.jpg', sand: '/textures/sand.jpg', grassTint: '#aef0b2' },
  { id: 'leafy', label: 'Leafy', grass: '/textures/grass-leafy.jpg', sand: '/textures/sand.jpg', grassTint: '#bdf0a0' },
  {
    id: 'forest',
    label: 'Forest',
    grass: '/textures/grass-forest.jpg',
    sand: '/textures/sand-coast.jpg',
    grassTint: '#cdbf8f',
  },
  {
    id: 'snow',
    label: 'Snow',
    grass: '/textures/grass-snow.jpg',
    sand: '/textures/sand-coast.jpg',
    grassTint: '#ffffff',
  },
];

export const DEFAULT_TERRAIN = 'meadow';

export const getTerrain = (id: string) => TERRAINS.find((t) => t.id === id) ?? TERRAINS[0];
