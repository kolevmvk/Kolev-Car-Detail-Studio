import type { ReactNode } from "react";
import { StudioNav } from "@/components/studio/StudioNav";
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
      <StudioNav />
      <main className="studio-main">{children}</main>
    </div>
  );
}
