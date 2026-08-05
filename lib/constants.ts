export const NAV_ITEMS = [
  { label: "Home", href: "#home" },
  { label: "Confirme sua Presença", href: "#confirme-sua-presenca" },
  { label: "Lista de Presentes", href: "#lista-de-presentes" },
  { label: "Galeria", href: "#galeria" },
  { label: "Sobre a Festa", href: "#sobre-a-festa" },
] as const;

export const COUPLE_NAMES = process.env.NEXT_PUBLIC_COUPLE_NAMES ?? "Vania & Mauro";

export const WEDDING_DATE_ISO =
  process.env.NEXT_PUBLIC_WEDDING_DATE ?? "2026-10-17T16:00:00-03:00";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const WEDDING_VENUE_NAME = "Buffet Splash";

export const WEDDING_VENUE_ADDRESS =
  "Rua Nova Jerusalem, 38 — Jardim Analia Franco";

export const WEDDING_VENUE_MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent(
    "Buffet Splash, Rua Nova Jerusalem, 38, Jardim Analia Franco, São Paulo"
  );

export const WEDDING_DRESS_CODE = "Sport Fino";
