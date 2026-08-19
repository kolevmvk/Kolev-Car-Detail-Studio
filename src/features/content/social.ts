export type PublicSocialLinks = {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
  whatsapp: string | null;
  viber: string | null;
  telegram: string | null;
};

export type PublicStudioContact = PublicSocialLinks & {
  phone: string | null;
};

export const EMPTY_SOCIAL_LINKS: PublicSocialLinks = {
  instagram: null,
  facebook: null,
  tiktok: null,
  whatsapp: null,
  viber: null,
  telegram: null,
};

export const EMPTY_STUDIO_CONTACT: PublicStudioContact = {
  ...EMPTY_SOCIAL_LINKS,
  phone: null,
};

const PHONE_CHARS = /^[\d\s+\-()]+$/;

export function isPublicPhone(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length >= 6 && trimmed.length <= 30 && PHONE_CHARS.test(trimmed);
}

/** `tel:` href from an owner-entered number. Empty input stays empty. */
export function toTelHref(phone: string): string {
  const trimmed = phone.trim();
  if (!isPublicPhone(trimmed)) return "";
  return `tel:${trimmed.replace(/[^\d+]/g, "")}`;
}
