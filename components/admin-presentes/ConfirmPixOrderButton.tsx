"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ConfirmPixOrderButton({
  orderId,
  adminSecret,
}: {
  orderId: string;
  adminSecret: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pix-orders/${orderId}/confirm`, {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Falha ao confirmar.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao confirmar.");
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleConfirm}
        disabled={isLoading}
        className="rounded-full bg-secondary px-4 py-1.5 text-xs uppercase tracking-wide text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? "Confirmando..." : "Marcar como confirmado"}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
