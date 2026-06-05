---
name: create-low-poly-component
description: Create a new reusable low-poly 3D primitive for this React Three Fiber portfolio. Use when adding a tree, rock, lantern, character, building block, or any small mesh that should be shared across islands; when extracting inline JSX from a *Props file; or when the user asks for a new 3D component/primitive.
---

# Create a Low-Poly Component

## When to use

- A mesh appears (or will appear) on **2+ islands**, or is a **generic shape**
  (tree, pillar, orb, mailbox, medal…).
- Inline JSX in `*Props.tsx` is growing and the piece deserves its own file.

## Steps

1. **Create** `src/scene/components/<Name>.tsx` (PascalCase, one export per file).

2. **Follow the template** (see `low-poly-components` rule):
   - `DEFAULTS` const at top with geometry args + default colors.
   - `export interface <Name>Props extends PlacementProps` (+ `AccentProps` if emissive).
   - Named export `export function <Name>(…)`.
   - Root `<group position={resolvePosition(placement)}>`.
   - `flatShading`, low segments, `castShadow` on solid meshes.

3. **Barrel export** in `src/scene/components/index.ts`:

   ```ts
   export { MyThing, type MyThingProps } from './MyThing';
   ```

4. **Use it** in station props:

   ```tsx
   import { MyThing } from '../components';
   <MyThing x={-2} z={1.5} accent={accent} height={1.2} />;
   ```

5. **Remove** any duplicated inline JSX from the `*Props.tsx` file.

## Customization checklist

Expose props for anything a designer might tweak per placement:

- [ ] Position (`x`/`y`/`z` via `PlacementProps`)
- [ ] Size (`height`, `radius`, `scale`)
- [ ] Colors (`color`, `accent`, `trunkColor`, …)
- [ ] Emissive (`emissiveIntensity`)
- [ ] Optional animation (`floating`, `floatSpeed` — wrap in `<Float>` inside the component)

## Verify

```bash
npm run lint && npm run typecheck && npm run build
```

## Reference components

| File               | Good example of               |
| ------------------ | ----------------------------- |
| `Tree.tsx`         | height + color overrides      |
| `GlowMushroom.tsx` | `AccentProps` + emissive      |
| `GlowingOrb.tsx`   | optional `<Float>` wrapper    |
| `Column.tsx`       | simple parameterized geometry |
| `Medal.tsx`        | metalness / roughness props   |
