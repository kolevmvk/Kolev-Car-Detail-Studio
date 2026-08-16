# AI Context & Token Discipline

## Goal
Keep Claude Code, Codex and Cursor effective without feeding them the entire project on every turn.

## Rule 1 — progressive disclosure
Root instructions contain only project invariants. Detailed knowledge lives in narrow docs/skills loaded only when relevant.

## Rule 2 — search before read
Agents should search for symbols/paths first, then open the smallest relevant file ranges. Do not recursively read the repository by default.

## Rule 3 — narrow task context
Examples:
- public animation task: read `AGENTS.md` + visual/story skill, not Studio OS and sponsors
- booking bug: read `AGENTS.md` + booking/studio docs, not public cinematic direction
- sponsor feature: read sponsor spec + relevant schema only

## Rule 4 — deterministic tools over reasoning
Formatting, linting, typechecking, unit tests and build checks should run as tools/scripts. Do not spend model output simulating checks that deterministic tools can perform.

## Rule 5 — diff-oriented review
After changes, inspect diffs and affected dependencies rather than rereading all files.

## Rule 6 — session hygiene
Start a new agent thread/session when switching between unrelated domains if the current context has become implementation-heavy. Summarize durable decisions into repo docs rather than relying on chat history.

## Rule 7 — concise agent output
Agent completion reports should contain:
- what changed
- verification performed
- unresolved risk
- next useful step

Do not restate full specs or source files.

## Rule 8 — no duplicate instruction trees
`AGENTS.md` is canonical for shared invariants. `CLAUDE.md` and `.cursor/rules/` are adapters, not independent product specifications.

## Rule 9 — skills stay narrow
Each skill should have a clear trigger and a small SKILL.md. Long examples/reference material belongs in `references/`.

## Rule 10 — hooks/scripts
Once app tooling exists, automate cheap checks:
- formatter on changed files
- lint changed/package scope
- typecheck
- focused tests
- production build before release

Only invoke expensive AI review after deterministic checks or for visual/architectural judgment.
