# Free stock asset sources

All media in this directory is fetched from Pexels items marked **Free to use** on their source pages. Keep this file with the assets so provenance stays explicit. Re-check the current Pexels license before any materially different redistribution use.

## Images

| File | Subject | Creator | Source |
|---|---|---|---|
| `images/polishing-reflection.jpg` | close-up machine polishing / reflections | Dextar Studio | https://www.pexels.com/photo/person-polishing-the-surface-of-a-car-14615262/ |
| `images/interior-wipe.jpg` | interior leather/door cleaning | Bulat843 | https://www.pexels.com/photo/person-cleaning-car-interior-with-cloth-for-maintenance-31389821/ |
| `images/polishing-garage.jpg` | professional garage polishing | WAVYVISUALS | https://www.pexels.com/photo/man-is-polishing-car-in-garage-20042055/ |
| `images/polishing-door.jpg` | rotary polishing on vehicle side | Melih Can | https://www.pexels.com/photo/automotive-detailing-car-polishing-in-workshop-35149470/ |
| `images/headlight-restoration.jpg` | headlight restoration/polishing | Khunkorn Laowisit | https://www.pexels.com/photo/person-using-a-polishing-machine-on-the-car-5233268/ |
| `images/deep-extraction.jpg` | deep extraction / carpet cleaning | Khunkorn Laowisit | https://www.pexels.com/photo/hand-holding-a-car-vacuum-cleaner-5233264/ |
| `images/foam-wash.jpg` | foam wash exterior | Jarne Aerts | https://www.pexels.com/photo/car-covered-in-foam-in-a-car-wash-5693659/ |
| `images/detailing-brush.jpg` | detailing brush and foam close-up | Tima Miroshnichenko | https://www.pexels.com/photo/a-close-up-shot-of-a-person-brushing-a-car-6873020/ |
| `images/clean-interior.jpg` | clean premium leather interior | Ivan Kazlouski | https://www.pexels.com/photo/leather-interior-of-a-car-12190248/ |
| `images/foam-front.jpg` | dramatic front-view foam wash | Bulat843 | https://www.pexels.com/photo/luxury-car-wash-with-black-car-front-view-29504458/ |

## Cinematic story pack — protagonist and narrative inserts

| File | Intended use | Creator | Source |
|---|---|---|---|
| `cinematic-story/images/golf-road-hills.jpg` | opening / memory / hero — grey Golf Mk7 | Soran Ali | https://www.pexels.com/photo/volkswagen-golf-car-parked-on-the-side-of-the-road-with-hills-20429096/ |
| `cinematic-story/images/golf-parking.jpg` | neutral protagonist frame / years later | Soran Ali | https://www.pexels.com/photo/gray-volkswagen-golf-on-parking-lot-20759548/ |
| `cinematic-story/images/golf-seaside.jpg` | emotional return / road again | Soran Ali | https://www.pexels.com/photo/silver-volkswagen-golf-mk7-on-the-road-by-the-sea-20429094/ |
| `cinematic-story/images/golf-mountain-road.jpg` | closing / return to use | Soran Ali | https://www.pexels.com/photo/volkswagen-golf-on-road-near-mountain-20759547/ |
| `cinematic-story/images/headlight-aged.jpg` | time / wear / recognition macro | Jonathan Borba | https://www.pexels.com/photo/headlight-of-a-car-18371956/ |
| `cinematic-story/images/headlight-foam.jpg` | transition from recognition to craft | Tima Miroshnichenko | https://www.pexels.com/photo/a-close-up-shot-of-the-headlight-of-a-car-while-being-washed-6872149/ |
| `cinematic-story/images/seat-deep-clean.jpg` | tactile interior extraction/process | Khunkorn Laowisit | https://www.pexels.com/photo/a-person-deep-cleaning-a-car-seat-5233285/ |
| `cinematic-story/images/interior-hand-clean.jpg` | manual interior care / human detail | Tima Miroshnichenko | https://www.pexels.com/photo/a-man-in-black-jacket-cleaning-the-seat-of-a-car-6873185/ |

