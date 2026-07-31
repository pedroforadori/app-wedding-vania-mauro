import "server-only";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import type { GiftOrder } from "@/types/gift";

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
