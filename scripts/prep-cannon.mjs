// Strip the cartoon cannon down to the "cannon" subtree (the recoiling
// Circle_3 node: barrel/body + base plate + fire morph), drop the ground,
// wheels, extra planes and the built-in cannonball, then optimize.
import { NodeIO } from '@gltf-transform/core';
import { prune, dedup, weld } from '@gltf-transform/functions';

const SRC = 'public/models/cartoon_cannon_fire_animation.glb';
const OUT = 'public/models/cannon.glb';
const KEEP = 'Circle_3';

const io = new NodeIO();
const doc = await io.read(SRC);
const root = doc.getRoot();

function disposeSubtree(node) {
  node.listChildren().forEach(disposeSubtree);
  node.dispose();
}

// Find the GLTF_SceneRootNode (parent of the top-level parts) and keep only KEEP.
const sceneRoot = root.listNodes().find((n) => n.getName() === 'GLTF_SceneRootNode');
if (!sceneRoot) throw new Error('GLTF_SceneRootNode not found');
for (const child of [...sceneRoot.listChildren()]) {
  if (child.getName() !== KEEP) disposeSubtree(child);
}

// Drop animation channels whose target node is gone; drop empty animations.
for (const anim of root.listAnimations()) {
  for (const ch of [...anim.listChannels()]) {
    if (!ch.getTargetNode()) ch.dispose();
  }
  if (anim.listChannels().length === 0) anim.dispose();
}

await doc.transform(dedup(), weld(), prune());
await io.write(OUT, doc);
console.log('wrote', OUT);
