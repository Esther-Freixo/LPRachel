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

export const eventoCreateSchema = z.object({
  titulo: z.string(),
  dia: z.string().nullish(),
  mes: z.string().nullish(),
  ano: z.string().nullish(),
  tipo: z.string().nullish(),
  local: z.string().nullish(),
  descricao: z.string().nullish(),
  link: z.string().nullish(),
  status: z.string().nullish(),
});
export const eventoUpdateSchema = eventoCreateSchema.partial();
export type EventoCreate = z.infer<typeof eventoCreateSchema>;
export type EventoUpdate = z.infer<typeof eventoUpdateSchema>;
