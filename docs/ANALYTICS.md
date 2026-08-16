# Analytics

## Purpose
Analytics exists to answer business questions, not to decorate the admin with charts.

## Core questions
- Which service attracts the most qualified attention?
- Which cases/content items lead to booking intent?
- Which traffic sources bring bookings rather than visits?
- Where do visitors abandon the booking flow?
- What real capacity is being utilized?
- Which sponsor placements/content generate measurable value?

## Event model
Plan consistent events such as:
- `page_view`
- `story_scene_view`
- `service_view`
- `before_after_interaction`
- `case_view`
- `booking_open`
- `slot_list_view`
- `slot_selected`
- `photo_assessment_started`
- `photo_assessment_submitted`
- `booking_submitted`
- `booking_confirmed`
- `sponsor_impression`
- `sponsor_click`
- `outbound_social_click`

Events should include relevant IDs (service/case/source/campaign) without putting unnecessary personal customer data into analytics payloads.

## Admin summaries
Prefer operational funnels:
`visits → service interest → booking open → booking submitted → confirmed`

Show conversion by:
- service
- case/content item
- acquisition source
- period

## Capacity metrics
Useful operational metrics:
- available work hours
- booked work hours
- utilization rate
- cancellation/no-show rate
- average lead time to next valid slot

Do not intentionally manipulate capacity metrics to create scarcity.

## Sponsor reporting
Only report what instrumentation can support reliably:
- impressions
- clicks
- associated case views
- social publication counts
- attributable booking events where a defensible attribution rule exists

## Privacy
Analytics must respect applicable consent/privacy requirements. Avoid fingerprinting or collecting unrelated browser/device data simply because it is technically possible.

## Implementation principle
Use stable event names and a thin analytics abstraction so the provider can be changed without rewriting product logic.
