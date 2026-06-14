import { useRef } from 'react';
import { useControls, button } from 'leva';
import { ModelFigure, type ModelFigureConfig } from '../scene/components';
import type { Vec3 } from '../types/three';

interface TunableModelFigureProps {
  /** Leva folder label — make it unique per model so each gets its own controls. */
  name: string;
  config: ModelFigureConfig;
  defaultPos: Vec3;
}

/**
 * Dev-only wrapper around `ModelFigure` that exposes live leva sliders for
 * position, yaw, and scale. Tune in the browser, hit "log config" to print
 * paste-ready values, then bake them into `src/config/heroModels.ts`.
 * Lazy-loaded behind `import.meta.env.DEV`, so it never ships to production.
 */
export default function TunableModelFigure({ name, config, defaultPos }: TunableModelFigureProps) {
  const latest = useRef('');

  const { x, y, z, faceYaw, targetSize } = useControls(name, {
    x: { value: defaultPos[0], min: -15, max: 15, step: 0.1 },
    y: { value: defaultPos[1], min: -5, max: 10, step: 0.1 },
    z: { value: defaultPos[2], min: -15, max: 15, step: 0.1 },
    faceYaw: { value: config.faceYaw, min: -Math.PI, max: Math.PI, step: 0.01 },
    targetSize: { value: config.targetSize, min: 0.2, max: 15, step: 0.1 },
    'log config': button(() => console.log(latest.current)),
  });

  latest.current =
    `${name} → x: ${x.toFixed(2)}, z: ${z.toFixed(2)} | y: ${y.toFixed(2)} | ` +
    `faceYaw: ${faceYaw.toFixed(3)}, targetSize: ${targetSize.toFixed(2)}`;

  const tuned: ModelFigureConfig = { ...config, faceYaw, targetSize };

  return <ModelFigure config={tuned} x={x} y={y} z={z} />;
}
