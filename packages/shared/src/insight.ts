import { z } from "zod";

export const insightSchema = z.object({
  id: z.number().int(),
  data: z.string().nullable(),
  titulo: z.string(),
  texto: z.string(),
  linkOriginal: z.string().nullable(),
  mediaUrl: z.string().nullable(),
});

export type Insight = z.infer<typeof insightSchema>;
