import Link from "next/link";
import Image from "next/image";
import { getGiftById } from "@/lib/gifts-store";
import { formatBRL } from "@/lib/format";

export default async function CheckoutSimuladoPage({
  searchParams,
}: {
  searchParams: Promise<{ gift?: string; guestName?: string; guestMessage?: string }>;
}) {
  const { gift: giftId, guestName, guestMessage } = await searchParams;
  const gift = giftId ? await getGiftById(giftId) : undefined;

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-widest text-accent">
          Modo de simulação
        </p>
        <h1 className="mt-3 font-serif text-2xl text-secondary">
          Pagamento simulado
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          As chaves do Stripe ainda não foram configuradas neste ambiente,
          então este é um checkout de demonstração — nenhuma cobrança real foi
          feita.
        </p>

        {gift && (
          <div className="mt-6 flex items-center gap-4 rounded-xl bg-muted p-4 text-left">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
              <Image
                src={gift.imageUrl}
                alt={gift.title}
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-secondary">{gift.title}</p>
              <p className="text-sm text-accent">{formatBRL(gift.price)}</p>
            </div>
          </div>
        )}

        {guestName && (
          <div className="mt-6 rounded-xl bg-muted p-4 text-left">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">De</p>
            <p className="font-medium text-secondary">{guestName}</p>
            {guestMessage && (
              <p className="mt-2 text-sm text-muted-foreground">&quot;{guestMessage}&quot;</p>
            )}
          </div>
        )}

        <Link
          href="/#lista-de-presentes"
          className="mt-8 inline-block rounded-full bg-secondary px-6 py-3 text-sm uppercase tracking-wide text-primary transition-colors hover:bg-accent"
        >
          Voltar para a lista de presentes
        </Link>
      </div>
    </main>
  );
}
