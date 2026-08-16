import { requireAdmin } from "@/lib/auth/studio";
import { createAdminSupabaseClient } from "@/lib/db/admin";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Rezervacije" };
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  await requireAdmin();
  const db = createAdminSupabaseClient();

  const { data: bookings } = await db
    .from("bookings")
    .select("id, public_reference, status, starts_at, created_at, customer_note, customers(name, phone), vehicles(make, model, year), services(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  const groups: Record<string, typeof bookings> = {
    pending: [],
    confirmed: [],
    other: [],
  };

  for (const b of bookings ?? []) {
    if (b.status === "pending") groups.pending!.push(b);
    else if (b.status === "confirmed") groups.confirmed!.push(b);
    else groups.other!.push(b);
  }

  function statusLabel(status: string) {
    const map: Record<string, string> = {
      pending: "Na čekanju",
      confirmed: "Potvrđena",
      declined: "Odbijena",
      cancelled: "Otkazana",
      completed: "Završena",
      no_show: "Nije se pojavio",
      rescheduled: "Promenjen termin",
    };
    return map[status] ?? status;
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <Link href="/studio" className="studio-back">← Pregled</Link>
        <h1 className="studio-headline">Rezervacije</h1>
      </div>

      {(["pending", "confirmed", "other"] as const).map((group) => {
        const items = groups[group];
        if (!items || items.length === 0) return null;
        return (
          <section key={group} className="studio-section">
            <h2 className="studio-section__title">
              {group === "pending"
                ? "Na čekanju"
                : group === "confirmed"
                  ? "Potvrđene"
                  : "Ostale"}
            </h2>
            <div className="studio-list">
              {items.map((b) => (
                <Link
                  key={b.id}
                  href={`/studio/bookings/${b.id}`}
                  className="studio-list-item studio-list-item--full"
                >
                  <div className="studio-list-item__row">
                    <span className="studio-list-item__ref">{b.public_reference}</span>
                    <span className={`studio-badge studio-badge--${b.status}`}>
                      {statusLabel(b.status)}
                    </span>
                  </div>
                  <span className="studio-list-item__name">
                    {(b.services as { name: string } | null)?.name}
                    {" · "}
                    {(b.customers as { name: string; phone: string } | null)?.name}
                  </span>
                  {b.starts_at && (
                    <span className="studio-list-item__time">
                      {new Date(b.starts_at).toLocaleString("sr-RS", {
                        timeZone: "Europe/Belgrade",
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      {(!bookings || bookings.length === 0) && (
        <p className="studio-empty">Nema rezervacija.</p>
      )}
    </div>
  );
}
