import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validations";
import { addRsvp, getAllRsvps, getRsvpCount } from "@/lib/rsvp-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = rsvpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", fieldErrors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { fullName, phone } = result.data;

  const entry = await addRsvp({
    id: crypto.randomUUID(),
    fullName,
    phone,
    confirmedAt: new Date().toISOString(),
  });

  if (!entry) {
    return NextResponse.json(
      { error: "Este número de celular já confirmou presença." },
      { status: 409 }
    );
  }

  return NextResponse.json({ entry }, { status: 201 });
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = process.env.ADMIN_API_SECRET;
  const provided = request.headers.get("x-admin-secret");

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  return NextResponse.json({ guests: await getAllRsvps(), total: await getRsvpCount() });
}
