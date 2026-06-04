# 3D Low-Poly Floating-Islands Portfolio — Design

**Author:** SK Sahil Parvez (content) / built collaboratively
**Date:** 2026-06-04
**Status:** Approved (pending spec review)

## 1. Purpose

Build a playful, memorable 3D portfolio website inspired by bruno-simon.com, but
**simpler and mobile-friendly**: no physics engine and no car driving. Instead, the
visitor **scrolls** to fly a cinematic camera between a small set of floating
low-poly islands, each representing one section of the resume.

Success criteria:

- Loads fast (procedural geometry, minimal/no downloaded models) and runs at 60fps
  on a typical laptop; degrades gracefully on mobile.
- Smooth scroll/keyboard/touch navigation between 8 islands.
- All content sourced from the resume, editable from one typed config file.
- Deployable to Netlify (matching the author's current 2D portfolio setup).

## 2. Core Experience

- 8 low-poly islands float in a pastel sky, gently bobbing.
- A scroll container drives a continuous progress value `0..(N-1)`.
- A camera rig interpolates camera position + look-at between per-island anchors
  every frame, producing a smooth "fly between islands" effect.
- On arrival at a station, an HTML overlay panel for that section fades in.
- Click/drag slightly orbits the focused island for tactile depth.
- Navigation aids: progress dots, prev/next controls, and a "scroll to explore" hint.
- Fully responsive; swipe/scroll on touch devices does the same as scroll.

## 3. Stations (mapped to resume content)

1. **Hero** — "SK Sahil Parvez", Software Engineer @ Highspot; tagline from summary.
2. **About** — summary paragraph; small animated character/avatar prop.
3. **Experience** — Highspot, Zscaler, Fractal.ai as a timeline of floating stones.
4. **Projects** — GameVault & PriceTrackEr as small building/screen props with links.
5. **Skills** — floating icon cubes grouped: Frontend/Backend, Databases, DevOps,
   Languages, Concepts.
6. **Education** — IIIT Allahabad (B.Tech IT, 8.53/10), 2021–2025.
7. **Certifications & Achievements** — certifications PLUS competitive-programming
   achievements (CodeChef 4★, Codeforces Specialist, LeetCode Knight, 1600+ problems).
8. **Contact** — email, phone, LinkedIn, and existing 2D portfolio link.

## 4. Tech Stack

- React 18 + TypeScript + Vite
- `three`, `@react-three/fiber` (R3F), `@react-three/drei` (cameras, Text, Float,
  Environment, ContactShadows, useGLTF for the rare model)
- `gsap` or `maath` for smooth interpolation/easing of the camera rig
- No global state library needed; a small hook tracks the active station index.

### Model policy

- **Majority procedural low-poly** (primitives + light vertex displacement).
- **A few real models only where they add clear value** (e.g. a nicer character or
  a distinctive project prop). Constraints: free / CC0 license, small file size,
  lazy-loaded (`Suspense`), and never blocking first paint.

## 5. Architecture

```text
src/
  data/portfolio.ts      ← ALL content in one typed config (single source of truth)
  scene/
    Experience.tsx       ← <Canvas> root: lights, sky/environment, fog, shadows
    CameraRig.tsx        ← scroll/index-driven camera position + lookAt interpolation
    Island.tsx           ← reusable low-poly island mesh + Float bobbing
    stations/            ← one small component per station's 3D props
      HeroStation.tsx
      AboutStation.tsx
      ExperienceStation.tsx
      ProjectsStation.tsx
      SkillsStation.tsx
      EducationStation.tsx
      CertificationsStation.tsx
      ContactStation.tsx
  ui/
    Overlay.tsx          ← HTML panels per active station (fade in/out)
    Nav.tsx              ← progress dots, prev/next, scroll hint, mute-style minimal UI
  hooks/
    useStation.ts        ← derives active station index + progress from scroll
  App.tsx
  main.tsx
  index.css
```

### Data flow

1. Scroll position → `useStation` → `{ progress, activeIndex }`.
2. `CameraRig` reads `progress`, lerps camera transform between island anchors.
3. `activeIndex` selects which `Overlay` panel is visible.
4. Each station component reads its slice from `data/portfolio.ts`.

### Module boundaries

- `data/portfolio.ts`: pure data, typed; no rendering. Swappable without touching scene.
- `Island.tsx`: given position/color/seed, renders an island; knows nothing about content.
- `CameraRig.tsx`: given anchors + progress, controls the camera; knows nothing about content.
- `Overlay.tsx`: given activeIndex + data, renders HTML; knows nothing about 3D.

## 6. Look & Feel

- Pastel sky gradient background; soft directional + ambient light; contact shadows
  under islands; warm playful palette with a distinct accent color per island.
- Rounded UI panels with subtle glass blur; friendly display font for headings,
  readable sans for body.
- Subtle ambient animation (bobbing islands, drifting clouds/particles).

## 7. Performance & Robustness

- Capped device pixel ratio; fog to limit draw distance; low-poly geometry.
- Off-screen station props lazily mounted / kept lightweight.
- `Suspense` fallbacks for any model; site remains usable if a model fails to load.
- Respect `prefers-reduced-motion` (reduce bobbing/auto-motion).

## 8. Deliverables

- Runnable Vite app (`npm install && npm run dev`).
- All resume content pre-filled in `src/data/portfolio.ts`.
- Responsive + keyboard/scroll/touch navigation.
- `README.md`: how to edit content, run locally, and deploy to Netlify.

## 9. Out of Scope (YAGNI)

- Physics engine / drivable vehicle.
- Multiplayer, leaderboards, whispers, audio (can be added later).
- CMS / backend; content stays in a static config file.
