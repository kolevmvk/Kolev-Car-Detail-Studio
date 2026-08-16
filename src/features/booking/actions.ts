"use server";

import { headers } from "next/headers";
import { createServerSupabaseClient } from "@/lib/db/server";
import { generateSlots, isSlotAvailable } from "@/features/availability/engine";
import {
  GetSlotsInput,
  CreateBookingInput,
  JoinWaitlistInput,
  type GetSlotsResult,
  type BookingResult,
  type ServicePublic,
  checkRateLimit,
} from "./schema";

// ─── getServices ────────────────────────────────────────────────────────────

export async function getServices(): Promise<ServicePublic[]> {
  const db = await createServerSupabaseClient();
  const { data, error } = await db
    .from("services")
    .select("id, slug, name, short_description, booking_mode, duration_minutes, price_mode, price_amount_minor, currency")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error("Greška pri učitavanju usluga.");

  return (data ?? []).map((s) => ({
    id: s.id,
    slug: s.slug,
    name: s.name,
    shortDescription: s.short_description,
    bookingMode: s.booking_mode,
    durationMinutes: s.duration_minutes,
    priceMode: s.price_mode,
    priceAmountMinor: s.price_amount_minor,
    currency: s.currency,
  }));
}

// ─── getAvailableSlots ──────────────────────────────────────────────────────

export async function getAvailableSlots(
  rawInput: unknown,
): Promise<GetSlotsResult> {
  const input = GetSlotsInput.parse(rawInput);
  const db = await createServerSupabaseClient();

  // Fetch service to get duration/buffer — never trust client-supplied values.
  const { data: service, error: svcErr } = await db
    .from("services")
    .select("duration_minutes, cleanup_buffer_minutes, booking_mode, active")
    .eq("id", input.serviceId)
    .single();

  if (svcErr || !service || !service.active) {
    return { slots: [], hasMore: false };
  }

  if (service.booking_mode === "unavailable") {
    return { slots: [], hasMore: false };
  }

  const now = new Date();
  const lookAheadMs = 30 * 24 * 60 * 60 * 1000; // 30 days

  const afterDate = input.after ? new Date(input.after) : now;
  const beforeDate = new Date(now.getTime() + lookAheadMs);

  // Fetch availability windows (enabled, overlapping look-ahead range).
  const { data: windowRows } = await db
    .from("availability_windows")
    .select("starts_at, ends_at")
    .eq("enabled", true)
    .gte("ends_at", afterDate.toISOString())
    .lte("starts_at", beforeDate.toISOString());

  if (!windowRows || windowRows.length === 0) {
    return { slots: [], hasMore: false };
  }

  // Fetch availability blocks overlapping the look-ahead range.
  const { data: blockRows } = await db
    .from("availability_blocks")
    .select("starts_at, ends_at")
    .gte("ends_at", afterDate.toISOString())
    .lte("starts_at", beforeDate.toISOString());

  // Fetch active bookings overlapping the look-ahead range.
  const { data: bookingRows } = await db
    .from("bookings")
    .select("starts_at, ends_at")
    .in("status", ["pending", "confirmed"])
    .not("starts_at", "is", null)
    .gte("ends_at", afterDate.toISOString())
    .lte("starts_at", beforeDate.toISOString());

  const windows = (windowRows ?? []).map((w) => ({
    startsAt: new Date(w.starts_at),
    endsAt: new Date(w.ends_at),
  }));

  const blocks = (blockRows ?? []).map((b) => ({
    startsAt: new Date(b.starts_at),
    endsAt: new Date(b.ends_at),
  }));

  const existingBookings = (bookingRows ?? [])
    .filter((b) => b.starts_at && b.ends_at)
    .map((b) => ({
      startsAt: new Date(b.starts_at!),
      endsAt: new Date(b.ends_at!),
    }));

  const { slots, hasMore } = generateSlots({
    service: {
      durationMinutes: service.duration_minutes,
      cleanupBufferMinutes: service.cleanup_buffer_minutes,
    },
    windows,
    blocks,
    existingBookings,
    now: afterDate,
    limit: input.limit,
  });

  return {
    slots: slots.map((s) => ({
      startsAt: s.startsAt.toISOString(),
      endsAt: s.endsAt.toISOString(),
    })),
    hasMore,
  };
}

// ─── createBooking ──────────────────────────────────────────────────────────

