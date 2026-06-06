import { prisma } from "../../db/prisma.js";
import type { Evento, EventoCreate, EventoUpdate } from "@rf/shared";

export async function listarAgenda(): Promise<Evento[]> {
  return prisma.evento.findMany({ orderBy: { id: "desc" } });
}
export async function criarEvento(data: EventoCreate): Promise<Evento> {
  return prisma.evento.create({ data });
}
export async function atualizarEvento(id: number, data: EventoUpdate): Promise<Evento> {
  return prisma.evento.update({ where: { id }, data });
}
export async function removerEvento(id: number): Promise<void> {
  await prisma.evento.delete({ where: { id } });
}
