import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import type { Phase } from '../config/intro';

/**
 * Full-screen loader: misty sky, drifting fireflies, and a simple progress bar.
 */
export default function Loader({ phase, progress }: { phase: Phase; progress: number }) {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        dx: `${(Math.random() * 2 - 1) * 52}px`,
        dy: `${(Math.random() * 2 - 1) * 52}px`,
        dur: `${3.5 + Math.random() * 7}s`,
        delay: `${-Math.random() * 8}s`,
        size: `${2 + Math.random() * 4}px`,
      })),
    [],
  );

  if (phase === 'live') return null;
  const pct = Math.round(progress * 100);

  return (
    <div className={`world-loader is-${phase}`} aria-hidden={phase !== 'loading'}>
      <div className="wl-mist" />
      <div className="wl-fireflies">
        {fireflies.map((f, i) => (
          <span
            key={i}
            className="wl-firefly"
            style={
              {
                left: `${f.left}%`,
                top: `${f.top}%`,
                width: f.size,
                height: f.size,
                '--dx': f.dx,
                '--dy': f.dy,
                animationDuration: f.dur,
                animationDelay: f.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="wl-caption">
        <span className="wl-sub">Loading world…</span>
        <div className="wl-progress-track">
          <div className="wl-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="wl-pct">{pct}%</span>
      </div>
    </div>
  );
}
