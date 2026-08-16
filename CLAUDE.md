# CLAUDE.md

Use `AGENTS.md` as the canonical project contract. This file adds Claude Code-specific execution guidance.

## Before acting
- Read `AGENTS.md` once at session start.
- Read only the document relevant to the current task.
- Do not preload the full `docs/` or `skills/` tree.
- Search before opening large files.

## Skills
Project skills live in `skills/`. Invoke the narrowest applicable skill instead of carrying its instructions in every prompt.

Priority:
1. `skills/kolev-orchestrator/`
2. task-specific skill
3. relevant reference document

## Creative work
For public-facing UI, do not start by coding standard sections. First establish the scene, narrative purpose, interaction purpose and mobile behavior. Reject any composition that could belong unchanged to an unrelated local business.

## Coding work
Prefer editing the smallest number of files necessary. Reuse existing conventions after the app exists. Do not perform repo-wide refactors unless explicitly required.

## Verification
After frontend changes, inspect at mobile and desktop widths. After functional changes, run the narrowest useful automated verification before broader checks.

## Token control
- Never paste whole files back into chat unless explicitly requested.
- Report diffs and decisions, not repeated source.
- Use deterministic shell tooling for formatting, linting and tests instead of reasoning about what tools can prove.
- Compact context after major milestones rather than carrying obsolete implementation discussion.
