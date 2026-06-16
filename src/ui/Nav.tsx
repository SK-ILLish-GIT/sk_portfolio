import { stations } from '../data/portfolio';

interface NavProps {
  active: number;
  docked: number;
  count: number;
  onGoTo: (index: number) => void;
}

export default function Nav({ active, docked, count, onGoTo }: NavProps) {
  const dockedStation = docked >= 0 ? stations[docked] : null;
  return (
    <>
      <nav className="nav-dots" aria-label="Sections">
        {stations.map((s, i) => (
          <button
            key={s.id}
            className={i === active ? 'active' : ''}
            aria-label={s.label}
            aria-current={i === active}
            onClick={() => onGoTo(i)}
          >
            <span className="tip">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="scroll-hint" style={{ opacity: dockedStation ? 0 : 1 }}>
        <span className="mouse" />
        Sail with WASD / arrows · {count} islands
      </div>
    </>
  );
}
