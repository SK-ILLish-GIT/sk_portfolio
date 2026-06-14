import { useSyncExternalStore } from 'react';
import { skillsControls } from './controls';

export interface SkillsGameState {
  /** Total number of stacks (skill groups). */
  total: number;
  /** Stacks fully knocked off the island so far. */
  cleared: number;
  won: boolean;
  /** Bumped to reset the game (remounts the stacks). */
  resetNonce: number;
  /** Aim yaw in degrees (left/right), driven by the HUD buttons. */
  yawDeg: number;
  /** Launch power 0..1. */
  power: number;
  /** Bumped each time the Fire button is pressed. */
  fireNonce: number;
}

const YAW_MIN = -55;
const YAW_MAX = 55;
const POWER_MIN = 0.15;
const POWER_MAX = 1;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

const DEFAULTS = { yawDeg: 0, power: 0.6 };

let state: SkillsGameState = {
  total: 0,
  cleared: 0,
  won: false,
  resetNonce: 0,
  yawDeg: DEFAULTS.yawDeg,
  power: DEFAULTS.power,
  fireNonce: 0,
};
const subs = new Set<() => void>();
const emit = () => {
  state = { ...state };
  subs.forEach((f) => f());
};

export const skillsGame = {
  getState: () => state,
  setTotal: (n: number) => {
    if (state.total !== n) {
      state.total = n;
      emit();
    }
  },
  setCleared: (n: number) => {
    state.cleared = n;
    state.won = state.total > 0 && n >= state.total;
    emit();
  },
  aimBy: (deltaDeg: number) => {
    state.yawDeg = clamp(state.yawDeg + deltaDeg, YAW_MIN, YAW_MAX);
    emit();
  },
  powerBy: (delta: number) => {
    state.power = clamp(state.power + delta, POWER_MIN, POWER_MAX);
    emit();
  },
  setPower: (v: number) => {
    state.power = clamp(v, POWER_MIN, POWER_MAX);
    emit();
  },
  fire: () => {
    state.fireNonce += 1;
    emit();
  },
  reset: () => {
    state.cleared = 0;
    state.won = false;
    state.resetNonce += 1;
    state.yawDeg = DEFAULTS.yawDeg;
    state.power = DEFAULTS.power;
    skillsControls.reset();
    emit();
  },
  subscribe: (f: () => void) => {
    subs.add(f);
    return () => {
      subs.delete(f);
    };
  },
};

export function useSkillsGame(): SkillsGameState {
  return useSyncExternalStore(skillsGame.subscribe, skillsGame.getState, skillsGame.getState);
}
