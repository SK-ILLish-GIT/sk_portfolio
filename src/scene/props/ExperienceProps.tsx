import * as THREE from 'three';
import { experience } from '../../data/portfolio';

/** A timeline of rising pillars — one per role. */
export default function ExperienceProps({ accent }: { accent: string }) {
  return (
    <group position={[-1.6, 0, 0]}>
      {experience.map((_, i) => {
        const h = 1 + (experience.length - i) * 0.6;
        return (
          <group key={i} position={[i * 1.6, 0, 0]}>
            <mesh castShadow position={[0, h / 2, 0]}>
              <boxGeometry args={[0.8, h, 0.8]} />
              <meshStandardMaterial
                color={new THREE.Color(accent).offsetHSL(0, 0, i * -0.05)}
                flatShading
                roughness={0.9}
              />
            </mesh>
            <mesh position={[0, h + 0.18, 0]}>
              <boxGeometry args={[0.95, 0.18, 0.95]} />
              <meshStandardMaterial color="#fff" flatShading />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
