import { useCallback, useEffect, useRef, useState } from 'react';
import Experience from './scene/Experience';
import ExplorePrompt from './ui/ExplorePrompt';
import SkillsHud from './ui/SkillsHud';
import Nav from './ui/Nav';
import Compass from './ui/Compass';
import Minimap from './ui/Minimap';
import TerrainPicker from './ui/TerrainPicker';
import Loader from './ui/Loader';
import RotateGate from './ui/RotateGate';
import TouchControls from './ui/TouchControls';
import CornerActions from './ui/CornerActions';
import { useDeviceMode } from './hooks/useDeviceMode';
import { stations } from './data/portfolio';
import { skillsGame, useSkillsGame } from './scene/skills/store';
import { INTRO, LOADER_MS, type Phase } from './config/intro';

const SKILLS_INDEX = stations.findIndex((s) => s.id === 'skills');
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
  const { isTouch, isPortrait } = useDeviceMode();
  const { won: skillsWon } = useSkillsGame();
  const touchBlocked = isTouch && isPortrait;

  const toggleExplore = useCallback(() => {
    setExploring((cur) => (cur >= 0 ? -1 : docked));
  }, [docked]);

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

  // Dev-only: ?e2e=skills skips the intro and opens the skills game for Playwright checks.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    if (new URLSearchParams(window.location.search).get('e2e') !== 'skills') return;
    setPhase('live');
    setExploring(SKILLS_INDEX);
    setDocked(SKILLS_INDEX);
  }, []);

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

  // Start the Skills game fresh each time you enter that island.
  useEffect(() => {
    if (exploring === SKILLS_INDEX) skillsGame.reset();
  }, [exploring]);

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
      {phase === 'live' && !touchBlocked && (
        <>
          <ExplorePrompt docked={docked} exploring={exploring} />
          {exploring === SKILLS_INDEX && <SkillsHud />}
          <Nav active={active} docked={docked} exploring={exploring} count={stations.length} onGoTo={goTo} />
          <Compass headingRef={headingRef} />
          <Minimap posRef={posRef} headingRef={headingRef} docked={docked} />
          <TerrainPicker terrainId={terrainId} onSelect={setTerrainId} />
          <CornerActions
            exploring={exploring}
            skillsIndex={SKILLS_INDEX}
            onLeave={toggleExplore}
            raised={isTouch && exploring === SKILLS_INDEX && !skillsWon}
          />
          {isTouch && (
            <TouchControls docked={docked} exploring={exploring} skillsIndex={SKILLS_INDEX} onExplore={toggleExplore} />
          )}
        </>
      )}
      <Loader phase={phase} progress={loadProgress} />
      <RotateGate />
    </>
  );
}
