/**
 * Art direction — "Isti kadar. Druge godine."
 *
 * Scene purpose: one everyday Golf as a film still that ages, then returns.
 * Visual subject: matched 3/4 hatchback, then the left headlight as the recurring crop.
 * Emotional beat: tired is not the same as irreversible.
 * Interaction: native scroll; hold-to-reveal only on the headlight.
 * Mobile: letterboxed frames (image, then caption) — not a stacked desktop split.
 * Evidence: prototype stills of one vehicle. No fake jobs, archive, slots or reviews.
 */
export const storyVehicle = {
  make: "Volkswagen",
  model: "Golf",
  year: 2015,
  finish: "metalik siva",
  meta: "Golf · 2015 · metalik siva",
} as const;

export const media = {
  golfNew: "/story/golf-new.jpg",
  golfWorn: "/story/golf-worn.jpg",
  golfRestored: "/story/golf-restored.jpg",
  headlightClear: "/story/headlight-clear.jpg",
  headlightOxidized: "/story/headlight-oxidized.jpg",
  seatClean: "/story/seat-clean.jpg",
  seatWorn: "/story/seat-worn.jpg",
  processPolish: "/story/process-polish.jpg",
  processExtract: "/story/process-extract.jpg",
  beamNight: "/story/beam-night.jpg",
} as const;
