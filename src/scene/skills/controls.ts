import { skillsGame } from './store';

const POWER_FLOOR = 0.15;

let touchAimX = 0;
let keyboardLeft = false;
let keyboardRight = false;
let charging = false;
let chargeDir = 1;
let canCharge = () => true;

/** Transient aim/charge intent shared by keyboard and touch buttons. */
export const skillsControls = {
  /** Aim rate −1..1 from touch joystick (x) or keyboard arrows. */
  getAimRate: (): number => {
    if (touchAimX !== 0) return -touchAimX;
    if (keyboardLeft && !keyboardRight) return 1;
    if (keyboardRight && !keyboardLeft) return -1;
    return 0;
  },

  setTouchAimX: (x: number) => {
    touchAimX = x;
  },

  setKeyboardAim: (left: boolean, right: boolean) => {
    keyboardLeft = left;
    keyboardRight = right;
  },

  isCharging: () => charging,

  setChargeGuard: (fn: () => boolean) => {
    canCharge = fn;
  },

  beginCharge: () => {
    if (charging || !canCharge()) return;
    charging = true;
    chargeDir = 1;
    skillsGame.setPower(POWER_FLOOR);
  },

  endCharge: () => {
    if (!charging) return false;
    charging = false;
    return true;
  },

  getChargeDir: () => chargeDir,
  setChargeDir: (d: 1 | -1) => {
    chargeDir = d;
  },

  reset: () => {
    touchAimX = 0;
    keyboardLeft = false;
    keyboardRight = false;
    charging = false;
    chargeDir = 1;
  },
};

export { POWER_FLOOR };
