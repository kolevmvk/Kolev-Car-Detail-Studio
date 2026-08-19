"use client";

import Link from "next/link";
import { useRef, useState } from "react";

const chapters = [
  { number: "01", href: "#opening-hero-title", label: "Sećanje", note: "Kada si ga stvarno gledao" },
  { number: "02", href: "#s-time", label: "Život", note: "Vlasnici, putevi, uspomene" },
  { number: "03", href: "#s3", label: "Prepoznavanje", note: "Nije nepovratno" },
  { number: "04", href: "#s4", label: "Ulaz", note: "Auto ulazi u studio" },
  { number: "05", href: "#s5-label", label: "Zanat", note: "Materijal, svetlo, ruke" },
  { number: "06", href: "#s6", label: "Rezultat", note: "Rad postaje dokaz" },
  { number: "07", href: "#s7", label: "Povratak", note: "Isti auto, drugi utisak" },
  { number: "08", href: "#s8", label: "Termin", note: "Priča prelazi na tvoj auto" },
] as const;

export function StoryIndex({ isStory }: { isStory: boolean }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openIndex() {
    dialogRef.current?.showModal();
    setOpen(true);
  }

  function closeIndex() {
    dialogRef.current?.close();
    setOpen(false);
  }

  return (
    <>
      <button
        className="story-index-trigger"
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={openIndex}
      >
        Priča
        <span aria-hidden="true">＋</span>
      </button>

      <dialog
        ref={dialogRef}
        className="story-index"
        aria-labelledby="story-index-title"
        onClose={closeIndex}
      >
        <div className="story-index__topline">
          <p className="story-index__eyebrow">Kolev · Jedan auto / osam poglavlja</p>
          <button
            className="story-index__close"
            type="button"
            aria-label="Zatvori pregled priče"
            onClick={closeIndex}
          >
            Zatvori <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="story-index__body">
          <div className="story-index__intro">
            <p id="story-index-title" className="story-index__title">
              Ne menjamo auto.
              <br />
              Menjamo način na koji ga vidiš.
            </p>
            <p className="story-index__intro-note">
              Otvori bilo koje poglavlje ili nastavi redom.
            </p>
          </div>

          <nav className="story-index__chapters" aria-label="Poglavlja priče">
            {chapters.map((chapter) => (
              <Link
                key={chapter.number}
                href={`${isStory ? "" : "/"}${chapter.href}`}
                className="story-index__chapter"
                onClick={closeIndex}
              >
                <span className="story-index__number">{chapter.number}</span>
                <span className="story-index__chapter-name">{chapter.label}</span>
                <span className="story-index__chapter-note">{chapter.note}</span>
                <span className="story-index__arrow" aria-hidden="true">↘</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="story-index__footer">
          <Link href="/booking" onClick={closeIndex}>
            Pogledaj slobodne termine ↗
          </Link>
          <Link href="/studio/login" onClick={closeIndex}>
            Studio pristup
          </Link>
        </div>
      </dialog>
    </>
  );
}
