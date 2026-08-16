# Data Model

This document is the canonical domain model for Kolev Car Detailing Studio. Implementation agents must preserve these boundaries even if the underlying database, ORM, or backend changes.

## Design principles

- Model the studio's real workflow, not generic CMS abstractions.
- A completed job is the central business object: booking -> vehicle -> job -> media -> case -> distribution -> analytics.
- Availability is explicit and real. Never manufacture occupancy.
- Media is reusable across web, admin, and social publishing.
- Sponsorship is contextual and attached to real work, products, tools, cases, or campaigns.
- Analytics events should be business-readable.

## Core entities

### User
Admin-facing identity.

Fields:
- id
- email
- display_name
- role: owner | admin | editor
- status
- created_at
- last_login_at

Initial release may have one owner account but the model must not hard-code a single-user assumption.

### Service
A bookable or request-only detailing service.

Fields:
- id
- slug
- name
- short_description
- long_description
- booking_mode: instant | request | unavailable
- duration_minutes
- cleanup_buffer_minutes
- price_mode: fixed | from | quote
- price_amount_minor
- currency
- active
- sort_order
- hero_media_id
- booking_constraints JSON

Initial services include headlight restoration, deep interior cleaning, and combined/full-refresh offers. Names and prices are admin-editable.

### Vehicle
Represents a customer's vehicle and may appear across bookings/jobs/cases.

Fields:
- id
- make
- model
- year
- color optional
- registration optional/private
- mileage optional
- notes

Public case views must never expose registration, phone, customer name, or other private customer data.

### Customer
Minimal operational record, not a CRM surveillance profile.

Fields:
- id
- name
- phone
- email optional
- contact_preference
- consent_marketing
- created_at

### AvailabilityWindow
Owner-defined periods during which work may be booked.

Fields:
- id
- starts_at
- ends_at
- source: manual | recurring_rule
- recurrence_rule optional
- enabled
- note

### AvailabilityBlock
Explicitly removes capacity from an availability window.

Fields:
- id
- starts_at
- ends_at
- reason: private | closed | maintenance | other
- note

### Booking
Customer reservation/request.

Fields:
- id
- public_reference
- customer_id
- vehicle_id
- service_id
- starts_at optional for request-only bookings
- ends_at optional
- status: pending | confirmed | declined | cancelled | completed | no_show
- source: website | admin | phone | instagram | facebook | other
- customer_note
- internal_note
- created_at
- confirmed_at

Booking slot creation must account for service duration, cleanup buffer, existing bookings, availability windows, and blocks.

### Job
Actual studio work. A booking may become a job, but admin-created walk-in/manual jobs are allowed.

Fields:
- id
- booking_id optional
- vehicle_id
- status: planned | arrived | inspection | in_progress | final_check | done | archived
- started_at
- completed_at
- internal_notes
- public_summary
- publish_permission: unknown | granted | denied

### JobService
Many-to-many relationship between Job and Service.

Fields:
- job_id
- service_id
- quoted_price_minor optional
- final_price_minor optional
- duration_minutes optional

### MediaAsset
Canonical uploaded media object.

Fields:
- id
- owner_user_id
- type: image | video
- storage_key
- original_filename
- mime_type
- bytes
- width optional
- height optional
- duration_ms optional
- checksum
- captured_at optional
- created_at
- processing_status
- metadata JSON

Never overwrite originals. Derivatives are separate records.

### MediaDerivative
Optimized/transcoded variation.

Fields:
- id
- media_asset_id
- purpose: web_hero | web_inline | thumb | social_4x5 | story_9x16 | reel_cover | video_web | video_social | other
- storage_key
- format
- width
- height
- duration_ms optional
- bytes
- processing_status

### JobMedia
Attaches media to a job and gives it narrative meaning.

Fields:
- job_id
- media_asset_id
- stage: before | process | after | detail
- subject: headlights | seat | carpet | plastics | exterior | interior | equipment | other
- sort_order
- public_allowed

### CaseStudy
Public story created from a completed job.

Fields:
- id
- job_id
- slug
- title
- subtitle
- status: draft | published | archived
- narrative JSON
- hero_media_id
- published_at
- featured

A case study should emphasize vehicle, problem, process, time, and result—not generic marketing copy.

### Product
A real product/tool/chemical used in work.

Fields:
- id
- brand
- name
- category
- website_url optional
- sponsor_id optional
- active

### JobProduct
Fields:
- job_id
- product_id
- usage_note optional
- public_visible

### Sponsor
Technical/local/automotive partner.

Fields:
- id
- name
- category: technical | automotive | local
- logo_media_id
- website_url
- instagram_url optional
- description
- status: prospect | active | paused | ended

### SponsorCampaign
Fields:
- id
- sponsor_id
- name
- starts_at
- ends_at
- status
- allowed_placements JSON
- notes

### SponsorPlacement
Represents a real contextual appearance.

Fields:
- id
- sponsor_campaign_id
- placement_type: case_credit | product_credit | service_credit | homepage_editorial | social_credit | booking_confirmation
- entity_type
- entity_id
- starts_at optional
- ends_at optional

No generic banner placement type exists by design.

### DistributionItem
One outbound publication unit derived from a case/job/media set.

Fields:
- id
- case_study_id optional
- job_id optional
- channel: web | instagram | facebook | tiktok | other
- format: article | post | carousel | story | reel | video
- status: draft | ready | scheduled | publishing | published | failed
- caption
- scheduled_for optional
- published_at optional
- external_id optional
- external_url optional
- error_message optional

### AnalyticsEvent
Append-only business event.

Fields:
- id
- session_id
- event_name
- occurred_at
- path
- service_id optional
- case_study_id optional
- sponsor_id optional
- booking_id optional
- metadata JSON

Do not store unnecessary personal data in analytics.

## Required constraints

- Prevent overlapping confirmed bookings for the same studio capacity.
- Availability presented publicly must derive from actual availability calculations.
- Private customer information never enters public case payloads.
- Sponsor analytics must distinguish impression and interaction and avoid inflating counts through admin/internal traffic.
- Published cases may only use JobMedia where public_allowed is true and publish_permission is granted when customer-identifiable media exists.
- Deleting a published case must not delete original job media by cascade.

## Suggested relational grouping

Identity: users
Operations: customers, vehicles, services, availability_windows, availability_blocks, bookings, jobs, job_services
Media: media_assets, media_derivatives, job_media
Editorial: case_studies, distribution_items
Partners: sponsors, sponsor_campaigns, sponsor_placements, products, job_products
Measurement: analytics_events

## Agent rule

When implementing a feature, read only the entities relevant to that feature. Do not load this entire model repeatedly into prompts when a smaller schema excerpt is sufficient.