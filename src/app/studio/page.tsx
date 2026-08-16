import { requireAdmin } from "@/lib/auth/studio";
import Link from "next/link";

export const metadata = { title: "Pregled" };
export const dynamic = "force-dynamic";

function firstRelation<T>(value: T | T[] | null | undefined): T | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function StudioDashboard() {
  const { studioUser, db } = await requireAdmin();

  const { data: pendingBookings } = await db
    .from("bookings")
    .select("id, public_reference, status, starts_at, created_at, services(name)")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(5);

  const pendingCount = pendingBookings?.length ?? 0;

  return (
    <div className="studio-page">
      <div className="studio-header">
        <p className="studio-kicker">Dobrodošli, {studioUser.display_name ?? studioUser.email}</p>
        <h1 className="studio-headline">Studio</h1>
      </div>

      <div className="studio-stats">
        <div className="studio-stat">
          <span className="studio-stat__value">{pendingCount}</span>
          <span className="studio-stat__label">Na čekanju</span>
        </div>
      </div>

      {pendingCount > 0 && (
        <section className="studio-section">
          <h2 className="studio-section__title">Novi zahtevi</h2>
          <div className="studio-list">
            {pendingBookings?.map((b) => (
              <Link
                key={b.id}
                href={`/studio/bookings/${b.id}`}
                className="studio-list-item"
              >
                <span className="studio-list-item__ref">{b.public_reference}</span>
                <span className="studio-list-item__name">
                  {firstRelation<{ name: string }>(b.services)?.name ?? "Usluga"}
                </span>
                {b.starts_at && (
                  <span className="studio-list-item__time">
                    {new Date(b.starts_at).toLocaleString("sr-RS", {
                      timeZone: "Europe/Belgrade",
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </Link>
            ))}
          </div>
          <Link href="/studio/bookings" className="studio-link">
            Sve rezervacije →
          </Link>
        </section>
      )}

      <div className="studio-actions">
        <Link href="/studio/availability" className="studio-action-card">
          <span className="studio-action-card__title">Dostupnost</span>
          <span className="studio-action-card__desc">Otvori termine, dodaj blokade</span>
        </Link>
        <Link href="/studio/bookings" className="studio-action-card">
          <span className="studio-action-card__title">Rezervacije</span>
          <span className="studio-action-card__desc">Pregled i upravljanje zahtevima</span>
        </Link>
      </div>
    </div>
  );
}
