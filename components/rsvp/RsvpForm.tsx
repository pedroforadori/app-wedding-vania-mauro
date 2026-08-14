"use client";

import { useState, type FormEvent } from "react";
import { rsvpSchema } from "@/lib/validations";

type Status = "idle" | "submitting" | "success" | "error";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";

  const ddd = digits.slice(0, 2);
  if (digits.length <= 2) return `(${ddd}`;

  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;

  const prefixLength = digits.length > 10 ? 5 : 4;
  return `(${ddd}) ${rest.slice(0, prefixLength)}-${rest.slice(prefixLength)}`;
}

const MAX_GUESTS = 30;

function isValidGuestName(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).length >= 2;
}

export default function RsvpForm() {
  const [guestNames, setGuestNames] = useState<string[]>([""]);
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ guests?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const trimmedNames = guestNames.map((name) => name.trim());
  const isPrimaryNameValid = isValidGuestName(trimmedNames[0] ?? "");
  const areExtraNamesValid = trimmedNames
    .slice(1)
    .every((name) => name === "" || isValidGuestName(name));
  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 10 || phoneDigits.length === 11;
  const canSubmit = isPrimaryNameValid && areExtraNamesValid && isPhoneValid;

  function updateGuestName(index: number, value: string) {
    setGuestNames((prev) => prev.map((name, i) => (i === index ? value : name)));
  }

  function addGuestName() {
    setGuestNames((prev) => (prev.length >= MAX_GUESTS ? prev : [...prev, ""]));
  }

  function removeGuestName(index: number) {
    setGuestNames((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage(null);

    const namesToSend = trimmedNames.filter(Boolean);
    const parsed = rsvpSchema.safeParse({ guests: namesToSend, phone });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({ guests: flat.guests?.[0], phone: flat.phone?.[0] });
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = await response.json();

      if (response.status === 409) {
        setStatus("error");
        setMessage(data.error ?? "Este número de celular já confirmou presença.");
        return;
      }

      if (!response.ok) {
        setStatus("error");
        setFieldErrors({
          guests: data.fieldErrors?.guests?.[0],
          phone: data.fieldErrors?.phone?.[0],
        });
        setMessage(data.error ?? "Não foi possível confirmar sua presença.");
        return;
      }

      setStatus("success");
      setMessage(
        namesToSend.length > 1
          ? `Presença confirmada para ${namesToSend.length} convidados! Mal podemos esperar para celebrar com vocês.`
          : "Presença confirmada! Mal podemos esperar para celebrar com você."
      );
      setGuestNames([""]);
      setPhone("");
    } catch {
      setStatus("error");
      setMessage("Não foi possível confirmar sua presença. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-5">
      <div className="space-y-3">
        <label htmlFor="guestName-0" className="text-sm uppercase tracking-wide text-secondary">
          Nome completo
        </label>

        {guestNames.map((name, index) => (
          <div key={index} className="relative">
            <input
              id={`guestName-${index}`}
              type="text"
              value={name}
              onChange={(event) => updateGuestName(index, event.target.value)}
              aria-label={index === 0 ? undefined : `Nome completo do convidado ${index + 1}`}
              className={`w-full rounded-lg border border-border bg-white py-3 pl-4 text-secondary outline-none focus:border-accent ${
                index > 0 ? "pr-11" : "pr-4"
              }`}
              placeholder={index === 0 ? "Seu nome completo" : "Nome completo do acompanhante"}
            />
            {index > 0 && (
              <button
                type="button"
                onClick={() => removeGuestName(index)}
                aria-label="Remover convidado"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:text-red-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addGuestName}
          className="text-sm font-medium text-accent transition-colors hover:text-secondary"
        >
          + Adicionar convidado
        </button>

        {fieldErrors.guests && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.guests}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="text-sm uppercase tracking-wide text-secondary">
          Número de celular
        </label>
        <input
          id="phone"
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(event) => setPhone(formatPhone(event.target.value))}
          maxLength={16}
          className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-secondary outline-none focus:border-accent"
          placeholder="(11) 91234-5678"
        />
        {fieldErrors.phone && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "submitting" || !canSubmit}
        className="w-full rounded-full bg-secondary py-3 text-sm uppercase tracking-wide text-primary transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Enviando..." : "Confirmar presença"}
      </button>

      {message && (
        <p
          className={`text-center text-sm ${
            status === "success" ? "text-green-700" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
