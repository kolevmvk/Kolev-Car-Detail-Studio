/**
 * Story content — "Isti rad. Svaki auto."
 *
 * Visual subject: real detailing process photography (Pexels free-use, see assets/SOURCES.md).
 * Narrative: care → time/neglect → recognition → craft → result.
 *
 * PHASE 1 NOTE:
 * All images are documented Pexels stock media used as illustrative storytelling.
 * They do not represent Kolev's actual workshop, staff or customer vehicles.
 * Replace with authentic studio photography before launch.
 *
 * storyVehicle: retained as intended protagonist data for when real matched Golf photos arrive.
 * Do NOT use storyVehicle.meta in display copy until genuine matched-angle photos exist.
 */
export const storyVehicle = {
  make: "Volkswagen",
  model: "Golf",
  year: 2015,
  finish: "metalik siva",
} as const;

// All paths serve from public/ — provenance documented in assets/SOURCES.md
export const media = {
  // Opening: dramatic foam-wash front establishes the car receiving full attention
  openingHero: "/story/foam-front.jpg",

  // Material evidence: the quality care preserves
  materialLead: "/story/polishing-reflection.jpg", // machine polish close-up with gleaming reflections
  materialInset: "/story/clean-interior.jpg",       // clean premium leather interior — result state

  // Time section: two domains of work that time made necessary
  timeExterior: "/story/polishing-door.jpg",  // rotary polisher on exterior panel
  timeInterior: "/story/interior-wipe.jpg",   // interior wipe — scope of the work

  // Craft: three service categories with real process proof
  craftHeadlight: "/story/headlight-restoration.jpg", // headlight polishing — hand + machine
  craftExtract: "/story/deep-extraction.jpg",          // wet extractor on upholstery
  craftVideoPoster: "/story/polishing-reflection.jpg", // poster frame for paint video

  // Compare interaction: during work → clean result
  compareBefore: "/story/deep-extraction.jpg", // extractor mid-use — implies prior condition
  compareAfter: "/story/clean-interior.jpg",   // clean result interior

  // Return: the workshop — where the difference is made
  returnWorkshop: "/story/polishing-garage.jpg",

  // Available but not placed in current story sequence
  foamDetail: "/story/foam-wash.jpg",
  detailBrush: "/story/detailing-brush.jpg",
} as const;

export const video = {
  // Paint correction close-up — used in craft section 03 (Lak)
  polishProcess: "/video/polishing-closeup-1080p.mp4",
  // Vertical foam wash — suited for mobile hero; available for future use
  foamWashVertical: "/video/foam-wash-vertical-1080p.mp4",
} as const;
