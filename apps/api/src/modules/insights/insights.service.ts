import type { Insight } from "@rf/shared";
import * as repo from "./insights.repository.js";

export async function listarInsights(): Promise<Insight[]> {
  return repo.listarInsights();
}
