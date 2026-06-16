import { stations } from '../data/portfolio';

interface NavProps {
  docked: number;
  count: number;
}

export default function Nav({ docked, count }: NavProps) {
  const dockedStation = docked >= 0 ? stations[docked] : null;
  return (
    <div className="scroll-hint" style={{ opacity: dockedStation ? 0 : 1 }}>
      <span className="mouse" />
      Sail with WASD / arrows · {count} islands
    </div>
  );
}
