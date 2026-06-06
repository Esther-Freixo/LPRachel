import { prisma } from "../../db/prisma.js";
import type { Evento } from "@rf/shared";

export async function listarAgenda(): Promise<Evento[]> {
  return prisma.evento.findMany({ orderBy: { id: "desc" } });
}
