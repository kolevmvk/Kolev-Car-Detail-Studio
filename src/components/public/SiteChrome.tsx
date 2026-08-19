"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";
import { MagneticCta } from "./MagneticCta";
import { SocialDock } from "./SocialDock";
import { SocialOrb } from "./SocialOrb";
import type { PublicStudioContact } from "@/features/content/social";
import { EMPTY_STUDIO_CONTACT, toTelHref } from "@/features/content/social";

/**
 * Fixed overlay: mark, scroll-progress rule, chapter counter and a
 * contextual booking link — all read-only chrome, no hover-only meaning.
 *
 * The progress rule and chapter counter are homepage-only (they describe
 * position within the one-car story, meaningless on /booking). The
 * booking link stays hidden until the visitor has moved past the opening
 * scene, so it never competes with the first cinematic frame but still
 * satisfies "booking reachable within 1-2 taps" once the story has begun.
 */
export function SiteChrome({
  contact = EMPTY_STUDIO_CONTACT,
}: {
  contact?: PublicStudioContact;
}) {
  const links = contact;
  const phoneHref = contact.phone ? toTelHref(contact.phone) : "";
  const pathname = usePathname();
  const isStory = pathname === "/";

  const { scrollYProgress } = useScroll();
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [pastHero, setPastHero] = useState(false);
  const [insideBookingEntry, setInsideBookingEntry] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isStory) return;
    const bookingEntry = document.querySelector("#booking-entry");
    if (!bookingEntry) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInsideBookingEntry(entry.isIntersecting),
      { threshold: 0.12 },
    );
    observer.observe(bookingEntry);
    return () => observer.disconnect();
  }, [isStory]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setPastHero(p > 0.14);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    window.dispatchEvent(new Event("kolev:close-orb"));
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  return (
    <header className="site-chrome">
      <a className="skip-link" href="#booking-entry">
        Preskoči na termine
      </a>

      {isStory && (
        <motion.span
          className="site-chrome__progress"
          style={{ scaleX: barScale }}
          aria-hidden="true"
        />
      )}

      <div className="site-chrome__row">
        <div className="site-chrome__identity">
          <div className="contact-dock">
            <SocialOrb links={links} />
          </div>
          <Link
            className="site-chrome__mark"
            href="/"
            data-condensed={pastHero}
            aria-label="Kolev Car Detailing — početna"
          >
            <span className="site-chrome__brand-word" aria-hidden="true">
              {"KOLEV".split("").map((letter, index) => (
                <span
                  className="site-chrome__brand-letter"
                  key={`${letter}-${index}`}
                  style={{ "--i": index } as CSSProperties}
                >
                  {letter}
                </span>
              ))}
            </span>
            <span className="site-chrome__brand-shine" aria-hidden="true">
              KOLEV
            </span>
            <span className="site-chrome__brand-service" aria-hidden="true">
              Car detailing studio
            </span>
            <span className="site-chrome__brand-rule" aria-hidden="true" />
          </Link>
          {phoneHref && contact.phone && (
            <a
              className="contact-phone"
              href={phoneHref}
              aria-label={`Pozovi ${contact.phone}`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7.2 3.6h2.4l1.2 3-1.6 1.1a12.4 12.4 0 0 0 6.1 6.1l1.1-1.6 3 1.2v2.4c0 .8-.6 1.5-1.4 1.6A15.6 15.6 0 0 1 5.6 5c.1-.8.8-1.4 1.6-1.4z" />
              </svg>
              <span>{contact.phone}</span>
            </a>
          )}
        </div>
        <div className="site-chrome__tools">
          <span className="site-chrome__place">Negotin</span>
          <button
            type="button"
            className="site-chrome__menu-trigger"
            aria-expanded={menuOpen}
            aria-controls="practical-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span>Meni</span>
            <i aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="practical-menu"
            id="practical-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Praktična navigacija"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <button
              type="button"
              className="practical-menu__backdrop"
              aria-label="Zatvori meni"
              onClick={() => setMenuOpen(false)}
            />
            <motion.nav
              className="practical-menu__panel"
              initial={{ clipPath: "inset(0 0 0 100%)" }}
              animate={{ clipPath: "inset(0 0 0 0%)" }}
              exit={{ clipPath: "inset(0 0 0 100%)" }}
              transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="practical-menu__sweep" aria-hidden="true" />
              <div className="practical-menu__top">
                <span>Kolev · praktično</span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setMenuOpen(false)}
                >
                  Zatvori <i aria-hidden="true">×</i>
                </button>
              </div>
              <div className="practical-menu__links">
                {[
                  { href: "/#cenovnik", n: "01", label: "Cenovnik i usluge", arrow: "↘" },
                  { href: "/booking", n: "02", label: "Slobodni termini", arrow: "→" },
                  { href: "/#booking-entry", n: "03", label: "O studiju", arrow: "↘" },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ clipPath: "inset(0 0 100% 0)", opacity: 0 }}
                    animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.18 + index * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link href={item.href as Route} onClick={() => setMenuOpen(false)}>
                      <small>{item.n}</small>
                      <strong>{item.label}</strong>
                      <i aria-hidden="true">{item.arrow}</i>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="practical-menu__footer">
                <div className="practical-menu__place">
                  <p>Negotin · Srbija</p>
                  {phoneHref && contact.phone && (
                    <a className="practical-menu__phone" href={phoneHref}>
                      Pozovi {contact.phone}
                    </a>
                  )}
                </div>
                <SocialDock links={links} variant="menu" />
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {isStory && (
        <MagneticCta
          href="/booking"
          className="site-chrome__cta"
          data-visible="true"
          data-quiet={insideBookingEntry}
          aria-label="Pogledaj prvi slobodan termin"
        >
          <span className="booking-key__tag">
            <small>Ključ povratka</small>
            <strong>Prvi slobodan termin</strong>
            <i aria-hidden="true">↗</i>
          </span>
          <span className="booking-key__object" aria-hidden="true">
            <span className="booking-key__ring" />
            <span className="booking-key__body">
              <span className="booking-key__face booking-key__face--front">
                <b className="booking-key__monogram">K</b>
                <span className="booking-key__buttons">
                  <i>
                    <svg viewBox="0 0 24 24">
                      <path d="M7.5 10V7.8a4.5 4.5 0 0 1 9 0V10M6 10h12v9H6z" />
                    </svg>
                  </i>
                  <i>
                    <svg viewBox="0 0 24 24">
                      <path d="M8.5 10V7.8a4.5 4.5 0 0 1 8.4-2.3M6 10h12v9H6z" />
                    </svg>
                  </i>
                  <i>
                    <svg viewBox="0 0 24 24">
                      <path d="M5 14h14l-1.6-5H6.6zM7 14v3h10v-3M9 17v2m6-2v2" />
                    </svg>
                  </i>
                </span>
                <span className="booking-key__led" />
              </span>
              <span className="booking-key__face booking-key__face--back">
                <em>KOLEV<small>CAR DETAILING</small></em>
                <span className="booking-key__back-groove" />
              </span>
              <span className="booking-key__edge" />
            </span>
          </span>
        </MagneticCta>
      )}
    </header>
  );
}
