import "server-only";
import { Redis } from "@upstash/redis";
import type { RsvpEntry } from "@/types/rsvp";

// Persistência via Redis (Upstash / Vercel Marketplace). Necessário porque
// instâncias serverless na Vercel são efêmeras e não compartilham memória
// entre invocações — um armazenamento em `globalThis` perde dados a cada
// cold start. Aceita tanto as variáveis do integration "Vercel KV" quanto as
// do Upstash direto, pois o nome muda conforme como o banco foi conectado.
//
// O cliente é criado sob demanda (não no topo do módulo): rotas que importam
// este arquivo são avaliadas durante `next build` para coleta de metadados,
// e um throw no escopo do módulo derrubaria o build inteiro de qualquer
// ambiente (ex.: Preview) que não tenha essas variáveis configuradas.
let redis: Redis | undefined;

function getRedis(): Redis {
  if (redis) return redis;

  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Redis não configurado: defina KV_REST_API_URL/KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN) nas variáveis de ambiente."
    );
  }

  redis = new Redis({ url, token });
  return redis;
}

const GUESTS_KEY = "rsvp:guests";

/** Formato usado antes da confirmação passar a aceitar múltiplos nomes por celular. */
type LegacyRsvpEntry = {
  id: string;
  fullName: string;
  phone: string;
  confirmedAt: string;
};

/** Normaliza entradas gravadas no formato antigo (`fullName` único) para `guests[]`. */
function normalizeEntry(raw: RsvpEntry | LegacyRsvpEntry): RsvpEntry {
  if (Array.isArray((raw as RsvpEntry).guests)) return raw as RsvpEntry;

  const legacy = raw as LegacyRsvpEntry;
  return {
    id: legacy.id,
    phone: legacy.phone,
    confirmedAt: legacy.confirmedAt,
    guests: [{ fullName: legacy.fullName, isPlusOne: false }],
  };
}

export async function findByPhone(phone: string): Promise<RsvpEntry | undefined> {
  const entry = await getRedis().hget<RsvpEntry | LegacyRsvpEntry>(GUESTS_KEY, phone);
  return entry ? normalizeEntry(entry) : undefined;
}

/** Retorna a entrada salva, ou `null` se este telefone já tinha confirmado (inserção atômica). */
export async function addRsvp(entry: RsvpEntry): Promise<RsvpEntry | null> {
  const inserted = await getRedis().hsetnx(GUESTS_KEY, entry.phone, entry);
  return inserted ? entry : null;
}

export async function getAllRsvps(): Promise<RsvpEntry[]> {
  const all = await getRedis().hgetall<Record<string, RsvpEntry | LegacyRsvpEntry>>(GUESTS_KEY);
  if (!all) return [];
  return Object.values(all)
    .map(normalizeEntry)
    .sort((a, b) => new Date(a.confirmedAt).getTime() - new Date(b.confirmedAt).getTime());
}

export async function getRsvpCount(): Promise<number> {
  return getRedis().hlen(GUESTS_KEY);
}
