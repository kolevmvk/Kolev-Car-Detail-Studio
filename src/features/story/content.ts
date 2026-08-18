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
  openingHero: "/story/golf-road-hills.jpg",

  // ── SCENE 02 — VREME (Time — scroll-dissolve) ───────────────────────
  // Same road frame dissolves into the same car, parked, ordinary.
  timeExterior: "/story/golf-road-hills.jpg",
  timeInterior: "/story/golf-parking.jpg",

  // ── SCENE 03 — PREPOZNAVANJE (Recognition — text only, no slot) ─────
  // No image: visual rest beat between time-passing and entry.

  // ── SCENE 04 — ULAZ (Entry into studio) ─────────────────────────────
  entryProcess: "/story/polishing-garage.jpg",

  // ── SCENE 05 — ZANAT (Craft — cinematic cuts) ───────────────────────
  craftHeadlightAged:   "/story/headlight-aged.jpg",
  craftReflection:      "/story/polishing-reflection.jpg",
  craftVideoPoster:     "/story/polishing-door.jpg",
  craftSeat:            "/story/seat-deep-clean.jpg",
  craftInteriorPoster:  "/story/interior-hand-clean.jpg",

  // ── SCENE 06 — TRANSFORMACIJA (Hold-to-reveal) ──────────────────────
  // Real process/result pair — interior extraction before, clean result after.
  compareBefore: "/story/deep-extraction.jpg",
  compareAfter:  "/story/clean-interior.jpg",

  // ── SCENE 07 — POVRATAK (Return — rhymes with opening) ─────────────
  returnCar: "/story/golf-seaside.jpg",
} as const;

export const video = {
  polishProcess:    "/video/polishing-closeup-1080p.mp4",
  foamWashVertical: "/video/foam-wash-vertical-1080p.mp4",
  interiorProcess:  "/video/interior-detailing-1080p.mp4",
} as const;
