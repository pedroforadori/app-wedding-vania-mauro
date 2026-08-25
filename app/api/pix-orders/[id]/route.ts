import { NextResponse } from "next/server";
import { deletePixOrder } from "@/lib/pix-orders";

export const runtime = "nodejs";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const secret = process.env.ADMIN_API_SECRET;
  const provided = request.headers.get("x-admin-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  const { id } = await params;
  const removed = await deletePixOrder(id);

  if (!removed) {
    return NextResponse.json(
      { error: "Pedido Pix não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
