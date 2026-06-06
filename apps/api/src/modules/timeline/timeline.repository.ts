import { prisma } from "../../db/prisma.js";
import type { Timeline, TimelineCreate, TimelineUpdate } from "@rf/shared";

export async function listarTimeline(): Promise<Timeline[]> {
  return prisma.timeline.findMany({ orderBy: { id: "desc" } });
}
export async function criarTimeline(data: TimelineCreate): Promise<Timeline> {
  return prisma.timeline.create({ data });
}
export async function atualizarTimeline(id: number, data: TimelineUpdate): Promise<Timeline> {
  return prisma.timeline.update({ where: { id }, data });
}
export async function removerTimeline(id: number): Promise<void> {
  await prisma.timeline.delete({ where: { id } });
}
