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

export const publicacaoCreateSchema = z.object({
  tipo: z.string(),
  titulo: z.string(),
  meta: z.string().nullish(),
  resumo: z.string().nullish(),
  link: z.string().nullish(),
});
export const publicacaoUpdateSchema = publicacaoCreateSchema.partial();
export type PublicacaoCreate = z.infer<typeof publicacaoCreateSchema>;
export type PublicacaoUpdate = z.infer<typeof publicacaoUpdateSchema>;
