import { z } from "zod";

export const contatoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  email: z.string(),
  assunto: z.string().nullable(),
  mensagem: z.string(),
  createdAt: z.string(),
});

export const contatoCreateSchema = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
  assunto: z.string().nullish(),
  mensagem: z.string().min(1),
});

export type Contato = z.infer<typeof contatoSchema>;
export type ContatoCreate = z.infer<typeof contatoCreateSchema>;
