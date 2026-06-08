import type { Midia, MidiaCreate, MidiaUpdate } from "@rf/shared";
import * as repo from "./midias.repository.js";

export async function listarMidias(): Promise<Midia[]> {
  return repo.listarMidias();
}
export async function criarMidia(data: MidiaCreate): Promise<Midia> {
  return repo.criarMidia(data);
}
export async function atualizarMidia(id: number, data: MidiaUpdate): Promise<Midia> {
  return repo.atualizarMidia(id, data);
}
export async function removerMidia(id: number): Promise<void> {
  return repo.removerMidia(id);
}

export interface Oembed {
  titulo: string | null;
  autor: string | null;
}

// Autofill de título/autor a partir de uma URL (YouTube/Spotify) via noembed.com.
export async function buscarOembed(url: string): Promise<Oembed> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return { titulo: null, autor: null };
    const data = (await res.json()) as { title?: string; author_name?: string };
    return { titulo: data.title ?? null, autor: data.author_name ?? null };
  } catch {
    return { titulo: null, autor: null };
  }
}
