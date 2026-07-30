import type { Metadata } from "next";
import { getAllRsvps, getRsvpCount } from "@/lib/rsvp-store";

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
  const guests = getAllRsvps();
  const total = getRsvpCount();

  return (
    <main className="min-h-screen bg-primary px-6 py-16 md:px-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-3xl text-secondary">
          Convidados Confirmados
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Total confirmado: <span className="font-medium text-accent">{total}</span>
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Nome</th>
                <th className="px-5 py-3">Celular</th>
                <th className="px-5 py-3">Confirmado em</th>
              </tr>
            </thead>
            <tbody>
              {guests.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-6 text-center text-muted-foreground">
                    Nenhuma confirmação recebida ainda.
                  </td>
                </tr>
              ) : (
                guests.map((guest) => (
                  <tr key={guest.id} className="border-t border-border">
                    <td className="px-5 py-3 text-secondary">{guest.fullName}</td>
                    <td className="px-5 py-3 text-secondary">{formatPhone(guest.phone)}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {new Date(guest.confirmedAt).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
