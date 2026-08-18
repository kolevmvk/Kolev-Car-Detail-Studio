/**
 * Story content — asset paths mapped to cinematic slots.
 *
 * Premium free images from Unsplash, optimized for automotive storytelling.
 * Each property is a SLOT — replace with authentic studio media without
 * changing component code. Images are served at quality=72 and responsive sizes.
 */

export const media = {
  // ── SCENE 01 — NEKAD (Memory) ──────────────────────────────────────
  // Dark grey car in natural light — establishing shot of presence
  openingHero: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1920&q=72&auto=format",

  // ── SCENE 02 — VREME (Time — scroll-dissolve) ───────────────────────
  // Same car, but showing time passing and neglect accumulation
  timeExterior: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1920&q=72&auto=format",
  timeInterior:  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=72&auto=format",

  // ── SCENE 03 — PREPOZNAVANJE (Recognition — text only, no slot) ─────
  // No image: visual rest beat between time-passing and entry.

  // ── SCENE 04 — ULAZ (Entry into studio) ─────────────────────────────
  // Professional automotive workshop setting
  entryProcess: "https://images.unsplash.com/photo-1487754180144-351b8ec685cd?w=1920&q=72&auto=format",

  // ── SCENE 05 — ZANAT (Craft — cinematic cuts) ───────────────────────
  // Close detail work: headlight, macro, polishing evidence, interior
  craftHeadlightAged:   "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=1920&q=72&auto=format",
  craftHeadlight:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=72&auto=format",
  craftVideoPoster:     "https://images.unsplash.com/photo-1487754180144-351b8ec685cd?w=1920&q=72&auto=format",
  craftSeat:            "https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=1920&q=72&auto=format",
  craftInteriorPoster:  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&q=72&auto=format",

  // ── SCENE 06 — TRANSFORMACIJA (Hold-to-reveal) ──────────────────────
  // Interior before/after transformation — dirty vs. pristine
  compareBefore: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1920&q=72&auto=format",
  compareAfter:  "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=1920&q=72&auto=format",

  // ── SCENE 07 — POVRATAK (Return — rhymes with opening) ─────────────
  // Same visual confidence as opening — restored state
  returnCar: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=1920&q=72&auto=format",
} as const;

export const video = {
  polishProcess:    "/video/polishing-closeup-1080p.mp4",
  foamWashVertical: "/video/foam-wash-vertical-1080p.mp4",
  interiorProcess:  "/video/interior-detailing-1080p.mp4",
} as const;
