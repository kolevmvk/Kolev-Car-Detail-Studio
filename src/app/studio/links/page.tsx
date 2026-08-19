import type { Metadata } from "next";
import Link from "next/link";
import { StudioLinksEditor } from "@/components/studio/StudioLinksEditor";
import { getStudioPublicLinks } from "@/features/content/public";
import { requireAdmin } from "@/lib/auth/studio";

export const metadata: Metadata = { title: "Telefon i mreže" };
export const dynamic = "force-dynamic";

export default async function StudioLinksPage() {
  await requireAdmin();
  const links = await getStudioPublicLinks();

  return (
    <div className="studio-page">
      <div className="studio-header">
        <Link href="/studio" className="studio-back">
          ← Pregled
        </Link>
        <p className="studio-kicker">Javni sajt</p>
        <h1 className="studio-headline">Telefon i mreže</h1>
        <p className="studio-header__description">
          Ubaci stvarni broj i profile. Prazno polje ostaje neobjavljeno — sajt
          nikad ne izmišlja telefon ni nalog.
        </p>
      </div>

      <StudioLinksEditor links={links} />
    </div>
  );
}
