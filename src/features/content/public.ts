import "server-only";

import type {
  PromotionTemplate,
  PublicPromotion,
} from "@/components/public/PromotionBanner";
import type { PublicStudioContact } from "@/features/content/social";
import { EMPTY_STUDIO_CONTACT } from "@/features/content/social";
import { createServerSupabaseClient } from "@/lib/db/server";

const promotionTemplates = new Set<PromotionTemplate>([
  "spotlight",
  "signal",
  "service_focus",
]);

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export async function getLivePromotion(): Promise<PublicPromotion | null> {
  const db = await createServerSupabaseClient();
  const now = new Date().toISOString();
  const { data, error } = await db
    .from("promotions")
    .select(
      "id, template, eyebrow, headline, body, cta_label, cta_href, services(name, price_mode, price_amount_minor, currency)",
    )
    .eq("placement", "homepage_story_end")
    .eq("enabled", true)
    .or(`starts_at.is.null,starts_at.lte.${now}`)
    .or(`ends_at.is.null,ends_at.gt.${now}`)
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data || !promotionTemplates.has(data.template as PromotionTemplate)) {
    return null;
  }

  const service = firstRelation<{
    name: string;
    price_mode: "fixed" | "from" | "quote";
    price_amount_minor: number | null;
    currency: string;
  }>(data.services);

  return {
    id: data.id,
    template: data.template as PromotionTemplate,
    eyebrow: data.eyebrow,
    headline: data.headline,
    body: data.body,
    ctaLabel: data.cta_label,
    ctaHref: data.cta_href,
    service: service
      ? {
          name: service.name,
          priceMode: service.price_mode,
          priceAmountMinor: service.price_amount_minor,
          currency: service.currency,
        }
      : null,
  };
}

export async function getStudioPublicLinks(): Promise<PublicStudioContact> {
  const db = await createServerSupabaseClient();
  const { data, error } = await db
    .from("studio_public_profile")
    .select(
      "phone, instagram_url, facebook_url, tiktok_url, whatsapp_url, viber_url, telegram_url",
    )
    .eq("id", true)
    .maybeSingle();

  if (!error && data) {
    return {
      phone: data.phone,
      instagram: data.instagram_url,
      facebook: data.facebook_url,
      tiktok: data.tiktok_url,
      whatsapp: data.whatsapp_url,
      viber: data.viber_url,
      telegram: data.telegram_url,
    };
  }

  const fallback = await db
    .from("studio_public_profile")
    .select(
      "instagram_url, facebook_url, tiktok_url, whatsapp_url, viber_url, telegram_url",
    )
    .eq("id", true)
    .maybeSingle();

  if (fallback.error || !fallback.data) return EMPTY_STUDIO_CONTACT;

  return {
    phone: null,
    instagram: fallback.data.instagram_url,
    facebook: fallback.data.facebook_url,
    tiktok: fallback.data.tiktok_url,
    whatsapp: fallback.data.whatsapp_url,
    viber: fallback.data.viber_url,
    telegram: fallback.data.telegram_url,
  };
}
