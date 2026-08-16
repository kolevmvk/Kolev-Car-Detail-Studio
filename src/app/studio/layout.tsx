import type { ReactNode } from "react";
import Link from "next/link";
import "@/styles/studio.css";

export const metadata = {
  title: {
    default: "Studio — Kolev",
    template: "%s — Kolev Studio",
  },
};

export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="studio-shell">
      <nav className="studio-nav" aria-label="Studio navigacija">
        <Link className="studio-nav__mark" href="/studio">
          KOLEV
        </Link>
        <div className="studio-nav__links">
          <Link href="/studio/bookings">Rezervacije</Link>
          <Link href="/studio/availability">Dostupnost</Link>
          <Link href="/">↗ Sajt</Link>
        </div>
      </nav>
      <main className="studio-main">{children}</main>
    </div>
  );
}
