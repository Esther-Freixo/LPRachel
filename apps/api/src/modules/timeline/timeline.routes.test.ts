import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../app.js";
import { testPrisma, resetTimeline } from "../../test/db.js";

const app = await buildApp();

beforeAll(async () => {
  await resetTimeline();
  await testPrisma.timeline.createMany({
    data: [
      { ano: "2024", titulo: "Conselheira CARF", descricao: "Julgamento de recursos." },
      { ano: "2019", titulo: "Subsecretária", descricao: "Competitividade ES." },
    ],
  });
});

afterAll(async () => {
  await testPrisma.$disconnect();
  await app.close();
});

describe("GET /api/timeline", () => {
  it("retorna a lista de marcos em ordem decrescente de id", async () => {
    const res = await app.inject({ method: "GET", url: "/api/timeline" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Array<{ titulo: string }>;
    expect(body).toHaveLength(2);
    expect(body[0]?.titulo).toBe("Subsecretária"); // último inserido, id maior
  });
});
