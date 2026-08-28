import { COUPLE_NAMES, WEDDING_DATE_ISO } from "@/lib/constants";
import { formatWeddingDate } from "@/lib/format";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-10 text-center">
      <p className="font-script text-3xl text-secondary">{COUPLE_NAMES}</p>
      <p className="mt-2 text-sm uppercase tracking-wide text-muted-foreground">
        {formatWeddingDate(WEDDING_DATE_ISO)}
      </p>
      <p className="mx-auto mt-4 max-w-md px-6 text-sm text-muted-foreground">
        Obrigado por fazer parte da nossa história. Mal podemos esperar para
        celebrar esse dia com você.
      </p>
      <a
        href="https://wa.me/5511981024517"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-block text-xs text-muted-foreground underline hover:text-secondary"
      >
        Desenvolvido por Penne · Faça o site do seu casamento conosco
      </a>
    </footer>
  );
}
