---
name: kolev-orchestrator
description: Route Kolev Car Detailing work to the smallest relevant project context and enforce the product's non-generic design, truthful availability, mobile-first and verification rules.
---

# Kolev Orchestrator

Use this skill when starting a substantial task in this repository.

## Route by task

### Public homepage / storytelling
Read:
- `AGENTS.md`
- `docs/STORY.md`
- `docs/VISUAL-DIRECTION.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/MOTION.md` only if implementing interaction/animation

Then use `skills/kolev-creative-director/SKILL.md` before implementation.

### Booking / availability / jobs / admin
Read:
- `AGENTS.md`
- `docs/STUDIO-OS.md`
- `docs/BOOKING.md`
- relevant entity sections from `docs/DATA-MODEL.md`
- `docs/SECURITY-AUTH.md` for authenticated/private or customer-data changes

Do not load public visual/story docs unless the task changes public UI.

### Media / cases / social distribution
Read:
- `AGENTS.md`
- `docs/CONTENT-ENGINE.md`
- `docs/MEDIA-PUBLISHING.md`
- relevant media/case entities from `docs/DATA-MODEL.md`

### Sponsors
Read:
- `AGENTS.md`
- `docs/SPONSORS.md`
- relevant sponsor entities from `docs/DATA-MODEL.md`
- only the affected case/content/admin code

### Architecture / infrastructure / integrations
Read:
- `AGENTS.md`
- `docs/ARCHITECTURE.md`
- `docs/STACK.md`
- `docs/DEPLOYMENT.md` when environments, CI, database migration, hosting, storage or scheduled jobs are involved
- `docs/SECURITY-AUTH.md` when auth, secrets, uploads, integrations or public/private boundaries are touched
- only relevant domain sections from `docs/DATA-MODEL.md`

### New implementation / project bootstrap / large feature planning
Read:
- `AGENTS.md`
- `docs/STACK.md`
- `docs/IMPLEMENTATION-BLUEPRINT.md`
- only the feature-specific document(s) named above

Do not scaffold later phases while implementing an earlier vertical slice unless a small interface is required to keep boundaries clean.

### Performance / context / agent tooling
Read:
- `AGENTS.md`
- `docs/AI-CONTEXT.md`
- `docs/AI-TOOLING.md` when changing agent workflows

## Context discipline

Do not load every document 'for safety'. Select the smallest context set above, then open additional references only when the task genuinely crosses boundaries.

## Universal gates
Before finishing any substantial task verify:
- no fabricated bookings/demand/reviews/sponsors
- mobile behavior is intentional
- no generic-template regression
- private customer/media boundaries remain intact
- affected deterministic checks pass
- report only changes, verification and unresolved risk
