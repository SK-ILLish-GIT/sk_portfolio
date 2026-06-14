import { stations } from '../data/portfolio';

interface ExplorePromptProps {
  docked: number;
  exploring: number;
}

/** Minimal dock hint — icon-only; Leave is handled by CornerActions. */
export default function ExplorePrompt({ docked, exploring }: ExplorePromptProps) {
  if (exploring >= 0 || docked < 0) return null;

  const dockedStation = stations[docked];

  return (
    <div className="explore-prompt is-visible" aria-label={`Explore ${dockedStation.label}`}>
      <span className="explore-prompt-icon" aria-hidden>
        🏝
      </span>
      <kbd>E</kbd>
    </div>
  );
}
