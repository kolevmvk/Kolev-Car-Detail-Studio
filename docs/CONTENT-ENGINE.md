# Content Engine

## Principle
A completed detailing job should create one canonical content object that can feed the website and social channels. Avoid re-uploading and rewriting the same work independently for every destination.

## Canonical Case
A case should contain:
- job reference
- vehicle/model/year when permitted
- service(s)
- short factual condition summary
- duration
- before media
- process media
- after media
- detail media
- products/tools used
- customer media permission state
- sponsor/partner associations
- publication state

## Media roles
Every asset can be tagged by role and suitability:
- before
- process
- after
- matched_before_after
- hero
- detail
- vertical_video
- horizontal_video
- social_safe
- web_safe

Preserve originals. Generate optimized derivatives for delivery.

## Public website output
Cases feed:
- Archive
- service proof
- matched before/after scenes
- current/recent work when status permits
- technical partner/product attribution

## Social output
The publishing layer should eventually support channel-specific compositions from the canonical case:
- Instagram 4:5 carousel
- Instagram Story 9:16
- Reel/TikTok vertical video package
- Facebook post
- website case

Channel output is not just resize. It may reorder the same truthful media and use channel-specific copy, but factual job data remains canonical.

## Publishing workflow
Suggested flow:
`job completed → media review → permissions check → case draft → channel variants → owner approval → publish/distribute → analytics`

Do not auto-publish customer media without owner approval and appropriate consent.

## Copy generation
AI may propose captions, hooks and summaries from canonical facts, but must not invent:
- customer praise
- service results not visible/proven
- exact contamination/removal percentages
- sponsor claims
- technical product performance claims

## Sponsor integration
A case may expose actual tools/products/technical partners used. Sponsored content must be labeled according to `SPONSORS.md`.

## Distribution architecture
Integrations should be adapters around the canonical publishing model. Website publishing must not depend on social APIs being available.

Store per-channel publication records:
- channel
- external post ID/url
- published_at
- status/error
- content variant ID

## Goal
The content system should turn daily craftsmanship into a durable acquisition asset, not into extra admin work.
