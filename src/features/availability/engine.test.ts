import { describe, it, expect } from "vitest";
import { generateSlots, isSlotAvailable } from "./engine";

// All times in UTC. Europe/Belgrade is UTC+1 (winter) / UTC+2 (summer).
// Tests use UTC directly — display conversion is handled by the UI layer.

const SERVICE_120 = { durationMinutes: 120, cleanupBufferMinutes: 30 }; // 2h + 30min buffer = 2.5h total
const SERVICE_60 = { durationMinutes: 60, cleanupBufferMinutes: 0 };   // 1h, no buffer

function date(iso: string): Date {
  return new Date(iso);
}

function range(start: string, end: string) {
  return { startsAt: date(start), endsAt: date(end) };
}

// Saturday 08:00–15:00 UTC (simulates 09:00–16:00 Belgrade summer, or 09:00–16:00 winter)
const WINDOW_SAT = range("2026-09-05T08:00:00Z", "2026-09-05T15:00:00Z");

// "Now" is Friday 18:00 UTC — all slots in the Saturday window are future.
const NOW_FRI = date("2026-09-04T18:00:00Z");

describe("generateSlots", () => {
  it("returns slots that fit inside the window", () => {
    const { slots } = generateSlots({
      service: SERVICE_120,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });

    // SERVICE_120 totals 150 min (2h30m). Window is 7h.
    // First candidate at 08:00, last that fits: 12:30 (12:30 + 2:30 = 15:00).
    // Slots at 08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30 = 10
    expect(slots.length).toBe(10);
    expect(slots[0].startsAt.toISOString()).toBe("2026-09-05T08:00:00.000Z");
    expect(slots[0].endsAt.toISOString()).toBe("2026-09-05T10:30:00.000Z");
  });

  it("slot does not fit near the window end — last slot excluded", () => {
    // Window: 08:00–10:00 (2h). Service total: 150min (2h30m). No slots fit.
    const narrow = range("2026-09-05T08:00:00Z", "2026-09-05T10:00:00Z");
    const { slots } = generateSlots({
      service: SERVICE_120,
      windows: [narrow],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(slots.length).toBe(0);
  });

  it("block removes slot", () => {
    // Block 08:00–09:00 removes the 08:00 and 08:30 start slots
    // (both overlap the block because candidate.startsAt < block.endsAt).
    const block = range("2026-09-05T08:00:00Z", "2026-09-05T09:00:00Z");
    const { slots } = generateSlots({
      service: SERVICE_60,
      windows: [WINDOW_SAT],
      blocks: [block],
      existingBookings: [],
      now: NOW_FRI,
    });
    // SERVICE_60: 60min total. Window 7h → 13 slots total without block.
    // Block covers 08:00–09:00. Slots starting 08:00 and 08:30 overlap it.
    // Remaining: 09:00, 09:30, 10:00, 10:30, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00 = 11
    expect(slots.length).toBe(11);
    expect(slots[0].startsAt.toISOString()).toBe("2026-09-05T09:00:00.000Z");
  });

  it("existing booking removes overlapping slots", () => {
    // Booking 09:00–11:00 blocks all slots overlapping that range.
    const booking = range("2026-09-05T09:00:00Z", "2026-09-05T11:00:00Z");
    const { slots } = generateSlots({
      service: SERVICE_60,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [booking],
      now: NOW_FRI,
    });
    // Without booking: 13 slots (08:00–14:00 in 30-min steps).
    // Slots overlapping 09:00–11:00: any slot where startsAt < 11:00 AND endsAt > 09:00.
    // SERVICE_60 end = start + 60min. Overlapping starts: 08:00 (end 09:00 NOT > 09:00 → no overlap),
    // 08:30 (end 09:30 > 09:00 AND start 08:30 < 11:00 → overlap),
    // 09:00, 09:30, 10:00, 10:30 (all overlap).
    // Non-overlapping: 08:00, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00 = 8 slots
    // Wait, let me recalculate. overlaps = a.startsAt < b.endsAt && b.startsAt < a.endsAt
    // booking: 09:00–11:00
    // 08:00 slot: startsAt=08:00, endsAt=09:00. 08:00 < 11:00=true, 09:00 < 09:00=false → no overlap ✓
    // 08:30 slot: startsAt=08:30, endsAt=09:30. 08:30 < 11:00=true, 09:00 < 09:30=true → overlap ✗
    // 09:00 slot: overlap ✗
    // 09:30 slot: overlap ✗
    // 10:00 slot: overlap ✗
    // 10:30 slot: overlap ✗
    // 11:00 slot: startsAt=11:00, endsAt=12:00. 11:00 < 11:00=false → no overlap ✓
    // Remaining: 08:00, 11:00, 11:30, 12:00, 12:30, 13:00, 13:30, 14:00 = 8
    expect(slots.length).toBe(8);
    // First available after booking ends
    const starts = slots.map((s) => s.startsAt.toISOString());
    expect(starts).toContain("2026-09-05T08:00:00.000Z");
    expect(starts).toContain("2026-09-05T11:00:00.000Z");
    expect(starts).not.toContain("2026-09-05T08:30:00.000Z");
    expect(starts).not.toContain("2026-09-05T10:30:00.000Z");
  });

  it("cancelled booking does not block time (only active bookings passed in)", () => {
    // The caller is responsible for filtering: only active (pending/confirmed)
    // bookings are passed as existingBookings. Cancelled ones are omitted.
    // This test verifies that if we pass zero bookings, all slots are available.
    const { slots } = generateSlots({
      service: SERVICE_60,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [], // cancelled booking not included
      now: NOW_FRI,
    });
    expect(slots.length).toBe(13); // 08:00–14:00 in 30-min steps = 13 slots
  });

  it("past slots are excluded", () => {
    // "Now" is Saturday 10:00 — slots before 10:01 are excluded.
    const now = date("2026-09-05T10:00:00Z");
    const { slots } = generateSlots({
      service: SERVICE_60,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [],
      now,
    });
    // Slots must start after now + 60s = 10:01. First valid slot: 10:00 is snapped to 10:00
    // but isAfterNow requires startsAt > now + 60000ms = 10:01:00. So 10:00 fails.
    // Next: 10:30 → 10:30 > 10:01 ✓
    expect(slots.every((s) => s.startsAt > now)).toBe(true);
    expect(slots[0].startsAt.toISOString()).toBe("2026-09-05T10:30:00.000Z");
  });

  it("service duration affects number of candidate slots", () => {
    // 3h service in a 4h window: only slots at :00 and :30 fit.
    // 08:00+3h=11:00 ≤ 12:00 ✓, 08:30+3h=11:30 ≤ 12:00 ✓, 09:00+3h=12:00 ≤ 12:00 ✓
    // 09:30+3h=12:30 > 12:00 ✗
    const short_window = range("2026-09-05T08:00:00Z", "2026-09-05T12:00:00Z");
    const big_service = { durationMinutes: 180, cleanupBufferMinutes: 0 };
    const { slots } = generateSlots({
      service: big_service,
      windows: [short_window],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(slots.length).toBe(3);
  });

  it("respects limit and sets hasMore", () => {
    const { slots, hasMore } = generateSlots({
      service: SERVICE_60,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
      limit: 4,
    });
    expect(slots.length).toBe(4);
    expect(hasMore).toBe(true);
  });

  it("returns empty with no windows", () => {
    const { slots, hasMore } = generateSlots({
      service: SERVICE_60,
      windows: [],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(slots.length).toBe(0);
    expect(hasMore).toBe(false);
  });
});

describe("isSlotAvailable", () => {
  const futureCandidate = range("2026-09-05T09:00:00Z", "2026-09-05T11:00:00Z");

  it("returns available for a clean slot inside a window", () => {
    const result = isSlotAvailable({
      candidate: futureCandidate,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(result.available).toBe(true);
  });

  it("rejects a slot in the past", () => {
    const past = range("2026-09-04T06:00:00Z", "2026-09-04T08:00:00Z");
    const result = isSlotAvailable({
      candidate: past,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(result.available).toBe(false);
    expect(result.reason).toBe("slot_in_past");
  });

  it("rejects a slot outside any window", () => {
    const result = isSlotAvailable({
      candidate: futureCandidate,
      windows: [], // no windows
      blocks: [],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(result.available).toBe(false);
    expect(result.reason).toBe("outside_window");
  });

  it("rejects a slot overlapping a block", () => {
    const block = range("2026-09-05T08:00:00Z", "2026-09-05T10:00:00Z");
    const result = isSlotAvailable({
      candidate: futureCandidate, // 09:00–11:00 overlaps block 08:00–10:00
      windows: [WINDOW_SAT],
      blocks: [block],
      existingBookings: [],
      now: NOW_FRI,
    });
    expect(result.available).toBe(false);
    expect(result.reason).toBe("blocked");
  });

  it("rejects a slot overlapping an existing booking", () => {
    const existing = range("2026-09-05T10:00:00Z", "2026-09-05T12:00:00Z");
    const result = isSlotAvailable({
      candidate: futureCandidate, // 09:00–11:00 overlaps existing 10:00–12:00
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [existing],
      now: NOW_FRI,
    });
    expect(result.available).toBe(false);
    expect(result.reason).toBe("already_booked");
  });

  it("server rejects stale slot: slot was available when shown but booked concurrently", () => {
    // Simulates: slot was shown to visitor, another visitor booked it.
    // Now this visitor tries to confirm the same slot.
    const concurrent = range("2026-09-05T09:00:00Z", "2026-09-05T11:00:00Z");
    const result = isSlotAvailable({
      candidate: futureCandidate,
      windows: [WINDOW_SAT],
      blocks: [],
      existingBookings: [concurrent],
      now: NOW_FRI,
    });
    expect(result.available).toBe(false);
    expect(result.reason).toBe("already_booked");
  });
});
