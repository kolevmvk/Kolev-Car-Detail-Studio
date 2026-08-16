# Phase 3 — Kolev Brand Motion Lab

## Mission

Build **Kolev Car Detail Studio** into a recognizable automotive brand through motion, light, material and transformation.

This is not a request to "add animations". The result must feel **animated, realistic, dynamic and continuously interesting** while remaining credible, fast and mobile-first.

The visitor should remember **KOLEV**, not merely remember that the site had effects.

## Brand hierarchy

1. **KOLEV** — primary memorable brand mark
2. **CAR DETAIL STUDIO** — descriptor
3. **NEKAD. SADA. PONOVO.** — brand promise / narrative line

The car is the protagonist, but KOLEV is the force behind the transformation. Do not leave the brand as a small logo while effects dominate.

## Realism standard

Motion must behave like something physical is happening in front of the visitor.

Prioritize:
- believable camera movement with inertia, framing and restraint
- realistic light behavior across paint, glass and chrome
- surface-dependent reveals rather than flat rectangular masks
- dirt, oxidation, wetness and cleaned surfaces with different visual responses
- reflections that track pointer/phone movement subtly
- real-feeling water, mist, foam, polishing and extraction states
- timing that feels mechanical/physical, not UI-template easing

Avoid:
- fake 3D wobble
- exaggerated neon/glow
- floating cards
- generic parallax layers
- endless particles
- gimmicks that look like a game rather than detailing

## Brand motion signature — K-CUT

Develop one repeatable KOLEV mnemonic: a sharp diagonal **K-CUT** derived from the geometry of the letter K.

Use it as a recognizable brand device for:
- opening reveal
- chapter transition
- image/surface mask
- moving inspection light
- focus/hover accent
- final KOLEV stamp

Where appropriate and user-initiated, pair it with a very short physical sound signature such as workshop relay click / light ignition. No autoplay music.

## Creative rule

Never animate an element merely because it can be animated.

Every significant movement must represent at least one of:
- camera
- light
- material
- cleaning/restoration
- time
- physical action
- story progression
- explicit user intent

## Existing authority

Before implementation read:
- `AGENTS.md`
- `docs/VISUAL-DIRECTION.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/MOTION.md`
- `docs/STORY.md`

Phase 1 story and Phase 2 booking are production baselines. Do not rewrite them while experimenting.

---

# Technical direction

## Primary stack

Evaluate and use deliberately:

- **GSAP + ScrollTrigger** — main cinematic timeline and scroll choreography
- **Lenis** — only if it improves perceived motion without harming native scrolling/accessibility
- **Three.js / @react-three/fiber / drei / postprocessing** — signature GPU scenes only
- **@14islands/r3f-scroll-rig** — evaluate for synchronized DOM/WebGL scene ownership
- **Theatre.js** — evaluate only if visual keyframing materially improves camera/light art direction
- **Framer Motion** — retain for ordinary UI microinteraction, not as primary cinematic engine
- browser primitives: CSS masks, clip-path, Canvas 2D, View Transitions API, requestVideoFrameCallback, pointer/device-orientation input

Do not turn the site into a 3D configurator. A photoreal 2.5D composition based on strong real photography is preferred over a mediocre full 3D car.

## Architecture

Avoid dozens of disconnected scroll listeners and `useEffect()` animations.

Use coordinated scene ownership and one clear progress source per scene. Extract a reusable scene layer only after prototypes prove repetition.

---

# Phase 3A — isolated motion lab

Create `/lab` or `/lab/motion`, excluded from normal navigation.

Do not replace production homepage yet.

The lab must prove the visual language on real phones before integration.

## Prototype 1 — DIRT MEMORY

A dull/dirty vehicle surface fills the scene.

Finger/pointer movement reveals a **temporary memory of the restored surface beneath the dirt**.

Requirements:
- not a before/after slider
- reveal follows the surface/material, not a rectangle
- feathering should feel organic and pressure-like
- restored reflection should react differently to light than dirty surface
- when interaction stops, memory can slowly disappear
- copy timing: `Nije ostario.` then `Zapušten je.`
- KOLEV brand must remain visibly present in the composition

Success criterion: it feels like uncovering the car's former condition, not dragging an image mask.

## Prototype 2 — HEADLIGHT RESURRECTION

Extreme close-up of oxidized headlight.

Finger/pointer becomes the polishing action.

Requirements:
- oxidation clears unevenly and physically
- cleaned area gains believable clarity/refraction/glare
- track cleaned percentage
- around a meaningful threshold (e.g. ~65–75%), trigger a relay click and headlight ignition
- headlight illumination must affect the scene: nearby bodywork, copy, haze/dust and viewport bloom, not merely swap to a brighter image
- K-CUT may appear in the ignition/light sweep
- brand lockup appears as `KOLEV / CAR DETAIL STUDIO`, not generic service copy

Success criterion: the user wants to replay the ignition moment.

## Prototype 3 — LIGHT INSPECTION

Dark vehicle/hood scene with a long detailing inspection light controlled subtly by pointer or phone orientation.

