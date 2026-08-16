import { requireAdmin } from "@/lib/auth/studio";
import { createAdminSupabaseClient } from "@/lib/db/admin";
import Link from "next/link";
import type { Metadata } from "next";
import { AddWindowForm } from "@/components/studio/AddWindowForm";
import { AddBlockForm } from "@/components/studio/AddBlockForm";
import { DeleteWindowButton } from "@/components/studio/DeleteWindowButton";

export const metadata: Metadata = { title: "Dostupnost" };
export const dynamic = "force-dynamic";

export default async function AvailabilityPage() {
  await requireAdmin();
  const db = createAdminSupabaseClient();

  const now = new Date().toISOString();

  const [{ data: windows }, { data: blocks }] = await Promise.all([
    db
      .from("availability_windows")
      .select("id, starts_at, ends_at, note, enabled")
      .gte("ends_at", now)
      .order("starts_at", { ascending: true })
      .limit(30),
    db
      .from("availability_blocks")
      .select("id, starts_at, ends_at, reason, note")
      .gte("ends_at", now)
      .order("starts_at", { ascending: true })
      .limit(30),
  ]);

  function fmt(iso: string) {
    return new Date(iso).toLocaleString("sr-RS", {
      timeZone: "Europe/Belgrade",
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="studio-page">
      <div className="studio-header">
        <Link href="/studio" className="studio-back">← Pregled</Link>
        <h1 className="studio-headline">Dostupnost</h1>
      </div>

      <section className="studio-section">
        <h2 className="studio-section__title">Otvoreni termini (prozori)</h2>
        {(!windows || windows.length === 0) && (
          <p className="studio-empty">Nema otvorenih prozora. Dodajte ispod.</p>
        )}
        {windows && windows.length > 0 && (
          <div className="studio-list">
            {windows.map((w) => (
              <div key={w.id} className="studio-list-item studio-list-item--full">
                <div className="studio-list-item__row">
                  <span className="studio-list-item__time">
                    {fmt(w.starts_at)} — {fmt(w.ends_at)}
                  </span>
                  {!w.enabled && (
                    <span className="studio-badge studio-badge--other">Onemogućen</span>
                  )}
                </div>
                {w.note && (
                  <span className="studio-list-item__name">{w.note}</span>
                )}
                <DeleteWindowButton windowId={w.id} />
              </div>
            ))}
          </div>
        )}
        <AddWindowForm />
      </section>

      <section className="studio-section">
        <h2 className="studio-section__title">Blokade</h2>
        {(!blocks || blocks.length === 0) && (
          <p className="studio-empty">Nema aktivnih blokada.</p>
        )}
        {blocks && blocks.length > 0 && (
          <div className="studio-list">
            {blocks.map((b) => (
              <div key={b.id} className="studio-list-item">
                <span className="studio-list-item__time">
                  {fmt(b.starts_at)} — {fmt(b.ends_at)}
                </span>
                <span className="studio-badge studio-badge--cancelled">
                  {b.reason}
                </span>
              </div>
            ))}
          </div>
        )}
        <AddBlockForm />
      </section>
    </div>
  );
}
