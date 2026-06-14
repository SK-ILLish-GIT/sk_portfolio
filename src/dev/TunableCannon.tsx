import { useRef } from 'react';
import { useControls, button } from 'leva';
import { SKILLS_GAME } from '../config/skillsGame';
import { Cannon, type CannonTune } from '../scene/skills/Cannon';

interface TunableCannonProps {
  aim: { yaw: number; pitch: number };
}

/**
 * Dev-only leva panel for the Skills cannon. Tune in the browser, hit "log config"
 * to print paste-ready values for `src/config/skillsGame.ts`.
 */
export default function TunableCannon({ aim }: TunableCannonProps) {
  const latest = useRef('');
  const c = SKILLS_GAME.cannon;

  const { x, y, z, faceYaw, targetSize, modelYaw, modelPitch, modelRoll } = useControls('Skills Cannon', {
    x: { value: c.pos[0], min: -15, max: 15, step: 0.1 },
    y: { value: c.pos[1], min: -2, max: 5, step: 0.05 },
    z: { value: c.pos[2], min: -15, max: 15, step: 0.1 },
    faceYaw: { value: c.faceYaw, min: -Math.PI, max: Math.PI, step: 0.01 },
    targetSize: { value: c.targetSize, min: 0.5, max: 8, step: 0.1 },
    modelYaw: { value: c.modelRot[1], min: -Math.PI, max: Math.PI, step: 0.01 },
    modelPitch: { value: c.modelRot[0], min: -Math.PI, max: Math.PI, step: 0.01 },
    modelRoll: { value: c.modelRot[2], min: -Math.PI, max: Math.PI, step: 0.01 },
    'log config': button(() => console.log(latest.current)),
  });

  latest.current =
    `cannon → pos: [${x.toFixed(1)}, ${y.toFixed(2)}, ${z.toFixed(1)}] | ` +
    `faceYaw: ${faceYaw.toFixed(3)}, targetSize: ${targetSize.toFixed(2)}` +
    (modelYaw || modelPitch || modelRoll
      ? ` | modelRot: [${modelPitch.toFixed(3)}, ${modelYaw.toFixed(3)}, ${modelRoll.toFixed(3)}]`
      : '');

  const tune: CannonTune = {
    pos: [x, y, z],
    faceYaw,
    targetSize,
    modelRot: [modelPitch, modelYaw, modelRoll],
  };

  return <Cannon aim={aim} tune={tune} />;
}
