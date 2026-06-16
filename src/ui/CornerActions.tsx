import { skillsGame } from '../scene/skills/store';

interface CornerActionsProps {
  exploring: number;
  skillsIndex: number;
  onLeave: () => void;
  onDetails: () => void;
  /** Lift icons above touch button stack (Fire). */
  raised?: boolean;
}

/** Bottom-right icon actions while exploring — Details, Reset (skills), Leave. */
export default function CornerActions({ exploring, skillsIndex, onLeave, onDetails, raised }: CornerActionsProps) {
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
      <button type="button" className="icon-btn" aria-label="Section info" onClick={onDetails}>
        📄
      </button>
    </div>
  );
}
