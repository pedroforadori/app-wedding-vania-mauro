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

export default function RsvpForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; phone?: string }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const isFullNameValid = fullName.trim().split(/\s+/).filter(Boolean).length >= 2;
  const phoneDigits = phone.replace(/\D/g, "");
  const isPhoneValid = phoneDigits.length === 10 || phoneDigits.length === 11;
  const canSubmit = isFullNameValid && isPhoneValid;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage(null);

    const parsed = rsvpSchema.safeParse({ fullName, phone });
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({ fullName: flat.fullName?.[0], phone: flat.phone?.[0] });
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
          fullName: data.fieldErrors?.fullName?.[0],
          phone: data.fieldErrors?.phone?.[0],
        });
        setMessage(data.error ?? "Não foi possível confirmar sua presença.");
        return;
      }

      setStatus("success");
      setMessage("Presença confirmada! Mal podemos esperar para celebrar com você.");
      setFullName("");
      setPhone("");
    } catch {
      setStatus("error");
      setMessage("Não foi possível confirmar sua presença. Tente novamente.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-10 max-w-md space-y-5">
      <div>
        <label htmlFor="fullName" className="text-sm uppercase tracking-wide text-secondary">
          Nome completo
        </label>
        <input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-secondary outline-none focus:border-accent"
          placeholder="Seu nome completo"
        />
        {fieldErrors.fullName && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.fullName}</p>
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
