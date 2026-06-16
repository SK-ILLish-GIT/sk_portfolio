import { useCallback, useEffect, useRef, useState } from 'react';
import Experience from './scene/Experience';
import SkillsHud from './ui/SkillsHud';
import Nav from './ui/Nav';
import Compass from './ui/Compass';
import Minimap from './ui/Minimap';
import Loader from './ui/Loader';
import RotateGate from './ui/RotateGate';
import ResumeViewer from './ui/ResumeViewer';
import SectionDetailModal from './ui/SectionDetailModal';
import IslandActions from './ui/IslandActions';
import TouchControls from './ui/TouchControls';
import CornerActions from './ui/CornerActions';
import { useDeviceMode } from './hooks/useDeviceMode';
import { stations, profile } from './data/portfolio';
import { skillsGame, useSkillsGame } from './scene/skills/store';
import { INTRO, LOADER_MS, type Phase } from './config/intro';

const SKILLS_INDEX = stations.findIndex((s) => s.id === 'skills');
import { DEFAULT_TERRAIN, getTerrain } from './config/terrains';
import { useTexture } from '@react-three/drei';

const defaultTerrain = getTerrain(DEFAULT_TERRAIN);
useTexture.preload(defaultTerrain.grass);
useTexture.preload(defaultTerrain.sand);

export default function App() {
  const [active, setActive] = useState(0);
  const [docked, setDocked] = useState(-1);
  const [exploring, setExploring] = useState(-1);
  const [phase, setPhase] = useState<Phase>('loading');
  const [loadProgress, setLoadProgress] = useState(0);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [sectionDetailOpen, setSectionDetailOpen] = useState(false);
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

  const islandForDetails = exploring >= 0 ? exploring : docked;

  // E enters/leaves explore mode for the in-range island; Esc always leaves.
  useEffect(() => {
    if (phase !== 'live') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        if (resumeOpen) {
          setResumeOpen(false);
          return;
        }
        if (sectionDetailOpen) {
          setSectionDetailOpen(false);
          return;
        }
        setExploring((cur) => (cur >= 0 ? -1 : cur));
      } else if (e.code === 'KeyE') {
        setExploring((cur) => (cur >= 0 ? -1 : docked));
      } else if (e.code === 'KeyI') {
        if (islandForDetails >= 0) setSectionDetailOpen((cur) => !cur);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, docked, islandForDetails, resumeOpen, sectionDetailOpen]);

  useEffect(() => {
    if (islandForDetails < 0) setSectionDetailOpen(false);
  }, [islandForDetails]);

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
        terrainId={DEFAULT_TERRAIN}
      />
      {phase === 'live' && !touchBlocked && (
        <>
          {exploring === SKILLS_INDEX && <SkillsHud />}
          <Nav active={active} docked={docked} count={stations.length} onGoTo={goTo} />
          {exploring < 0 && !sectionDetailOpen && (
            <IslandActions
              docked={docked}
              isTouch={isTouch}
              onExplore={toggleExplore}
              onDetails={() => setSectionDetailOpen(true)}
            />
          )}
          <Compass headingRef={headingRef} />
          <Minimap posRef={posRef} headingRef={headingRef} docked={docked} />
          <CornerActions
            exploring={exploring}
            skillsIndex={SKILLS_INDEX}
            onLeave={toggleExplore}
            onDetails={() => setSectionDetailOpen(true)}
            raised={isTouch && exploring === SKILLS_INDEX && !skillsWon}
          />
          {isTouch && <TouchControls exploring={exploring} skillsIndex={SKILLS_INDEX} />}
        </>
      )}
      <Loader phase={phase} progress={loadProgress} />
      <RotateGate />
      {phase !== 'loading' && (
        <>
          <div className="brand">
            {profile.name}
            <span>{profile.title}</span>
          </div>
          <button type="button" className="resume-trigger" aria-label="Open resume" onClick={() => setResumeOpen(true)}>
            Resume
          </button>
        </>
      )}
      <ResumeViewer open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <SectionDetailModal
        open={sectionDetailOpen}
        stationIndex={islandForDetails}
        onClose={() => setSectionDetailOpen(false)}
      />
    </>
  );
}
