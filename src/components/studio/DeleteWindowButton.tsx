"use client";

import { useTransition } from "react";
import { deleteAvailabilityWindow } from "@/features/booking/admin-actions";
import { useRouter } from "next/navigation";

export function DeleteWindowButton({ windowId }: { windowId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handle() {
    startTransition(async () => {
      await deleteAvailabilityWindow({ windowId });
      router.refresh();
    });
  }

  return (
    <button
      className="studio-btn studio-btn--sm studio-btn--decline"
      onClick={handle}
      disabled={isPending}
      type="button"
    >
      {isPending ? "…" : "Ukloni"}
    </button>
  );
}
