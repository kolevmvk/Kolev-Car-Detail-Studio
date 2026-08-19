-- Migration: 20260819000001_content_management
-- Purpose: Owner-managed service pricing and controlled promotional placements.
--
-- Promotions are deliberately structured content, not arbitrary HTML/CSS.
-- The public site owns visual templates; Studio users only control safe copy,
-- schedule, service association and an internal same-origin CTA.

CREATE TABLE IF NOT EXISTS public.promotions (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_name  text        NOT NULL CHECK (char_length(internal_name) BETWEEN 2 AND 80),
  placement      text        NOT NULL DEFAULT 'homepage_story_end'
                             CHECK (placement IN ('homepage_story_end')),
  template       text        NOT NULL DEFAULT 'spotlight'
                             CHECK (template IN ('spotlight', 'signal', 'service_focus')),
  eyebrow        text        NOT NULL CHECK (char_length(eyebrow) BETWEEN 2 AND 60),
  headline       text        NOT NULL CHECK (char_length(headline) BETWEEN 2 AND 120),
  body           text        CHECK (body IS NULL OR char_length(body) <= 240),
  cta_label      text        NOT NULL CHECK (char_length(cta_label) BETWEEN 2 AND 48),
  cta_href       text        NOT NULL DEFAULT '/booking'
                             CHECK (
                               left(cta_href, 1) = '/'
                               AND left(cta_href, 2) <> '//'
                               AND char_length(cta_href) <= 200
                             ),
  service_id     uuid        REFERENCES public.services (id) ON DELETE SET NULL,
  enabled        boolean     NOT NULL DEFAULT false,
  starts_at      timestamptz,
  ends_at        timestamptz,
  sort_order     integer     NOT NULL DEFAULT 0,
  created_by     uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT promotion_valid_period CHECK (
    ends_at IS NULL OR starts_at IS NULL OR ends_at > starts_at
  )
);

COMMENT ON TABLE public.promotions IS
  'Owner-authored copy rendered only through predefined public-site promo templates.';

ALTER TABLE public.promotions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_live_promotions" ON public.promotions;
DROP POLICY IF EXISTS "admins_select_all_promotions" ON public.promotions;
DROP POLICY IF EXISTS "admins_modify_promotions" ON public.promotions;

CREATE POLICY "public_select_live_promotions"
  ON public.promotions
  FOR SELECT
  TO anon
  USING (
    enabled = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (ends_at IS NULL OR ends_at > now())
  );

CREATE POLICY "admins_select_all_promotions"
  ON public.promotions
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_promotions"
  ON public.promotions
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

CREATE INDEX IF NOT EXISTS idx_promotions_live_placement
  ON public.promotions (placement, enabled, sort_order, starts_at, ends_at);

REVOKE ALL ON TABLE public.promotions FROM anon, authenticated;
GRANT SELECT ON TABLE public.promotions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.promotions TO authenticated;
