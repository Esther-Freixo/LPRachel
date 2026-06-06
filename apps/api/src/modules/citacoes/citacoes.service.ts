import type { Citacao } from "@rf/shared";
import * as repo from "./citacoes.repository.js";

export async function listarCitacoes(): Promise<Citacao[]> {
  return repo.listarCitacoes();
}
