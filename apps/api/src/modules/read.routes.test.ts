import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../app.js";
import { testPrisma, resetTudo } from "../test/db.js";

const app = await buildApp();

beforeAll(async () => {
  await resetTudo();
  await testPrisma.publicacao.create({ data: { tipo: "artigo", titulo: "P1" } });
  await testPrisma.evento.create({ data: { titulo: "E1", status: "proximo" } });
  await testPrisma.insight.create({ data: { titulo: "I1", texto: "txt" } });
  await testPrisma.citacao.create({ data: { texto: "C1" } });
  await testPrisma.midia.create({ data: { titulo: "M1", tipo: "video", url: "http://x", ordem: 1 } });
});

afterAll(async () => {
  await testPrisma.$disconnect();
  await app.close();
});

describe("rotas de leitura", () => {
  for (const ep of ["publicacoes", "agenda", "insights", "citacoes", "midias"]) {
    it(`GET /api/${ep} retorna 200 com 1 item`, async () => {
      const res = await app.inject({ method: "GET", url: `/api/${ep}` });
      expect(res.statusCode).toBe(200);
      expect((res.json() as unknown[]).length).toBe(1);
    });
  }
});
