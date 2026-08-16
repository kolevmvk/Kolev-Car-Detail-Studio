# Implementation Stack Decision

## Goal

Use a modern full-stack that supports a cinematic public site, mobile-first booking, authenticated Studio OS, media ingestion, analytics and later social publishing without forcing a microservice platform onto a small local business.

## Chosen stack

### Application
- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS for implementation speed, but visual output must obey `docs/VISUAL-DIRECTION.md` and must not resemble a Tailwind template
- Motion library only where interaction warrants it; prefer CSS/Web Animations for simple effects and a dedicated motion library for orchestrated scroll/gesture sequences

### Backend / data
- Supabase Postgres as canonical database
- Supabase Auth for Studio OS administrators
- Supabase Storage for private originals and generated derivatives
- Row Level Security enabled for all exposed tables
- Server-side application services remain the normal write path for booking, admin operations, publishing and analytics aggregation

### Deployment
- Vercel for Next.js application and server functions
- Supabase managed project for database/auth/storage
- GitHub as source of truth and CI trigger

### Package management
- pnpm

### Validation / forms
- Zod at external boundaries
- React Hook Form only where a client-side form genuinely benefits from it
- Server validation remains authoritative

### Testing
- Vitest for domain/unit tests
- React Testing Library for focused UI behavior
- Playwright for critical public booking and Studio OS flows

### Observability
- Structured server logging from day one
- Error monitoring adapter kept provider-neutral until implementation decision
- Product event analytics stored through an explicit analytics service interface so a provider can be added or replaced without polluting domain code

## Why this stack

One Next.js application can host public storytelling, booking and Studio OS while keeping domain modules separated. Postgres is a natural fit because scheduling, jobs, assets, sponsorships, publishing and analytics all have relational constraints. Supabase provides Postgres, Auth and Storage without creating separate infrastructure teams. Vercel keeps deployment friction low.

## Explicit non-decisions / deferred choices

Do not lock these until the feature exists:
- external transactional email/SMS provider
- WhatsApp Business provider
- Meta publishing credentials and exact publishing adapter
- TikTok publishing adapter
- image/video transformation vendor beyond a local abstraction
- analytics SaaS
- queue provider

Create interfaces and outbox records first; add providers when credentials and business need exist.

## Constraints

- Never expose Supabase service-role credentials to the browser.
- Do not allow direct anonymous writes to booking/domain tables merely because Supabase can expose REST endpoints.
- Do not turn the app into a client-heavy SPA. Use server rendering/components by default and isolate client islands for sliders, gestures, booking interactions and media tools.
- Do not add Redis, Kafka, Docker orchestration, Kubernetes, separate API service or microservices without a measured reason.
- Avoid dependency inflation. Every package must justify its runtime or development value.

## Version policy

At project bootstrap use current stable releases verified against official documentation. Do not hardcode remembered version numbers in agent instructions. Commit lockfile and upgrade intentionally.
