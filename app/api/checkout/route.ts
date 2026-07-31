import { NextResponse } from "next/server";
import { getGiftById } from "@/lib/gifts-store";
import { isStripeConfigured, stripe } from "@/lib/stripe";
import { giftGuestSchema } from "@/lib/validations";

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

  // O preço nunca vem do client — é sempre relido no servidor, para que o
  // valor pago não possa ser manipulado antes do checkout.
  const gift = await getGiftById(giftId);
  if (!gift) {
    return NextResponse.json(
      { error: "Presente não encontrado." },
      { status: 404 }
    );
  }

  const origin = new URL(request.url).origin;

  if (!isStripeConfigured() || !stripe) {
    const params = new URLSearchParams({ gift: gift.id, guestName });
    if (guestMessage) params.set("guestMessage", guestMessage);
    return NextResponse.json({
      url: `/checkout-simulado?${params.toString()}`,
      simulated: true,
    });
  }

  const metadata: Record<string, string> = {
    giftId: gift.id,
    giftTitle: gift.title,
    guestName,
  };
  if (guestMessage) {
    metadata.guestMessage = guestMessage;
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "brl",
          product_data: {
            name: gift.title,
            description: gift.description,
            images: [gift.imageUrl],
          },
          unit_amount: gift.price,
        },
        quantity: 1,
      },
    ],
    success_url: `${origin}/?gift_status=success#lista-de-presentes`,
    cancel_url: `${origin}/?gift_status=cancelled#lista-de-presentes`,
    metadata,
  });

  return NextResponse.json({ url: session.url, simulated: false });
}
