// Shared low-poly ocean wave height. Pure + framework-free so both the Ocean
// mesh (vertex displacement) and the Boat (bob) ride the exact same swell.

// The visual sea is now a flat shader surface; these gentle waves only give the
// boat a subtle bob, so amplitudes are kept small (the hull stays clear of them).
const WAVES = [
  { ax: 0.18, az: 0.0, speed: 0.9, amp: 0.06 },
  { ax: 0.0, az: 0.22, speed: 1.1, amp: 0.04 },
  { ax: 0.11, az: 0.13, speed: 0.6, amp: 0.03 },
] as const;

/** World-space wave height at (x, z) and time t (seconds). */
export function waveHeight(x: number, z: number, t: number): number {
  let h = 0;
  for (const w of WAVES) {
    h += Math.sin(x * w.ax + z * w.az + t * w.speed) * w.amp;
  }
  return h;
}
