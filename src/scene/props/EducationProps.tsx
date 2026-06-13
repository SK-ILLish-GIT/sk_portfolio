import { Bench, BookStack, Fence, GradCap, Pencil, Ruler, SchoolBuilding, Signboard, Tree } from '../components';

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Education campus: a college (with clock tower), two schools, a stone path,
 *  benches, trees, a fence, a signboard, and oversized school supplies. */
export default function EducationProps({ accent }: { accent: string }) {
  // Stone walkway: a central spine + branches out to each school.
  const path: [number, number][] = [];
  for (let z = 6; z >= -1.6; z -= 0.85) path.push([Math.sin(z * 0.25) * 0.5, z]);
  for (let t = 0; t <= 1; t += 0.2) {
    path.push([lerp(0, -4.4, t), lerp(2.4, 0.8, t)]);
    path.push([lerp(0, 4.4, t), lerp(2.4, 1.3, t)]);
  }

  return (
    <group>
      {/* stone path */}
      {path.map(([x, z], i) => (
        <mesh key={i} position={[x, 0.03, z]} rotation={[-Math.PI / 2, 0, (i % 3) * 0.4]} receiveShadow>
          <cylinderGeometry args={[0.34, 0.4, 0.07, 6]} />
          <meshStandardMaterial color="#d8c7a0" flatShading roughness={1} />
        </mesh>
      ))}

      {/* college — biggest, with a clock tower */}
      <SchoolBuilding
        accent={accent}
        position={[0, 0, -3.8]}
        width={3.4}
        depth={2.8}
        height={2.8}
        floors={3}
        cols={4}
        clock
        wallColor="#ece4d2"
        roofColor="#7b3f2a"
      />

      {/* two schools, angled to face the campus */}
      <SchoolBuilding
        accent="#06d6a0"
        position={[-5.2, 0, 0.3]}
        rotationY={0.5}
        width={2.5}
        depth={2}
        height={1.7}
        floors={2}
        cols={3}
        wallColor="#f3ede1"
        roofColor="#c0492e"
      />
      <SchoolBuilding
        accent="#4cc9f0"
        position={[5.2, 0, 0.9]}
        rotationY={-0.5}
        width={2.5}
        depth={2}
        height={1.7}
        floors={2}
        cols={3}
        wallColor="#eef1f4"
        roofColor="#3f6f8a"
      />

      {/* signboard at the campus entrance */}
      <Signboard accent={accent} label="EDUCATION" position={[1.4, 0, 6.2]} rotationY={-0.2} />

      {/* benches along the path */}
      <Bench position={[-1.9, 0, 3.6]} rotationY={0.5} />
      <Bench position={[2.2, 0, 4]} rotationY={-0.6} />

      {/* trees + greenery at the edges */}
      <Tree x={-6.8} z={-2} height={1.7} foliageColor="#3faf6f" />
      <Tree x={6.7} z={-2.6} height={1.9} foliageColor="#45c486" />
      <Tree x={-6.2} z={4.4} height={1.4} foliageColor="#3faf6f" />
      <Tree x={6.4} z={4.8} height={1.5} foliageColor="#55d6a0" />

      {/* oversized fun supplies (reference style) */}
      <GradCap position={[0, 4.2, -3.8]} floating />
      <BookStack position={[-3.4, 0, 4.6]} rotationY={0.3} />
      <Pencil position={[3.6, 0.18, 5.2]} rotation={[0, 0.3, Math.PI / 2 - 0.08]} />
      <Ruler position={[1.8, 0.06, 5.4]} rotation={[0, -0.5, 0]} />

      {/* low fence around the front */}
      <Fence position={[-3.4, 0, 7]} length={3} />
      <Fence position={[4.2, 0, 7]} length={2.6} />
      <Fence position={[-6.7, 0, 3]} rotationY={Math.PI / 2} length={3} />
      <Fence position={[6.7, 0, 3.2]} rotationY={Math.PI / 2} length={3} />
    </group>
  );
}
