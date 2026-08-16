# Implementation Blueprint

## Principle

Build the product in vertical slices that become demonstrably useful. Do not scaffold every imagined feature before the first usable flow works.

## Target repository shape

```text
src/
  app/
    (public)/
      page.tsx
      cases/[slug]/page.tsx
      booking/page.tsx
    studio/
      layout.tsx
      page.tsx
      calendar/page.tsx
      jobs/page.tsx
      jobs/[id]/page.tsx
      media/page.tsx
      publish/page.tsx
      sponsors/page.tsx
      analytics/page.tsx
    api/
      booking/
      uploads/
      webhooks/
      publishing/
  components/
    public/
    studio/
    shared/
  features/
    booking/
    jobs/
    availability/
    cases/
    media/
    publishing/
    sponsors/
    analytics/
  lib/
    auth/
    db/
    storage/
    security/
    telemetry/
  styles/
  types/

supabase/
  migrations/
  seed.sql

tests/
  e2e/
  fixtures/
```

Route files orchestrate. Business rules belong in `features/*` services/domain modules, not inside React components or route handlers.

## Phase 0 — bootstrap and guardrails

Deliverables:
- Next.js App Router project with TypeScript strict mode
- pnpm lockfile
- lint, typecheck, unit-test and production-build scripts
- environment schema validation
- Supabase clients separated into browser/server/admin contexts
- baseline CSP/security headers
- Playwright configured
- CI running lint + typecheck + tests + build

Gate: empty shell deploys successfully and no secret is exposed client-side.

## Phase 1 — visual prototype of the public story

Goal: prove the creative direction before backend complexity.

Build:
- mobile-first cinematic homepage using placeholder/local test media
- one-car narrative from cared-for/newer state through wear to restoration
- headlight and interior transformation moments
- restrained booking entry point
- responsive behavior and reduced-motion mode

Do not build admin yet.

Gate:
- visual critic skill passes
- Lighthouse/performance sanity checked on mobile
- no generic service-card homepage regression
- narrative works without animation and with reduced motion

## Phase 2 — real availability and booking

Build:
- services and durations
- owner availability windows
- blocks/unavailable periods
- slot generation
- booking request/confirmation state machine
- double-booking protection in database transaction/constraint logic
- customer contact capture with explicit purpose
- optional private reference-photo upload

Public UI shows the next few truthful relevant slots, not an empty month calendar.

Gate:
- concurrent booking test cannot produce overlapping confirmed bookings
- timezone explicitly Europe/Belgrade
- cancellation/reschedule paths defined
- private upload URLs are not public

## Phase 3 — Studio OS core

Build the owner interface around a Studio Board rather than KPI-card wallpaper.

Build:
- admin auth
- today/upcoming work board
- calendar availability editor
- bookings/jobs lifecycle
- job detail with vehicle, requested services and notes
- mobile admin usability because owner may operate from phone in workshop

Gate:
- unauthenticated Studio OS inaccessible
- role/authorization checks server-side
- availability changes reflected in public booking safely

## Phase 4 — case and media engine

Build:
- upload originals into private storage
- attach media to job
- classify as before/process/after/detail
- create public Case from selected approved derivatives
- image derivative generation pipeline
- alt text/caption metadata
- media consent/publication flag

Gate:
- raw customer media never becomes public implicitly
- public Case references only publishable derivatives
- deleting/unpublishing has deterministic behavior

## Phase 5 — content distribution

Build an outbox-based publishing model before connecting external networks.

Build:
- compose publication from a Case
- channel-specific copy/assets
- status: draft -> ready -> scheduled/queued -> published/failed
- adapter interface for Web, Meta/Instagram/Facebook and future channels
- retry idempotency keys
- manual export/download fallback when an API is unavailable

Connect external APIs only after credentials and current platform requirements are verified.

Gate:
- no duplicate post from retry
- publishing failure never corrupts the Case
- owner can see exactly what will be published before dispatch

## Phase 6 — sponsor layer

Build:
- partner records
- campaign periods
- placement rules
- Case/service/tool/product associations
- impression and click events
- sponsored transformation labeling

Gate: sponsorship never creates generic ad slots. Placements remain editorial/technical and disclosed where appropriate.

## Phase 7 — useful analytics

Owner-facing metrics:
- transformation/case views
- service interest
- booking opened/started/completed
- conversion by service and Case
- source/referrer/campaign where available with privacy-respecting collection
- sponsor impressions/clicks
- slot occupancy and demand indicators from real data

Avoid vanity-dashboard overload.

## Public performance budget

Treat these as engineering targets, not guaranteed scores:
- hero media must not block first meaningful content unnecessarily
- responsive image sizes/formats
- lazy load below-fold media
- no autoplay video with audio
- avoid shipping admin dependencies to public pages
- client JS only for interactions that need it
- reduced-motion supported

## Mobile requirements

Mobile is a first-class composition, not collapsed desktop:
- touch-sized targets
- safe-area support
- swipe/drag interactions where meaningful
- booking completable one-handed
- no hover-only information
- admin calendar/job actions usable on a phone

## Git execution model

Feature branches/worktrees by bounded vertical slice, for example:
- `feat/public-story`
- `feat/booking-core`
- `feat/studio-os`
- `feat/media-cases`

Before modifying files, an agent inspects current branch/worktree and affected boundaries. Avoid parallel agents editing the same files.

## Definition of done for each slice

A slice is not done because it renders.
It is done when:
- behavior matches relevant docs
- mobile path tested
- access/privacy boundaries verified
- unit/integration/e2e checks appropriate to risk pass
- no fake business data presented as real
- changed public design passes `kolev-visual-critic`
- agent reports unresolved risks explicitly
