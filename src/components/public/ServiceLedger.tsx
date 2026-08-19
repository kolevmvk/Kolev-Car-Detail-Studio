"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type { ServicePublic } from "@/features/booking/schema";
import { media } from "@/features/story/content";
import { KineticType } from "./KineticType";
import { StoryImage } from "./StoryImage";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

function formatPrice(service: ServicePublic) {
  if (service.priceMode === "quote") return "Po proceni";
  if (service.priceAmountMinor === null) return "Cena u pripremi";
  const amount = Math.round(service.priceAmountMinor / 100);
  const prefix = service.priceMode === "from" ? "od " : "";
  return `${prefix}${amount.toLocaleString("sr-RS")} ${service.currency}`;
}

function formatDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder ? `${hours} h ${remainder} min` : `${hours} h`;
}

export function ServiceLedger({
  services,
}: {
  services: ServicePublic[];
}) {
  const reduce = useMountedReducedMotion();

  return (
    <section
      id="cenovnik"
      className="price-scene"
      aria-labelledby="cenovnik-title"
      data-empty={services.length === 0}
    >
      <div className="price-scene__media">
        <StoryImage
          src={media.priceScene}
          alt="Vlasnica u očišćenom autu — prelaz iz priče u cenu i termin."
          className="story-img price-scene__image"
        />
        <span className="price-scene__grade" aria-hidden="true" />
        {!reduce && <span className="price-scene__beam" aria-hidden="true" />}
        <span className="grain" aria-hidden="true" />
        <div className="price-scene__copy">
          <p className="scene__label">Kolev · cenovnik</p>
          <KineticType
            as="h2"
            id="cenovnik-title"
            className="price-scene__headline"
            lines={["Šta radimo.", "Koliko košta."]}
            variant="memory"
          />
        </div>
      </div>

      <div className="price-scene__sheet">
        <div className="price-scene__cols" aria-hidden="true">
          <span>Usluga</span>
          <span>Trajanje</span>
          <span>Cena</span>
        </div>

        {services.length > 0 ? (
          <ol className="price-scene__list">
            {services.map((service, index) => (
              <li
                key={service.id}
                style={{ "--row-index": index } as CSSProperties}
              >
                <span className="price-scene__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="price-scene__service">
                  <h3>{service.name}</h3>
                  {service.shortDescription && <p>{service.shortDescription}</p>}
                </div>
                <span className="price-scene__duration">
                  {formatDuration(service.durationMinutes)}
                </span>
                <strong className="price-scene__price">
                  {formatPrice(service)}
                </strong>
                <Link
                  href="/booking"
                  aria-label={`Termin za uslugu ${service.name}`}
                >
                  <span>Termin</span>
                  <i aria-hidden="true">↗</i>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="price-scene__list" aria-label="Cenovnik čeka unos iz Studija">
            {["Prva usluga", "Druga usluga", "Treća usluga"].map(
              (label, index) => (
                <li
                  key={label}
                  data-ghost="true"
                  style={{ "--row-index": index } as CSSProperties}
                >
                  <span className="price-scene__index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="price-scene__service">
                    <h3>{label}</h3>
                    <p>Ime, trajanje i cena dolaze iz Studija.</p>
                  </div>
                  <span className="price-scene__duration">—</span>
                  <strong className="price-scene__price">Čeka objavu</strong>
                </li>
              ),
            )}
          </ol>
        )}

        <p className="price-scene__footer">
          Negotin · Srbija
        </p>
      </div>
    </section>
  );
}
