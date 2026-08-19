"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveService } from "@/features/content/admin-actions";

export type EditableService = {
  id?: string;
  slug: string;
  name: string;
  short_description: string | null;
  booking_mode: "instant" | "request" | "unavailable";
  duration_minutes: number;
  cleanup_buffer_minutes: number;
  price_mode: "fixed" | "from" | "quote";
  price_amount_minor: number | null;
  currency: string;
  active: boolean;
  sort_order: number;
};

export function ServiceEditor({
  service,
  isNew = false,
}: {
  service: EditableService;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [priceMode, setPriceMode] = useState(service.price_mode);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);

    const form = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await saveService({
        id: isNew ? undefined : service.id,
        name: String(form.get("name") ?? ""),
        shortDescription: String(form.get("shortDescription") ?? ""),
        bookingMode: String(form.get("bookingMode") ?? ""),
        durationMinutes: Number(form.get("durationMinutes")),
        cleanupBufferMinutes: Number(form.get("cleanupBufferMinutes")),
        priceMode: String(form.get("priceMode") ?? ""),
        priceAmountRsd:
          priceMode === "quote" ? undefined : Number(form.get("priceAmountRsd")),
        active: form.get("active") === "on",
        sortOrder: Number(form.get("sortOrder")),
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form className="studio-editor" onSubmit={handleSubmit}>
      <div className="studio-editor__heading">
        <div>
          <p className="studio-kicker">
            {isNew ? "Nova javna stavka" : `/${service.slug}`}
          </p>
          <h2 className="studio-editor__title">
            {isNew ? "Dodaj uslugu" : service.name}
          </h2>
        </div>
        <label className="studio-switch">
          <input name="active" type="checkbox" defaultChecked={service.active} />
          <span>Vidljiva usluga</span>
        </label>
      </div>

      {error && <p className="studio-form__error">{error}</p>}
      {saved && <p className="studio-form__success">Sačuvano i objavljeno.</p>}

      <div className="studio-form-grid">
        <label className="studio-field studio-field--wide">
          <span className="studio-label">Naziv usluge</span>
          <input
            className="studio-input"
            name="name"
            defaultValue={service.name}
            maxLength={80}
            required
          />
        </label>

        <label className="studio-field studio-field--wide">
          <span className="studio-label">Kratak opis</span>
          <textarea
            className="studio-input studio-textarea"
            name="shortDescription"
            defaultValue={service.short_description ?? ""}
            maxLength={220}
            rows={3}
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Cena</span>
          <select
            className="studio-input"
            name="priceMode"
            value={priceMode}
            onChange={(event) =>
              setPriceMode(event.target.value as EditableService["price_mode"])
            }
          >
            <option value="fixed">Fiksna cena</option>
            <option value="from">Cena od</option>
            <option value="quote">Po dogovoru</option>
          </select>
        </label>

        <label className="studio-field">
          <span className="studio-label">Iznos u RSD</span>
          <input
            className="studio-input"
            name="priceAmountRsd"
            type="number"
            inputMode="numeric"
            min={0}
            step={1}
            defaultValue={
              service.price_amount_minor
                ? Math.round(service.price_amount_minor / 100)
                : ""
            }
            disabled={priceMode === "quote"}
            required={priceMode !== "quote"}
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Način rezervacije</span>
          <select
            className="studio-input"
            name="bookingMode"
            defaultValue={service.booking_mode}
          >
            <option value="instant">Direktan termin</option>
            <option value="request">Zahtev za potvrdu</option>
            <option value="unavailable">Trenutno nedostupno</option>
          </select>
        </label>

        <label className="studio-field">
          <span className="studio-label">Trajanje u minutima</span>
          <input
            className="studio-input"
            name="durationMinutes"
            type="number"
            inputMode="numeric"
            min={30}
            max={1440}
            step={15}
            defaultValue={service.duration_minutes}
            required
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Pauza posle usluge</span>
          <input
            className="studio-input"
            name="cleanupBufferMinutes"
            type="number"
            inputMode="numeric"
            min={0}
            max={480}
            step={15}
            defaultValue={service.cleanup_buffer_minutes}
            required
          />
        </label>

        <label className="studio-field">
          <span className="studio-label">Redosled</span>
          <input
            className="studio-input"
            name="sortOrder"
            type="number"
            inputMode="numeric"
            min={0}
            max={10000}
            defaultValue={service.sort_order}
            required
          />
        </label>
      </div>

      <button className="studio-btn studio-editor__submit" type="submit" disabled={isPending}>
        {isPending
          ? "Čuvam…"
          : isNew
            ? "Dodaj i objavi uslugu"
            : "Sačuvaj uslugu"}
      </button>
    </form>
  );
}
