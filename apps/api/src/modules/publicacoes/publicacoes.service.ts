import type { Publicacao } from "@rf/shared";
import * as repo from "./publicacoes.repository.js";

export async function listarPublicacoes(): Promise<Publicacao[]> {
  return repo.listarPublicacoes();
}
