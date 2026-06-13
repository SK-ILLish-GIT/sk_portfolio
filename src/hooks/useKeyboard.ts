import { useEffect, useRef } from 'react';

export interface SailingInput {
  forward: number; // W/Up - reverse with S/Down → -1..1
  turn: number; // A/Left = +1 (port), D/Right = -1 (starboard)
  anchor: boolean; // Space held → brake/anchor
}

const KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  anchor: ['Space'],
} as const;

/**
 * Tracks sailing keys and exposes a stable ref the physics loop can read each
 * frame without re-rendering. WASD / arrows steer + throttle; Space anchors.
 */
export function useKeyboard() {
  const input = useRef<SailingInput>({ forward: 0, turn: 0, anchor: false });
  const pressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const recompute = () => {
      const p = pressed.current;
      const fwd = (KEYS.forward.some((k) => p.has(k)) ? 1 : 0) - (KEYS.back.some((k) => p.has(k)) ? 1 : 0);
      const turn = (KEYS.left.some((k) => p.has(k)) ? 1 : 0) - (KEYS.right.some((k) => p.has(k)) ? 1 : 0);
      input.current.forward = fwd;
      input.current.turn = turn;
      input.current.anchor = KEYS.anchor.some((k) => p.has(k));
    };
    const down = (e: KeyboardEvent) => {
      if (Object.values(KEYS).some((list) => (list as readonly string[]).includes(e.code))) {
        if (e.code === 'Space') e.preventDefault();
        pressed.current.add(e.code);
        recompute();
      }
    };
    const up = (e: KeyboardEvent) => {
      pressed.current.delete(e.code);
      recompute();
    };
    const blur = () => {
      pressed.current.clear();
      recompute();
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', blur);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', blur);
    };
  }, []);

  return input;
}
