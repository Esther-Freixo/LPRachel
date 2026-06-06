import type { Midia, MidiaCreate, MidiaUpdate } from "@rf/shared";
import * as repo from "./midias.repository.js";

export async function listarMidias(): Promise<Midia[]> {
  return repo.listarMidias();
}
export async function criarMidia(data: MidiaCreate): Promise<Midia> {
  return repo.criarMidia(data);
}
export async function atualizarMidia(id: number, data: MidiaUpdate): Promise<Midia> {
  return repo.atualizarMidia(id, data);
}
export async function removerMidia(id: number): Promise<void> {
  return repo.removerMidia(id);
}
