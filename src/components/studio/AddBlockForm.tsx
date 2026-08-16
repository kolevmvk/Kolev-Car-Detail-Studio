"use client";

import { useState, useTransition } from "react";
import { createAvailabilityBlock } from "@/features/booking/admin-actions";
import { useRouter } from "next/navigation";

export function AddBlockForm() {
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [reason, setReason] = useState<"private" | "closed" | "maintenance" | "other">("private");
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
      const result = await createAvailabilityBlock({
        startsAt: new Date(startsAt).toISOString(),
        endsAt: new Date(endsAt).toISOString(),
        reason,
      });
      if (result.ok) {
        setStartsAt("");
        setEndsAt("");
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
        <label className="studio-label" htmlFor="blk-start">Početak blokade</label>
        <input
          id="blk-start"
          className="studio-input"
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
          required
        />
      </div>
      <div className="studio-field">
        <label className="studio-label" htmlFor="blk-end">Kraj blokade</label>
        <input
          id="blk-end"
          className="studio-input"
          type="datetime-local"
          value={endsAt}
          onChange={(e) => setEndsAt(e.target.value)}
          required
        />
      </div>
      <div className="studio-field">
        <label className="studio-label" htmlFor="blk-reason">Razlog</label>
        <select
          id="blk-reason"
          className="studio-input"
          value={reason}
          onChange={(e) =>
            setReason(e.target.value as "private" | "closed" | "maintenance" | "other")
          }
        >
          <option value="private">Privatno</option>
          <option value="closed">Zatvoreno</option>
          <option value="maintenance">Održavanje</option>
          <option value="other">Ostalo</option>
        </select>
      </div>
      <button className="studio-btn" type="submit" disabled={isPending}>
        {isPending ? "Čuvam…" : "Dodaj blokadu"}
      </button>
    </form>
  );
}
