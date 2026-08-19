/**
 * Story content — asset paths mapped to cinematic slots.
 *
 * Local Pexels-licensed media, story-mapped per assets/cinematic-story/ASSET-MAP.md.
 * Same grey Golf Mk7 (Soran Ali / Pexels) recurs as the visual protagonist.
 * Each property is a SLOT — replace with authentic studio media without
 * changing component code.
 */

export const media = {
  // ── SCENE 01 — NEKAD (Memory) ──────────────────────────────────────
  // Protagonist Golf on open road — presence, before decline.
  openingHero: "/story/kolev-hero-coast.webp",

  // ── SCENE 02 — VREME (Time — scroll-dissolve) ───────────────────────
  // Same road frame dissolves into the same car, parked, ordinary.
  timeExterior: "/story/golf-road-hills.jpg",
  timeInterior: "/story/golf-parking.jpg",

  // ── SCENE 03 — PREPOZNAVANJE (Recognition under inspection light) ────
  inspectionHeadlight: "/story/headlight-inspection.webp",

  // ── SCENE 04 — ULAZ (Entry into studio) ─────────────────────────────
  entryProcess: "/story/headlight-foam.jpg",

  // ── SCENE 05 — ZANAT (Craft — cinematic cuts) ───────────────────────
  craftHeadlightAged:   "/story/headlight-aged.jpg",
  craftReflection:      "/story/polishing-reflection.jpg",
  craftVideoPoster:     "/story/polishing-door.jpg",
  craftSeat:            "/story/seat-deep-clean.jpg",
  craftInteriorPoster:  "/story/studio-detailer.webp",

  // ── SCENE — SKIDAMO GODINE (authored studio sequence, tr-1…tr-6) ──
  ageRemoval: "/story/tr-1.webp",
  ageRemovalFrames: [
    "/story/tr-1.webp",
    "/story/tr-2.webp",
    "/story/tr-3.webp",
    "/story/tr-4.webp",
    "/story/tr-5.webp",
    "/story/tr-6.webp",
  ],
  priceScene: "/story/tr-x.webp",

  // ── SCENE 06 — STANJE / POSTUPAK (Hold-to-reveal) ───────────────────
  // Illustrative stock sequence, explicitly not presented as matched before/after proof.
  compareBefore: "/story/headlight-before.webp",
  compareAfter:  "/story/headlight-after.webp",

  // ── SCENE 07 — POVRATAK (Return — rhymes with opening) ─────────────
  returnCar: "/story/owner-arrival.webp",

  // ── SCENE 08 — BRANDED EPILOGUE (authored campaign visualization) ───
  campaignFinale: "/story/campaign-finale.webp",
} as const;

export const video = {
  polishProcess:    "/video/polishing-closeup-1080p.mp4",
  foamWashVertical: "/video/foam-wash-vertical-1080p.mp4",
  interiorProcess:  "/video/interior-detailing-1080p.mp4",
} as const;

/**
 * Segmented layers for the WebGL spatial scenes (hero, return). Derived
 * locally from the golf-road-hills / golf-seaside protagonist photos via
 * u2net background removal — same Pexels source, same license, just split
 * into a car cutout (foreground, real depth/parallax) and a horizon-only
 * background plate (no ground/road, the reflective floor stands in for it).
 * See assets/SOURCES.md.
 */
export const spatial = {
  hero: {
    car: "/spatial/hero-car.webp",
    bg: "/spatial/hero-bg.webp",
  },
  return: {
    car: "/spatial/return-car.webp",
    bg: "/spatial/return-bg.webp",
  },
} as const;
