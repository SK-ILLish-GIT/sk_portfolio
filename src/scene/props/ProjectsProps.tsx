import { projects } from '../../data/portfolio';
import { Building } from '../components';

/** Small low-poly buildings — one per project. */
export default function ProjectsProps({ accent }: { accent: string }) {
  return (
    <group>
      {projects.map((_, i) => (
        <Building key={i} x={i === 0 ? -1.2 : 1.2} accent={accent} />
      ))}
    </group>
  );
}
