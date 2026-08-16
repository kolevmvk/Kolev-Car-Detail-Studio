"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/features/booking/admin-actions";
import { useRouter } from "next/navigation";

interface BookingActionsProps {
  bookingId: string;
  currentStatus: string;
}

export function BookingActions({ bookingId, currentStatus }: BookingActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handle(status: "confirmed" | "declined" | "cancelled") {
    setError(null);
    startTransition(async () => {
      const result = await updateBookingStatus({ bookingId, status });
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error ?? "Greška.");
      }
    });
  }

  return (
    <div className="studio-actions-row">
      {error && <p className="studio-error">{error}</p>}
      {currentStatus === "pending" && (
        <>
          <button
            className="studio-btn studio-btn--confirm"
            onClick={() => handle("confirmed")}
            disabled={isPending}
            type="button"
          >
            {isPending ? "…" : "Potvrdi termin"}
          </button>
          <button
            className="studio-btn studio-btn--decline"
            onClick={() => handle("declined")}
            disabled={isPending}
            type="button"
          >
            {isPending ? "…" : "Odbij"}
          </button>
        </>
      )}
      {currentStatus === "confirmed" && (
        <button
          className="studio-btn studio-btn--decline"
          onClick={() => handle("cancelled")}
          disabled={isPending}
          type="button"
        >
          {isPending ? "…" : "Otkaži termin"}
        </button>
      )}
    </div>
  );
}
