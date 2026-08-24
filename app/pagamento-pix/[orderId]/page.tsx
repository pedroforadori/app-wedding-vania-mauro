import Link from "next/link";
import QRCode from "qrcode";
import { getPixOrder } from "@/lib/pix-orders";
import { formatBRL } from "@/lib/format";
import CopyPixCodeButton from "@/components/gift-list/CopyPixCodeButton";

export const dynamic = "force-dynamic";

export default async function PagamentoPixPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getPixOrder(orderId);

  if (!order) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-primary px-6 py-24">
        <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-2xl text-secondary">
            Pedido não encontrado
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Não encontramos esse pedido de Pix. Ele pode ter expirado ou o
            link pode estar incorreto.
          </p>
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

  const qrDataUrl = await QRCode.toDataURL(order.brCode, {
    margin: 1,
    width: 320,
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-primary px-6 py-24">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-widest text-accent">
          Pagamento via Pix
        </p>
        <h1 className="mt-3 font-serif text-2xl text-secondary">
          Escaneie o QR Code ou copie o código
        </h1>

        <div className="mt-6 rounded-xl bg-muted p-4 text-left">
          <p className="font-medium text-secondary">{order.giftTitle}</p>
          <p className="text-sm text-accent">{formatBRL(order.amount)}</p>
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={qrDataUrl}
          alt="QR Code Pix"
          width={320}
          height={320}
          className="mx-auto mt-6 h-64 w-64"
        />

        <CopyPixCodeButton code={order.brCode} />

        <div className="mt-6 rounded-xl bg-muted p-4 text-left">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">De</p>
          <p className="font-medium text-secondary">{order.guestName}</p>
          {order.guestMessage && (
            <p className="mt-2 text-sm text-muted-foreground">
              &quot;{order.guestMessage}&quot;
            </p>
          )}
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          Assim que recebermos o Pix, vamos confirmar o seu presente por
          aqui. Muito obrigado pelo carinho!
        </p>

        <Link
          href="/#lista-de-presentes"
          className="mt-8 inline-block rounded-full border border-border px-6 py-3 text-sm uppercase tracking-wide text-secondary transition-colors hover:bg-muted"
        >
          Voltar para a lista de presentes
        </Link>
      </div>
    </main>
  );
}
