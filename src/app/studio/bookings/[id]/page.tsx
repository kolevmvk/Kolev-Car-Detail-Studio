import { requireAdmin } from "@/lib/auth/studio";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { BookingActions } from "@/components/studio/BookingActions";

export const metadata: Metadata = { title: "Rezervacija" };
export const dynamic = "force-dynamic";

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { db } = await requireAdmin();
  const { id } = await params;

  const { data: booking } = await db
    .from("bookings")
    .select("id, public_reference, status, starts_at, ends_at, created_at, customer_note, internal_note, source, customers(name, phone, email, contact_preference), vehicles(make, model, year, color), services(name, duration_minutes)")
    .eq("id", id)
    .single();

  if (!booking) notFound();

  const customer = firstRelation<{
    name: string;
    phone: string;
    email: string | null;
    contact_preference: string;
  }>(booking.customers);
  const vehicle = firstRelation<{
    make: string;
    model: string;
    year: number | null;
    color: string | null;
  }>(booking.vehicles);
  const service = firstRelation<{
    name: string;
    duration_minutes: number;
  }>(booking.services);

  function fmt(iso: string | null) {
    if (!iso) return "—";
    return new Date(iso).toLocaleString("sr-RS", {
      timeZone: "Europe/Belgrade",
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <Link href="/studio/bookings" className="studio-back">← Rezervacije</Link>
        <h1 className="studio-headline">{booking.public_reference}</h1>
        <span className={`studio-badge studio-badge--${booking.status}`}>
          {booking.status}
        </span>
      </div>

      <dl className="studio-dl">
        <div className="studio-dl__row">
          <dt>Usluga</dt>
          <dd>{service?.name ?? "—"}</dd>
        </div>
        <div className="studio-dl__row">
          <dt>Termin</dt>
          <dd>{fmt(booking.starts_at)}</dd>
        </div>
        <div className="studio-dl__row">
          <dt>Kreirano</dt>
          <dd>{fmt(booking.created_at)}</dd>
        </div>
        <div className="studio-dl__row">
          <dt>Kanal</dt>
          <dd>{booking.source}</dd>
        </div>
      </dl>

      <section className="studio-section">
        <h2 className="studio-section__title">Mušterija</h2>
        <dl className="studio-dl">
          <div className="studio-dl__row">
            <dt>Ime</dt>
            <dd>{customer?.name ?? "—"}</dd>
          </div>
          <div className="studio-dl__row">
            <dt>Telefon</dt>
            <dd>
              <a href={`tel:${customer?.phone}`}>{customer?.phone}</a>
            </dd>
          </div>
          {customer?.email && (
            <div className="studio-dl__row">
              <dt>Email</dt>
              <dd>{customer.email}</dd>
            </div>
          )}
        </dl>
      </section>

      <section className="studio-section">
        <h2 className="studio-section__title">Vozilo</h2>
        <dl className="studio-dl">
          <div className="studio-dl__row">
            <dt>Marka/Model</dt>
            <dd>
              {vehicle?.make} {vehicle?.model}
              {vehicle?.year ? ` (${vehicle.year})` : ""}
            </dd>
          </div>
          {vehicle?.color && (
            <div className="studio-dl__row">
              <dt>Boja</dt>
              <dd>{vehicle.color}</dd>
            </div>
          )}
        </dl>
      </section>

      {booking.customer_note && (
        <section className="studio-section">
          <h2 className="studio-section__title">Napomena mušterije</h2>
          <p className="studio-note">{booking.customer_note}</p>
        </section>
      )}

      {(booking.status === "pending" || booking.status === "confirmed") && (
        <section className="studio-section">
          <h2 className="studio-section__title">Akcija</h2>
          <BookingActions bookingId={booking.id} currentStatus={booking.status} />
        </section>
      )}
    </div>
  );
}
