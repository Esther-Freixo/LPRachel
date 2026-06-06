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
