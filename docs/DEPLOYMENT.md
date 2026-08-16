# Deployment and Environments

## Environments

Use three logical environments:

### Local
Developer machine with local env vars. May use a dedicated development Supabase project or local Supabase stack once implementation starts.

### Preview
Every pull request may deploy to a Vercel preview. Preview must never point at production write credentials by default.

### Production
Public website and Studio OS production deployment with production Supabase project and tightly controlled secrets.

## Environment variables

Validate at process startup/build boundary. Keep public and private variables explicitly separated.

Typical categories:
- public Supabase URL/publishable key
- private server credentials
- webhook verification secrets
- social publishing credentials
- cron secret
- monitoring DSN/config

Never commit secret values. `.env.example` documents names and purposes only.

## Database changes

All schema changes are migrations under `supabase/migrations/`.

Rules:
- no manual production schema drift
- migration reviewed before production
- destructive changes require explicit backup/rollback consideration
- indexes and constraints are part of the feature, not later cleanup

## Storage

Separate logical buckets/policies for:
- private customer/job originals
- private processing artifacts
- public approved case derivatives
- brand/site assets where appropriate

Public visibility is an explicit publishing action, never the default upload state.

## Vercel

Use framework-native deployments. Server functions handle trusted server work. Scheduled jobs may use Vercel Cron only for tasks whose required frequency fits the selected Vercel plan; do not design critical near-real-time queues around free-plan cron assumptions.

Secure scheduled endpoints with a secret and make jobs idempotent.

## External publishing

External networks are integration boundaries, not domain authorities. Store local intent/status first, then dispatch through adapters. Webhooks are verified and mapped to local outbox/publication records.

## CI gate

Pull requests should run at minimum:
1. dependency install from lockfile
2. lint
3. typecheck
4. unit/integration tests
5. production build
6. critical Playwright flows when applicable

## Production release gate

Before production:
- migrations applied safely
- required secrets configured
- auth and RLS tests pass
- public/mobile smoke test passes
- booking overlap test passes when booking code changed
- media privacy test passes when storage code changed
- rollback path understood

## Backups / recovery

Do not call the system production-ready until database backup/recovery behavior is documented and tested at least once. Media originals that matter operationally need an explicit retention and recovery policy.
