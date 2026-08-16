# Security & Auth

Kolev Car Detailing Studio is a small business product, but its admin contains customer contact data, bookings, unpublished media, social credentials and sponsor data. Security must be proportionate and real, not ceremonial.

## Authentication

Admin authentication requirements:
- secure provider or proven auth library; do not hand-roll password crypto
- server-side session validation
- secure, httpOnly, sameSite cookies when cookie sessions are used
- CSRF protection for state-changing cookie-authenticated requests where framework architecture requires it
- login rate limiting / abuse protection
- password reset handled through secure provider flow if password auth exists
- optional MFA-ready architecture; owner role should support MFA when provider allows it

Public visitors do not need accounts to book.

## Authorization

Roles:
- owner: full access, settings, integrations, sponsor management, user management
- admin: operations and content, no ownership/security-critical settings by default
- editor: media/cases/content publishing only where granted

All authorization is enforced on the server for reads and writes. UI visibility is convenience only.

## Secrets

Secrets include:
- database credentials
- auth secrets
- storage signing secrets
- Meta/TikTok/social API credentials
- webhook signing secrets
- analytics write secrets where applicable

Rules:
- never commit secrets
- `.env.example` contains names only
- production secrets live in deployment secret storage
- never return provider tokens to browser code unless the provider flow explicitly requires short-lived browser tokens
- redact secrets from logs/errors

## Customer data minimization

Store only operationally necessary customer data.

Do not collect:
- precise device fingerprinting
- unrelated browsing history
- contacts
- hidden tracking data not required for business analytics

Booking requires minimal identity/contact information and vehicle/service context.

## Media privacy

Uploads from customers or jobs may include registrations, people, home addresses in background, documents or other identifying details.

Requirements:
- originals private by default
- publication is an explicit action
- case study media uses only assets marked `public_allowed`
- if a customer/person is identifiable, require appropriate publish permission before public use
- provide admin ability to crop/replace media before publication
- public delivery URLs must not expose storage internals or admin-only assets

## Upload security

Validate on server/storage workflow:
- allowed MIME type
- extension mismatch
- file size
- image/video dimensions/duration limits where appropriate
- malware/scanning strategy if storage/provider supports it

Never trust client-provided MIME type alone.

Generate random/opaque storage keys. Do not construct storage paths from raw customer names or phone numbers.

## Booking abuse protection

Public booking endpoints need:
- rate limiting
- schema validation
- bot/spam mitigation if abuse appears
- transactional slot confirmation
- server-generated booking references

Do not reveal private calendar detail. Return bookable slots, not reasons such as 'owner private appointment'.

## Social integrations

OAuth/token integrations must follow least privilege.

- request only scopes required to publish/read publication status
- encrypt/protect long-lived tokens at rest according to hosting capabilities
- support token revocation/disconnect
- show integration health in admin without showing full token values
- verify inbound webhook signatures
- process webhooks idempotently

## Analytics privacy

Use pseudonymous session identifiers. Do not put phone, email or customer name into analytics event payloads.

Sponsor reporting should be aggregate-first.

## Headers and browser defenses

Production should configure appropriate:
- Content-Security-Policy
- HSTS when HTTPS-only
- X-Content-Type-Options
- frame protections / `frame-ancestors`
- Referrer-Policy
- Permissions-Policy as appropriate

CSP must account for required image/video/CDN/social endpoints but should not become `*` everywhere.

## Dependency and supply-chain hygiene

- prefer fewer dependencies
- pin lockfile
- review packages before adding them
- do not install random AI-generated packages without verifying official registry/repository
- remove unused packages
- enable automated dependency alerts where practical

## Auditability

Security-sensitive admin actions should be auditable, including:
- availability changes
- booking cancellation/status changes
- publishing/unpublishing
- sponsor campaign changes
- integration connect/disconnect
- admin user/role changes

A lightweight audit log is sufficient initially.

## Non-negotiable agent rule

Never weaken auth, public/private media separation, upload validation, or transactional booking integrity just to make a demo work. If an integration cannot be safely completed without credentials, implement a clearly marked adapter/stub instead of faking success.