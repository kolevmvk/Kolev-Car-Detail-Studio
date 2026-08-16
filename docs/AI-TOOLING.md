# AI Tooling Strategy

## Goal
Claude Code, Codex and Cursor should share one product truth while using their native instruction mechanisms.

## Canonical hierarchy
1. `AGENTS.md` — shared invariants
2. task-specific `docs/*.md`
3. canonical project `skills/*/SKILL.md`
4. tool-specific adapters (`CLAUDE.md`, `.claude/skills`, `.cursor/rules`, `.agents/skills`)

Adapters must stay short. Never fork product truth into three independent instruction sets.

## Recommended external skills / patterns
Use external skills selectively and pin/review them before adoption. Prefer official vendor material over random prompt collections.

Useful categories:
- Anthropic frontend-design guidance for distinctive production UI
- Superpowers-style planning, review and git-worktree discipline
- Vercel React/design/performance best-practice skills for implementation QA
- official OpenAI/Codex skill patterns and `AGENTS.md` conventions
- Cursor scoped project rules instead of one giant always-on rule

Do not install overlapping creative-director skills that compete with project direction.

## Claude Code
- `CLAUDE.md` is a thin adapter.
- project skills are exposed under `.claude/skills/` as small routers to canonical skills.
- use hooks later for deterministic formatting/lint/typecheck/tests when implementation tooling exists.
- use git worktrees for parallel feature work rather than agents editing the same working tree.

## Codex
- `AGENTS.md` is the primary project contract.
- `.agents/skills/` exposes narrow project skill entrypoints where supported.
- ask Codex to operate from diffs and focused file sets on review/refactor tasks.

## Cursor
- `.cursor/rules/00-project-core.mdc` stays minimal and always-on.
- add scoped rules only when real code areas exist, e.g. public UI, admin, database, booking.
- avoid giant legacy `.cursorrules` files.
- start new agent sessions when switching unrelated domains instead of carrying bloated context.

## Git worktrees
Recommended once parallel implementation starts:
- `feat/public-story`
- `feat/booking`
- `feat/studio-os`
- `feat/content-engine`

One agent owns one worktree/feature branch at a time. Integrate through PRs.

## Token-saving rules
- do not auto-read all docs
- search first
- read minimal relevant ranges
- use deterministic scripts for mechanical checks
- summarize durable decisions into repo docs
- avoid asking multiple agents to independently rediscover the same product specification
- use visual critic only after a meaningful UI milestone, not after every CSS edit

## External code safety
Before adopting any third-party skill/plugin:
- inspect repository/activity/license
- read its skill instructions
- reject instructions that conflict with this repository's product or security rules
- avoid plugins requesting unnecessary credentials or broad filesystem/network access
