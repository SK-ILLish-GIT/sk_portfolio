import { useEffect, useRef } from 'react';
import { sailingInput, type SailingInput } from '../scene/controls/sailingInput';

export type { SailingInput };

const KEYS = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  anchor: ['Space'],
} as const;

/**
 * Tracks sailing keys and writes into the shared sailingInput singleton so the
 * physics loop can read merged keyboard + touch input each frame.
 */
export function useKeyboard() {
  const pressed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const recompute = () => {
      const p = pressed.current;
      const fwd = (KEYS.forward.some((k) => p.has(k)) ? 1 : 0) - (KEYS.back.some((k) => p.has(k)) ? 1 : 0);
      const turn = (KEYS.left.some((k) => p.has(k)) ? 1 : 0) - (KEYS.right.some((k) => p.has(k)) ? 1 : 0);
      sailingInput.keyboard.forward = fwd;
      sailingInput.keyboard.turn = turn;
      sailingInput.keyboard.anchor = KEYS.anchor.some((k) => p.has(k));
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
      sailingInput.keyboard.forward = 0;
      sailingInput.keyboard.turn = 0;
      sailingInput.keyboard.anchor = false;
    };
  }, []);
}
