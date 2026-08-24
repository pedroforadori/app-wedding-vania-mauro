import "server-only";
import { Redis } from "@upstash/redis";
import type { PixOrder } from "@/types/pix";

// Mesma instância Redis (Upstash) já usada para RSVP — ver lib/rsvp-store.ts
// para o motivo do client ser criado sob demanda em vez de no topo do módulo.
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

const ORDERS_KEY = "pix:orders";

export async function createPixOrder(order: PixOrder): Promise<void> {
  await getRedis().hset(ORDERS_KEY, { [order.id]: order });
}

export async function getPixOrder(id: string): Promise<PixOrder | undefined> {
  const order = await getRedis().hget<PixOrder>(ORDERS_KEY, id);
  return order ?? undefined;
}

export async function getAllPixOrders(): Promise<PixOrder[]> {
  const all = await getRedis().hgetall<Record<string, PixOrder>>(ORDERS_KEY);
  if (!all) return [];
  return Object.values(all).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

/** Idempotente: se já estiver "confirmado", retorna sem reescrever. */
export async function confirmPixOrder(id: string): Promise<PixOrder | null> {
  const order = await getPixOrder(id);
  if (!order) return null;
  if (order.status === "confirmado") return order;

  const updated: PixOrder = {
    ...order,
    status: "confirmado",
    confirmedAt: new Date().toISOString(),
  };
  await getRedis().hset(ORDERS_KEY, { [id]: updated });
  return updated;
}
