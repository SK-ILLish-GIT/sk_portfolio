import { stations } from '../data/portfolio';

interface IslandActionsProps {
  docked: number;
  isTouch: boolean;
  onExplore: () => void;
  onDetails: () => void;
}

/**
 * Approach UI shown while docked at an island (before exploring).
 * Laptop: one pill (label + E-to-explore hint + Details button).
 * Mobile: icon-only Explore + Details buttons, bottom-right.
 */
export default function IslandActions({ docked, isTouch, onExplore, onDetails }: IslandActionsProps) {
  if (docked < 0) return null;
  const station = stations[docked];

  if (isTouch) {
    return (
      <div className="corner-actions">
        <button
          type="button"
          className="icon-btn icon-btn-lg"
          aria-label={`Explore ${station.label}`}
          onClick={onExplore}
        >
          🏝
        </button>
        <button type="button" className="icon-btn icon-btn-lg" aria-label={`${station.label} info`} onClick={onDetails}>
          📄
        </button>
      </div>
    );
  }

  return (
    <div className="island-actions-pill">
      <span className="ia-label">{station.label}</span>
      <button type="button" className="ia-explore" onClick={onExplore}>
        <kbd>E</kbd> Explore
      </button>
      <button type="button" className="ia-details" onClick={onDetails}>
        <kbd>I</kbd> Info
      </button>
    </div>
  );
}
