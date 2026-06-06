import { prisma } from "../../db/prisma.js";
import type { Publicacao } from "@rf/shared";

export async function listarPublicacoes(): Promise<Publicacao[]> {
  return prisma.publicacao.findMany({ orderBy: { id: "desc" } });
}
