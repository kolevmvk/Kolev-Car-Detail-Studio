"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deletePromotion,
  savePromotion,
} from "@/features/content/admin-actions";
import {
  PromotionBanner,
  type PromotionTemplate,
  type PublicPromotion,
} from "@/components/public/PromotionBanner";

export type PromotionServiceOption = {
  id: string;
  name: string;
  price_mode: "fixed" | "from" | "quote";
  price_amount_minor: number | null;
  currency: string;
};

export type EditablePromotion = {
  id: string;
  internal_name: string;
  template: PromotionTemplate;
  eyebrow: string;
  headline: string;
  body: string | null;
  cta_label: string;
  cta_href: string;
  service_id: string | null;
  enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  sort_order: number;
};

const emptyPromotion: EditablePromotion = {
  id: "",
  internal_name: "Nova akcija",
  template: "spotlight",
  eyebrow: "Ograničena akcija",
  headline: "Površina ponovo hvata svetlo.",
  body: "Izaberite uslugu i proverite prvi stvarno slobodan termin.",
  cta_label: "Pogledaj termine",
  cta_href: "/booking",
  service_id: null,
  enabled: false,
  starts_at: null,
  ends_at: null,
  sort_order: 0,
};

function toLocalDateTime(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export function PromotionEditor({
  promotion: initialPromotion,
  services,
  isNew = false,
}: {
  promotion?: EditablePromotion;
  services: PromotionServiceOption[];
  isNew?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [promotion, setPromotion] = useState(initialPromotion ?? emptyPromotion);
  const [startsAt, setStartsAt] = useState(
    toLocalDateTime(initialPromotion?.starts_at ?? null),
  );
  const [endsAt, setEndsAt] = useState(
    toLocalDateTime(initialPromotion?.ends_at ?? null),
  );
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const preview = useMemo<PublicPromotion>(() => {
    const service = services.find((item) => item.id === promotion.service_id);
    return {
      id: promotion.id || "new",
      template: promotion.template,
      eyebrow: promotion.eyebrow || "Oznaka akcije",
      headline: promotion.headline || "Naslov akcije",
      body: promotion.body || null,
      ctaLabel: promotion.cta_label || "Pogledaj termine",
      ctaHref: promotion.cta_href || "/booking",
      service: service
        ? {
            name: service.name,
            priceMode: service.price_mode,
            priceAmountMinor: service.price_amount_minor,
            currency: service.currency,
          }
        : null,
    };
  }, [promotion, services]);

  function update<K extends keyof EditablePromotion>(
    key: K,
    value: EditablePromotion[K],
  ) {
    setSaved(false);
    setPromotion((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    startTransition(async () => {
      const result = await savePromotion({
        id: promotion.id || undefined,
        internalName: promotion.internal_name,
        template: promotion.template,
        eyebrow: promotion.eyebrow,
        headline: promotion.headline,
        body: promotion.body || undefined,
        ctaLabel: promotion.cta_label,
        ctaHref: promotion.cta_href,
        serviceId: promotion.service_id,
        enabled: promotion.enabled,
        startsAt: startsAt ? new Date(startsAt).toISOString() : null,
        endsAt: endsAt ? new Date(endsAt).toISOString() : null,
        sortOrder: promotion.sort_order,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (isNew) {
        setPromotion(emptyPromotion);
        setStartsAt("");
        setEndsAt("");
      }
      setSaved(true);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!promotion.id || !window.confirm("Obrisati ovu akciju?")) return;
    setError(null);
    startTransition(async () => {
      const result = await deletePromotion({ id: promotion.id });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <article className="studio-editor studio-promotion-editor">
      <div className="studio-editor__heading">
        <div>
          <p className="studio-kicker">{isNew ? "Novi segment" : "Promo segment"}</p>
          <h2 className="studio-editor__title">{promotion.internal_name}</h2>
        </div>
        <label className="studio-switch">
          <input
            type="checkbox"
            checked={promotion.enabled}
            onChange={(event) => update("enabled", event.target.checked)}
          />
          <span>Objavljena</span>
        </label>
      </div>

      <div className="studio-preview" aria-label="Pregled promo segmenta">
        <PromotionBanner promotion={preview} preview />
      </div>

      <form className="studio-form-grid" onSubmit={handleSubmit}>
        {error && <p className="studio-form__error studio-field--wide">{error}</p>}
        {saved && (
          <p className="studio-form__success studio-field--wide">
            {isNew ? "Akcija je kreirana." : "Izmene su objavljene."}
          </p>
        )}

        <label className="studio-field">
          <span className="studio-label">Interni naziv</span>
          <input
            className="studio-input"
            value={promotion.internal_name}
            onChange={(event) => update("internal_name", event.target.value)}
            maxLength={80}
            required
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Dizajn</span>
          <select
            className="studio-input"
            value={promotion.template}
            onChange={(event) =>
              update("template", event.target.value as PromotionTemplate)
            }
          >
            <option value="spotlight">Spotlight — veliki naslov</option>
            <option value="signal">Signal — kompaktna traka</option>
            <option value="service_focus">Service focus — usluga i cena</option>
          </select>
        </label>

        <label className="studio-field studio-field--wide">
          <span className="studio-label">Mala oznaka</span>
          <input
            className="studio-input"
            value={promotion.eyebrow}
            onChange={(event) => update("eyebrow", event.target.value)}
            maxLength={60}
            required
          />
        </label>

        <label className="studio-field studio-field--wide">
          <span className="studio-label">Naslov</span>
          <textarea
            className="studio-input studio-textarea"
            value={promotion.headline}
            onChange={(event) => update("headline", event.target.value)}
            maxLength={120}
            rows={2}
            required
          />
        </label>

        <label className="studio-field studio-field--wide">
          <span className="studio-label">Opis</span>
          <textarea
            className="studio-input studio-textarea"
            value={promotion.body ?? ""}
            onChange={(event) => update("body", event.target.value)}
            maxLength={240}
            rows={3}
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Povezana usluga</span>
          <select
            className="studio-input"
            value={promotion.service_id ?? ""}
            onChange={(event) =>
              update("service_id", event.target.value || null)
            }
          >
            <option value="">Bez prikaza cene</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
        </label>

        <label className="studio-field">
          <span className="studio-label">Redosled</span>
          <input
            className="studio-input"
            type="number"
            inputMode="numeric"
            min={0}
            max={10000}
            value={promotion.sort_order}
            onChange={(event) => update("sort_order", Number(event.target.value))}
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">CTA tekst</span>
          <input
            className="studio-input"
            value={promotion.cta_label}
            onChange={(event) => update("cta_label", event.target.value)}
            maxLength={48}
            required
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Interni link</span>
          <input
            className="studio-input"
            value={promotion.cta_href}
            onChange={(event) => update("cta_href", event.target.value)}
            maxLength={200}
            pattern="^/(?!/).*"
            placeholder="/booking"
            required
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Početak (opciono)</span>
          <input
            className="studio-input"
            type="datetime-local"
            value={startsAt}
            onChange={(event) => setStartsAt(event.target.value)}
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Kraj (opciono)</span>
          <input
            className="studio-input"
            type="datetime-local"
            value={endsAt}
            onChange={(event) => setEndsAt(event.target.value)}
          />
        </label>

        <div className="studio-editor__actions studio-field--wide">
          <button className="studio-btn" type="submit" disabled={isPending}>
            {isPending ? "Čuvam…" : isNew ? "Kreiraj akciju" : "Sačuvaj akciju"}
          </button>
          {!isNew && (
            <button
              className="studio-btn studio-btn--decline"
              type="button"
              onClick={handleDelete}
              disabled={isPending}
            >
              Obriši
            </button>
          )}
        </div>
      </form>
    </article>
  );
}
