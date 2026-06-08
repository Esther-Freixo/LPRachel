import type { Timeline, Publicacao, Evento, Insight, Citacao, Midia } from "@rf/shared";

const API = "/api";

function authHeaders(): Record<string, string> {
  const token = sessionStorage.getItem("rf_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return (await res.json()) as T;
}
async function post<T>(path: string, body: unknown, auth = false): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(auth ? authHeaders() : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} -> ${res.status}`);
  return (await res.json()) as T;
}
async function put<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} -> ${res.status}`);
  return (await res.json()) as T;
}
async function del(path: string): Promise<void> {
  const res = await fetch(`${API}${path}`, { method: "DELETE", headers: authHeaders() });
  if (!res.ok) throw new Error(`DELETE ${path} -> ${res.status}`);
}

// Publicações
export const getPublicacoes = (): Promise<Publicacao[]> => get<Publicacao[]>("/publicacoes");
export const addPublicacao = (obj: unknown): Promise<Publicacao> => post<Publicacao>("/publicacoes", obj, true);
export const updatePublicacao = (id: number, obj: unknown): Promise<Publicacao> => put<Publicacao>(`/publicacoes/${id}`, obj);
export const deletePublicacao = (id: number): Promise<void> => del(`/publicacoes/${id}`);

// Agenda
export const getAgenda = (): Promise<Evento[]> => get<Evento[]>("/agenda");
export const addEvento = (obj: unknown): Promise<Evento> => post<Evento>("/agenda", obj, true);
export const updateEvento = (id: number, obj: unknown): Promise<Evento> => put<Evento>(`/agenda/${id}`, obj);
export const deleteEvento = (id: number): Promise<void> => del(`/agenda/${id}`);

// Timeline
export const getTimeline = (): Promise<Timeline[]> => get<Timeline[]>("/timeline");
export const addTimeline = (obj: unknown): Promise<Timeline> => post<Timeline>("/timeline", obj, true);
export const updateTimeline = (id: number, obj: unknown): Promise<Timeline> => put<Timeline>(`/timeline/${id}`, obj);
export const deleteTimeline = (id: number): Promise<void> => del(`/timeline/${id}`);

// Insights
export const getInsights = (): Promise<Insight[]> => get<Insight[]>("/insights");
export const addInsight = (obj: unknown): Promise<Insight> => post<Insight>("/insights", obj, true);
export const updateInsight = (id: number, obj: unknown): Promise<Insight> => put<Insight>(`/insights/${id}`, obj);
export const deleteInsight = (id: number): Promise<void> => del(`/insights/${id}`);

// Citações
export const getCitacoes = (): Promise<Citacao[]> => get<Citacao[]>("/citacoes");
export const addCitacao = (obj: unknown): Promise<Citacao> => post<Citacao>("/citacoes", obj, true);
export const updateCitacao = (id: number, obj: unknown): Promise<Citacao> => put<Citacao>(`/citacoes/${id}`, obj);
export const deleteCitacao = (id: number): Promise<void> => del(`/citacoes/${id}`);

// Mídias
export const getMidias = (): Promise<Midia[]> => get<Midia[]>("/midias");
export const addMidia = (obj: unknown): Promise<Midia> => post<Midia>("/midias", obj, true);
export const updateMidia = (id: number, obj: unknown): Promise<Midia> => put<Midia>(`/midias/${id}`, obj);
export const deleteMidia = (id: number): Promise<void> => del(`/midias/${id}`);
export const getMidiaOembed = (url: string): Promise<{ titulo: string | null; autor: string | null }> =>
  get<{ titulo: string | null; autor: string | null }>(`/midias/oembed?url=${encodeURIComponent(url)}`);

// Contato (público)
export const sendContato = (obj: unknown): Promise<unknown> => post("/contatos", obj);

// Auth
export async function login(email: string, senha: string): Promise<boolean> {
  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token: string };
    sessionStorage.setItem("rf_token", data.token);
    sessionStorage.setItem("rf_auth", "1");
    return true;
  } catch {
    return false;
  }
}
export function logout(): void {
  sessionStorage.removeItem("rf_token");
  sessionStorage.removeItem("rf_auth");
}
export function isLoggedIn(): boolean {
  return !!sessionStorage.getItem("rf_auth");
}
