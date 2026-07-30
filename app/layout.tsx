import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Vania & Mauro | Nosso Casamento",
  description:
    "Acompanhe a nossa história, confirme sua presença e faça parte deste novo capítulo com a gente.",
  openGraph: {
    title: "Vania & Mauro | Nosso Casamento",
    description:
      "Acompanhe a nossa história, confirme sua presença e faça parte deste novo capítulo com a gente.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
