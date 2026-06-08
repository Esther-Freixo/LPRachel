import { prisma } from "../../db/prisma.js";
import type { Publicacao, PublicacaoCreate, PublicacaoUpdate } from "@rf/shared";

export async function listarPublicacoes(): Promise<Publicacao[]> {
  return prisma.publicacao.findMany({ orderBy: { id: "desc" } });
}
export async function criarPublicacao(data: PublicacaoCreate): Promise<Publicacao> {
  return prisma.publicacao.create({ data });
}
export async function atualizarPublicacao(id: number, data: PublicacaoUpdate): Promise<Publicacao> {
  return prisma.publicacao.update({ where: { id }, data });
}
export async function removerPublicacao(id: number): Promise<void> {
  await prisma.publicacao.delete({ where: { id } });
}
