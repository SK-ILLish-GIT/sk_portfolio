import { type ReactNode } from 'react';
import { stations } from '../data/portfolio';

interface ExplorePromptProps {
  /** Index of the island the boat is in range of, or -1. */
  docked: number;
  /** Index of the island currently being explored, or -1. */
  exploring: number;
}

/** Blended on-water prompt: "Press E to explore" near an island, "Esc to leave" while exploring. */
export default function ExplorePrompt({ docked, exploring }: ExplorePromptProps) {
  const exploringStation = exploring >= 0 ? stations[exploring] : null;
  const dockedStation = docked >= 0 ? stations[docked] : null;

  let label: ReactNode = null;
  if (exploringStation) {
    label = (
      <>
        <kbd>Esc</kbd> Leave {exploringStation.label}
      </>
    );
  } else if (dockedStation) {
    label = (
      <>
        <kbd>E</kbd> Explore {dockedStation.label}
      </>
    );
  }

  return <div className={`explore-prompt ${label ? 'is-visible' : ''}`}>{label}</div>;
}
