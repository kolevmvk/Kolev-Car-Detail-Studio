# Product — Kolev Car Detailing

## Product thesis
Kolev Car Detailing is a real small automotive detailing operation in Negotin. The digital product must make a small studio feel obsessively professional, selective and visually memorable without pretending to be a large luxury chain.

The product is two surfaces over one data model:
- **Public Experience** — story, proof, booking, real availability, cases, partners.
- **Studio OS** — owner operations, calendar, jobs, media, publishing, analytics, sponsors.

## Public promise
We do not claim to make an old car new. We make visible neglect reversible where the service genuinely can: headlights, textiles, interior surfaces and presentation.

Brand territory: **renewed pride in the car you already own**.

## Primary services
Initial launch focus:
- headlight restoration/polishing
- deep interior extraction/cleaning
- interior refresh/detailing

The system must allow services, durations, prices and booking rules to be admin-configurable.

## Primary audiences
1. Owners of 7–18 year old everyday cars who have become accustomed to gradual visual decline.
2. Owners preparing a car for sale.
3. Enthusiasts who care about presentation but are not necessarily premium-car owners.
4. Local automotive ecosystem and future technical sponsors.

## Public conversion goals
1. Visitor understands transformation almost immediately.
2. Visitor sees credible real work.
3. Visitor identifies the service relevant to their car.
4. Visitor checks genuine availability.
5. Visitor books or submits photos for assessment.

## Studio goals
The owner must be able to:
- define recurring and exceptional availability
- block private/unavailable periods
- manage service durations and booking modes
- view, confirm, reschedule and complete jobs
- attach before/process/after media to jobs
- publish a completed job as a case
- distribute case assets to supported social channels when integrations exist
- view meaningful traffic and funnel analytics
- manage sponsor/technical partner relationships and placements

## Product loop
`visitor → story/proof → service interest → availability → booking → job → media → case/content → distribution → new visitor`

This loop is the core architecture. Avoid building isolated CMS, booking and gallery features that do not connect.

## Availability philosophy
The owner does this work alongside other obligations. Therefore the booking model should be **availability-drop based** as well as optionally recurring.

A visitor should see a concise list of the nearest valid slots for the chosen service. Do not expose a huge empty calendar by default.

All scarcity must be factual. Copy such as “2 slots left this week” may only appear when computed from actual current availability.

## Sponsor philosophy
Partners add technical credibility and monetization potential. They must never make the site look ad-supported. Sponsor rules are in `SPONSORS.md`.

## Non-goals for v1
- marketplace
- multi-studio SaaS
- customer accounts/passwords
- fake AI vehicle diagnosis
- complex loyalty system
- ecommerce store
- generic blog factory

Build the strongest coherent single-studio product first.
