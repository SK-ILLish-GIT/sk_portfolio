// ============================================================================
// The boat (Quaternius CC0 sailboat). `faceYaw` rotates the model so its bow
// points +Z (the body's forward axis); `yOffset` seats the hull on the
// waterline so the deck keeps enough freeboard above the swell.
// ============================================================================

export interface BoatOption {
  id: string;
  label: string;
  path: string;
  /** Largest dimension the model is fit to, in world units. */
  targetSize: number;
  /** Extra yaw (radians) so the bow points along +Z. */
  faceYaw: number;
  /** Vertical nudge so the hull sits at the waterline. */
  yOffset: number;
}

export const SAILBOAT: BoatOption = {
  id: 'sailboat',
  label: 'Sailboat',
  path: '/models/boat-sailboat.glb',
  // floatLine (0.35) + yOffset must stay positive so the flat hull bottom rides
  // just above the mean surface — otherwise the ocean sheet renders inside the
  // open hull and looks like water pooling in the boat.
  targetSize: 3.4,
  faceYaw: 0,
  yOffset: -0.15,
};
