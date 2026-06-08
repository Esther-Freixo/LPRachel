import { prisma } from "../../db/prisma.js";
import type { Contato as ContatoRow } from "@prisma/client";
import type { ContatoCreate } from "@rf/shared";

export async function criarContato(data: ContatoCreate): Promise<ContatoRow> {
  return prisma.contato.create({ data });
}
export async function listarContatos(): Promise<ContatoRow[]> {
  return prisma.contato.findMany({ orderBy: { id: "desc" } });
}
export async function removerContato(id: number): Promise<void> {
  await prisma.contato.delete({ where: { id } });
}
