import { prisma } from "../../db/prisma.js";
import type { Midia } from "@rf/shared";

export async function listarMidias(): Promise<Midia[]> {
  return prisma.midia.findMany({ orderBy: { ordem: "asc" } });
}
