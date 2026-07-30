import { NextResponse } from "next/server";
import { getGifts } from "@/lib/gifts-store";

export async function GET() {
  const gifts = await getGifts();
  return NextResponse.json({ gifts });
}
