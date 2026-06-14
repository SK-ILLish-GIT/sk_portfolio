import { useSkillsGame } from '../scene/skills/store';

/** HUD shown while exploring the Skills island: progress + power meter. */
export default function SkillsHud() {
  const { total, cleared, won, power } = useSkillsGame();

  return (
    <div className="skills-hud">
      <div className="skills-hud-bar">
        <span className="skills-hud-count">
          {cleared}/{total}
        </span>
      </div>

      {!won && (
        <div className="skills-meter" aria-label={`Power ${Math.round(power * 100)} percent`}>
          <div className="skills-meter-track">
            <div className="skills-meter-fill" style={{ width: `${Math.round(power * 100)}%` }} />
          </div>
        </div>
      )}

      {won && <div className="skills-hud-win">🎉</div>}
    </div>
  );
}
