import { useEffect, useState } from 'react';
import Experience from './scene/Experience';
import Overlay from './ui/Overlay';
import Nav from './ui/Nav';
import Loader from './ui/Loader';
import { stations } from './data/portfolio';
import { INTRO, LOADER_MS, type Phase } from './config/intro';
import { DEFAULT_CREATURE } from './scene/creatures/creatures';

export default function App() {
  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState<Phase>('loading');
  const [loadProgress, setLoadProgress] = useState(0);
  const [scrollTo, setScrollTo] = useState<{ index: number; nonce: number }>({
    index: 0,
    nonce: 0,
  });

  useEffect(() => {
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / LOADER_MS);
      setLoadProgress(p);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const toIntro = setTimeout(() => setPhase('intro'), LOADER_MS);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(toIntro);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'intro') return;
    const toLive = setTimeout(() => setPhase('live'), INTRO.total * 1000);
    return () => clearTimeout(toLive);
  }, [phase]);

  const goTo = (index: number) => setScrollTo((s) => ({ index, nonce: s.nonce + 1 }));

  return (
    <>
      <Experience
        active={active}
        setActive={setActive}
        scrollTo={scrollTo}
        phase={phase}
        creatureId={DEFAULT_CREATURE}
      />
      {phase === 'live' && (
        <>
          <Overlay active={active} />
          <Nav active={active} count={stations.length} onGoTo={goTo} />
        </>
      )}
      <Loader phase={phase} progress={loadProgress} />
    </>
  );
}
