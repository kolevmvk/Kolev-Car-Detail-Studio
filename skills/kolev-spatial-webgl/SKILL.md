---
name: kolev-spatial-webgl
description: Build or extend real-3D WebGL story scenes (hero, return, and future spatial moments) using the shared SpatialScene engine — camera arcs, mirror floor, segmented depth layers, HDRI lighting.
---

# Kolev Spatial WebGL

Use this skill for any public-site scene that needs genuine 3D depth (not a photo with CSS/shader effects layered on top). Read after `skills/kolev-creative-director/SKILL.md` has established the scene's narrative purpose.

## Why this exists

A photograph mapped onto a flat plane still reads as a flat photograph, no matter how much camera movement, light-sweep shader or grain is layered on top. Real spatial depth requires actual foreground/midground/background separation and light that responds to real geometry. This skill captures the engine and asset pipeline built to solve that for the hero (S01) and return (S07) scenes.

## The engine

`src/components/public/spatial/`
- `SpatialScene.tsx` — wrapper: GSAP ScrollTrigger progress, IntersectionObserver-gated `frameloop`, DOM overlay, CameraFrame fallback for reduced-motion/no-WebGL/low-power mobile.
- `SpatialCanvas.tsx` — the R3F scene: background plate plane, alpha-matted car-cutout plane (real PBR material, catches HDRI reflections), `MeshReflectorMaterial` mirror floor (real-time planar reflection — this is what makes it read as a showroom, not a photo), fog, camera rig (scroll-driven arc + pointer-driven tilt on desktop).
- `useSpatialMode.ts` — shared SSR-safe mode detection (`webgl` / `webgl-low` / `fallback`), via `useSyncExternalStore`, never `useState`+effect (causes hydration mismatches — see `useMountedReducedMotion.ts` for the same lesson applied to framer-motion).

Reuse this engine for a new spatial scene rather than building a new one-off Canvas. Add a new `<SpatialScene>` instance with new `bgSrc`/`carSrc`/`yawRange`/`fogColor` props before writing new R3F code.

## Asset pipeline: turning a flat photo into spatial layers

Real depth needs a foreground object separated from its background. Without a photoshoot or a licensed 3D car model, the working approach is local ML segmentation of the existing photography:

1. `pip install rembg onnxruntime pillow scipy pymatting` (u2net model, ~176MB, downloads once to `~/.rembg`).
2. Segment the car with alpha matting enabled (`alpha_matting=True`) — plain `rembg.remove()` without matting leaves background-color fringing on semi-transparent edge pixels, which shows as a ghostly halo once composited over a *different* (dark 3D scene) background. Decontaminate remaining edge pixels toward the nearest solid-alpha neighbor color.
3. Crop the background plate to the **horizon only** (above where the car sits) — do not try to inpaint the removed car region from the ground/road; `cv2.inpaint` produces visible radial-smear artifacts on any non-trivial background. The reflective floor material stands in for the ground plane entirely; you don't need real ground texture.
4. Export both layers as WebP (car cutout with alpha ~90-95 quality, background plate ~82-85 quality, downscaled to ~1600-1920px).

See `assets/SOURCES.md` for the exact script parameters used and the derived-asset provenance note (segmented layers are not new photography — same source/license as the original photo).

## Material/lighting notes learned the hard way

- `alphaMap` on a three.js material samples the texture's **green channel**, not its alpha channel. If your texture already has real alpha (a segmented PNG/WebP), just use it as `map` with `transparent` + `alphaTest` — do not also pass it as `alphaMap`, that multiplies in a bogus second opacity mask.
- Default light/HDRI intensities read as underexposed once composited into a dark fog-tinted scene. Push `toneMappingExposure` (~1.35), ambient (~0.5+), directional (~1+), and `envMapIntensity` (~1.5+) higher than feels necessary in isolation, then check a real screenshot — the fog and dark floor eat a lot of perceived brightness.
- Gate `<Canvas frameloop>` to `"never"` when the scene's section isn't intersecting the viewport (IntersectionObserver, generous `rootMargin`). Two reflective 3D scenes both rendering every frame regardless of scroll position is wasted GPU work.
- `useSyncExternalStore` for anything reading `matchMedia`/`WebGL support`/reduced-motion — a `useState` + `useEffect` mount-gate pattern either fails this repo's `react-hooks/set-state-in-effect` lint rule or produces a real hydration mismatch (React error #418) for visitors whose client-side media query state differs from the server's default render.

## Licensing discipline

Before reaching for a 3D car model or new stock asset, verify the license is actually confirmed, not just "commonly used in tutorials" (the three.js example Ferrari model has no verifiable license — do not use it or lookalikes without checking the current source page yourself). Prefer:
- Poly Haven (CC0, has a public JSON API at `api.polyhaven.com/files/<slug>` for direct download URLs — no scraping needed).
- Deriving new layers from photography already licensed for this project (`assets/SOURCES.md`), rather than sourcing new third-party assets, when it solves the actual visual problem.

Document any new source in `assets/SOURCES.md` in the same table format, whether it's a new external asset or a locally-derived layer.
