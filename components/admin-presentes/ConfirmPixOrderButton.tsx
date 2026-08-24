"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPixOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/pix-orders/${orderId}/confirm`, {
        method: "POST",
      });
      if (!response.ok) throw new Error();
      router.refresh();
    } catch {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleConfirm}
      disabled={isLoading}
      className="rounded-full bg-secondary px-4 py-1.5 text-xs uppercase tracking-wide text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? "Confirmando..." : "Marcar como confirmado"}
    </button>
  );
}
