-- Migration: 20260816000004_grant_hardening
-- Purpose: Remove broad default table grants and re-grant only the operations
-- required by the public booking flow and Studio OS RLS policies.

REVOKE ALL ON TABLE
  public.admin_profiles,
  public.services,
  public.customers,
  public.vehicles,
  public.availability_windows,
  public.availability_blocks,
  public.bookings,
  public.jobs,
  public.job_services,
  public.waitlist_entries
FROM anon, authenticated;

GRANT SELECT ON TABLE
  public.services,
  public.availability_windows,
  public.availability_blocks
TO anon;

GRANT INSERT ON TABLE
  public.customers,
  public.vehicles,
  public.bookings,
  public.waitlist_entries
TO anon;

GRANT SELECT ON TABLE
  public.admin_profiles,
  public.services,
  public.customers,
  public.vehicles,
  public.availability_windows,
  public.availability_blocks,
  public.bookings,
  public.jobs,
  public.job_services,
  public.waitlist_entries
TO authenticated;

GRANT INSERT ON TABLE
  public.admin_profiles,
  public.services,
  public.customers,
  public.vehicles,
  public.availability_windows,
  public.availability_blocks,
  public.bookings,
  public.jobs,
  public.job_services,
  public.waitlist_entries
TO authenticated;

GRANT UPDATE, DELETE ON TABLE
  public.admin_profiles,
  public.services,
  public.customers,
  public.vehicles,
  public.availability_windows,
  public.availability_blocks,
  public.bookings,
  public.jobs,
  public.job_services,
  public.waitlist_entries
TO authenticated;
