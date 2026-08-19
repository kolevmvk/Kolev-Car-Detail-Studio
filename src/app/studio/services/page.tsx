import type { Metadata } from "next";
import Link from "next/link";
import {
  ServiceEditor,
  type EditableService,
} from "@/components/studio/ServiceEditor";
import { requireAdmin } from "@/lib/auth/studio";

export const metadata: Metadata = { title: "Usluge i cene" };
export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const { db } = await requireAdmin();
  const { data: services, error } = await db
    .from("services")
    .select(
      "id, slug, name, short_description, booking_mode, duration_minutes, cleanup_buffer_minutes, price_mode, price_amount_minor, currency, active, sort_order",
    )
    .order("sort_order", { ascending: true });

  return (
    <div className="studio-page">
      <div className="studio-header">
        <Link href="/studio" className="studio-back">
          ← Pregled
        </Link>
        <p className="studio-kicker">Javni cenovnik</p>
        <h1 className="studio-headline">Usluge i cene</h1>
        <p className="studio-header__description">
          Izmene se odmah koriste na stranici za rezervaciju. Isključena usluga
          se više ne prikazuje posetiocima.
        </p>
      </div>

      {error && (
        <p className="studio-form__error">
          Usluge trenutno nije moguće učitati.
        </p>
      )}

      {!error && (!services || services.length === 0) && (
        <p className="studio-empty">
          Još nema unetih usluga. Napravite prvu stavku ispod.
        </p>
      )}

      <div className="studio-editor-list">
        <ServiceEditor
          isNew
          service={{
            slug: "",
            name: "",
            short_description: null,
            booking_mode: "request",
            duration_minutes: 120,
            cleanup_buffer_minutes: 30,
            price_mode: "quote",
            price_amount_minor: null,
            currency: "RSD",
            active: true,
            sort_order: (services?.length ?? 0) * 10,
          }}
        />
        {(services ?? []).map((service) => (
          <ServiceEditor
            key={service.id}
            service={service as EditableService}
          />
        ))}
      </div>
    </div>
  );
}
