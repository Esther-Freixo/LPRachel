import { describe, it, expect, beforeAll, afterAll } from "vitest";
import argon2 from "argon2";
import { buildApp } from "../app.js";
import { testPrisma, resetTudo } from "../test/db.js";

const app = await buildApp();
let token = "";

beforeAll(async () => {
  await resetTudo();
  await testPrisma.usuario.deleteMany();
  await testPrisma.usuario.create({
    data: { email: "a@b.com", senhaHash: await argon2.hash("s123456"), papel: "admin" },
  });
  const r = await app.inject({ method: "POST", url: "/api/auth/login", payload: { email: "a@b.com", senha: "s123456" } });
  token = (r.json() as { token: string }).token;
});

afterAll(async () => {
  await testPrisma.$disconnect();
  await app.close();
});

const bearer = (): { authorization: string } => ({ authorization: `Bearer ${token}` });

describe("CRUD protegido", () => {
  it("POST sem token → 401", async () => {
    const res = await app.inject({ method: "POST", url: "/api/publicacoes", payload: { tipo: "artigo", titulo: "X" } });
    expect(res.statusCode).toBe(401);
  });

  it("ciclo create→update→delete com token", async () => {
    const c = await app.inject({ method: "POST", url: "/api/publicacoes", headers: bearer(), payload: { tipo: "artigo", titulo: "Orig" } });
    expect(c.statusCode).toBe(201);
    const id = (c.json() as { id: number }).id;

    const u = await app.inject({ method: "PUT", url: `/api/publicacoes/${id}`, headers: bearer(), payload: { titulo: "Editado" } });
    expect(u.statusCode).toBe(200);
    expect((u.json() as { titulo: string }).titulo).toBe("Editado");

    const d = await app.inject({ method: "DELETE", url: `/api/publicacoes/${id}`, headers: bearer() });
    expect(d.statusCode).toBe(200);
  });

  it("POST /api/contatos é público (201)", async () => {
    const res = await app.inject({ method: "POST", url: "/api/contatos", payload: { nome: "N", email: "n@e.com", mensagem: "oi" } });
    expect(res.statusCode).toBe(201);
  });

  it("GET /api/contatos exige token (401 sem)", async () => {
    const res = await app.inject({ method: "GET", url: "/api/contatos" });
    expect(res.statusCode).toBe(401);
  });
});
