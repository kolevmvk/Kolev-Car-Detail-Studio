# Booking & Capacity

## Goal
Make booking feel selective and premium because the owner has genuinely limited working capacity, not because the UI fabricates scarcity.

## Booking model
Each service defines:
- `name`
- `slug`
- `duration_minutes`
- `buffer_before_minutes`
- `buffer_after_minutes`
- `booking_mode`: `direct | request | photo_assessment`
- `base_price` or `price_from`
- optional vehicle-size modifiers
- active/inactive

Availability sources:
- recurring weekly windows
- one-off opened windows
- blocked/private windows
- confirmed/pending bookings according to configured hold policy

## Slot generation
A public slot is valid only if:
1. the full service duration fits inside an open window
2. required buffers fit
3. it does not overlap blocked time or another job
4. it respects any minimum notice / maximum advance rule
5. service is bookable in that window

Never hardcode visible fake slots.

## Public presentation
Default booking view should show **the nearest 2–4 relevant slots**, not a giant monthly calendar.

Example:
`Najbliži termini`
- Thu 17:30
- Sat 09:00
- Sat 14:30

Then: `Prikaži kasnije termine`.

If factual, the interface may show computed statements such as `2 termina preostala ove nedelje`.

## Booking flow
Keep it short:
1. choose/confirm service
2. choose valid slot or request assessment
3. provide name + phone
4. optional vehicle details/photos depending on service
5. confirm request/booking

No customer account required in v1.

## Photo assessment
For services requiring visual assessment, collect a small guided set of images. Example:
- front/headlights
- front seats
- rear bench / affected area

Do not claim AI diagnosis unless a real validated vision workflow is implemented. Human review is acceptable and often preferred.

## Status semantics
Suggested booking states:
- `requested`
- `held`
- `confirmed`
- `rescheduled`
- `cancelled_customer`
- `cancelled_studio`
- `no_show`
- `converted_to_job`

Keep audit timestamps. Do not rewrite history by replacing previous values without event records where operationally relevant.

## Waitlist
If no suitable slot exists, offer a waitlist only with explicit opt-in. A released slot can be surfaced to waitlisted customers according to owner-controlled workflow.

## Notifications
Design abstraction for SMS/WhatsApp/email later, but do not require all channels in v1. Store consent and delivery status when introduced.
