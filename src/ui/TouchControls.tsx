import { useCallback } from 'react';
import { sailingInput } from '../scene/controls/sailingInput';
import { skillsControls } from '../scene/skills/controls';
import { skillsGame, useSkillsGame } from '../scene/skills/store';
import Joystick from './Joystick';

interface TouchControlsProps {
  exploring: number;
  skillsIndex: number;
}

/** On-screen touch controls for sailing and the Skills mini-game. */
export default function TouchControls({ exploring, skillsIndex }: TouchControlsProps) {
  const { won } = useSkillsGame();
  const inSkills = exploring === skillsIndex;

  const onSailJoy = useCallback((x: number, y: number) => {
    sailingInput.touch.forward = -y;
    sailingInput.touch.turn = -x;
  }, []);

  const onAimJoy = useCallback((x: number) => {
    skillsControls.setTouchAimX(x);
  }, []);

  const onFireDown = () => {
    if (!skillsControls.isCharging() && !skillsGame.getState().won) {
      skillsControls.beginCharge();
    }
  };
  const onFireUp = () => {
    skillsControls.endCharge();
  };

  if (inSkills) {
    return (
      <div className="touch-controls">
        <Joystick onChange={(x) => onAimJoy(x)} className="touch-joystick" />
        {!won && (
          <div className="touch-buttons touch-buttons-solo">
            <button
              type="button"
              className="icon-btn icon-btn-lg touch-btn-fire"
              aria-label="Fire"
              onPointerDown={onFireDown}
              onPointerUp={onFireUp}
              onPointerLeave={onFireUp}
              onPointerCancel={onFireUp}
            >
              🔥
            </button>
          </div>
        )}
      </div>
    );
  }

  if (exploring >= 0) return null;

  return (
    <div className="touch-controls">
      <Joystick onChange={onSailJoy} className="touch-joystick" />
    </div>
  );
}
