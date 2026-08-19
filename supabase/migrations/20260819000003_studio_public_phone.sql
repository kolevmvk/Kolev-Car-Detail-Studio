-- Migration: 20260819000003_studio_public_phone
-- Purpose: Ordinary public telephone number on the studio profile.
-- Empty stays unpublished. Never invent a number in the UI.

ALTER TABLE public.studio_public_profile
  ADD COLUMN IF NOT EXISTS phone text
  CHECK (phone IS NULL OR (char_length(phone) BETWEEN 6 AND 30));

COMMENT ON COLUMN public.studio_public_profile.phone IS
  'Owner-entered public telephone. NULL means unpublished; no placeholder number.';
