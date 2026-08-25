"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const VARIANTS = {
  confirm: {
    endpoint: "confirm",
    label: "Marcar como confirmado",
    loadingLabel: "Confirmando...",
    errorFallback: "Falha ao confirmar.",
    className: "bg-secondary text-primary hover:bg-accent",
  },
  revert: {
    endpoint: "revert",
    label: "Reverter confirmação",
    loadingLabel: "Revertendo...",
    errorFallback: "Falha ao reverter.",
    className: "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white",
  },
} as const;

export default function ConfirmPixOrderButton({
  orderId,
  adminSecret,
  action = "confirm",
}: {
  orderId: string;
  adminSecret: string;
  action?: "confirm" | "revert";
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const variant = VARIANTS[action];

  async function handleClick() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/pix-orders/${orderId}/${variant.endpoint}`, {
        method: "POST",
        headers: { "x-admin-secret": adminSecret },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? variant.errorFallback);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : variant.errorFallback);
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isLoading}
        className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${variant.className}`}
      >
        {isLoading ? variant.loadingLabel : variant.label}
      </button>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
