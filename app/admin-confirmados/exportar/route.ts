import ExcelJS from "exceljs";
import { getAllRsvps } from "@/lib/rsvp-store";
import { formatPhone, formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export async function GET() {
  const entries = await getAllRsvps();

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Convidados");

  sheet.columns = [
    { header: "Nome", key: "nome", width: 32 },
    { header: "Tipo", key: "tipo", width: 14 },
    { header: "Celular", key: "celular", width: 18 },
    { header: "Confirmado em", key: "confirmadoEm", width: 20 },
  ];
  sheet.getRow(1).font = { bold: true };

  for (const entry of entries) {
    for (const guest of entry.guests) {
      sheet.addRow({
        nome: guest.fullName,
        tipo: guest.isPlusOne ? "Acompanhante" : "Titular",
        celular: formatPhone(entry.phone),
        confirmadoEm: formatDateTime(entry.confirmedAt),
      });
    }
  }

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="convidados-confirmados.xlsx"',
    },
  });
}