Requirements:
- dirty/oxidized paint creates soft, broken/diffuse reflection
- restored paint creates sharper, controlled reflection
- movement has small inertia and damping
- no exaggerated cursor chasing
- visitor understands the paint difference without a paragraph explaining it
- KOLEV K-CUT geometry can define the inspection light shape or transition

Success criterion: paint quality is proven through realistic light behavior.

---

# Phase 3B — next scenes only if the first three pass

## EXTRACTION PASS

Seat/fabric close-up with a realistic three-state cleaning trail:
1. dirty/wet ahead
2. darker freshly extracted path immediately behind tool
3. clean settled fabric after a short delay

The path should follow user movement and feel like an extractor pass, not image reveal.

## GARAGE TRANSFORMATION

Use a garage-door shadow/light wipe as a diegetic transition. The part of the car behind the passing shadow is transformed to restored state.

No generic slider.

## THE RETURN

Final reveal:
- controlled camera pullback
- clean paint/light behavior
- headlight ignition
- minimal copy sequence: `NEKAD.` → `SADA.` → `PONOVO.`
- final brand statement: **KOLEV CAR DETAIL STUDIO**

Booking CTA enters only after the transformation is emotionally complete.

---

# Brand visibility requirements

The brand must be present throughout the experience, not only in header/footer.

Design a system for:
- dominant KOLEV wordmark moments
- technical `CAR DETAIL STUDIO` descriptor
- K-CUT motion mnemonic
- recurring visual signature across transitions
- optional short workshop sound mnemonic
- service naming that feels like a system without pretending to be a global luxury brand

Possible branded service language to explore, with Serbian clarity preserved:
- KOLEV Headlight Restoration
- KOLEV Interior Reset
- KOLEV Full Vehicle Refresh
- KOLEV Detail Finish

Do not force English naming if it weakens local comprehension. Brand sophistication must come from execution, not foreign wording.

---

# Dynamic / interesting pacing

The site must not remain visually static for long stretches, but constant motion is also forbidden.

Use contrast:
- quiet observation
- interaction
- physical transformation
- brief impact
- settle
- next discovery

Every 1–2 viewport lengths should introduce either:
- a new physical behavior
- a changed camera relationship
- a material transformation
- a brand reveal
- a meaningful interaction

Do not repeat the same reveal mechanism twice in a row.

---

# Mobile performance contract

Primary target: 360–430 px mobile.

Requirements:
- no hover-only meaning
- touch interactions must not fight vertical scrolling
- use GPU effects only for signature moments
- lazy-load noncritical WebGL/video
- provide static/reduced path for weak devices and `prefers-reduced-motion`
- booking remains reachable and fully functional even if cinematic layer is disabled
- test on mobile Safari and Chrome; mid-range Android matters, not only flagship iPhone

Performance is part of the visual quality. A stuttering cinematic scene fails even if screenshots look excellent.

---

# Evaluation gate

Before integrating any prototype into production, answer YES to all:

1. Does it look physically believable?
2. Is it clearly automotive/detailing-specific?
3. Is KOLEV memorable in the scene?
4. Is it interesting to interact with more than once?
5. Does it remain smooth on a real phone?
6. Does it still communicate with animation reduced/disabled?
7. Does it avoid looking like an Awwwards clone or WebGL demo?
8. Does it make the real service/result easier to desire or understand?

If any answer is NO, redesign before integration.

---

# Claude Code execution plan

Work on branch `feat/brand-motion-lab`.

## Step 1 — audit
Inspect the current public story, assets, CSS, dependencies and route structure. Do not rewrite production UI yet.

Report:
- reusable current assets
- missing assets required for realistic prototypes
- dependencies already available
- minimum new dependencies proposed and why
- mobile/performance risks

## Step 2 — storyboard
Before implementation, define the exact visual sequence for the three lab prototypes:
- initial frame
- user input
- physical response
- transformation state
- KOLEV brand moment
- exit/settle state

No vague phrases like "add cinematic animation".

## Step 3 — implement `/lab`
Build only the three first prototypes:
- Dirt Memory
- Headlight Resurrection
- Light Inspection

Use temporary development media only if necessary and label it as non-production. Never claim stock/AI imagery as actual KOLEV work.

## Step 4 — visual QA
Test at minimum:
- 360x800
- 390x844
- 430x932
- 768px
- 1440px

Run mobile and desktop Playwright where relevant. Manually inspect scroll/touch behavior.

## Step 5 — performance QA
Report:
- JS added
- heaviest media
- WebGL usage
- whether effects degrade gracefully
- observable jank/problems

## Step 6 — stop for review
Do **not** merge lab experiments into the production homepage automatically.

Commit and push the lab branch, then provide screenshots/video capture or a preview deployment for human art-direction review.

Only after explicit approval should Phase 3C integrate selected scenes into the real public story.

## Definition of done for Phase 3A

Not "the animations work".

Done means:
- realistic
- animated
- dynamic
- interesting
- distinctly KOLEV
- smooth on mobile
- no production booking regression
- no generic component/template aesthetic
- lint/typecheck/tests/build relevant to change pass
