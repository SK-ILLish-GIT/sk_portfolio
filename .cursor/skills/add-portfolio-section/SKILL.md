---
name: add-portfolio-section
description: Add a new floating-island section (station) to this React Three Fiber portfolio — wires content, layout, 3D props, nav, and overlay. Use when adding, removing, or reordering a portfolio section/island, or when the user mentions a new "station", "island", or page in the 3D scene.
---

# Add a Portfolio Section (Island)

A "section" is one floating island the camera flies to. Each is defined once in
content and rendered by a matching `*Props.tsx`. Follow these steps in order.

## Steps

1. **Add the station id** in `src/data/portfolio.ts`:
   - Extend the `StationId` union with the new id.
   - Add any content arrays/objects this section displays.
   - Add an entry to `stations[]` with `{ id, label, position, accent }`.
     - `position` is `[x, y, z]`; islands zig-zag using `Z_STEP` (negative Z).
     - Keep x alternating (±) so the camera weaves between islands.

2. **Create the 3D props** at `src/scene/props/<Name>Props.tsx`:
   - Default-export a component `({ accent }: { accent: string })`.
   - Compose primitives from `../components` (`Tree`, `Building`, `Medal`, …).
   - Need a new shape? Use the `create-low-poly-component` skill first.
   - Pull reused numbers into a top-of-file `const` or `src/config/`.

3. **Wire the dispatcher** in `src/scene/props/index.tsx`:
   - Import the new component and add a `case '<id>':` returning it.

4. **Add overlay copy** (skip for `hero`, whose text is on the 3D sign) in
   `src/ui/Overlay.tsx`:
   - Add a `case '<id>':` in `Panel` rendering the HTML content.

5. **Nav updates automatically** — `Nav` and `ScrollControls` derive count from
   `stations.length`. No change needed unless adding custom labels.

## Verify

```bash
npm run lint && npm run typecheck && npm run build
```

## Conventions

- Don't allocate THREE objects inside `useFrame` (see the `r3f-conventions` rule).
- 3D content → `src/scene/`; HTML content → `src/ui/`. Never mix.
- Tunable constants → `src/config/`; content → `src/data/portfolio.ts`.
