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
    </footer>
  );
}
