"use client";

import { useState } from "react";

export default function CopyPixCodeButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard indisponível (contexto não-seguro/navegador antigo) — sem ação.
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-4 w-full rounded-full bg-secondary py-2.5 text-sm uppercase tracking-wide text-primary transition-colors hover:bg-accent"
    >
      {copied ? "Código copiado!" : "Copiar código Pix"}
    </button>
  );
}
