import { getAllRsvps } from "@/lib/rsvp-store";
import { formatPhone } from "@/lib/format";

export const dynamic = "force-dynamic";

/** Escapa um campo para CSV com delimitador `;` (padrão do Excel em pt-BR). */
function csvField(value: string): string {
  if (/[";\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const entries = await getAllRsvps();

  const header = ["Nome", "Tipo", "Celular", "Confirmado em"];
  const rows = entries.flatMap((entry) =>
    entry.guests.map((guest) => [
      guest.fullName,
      guest.isPlusOne ? "Acompanhante" : "Titular",
      formatPhone(entry.phone),
      new Date(entry.confirmedAt).toLocaleString("pt-BR"),
    ])
  );

  const csv = [header, ...rows]
    .map((row) => row.map(csvField).join(";"))
    .join("\r\n");

  // BOM garante que o Excel reconheça o arquivo como UTF-8 e exiba acentos corretamente.
  const body = "\uFEFF" + csv;

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="convidados-confirmados.csv"',
    },
  });
}
