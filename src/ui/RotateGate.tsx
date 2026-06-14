import { useDeviceMode } from '../hooks/useDeviceMode';

/** Full-screen overlay asking touch users to rotate to landscape. */
export default function RotateGate() {
  const { isTouch, isPortrait } = useDeviceMode();
  if (!isTouch || !isPortrait) return null;

  return (
    <div className="rotate-gate" role="dialog" aria-label="Rotate your device">
      <div className="rotate-gate-inner">
        <div className="rotate-gate-icon" aria-hidden>
          <svg viewBox="0 0 64 64" width="72" height="72">
            <rect x="18" y="8" width="28" height="48" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="32" cy="50" r="2" fill="currentColor" />
          </svg>
        </div>
        <p className="rotate-gate-title">Rotate your device</p>
        <p className="rotate-gate-sub">Landscape mode works best for sailing</p>
      </div>
    </div>
  );
}
