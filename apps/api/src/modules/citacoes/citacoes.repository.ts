import { prisma } from "../../db/prisma.js";
import type { Citacao, CitacaoCreate, CitacaoUpdate } from "@rf/shared";

export async function listarCitacoes(): Promise<Citacao[]> {
  return prisma.citacao.findMany({ orderBy: { id: "desc" } });
}
export async function criarCitacao(data: CitacaoCreate): Promise<Citacao> {
  return prisma.citacao.create({ data });
}
export async function atualizarCitacao(id: number, data: CitacaoUpdate): Promise<Citacao> {
  return prisma.citacao.update({ where: { id }, data });
}
export async function removerCitacao(id: number): Promise<void> {
  await prisma.citacao.delete({ where: { id } });
}
