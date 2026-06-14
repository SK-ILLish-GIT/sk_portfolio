import { skillsGame } from '../scene/skills/store';

interface CornerActionsProps {
  exploring: number;
  skillsIndex: number;
  onLeave: () => void;
  /** Lift icons above touch button stack (Fire / Anchor). */
  raised?: boolean;
}

/** Bottom-right icon actions — Leave while exploring, Reset on Skills island. */
export default function CornerActions({ exploring, skillsIndex, onLeave, raised }: CornerActionsProps) {
  if (exploring < 0) return null;

  return (
    <div className={`corner-actions ${raised ? 'is-raised' : ''}`}>
      {exploring === skillsIndex && (
        <button type="button" className="icon-btn" aria-label="Reset stacks" onClick={() => skillsGame.reset()}>
          🔄
        </button>
      )}
      <button type="button" className="icon-btn" aria-label="Leave island" onClick={onLeave}>
        ↩
      </button>
    </div>
  );
}
