import { NextResponse } from "next/server";
import { getGiftById } from "@/lib/gifts-store";
import { giftGuestSchema } from "@/lib/validations";
import { isPixConfigured, getPixConfig } from "@/lib/pix-config";
import { buildPixPayload } from "@/lib/pix";
import { createPixOrder } from "@/lib/pix-orders";
import type { PixOrder } from "@/types/pix";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const giftId = typeof body?.giftId === "string" ? body.giftId : null;

  if (!giftId) {
    return NextResponse.json(
      { error: "Presente inválido." },
      { status: 400 }
    );
  }

  const parsed = giftGuestSchema.safeParse({
    guestName: body?.guestName,
    guestMessage: body?.guestMessage,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { guestName, guestMessage } = parsed.data;

  // O preço nunca vem do client — é sempre relido no servidor.
  const gift = await getGiftById(giftId);
  if (!gift) {
    return NextResponse.json(
      { error: "Presente não encontrado." },
      { status: 404 }
    );
  }

  if (!isPixConfigured()) {
    return NextResponse.json(
      { error: "Pix não está configurado neste ambiente." },
      { status: 400 }
    );
  }

  const orderId = crypto.randomUUID();
  const config = getPixConfig();
  const brCode = buildPixPayload({
    key: config.key,
    merchantName: config.merchantName,
    merchantCity: config.merchantCity,
    amountCents: gift.price,
    txid: orderId,
  });

  const order: PixOrder = {
    id: orderId,
    giftId: gift.id,
    giftTitle: gift.title,
    guestName,
    guestMessage: guestMessage ?? null,
    amount: gift.price,
    brCode,
    status: "pendente",
    createdAt: new Date().toISOString(),
    confirmedAt: null,
  };

  await createPixOrder(order);

  return NextResponse.json({ orderId: order.id });
}
