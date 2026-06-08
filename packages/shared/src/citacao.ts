import { z } from "zod";

export const citacaoSchema = z.object({
  id: z.number().int(),
  texto: z.string(),
  bg: z.string().nullable(),
  textCol: z.string().nullable(),
  border: z.string().nullable(),
  quoteMark: z.string().nullable(),
});

export type Citacao = z.infer<typeof citacaoSchema>;

export const citacaoCreateSchema = z.object({
  texto: z.string(),
  bg: z.string().nullish(),
  textCol: z.string().nullish(),
  border: z.string().nullish(),
  quoteMark: z.string().nullish(),
});
export const citacaoUpdateSchema = citacaoCreateSchema.partial();
export type CitacaoCreate = z.infer<typeof citacaoCreateSchema>;
export type CitacaoUpdate = z.infer<typeof citacaoUpdateSchema>;
