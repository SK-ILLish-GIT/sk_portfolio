import ProceduralCreature from './ProceduralCreature';
import ModelCreature from './ModelCreature';
import { getCreature } from './creatures';
import type { Phase } from '../../config/intro';

/** Renders the selected guide creature (built-in procedural or a GLB model). */
export default function GuideCreature({ optionId, phase, accent }: { optionId: string; phase: Phase; accent: string }) {
  const option = getCreature(optionId);
  if (option.kind === 'procedural') {
    return <ProceduralCreature phase={phase} accent={accent} />;
  }
  // key forces a clean remount (new GLB + animations) when switching models.
  return <ModelCreature key={option.id} option={option} phase={phase} accent={accent} />;
}
