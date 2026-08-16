# Application Architecture

This is the implementation boundary document. Agents may choose exact libraries later, but must not violate these boundaries without an explicit architecture decision.

## Product surfaces

### Public Experience
A cinematic, mobile-first storytelling website centered on the transformation of one ordinary, relatable vehicle. It includes service discovery, real availability, case studies, sponsor/editorial credits, booking/request flow, and contact/location.

### Studio OS
Authenticated operational interface for the owner/admin: schedule, availability, bookings, jobs, media, cases, publishing, sponsors, analytics, services and settings.

### Worker/Background layer
Handles expensive and retryable tasks: media derivatives, video transcoding, social publication, scheduled jobs, analytics aggregation, notifications.

## Recommended deployment shape

Start as a modular monolith, not microservices.

- One web application
- One relational database
- Object storage for original media and derivatives
- Background job queue/worker when required
- External social APIs behind adapters

Do not split into independent services until actual load or organizational boundaries demand it.

## Logical modules

- auth
- services
- availability
- bookings
- customers
- vehicles
- jobs
- media
- cases
- publishing
- sponsors
- analytics
- settings

Each module owns its business rules. UI components must not implement booking or authorization rules directly.

## Public rendering

Public pages must be fast even though the experience is visually rich.

Rules:
- Server-render or statically render editorial content where practical.
- Keep critical first viewport lightweight.
- Lazy-load non-critical cinematic media.
- Use responsive image derivatives and modern formats.
- Never download desktop video assets to mobile if a smaller mobile asset exists.
- Respect `prefers-reduced-motion`.
- Do not block basic navigation/booking on WebGL or advanced animation support.
- The website must remain meaningful with motion reduced.

## Admin architecture

Admin routes are private and authorization is enforced server-side. Hiding navigation is not authorization.

The Studio Board should aggregate operational data but source it from domain modules rather than duplicating truth.

## Booking architecture

Slot generation is a domain service.

Inputs:
- service duration
- cleanup buffer
- studio capacity
- availability windows
- availability blocks
- existing confirmed bookings
- request-vs-instant booking mode
- timezone

Outputs:
- bookable slots
- reasons a requested slot is unavailable, internally

The public API returns available options, not internal schedule details.

Reservation race condition rule:
A slot shown as available can become unavailable before confirmation. Confirmation must be transactional/atomic and return a clean conflict response rather than double-booking.

## Media architecture

Browser/admin uploads must use controlled signed uploads or an equivalent secure upload path. Large media should not flow through application server memory unnecessarily.

Original assets are immutable. Processing creates derivatives.

Processing pipeline:
1. validate upload metadata/type/size
2. store original
3. inspect metadata
4. generate image/video derivatives
5. mark asset ready
6. allow editorial selection

Processing failure must not destroy the original.

## Publishing architecture

Publishing is adapter-based.

Domain calls a channel interface such as:
- validate draft
- publish now
- schedule if supported
- refresh publication state
- delete/unpublish if supported

Concrete Meta/Instagram/Facebook/TikTok/web adapters handle API differences. Do not leak provider-specific payloads across the core domain.

Outbound publication must be idempotent. Retries must not create duplicate posts.

## Analytics architecture

Use first-party event collection for product/business events, with optional external analytics as supplementary infrastructure.

Events enter an append-only event stream/table. Admin dashboard queries aggregated views/materializations rather than repeatedly scanning raw events at scale.

Internal/admin traffic should be identifiable/excludable.

## Sponsor architecture

Sponsors are linked to actual context: products, tools, cases, campaigns or editorial placements. Sponsor visibility is resolved server-side from active campaign dates and placement rules.

No arbitrary ad-script insertion layer is part of the core design.

## Error handling

Errors shown to users must be actionable and non-technical.

Operational errors need:
- structured logging
- correlation/request id
- safe context
- retry classification when applicable

Never log secrets, access tokens, full uploaded private URLs, or sensitive customer fields unnecessarily.

## Environment model

At minimum:
- local
- preview/staging
- production

Production social publishing must never be called accidentally from local or preview environments. Use explicit environment gates and test/stub adapters.

## Architecture quality gates

Before merging implementation:
- type checking passes
- lint passes
- unit tests for domain-critical logic pass
- booking race/overlap tests exist
- auth tests cover private routes/actions
- media upload validation is tested
- responsive public experience is visually checked at phone widths
- reduced-motion path is checked

## Agent constraint

Do not introduce a new platform, database, auth provider, queue, media service, animation system, or state-management library simply because it is fashionable. State the concrete requirement first, then choose the smallest credible tool.