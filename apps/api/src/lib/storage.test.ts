import { describe, it, expect, beforeAll } from "vitest";
import { garantirBucket, enviarArquivo } from "./storage.js";

describe("storage MinIO", () => {
  beforeAll(async () => {
    await garantirBucket();
  });

  it("envia um arquivo e a URL pública é acessível", async () => {
    const conteudo = Buffer.from("ola mundo");
    const url = await enviarArquivo(`teste-${Date.now()}.txt`, conteudo, "text/plain");
    expect(url).toContain("http");
    const res = await fetch(url);
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("ola mundo");
  });
});
