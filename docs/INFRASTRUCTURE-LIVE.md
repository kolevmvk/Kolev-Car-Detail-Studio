# Live Infrastructure

This file records non-secret live infrastructure identifiers for agents. Never commit secret keys here.

## GitHub
- Repository: `kolevmvk/Kolev-Car-Detail-Studio`
- Default branch: `main`

## Supabase
- Project ref: `dzsotxqkpwszlaethzdt`
- Project URL: `https://dzsotxqkpwszlaethzdt.supabase.co`
- Baseline migration applied: `baseline_studio_schema`
- Storage buckets created: `public-media`, `private-media`
- RLS enabled on operational, media, editorial, sponsor, distribution and analytics tables.
- Publishable key exists but is intentionally not committed. Configure it through local/Vercel environment variables.

### Security note
Supabase Security Advisor currently warns that the `public.is_admin()` SECURITY DEFINER helper is externally callable. A hardening migration was prepared but could not be applied through the current connector safety layer. Before production launch, move this helper into a non-exposed schema or otherwise remove external RPC access while preserving RLS behavior. Treat this as a release blocker, not an optional cleanup.

## Vercel
- Team: `ellkolles-projects`
- Team ID: `team_gdUeNz06C40rycE2WWMnWsUF`
- Project: `kolev-car-detail-studio`
- Production URL: `https://kolev-car-detail-studio.vercel.app`
- Production env currently set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SITE_URL`
- Feature-branch pushes create Preview deployments. Production follows `main`.

## Remaining before the site is a real studio product

Public story is live. These items are still open:

1. **Vercel secrets** — add Production `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and `SUPABASE_SERVICE_ROLE_KEY`. Do not commit them. Do not paste them into chat.
2. **Migrations** — apply every file in `supabase/migrations/` on the live project, including `20260819000001` content, `20260819000002` public profile, and `20260819000003` phone.
3. **Studio owner** — create the Auth user for Ivan (full email, password stays in Supabase). Insert `admin_profiles` with `role = owner` and `status = active`. Without that row, `/studio` rejects a valid login.
4. **Owner content** — in Studio, set real services, prices, availability, phone and social URLs. Do not import `supabase/seed.sql` as production prices. Empty contact fields stay unpublished.
5. **Auth URLs** — when a custom domain exists, set Supabase Auth site URL and redirect allow-list. Until then, Vercel hostnames are enough.
6. **`public.is_admin()`** — finish the security-advisor hardening above before calling the launch done.
7. **Backups** — enable PITR / scheduled backups and confirm restore once.

Custom domain can wait. Booking and Studio stay dark until items 1–4 are done.

## Required environment variables
See `.env.example`.

## Agent rule
Never place service-role keys, social access tokens, database passwords or other secrets in Git, issues, PR bodies, screenshots, or client-side code.
