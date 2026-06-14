export interface SailingInput {
  forward: number;
  turn: number;
  anchor: boolean;
}

type PartialInput = Partial<SailingInput>;

const keyboard: PartialInput = {};
const touch: PartialInput = {};

function val(v: number | undefined) {
  return v ?? 0;
}

/** Merged boat input from keyboard + touch joystick (touch steers when active). */
export const sailingInput = {
  keyboard,
  touch,
  read(): SailingInput {
    const touchActive = val(touch.forward) !== 0 || val(touch.turn) !== 0;
    return {
      forward: touchActive ? val(touch.forward) : val(keyboard.forward),
      turn: touchActive ? val(touch.turn) : val(keyboard.turn),
      anchor: (keyboard.anchor ?? false) || (touch.anchor ?? false),
    };
  },
  resetTouch() {
    touch.forward = 0;
    touch.turn = 0;
    touch.anchor = false;
  },
};
