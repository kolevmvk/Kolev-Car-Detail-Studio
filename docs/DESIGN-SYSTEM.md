# Design System

The public experience must feel crafted, automotive, cinematic and contemporary without falling into tuning-garage clichés or generic luxury templates. The admin must feel precise and operational, not visually theatrical.

## Brand character

Keywords:
- precise
- restrained
- tactile
- cinematic
- credible
- local but not provincial
- premium without pretending to be a luxury-car brand

The design should make an ordinary used car feel worthy of attention.

## Public vs Admin

### Public
Image-led, editorial, cinematic, sparse UI, strong typography, controlled transitions, immersive storytelling.

### Admin / Studio OS
Dense enough to operate efficiently, high legibility, compact controls, obvious states, fast scanning. Brand cues are subtle.

Shared:
- typography family logic
- color foundations
- spacing discipline
- icon language
- corner/border philosophy

## Color system

Do not hard-code random colors throughout components. Define semantic tokens.

Suggested foundations:
- `surface-0`: near-black / charcoal
- `surface-1`: dark graphite
- `surface-light`: warm off-white / porcelain
- `text-primary-dark`: warm white
- `text-primary-light`: near-black
- `text-muted`: neutral gray
- `line-subtle`: low-contrast neutral
- `accent`: a single controlled signal color
- `success`, `warning`, `danger`, `info`: operational admin colors

Accent must be chosen deliberately after logo/photo direction is known. Avoid default electric blue/purple gradients and racing red as automatic choices.

## Typography

Use typography as composition, not decoration.

Roles:
- Display: strong headline face with automotive/editorial character
- Sans/body: neutral, highly readable grotesk/sans
- Mono/technical: optional for factual labels, case numbers, dates, timing

Rules:
- Fluid type scale using `clamp()` or tokenized responsive scale
- Avoid repeated `font-bold text-4xl` patterns
- Headlines can shift dramatically in scale across chapters
- Body line length roughly 55–75 characters where practical
- Mobile display text must be re-composed, not simply shrunk

## Spacing

Use a tokenized spacing scale, but cinematic sections may intentionally break it.

Base rhythm examples: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.

Do not put every section inside the same max-width container. Some moments are full bleed; others are narrow editorial columns.

## Geometry

- Mostly restrained radii
- Cards only when content structurally behaves like a card
- Avoid ubiquitous `rounded-2xl`
- Lines/dividers can carry more visual weight than containers
- Image crops may use hard edges or subtle radius depending on composition

## Imagery

Photography is primary UI.

Priorities:
1. real before/after evidence
2. matched-angle comparisons
3. macro material detail
4. process/tool details
5. beauty result shots

Never use stock smiling-mechanic photography if real studio media exists.

Use focal-point metadata for responsive crops.

## Layout behavior

The homepage may use chapters rather than sections.

Composition tools:
- full-viewport imagery
- split text/image states
- sticky narrative blocks
- overlapping type and image when legible
- controlled asymmetry
- horizontal archive strips where appropriate
- scroll-linked reveals tied to transformation

Avoid using all of these at once. Each page needs one coherent composition logic.

## UI controls

Buttons:
- clear hierarchy
- generous mobile touch target
- visible hover/focus/pressed states
- copy describes action: `Pogledaj slobodne termine`, not generic `Saznaj više`

Booking controls must prioritize speed over drama.

Admin inputs/tables/calendar must be keyboard-friendly and visibly focused.

## Responsive breakpoints

Do not treat breakpoints as fixed design targets only. Design fluidly and test at minimum:
- 360px
- 390px
- 430px
- 768px
- 1024px
- 1440px+

Most local traffic is expected to be mobile/social-driven, so mobile is a first-class art direction.

## Mobile rules

- Hero/story must communicate in first screen without relying on hover
- Replace pointer-only interactions with tap/drag/scroll equivalents
- Shorter video derivatives
- No tiny navigation labels
- Booking reachable without fighting cinematic motion
- Sticky CTA may appear contextually, not permanently if it damages story
- Respect safe areas

## Accessibility

- semantic landmarks
- logical heading order
- keyboard operation
- visible focus
- alt text for informative images
- decorative images correctly ignored
- sufficient color contrast
- reduced motion path
- no critical information encoded only by color

## Performance as design

A premium feel cannot depend on a 20 MB first viewport.

Budgets should be set during implementation and enforced. Prefer:
- poster + optimized video
- responsive image srcsets
- lazy loading
- preload only truly critical fonts/assets
- limited font weights
- no animation library for effects CSS can do cleanly

## Anti-template test

Before accepting a public page, ask:
- Could a dentist, SaaS startup or real-estate agency replace the photos/logo and use this exact layout?
- Are there three feature cards because the content needs them, or because AI defaults to them?
- Does the page show transformation better than it describes transformation?
- Does it feel like a real studio in Negotin with exceptional craft, or a fictional global luxury brand?

If the first answer is yes or the last answer is the latter, redesign.