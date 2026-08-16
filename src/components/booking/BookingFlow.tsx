"use client";

import { useState, useCallback, useTransition } from "react";
import Link from "next/link";
import type { ServicePublic, SlotPublic } from "@/features/booking/schema";
import { getAvailableSlots, createBooking, joinWaitlist } from "@/features/booking/actions";

type Step = "service" | "slot" | "details" | "confirm" | "success" | "waitlist";

interface BookingFlowProps {
  services: ServicePublic[];
}

function formatSlot(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("sr-RS", {
    timeZone: "Europe/Belgrade",
    weekday: "short",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(service: ServicePublic): string {
  if (service.priceMode === "quote") return "Cena po dogovoru";
  if (!service.priceAmountMinor) return "";
  const amount = Math.round(service.priceAmountMinor / 100);
  const prefix = service.priceMode === "from" ? "od " : "";
  return `${prefix}${amount.toLocaleString("sr-RS")} ${service.currency}`;
}

export function BookingFlow({ services }: BookingFlowProps) {
  const [step, setStep] = useState<Step>("service");
  const [selectedService, setSelectedService] = useState<ServicePublic | null>(null);
  const [slots, setSlots] = useState<SlotPublic[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [slotsAfter, setSlotsAfter] = useState<string | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<SlotPublic | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [publicRef, setPublicRef] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [note, setNote] = useState("");
  // Waitlist
  const [wlName, setWlName] = useState("");
  const [wlPhone, setWlPhone] = useState("");

  const loadSlots = useCallback(
    (service: ServicePublic, after?: string) => {
      setError(null);
      startTransition(async () => {
        try {
          const result = await getAvailableSlots({
            serviceId: service.id,
            limit: 6,
            after,
          });
          if (after) {
            setSlots((prev) => [...prev, ...result.slots]);
          } else {
            setSlots(result.slots);
          }
          setHasMore(result.hasMore);
          if (result.slots.length > 0) {
            setSlotsAfter(result.slots[result.slots.length - 1].startsAt);
          }
        } catch {
          setError("Greška pri učitavanju termina.");
        }
      });
    },
    [],
  );

  function handleSelectService(service: ServicePublic) {
    setSelectedService(service);
    setSlots([]);
    setSlotsAfter(undefined);
    setSelectedSlot(null);
    setError(null);
    setStep("slot");
    loadSlots(service);
  }

  function handleSelectSlot(slot: SlotPublic) {
    setSelectedSlot(slot);
    setStep("details");
    setError(null);
  }

  function handleLoadMore() {
    if (selectedService) loadSlots(selectedService, slotsAfter);
  }

  function handleDetailsSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !phone.trim() || !make.trim() || !model.trim()) {
      setError("Popunite sva obavezna polja.");
      return;
    }
    setStep("confirm");
  }

  function handleConfirm() {
    if (!selectedService || !selectedSlot) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await createBooking({
          serviceId: selectedService.id,
          startsAt: selectedSlot.startsAt,
          customer: { name, phone, contactPreference: "phone" },
          vehicle: {
            make,
            model,
            year: year ? parseInt(year, 10) : undefined,
          },
          customerNote: note || undefined,
        });
        if (result.ok) {
          setPublicRef(result.booking.publicReference);
          setStep("success");
        } else {
          setError(result.error);
          setStep("slot");
          setSelectedSlot(null);
          loadSlots(selectedService);
        }
      } catch {
        setError("Greška pri rezervaciji. Pokušajte ponovo.");
      }
    });
  }

  function handleWaitlistSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedService || !wlName.trim() || !wlPhone.trim()) {
      setError("Popunite ime i telefon.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await joinWaitlist({
          serviceId: selectedService.id,
          name: wlName,
          phone: wlPhone,
        });
        if (result.ok) {
          setStep("success");
          setPublicRef("waitlist");
        } else {
          setError(result.error);
        }
      } catch {
        setError("Greška. Pokušajte ponovo.");
      }
    });
  }

  // ─── Renders ────────────────────────────────────────────────────────────

  if (step === "service") {
    return (
      <div className="bk-flow">
        <p className="bk-kicker">Usluge</p>
        <h1 className="bk-headline">
          Šta
          <br />
          vaš auto
          <br />
          treba?
        </h1>
        <div className="bk-services" role="list">
          {services.map((s) => (
            <button
              key={s.id}
              className="bk-service-card"
              onClick={() => handleSelectService(s)}
              role="listitem"
              type="button"
            >
              <span className="bk-service-card__name">{s.name}</span>
              {s.shortDescription && (
                <span className="bk-service-card__desc">{s.shortDescription}</span>
              )}
              <span className="bk-service-card__meta">
                {s.durationMinutes >= 60
                  ? `${Math.floor(s.durationMinutes / 60)}h${s.durationMinutes % 60 > 0 ? ` ${s.durationMinutes % 60}min` : ""}`
                  : `${s.durationMinutes}min`}
                {formatPrice(s) ? ` · ${formatPrice(s)}` : ""}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === "slot") {
    return (
      <div className="bk-flow">
        <button className="bk-back" onClick={() => setStep("service")} type="button">
          ← Nazad
        </button>
        <p className="bk-kicker">{selectedService?.name}</p>
        <h2 className="bk-headline bk-headline--sm">
          Najbliži
          <br />
          termini
        </h2>
        {error && <p className="bk-error">{error}</p>}
        {isPending && slots.length === 0 && (
          <p className="bk-loading">Proveravam dostupnost…</p>
        )}
        {!isPending && slots.length === 0 && (
          <div className="bk-empty">
            <p className="bk-empty__text">
              Trenutno nema otvorenih termina.
            </p>
            <p className="bk-empty__sub">
              Možete se prijaviti na listu čekanja i dobiti obaveštenje kada se termin
              otvori.
            </p>
            <button
              className="bk-btn bk-btn--ghost"
              onClick={() => setStep("waitlist")}
              type="button"
            >
              Lista čekanja
            </button>
          </div>
        )}
        {slots.length > 0 && (
          <>
            <div className="bk-slots" role="list">
              {slots.map((slot) => (
                <button
                  key={slot.startsAt}
                  className="bk-slot"
                  onClick={() => handleSelectSlot(slot)}
                  role="listitem"
                  type="button"
                >
                  <span className="bk-slot__time">{formatSlot(slot.startsAt)}</span>
                </button>
              ))}
            </div>
            {hasMore && (
              <button
                className="bk-btn bk-btn--ghost"
                onClick={handleLoadMore}
                disabled={isPending}
                type="button"
              >
                {isPending ? "Učitavam…" : "Prikaži još termina"}
              </button>
            )}
          </>
        )}
      </div>
    );
  }

  if (step === "details") {
    return (
      <div className="bk-flow">
        <button className="bk-back" onClick={() => setStep("slot")} type="button">
          ← Nazad
        </button>
        <p className="bk-kicker">{selectedService?.name}</p>
        <p className="bk-kicker bk-kicker--time">
          {selectedSlot ? formatSlot(selectedSlot.startsAt) : ""}
        </p>
        <h2 className="bk-headline bk-headline--sm">Vaši podaci</h2>
        {error && <p className="bk-error">{error}</p>}
        <form className="bk-form" onSubmit={handleDetailsSubmit} noValidate>
          <div className="bk-field">
            <label className="bk-label" htmlFor="bk-name">
              Ime i prezime <span aria-hidden="true">*</span>
            </label>
            <input
              id="bk-name"
              className="bk-input"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              placeholder="Vaše ime"
            />
          </div>
          <div className="bk-field">
            <label className="bk-label" htmlFor="bk-phone">
              Telefon <span aria-hidden="true">*</span>
            </label>
            <input
              id="bk-phone"
              className="bk-input"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="+381 60 000 0000"
            />
          </div>
          <fieldset className="bk-fieldset">
            <legend className="bk-legend">Vozilo <span aria-hidden="true">*</span></legend>
            <div className="bk-field-row">
              <div className="bk-field">
                <label className="bk-label" htmlFor="bk-make">Marka</label>
                <input
                  id="bk-make"
                  className="bk-input"
                  type="text"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                  placeholder="VW"
                  maxLength={80}
                />
              </div>
              <div className="bk-field">
                <label className="bk-label" htmlFor="bk-model">Model</label>
                <input
                  id="bk-model"
                  className="bk-input"
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  placeholder="Golf"
                  maxLength={80}
                />
              </div>
            </div>
            <div className="bk-field bk-field--narrow">
              <label className="bk-label" htmlFor="bk-year">Godište</label>
              <input
                id="bk-year"
                className="bk-input"
                type="number"
                inputMode="numeric"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={1950}
                max={2030}
                placeholder="2018"
              />
            </div>
          </fieldset>
          <div className="bk-field">
            <label className="bk-label" htmlFor="bk-note">
              Napomena{" "}
              <span className="bk-label--optional">(opciono)</span>
            </label>
            <textarea
              id="bk-note"
              className="bk-input bk-input--textarea"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={1000}
              rows={3}
              placeholder="Opišite stanje vozila ili posebne zahteve…"
            />
          </div>
          <button className="bk-btn bk-btn--primary" type="submit">
            Nastavi
          </button>
        </form>
      </div>
    );
  }

  if (step === "confirm") {
    return (
      <div className="bk-flow">
        <button className="bk-back" onClick={() => setStep("details")} type="button">
          ← Nazad
        </button>
        <p className="bk-kicker">Potvrda</p>
        <h2 className="bk-headline bk-headline--sm">
          Proverite
          <br />
          podatke
        </h2>
        {error && <p className="bk-error">{error}</p>}
        <dl className="bk-summary">
          <div className="bk-summary__row">
            <dt>Usluga</dt>
            <dd>{selectedService?.name}</dd>
          </div>
          <div className="bk-summary__row">
            <dt>Termin</dt>
            <dd>{selectedSlot ? formatSlot(selectedSlot.startsAt) : ""}</dd>
          </div>
          <div className="bk-summary__row">
            <dt>Ime</dt>
            <dd>{name}</dd>
          </div>
          <div className="bk-summary__row">
            <dt>Telefon</dt>
            <dd>{phone}</dd>
          </div>
          <div className="bk-summary__row">
            <dt>Vozilo</dt>
            <dd>
              {make} {model} {year ? `(${year})` : ""}
            </dd>
          </div>
          {note && (
            <div className="bk-summary__row">
              <dt>Napomena</dt>
              <dd>{note}</dd>
            </div>
          )}
        </dl>
        <p className="bk-notice">
          Rezervacija je zahtev — vlasnik studija potvrđuje termin. Bićete
          kontaktirani na navedeni broj telefona.
        </p>
        <button
          className="bk-btn bk-btn--primary"
          onClick={handleConfirm}
          disabled={isPending}
          type="button"
        >
          {isPending ? "Šaljem zahtev…" : "Pošalji zahtev"}
        </button>
      </div>
    );
  }

  if (step === "success") {
    const isWaitlist = publicRef === "waitlist";
    return (
      <div className="bk-flow bk-flow--success">
        <p className="bk-kicker">{isWaitlist ? "Lista čekanja" : "Zahtev primljen"}</p>
        <h2 className="bk-headline bk-headline--sm">
          {isWaitlist ? (
            <>
              Prijavili ste se
              <br />
              na listu čekanja.
            </>
          ) : (
            <>
              Zahtev je
              <br />
              primljen.
            </>
          )}
        </h2>
        {!isWaitlist && (
          <>
            <p className="bk-success__ref">
              Referenca: <strong>{publicRef}</strong>
            </p>
            <p className="bk-success__body">
              Vlasnik studija će vas kontaktirati na broj koji ste naveli kako bi
              potvrdio termin. Termin nije zagarantovan dok ne dobijete potvrdu.
            </p>
          </>
        )}
        {isWaitlist && (
          <p className="bk-success__body">
            Kada se termin otvori, bićete kontaktirani. Hvala na strpljenju.
          </p>
        )}
        <Link className="bk-btn bk-btn--ghost" href="/">
          Nazad na priču
        </Link>
      </div>
    );
  }

  if (step === "waitlist") {
    return (
      <div className="bk-flow">
        <button className="bk-back" onClick={() => setStep("slot")} type="button">
          ← Nazad
        </button>
        <p className="bk-kicker">{selectedService?.name}</p>
        <h2 className="bk-headline bk-headline--sm">
          Lista
          <br />
          čekanja
        </h2>
        <p className="bk-desc">
          Trenutno nema otvorenih termina. Ostavite kontakt i bićete
          prvi obavešteni kada vlasnik otvori novi termin.
        </p>
        {error && <p className="bk-error">{error}</p>}
        <form className="bk-form" onSubmit={handleWaitlistSubmit} noValidate>
          <div className="bk-field">
            <label className="bk-label" htmlFor="bk-wl-name">
              Ime i prezime <span aria-hidden="true">*</span>
            </label>
            <input
              id="bk-wl-name"
              className="bk-input"
              type="text"
              autoComplete="name"
              value={wlName}
              onChange={(e) => setWlName(e.target.value)}
              required
              minLength={2}
              maxLength={120}
              placeholder="Vaše ime"
            />
          </div>
          <div className="bk-field">
            <label className="bk-label" htmlFor="bk-wl-phone">
              Telefon <span aria-hidden="true">*</span>
            </label>
            <input
              id="bk-wl-phone"
              className="bk-input"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              value={wlPhone}
              onChange={(e) => setWlPhone(e.target.value)}
              required
              placeholder="+381 60 000 0000"
            />
          </div>
          <button
            className="bk-btn bk-btn--primary"
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Prijavljujem…" : "Prijavi se"}
          </button>
        </form>
      </div>
    );
  }

  return null;
}
