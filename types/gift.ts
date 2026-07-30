export interface Gift {
  id: string;
  title: string;
  description: string;
  /** Preço em centavos (ex.: 10000 = R$ 100,00), compatível com Stripe unit_amount. */
  price: number;
  imageUrl: string;
}
