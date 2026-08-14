import type { Metadata } from "next";
import { Fragment } from "react";
import { getAllRsvps } from "@/lib/rsvp-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Convidados Confirmados",
  robots: { index: false, follow: false },
};

function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 7)}-${phone.slice(7)}`;
  }
  if (phone.length === 10) {
    return `(${phone.slice(0, 2)}) ${phone.slice(2, 6)}-${phone.slice(6)}`;
  }
  return phone;
}

export default async function AdminConfirmadosPage() {
  const entries = await getAllRsvps();
  const totalGuests = entries.reduce((sum, entry) => sum + entry.guests.length, 0);
  const totalSubmissions = entries.length;

  return (
    <main className="min-h-screen bg-primary px-6 py-16 md:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-secondary">
          Convidados Confirmados
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Total confirmado: <span className="font-medium text-accent">{totalGuests}</span>{" "}
          convidados · {totalSubmissions}{" "}
          {totalSubmissions === 1 ? "confirmação" : "confirmações"}
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-white">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">Celular</th>
                <th className="px-5 py-3">Confirmado em</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-muted-foreground">
                    Nenhuma confirmação recebida ainda.
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <Fragment key={entry.id}>
                    <tr className="border-t border-border">
                      <td className="px-5 py-3 text-secondary">{entry.guests[0].fullName}</td>
                      <td className="px-5 py-3 text-secondary">{formatPhone(entry.phone)}</td>
                      <td className="px-5 py-3 text-muted-foreground">
                        {new Date(entry.confirmedAt).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                    {entry.guests.slice(1).map((guest, index) => (
                      <tr key={`${entry.id}-plusone-${index}`}>
                        <td className="px-5 py-2 pl-10 text-sm text-muted-foreground">
                          ↳ {guest.fullName}
                        </td>
                        <td className="px-5 py-2 text-sm text-muted-foreground">—</td>
                        <td className="px-5 py-2 text-sm text-muted-foreground">—</td>
                      </tr>
                    ))}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
