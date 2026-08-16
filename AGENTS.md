# AGENTS.md — Kolev Car Detail Studio

This file is the shared operating contract for Codex, Claude Code, Cursor Agent and any other coding agent.

## Mission
Build a mobile-first premium digital product for **Kolev Car Detailing, Negotin, Serbia**. It is not a generic local-service website. The public experience tells the cinematic but credible story of one ordinary car going from new → used/neglected → restored and desirable again. The private side is a practical Studio OS for availability, booking, jobs, media, publishing, analytics and sponsors.

## Product pillars
1. **Public story experience** — one car, one transformation, strong photography/video, editorial automotive composition.
2. **Booking** — owner controls exactly when work can be booked; visitors see only genuine availability and a deliberately concise set of nearest relevant slots.
3. **Studio OS** — calendar, jobs, services, capacity, customers, media and publishing.
4. **Content engine** — a completed job becomes reusable web/social content from one media library.
5. **Analytics** — measure service interest and conversion, not vanity dashboard metrics.
6. **Sponsors** — technical/editorial integrations only; never banner-ad clutter.

## Non-negotiable design rule
If the result can be described as `hero + service cards + testimonials + gallery + CTA`, it failed.

The design must feel like a premium automotive brand/editorial experience while remaining believable for a real detailing studio in Negotin.

## Core narrative
The car is the protagonist. The transformation is the product.

Preferred emotional arc:
`desire → time/use → unnoticed decline → recognition → craft/process → restoration → renewed pride → booking`

Do not lead with company history or marketing claims. Lead with visual proof and a story.

## Truth and scarcity
Never fabricate demand, bookings, reviews, sponsor relationships, customer names, capacity or countdowns.

Scarcity comes from **real owner-defined availability** and job durations. The UI may show the next few relevant slots rather than a mostly-empty month, but every displayed claim must be derived from real data.

## Mobile first
The primary experience must be excellent at 360–430 px widths and one-handed use. Desktop is not allowed to be the source layout merely stacked vertically.

Mobile requirements:
- fast first meaningful paint
- touch-safe interactions
- no hover-dependent meaning
- restrained motion on low-power/reduced-motion settings
- readable typography without zoom
- booking reachable within 1–2 taps from persistent contextual CTA

## Visual direction
Read `docs/VISUAL-DIRECTION.md` before public UI work.

Avoid:
- generic SaaS cards
- purple/blue AI gradients
- glassmorphism as a default
- fake carbon-fibre textures
- racing clichés
- excessive rounded rectangles
- icon grids
- stock photos of smiling mechanics
- decorative motion without business/narrative purpose

Use sophistication from photography, crop, composition, typography, pacing, material texture, light and restraint.

## Product behavior
Read only the relevant spec before work:
- Public/story: `docs/STORY.md`
- Visual: `docs/VISUAL-DIRECTION.md`
- Studio/admin: `docs/STUDIO-OS.md`
- Sponsors: `docs/SPONSORS.md`
- Token/context discipline: `docs/AI-CONTEXT.md`

Do not load every document for every task.

## Implementation principles
Until architecture is explicitly changed, prefer:
- Next.js + React + TypeScript
- Tailwind CSS for system tokens/utilities, not for template-looking composition
- Framer Motion or native View Transitions only where justified
- Supabase/Postgres for auth/data/storage if backend is introduced
- server actions/API routes with schema validation
- image/video optimization and responsive media
- semantic HTML, accessibility and reduced-motion support

Do not add dependencies for effects that can be implemented cleanly with platform/CSS primitives.

## Agent workflow
For a substantial task:
1. Read this file.
2. Read only the task-relevant document/skill.
3. Inspect existing code before proposing architecture.
4. State the smallest coherent plan.
5. Implement vertically, not as disconnected mock components.
6. Run lint/typecheck/tests/build relevant to changed code.
7. Perform visual/mobile QA for user-facing work.
8. Summarize changed files, trade-offs and unresolved issues.

## Git discipline
- Never work directly on `main` for feature-sized work.
- Use small descriptive branches: `feat/public-story`, `feat/booking`, `feat/studio-os`, etc.
- Keep commits coherent and reversible.
- Do not combine architecture refactors with visual tweaks unless required.
- Never overwrite unrelated user changes.

## Context/token discipline
Do not repeatedly reread the entire repository. Search first, open only relevant files, and prefer diffs. See `docs/AI-CONTEXT.md`.

## Definition of done
A feature is not done because it renders. It is done when:
- functionally correct
- mobile tested
- accessible enough for intended interaction
- real-data-safe (no fabricated state)
- performant
- visually consistent with project direction
- no obvious generic-template regression
- lint/typecheck/tests relevant to change pass

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
