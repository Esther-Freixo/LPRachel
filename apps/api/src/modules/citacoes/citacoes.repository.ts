import { prisma } from "../../db/prisma.js";
import type { Citacao } from "@rf/shared";

export async function listarCitacoes(): Promise<Citacao[]> {
  return prisma.citacao.findMany({ orderBy: { id: "desc" } });
}
