import { useEffect, useRef, useState } from 'react';
import Experience from './scene/Experience';
import ExplorePrompt from './ui/ExplorePrompt';
import Nav from './ui/Nav';
import Compass from './ui/Compass';
import Minimap from './ui/Minimap';
import TerrainPicker from './ui/TerrainPicker';
import Loader from './ui/Loader';
import { stations } from './data/portfolio';
import { INTRO, LOADER_MS, type Phase } from './config/intro';
import { DEFAULT_TERRAIN, TERRAINS } from './config/terrains';
import { useTexture } from '@react-three/drei';

// Preload every terrain's textures so switching in the dropdown is instant.
TERRAINS.forEach((t) => {
  useTexture.preload(t.grass);
  useTexture.preload(t.sand);
});

export default function App() {
  const [active, setActive] = useState(0);
  const [docked, setDocked] = useState(-1);
  const [exploring, setExploring] = useState(-1);
  const [phase, setPhase] = useState<Phase>('loading');
  const [loadProgress, setLoadProgress] = useState(0);
  const [terrainId, setTerrainId] = useState(DEFAULT_TERRAIN);
  const headingRef = useRef(0);
  const posRef = useRef({ x: 0, z: 0 });

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

  // E enters/leaves explore mode for the in-range island; Esc always leaves.
  useEffect(() => {
    if (phase !== 'live') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'KeyE') {
        setExploring((cur) => (cur >= 0 ? -1 : docked));
      } else if (e.code === 'Escape') {
        setExploring((cur) => (cur >= 0 ? -1 : cur));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, docked]);

  // Fast-travel is added in a later phase; for now the boat is sailed manually.
  const goTo = () => {};

  return (
    <>
      <Experience
        active={active}
        setActive={setActive}
        docked={docked}
        setDocked={setDocked}
        exploring={exploring}
        phase={phase}
        headingRef={headingRef}
        posRef={posRef}
        terrainId={terrainId}
      />
      {phase === 'live' && (
        <>
          <ExplorePrompt docked={docked} exploring={exploring} />
          <Nav active={active} docked={docked} exploring={exploring} count={stations.length} onGoTo={goTo} />
          <Compass headingRef={headingRef} />
          <Minimap posRef={posRef} headingRef={headingRef} docked={docked} />
          <TerrainPicker terrainId={terrainId} onSelect={setTerrainId} />
        </>
      )}
      <Loader phase={phase} progress={loadProgress} />
    </>
  );
}
