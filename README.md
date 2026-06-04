# SK Sahil Parvez — 3D Portfolio

An interactive 3D portfolio inspired by [bruno-simon.com](https://bruno-simon.com/),
built with **React Three Fiber**. Instead of driving a car, you **scroll** to fly a
cinematic camera between low-poly floating islands — one per resume section.

## Tech stack

- React 18 + TypeScript + Vite
- [`@react-three/fiber`](https://github.com/pmndrs/react-three-fiber) + [`@react-three/drei`](https://github.com/pmndrs/drei)
- `three`

## Getting started

```bash
npm install
npm run dev      # start dev server at http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # preview the production build
```

## How it works

- **Scroll / arrow keys / touch** drive a `0..1` progress value (drei `ScrollControls`).
- `CameraRig` interpolates the camera position + look-at between per-island anchors.
- The matching HTML panel (`src/ui/Overlay.tsx`) fades in for the active station.
- Click and move the mouse for subtle parallax. Use the **dots on the right** to jump
  to any section.

## Editing your content

**Everything lives in one file:** [`src/data/portfolio.ts`](src/data/portfolio.ts).
Edit `profile`, `experience`, `projects`, `skillGroups`, `education`,
`certifications`, `achievements`, and `contactLinks` — the 3D scene and overlays
update automatically.

To reorder, add, or recolor islands, edit the `stations` array at the bottom of the
same file (`position` is the island's 3D location, `accent` its theme color).

## Project structure

```text
src/
  data/portfolio.ts      # all content + island layout (single source of truth)
  scene/
    Experience.tsx       # <Canvas> root: lights, fog, scroll controls
    CameraRig.tsx        # scroll-driven camera fly-between + mouse parallax
    Island.tsx           # reusable low-poly floating island
    StationProps.tsx     # per-station 3D props (procedural low-poly)
    Clouds.tsx           # drifting low-poly clouds
  ui/
    Overlay.tsx          # HTML content panels per station
    Nav.tsx              # progress dots, brand, scroll hint
  App.tsx, main.tsx, index.css
```

## Deploy to Netlify

This is a static Vite site. On Netlify:

- **Build command:** `npm run build`
- **Publish directory:** `dist`

Or drag-and-drop the `dist/` folder after running `npm run build` locally.

## Notes

- Visuals are **majority procedural low-poly** (no downloaded model files), so the
  site loads fast and has nothing to license. A few real models can be added later
  via `useGLTF` if desired.
- Respects `prefers-reduced-motion` for the scroll hint animation.
