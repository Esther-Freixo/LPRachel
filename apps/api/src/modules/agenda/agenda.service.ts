import type { Evento } from "@rf/shared";
import * as repo from "./agenda.repository.js";

export async function listarAgenda(): Promise<Evento[]> {
  return repo.listarAgenda();
}
