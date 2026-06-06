import type { Timeline, TimelineCreate, TimelineUpdate } from "@rf/shared";
import * as repo from "./timeline.repository.js";

export async function listarTimeline(): Promise<Timeline[]> {
  return repo.listarTimeline();
}
export async function criarTimeline(data: TimelineCreate): Promise<Timeline> {
  return repo.criarTimeline(data);
}
export async function atualizarTimeline(id: number, data: TimelineUpdate): Promise<Timeline> {
  return repo.atualizarTimeline(id, data);
}
export async function removerTimeline(id: number): Promise<void> {
  return repo.removerTimeline(id);
}
