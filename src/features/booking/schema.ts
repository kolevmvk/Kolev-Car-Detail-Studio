import { z } from "zod";

// ─── Input schemas (validated server-side) ─────────────────────────────────

export const GetSlotsInput = z.object({
  serviceId: z.string().uuid(),
  limit: z.number().int().min(1).max(50).default(8),
  /** ISO timestamp cursor — return slots after this time */
  after: z.string().datetime().optional(),
});
export type GetSlotsInput = z.infer<typeof GetSlotsInput>;

export const CreateBookingInput = z.object({
  serviceId: z.string().uuid(),
  /** ISO timestamp for slot start — must match an available slot exactly */
  startsAt: z.string().datetime(),
  customer: z.object({
    name: z.string().min(2).max(120).trim(),
    phone: z
      .string()
      .min(6)
      .max(30)
      .trim()
      .regex(/^[\d\s\+\-\(\)]+$/, "Neispravan format telefona"),
    email: z.string().email().max(254).optional().or(z.literal("")),
    contactPreference: z.enum(["phone", "email", "whatsapp"]).default("phone"),
  }),
  vehicle: z.object({
    make: z.string().min(1).max(80).trim(),
    model: z.string().min(1).max(80).trim(),
    year: z.number().int().min(1950).max(2030).optional(),
    color: z.string().max(40).trim().optional(),
  }),
  customerNote: z.string().max(1000).trim().optional(),
});
export type CreateBookingInput = z.infer<typeof CreateBookingInput>;

export const JoinWaitlistInput = z.object({
  serviceId: z.string().uuid(),
  name: z.string().min(2).max(120).trim(),
  phone: z
    .string()
    .min(6)
    .max(30)
    .trim()
    .regex(/^[\d\s\+\-\(\)]+$/, "Neispravan format telefona"),
  note: z.string().max(500).trim().optional(),
});
export type JoinWaitlistInput = z.infer<typeof JoinWaitlistInput>;

// ─── Output types ──────────────────────────────────────────────────────────

export interface ServicePublic {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  bookingMode: string;
  durationMinutes: number;
  priceMode: string;
  priceAmountMinor: number | null;
  currency: string;
}

export interface SlotPublic {
  startsAt: string; // ISO UTC
  endsAt: string;   // ISO UTC (includes buffer)
}

export interface GetSlotsResult {
  slots: SlotPublic[];
  hasMore: boolean;
}

export interface BookingResult {
  publicReference: string;
  status: string;
  startsAt: string | null;
  serviceId: string;
}

// ─── Rate limiting state (in-memory; replace with Redis in production) ──────

const requestCounts = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT = 5; // max 5 booking submissions per IP per minute

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = requestCounts.get(ip);

  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    requestCounts.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}
