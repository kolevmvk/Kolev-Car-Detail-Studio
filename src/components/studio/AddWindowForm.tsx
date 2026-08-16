"use client";

import { useState, useTransition } from "react";
import { createAvailabilityWindow } from "@/features/booking/admin-actions";
import { useRouter } from "next/navigation";

export function AddWindowForm() {
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!startsAt || !endsAt) {
      setError("Unesite početak i kraj.");
      return;
    }
    startTransition(async () => {
      const result = await createAvailabilityWindow({
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        note: note || undefined,
      });
      if (result.ok) {
        setStartsAt("");
        setEndsAt("");
        setNote("");
        router.refresh();
      } else {
        setError(result.error ?? "Greška.");
      }
    });
  }

  return (
    <form className="studio-form studio-form--inline" onSubmit={handleSubmit}>
      {error && <p className="studio-form__error">{error}</p>}
      <div className="studio-field">
        <label className="studio-label" htmlFor="win-start">Početak</label>
        <input
          id="win-start"
          className="studio-input"
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />
      </div>
      <div className="studio-field">
        <label className="studio-label" htmlFor="win-end">Kraj</label>
        <input
          id="win-end"
          className="studio-input"
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          required
        />
      </div>
      <div className="studio-field">
        <label className="studio-label" htmlFor="win-note">Napomena (opciono)</label>
        <input
          id="win-note"
          className="studio-input"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
        />
      </div>
      <button className="studio-btn" type="submit" disabled={isPending}>
        {isPending ? "Čuvam…" : "Dodaj prozor"}
      </button>
    </form>
  );
}
