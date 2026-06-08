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

export const insightCreateSchema = z.object({
  titulo: z.string(),
  texto: z.string(),
  data: z.string().nullish(),
  linkOriginal: z.string().nullish(),
  mediaUrl: z.string().nullish(),
});
export const insightUpdateSchema = insightCreateSchema.partial();
export type InsightCreate = z.infer<typeof insightCreateSchema>;
export type InsightUpdate = z.infer<typeof insightUpdateSchema>;
