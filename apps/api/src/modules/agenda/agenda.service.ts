import type { Evento, EventoCreate, EventoUpdate } from "@rf/shared";
import * as repo from "./agenda.repository.js";

export async function listarAgenda(): Promise<Evento[]> {
  return repo.listarAgenda();
}
export async function criarEvento(data: EventoCreate): Promise<Evento> {
  return repo.criarEvento(data);
}
export async function atualizarEvento(id: number, data: EventoUpdate): Promise<Evento> {
  return repo.atualizarEvento(id, data);
}
export async function removerEvento(id: number): Promise<void> {
  return repo.removerEvento(id);
}
