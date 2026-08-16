import type { Metadata } from "next";
import { ChapterOpening } from "@/components/public/ChapterOpening";
import { ChapterDecline } from "@/components/public/ChapterDecline";
import { ChapterRecognition } from "@/components/public/ChapterRecognition";
import { ChapterWorkshop } from "@/components/public/ChapterWorkshop";
import { ChapterReturn } from "@/components/public/ChapterReturn";
import { BookingEntry } from "@/components/public/BookingEntry";

export const metadata: Metadata = {
  title: "Kolev Car Detailing — Negotin",
  description:
    "Profesionalni auto detajling u Negotinu. Restauracija farova, dubinsko čišćenje enterijera. Jedan auto, jedno preobraženje.",
};

export default function HomePage() {
  return (
    <main>
      {/* Act 1 — The car when it was new */}
      <ChapterOpening />

      {/* Act 2 — Gradual decline shown through matched before/after angles */}
      <ChapterDecline />

      {/* Act 3 — Recognition: the turning point */}
      <ChapterRecognition />

      {/* Act 4 — The craft: workshop process */}
      <ChapterWorkshop />

      {/* Act 5 — Return: the same car, transformed */}
      <ChapterReturn />

      {/* Act 6 — Booking entry point */}
      <BookingEntry />
    </main>
  );
}
