-- Migration: 20260816000001_security_admin_helper
-- Purpose: Establish a secure admin-identity helper function and studio_users table.
--
-- Security decisions documented here:
--
-- 1. studio_users table: maps auth.users → role (owner|admin|editor).
--    This is the single source of truth for admin identity. Never inferred from
--    JWT metadata directly, because metadata can be set client-side in some flows.
--
-- 2. public.is_admin() is SECURITY DEFINER with SET search_path = ''.
--    - SET search_path = '' prevents search_path injection attacks (the Supabase
--      security advisor's primary concern with SECURITY DEFINER functions).
--    - The function uses fully-qualified names (public.studio_users, auth.uid()).
--    - REVOKE EXECUTE FROM PUBLIC removes the default grant, then we selectively
--      re-grant to roles that legitimately need it.
--    - anon: REVOKED. Anonymous visitors do not need to check admin status.
--    - authenticated: GRANTED. RLS policies on admin tables call this function;
--      PostgreSQL evaluates RLS in the context of the calling role, so the
--      authenticated role must have EXECUTE to allow the policy to succeed.
--    - service_role: GRANTED. Server-side code using the service role key may
--      call it for auditing or bootstrapping.
--
-- 3. The function returns false (not an error) if no matching studio_users row
--    exists, so new auth accounts are not accidentally elevated to admin.

-- ─── studio_users ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.studio_users (
  id            uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  email         text        NOT NULL,
  display_name  text,
  role          text        NOT NULL CHECK (role IN ('owner', 'admin', 'editor')),
  status        text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

COMMENT ON TABLE public.studio_users IS
  'Admin-facing identity records. Linked 1-to-1 with auth.users. '
  'Public visitors never have rows here.';

-- ─── is_admin() helper ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.studio_users
    WHERE  id     = auth.uid()
      AND  role   IN ('owner', 'admin')
      AND  status = 'active'
  )
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'SECURITY DEFINER helper used by RLS policies. '
  'Returns true when the caller is an active owner or admin studio user. '
  'Not callable by anon role — see REVOKE below.';

-- Remove the default PUBLIC grant, then allow only the roles that need it.
REVOKE ALL   ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT  EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- ─── RLS on studio_users itself ────────────────────────────────────────────

ALTER TABLE public.studio_users ENABLE ROW LEVEL SECURITY;

-- Admins can read the user roster.
CREATE POLICY "admins_select_studio_users"
  ON public.studio_users
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- Owners can insert/update/delete (managed via service_role in practice,
-- but this covers direct Supabase dashboard usage by the owner).
CREATE POLICY "admins_modify_studio_users"
  ON public.studio_users
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
