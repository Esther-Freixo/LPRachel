import type { Insight, InsightCreate, InsightUpdate } from "@rf/shared";
import * as repo from "./insights.repository.js";

export async function listarInsights(): Promise<Insight[]> {
  return repo.listarInsights();
}
export async function criarInsight(data: InsightCreate): Promise<Insight> {
  return repo.criarInsight(data);
}
export async function atualizarInsight(id: number, data: InsightUpdate): Promise<Insight> {
  return repo.atualizarInsight(id, data);
}
export async function removerInsight(id: number): Promise<void> {
  return repo.removerInsight(id);
}
