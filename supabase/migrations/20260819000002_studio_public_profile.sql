-- Migration: 20260819000002_studio_public_profile
-- Purpose: Owner-managed public contact and social destinations.
-- Singleton row. Empty strings are stored as NULL. Public reads only
-- published URLs; no fabricated profiles.

CREATE TABLE IF NOT EXISTS public.studio_public_profile (
  id             boolean     PRIMARY KEY DEFAULT true CHECK (id),
  instagram_url  text        CHECK (instagram_url IS NULL OR char_length(instagram_url) BETWEEN 8 AND 240),
  facebook_url   text        CHECK (facebook_url IS NULL OR char_length(facebook_url) BETWEEN 8 AND 240),
  tiktok_url     text        CHECK (tiktok_url IS NULL OR char_length(tiktok_url) BETWEEN 8 AND 240),
  whatsapp_url   text        CHECK (whatsapp_url IS NULL OR char_length(whatsapp_url) BETWEEN 8 AND 240),
  viber_url      text        CHECK (viber_url IS NULL OR char_length(viber_url) BETWEEN 8 AND 240),
  telegram_url   text        CHECK (telegram_url IS NULL OR char_length(telegram_url) BETWEEN 8 AND 240),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  updated_by     uuid        REFERENCES auth.users (id) ON DELETE SET NULL
);

COMMENT ON TABLE public.studio_public_profile IS
  'Singleton public contact destinations. Empty URLs stay unpublished; icons may wait without fake hrefs.';

INSERT INTO public.studio_public_profile (id)
VALUES (true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.studio_public_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_studio_profile" ON public.studio_public_profile;
DROP POLICY IF EXISTS "admins_select_studio_profile" ON public.studio_public_profile;
DROP POLICY IF EXISTS "admins_modify_studio_profile" ON public.studio_public_profile;

CREATE POLICY "public_select_studio_profile"
  ON public.studio_public_profile
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admins_modify_studio_profile"
  ON public.studio_public_profile
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

REVOKE ALL ON TABLE public.studio_public_profile FROM anon, authenticated;
GRANT SELECT ON TABLE public.studio_public_profile TO anon, authenticated;
GRANT UPDATE ON TABLE public.studio_public_profile TO authenticated;
