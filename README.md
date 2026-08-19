# Kolev Car Detail Studio

Public cinematic story and Studio OS for Kolev Car Detailing, Negotin.

## Local

```bash
pnpm install
cp .env.example .env.local
# set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY and SUPABASE_SERVICE_ROLE_KEY
# optional verified profiles: NEXT_PUBLIC_INSTAGRAM_URL, NEXT_PUBLIC_FACEBOOK_URL,
# NEXT_PUBLIC_TIKTOK_URL
pnpm dev
```

## Verify

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

See `AGENTS.md` and `docs/` before changing product behavior.
