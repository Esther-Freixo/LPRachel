import type { Midia } from "@rf/shared";
import * as repo from "./midias.repository.js";

export async function listarMidias(): Promise<Midia[]> {
  return repo.listarMidias();
}
