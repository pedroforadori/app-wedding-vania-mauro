import "server-only";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import type { GiftOrder } from "@/types/gift";
import type { PixOrder } from "@/types/pix";

export async function getGiftOrders(): Promise<{
  orders: GiftOrder[];
  error: string | null;
}> {
  if (!isStripeConfigured() || !stripe) {
    return { orders: [], error: null };
  }

  try {
    const sessions = await stripe.checkout.sessions
      .list({ limit: 100, status: "complete" })
      .autoPagingToArray({ limit: 500 });

    const orders = sessions
      .map((session) => {
        const giftId = session.metadata?.giftId;
        if (!giftId) return null;
        return {
          sessionId: session.id,
          giftId,
          giftTitle: session.metadata?.giftTitle ?? "Presente",
          guestName: session.metadata?.guestName ?? "—",
          guestMessage: session.metadata?.guestMessage || null,
          amount: session.amount_total ?? 0,
          createdAt: session.created,
        } satisfies GiftOrder;
      })
      .filter((order): order is GiftOrder => order !== null);

    return { orders, error: null };
  } catch {
    return {
      orders: [],
      error:
        "Não foi possível carregar os presentes do Stripe agora. Tente novamente em instantes.",
    };
  }
}

export interface UnifiedOrder {
  id: string;
  method: "card" | "pix";
  giftTitle: string;
  guestName: string;
  guestMessage: string | null;
  amount: number;
  status: "pago" | "pendente";
  /** ISO 8601, normalizado a partir das duas fontes. */
  createdAt: string;
  /** Preenchido apenas para linhas Pix — usado pelo botão de confirmação manual. */
  pixOrderId: string | null;
}

export function mergeOrders(
  stripeOrders: GiftOrder[],
  pixOrders: PixOrder[]
): UnifiedOrder[] {
  const fromStripe: UnifiedOrder[] = stripeOrders.map((order) => ({
    id: order.sessionId,
    method: "card",
    giftTitle: order.giftTitle,
    guestName: order.guestName,
    guestMessage: order.guestMessage,
    amount: order.amount,
    // getGiftOrders() já filtra por status "complete" no Stripe.
    status: "pago",
    createdAt: new Date(order.createdAt * 1000).toISOString(),
    pixOrderId: null,
  }));

  const fromPix: UnifiedOrder[] = pixOrders.map((order) => ({
    id: order.id,
    method: "pix",
    giftTitle: order.giftTitle,
    guestName: order.guestName,
    guestMessage: order.guestMessage,
    amount: order.amount,
    status: order.status === "confirmado" ? "pago" : "pendente",
    createdAt: order.createdAt,
    pixOrderId: order.id,
  }));

  return [...fromStripe, ...fromPix].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}
