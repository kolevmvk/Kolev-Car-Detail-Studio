import Link from "next/link";
import type { Route } from "next";

export type PromotionTemplate = "spotlight" | "signal" | "service_focus";

export type PublicPromotion = {
  id: string;
  template: PromotionTemplate;
  eyebrow: string;
  headline: string;
  body: string | null;
  ctaLabel: string;
  ctaHref: string;
  service: {
    name: string;
    priceMode: "fixed" | "from" | "quote";
    priceAmountMinor: number | null;
    currency: string;
  } | null;
};

function formatPrice(service: NonNullable<PublicPromotion["service"]>) {
  if (service.priceMode === "quote") return "Cena po dogovoru";
  if (!service.priceAmountMinor) return null;
  const amount = Math.round(service.priceAmountMinor / 100);
  const prefix = service.priceMode === "from" ? "od " : "";
  return `${prefix}${amount.toLocaleString("sr-RS")} ${service.currency}`;
}

export function PromotionBanner({
  promotion,
  preview = false,
}: {
  promotion: PublicPromotion;
  preview?: boolean;
}) {
  const price = promotion.service ? formatPrice(promotion.service) : null;
  const headingId = `promotion-${promotion.id}`;

  return (
    <section
      className={`promotion promotion--${promotion.template}`}
      aria-labelledby={headingId}
      data-preview={preview}
    >
      <div className="promotion__signal" aria-hidden="true" />
      <div className="promotion__content">
        <p className="promotion__eyebrow">{promotion.eyebrow}</p>
        <h2 className="promotion__headline" id={headingId}>
          {promotion.headline}
        </h2>
        {promotion.body && <p className="promotion__body">{promotion.body}</p>}
      </div>
      <div className="promotion__action">
        {promotion.service && (
          <p className="promotion__service">
            <span>{promotion.service.name}</span>
            {price && <strong>{price}</strong>}
          </p>
        )}
        <Link className="promotion__cta" href={promotion.ctaHref as Route}>
          {promotion.ctaLabel}
          <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </section>
  );
}
