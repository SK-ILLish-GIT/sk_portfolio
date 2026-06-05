/** Clamp a number to the [0, 1] range. */
export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Smoothstep easing on [0, 1] — eases in and out. */
export const smooth = (x: number) => {
  const c = clamp01(x);
  return c * c * (3 - 2 * c);
};
