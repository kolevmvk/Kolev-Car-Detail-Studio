# Live Infrastructure

This file records non-secret live infrastructure identifiers for agents. Never commit secret keys here.

## GitHub
- Repository: `kolevmvk/Kolev-Car-Detail-Studio`
- Default branch: `main`
- Foundation work branch: `ai-foundation`

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
- Project is not yet created because no application framework exists on `main` yet.
- First implementation agent should create the Next.js app, push it, then connect/import this GitHub repository into Vercel under the team above.

## Required environment variables
See `.env.example`.

## Agent rule
Never place service-role keys, social access tokens, database passwords or other secrets in Git, issues, PR bodies, screenshots, or client-side code.
