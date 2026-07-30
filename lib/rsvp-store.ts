import "server-only";
import type { RsvpEntry } from "@/types/rsvp";

// Armazenamento em memória (simula um banco de dados). Guardado em
// `globalThis` — e não em uma variável de módulo comum — porque o bundler
// pode instanciar este arquivo separadamente para Route Handlers e para
// Server Components; sem isso, cada bundle veria seu próprio array vazio.
// Reseta a cada reinício do processo / cold start em produção na Vercel —
// para persistência real, troque este módulo por um banco de dados ou KV.
const globalForRsvp = globalThis as unknown as { __rsvps?: RsvpEntry[] };

const rsvps: RsvpEntry[] = globalForRsvp.__rsvps ?? (globalForRsvp.__rsvps = []);

export function findByPhone(phone: string): RsvpEntry | undefined {
  return rsvps.find((entry) => entry.phone === phone);
}

export function addRsvp(entry: RsvpEntry): RsvpEntry {
  rsvps.push(entry);
  return entry;
}

export function getAllRsvps(): RsvpEntry[] {
  return rsvps;
}

export function getRsvpCount(): number {
  return rsvps.length;
}
