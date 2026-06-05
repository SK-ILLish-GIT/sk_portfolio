// Registry of selectable guide-creature models. Files live in public/models so
// they are served at /models/... by Vite. `kind: 'procedural'` falls back to the
// hand-built low-poly creature.

export interface CreatureOption {
  id: string;
  label: string;
  kind: 'model' | 'procedural';
  /** Public path to the .glb (model kind only). */
  path?: string;
  /** Regex to pick the flight animation clip; falls back to the first clip. */
  clipMatch?: RegExp;
  /** Extra yaw (radians) so the model's nose points along its travel direction. */
  faceYaw?: number;
  /** Largest dimension the model is scaled to fit, in world units. */
  targetSize?: number;
}

export const CREATURES: CreatureOption[] = [
  {
    id: 'stork',
    label: 'Stork',
    kind: 'model',
    path: '/models/stork.glb',
    clipMatch: /fly/i,
    // Head/beak points along +Z; Object3D.lookAt aims +Z at the target, so no
    // extra yaw is needed for head-first flight.
    faceYaw: 0,
    targetSize: 2.55,
  },
];

export const DEFAULT_CREATURE = 'stork';

export const getCreature = (id: string) => CREATURES.find((c) => c.id === id) ?? CREATURES[0];
