import { prisma } from "../../db/prisma.js";
import type { Timeline } from "@rf/shared";

export async function listarTimeline(): Promise<Timeline[]> {
  return prisma.timeline.findMany({ orderBy: { id: "desc" } });
}
