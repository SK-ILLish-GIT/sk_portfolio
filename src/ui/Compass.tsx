import { useEffect, useRef } from 'react';

/**
 * Nautical compass HUD. Reads the boat's heading from a ref via requestAnimation
 * Frame and rotates the rose directly (no React re-renders). North points along
 * the voyage direction (into the scene); the fixed marker is your current bearing.
 */
export default function Compass({ headingRef }: { headingRef: React.MutableRefObject<number> }) {
  const rose = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      if (rose.current) rose.current.style.transform = `rotate(${-headingRef.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [headingRef]);

  return (
    <div className="compass" aria-hidden>
      <div className="compass-rose" ref={rose}>
        <span className="c-tick c-n">N</span>
        <span className="c-tick c-e">E</span>
        <span className="c-tick c-s">S</span>
        <span className="c-tick c-w">W</span>
        <span className="c-north-dot" />
      </div>
      <span className="compass-lubber" />
    </div>
  );
}
