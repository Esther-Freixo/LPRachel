import { z } from "zod";

// DTO público de um marco da trajetória (domínio pt-BR).
export const timelineSchema = z.object({
  id: z.number().int(),
  ano: z.string(),
  titulo: z.string(),
  descricao: z.string(),
});

export type Timeline = z.infer<typeof timelineSchema>;
