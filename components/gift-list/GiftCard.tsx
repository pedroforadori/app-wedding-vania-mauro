"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import type { Gift } from "@/types/gift";
import { formatBRL } from "@/lib/format";
import { giftGuestSchema } from "@/lib/validations";

export default function GiftCard({ gift }: { gift: Gift }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    guestName?: string;
    guestMessage?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setError(null);

    const parsed = giftGuestSchema.safeParse({ guestName, guestMessage });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        guestName: flat.guestName?.[0],
        guestMessage: flat.guestMessage?.[0],
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          giftId: gift.id,
          guestName: parsed.data.guestName,
          guestMessage: parsed.data.guestMessage,
        }),
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

        {!isFormOpen ? (
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="mt-4 w-full rounded-full bg-secondary py-2.5 text-sm uppercase tracking-wide text-primary transition-colors hover:bg-accent"
          >
            Presentear
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            <div>
              <label
                htmlFor={`${gift.id}-guestName`}
                className="text-sm uppercase tracking-wide text-secondary"
              >
                Seu nome
              </label>
              <input
                id={`${gift.id}-guestName`}
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-secondary outline-none focus:border-accent"
                placeholder="Seu nome completo"
              />
              {fieldErrors.guestName && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.guestName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor={`${gift.id}-guestMessage`}
                className="text-sm uppercase tracking-wide text-secondary"
              >
                Mensagem para o casal (opcional)
              </label>
              <textarea
                id={`${gift.id}-guestMessage`}
                rows={3}
                maxLength={300}
                value={guestMessage}
                onChange={(event) => setGuestMessage(event.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-2.5 text-sm text-secondary outline-none focus:border-accent"
                placeholder="Deixe uma mensagem carinhosa para os noivos"
              />
              {fieldErrors.guestMessage && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.guestMessage}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                disabled={isLoading}
                className="flex-1 rounded-full border border-border py-2.5 text-sm uppercase tracking-wide text-secondary transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 rounded-full bg-secondary py-2.5 text-sm uppercase tracking-wide text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Redirecionando..." : "Confirmar presente"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
