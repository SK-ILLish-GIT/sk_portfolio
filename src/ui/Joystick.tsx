import { useCallback, useRef, useState } from 'react';

interface JoystickProps {
  onChange: (x: number, y: number) => void;
  size?: number;
  className?: string;
}

/**
 * Circular virtual joystick — outputs normalized (x, y) in [-1, 1].
 * Pointer-driven; resets to center on release.
 */
export default function Joystick({ onChange, size = 120, className = '' }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const pointerId = useRef<number | null>(null);
  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const radius = size / 2;
  const knobSize = size * 0.38;

  const emit = useCallback(
    (clientX: number, clientY: number) => {
      const el = baseRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const max = radius * 0.72;
      let dx = clientX - cx;
      let dy = clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > max) {
        dx = (dx / dist) * max;
        dy = (dy / dist) * max;
      }
      setKnob({ x: dx, y: dy });
      onChange(dx / max, dy / max);
    },
    [onChange, radius],
  );

  const reset = useCallback(() => {
    setKnob({ x: 0, y: 0 });
    onChange(0, 0);
    pointerId.current = null;
  }, [onChange]);

  const onPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    pointerId.current = e.pointerId;
    emit(e.clientX, e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    emit(e.clientX, e.clientY);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    reset();
  };

  return (
    <div
      ref={baseRef}
      className={`joystick ${className}`.trim()}
      style={{ width: size, height: size }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      <div
        className="joystick-knob"
        style={{
          width: knobSize,
          height: knobSize,
          transform: `translate(calc(-50% + ${knob.x}px), calc(-50% + ${knob.y}px))`,
        }}
      />
    </div>
  );
}
