import { prisma } from "../../db/prisma.js";
import type { Insight } from "@rf/shared";

export async function listarInsights(): Promise<Insight[]> {
  return prisma.insight.findMany({ orderBy: { id: "desc" } });
}
