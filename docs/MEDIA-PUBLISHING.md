# Media & Publishing Pipeline

The studio should upload once and reuse intelligently across its own website and social channels. This is not a generic DAM or social scheduler; it is a content engine centered on completed detailing jobs.

## Source-of-truth flow

JOB
-> BEFORE / PROCESS / AFTER / DETAIL media
-> CASE draft
-> select narrative/media
-> generate channel-specific derivatives
-> compose distribution items
-> approve
-> publish/schedule
-> collect publication status + performance

## Capture model

For every job, encourage a consistent capture set without making it bureaucratic:

Minimum useful set:
- one wide BEFORE
- one or two problem close-ups
- one PROCESS shot/clip
- one matched-angle AFTER
- one beauty/detail AFTER

For headlights:
- front three-quarter or frontal pair
- close-up oxidation
- process
- restored close-up
- night/light-output shot when available

For interior:
- whole cabin/seat context
- stain/fiber close-up
- extraction/process
- dirty extractor water if useful and truthful
- matched-angle cleaned result

The admin UI should guide this visually rather than require long forms.

## Asset rules

- Preserve originals untouched.
- Store orientation and capture metadata when available.
- Generate purpose-specific derivatives.
- Avoid repeated re-encoding from already compressed derivatives.
- Use image focal-point/crop metadata so hero/social crops can differ without destroying composition.
- For video, preserve a source master and generate web/social outputs.

## Derived formats

At minimum prepare:
- web hero landscape
- web portrait/mobile
- web inline
- thumbnail
- Instagram feed 4:5
- Story/Reel 9:16
- optional square
- Reel/video cover

Exact pixel sizes may evolve with platform requirements; keep format intent in the domain rather than hard-coding current platform numbers everywhere.

## Case Composer

A case is not a gallery. It is a short documented transformation.

Suggested structure:
1. vehicle/context
2. visible problem
3. one decisive process detail
4. result
5. time/service facts
6. optional products/technical partner credits

Copy should be specific and restrained. Avoid fake drama, fabricated technical metrics, and invented customer quotes.

## Channel composition

### Website
Longest form. Cinematic sequence, matched before/after, process detail, service/time facts, contextual technical partner credits.

### Instagram feed
Strong first frame. Prefer before/after or a striking problem/result pair. Carousel should tell a compact transformation story rather than dumping ten similar images.

### Story
Fast, vertical, highly legible. Process fragments, available slot announcement, fresh result, behind-the-scenes.

### Reel/TikTok
Hook in first moments. Use real process motion. Avoid fake AI transitions if they obscure proof. A simple dirty -> process -> reveal sequence is stronger than generic effects.

### Facebook
May carry slightly more context and local-business information, but should still lead with proof.

## Publishing state machine

DRAFT -> READY -> SCHEDULED or PUBLISHING -> PUBLISHED
Failure states: FAILED, NEEDS_REAUTH, REJECTED

Every publish request receives an idempotency key. Retry only when safe.

## Provider adapters

Each channel adapter must normalize:
- connection status
- capabilities
- supported media formats
- publish validation
- publish result
- external post id/url
- retryable vs permanent error

Do not scatter Meta/TikTok-specific APIs through UI components.

## Approval model

Initial product assumes owner approval before external publication.

Possible future automation:
- auto-publish web case when marked approved
- prepare social drafts automatically
- never auto-publish externally by default without explicit studio setting

## Sponsor/partner integration

Technical partners are credited only when context is real.

Examples:
- product genuinely used in this job
- equipment partner relevant to the process
- sponsored transformation campaign

A social draft can inherit sponsor tags/credits from the case, but admin must be able to review them before publish.

## Scheduling and availability content

The content engine may create honest availability posts/stories such as:
- '2 open appointments this week'
- 'Saturday slot opened'

These values must be resolved from real booking availability at composition/publish time. Never persist fake scarcity copy disconnected from calendar truth.

## Failure handling

If external publishing fails:
- keep the prepared asset/caption
- preserve provider error safely
- allow retry
- show whether reconnect/auth is required
- never mark published without confirmed provider result

## Metrics linkage

Store enough linkage to answer:
- which case generated traffic?
- which channel/post generated booking opens?
- which service benefited?
- which sponsor placement was shown/clicked?

Use campaign/UTM-like identifiers where appropriate, but keep URLs clean and centrally generated.

## Agent rule

Do not build a full social-media management platform. Build the smallest reliable pipeline that turns real completed studio work into reusable, approved, measurable content.