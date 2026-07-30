export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Lista de Presentes", href: "#lista-de-presentes" },
  { label: "Confirme sua Presença", href: "#confirme-sua-presenca" },
  { label: "Galeria", href: "#galeria" },
] as const;

export const COUPLE_NAMES = process.env.NEXT_PUBLIC_COUPLE_NAMES ?? "Vania & Mauro";

export const WEDDING_DATE_ISO =
  process.env.NEXT_PUBLIC_WEDDING_DATE ?? "2026-10-17T16:00:00-03:00";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
