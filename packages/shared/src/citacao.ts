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
