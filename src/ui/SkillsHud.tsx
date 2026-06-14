import { skillsGame, useSkillsGame } from '../scene/skills/store';

/** HUD shown while exploring the Skills island: progress, power meter, hints. */
export default function SkillsHud() {
  const { total, cleared, won, power } = useSkillsGame();

  return (
    <div className="skills-hud">
      <div className="skills-hud-bar">
        <span className="skills-hud-count">
          Stacks cleared {cleared} / {total}
        </span>
        <button type="button" className="skills-hud-reset" onClick={() => skillsGame.reset()}>
          Reset
        </button>
      </div>

      {!won && (
        <>
          <div className="skills-meter">
            <span className="skills-meter-label">Power</span>
            <div className="skills-meter-track">
              <div className="skills-meter-fill" style={{ width: `${Math.round(power * 100)}%` }} />
            </div>
          </div>
          <div className="skills-hud-hint">
            <kbd>←</kbd> <kbd>→</kbd> aim · hold <kbd>Space</kbd> to charge, release to fire
          </div>
        </>
      )}

      {won && <div className="skills-hud-win">Skills unlocked! Press Esc to sail on.</div>}
    </div>
  );
}
