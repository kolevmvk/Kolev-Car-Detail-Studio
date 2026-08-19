"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/studio";

const ServiceInput = z
  .object({
    id: z.string().uuid().optional(),
    name: z.string().trim().min(2).max(80),
    shortDescription: z.string().trim().max(220).optional(),
    bookingMode: z.enum(["instant", "request", "unavailable"]),
    durationMinutes: z.number().int().min(30).max(1440),
    cleanupBufferMinutes: z.number().int().min(0).max(480),
    priceMode: z.enum(["fixed", "from", "quote"]),
    priceAmountRsd: z.number().int().min(0).max(10_000_000).optional(),
    active: z.boolean(),
    sortOrder: z.number().int().min(0).max(10_000),
  })
  .superRefine((value, context) => {
    if (value.priceMode !== "quote" && !value.priceAmountRsd) {
      context.addIssue({
        code: "custom",
        path: ["priceAmountRsd"],
        message: "Unesite cenu veću od nule.",
      });
    }
  });

const PromotionInput = z
  .object({
    id: z.string().uuid().optional(),
    internalName: z.string().trim().min(2).max(80),
    template: z.enum(["spotlight", "signal", "service_focus"]),
    eyebrow: z.string().trim().min(2).max(60),
    headline: z.string().trim().min(2).max(120),
    body: z.string().trim().max(240).optional(),
    ctaLabel: z.string().trim().min(2).max(48),
    ctaHref: z
      .string()
      .trim()
      .min(1)
      .max(200)
      .refine(
        (value) => value.startsWith("/") && !value.startsWith("//"),
        "Dozvoljen je samo interni link koji počinje sa /.",
      ),
    serviceId: z.string().uuid().nullable().optional(),
    enabled: z.boolean(),
    startsAt: z.string().datetime().nullable().optional(),
    endsAt: z.string().datetime().nullable().optional(),
    sortOrder: z.number().int().min(0).max(10_000),
  })
  .superRefine((value, context) => {
    if (
      value.startsAt &&
      value.endsAt &&
      new Date(value.endsAt) <= new Date(value.startsAt)
    ) {
      context.addIssue({
        code: "custom",
        path: ["endsAt"],
        message: "Kraj akcije mora biti posle početka.",
      });
    }
  });

type ActionResult = { ok: true } | { ok: false; error: string };

async function requireContentAdmin() {
  const context = await requireAdmin();
  if (!["owner", "admin"].includes(context.studioUser.role)) {
    throw new Error("Nemate dozvolu za uređivanje sadržaja.");
  }
  return context;
}

function serviceSlug(name: string) {
  return name
    .toLocaleLowerCase("sr-Latn")
    .replaceAll("đ", "dj")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveService(rawInput: unknown): Promise<ActionResult> {
  const parsed = ServiceInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Proverite podatke o usluzi.",
    };
  }

  const { db } = await requireContentAdmin();
  const input = parsed.data;
  const values = {
    name: input.name,
    short_description: input.shortDescription || null,
    booking_mode: input.bookingMode,
    duration_minutes: input.durationMinutes,
    cleanup_buffer_minutes: input.cleanupBufferMinutes,
    price_mode: input.priceMode,
    price_amount_minor:
      input.priceMode === "quote" ? null : (input.priceAmountRsd ?? 0) * 100,
    active: input.active,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };
  const query = input.id
    ? db.from("services").update(values).eq("id", input.id)
    : db.from("services").insert({
        ...values,
        slug: serviceSlug(input.name) || `usluga-${crypto.randomUUID().slice(0, 8)}`,
        currency: "RSD",
      });
  const { error } = await query;

  if (error) {
    return {
      ok: false,
      error:
        error.code === "23505"
          ? "Usluga sa ovim nazivom već postoji."
          : "Usluga nije sačuvana.",
    };
  }

  revalidatePath("/booking");
  revalidatePath("/studio/services");
  revalidatePath("/");
  return { ok: true };
}

export async function savePromotion(rawInput: unknown): Promise<ActionResult> {
  const parsed = PromotionInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Proverite podatke o akciji.",
    };
  }

  const { db, user } = await requireContentAdmin();
  const input = parsed.data;
  const values = {
    internal_name: input.internalName,
    placement: "homepage_story_end",
    template: input.template,
    eyebrow: input.eyebrow,
    headline: input.headline,
    body: input.body || null,
    cta_label: input.ctaLabel,
    cta_href: input.ctaHref,
    service_id: input.serviceId || null,
    enabled: input.enabled,
    starts_at: input.startsAt || null,
    ends_at: input.endsAt || null,
    sort_order: input.sortOrder,
    updated_at: new Date().toISOString(),
  };

  const query = input.id
    ? db.from("promotions").update(values).eq("id", input.id)
    : db.from("promotions").insert({ ...values, created_by: user.id });

  const { error } = await query;
  if (error) return { ok: false, error: "Akcija nije sačuvana." };

  revalidatePath("/");
  revalidatePath("/studio/promotions");
  return { ok: true };
}

export async function deletePromotion(rawInput: unknown): Promise<ActionResult> {
  const parsed = z.object({ id: z.string().uuid() }).safeParse(rawInput);
  if (!parsed.success) return { ok: false, error: "Neispravan ID akcije." };

  const { db } = await requireContentAdmin();
  const { error } = await db.from("promotions").delete().eq("id", parsed.data.id);
  if (error) return { ok: false, error: "Akcija nije obrisana." };

  revalidatePath("/");
  revalidatePath("/studio/promotions");
  return { ok: true };
}

const optionalPublicLink = z
  .string()
  .trim()
  .max(240)
  .optional()
  .transform((value) => value || "")
  .refine(
    (value) => value === "" || /^(https?:\/\/|viber:\/\/)/i.test(value),
    "Unesite pun link (https:// ili viber://).",
  );

const optionalPublicPhone = z
  .string()
  .trim()
  .max(30)
  .optional()
  .transform((value) => value || "")
  .refine(
    (value) => value === "" || /^[\d\s+\-()]{6,30}$/.test(value),
    "Unesite običan broj telefona, bez slova.",
  );

const StudioLinksInput = z.object({
  phone: optionalPublicPhone,
  instagramUrl: optionalPublicLink,
  facebookUrl: optionalPublicLink,
  tiktokUrl: optionalPublicLink,
  whatsappUrl: optionalPublicLink,
  viberUrl: optionalPublicLink,
  telegramUrl: optionalPublicLink,
});

export async function saveStudioPublicLinks(
  rawInput: unknown,
): Promise<ActionResult> {
  const parsed = StudioLinksInput.safeParse(rawInput);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Proverite linkove.",
    };
  }

  const { db, user } = await requireContentAdmin();
  const input = parsed.data;
  const { error } = await db
    .from("studio_public_profile")
    .update({
      phone: input.phone || null,
      instagram_url: input.instagramUrl || null,
      facebook_url: input.facebookUrl || null,
      tiktok_url: input.tiktokUrl || null,
      whatsapp_url: input.whatsappUrl || null,
      viber_url: input.viberUrl || null,
      telegram_url: input.telegramUrl || null,
      updated_at: new Date().toISOString(),
      updated_by: user.id,
    })
    .eq("id", true);

  if (error) return { ok: false, error: "Linkovi nisu sačuvani." };

  revalidatePath("/");
  revalidatePath("/booking");
  revalidatePath("/studio/links");
  return { ok: true };
}
