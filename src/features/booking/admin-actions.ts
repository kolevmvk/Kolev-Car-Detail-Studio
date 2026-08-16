"use server";

import { createServerSupabaseClient } from "@/lib/db/server";
import { redirect } from "next/navigation";
import { z } from "zod";

async function assertAdmin() {
  const sb = await createServerSupabaseClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/studio/login");

  const { data } = await sb
    .from("admin_profiles")
    .select("user_id, role, status")
    .eq("user_id", user.id)
    .single();

  if (!data || data.status !== "active" || !["owner", "admin"].includes(data.role)) {
    redirect("/studio/login");
  }
  return { user, db: sb };
}

// ─── Booking status actions ─────────────────────────────────────────────────

const UpdateBookingStatusInput = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(["confirmed", "declined", "cancelled"]),
});

export async function updateBookingStatus(
  rawInput: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = UpdateBookingStatusInput.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neispravan unos." };

  const { db } = await assertAdmin();
  const { bookingId, status } = parsed.data;

  const update: { status: typeof status; confirmed_at?: string } = { status };
  if (status === "confirmed") update.confirmed_at = new Date().toISOString();

  const { error } = await db
    .from("bookings")
    .update(update)
    .eq("id", bookingId);

  if (error) return { ok: false, error: "Greška pri ažuriranju." };
  return { ok: true };
}

// ─── Availability window actions ─────────────────────────────────────────────

const CreateWindowInput = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  note: z.string().max(500).optional(),
});

export async function createAvailabilityWindow(
  rawInput: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = CreateWindowInput.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neispravan unos." };

  const { db } = await assertAdmin();
  const { startsAt, endsAt, note } = parsed.data;

  if (new Date(endsAt) <= new Date(startsAt)) {
    return { ok: false, error: "Kraj mora biti posle početka." };
  }

  const diffMs = new Date(endsAt).getTime() - new Date(startsAt).getTime();
  if (diffMs < 30 * 60 * 1000) {
    return { ok: false, error: "Prozor mora biti najmanje 30 minuta." };
  }

  const { error } = await db.from("availability_windows").insert({
    starts_at: startsAt,
    ends_at: endsAt,
    note: note ?? null,
    source: "manual",
  });

  if (error) return { ok: false, error: "Greška pri čuvanju prozora." };
  return { ok: true };
}

const DeleteWindowInput = z.object({ windowId: z.string().uuid() });

export async function deleteAvailabilityWindow(
  rawInput: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = DeleteWindowInput.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neispravan ID." };

  const { db } = await assertAdmin();
  const { error } = await db
    .from("availability_windows")
    .delete()
    .eq("id", parsed.data.windowId);

  if (error) return { ok: false, error: "Greška pri brisanju." };
  return { ok: true };
}

// ─── Availability block actions ───────────────────────────────────────────────

const CreateBlockInput = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  reason: z.enum(["private", "closed", "maintenance", "other"]).default("private"),
  note: z.string().max(500).optional(),
});

export async function createAvailabilityBlock(
  rawInput: unknown,
): Promise<{ ok: boolean; error?: string }> {
  const parsed = CreateBlockInput.safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neispravan unos." };

  const { db } = await assertAdmin();
  const { startsAt, endsAt, reason, note } = parsed.data;

  if (new Date(endsAt) <= new Date(startsAt)) {
    return { ok: false, error: "Kraj mora biti posle početka." };
  }

  const { error } = await db.from("availability_blocks").insert({
    starts_at: startsAt,
    ends_at: endsAt,
    reason,
    note: note ?? null,
  });

  if (error) return { ok: false, error: "Greška pri čuvanju blokade." };
  return { ok: true };
}
