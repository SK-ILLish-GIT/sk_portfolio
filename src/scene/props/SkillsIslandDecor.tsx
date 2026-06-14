import { useGLTF } from '@react-three/drei';
import { SKILLS_GAME } from '../../config/skillsGame';
import { Barrel, Bush, Fence, HayBale, StaticBird, TNT, TreeModel } from '../components';

/** Static dressing for the Skills island: trees, bushes, fence, TNT, ammo, props. */
export default function SkillsIslandDecor() {
  const { trees, bushes, fences, tnt, tntSize, bigBird, barrels, hay, rocks, rockColor, bushColor, fenceColor } =
    SKILLS_GAME.decor;

  return (
    <group>
      {trees.map((t, i) => (
        <TreeModel key={`tree-${i}`} path={t.path} x={t.x} z={t.z} targetSize={t.targetSize} rotationY={t.rotationY} />
      ))}
      {bushes.map((b, i) => (
        <Bush key={`bush-${i}`} x={b.x} z={b.z} size={b.size} rotationY={b.rotationY} color={bushColor} />
      ))}
      {rocks.map((r, i) => (
        <Bush key={`rock-${i}`} x={r.x} z={r.z} size={r.size} color={rockColor} />
      ))}
      {fences.map((f, i) => (
        <Fence key={`fence-${i}`} x={f.x} z={f.z} length={f.length} rotationY={f.rotationY} color={fenceColor} />
      ))}
      {tnt.map((t, i) => (
        <TNT key={`tnt-${i}`} x={t.x} y={'y' in t ? t.y : 0} z={t.z} size={tntSize} rotationY={t.rotationY} />
      ))}
      <StaticBird
        animate
        path={bigBird.path}
        x={bigBird.x}
        z={bigBird.z}
        targetSize={bigBird.targetSize}
        rotationY={bigBird.rotationY}
      />
      {barrels.map((b, i) => (
        <Barrel key={`barrel-${i}`} x={b.x} z={b.z} rotationY={b.rotationY} />
      ))}
      {hay.map((h, i) => (
        <HayBale key={`hay-${i}`} x={h.x} z={h.z} rotationY={h.rotationY} />
      ))}
    </group>
  );
}

for (const t of SKILLS_GAME.decor.trees) {
  useGLTF.preload(t.path);
}
useGLTF.preload(SKILLS_GAME.decor.bigBird.path);
