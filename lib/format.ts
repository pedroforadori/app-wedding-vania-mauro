const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function formatBRL(cents: number): string {
  return currencyFormatter.format(cents / 100);
}

const WEDDING_TIME_ZONE = "America/Sao_Paulo";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: WEDDING_TIME_ZONE,
});

export function formatWeddingDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate));
}

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: WEDDING_TIME_ZONE,
});

export function formatWeddingTime(isoDate: string): string {
  const parts = timeFormatter.formatToParts(new Date(isoDate));
  const hours = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  const minutes = parts.find((part) => part.type === "minute")?.value ?? "00";
  return minutes === "00" ? `${hours}h` : `${hours}h${minutes}`;
}
