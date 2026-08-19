import type { Metadata } from "next";
import Link from "next/link";
import {
  PromotionEditor,
  type EditablePromotion,
  type PromotionServiceOption,
} from "@/components/studio/PromotionEditor";
import { requireAdmin } from "@/lib/auth/studio";

export const metadata: Metadata = { title: "Akcije" };
export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const { db } = await requireAdmin();
  const [{ data: promotions, error }, { data: services }] = await Promise.all([
    db
      .from("promotions")
      .select(
        "id, internal_name, template, eyebrow, headline, body, cta_label, cta_href, service_id, enabled, starts_at, ends_at, sort_order",
      )
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    db
      .from("services")
      .select("id, name, price_mode, price_amount_minor, currency")
      .order("sort_order", { ascending: true }),
  ]);

  const serviceOptions = (services ?? []) as PromotionServiceOption[];

  return (
    <div className="studio-page studio-page--wide">
      <div className="studio-header">
        <Link href="/studio" className="studio-back">
          ← Pregled
        </Link>
        <p className="studio-kicker">Kontrolisani sadržaj</p>
        <h1 className="studio-headline">Akcije</h1>
        <p className="studio-header__description">
          Birate jedan od gotovih Kolev dizajna i menjate samo sadržaj. Prva
          aktivna akcija čiji datum važi prikazuje se pred završnim pozivom za
          rezervaciju.
        </p>
      </div>

      {error && (
        <p className="studio-form__error">
          Promo modul još nije dostupan u bazi. Potrebno je primeniti novu
          Supabase migraciju.
        </p>
      )}

      {!error && (
        <>
          <PromotionEditor services={serviceOptions} isNew />
          {(promotions ?? []).map((promotion) => (
            <PromotionEditor
              key={promotion.id}
              promotion={promotion as EditablePromotion}
              services={serviceOptions}
            />
          ))}
        </>
      )}
    </div>
  );
}
