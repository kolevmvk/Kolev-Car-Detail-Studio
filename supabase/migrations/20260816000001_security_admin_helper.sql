-- Migration: 20260816000001_security_admin_helper
-- Purpose: Establish secure admin-identity helpers aligned with the baseline
-- admin_profiles model, without exposing privileged helpers in the public API.
--
-- Security decisions documented here:
--
-- 1. admin_profiles is the canonical admin identity table in the live baseline.
--    Preserve it instead of introducing a parallel studio_users table.
--
-- 2. private.is_admin()/private.is_owner() are SECURITY DEFINER helpers in a
--    non-exposed schema so RLS can safely consult admin_profiles without making
--    a privileged function directly callable through the public API.
--
-- 3. public.is_admin() is retained only as a SECURITY INVOKER compatibility shim
--    for older baseline policies. It is no longer privileged and anon loses
--    EXECUTE, which removes the release-blocking advisor issue.

-- ─── admin_profiles ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admin_profiles (
  user_id       uuid        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  display_name  text,
  role          text        NOT NULL CHECK (role IN ('owner', 'admin', 'editor')),
  status        text        NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);

COMMENT ON TABLE public.admin_profiles IS
  'Admin-facing identity records. Linked 1-to-1 with auth.users. Public visitors never have rows here.';

CREATE SCHEMA IF NOT EXISTS private;

REVOKE ALL ON SCHEMA private FROM PUBLIC;
GRANT USAGE ON SCHEMA private TO authenticated;
GRANT USAGE ON SCHEMA private TO service_role;

-- ─── private helpers ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.admin_profiles
    WHERE  user_id = auth.uid()
      AND  role   IN ('owner', 'admin')
      AND  status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION private.is_owner()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM   public.admin_profiles
    WHERE  user_id = auth.uid()
      AND  role    = 'owner'
      AND  status  = 'active'
  )
$$;

COMMENT ON FUNCTION private.is_admin() IS
  'Privileged helper for RLS checks. Returns true when the caller is an active owner or admin.';
COMMENT ON FUNCTION private.is_owner() IS
  'Privileged helper for RLS checks. Returns true when the caller is the active owner.';

REVOKE ALL ON FUNCTION private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION private.is_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_admin() TO service_role;
GRANT EXECUTE ON FUNCTION private.is_owner() TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_owner() TO service_role;

-- ─── public compatibility shim ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
  SELECT private.is_admin()
$$;

COMMENT ON FUNCTION public.is_admin() IS
  'Compatibility shim for legacy policies. SECURITY INVOKER only; not a privileged API entrypoint.';

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_admin() FROM anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO service_role;

-- ─── RLS on admin_profiles ─────────────────────────────────────────────────

ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_profiles_self_or_admin_select" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_self_select" ON public.admin_profiles;
DROP POLICY IF EXISTS "admin_profiles_admin_select" ON public.admin_profiles;
DROP POLICY IF EXISTS "owner_manage_admin_profiles" ON public.admin_profiles;

-- Any signed-in admin user can read their own row. This keeps auth checks
-- simple without exposing the roster to non-admin users.
CREATE POLICY "admin_profiles_self_select"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Active admins and owners can read the full roster.
CREATE POLICY "admin_profiles_admin_select"
  ON public.admin_profiles
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

-- Only the owner can create/update/delete admin role assignments.
CREATE POLICY "owner_manage_admin_profiles"
  ON public.admin_profiles
  FOR ALL
  TO authenticated
  USING (private.is_owner())
  WITH CHECK (private.is_owner());
