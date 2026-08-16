// Availability engine — pure, side-effect-free slot generation.
//
// All Date objects passed in are expected to be in UTC (as stored in the DB).
// The consumer converts to Europe/Belgrade for display only.
//
// Slot increment: 30 minutes. Candidates are generated every 30 min inside
// each window, then filtered for feasibility. This is configurable via
// SLOT_INCREMENT_MS if services ever need finer granularity.

const SLOT_INCREMENT_MS = 30 * 60 * 1000; // 30 min

export interface ServiceParams {
  durationMinutes: number;
  cleanupBufferMinutes: number;
}

export interface TimeRange {
  startsAt: Date;
  endsAt: Date;
}

export interface SlotCandidate {
  /** Booking start time */
  startsAt: Date;
  /** Booking end time including cleanup buffer */
  endsAt: Date;
}

export interface GenerateSlotsParams {
  service: ServiceParams;
  windows: TimeRange[];
  blocks: TimeRange[];
  existingBookings: TimeRange[];
  now?: Date;
  /** Maximum slots to return (default 20) */
  limit?: number;
}

export interface GenerateSlotsResult {
  slots: SlotCandidate[];
  /** True if there were more slots beyond the limit */
  hasMore: boolean;
}

function overlaps(a: TimeRange, b: TimeRange): boolean {
  return a.startsAt < b.endsAt && b.startsAt < a.endsAt;
}

function isAfterNow(candidate: TimeRange, now: Date): boolean {
  // Slot must start at least 1 minute in the future so we never show
  // a "slot" that is already underway.
  return candidate.startsAt.getTime() > now.getTime() + 60_000;
}

/**
 * Generate bookable slots for a service given the owner's availability.
 *
 * Returns slots in ascending chronological order. A slot is valid only when:
 *   1. Its full range (start → end including buffer) fits inside one window.
 *   2. It does not overlap any block.
 *   3. It does not overlap any existing active booking.
 *   4. Its start is in the future (with 1-min grace).
 */
export function generateSlots({
  service,
  windows,
  blocks,
  existingBookings,
  now = new Date(),
  limit = 20,
}: GenerateSlotsParams): GenerateSlotsResult {
  const totalMs =
    (service.durationMinutes + service.cleanupBufferMinutes) * 60 * 1000;

  const slots: SlotCandidate[] = [];

  const sortedWindows = [...windows].sort(
    (a, b) => a.startsAt.getTime() - b.startsAt.getTime(),
  );

  outer: for (const window of sortedWindows) {
    // Skip windows entirely in the past.
    if (window.endsAt.getTime() <= now.getTime()) continue;

    // Start candidate at the window start, but snap to a 30-min boundary
    // relative to midnight UTC to keep slot times round.
    let cursor = snapToIncrement(
      new Date(Math.max(window.startsAt.getTime(), now.getTime())),
    );

    while (cursor.getTime() + totalMs <= window.endsAt.getTime()) {
      const candidate: SlotCandidate = {
        startsAt: cursor,
        endsAt: new Date(cursor.getTime() + totalMs),
      };

      if (
        isAfterNow(candidate, now) &&
        !blocks.some((b) => overlaps(candidate, b)) &&
        !existingBookings.some((bk) => overlaps(candidate, bk))
      ) {
        slots.push(candidate);
        if (slots.length > limit) {
          // We have one extra — mark hasMore and return.
          return { slots: slots.slice(0, limit), hasMore: true };
        }
      }

      cursor = new Date(cursor.getTime() + SLOT_INCREMENT_MS);
    }
  }

  return { slots, hasMore: false };
}

function snapToIncrement(date: Date): Date {
  const ms = date.getTime();
  const snapped = Math.ceil(ms / SLOT_INCREMENT_MS) * SLOT_INCREMENT_MS;
  return new Date(snapped);
}

/**
 * Quick check: is a specific (startsAt, endsAt) slot still available?
 * Used server-side immediately before booking INSERT to catch races that
 * slipped through the exclusion constraint attempt.
 *
 * This is NOT a substitute for the DB exclusion constraint — both must exist.
 * The constraint catches concurrent DB-level races; this check returns a
 * meaningful error message before the constraint fires.
 */
export function isSlotAvailable({
  candidate,
  windows,
  blocks,
  existingBookings,
  now = new Date(),
}: {
  candidate: TimeRange;
  windows: TimeRange[];
  blocks: TimeRange[];
  existingBookings: TimeRange[];
  now?: Date;
}): { available: boolean; reason?: string } {
  if (!isAfterNow(candidate, now)) {
    return { available: false, reason: "slot_in_past" };
  }

  const fitsInWindow = windows.some(
    (w) =>
      w.startsAt.getTime() <= candidate.startsAt.getTime() &&
      w.endsAt.getTime() >= candidate.endsAt.getTime(),
  );
  if (!fitsInWindow) {
    return { available: false, reason: "outside_window" };
  }

  if (blocks.some((b) => overlaps(candidate, b))) {
    return { available: false, reason: "blocked" };
  }

  if (existingBookings.some((bk) => overlaps(candidate, bk))) {
    return { available: false, reason: "already_booked" };
  }

  return { available: true };
}
