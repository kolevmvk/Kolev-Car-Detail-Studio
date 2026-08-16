-- Migration: 20260816000002_core_schema
-- Purpose: Create all Phase 2 domain tables.
--
-- Timezone: All timestamptz columns store UTC. Application and queries convert
-- to Europe/Belgrade (UTC+1 / UTC+2 DST). The slot engine enforces this.
--
-- Table order respects FK dependencies:
--   services → (none)
--   customers → (none)
--   vehicles → (none)
--   availability_windows → (none)
--   availability_blocks → (none)
--   bookings → customers, vehicles, services
--   jobs → bookings (optional), vehicles
--   job_services → jobs, services
--   waitlist_entries → services

-- ─── Extensions ────────────────────────────────────────────────────────────
-- btree_gist is required for the exclusion constraint in migration 000003.
-- Enable here so it is available when that migration runs.
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- ─── Enums ─────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE public.booking_mode AS ENUM ('instant', 'request', 'unavailable');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.price_mode AS ENUM ('fixed', 'from', 'quote');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'confirmed',
    'declined',
    'rescheduled',
    'cancelled',
    'completed',
    'no_show'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.booking_source AS ENUM (
    'website', 'admin', 'phone', 'instagram', 'facebook', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.block_reason AS ENUM (
    'private', 'closed', 'maintenance', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.job_status AS ENUM (
    'planned', 'arrived', 'inspection', 'in_progress',
    'final_check', 'done', 'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── services ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.services (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                    text        NOT NULL UNIQUE,
  name                    text        NOT NULL,
  short_description       text,
  long_description        text,
  booking_mode            public.booking_mode NOT NULL DEFAULT 'request',
  duration_minutes        integer     NOT NULL CHECK (duration_minutes > 0),
  cleanup_buffer_minutes  integer     NOT NULL DEFAULT 0 CHECK (cleanup_buffer_minutes >= 0),
  price_mode              public.price_mode NOT NULL DEFAULT 'quote',
  price_amount_minor      integer     CHECK (price_amount_minor >= 0),
  currency                text        NOT NULL DEFAULT 'RSD',
  active                  boolean     NOT NULL DEFAULT true,
  sort_order              integer     NOT NULL DEFAULT 0,
  booking_constraints     jsonb,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.services IS
  'Bookable or request-only detailing services. duration_minutes drives slot calculation.';
COMMENT ON COLUMN public.services.cleanup_buffer_minutes IS
  'Cleanup/transition time after the service ends. Included in slot end time. '
  'Prevents back-to-back bookings without a break.';

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_active_services" ON public.services;
DROP POLICY IF EXISTS "public_read_active_services" ON public.services;
DROP POLICY IF EXISTS "admins_select_all_services" ON public.services;
DROP POLICY IF EXISTS "admin_all_services" ON public.services;
DROP POLICY IF EXISTS "admins_modify_services" ON public.services;

CREATE POLICY "public_select_active_services"
  ON public.services
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "admins_select_all_services"
  ON public.services
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_services"
  ON public.services
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── customers ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.customers (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  phone               text        NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  email               text        CHECK (char_length(email) <= 254),
  contact_preference  text        NOT NULL DEFAULT 'phone' CHECK (contact_preference IN ('phone', 'email', 'whatsapp')),
  consent_marketing   boolean     NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.customers IS
  'Minimal customer contact records. Never exposed in public case payloads.';

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_customers" ON public.customers;
DROP POLICY IF EXISTS "admins_select_customers" ON public.customers;
DROP POLICY IF EXISTS "admin_all_customers" ON public.customers;
DROP POLICY IF EXISTS "admins_modify_customers" ON public.customers;

CREATE POLICY "anon_insert_customers"
  ON public.customers
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can see and manage all customers.
CREATE POLICY "admins_select_customers"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_customers"
  ON public.customers
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── vehicles ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.vehicles (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  make            text        NOT NULL CHECK (char_length(make) BETWEEN 1 AND 80),
  model           text        NOT NULL CHECK (char_length(model) BETWEEN 1 AND 80),
  year            smallint    CHECK (year BETWEEN 1950 AND 2030),
  color           text        CHECK (char_length(color) <= 40),
  registration    text        CHECK (char_length(registration) <= 20),
  notes           text        CHECK (char_length(notes) <= 1000),
  created_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.vehicles
  ADD COLUMN IF NOT EXISTS customer_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'vehicles_customer_id_fkey'
      AND conrelid = 'public.vehicles'::regclass
  ) THEN
    ALTER TABLE public.vehicles
      ADD CONSTRAINT vehicles_customer_id_fkey
      FOREIGN KEY (customer_id)
      REFERENCES public.customers (id)
      ON DELETE SET NULL;
  END IF;
END $$;

COMMENT ON TABLE public.vehicles IS
  'Customer vehicle records. registration is private — never exposed publicly.';

ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "admins_select_vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "admin_all_vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "admins_modify_vehicles" ON public.vehicles;

CREATE POLICY "anon_insert_vehicles"
  ON public.vehicles
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins_select_vehicles"
  ON public.vehicles
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_vehicles"
  ON public.vehicles
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── availability_windows ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.availability_windows (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at       timestamptz NOT NULL,
  ends_at         timestamptz NOT NULL CHECK (ends_at > starts_at),
  source          text        NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'recurring_rule')),
  recurrence_rule text,
  enabled         boolean     NOT NULL DEFAULT true,
  note            text        CHECK (char_length(note) <= 500),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT window_minimum_duration CHECK (
    EXTRACT(EPOCH FROM (ends_at - starts_at)) >= 1800
  )
);

COMMENT ON TABLE public.availability_windows IS
  'Owner-defined periods during which work CAN be booked. '
  'No window = no slots shown. Public booking derives all slots from these.';

ALTER TABLE public.availability_windows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_enabled_windows" ON public.availability_windows;
DROP POLICY IF EXISTS "admins_select_all_windows" ON public.availability_windows;
DROP POLICY IF EXISTS "admin_all_availability_windows" ON public.availability_windows;
DROP POLICY IF EXISTS "admins_modify_windows" ON public.availability_windows;

CREATE POLICY "public_select_enabled_windows"
  ON public.availability_windows
  FOR SELECT
  TO anon, authenticated
  USING (enabled = true);

CREATE POLICY "admins_select_all_windows"
  ON public.availability_windows
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_windows"
  ON public.availability_windows
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── availability_blocks ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.availability_blocks (
  id          uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at   timestamptz       NOT NULL,
  ends_at     timestamptz       NOT NULL CHECK (ends_at > starts_at),
  reason      public.block_reason NOT NULL DEFAULT 'private',
  note        text              CHECK (char_length(note) <= 500),
  created_at  timestamptz       NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.availability_blocks IS
  'Explicit unavailability within an otherwise open window. '
  'The slot engine excludes any slot that overlaps a block.';

ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_blocks" ON public.availability_blocks;
DROP POLICY IF EXISTS "admins_select_blocks" ON public.availability_blocks;
DROP POLICY IF EXISTS "admin_all_availability_blocks" ON public.availability_blocks;
DROP POLICY IF EXISTS "admins_modify_blocks" ON public.availability_blocks;

CREATE POLICY "public_select_blocks"
  ON public.availability_blocks
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "admins_select_blocks"
  ON public.availability_blocks
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_blocks"
  ON public.availability_blocks
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── bookings ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bookings (
  id               uuid                  PRIMARY KEY DEFAULT gen_random_uuid(),
  public_reference text                  NOT NULL UNIQUE DEFAULT upper(substring(gen_random_uuid()::text from 1 for 8)),
  customer_id      uuid                  NOT NULL REFERENCES public.customers (id) ON DELETE RESTRICT,
  vehicle_id       uuid                  NOT NULL REFERENCES public.vehicles (id) ON DELETE RESTRICT,
  service_id       uuid                  NOT NULL REFERENCES public.services (id) ON DELETE RESTRICT,
  starts_at        timestamptz,
  ends_at          timestamptz           CHECK (ends_at > starts_at),
  status           public.booking_status NOT NULL DEFAULT 'pending',
  source           public.booking_source NOT NULL DEFAULT 'website',
  customer_note    text                  CHECK (char_length(customer_note) <= 1000),
  internal_note    text                  CHECK (char_length(internal_note) <= 2000),
  created_at       timestamptz           NOT NULL DEFAULT now(),
  confirmed_at     timestamptz,
  CONSTRAINT consistent_time_range CHECK (
    (starts_at IS NULL AND ends_at IS NULL)
    OR (starts_at IS NOT NULL AND ends_at IS NOT NULL)
  )
);

COMMENT ON TABLE public.bookings IS
  'Customer reservation / service request. '
  'ends_at includes the service cleanup_buffer_minutes from the service record. '
  'The overlap exclusion constraint is added in migration 000003.';

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_bookings" ON public.bookings;
DROP POLICY IF EXISTS "admins_select_bookings" ON public.bookings;
DROP POLICY IF EXISTS "admin_all_bookings" ON public.bookings;
DROP POLICY IF EXISTS "admins_modify_bookings" ON public.bookings;

CREATE POLICY "anon_insert_bookings"
  ON public.bookings
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admins can read/manage all bookings.
CREATE POLICY "admins_select_bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (private.is_admin());

CREATE POLICY "admins_modify_bookings"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── jobs ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.jobs (
  id                 uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id         uuid             REFERENCES public.bookings (id) ON DELETE SET NULL,
  vehicle_id         uuid             NOT NULL REFERENCES public.vehicles (id) ON DELETE RESTRICT,
  status             public.job_status NOT NULL DEFAULT 'planned',
  started_at         timestamptz,
  completed_at       timestamptz,
  internal_notes     text             CHECK (char_length(internal_notes) <= 4000),
  public_summary     text             CHECK (char_length(public_summary) <= 1000),
  publish_permission text             NOT NULL DEFAULT 'unknown'
                                      CHECK (publish_permission IN ('unknown', 'granted', 'denied')),
  created_at         timestamptz      NOT NULL DEFAULT now(),
  updated_at         timestamptz      NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.jobs IS
  'Actual studio work. A booking may become a job; walk-ins can also create jobs directly.';

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_jobs" ON public.jobs;
DROP POLICY IF EXISTS "admin_all_jobs" ON public.jobs;

CREATE POLICY "admins_manage_jobs"
  ON public.jobs
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── job_services ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.job_services (
  job_id              uuid    NOT NULL REFERENCES public.jobs (id) ON DELETE CASCADE,
  service_id          uuid    NOT NULL REFERENCES public.services (id) ON DELETE RESTRICT,
  quoted_price_minor  integer CHECK (quoted_price_minor >= 0),
  final_price_minor   integer CHECK (final_price_minor >= 0),
  duration_minutes    integer CHECK (duration_minutes > 0),
  PRIMARY KEY (job_id, service_id)
);

ALTER TABLE public.job_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admins_manage_job_services" ON public.job_services;
DROP POLICY IF EXISTS "admin_all_job_services" ON public.job_services;

CREATE POLICY "admins_manage_job_services"
  ON public.job_services
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── waitlist_entries ──────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.waitlist_entries (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id  uuid        NOT NULL REFERENCES public.services (id) ON DELETE CASCADE,
  name        text        NOT NULL CHECK (char_length(name) BETWEEN 2 AND 120),
  phone       text        NOT NULL CHECK (char_length(phone) BETWEEN 6 AND 30),
  note        text        CHECK (char_length(note) <= 500),
  notified_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.waitlist_entries IS
  'Interest records when no slots are available. Owner notifies manually or via future workflow.';

ALTER TABLE public.waitlist_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_waitlist" ON public.waitlist_entries;
DROP POLICY IF EXISTS "admins_manage_waitlist" ON public.waitlist_entries;

CREATE POLICY "anon_insert_waitlist"
  ON public.waitlist_entries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admins_manage_waitlist"
  ON public.waitlist_entries
  FOR ALL
  TO authenticated
  USING (private.is_admin())
  WITH CHECK (private.is_admin());

-- ─── Indexes ───────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_bookings_service_status
  ON public.bookings (service_id, status)
  WHERE status IN ('pending', 'confirmed');

CREATE INDEX IF NOT EXISTS idx_bookings_starts_at
  ON public.bookings (starts_at)
  WHERE starts_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_windows_enabled_range
  ON public.availability_windows (starts_at, ends_at)
  WHERE enabled = true;

CREATE INDEX IF NOT EXISTS idx_blocks_range
  ON public.availability_blocks (starts_at, ends_at);

-- ─── Grants ────────────────────────────────────────────────────────────────

-- Supabase defaults can leave broad table privileges in place. Revoke them
-- explicitly so RLS policies are paired with the smallest table-level grants
-- needed for the public booking flow and Studio OS.
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
