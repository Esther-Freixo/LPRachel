import { describe, it, expect, afterAll } from "vitest";
import { buildApp } from "./app.js";

const app = await buildApp();

afterAll(async () => {
  await app.close();
});

describe("GET /api/health", () => {
  it("responde 200 com status ok", async () => {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});
