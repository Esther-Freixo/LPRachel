import type { Publicacao, PublicacaoCreate, PublicacaoUpdate } from "@rf/shared";
import * as repo from "./publicacoes.repository.js";

export async function listarPublicacoes(): Promise<Publicacao[]> {
  return repo.listarPublicacoes();
}
export async function criarPublicacao(data: PublicacaoCreate): Promise<Publicacao> {
  return repo.criarPublicacao(data);
}
export async function atualizarPublicacao(id: number, data: PublicacaoUpdate): Promise<Publicacao> {
  return repo.atualizarPublicacao(id, data);
}
export async function removerPublicacao(id: number): Promise<void> {
  return repo.removerPublicacao(id);
}
