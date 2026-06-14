// ============================================================================
// Skills island "Stack Attack" — an Angry-Birds-style slingshot game.
// The island is a "shield": the slingshot sits at a corner ON the circle's
// circumference (apex, near -Z end) and the field stretches away along +Z to the
// arc, where the 5 skill-group stacks are spread out. All coordinates are
// island-LOCAL; the island has no extra rotation, so local +Z == world +Z.
// ============================================================================

import type { Vec3 } from '../types/three';

export const SKILLS_GAME = {
  /** Circle radius the shield is cut from (also the island's footprint). */
  radius: 12,
  /** Inscribed angle at the apex/pivot corner (degrees). */
  apexDeg: 120,
  /** Grass surface height (must match Island TOP_Y). */
  topY: 0.9,
  /** Depth of the physics floor/boat-wall below the grass. */
  colliderDepth: 3,

  crate: {
    size: 1.25,
    /** Tiny gap so crates start touching — no settle "drop" that re-wakes them. */
    gap: 0.02,
    mass: 0.7,
    restitution: 0,
    friction: 1.5,
    /** Light damping helps resting stacks sleep without making topples sluggish;
     *  stability comes mainly from the world's higher solver-iteration count. */
    linearDamping: 0.8,
    angularDamping: 1.0,
  },

  /** Button-driven launch tuning. Power 0..1 maps between min/max speed; the
   *  elevation is fixed so direction + power fully determine the shot. */
  launch: {
    minSpeed: 6,
    maxSpeed: 15,
    /** Fixed launch elevation (radians). */
    pitch: 0.5,
  },

  cannon: {
    /** Base position (island-local), sitting on the grass at the apex (near -Z). */
    pos: [0, 0, -9.2] as Vec3,
    /** Largest dimension the model is fit to. */
    targetSize: 4.3,
    /** Yaw offset so the barrel points down-field (+Z) at aim yaw 0. */
    faceYaw: Math.PI / 2,
    /** Model-space euler [pitch, yaw, roll] to align the GLB barrel with aim. */
    modelRot: [0.51, -0.01, -0.09] as Vec3,
    /** Where the bird spawns: muzzle height + how far along the aim the tip is. */
    muzzleY: 1.6,
    barrelOffset: 1.9,
  },

  bird: {
    /** Physics collider radius. */
    radius: 0.4,
    /** Visual model fit size. */
    modelSize: 1.1,
    mass: 2.4,
    restitution: 0.2,
    /** Auto-respawn the bird this long after launch if it hasn't settled. */
    lifeMs: 6000,
  },

  /** A crate counts as "broken" once it drops below this world Y (off the island). */
  breakY: 0.5,

  /** Explore-mode camera: above + behind the apex, looking down the field. */
  camera: {
    pos: [0, 9, -19] as Vec3,
    look: [0, 1.5, 2] as Vec3,
    lerp: 0.05,
  },

  /** Where the 5 stacks sit (island-local x, z) — spread across the far half. */
  stacks: [
    [-7, 2.5],
    [-3.6, 5.5],
    [0, 7.5],
    [3.6, 5.5],
    [7, 2.5],
  ] as Array<[number, number]>,

  /** Ambient props along the shield chord edges (outside the play field). */
  decor: {
    /** Left chord — arc-end segment only; apex half removed so nothing sits in the open field. */
    trees: [
      { x: -6.0, z: -8.5, rotationY: -0.45, path: '/models/trees/tree-5.glb', targetSize: 1.9 },
      { x: -7.3, z: -7.8, rotationY: 0.25, path: '/models/trees/stylized-tree.glb', targetSize: 2.2 },
      { x: -8.5, z: -7.1, rotationY: 0.6, path: '/models/trees/oak-tree.glb', targetSize: 1.8 },
      { x: -9.2, z: -6.5, rotationY: 0.15, path: '/models/trees/tree-1.glb', targetSize: 1.7 },
      { x: -9.8, z: -6.0, rotationY: -0.3, path: '/models/trees/tree-2.glb', targetSize: 1.8 },
    ],
    bushes: [
      { x: -5.4, z: -8.7, size: 0.44, rotationY: 4.2 },
      { x: -5.2, z: -8.3, size: 0.52, rotationY: 4.9 },
      { x: -6.5, z: -8.0, size: 0.28, rotationY: 0.5 },
      { x: -6.3, z: -7.6, size: 0.36, rotationY: 1.2 },
      { x: -7.7, z: -7.3, size: 0.44, rotationY: 1.9 },
      { x: -7.4, z: -6.9, size: 0.52, rotationY: 2.6 },
      { x: -8.8, z: -6.6, size: 0.28, rotationY: 3.3 },
      { x: -8.6, z: -6.2, size: 0.36, rotationY: 4.0 },
      { x: -9.5, z: -6.0, size: 0.32, rotationY: 1.0 },
      { x: -10.0, z: -5.6, size: 0.4, rotationY: 2.2 },
    ],
    /** Right chord — segments tiled end-to-end along the edge (dir 30deg, length 2.2). */
    fences: [
      { x: 1.05, z: -10.82, length: 2.2, rotationY: -0.524 },
      { x: 2.95, z: -9.72, length: 2.2, rotationY: -0.524 },
      { x: 4.86, z: -8.62, length: 2.2, rotationY: -0.524 },
      { x: 6.76, z: -7.52, length: 2.2, rotationY: -0.524 },
      { x: 8.67, z: -6.42, length: 2.2, rotationY: -0.524 },
    ],
    /** Cosmetic TNT crates piled to the left of the cannon (no physics). */
    tnt: [
      { x: -2.2, z: -9.7, rotationY: 0.2 },
      { x: -3.1, z: -10.1, rotationY: -0.35 },
      { x: -1.6, z: -10.3, rotationY: 0.5 },
      { x: -3.7, z: -9.5, rotationY: -0.15 },
      { x: -2.2, z: -9.7, y: 0.8, rotationY: -0.25 },
      { x: -2.9, z: -9.2, rotationY: 0.4 },
    ],
    tntSize: 0.8,
    /** Big mascot bird off to the left, advanced toward the blocks but clear of the firing lane. */
    bigBird: { x: -6.2, z: -4.0, rotationY: 0.7, path: '/models/yellow_angry_bird.glb', targetSize: 4.5 },
    /** Scattered farmyard barrels (cosmetic) — inside the right fence + behind the trees. */
    barrels: [
      { x: 3.4, z: -8.8, rotationY: 0.2 },
      { x: 4.6, z: -7.8, rotationY: -0.3 },
      { x: -4.6, z: -8.4, rotationY: 0.5 },
    ],
    /** Hay bales tucked along the right edge. */
    hay: [
      { x: 5.6, z: -7.2, rotationY: 0.4 },
      { x: 3.0, z: -9.3, rotationY: -0.2 },
    ],
    /** Grey rocks dotted near the shorelines. */
    rocks: [
      { x: -5.2, z: -8.8, size: 0.42 },
      { x: 6.4, z: -7.6, size: 0.5 },
      { x: -8.8, z: -6.6, size: 0.36 },
    ],
    rockColor: '#9aa0a6',
    bushColor: '#3a8f3e',
    fenceColor: '#b8956a',
  },
} as const;
