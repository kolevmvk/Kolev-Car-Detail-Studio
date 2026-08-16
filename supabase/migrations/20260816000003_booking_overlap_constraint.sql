-- Migration: 20260816000003_booking_overlap_constraint
-- Purpose: Enforce that no two active bookings can overlap in time.
--
-- Strategy: tstzrange exclusion constraint using GiST index (btree_gist extension).
--
-- Why this approach:
--   - A SELECT → check → INSERT sequence races under concurrent load. Two requests
--     can both read "slot is free", both pass the check, and both INSERT — producing
--     overlapping bookings.
--   - PostgreSQL exclusion constraints make the uniqueness check and the INSERT
--     atomic at the database level. The second concurrent INSERT gets a constraint
--     violation error, which the application catches and returns as "slot taken".
--   - We scope the constraint to active statuses (pending, confirmed). A cancelled
--     or completed booking does not block future bookings for the same time.
--
-- The time_range generated column:
--   - Computed from starts_at / ends_at.
--   - NULL when starts_at is NULL (request-only bookings without a scheduled time).
--   - The constraint has WHERE (time_range IS NOT NULL) so unscheduled requests
--     never block each other.
--
-- ends_at already includes the service cleanup_buffer_minutes (set by the
-- booking creation action), so the range naturally prevents back-to-back
-- bookings without a gap when buffers are non-zero.

ALTER TABLE public.bookings
  ADD COLUMN time_range tstzrange
    GENERATED ALWAYS AS (
      CASE
        WHEN starts_at IS NOT NULL AND ends_at IS NOT NULL
          THEN tstzrange(starts_at, ends_at, '[)')
        ELSE NULL
      END
    ) STORED;

COMMENT ON COLUMN public.bookings.time_range IS
  'Derived half-open range [starts_at, ends_at). '
  'Used exclusively for the GiST exclusion constraint. '
  'NULL for request-only bookings without a scheduled time.';

-- GiST index powers the exclusion constraint efficiently.
CREATE INDEX IF NOT EXISTS idx_bookings_time_range_gist
  ON public.bookings USING gist (time_range)
  WHERE status IN ('pending', 'confirmed') AND time_range IS NOT NULL;

-- The exclusion constraint itself.
-- Concurrent INSERTs for overlapping time ranges with active status will produce
-- an ERROR 23P01 (exclusion_violation) for the losing transaction.
ALTER TABLE public.bookings
  ADD CONSTRAINT no_overlap_active_bookings
  EXCLUDE USING gist (time_range WITH &&)
  WHERE (status IN ('pending', 'confirmed') AND time_range IS NOT NULL);

COMMENT ON CONSTRAINT no_overlap_active_bookings ON public.bookings IS
  'Prevents two pending or confirmed bookings from occupying overlapping time. '
  'Does not apply to cancelled/declined/completed bookings (they release time). '
  'Does not apply to request-only bookings with no scheduled time (time_range IS NULL).';
