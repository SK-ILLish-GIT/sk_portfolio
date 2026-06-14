import SkillsGame from '../skills/SkillsGame';
import SkillsIslandDecor from './SkillsIslandDecor';

/** Skills island — the "Stack Attack" slingshot game (active while exploring). */
export default function SkillsProps({ accent, active = false }: { accent: string; active?: boolean }) {
  return (
    <>
      <SkillsIslandDecor />
      <SkillsGame accent={accent} active={active} />
    </>
  );
}
