import { stations } from '../data/portfolio';
import SectionPanel from './SectionPanel';

/** Fixed HTML panels; the one matching the active station fades in. */
export default function Overlay({ active }: { active: number }) {
  return (
    <div className="overlay">
      {stations.map((s, i) => (
        <div key={s.id} className={`panel ${i === active ? 'is-active' : ''}`} aria-hidden={i !== active}>
          <SectionPanel id={s.id} accent={s.accent} />
        </div>
      ))}
    </div>
  );
}
