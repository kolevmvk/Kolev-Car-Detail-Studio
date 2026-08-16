# Motion Direction

Motion is part of the storytelling language, not decoration. Every motion decision must support transformation, material, time, inspection, or reveal.

## Core principle

If an animation does not help the visitor understand the car, the process, the result, navigation, availability, or booking state, remove it.

## Narrative verbs

Use a small vocabulary consistently:
- reveal
- wipe
- polish
- uncover
- focus
- illuminate
- extract
- settle
- compare

Avoid generic float, bounce, blob and endless parallax behavior.

## Homepage motion

The primary story is one car moving through states: new/remembered -> used/worn -> intervention -> renewed.

Possible techniques:
- matched-frame dissolve between earlier and current state
- mask reveal exposing restored surface
- controlled scroll-linked crossfade on headlights/interior
- light sweep tied to real headlight restoration chapter
- sticky photographic sequence where text changes while image remains anchored
- before/after drag only where it adds proof, not as the default for every case

Do not require scroll-jacking. Native page scrolling remains the baseline.

## Microinteractions

Use restrained transitions for:
- booking slot selection
- service selection
- media approval
- calendar availability changes
- publish status
- case archive hover/focus

Operational admin actions should feel fast. No theatrical delays in Studio OS.

## Timing

Guidelines, not hard-coded laws:
- UI feedback: ~120–220ms
- content transition: ~250–500ms
- cinematic chapter transition: ~500–1000ms only when warranted

Prefer easing that settles naturally. Avoid rubber-band/bouncy easing unless there is a concrete interaction reason.

## Scroll-linked animation

Rules:
- keep transforms/compositing efficient
- avoid large numbers of independent scroll listeners
- use browser/platform primitives where practical
- progressive enhancement: content remains accessible when animation is disabled or unsupported
- never make booking dependent on completing an animation sequence

## Reduced motion

When `prefers-reduced-motion: reduce`:
- remove scroll-scrubbed transformations
- use immediate state changes or short opacity transitions
- avoid large camera-like movement
- preserve all content and before/after proof through static layouts

## Mobile

Mobile motion is not desktop motion squeezed smaller.

- no hover dependency
- minimize simultaneous layers
- shorter transitions
- smaller video files
- avoid effects that fight vertical scrolling
- use tap/drag deliberately where interaction is obvious
- keep main-thread work low on mid-range Android devices

## Video

Use video when real motion proves work: extraction, polishing, rinse/process, light output, reveal.

Rules:
- autoplay only muted and inline where appropriate
- provide poster
- mobile-specific encode when useful
- lazy-load below fold
- no looping decorative 4K video as background without a strong reason

## Motion quality gate

A visual critic must reject motion if:
- it resembles generic Awwwards imitation without business purpose
- it hides real evidence under effects
- it causes layout instability
- it introduces noticeable input/scroll lag
- it makes mobile booking slower
- it relies on fake before/after content

The strongest motion on this site should feel inevitable: the surface changes because the story is about restoring the surface.