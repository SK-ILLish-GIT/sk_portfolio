// ============================================================================
// Cinematic-intro lifecycle. Shared by the loader, camera rig, hero island,
// and guide creature so their animations stay in sync.
// ============================================================================

export type Phase = 'loading' | 'intro' | 'live';

/** Seconds, measured from the moment the `intro` phase begins. */
export const INTRO = {
  approach: 2.0,
  glowStart: 0.4,
  glowEnd: 2.4,
  total: 3.2,
} as const;

/** How long the loading bar runs before the intro fly-in starts (ms). */
export const LOADER_MS = 2600;
