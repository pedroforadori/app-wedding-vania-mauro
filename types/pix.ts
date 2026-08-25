export interface PixOrder {
  id: string;
  giftId: string;
  giftTitle: string;
  guestName: string;
  guestMessage: string | null;
  /** Centavos, mesma convenção de Gift.price. */
  amount: number;
  /** Payload EMV "Pix Copia e Cola" completo. */
  brCode: string;
  status: "pendente" | "confirmado";
  /** ISO 8601 */
  createdAt: string;
  confirmedAt: string | null;
}
