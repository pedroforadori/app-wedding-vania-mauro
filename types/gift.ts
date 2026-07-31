export interface Gift {
  id: string;
  title: string;
  description: string;
  /** Preço em centavos (ex.: 10000 = R$ 100,00), compatível com Stripe unit_amount. */
  price: number;
  imageUrl: string;
}

export interface GiftOrder {
  sessionId: string;
  giftId: string;
  giftTitle: string;
  guestName: string;
  guestMessage: string | null;
  /** Centavos, do amount_total do Stripe (compatível com formatBRL). */
  amount: number;
  /** Unix timestamp (segundos) — session.created do Stripe. */
  createdAt: number;
}
