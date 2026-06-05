import { Column, GradCap } from '../components';

const PILLAR_X = [-0.9, -0.3, 0.3, 0.9] as const;

/** A small temple / institute building with pillars and a floating grad cap. */
export default function EducationProps({ accent }: { accent: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[2.4, 1.4, 1.6]} />
        <meshStandardMaterial color="#f1f3f5" flatShading />
      </mesh>
      {PILLAR_X.map((x) => (
        <Column key={x} x={x} y={0} z={0.85} />
      ))}
      <mesh castShadow position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.7, 0.7, 4]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <GradCap y={2.9} floating />
    </group>
  );
}
