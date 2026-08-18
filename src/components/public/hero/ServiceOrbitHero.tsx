"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { ServicePublic } from "@/features/booking/schema";
import { MagneticCta } from "../MagneticCta";
import { useSpatialMode } from "../spatial/useSpatialMode";

const ServiceOrbitCanvas = dynamic(
  () => import("./ServiceOrbitCanvas").then((m) => m.ServiceOrbitCanvas),
  { ssr: false },
);

function formatPrice(service: ServicePublic): string {
  if (service.priceMode === "quote") return "Cena po dogovoru";
  if (!service.priceAmountMinor) return "";
  const amount = Math.round(service.priceAmountMinor / 100);
  const prefix = service.priceMode === "from" ? "od " : "";
  return `${prefix}${amount.toLocaleString("sr-RS")} ${service.currency}`;
}

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

/**
 * The new opening scene: a stylized 3D car the visitor can grab and rotate,
 * with a real service picker (not decorative color swatches) driving what's
 * shown. Replaces the S01 photoreal spatial hero — see conversation: the
 * owner wants the opening beat to be interactive/dynamic rather than led by
 * stock photography of a car that isn't actually theirs.
 */
export function ServiceOrbitHero({ services }: { services: ServicePublic[] }) {
  const mode = useSpatialMode();
  const [selectedId, setSelectedId] = useState(services[0]?.id ?? null);
  const pulse = useRef(0);
  const selected = services.find((s) => s.id === selectedId) ?? services[0] ?? null;

  useEffect(() => {
    pulse.current = 1;
    const t = setTimeout(() => {
      pulse.current = 0;
    }, 700);
    return () => clearTimeout(t);
  }, [selectedId]);

  const showCanvas = mode === "webgl" || mode === "webgl-low";

  return (
    <section className="orbit-hero" aria-labelledby="orbit-hero-title">
      <div className="orbit-hero__stage">
        {showCanvas ? (
          <ServiceOrbitCanvas lowPower={mode === "webgl-low"} pulse={pulse} />
        ) : (
          <div className="orbit-hero__fallback" aria-hidden="true" />
        )}
      </div>

      <div className="orbit-hero__overlay">
        <p className="scene__label">Studio · Negotin</p>
        <p id="orbit-hero-title" className="orbit-hero__title">
          Izaberi šta mu treba.
        </p>
        {showCanvas && (
          <p className="orbit-hero__hint">Uhvati i okreni auto — ili izaberi uslugu ispod.</p>
        )}

        {services.length === 0 ? (
          <p className="orbit-hero__empty">Usluge su u pripremi.</p>
        ) : (
          <>
            <div className="orbit-hero__swatches" role="tablist" aria-label="Usluge">
              {services.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={service.id === selectedId}
                  className="orbit-hero__swatch"
                  data-active={service.id === selectedId}
                  onClick={() => setSelectedId(service.id)}
                >
                  {service.name}
                </button>
              ))}
            </div>

            {selected && (
              <div className="orbit-hero__detail">
                {selected.shortDescription && (
                  <p className="orbit-hero__desc">{selected.shortDescription}</p>
                )}
                <p className="orbit-hero__meta">
                  {formatDuration(selected.durationMinutes)} · {formatPrice(selected)}
                </p>
                <MagneticCta className="action__btn" href="/booking">
                  Rezerviši — {selected.name}
                </MagneticCta>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
