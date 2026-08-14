import { NextResponse } from "next/server";
import { rsvpSchema } from "@/lib/validations";
import { addRsvp, getAllRsvps } from "@/lib/rsvp-store";
import type { RsvpGuest } from "@/types/rsvp";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = rsvpSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Dados inválidos.", fieldErrors: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { guests: names, phone } = result.data;
  const guests: RsvpGuest[] = names.map((fullName, index) => ({
    fullName,
    isPlusOne: index !== 0,
  }));

  const entry = await addRsvp({
    id: crypto.randomUUID(),
    guests,
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

  const entries = await getAllRsvps();
  const totalGuests = entries.reduce((sum, entry) => sum + entry.guests.length, 0);

  return NextResponse.json({
    guests: entries,
    totalSubmissions: entries.length,
    totalGuests,
  });
}
