import { z } from "zod";

export const rsvpSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Informe seu nome completo")
    .max(120, "Nome muito longo"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 10 || value.length === 11, {
      message: "Informe um número de celular válido com DDD",
    }),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;
