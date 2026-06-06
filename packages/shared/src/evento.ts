import { z } from "zod";

export const eventoSchema = z.object({
  id: z.number().int(),
  dia: z.string().nullable(),
  mes: z.string().nullable(),
  ano: z.string().nullable(),
  tipo: z.string().nullable(),
  titulo: z.string(),
  local: z.string().nullable(),
  descricao: z.string().nullable(),
  link: z.string().nullable(),
  status: z.string().nullable(),
});

export type Evento = z.infer<typeof eventoSchema>;
