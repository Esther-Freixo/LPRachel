import { z } from "zod";

export const publicacaoSchema = z.object({
  id: z.number().int(),
  tipo: z.string(),
  titulo: z.string(),
  meta: z.string().nullable(),
  resumo: z.string().nullable(),
  link: z.string().nullable(),
});

export type Publicacao = z.infer<typeof publicacaoSchema>;
