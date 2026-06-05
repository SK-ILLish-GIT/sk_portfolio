import { profile, stations } from '../data/portfolio';

interface NavProps {
  active: number;
  count: number;
  onGoTo: (index: number) => void;
}

export default function Nav({ active, count, onGoTo }: NavProps) {
  return (
    <>
      <div className="brand" style={{ opacity: active === 0 ? 0 : 1 }}>
        {profile.name}
        <span>{profile.title}</span>
      </div>

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

      <div className="scroll-hint" style={{ opacity: active === 0 ? 1 : 0 }}>
        <span className="mouse" />
        Scroll to explore ({count} stops)
      </div>
    </>
  );
}
