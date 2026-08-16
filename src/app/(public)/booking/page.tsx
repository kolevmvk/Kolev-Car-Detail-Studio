import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termini",
  description: "Slobodni termini Kolev Car Detailing prikazuju se samo kada ih studio stvarno otvori.",
};

export default function BookingPage() {
  return (
    <article className="booking-page">
      <p className="kicker">Termini</p>
      <h1 className="display display--sm">
        Kapacitet
        <br />
        nije dekoracija.
      </h1>
      <p className="lede">
        Ovde će stajati najbliži stvarni termini — iz kalendara studija, ne iz šablona. Dok vlasnik
        ne otvori dostupnost, lista ostaje prazna namerno.
      </p>
      <p className="lede">
        Priča na početnoj je dokaz rada. Termin dolazi posle toga, ne umesto toga.
      </p>
      <p className="close__meta">
        <Link href="/">Nazad na priču</Link>
        <span> · Negotin</span>
      </p>
    </article>
  );
}
