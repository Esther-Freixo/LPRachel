import type { Citacao, CitacaoCreate, CitacaoUpdate } from "@rf/shared";
import * as repo from "./citacoes.repository.js";

export async function listarCitacoes(): Promise<Citacao[]> {
  return repo.listarCitacoes();
}
export async function criarCitacao(data: CitacaoCreate): Promise<Citacao> {
  return repo.criarCitacao(data);
}
export async function atualizarCitacao(id: number, data: CitacaoUpdate): Promise<Citacao> {
  return repo.atualizarCitacao(id, data);
}
export async function removerCitacao(id: number): Promise<void> {
  return repo.removerCitacao(id);
}
