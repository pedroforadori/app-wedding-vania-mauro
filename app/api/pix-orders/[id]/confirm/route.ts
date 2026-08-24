import { NextResponse } from "next/server";
import { confirmPixOrder } from "@/lib/pix-orders";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await confirmPixOrder(id);

  if (!order) {
    return NextResponse.json(
      { error: "Pedido Pix não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