## Video

| File | Subject | Creator | Source |
|---|---|---|---|
| `video/polishing-closeup-1080p.mp4` | close-up polishing in workshop | Pavel Danilyuk | https://www.pexels.com/video/polishing-a-car-6159183/ |
| `video/foam-wash-vertical-1080p.mp4` | vertical foam application / wash | Matheus Bertelli | https://www.pexels.com/video/car-washing-foam-application-in-action-32010541/ |
| `cinematic-story/video/interior-detailing-1080p.mp4` | close-up brush/glove interior detailing | Pavel Danilyuk | https://www.pexels.com/video/a-person-detailing-the-interior-of-the-car-6158073/ |

## HDRI environment (WebGL spatial scenes lighting)

| File | Subject | Source | License |
|---|---|---|---|
| `hdri/aerodynamics_workshop_1k.hdr` | automotive workshop environment lighting, used for real-time PBR reflections on the WebGL hero/return scenes | https://polyhaven.com/a/aerodynamics_workshop | CC0 (Poly Haven) — public domain, no attribution required |

## Spatial WebGL layers (derived from cinematic story pack, local processing)

`public/spatial/*.webp` are **not new photography** — each is a locally-derived crop/layer of `golf-road-hills.jpg` (hero) and `golf-seaside.jpg` (return) above, same Soran Ali / Pexels source and license. Produced with a one-off local script (`rembg` u2net background segmentation + alpha-matting edge refinement, `Pillow` crop/blur) to split each photo into a foreground car cutout and a horizon-only background plate for the WebGL scene's real depth layers — no new licensing terms apply, no third-party model/service redistributes the output.

| File | Derived from | Role |
|---|---|---|
| `spatial/hero-car.webp` | `golf-road-hills.jpg` | foreground car cutout, alpha-matted |
| `spatial/hero-bg.webp` | `golf-road-hills.jpg` | horizon-only background plate (blurred, no ground) |
| `spatial/return-car.webp` | `golf-seaside.jpg` | foreground car cutout, alpha-matted |
| `spatial/return-bg.webp` | `golf-seaside.jpg` | horizon-only background plate (blurred, no ground) |

## Project use guidance

These are **source assets**, not final art direction. Prefer them as real photographic/video building blocks. The website should crop, grade, sequence and layer them according to `docs/VISUAL-DIRECTION.md`, `docs/STORY.md`, `docs/DESIGN-SYSTEM.md` and `docs/MOTION.md` rather than displaying them as a generic gallery.

The four Soran Ali Golf photographs are the preferred visual protagonist pack for Phase 1. They are intended to establish continuity of the same everyday-car archetype across the story. Do not claim they document a single real detailing job or that the apparent state changes are factual before/after evidence.

Do not imply that the people, workshops or vehicles shown are Kolev Car Detailing Studio, its staff, or actual customer jobs. They are stock imagery until replaced with authentic studio media.

See `assets/cinematic-story/ASSET-MAP.md` for scene-level usage guidance.

## Phase 1 media in use

The current `public/story/` and `public/video/` directories serve selected assets directly. The canonical source-of-truth remains this `assets/` directory. Claude may copy/optimize selected cinematic assets into `public/` as part of the Phase 1 implementation.

## Removed AI-generated images

The following 1536×1024 AI-generated images were committed to `public/story/` in a prior pass and have been **removed** because they lack Pexels provenance and violate the truthfulness requirement of `AGENTS.md`:

- `golf-new.jpg` / `golf-worn.jpg` / `golf-restored.jpg`
- `headlight-clear.jpg` / `headlight-oxidized.jpg`
- `seat-clean.jpg` / `seat-worn.jpg`
- `beam-night.jpg`
- `process-polish.jpg` / `process-extract.jpg`

Do not re-add AI-generated imagery without explicit disclosure and owner approval. The story must use documented free-use stock media until authentic studio photography is available.
