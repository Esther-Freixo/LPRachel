import { prisma } from "../../db/prisma.js";
import type { Insight, InsightCreate, InsightUpdate } from "@rf/shared";

export async function listarInsights(): Promise<Insight[]> {
  return prisma.insight.findMany({ orderBy: { id: "desc" } });
}
export async function criarInsight(data: InsightCreate): Promise<Insight> {
  return prisma.insight.create({ data });
}
export async function atualizarInsight(id: number, data: InsightUpdate): Promise<Insight> {
  return prisma.insight.update({ where: { id }, data });
}
export async function removerInsight(id: number): Promise<void> {
  await prisma.insight.delete({ where: { id } });
}
