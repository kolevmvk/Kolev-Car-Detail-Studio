import type { Metadata } from "next";
import { getServices } from "@/features/booking/actions";
import { BookingFlow } from "@/components/booking/BookingFlow";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termini",
  description:
    "Slobodni termini Kolev Car Detailing — samo stvarne dostupnosti, nikad dekorativni kalendar.",
};

export const dynamic = "force-dynamic";

export default async function BookingPage() {
  const services = await getServices().catch(() => null);

  if (!services) {
    return (
      <article className="bk-page">
        <p className="bk-kicker">Studio · Negotin</p>
        <h1 className="bk-headline">
          Privremena
          <br />
          nedostupnost.
        </h1>
        <p className="bk-desc">
          Nije moguće učitati usluge u ovom trenutku. Pokušajte ponovo za
          koji trenutak ili kontaktirajte studio direktno.
        </p>
        <p className="bk-meta">
          <Link href="/">← Nazad na priču</Link>
          <span> · Negotin, Srbija</span>
        </p>
      </article>
    );
  }

  if (services.length === 0) {
    return (
      <article className="bk-page">
        <p className="bk-kicker">Studio · Negotin</p>
        <h1 className="bk-headline">
          Nema
          <br />
          otvorenih
          <br />
          termina.
        </h1>
        <p className="bk-desc">
          Vlasnik studija sam određuje kada i koliko termina je dostupno. Kada
          se otvore, pojaviće se ovde — bez dekorativnih kalendara.
        </p>
        <p className="bk-desc" style={{ marginTop: 0 }}>
          Za direktan kontakt ili upit, pišite ili pozovite.
        </p>
        <p className="bk-meta">
          <Link href="/">← Nazad na priču</Link>
          <span> · Negotin, Srbija</span>
        </p>
      </article>
    );
  }

  return (
    <article id="booking-entry" className="bk-page">
      <div className="bk-context-header">
        <p className="bk-context-header__label">Studio · Negotin</p>
        <p className="bk-context-header__note">
          Prikazujemo samo stvarne slobodne termine. Vlasnik studija potvrđuje
          svaki zahtev pre nego što postane rezervacija.
        </p>
      </div>
      <BookingFlow services={services} />
    </article>
  );
}
