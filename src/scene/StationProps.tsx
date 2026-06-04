import { useMemo } from 'react';
import * as THREE from 'three';
import { Float } from '@react-three/drei';
import {
  experience,
  projects,
  skillGroups,
  achievements,
  type StationId,
} from '../data/portfolio';

/**
 * Procedural low-poly props for each station. Each component renders only the
 * 3D objects that sit on its island; the textual content lives in the HTML
 * overlay. Keeping them here makes the per-station visuals easy to tweak.
 */

function Tree({ x = 0, z = 0, h = 1, color = '#2f9e44' }) {
  return (
    <group position={[x, 0, z]}>
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.8, 6]} />
        <meshStandardMaterial color="#8a5a2b" flatShading roughness={1} />
      </mesh>
      <mesh castShadow position={[0, 0.9 + h * 0.3, 0]}>
        <coneGeometry args={[0.55 * h, 1.1 * h, 7]} />
        <meshStandardMaterial color={color} flatShading roughness={1} />
      </mesh>
    </group>
  );
}

function HeroProps({ accent }: { accent: string }) {
  return (
    <group>
      {/* signpost */}
      <mesh castShadow position={[0, 1, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 2, 6]} />
        <meshStandardMaterial color="#8a5a2b" flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.7, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.7, 0.18]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      {/* glowing orb above */}
      <Float speed={3} floatIntensity={1.2} rotationIntensity={0}>
        <mesh position={[0, 3.1, 0]}>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.6} flatShading />
        </mesh>
      </Float>
      <Tree x={-2.6} z={-1} h={1.2} />
      <Tree x={2.6} z={1.4} h={0.9} />
    </group>
  );
}

