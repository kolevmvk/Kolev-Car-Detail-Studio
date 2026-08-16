/**
 * Story content — asset paths mapped to cinematic slots.
 *
 * Protagonist images (golf-*.jpg) are all the same grey VW Golf Mk7
 * by Soran Ali / Pexels. They provide visual continuity for the one-car
 * narrative. Do NOT claim these are before/after photos of a real Kolev job.
 *
 * Craft process images are separate Pexels stock. Provenance: assets/SOURCES.md
 * and assets/cinematic-story/ASSET-MAP.md.
 *
 * Each property is a SLOT — replace with authentic studio media without
 * changing component code.
 */

export const media = {
  // ── SCENE 01 — NEKAD (Memory) ──────────────────────────────────────
  // SLOT: replace with protagonist-car-arriving.jpg (same car, real studio)
  openingHero: "/story/golf-road-hills.jpg",

  // ── SCENE 02 — VREME (Time — scroll-dissolve) ───────────────────────
  // Both are the same protagonist Golf in different life moments.
  // SLOT: keep as-is OR replace with same-angle matched shots of one real car.
  timeExterior: "/story/golf-road-hills.jpg",
  timeInterior:  "/story/golf-parking.jpg",

  // ── SCENE 03 — PREPOZNAVANJE (Recognition — text only, no slot) ─────
  // No image: visual rest beat between time-passing and entry.

  // ── SCENE 04 — ULAZ (Entry into studio) ─────────────────────────────
  // SLOT: replace with studio-entry.jpg (Kolev garage, car arriving)
  entryProcess: "/story/headlight-foam.jpg",

  // ── SCENE 05 — ZANAT (Craft — cinematic cuts) ───────────────────────
  // SLOT: replace each with actual Kolev workshop process shots.
  craftHeadlightAged:   "/story/headlight-aged.jpg",          // neglect detail
  craftHeadlight:       "/story/headlight-restoration.jpg",   // existing polishing (not in scene 05)
  craftVideoPoster:     "/story/polishing-reflection.jpg",
  craftSeat:            "/story/seat-deep-clean.jpg",          // interior extraction
  craftInteriorPoster:  "/story/interior-hand-clean.jpg",

  // ── SCENE 06 — TRANSFORMACIJA (Hold-to-reveal) ──────────────────────
  // SLOT: replace with protagonist interior before → after (same angle).
  compareBefore: "/story/deep-extraction.jpg",
  compareAfter:  "/story/clean-interior.jpg",

  // ── SCENE 07 — POVRATAK (Return — rhymes with opening) ─────────────
  // Same protagonist Golf, different natural setting — visual continuity.
  // SLOT: replace with protagonist-car-restored.jpg (same angle as opening).
  returnCar: "/story/golf-seaside.jpg",
} as const;

export const video = {
  polishProcess:    "/video/polishing-closeup-1080p.mp4",
  foamWashVertical: "/video/foam-wash-vertical-1080p.mp4",
  interiorProcess:  "/video/interior-detailing-1080p.mp4",
} as const;
