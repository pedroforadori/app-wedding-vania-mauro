import { NextResponse } from "next/server";
import { revertPixOrder } from "@/lib/pix-orders";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = process.env.ADMIN_API_SECRET;
  const provided = request.headers.get("x-admin-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const order = await revertPixOrder(id);

  if (!order) {
    return NextResponse.json(
      { error: "Pedido Pix não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ order });
}
