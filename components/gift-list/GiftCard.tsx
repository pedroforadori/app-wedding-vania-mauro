"use client";

import { useState } from "react";
import Image from "next/image";
import type { Gift } from "@/types/gift";
import { formatBRL } from "@/lib/format";

export default function GiftCard({ gift }: { gift: Gift }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGift() {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ giftId: gift.id }),
      });
      const data = await response.json();
      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "Não foi possível iniciar o checkout.");
      }
      window.location.href = data.url;
    } catch {
      setError("Não foi possível iniciar o pagamento. Tente novamente.");
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition-shadow hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image
          src={gift.imageUrl}
          alt={gift.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg text-secondary">{gift.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">
          {gift.description}
        </p>
        <p className="mt-4 text-lg font-medium text-accent">
          {formatBRL(gift.price)}
        </p>

        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

        <button
          type="button"
          onClick={handleGift}
          disabled={isLoading}
          className="mt-4 w-full rounded-full bg-secondary py-2.5 text-sm uppercase tracking-wide text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Redirecionando..." : "Presentear"}
        </button>
      </div>
    </div>
  );
}
