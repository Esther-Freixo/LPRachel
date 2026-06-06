import { prisma } from "../../db/prisma.js";
import type { Midia, MidiaCreate, MidiaUpdate } from "@rf/shared";

export async function listarMidias(): Promise<Midia[]> {
  return prisma.midia.findMany({ orderBy: { ordem: "asc" } });
}
export async function criarMidia(data: MidiaCreate): Promise<Midia> {
  return prisma.midia.create({ data });
}
export async function atualizarMidia(id: number, data: MidiaUpdate): Promise<Midia> {
  return prisma.midia.update({ where: { id }, data });
}
export async function removerMidia(id: number): Promise<void> {
  await prisma.midia.delete({ where: { id } });
}
