"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { signOutStudio } from "@/features/auth/actions";

export function StudioNav() {
  const pathname = usePathname();
  const isLogin = pathname === "/studio/login";

  return (
    <nav className="studio-nav" aria-label="Studio navigacija">
      <Link className="studio-nav__mark" href="/studio">
        KOLEV
      </Link>
      <div className="studio-nav__links">
        {!isLogin && (
          <>
            <Link href="/studio/bookings">Rezervacije</Link>
            <Link href="/studio/availability">Dostupnost</Link>
            <Link href={"/studio/services" as Route}>Cene</Link>
            <Link href={"/studio/links" as Route}>Kontakt</Link>
            <Link href={"/studio/promotions" as Route}>Akcije</Link>
          </>
        )}
        <Link href="/">↗ Sajt</Link>
        {!isLogin && (
          <form action={signOutStudio}>
            <button className="studio-nav__logout" type="submit">
              Odjava
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
