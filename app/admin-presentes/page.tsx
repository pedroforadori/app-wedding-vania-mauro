import type { Metadata } from "next";
import { isStripeConfigured } from "@/lib/stripe";
import { getGiftOrders } from "@/lib/gift-orders";
import { formatBRL } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Presentes Recebidos",
  robots: { index: false, follow: false },
};

export default async function AdminPresentesPage() {
  const stripeConfigured = isStripeConfigured();
  const { orders, error } = await getGiftOrders();
  const total = orders.reduce((sum, order) => sum + order.amount, 0);

  return (
    <main className="min-h-screen bg-primary px-6 py-16 md:px-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-serif text-3xl text-secondary">Presentes Recebidos</h1>

        {!stripeConfigured ? (
          <p className="mt-4 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            As chaves do Stripe ainda não foram configuradas neste ambiente, então
            não há presentes reais para exibir. Configure STRIPE_SECRET_KEY para
            usar esta página.
          </p>
        ) : error ? (
          <p className="mt-4 rounded-lg bg-muted p-4 text-sm text-red-600">{error}</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Total recebido:{" "}
              <span className="font-medium text-accent">{formatBRL(total)}</span>
              {" · "}
              {orders.length} {orders.length === 1 ? "presente" : "presentes"}
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Presente</th>
                    <th className="px-5 py-3">De</th>
                    <th className="px-5 py-3">Mensagem</th>
                    <th className="px-5 py-3">Valor</th>
                    <th className="px-5 py-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-6 text-center text-muted-foreground">
                        Nenhum presente recebido ainda.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.sessionId} className="border-t border-border">
                        <td className="px-5 py-3 text-secondary">{order.giftTitle}</td>
                        <td className="px-5 py-3 text-secondary">{order.guestName}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {order.guestMessage ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-accent">{formatBRL(order.amount)}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(order.createdAt * 1000).toLocaleString("pt-BR")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
