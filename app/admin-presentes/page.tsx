import type { Metadata } from "next";
import { getGiftOrders, mergeOrders } from "@/lib/gift-orders";
import { getAllPixOrders } from "@/lib/pix-orders";
import { formatBRL } from "@/lib/format";
import ConfirmPixOrderButton from "@/components/admin-presentes/ConfirmPixOrderButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Presentes Recebidos",
  robots: { index: false, follow: false },
};

export default async function AdminPresentesPage() {
  const [{ orders: stripeOrders, error }, pixOrders] = await Promise.all([
    getGiftOrders(),
    getAllPixOrders(),
  ]);
  const orders = mergeOrders(stripeOrders, pixOrders);
  const paidTotal = orders
    .filter((order) => order.status === "pago")
    .reduce((sum, order) => sum + order.amount, 0);
  const pendingCount = orders.filter((order) => order.status === "pendente").length;

  return (
    <main className="min-h-screen bg-primary px-6 py-16 md:px-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-serif text-3xl text-secondary">Presentes Recebidos</h1>

        {error ? (
          <p className="mt-4 rounded-lg bg-muted p-4 text-sm text-red-600">{error}</p>
        ) : (
          <>
            <p className="mt-2 text-sm text-muted-foreground">
              Total recebido:{" "}
              <span className="font-medium text-accent">{formatBRL(paidTotal)}</span>
              {" · "}
              {orders.filter((order) => order.status === "pago").length}{" "}
              {orders.filter((order) => order.status === "pago").length === 1
                ? "presente"
                : "presentes"}
              {pendingCount > 0 && (
                <>
                  {" · "}
                  <span className="text-amber-600">
                    {pendingCount} Pix pendente{pendingCount > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </p>

            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Presente</th>
                    <th className="px-5 py-3">De</th>
                    <th className="px-5 py-3">Mensagem</th>
                    <th className="px-5 py-3">Valor</th>
                    <th className="px-5 py-3">Forma</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Data</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-5 py-6 text-center text-muted-foreground">
                        Nenhum presente recebido ainda.
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="border-t border-border">
                        <td className="px-5 py-3 text-secondary">{order.giftTitle}</td>
                        <td className="px-5 py-3 text-secondary">{order.guestName}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {order.guestMessage ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-accent">{formatBRL(order.amount)}</td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {order.method === "pix" ? "Pix" : "Cartão"}
                        </td>
                        <td
                          className={`px-5 py-3 ${
                            order.status === "pago" ? "text-emerald-600" : "text-amber-600"
                          }`}
                        >
                          {order.status === "pago" ? "Pago" : "Pendente"}
                        </td>
                        <td className="px-5 py-3 text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </td>
                        <td className="px-5 py-3">
                          {order.method === "pix" &&
                            order.status === "pendente" &&
                            order.pixOrderId && (
                              <ConfirmPixOrderButton orderId={order.pixOrderId} />
                            )}
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
