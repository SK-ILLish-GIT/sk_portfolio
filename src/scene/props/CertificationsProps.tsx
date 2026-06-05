import { Float } from '@react-three/drei';
import { achievements } from '../../data/portfolio';
import { Medal, Podium } from '../components';

/** Floating medals for achievements above a podium. */
export default function CertificationsProps({ accent }: { accent: string }) {
  return (
    <group>
      {achievements.slice(0, 4).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2;
        return (
          <Float key={i} speed={2 + i * 0.4} floatIntensity={1.2} rotationIntensity={0.8}>
            <Medal accent={accent} x={Math.cos(angle) * 1.7} y={1.4 + (i % 2) * 0.5} z={Math.sin(angle) * 1.7} />
          </Float>
        );
      })}
      <Podium y={0} />
    </group>
  );
}
