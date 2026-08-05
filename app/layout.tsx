import type { Metadata } from "next";
import { Quicksand, Parisienne } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
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
    <html
      lang="pt-BR"
      className={`${quicksand.variable} ${parisienne.variable}`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
