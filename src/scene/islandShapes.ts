import * as THREE from 'three';

// "Shield" / guitar-pick island for the Skills game: the apex is a point ON the
// circle's circumference with an inscribed angle of `apexRad`, and the far edge
// is the major arc between the two chord endpoints. By the inscribed-angle
// theorem the far arc spans 2*apexRad, so the body stretches well away from the
// apex (a long field with the pivot at the near corner).
//
// Shape-space note: the island extrude does rotateX(-PI/2), mapping shape +Y to
// world -Z. We build the apex at shape +Y so it ends up at the near (-Z) end.

function chordEndpoints(apexRad: number) {
  const half = apexRad / 2;
  const aB = Math.PI / 2 - half; // right endpoint central angle
  const aD = Math.PI / 2 + half; // left endpoint central angle
  return { aB, aD };
}

export function buildShieldShape(radius: number, apexRad: number) {
  const { aB, aD } = chordEndpoints(apexRad);
  const shape = new THREE.Shape();
  shape.moveTo(0, radius); // apex A on the circle
  shape.lineTo(Math.cos(aB) * radius, Math.sin(aB) * radius); // chord A->B
  shape.absarc(0, 0, radius, aB, aD - Math.PI * 2, true); // major arc B->D (the long way)
  shape.lineTo(0, radius); // chord D->A
  shape.closePath();
  return shape;
}

/**
 * Flat vertex list (x, y, z triples) for a ConvexHullCollider matching the
 * shield, in island-local coords (x = shapeX, z = -shapeY). Two rings at
 * `topY` and `topY - depth` so the hull is a solid prism that holds the crates
 * and blocks the boat. The 120-deg shield is convex, so the hull is exact.
 */
export function shieldColliderPoints(
  radius: number,
  apexRad: number,
  topY: number,
  depth: number,
  segments = 28,
): Float32Array {
  const { aB, aD } = chordEndpoints(apexRad);
  const outline: Array<[number, number]> = [[0, radius]]; // apex
  const start = aB;
  const end = aD - Math.PI * 2; // sweep the long way
  for (let i = 0; i <= segments; i++) {
    const a = start + (end - start) * (i / segments);
    outline.push([Math.cos(a) * radius, Math.sin(a) * radius]);
  }
  const pts: number[] = [];
  for (const [sx, sy] of outline) {
    const x = sx;
    const z = -sy;
    pts.push(x, topY, z, x, topY - depth, z);
  }
  return new Float32Array(pts);
}