function Character({ accent }: { accent: string }) {
  // A cute blocky low-poly character.
  return (
    <group position={[0, 0.1, 0]}>
      <mesh castShadow position={[0, 0.55, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.45]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.28, 0]}>
        <boxGeometry args={[0.55, 0.55, 0.55]} />
        <meshStandardMaterial color="#ffe0bd" flatShading />
      </mesh>
      {/* eyes */}
      <mesh position={[-0.12, 1.32, 0.29]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[0.12, 1.32, 0.29]}>
        <boxGeometry args={[0.08, 0.08, 0.04]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* arms */}
      <mesh castShadow position={[-0.48, 0.6, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh castShadow position={[0.48, 0.6, 0]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
    </group>
  );
}

function ExperienceProps({ accent }: { accent: string }) {
  // A timeline of rising pillars — one per role.
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

function Building({ x = 0, accent = '#fff' }: { x?: number; accent?: string }) {
  return (
    <group position={[x, 0, 0]}>
      <mesh castShadow position={[0, 0.9, 0]}>
        <boxGeometry args={[1.4, 1.8, 1.2]} />
        <meshStandardMaterial color="#e9ecef" flatShading />
      </mesh>
      {/* screen / window */}
      <mesh position={[0, 1.05, 0.61]}>
        <boxGeometry args={[1, 0.8, 0.05]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.95, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.1, 0.7, 4]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
    </group>
  );
}

function ProjectsProps({ accent }: { accent: string }) {
  return (
    <group>
      {projects.map((_, i) => (
        <Building key={i} x={i === 0 ? -1.2 : 1.2} accent={accent} />
      ))}
    </group>
  );
}

function SkillsProps({ accent }: { accent: string }) {
  const cubes = useMemo(() => {
    return skillGroups.map((_, i) => {
      const angle = (i / skillGroups.length) * Math.PI * 2;
      return {
        x: Math.cos(angle) * 1.7,
        z: Math.sin(angle) * 1.7,
        y: 1.2 + (i % 3) * 0.5,
        s: 0.55,
      };
    });
  }, []);
  return (
    <group>
      {cubes.map((c, i) => (
        <Float key={i} speed={2 + i * 0.3} floatIntensity={1.4} rotationIntensity={1.2}>
          <mesh castShadow position={[c.x, c.y, c.z]}>
            <boxGeometry args={[c.s, c.s, c.s]} />
            <meshStandardMaterial
              color={new THREE.Color(accent).offsetHSL((i * 0.06) % 1, 0, 0)}
              flatShading
              metalness={0.1}
              roughness={0.6}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function EducationProps({ accent }: { accent: string }) {
  // A small temple / institute building with pillars + grad cap.
  return (
    <group>
      <mesh castShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[2.4, 1.4, 1.6]} />
        <meshStandardMaterial color="#f1f3f5" flatShading />
      </mesh>
      {[-0.9, -0.3, 0.3, 0.9].map((x) => (
        <mesh key={x} castShadow position={[x, 0.7, 0.85]}>
          <cylinderGeometry args={[0.12, 0.12, 1.4, 8]} />
          <meshStandardMaterial color="#dee2e6" flatShading />
        </mesh>
      ))}
      <mesh castShadow position={[0, 1.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.7, 0.7, 4]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      {/* grad cap floating */}
      <Float speed={2.5} floatIntensity={1}>
        <group position={[0, 2.9, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.9, 0.1, 0.9]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
          <mesh position={[0, -0.18, 0]}>
            <cylinderGeometry args={[0.22, 0.28, 0.3, 8]} />
            <meshStandardMaterial color="#222" flatShading />
          </mesh>
        </group>
      </Float>
    </group>
  );
}

function CertificationsProps({ accent }: { accent: string }) {
  // Floating medals for achievements + a couple of certificate scrolls.
  return (
    <group>
      {achievements.slice(0, 4).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <Float key={i} speed={2 + i * 0.4} floatIntensity={1.2} rotationIntensity={0.8}>
            <group position={[Math.cos(angle) * 1.7, 1.4 + (i % 2) * 0.5, Math.sin(angle) * 1.7]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.4, 0.4, 0.1, 12]} />
                <meshStandardMaterial color={accent} metalness={0.6} roughness={0.3} flatShading />
              </mesh>
              <mesh position={[0, 0, 0.06]}>
                <torusGeometry args={[0.22, 0.06, 8, 16]} />
                <meshStandardMaterial color="#fff" metalness={0.4} roughness={0.4} />
              </mesh>
            </group>
          </Float>
        );
      })}
      {/* podium */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.7, 0.9, 0.8, 12]} />
        <meshStandardMaterial color="#f1f3f5" flatShading />
      </mesh>
    </group>
  );
}

function ContactProps({ accent }: { accent: string }) {
  return (
    <group>
      {/* mailbox */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 1.8, 6]} />
        <meshStandardMaterial color="#8a5a2b" flatShading />
      </mesh>
      <mesh castShadow position={[0, 1.9, 0]}>
        <boxGeometry args={[0.8, 0.55, 1]} />
        <meshStandardMaterial color={accent} flatShading />
      </mesh>
      <mesh position={[0, 1.9, 0.5]}>
        <boxGeometry args={[0.7, 0.4, 0.05]} />
        <meshStandardMaterial color="#fff" flatShading />
      </mesh>
      {/* little flag */}
      <mesh castShadow position={[0.45, 2.15, 0]}>
        <boxGeometry args={[0.05, 0.4, 0.05]} />
        <meshStandardMaterial color="#e63946" flatShading />
      </mesh>
      <mesh position={[0.6, 2.25, 0]}>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial color="#e63946" flatShading />
      </mesh>
      <Float speed={3} floatIntensity={1.4}>
        <mesh position={[0, 3, 0]}>
          <icosahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.5} flatShading />
        </mesh>
      </Float>
    </group>
  );
}

const MAP: Record<StationId, (p: { accent: string }) => JSX.Element> = {
  hero: HeroProps,
  about: Character,
  experience: ExperienceProps,
  projects: ProjectsProps,
  skills: SkillsProps,
  education: EducationProps,
  certifications: CertificationsProps,
  contact: ContactProps,
};

export default function StationProps({ id, accent }: { id: StationId; accent: string }) {
  const Comp = MAP[id];
  return <Comp accent={accent} />;
}
