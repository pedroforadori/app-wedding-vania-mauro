"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-4 w-4">
      <path
        d="M4 7h16M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-7 0 1 13a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-13M10 11v6M14 11v6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PixOrderActions({
  orderId,
  adminSecret,
  status,
}: {
  orderId: string;
  adminSecret: string;
  status: "pendente" | "confirmado";
}) {
  const router = useRouter();
  const [loadingAction, setLoadingAction] = useState<"confirm" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoadingAction("confirm");
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
      setLoadingAction(null);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      status === "confirmado"
        ? "Remover este pedido Pix confirmado por engano? Essa ação não pode ser desfeita."
        : "Remover este pedido Pix pendente? Essa ação não pode ser desfeita."
    );
    if (!confirmed) return;

    setLoadingAction("delete");
    setError(null);
    try {
      const response = await fetch(`/api/pix-orders/${orderId}`, {
        method: "DELETE",
        headers: { "x-admin-secret": adminSecret },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? "Falha ao remover.");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao remover.");
      setLoadingAction(null);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        {status === "pendente" && (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loadingAction !== null}
            aria-label="Marcar como confirmado"
            title="Marcar como confirmado"
            className="rounded-full border border-emerald-600 p-1.5 text-emerald-600 transition-colors hover:bg-emerald-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <CheckIcon />
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={loadingAction !== null}
          aria-label="Remover pedido Pix"
          title="Remover pedido Pix"
          className="rounded-full border border-red-600 p-1.5 text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          <TrashIcon />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
