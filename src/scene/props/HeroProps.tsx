import { Suspense, lazy } from 'react';
import { type Phase } from '../../config/intro';
import { HERO_LAYOUT, HERO_WORKSPACE } from '../../config/heroModels';
import { ModelFigure } from '../components';
import type { Vec3 } from '../../types/three';

// Dev-only model tuner (leva sliders). Tree-shaken out of production builds
// because `import.meta.env.DEV` is statically false there.
const DEV = import.meta.env.DEV;
const TunableModelFigure = DEV ? lazy(() => import('../../dev/TunableModelFigure')) : null;

/** Hero island: a bare island with just the desk setup on the right, facing the sea. */
export default function HeroProps({ phase = 'live' }: { accent: string; phase?: Phase }) {
  if (phase === 'loading') return null;

  const { workspace } = HERO_LAYOUT;
  const deskPos: Vec3 = [workspace.x, 0, workspace.z];

  return (
    <group>
      {TunableModelFigure ? (
        <Suspense fallback={null}>
          <TunableModelFigure name="Hero Desk" config={HERO_WORKSPACE} defaultPos={deskPos} />
        </Suspense>
      ) : (
        <ModelFigure config={HERO_WORKSPACE} x={workspace.x} z={workspace.z} />
      )}
    </group>
  );
}
