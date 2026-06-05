import type { Timeline } from "@rf/shared";
import * as repo from "./timeline.repository.js";

// Por ora é passthrough; a camada existe para abrigar regra futura sem mexer na rota.
export async function listarTimeline(): Promise<Timeline[]> {
  return repo.listarTimeline();
}
