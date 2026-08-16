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
        <p className="bk-kicker">Termini</p>
        <h1 className="bk-headline">Privremena greška</h1>
        <p className="bk-desc">
          Nije moguće učitati usluge. Pokušajte ponovo za koji trenutak.
        </p>
        <p className="bk-meta">
          <Link href="/">Nazad na priču</Link>
        </p>
      </article>
    );
  }

  if (services.length === 0) {
    return (
      <article className="bk-page">
        <p className="bk-kicker">Termini</p>
        <h1 className="bk-headline">
          Kapacitet
          <br />
          nije dekoracija.
        </h1>
        <p className="bk-desc">
          Usluge su u pripremi. Dok vlasnik ne postavi dostupnost, lista ostaje
          prazna namerno.
        </p>
        <p className="bk-meta">
          <Link href="/">Nazad na priču</Link>
          <span> · Negotin</span>
        </p>
      </article>
    );
  }

  return (
    <article className="bk-page">
      <BookingFlow services={services} />
    </article>
  );
}
