import { describe, it, expect, vi, afterEach } from "vitest";
import { buscarOembed } from "./midias.service.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("buscarOembed", () => {
  it("mapeia title/author do noembed", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ title: "Meu Vídeo", author_name: "Canal" }), { status: 200 })),
    );
    const r = await buscarOembed("https://youtu.be/abc");
    expect(r.titulo).toBe("Meu Vídeo");
    expect(r.autor).toBe("Canal");
  });

  it("retorna nulls quando o noembed falha", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("erro", { status: 500 })));
    const r = await buscarOembed("https://youtu.be/abc");
    expect(r.titulo).toBeNull();
  });
});
