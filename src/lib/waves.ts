// Shared low-poly ocean wave height. Pure + framework-free so both the Ocean
// mesh (vertex displacement) and the Boat (bob) ride the exact same swell.

const WAVES = [
  { ax: 0.18, az: 0.0, speed: 0.9, amp: 0.1 },
  { ax: 0.0, az: 0.22, speed: 1.1, amp: 0.07 },
  { ax: 0.11, az: 0.13, speed: 0.6, amp: 0.05 },
] as const;

/** World-space wave height at (x, z) and time t (seconds). */
export function waveHeight(x: number, z: number, t: number): number {
  let h = 0;
  for (const w of WAVES) {
    h += Math.sin(x * w.ax + z * w.az + t * w.speed) * w.amp;
  }
  return h;
}
