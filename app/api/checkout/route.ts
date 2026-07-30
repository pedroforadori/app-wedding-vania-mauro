import { NextResponse } from "next/server";
import { getGiftById } from "@/lib/gifts-store";
import { isStripeConfigured, stripe } from "@/lib/stripe";

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
    return NextResponse.json({
      url: `/checkout-simulado?gift=${gift.id}`,
      simulated: true,
    });
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
    metadata: { giftId: gift.id, giftTitle: gift.title },
  });

  return NextResponse.json({ url: session.url, simulated: false });
}
