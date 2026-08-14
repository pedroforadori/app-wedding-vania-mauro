import { z } from "zod";

export const rsvpSchema = z.object({
  guests: z
    .array(
      z
        .string()
        .trim()
        .min(3, "Informe o nome completo")
        .max(120, "Nome muito longo")
    )
    .min(1, "Informe ao menos um nome")
    .max(30, "Número de convidados excedido"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value.length === 10 || value.length === 11, {
      message: "Informe um número de celular válido com DDD",
    }),
});

export type RsvpFormValues = z.infer<typeof rsvpSchema>;

export const giftGuestSchema = z.object({
  guestName: z
    .string()
    .trim()
    .min(3, "Informe seu nome")
    .max(120, "Nome muito longo"),
  guestMessage: z
    .string()
    .trim()
    .max(300, "Mensagem muito longa (máx. 300 caracteres)")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : undefined)),
});

export type GiftGuestFormValues = z.infer<typeof giftGuestSchema>;
