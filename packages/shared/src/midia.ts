import { z } from "zod";

export const midiaSchema = z.object({
  id: z.number().int(),
  titulo: z.string(),
  tipo: z.string(),
  url: z.string(),
  descricao: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  plataforma: z.string().nullable(),
  ordem: z.number().int().nullable(),
});

export type Midia = z.infer<typeof midiaSchema>;

export const midiaCreateSchema = z.object({
  titulo: z.string(),
  tipo: z.string(),
  url: z.string(),
  descricao: z.string().nullish(),
  thumbnailUrl: z.string().nullish(),
  plataforma: z.string().nullish(),
  ordem: z.number().int().nullish(),
});
export const midiaUpdateSchema = midiaCreateSchema.partial();
export type MidiaCreate = z.infer<typeof midiaCreateSchema>;
export type MidiaUpdate = z.infer<typeof midiaUpdateSchema>;