export async function createBooking(
  rawInput: unknown,
): Promise<{ ok: true; booking: BookingResult } | { ok: false; error: string }> {
  // Rate limiting by IP.
  const headerStore = await headers();
  const ip =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return { ok: false, error: "Previše zahteva. Pokušajte za minut." };
  }

  // Validate input schema.
  const parsed = CreateBookingInput.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: "Neispravan unos. Proverite podatke." };
  }
  const input = parsed.data;

  const db = await createServerSupabaseClient();

  // Re-fetch service — never trust client-supplied duration/price.
  const { data: service, error: svcErr } = await db
    .from("services")
    .select("duration_minutes, cleanup_buffer_minutes, booking_mode, active")
    .eq("id", input.serviceId)
    .single();

  if (svcErr || !service || !service.active) {
    return { ok: false, error: "Usluga nije dostupna." };
  }

  if (service.booking_mode === "unavailable") {
    return { ok: false, error: "Ova usluga trenutno ne prima rezervacije." };
  }

  // Compute authoritative ends_at from server-side service record.
  const startsAt = new Date(input.startsAt);
  const totalMs =
    (service.duration_minutes + service.cleanup_buffer_minutes) * 60 * 1000;
  const endsAt = new Date(startsAt.getTime() + totalMs);

  // Validate slot is still available (pre-check before DB write).
  const now = new Date();
  const lookAheadMs = 30 * 24 * 60 * 60 * 1000;

  const { data: windowRows } = await db
    .from("availability_windows")
    .select("starts_at, ends_at")
    .eq("enabled", true)
    .gte("ends_at", now.toISOString())
    .lte("starts_at", new Date(now.getTime() + lookAheadMs).toISOString());

  const { data: blockRows } = await db
    .from("availability_blocks")
    .select("starts_at, ends_at")
    .gte("ends_at", now.toISOString())
    .lte("starts_at", new Date(now.getTime() + lookAheadMs).toISOString());

  const { data: bookingRows } = await db
    .from("bookings")
    .select("starts_at, ends_at")
    .in("status", ["pending", "confirmed"])
    .not("starts_at", "is", null);

  const windows = (windowRows ?? []).map((w) => ({
    startsAt: new Date(w.starts_at),
    endsAt: new Date(w.ends_at),
    enabled: true as const,
  }));

  const blocks = (blockRows ?? []).map((b) => ({
    startsAt: new Date(b.starts_at),
    endsAt: new Date(b.ends_at),
  }));

  const existingBookings = (bookingRows ?? [])
    .filter((b) => b.starts_at && b.ends_at)
    .map((b) => ({
      startsAt: new Date(b.starts_at!),
      endsAt: new Date(b.ends_at!),
    }));

  const availability = isSlotAvailable({
    candidate: { startsAt, endsAt },
    windows,
    blocks,
    existingBookings,
    now,
  });

  if (!availability.available) {
    return {
      ok: false,
      error:
        availability.reason === "already_booked"
          ? "Termin je upravo rezervisan. Izaberite drugi."
          : availability.reason === "slot_in_past"
            ? "Termin je u prošlosti."
            : "Termin više nije dostupan.",
    };
  }

  // Create customer, vehicle, and booking atomically using a Postgres function
  // or sequential inserts with server-generated IDs/references.
  // The DB exclusion constraint is the final guard against concurrent overlap.
  const customerId = crypto.randomUUID();
  const vehicleId = crypto.randomUUID();
  const publicReference = crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 10)
    .toUpperCase();

  const { error: custErr } = await db
    .from("customers")
    .insert({
      id: customerId,
      name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email || null,
      contact_preference: input.customer.contactPreference,
    });

  if (custErr) {
    return { ok: false, error: "Greška pri čuvanju podataka. Pokušajte ponovo." };
  }

  const { error: vehErr } = await db
    .from("vehicles")
    .insert({
      id: vehicleId,
      customer_id: customerId,
      make: input.vehicle.make,
      model: input.vehicle.model,
      year: input.vehicle.year ?? null,
      color: input.vehicle.color ?? null,
    });

  if (vehErr) {
    return { ok: false, error: "Greška pri čuvanju podataka vozila." };
  }

  const { error: bkErr } = await db
    .from("bookings")
    .insert({
      public_reference: publicReference,
      customer_id: customerId,
      vehicle_id: vehicleId,
      service_id: input.serviceId,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "pending",
      source: "website",
      customer_note: input.customerNote ?? null,
    });

  if (bkErr) {
    // The exclusion constraint violation surfaces here.
    if (bkErr?.code === "23P01") {
      return {
        ok: false,
        error: "Termin je upravo rezervisan. Izaberite drugi.",
      };
    }
    return { ok: false, error: "Greška pri kreiranju rezervacije." };
  }

  return {
    ok: true,
    booking: {
      publicReference,
      status: "pending",
      startsAt: startsAt.toISOString(),
      serviceId: input.serviceId,
    },
  };
}

// ─── joinWaitlist ────────────────────────────────────────────────────────────

export async function joinWaitlist(
  rawInput: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = JoinWaitlistInput.safeParse(rawInput);
  if (!parsed.success) {
    return { ok: false, error: "Neispravan unos." };
  }
  const input = parsed.data;

  const db = await createServerSupabaseClient();

  const { error } = await db.from("waitlist_entries").insert({
    service_id: input.serviceId,
    name: input.name,
    phone: input.phone,
    note: input.note ?? null,
  });

  if (error) {
    return { ok: false, error: "Greška pri prijavi. Pokušajte ponovo." };
  }

  return { ok: true };
}
