# Studio OS

## Purpose
The owner needs a compact operating system for the real studio, not a generic admin dashboard.

The core object is the **job**. Calendar, customer, service, media, content and sponsor attribution should connect through it.

## Core modules
- Today / Studio Board
- Calendar & availability
- Bookings
- Jobs
- Services
- Customers
- Cases / Archive
- Media library
- Publish / distribution
- Analytics
- Sponsors
- Settings

## Studio Board
The default admin view should answer in one screen:
- What vehicle/job is active now?
- What is next?
- What capacity remains this week?
- Which booking needs action?
- Which completed job has unpublished media?

Do not fill the page with vanity metric cards.

## Availability model
Support both:
1. recurring availability windows
2. one-off availability drops
3. blocked/private intervals
4. existing bookings/jobs

A valid booking slot is calculated from service duration + buffer + owner's true available interval.

Example:
- Saturday availability: 09:00–18:00
- Headlights duration: 90 min
- Interior deep clean: 240 min

The system must not show a slot that cannot fit the chosen service.

## Public scarcity
Scarcity is a consequence of real scheduling data.

Allowed when true:
- `Još 2 termina ove nedelje`
- `Prvi slobodan termin: subota 10:00`

Never create fake bookings, artificial countdowns or fake “someone is viewing this slot” indicators.

Public booking should show a small set of nearest suitable slots first, with explicit expansion for later dates.

## Booking modes per service
Each service can be configured as:
- direct booking
- request/approval
- photo assessment required

Public users do not need accounts.

Minimal booking data:
- name
- phone
- selected service
- selected slot or requested window
- vehicle model/year optional
- notes optional
- photos optional/required by service
- privacy/media consent tracked separately

## Job lifecycle
Suggested state machine:
`request → confirmed → arrived → in_progress → completed → media_ready → published`

Cancellation/no-show/reschedule should be explicit states/events, not overwritten history.

## Media workflow
Every job may contain labeled media:
- before
- process
- after
- detail
- video

The owner should be able to mark media suitable for public use and retain customer consent status.

## Content workflow
A completed job can become a Case. A case is the canonical content source used by the website and future supported social publishing integrations.

Do not build independent copies of the same content for every channel.

## Analytics that matter
Prioritize:
- visits by source/channel
- story progression/engagement
- service views
- before/after interactions
- booking opens
- slot views
- photo-assessment submissions
- completed bookings
- conversion by service
- conversion by case/content item
- social/content referral performance

Avoid presenting raw analytics as business insight without context.

## Security
Admin authentication is mandatory before any private customer/media/schedule data is exposed. Use role/row-level protection appropriate to chosen backend. Public analytics must never expose personal customer data.
