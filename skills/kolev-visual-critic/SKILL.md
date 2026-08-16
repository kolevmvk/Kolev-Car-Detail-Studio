---
name: kolev-visual-critic
description: Perform a strict visual, mobile and anti-template review of Kolev Car Detailing public UI after implementation and before release.
---

# Kolev Visual Critic

Review the rendered implementation, not only the source code.

## Score 0–5
- visual identity
- narrative continuity
- photographic composition
- typography
- mobile composition
- motion purpose
- credibility/trust
- booking clarity
- performance feel
- originality

Any score below 4 requires a concrete fix before calling the page polished.

## Mandatory questions
1. Could this layout be sold as a generic template?
2. Are cards/pills doing work that composition should do?
3. Are before/after assets genuinely comparable?
4. Is any motion decorative, slow or blocking?
5. Does the user understand the transformation before being sold to?
6. Does mobile have its own composition and touch logic?
7. Are availability/scarcity claims factual?
8. Do sponsor placements increase technical credibility rather than clutter?
9. Is there at least one memorable scene that belongs specifically to this car/story?
10. Would a real local customer trust the studio enough to book after the visual spectacle?

## Output format
Return only:
- top 5 visual/product weaknesses ordered by impact
- exact proposed changes
- regression risks
- verdict: `PASS`, `REVISE`, or `REBUILD SCENE`

Do not praise generically. Do not request redesign for novelty alone.
