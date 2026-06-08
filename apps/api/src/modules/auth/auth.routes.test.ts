import { describe, it, expect, beforeAll, afterAll } from "vitest";
import argon2 from "argon2";
import { buildApp } from "../../app.js";
import { testPrisma } from "../../test/db.js";

const app = await buildApp();

beforeAll(async () => {
  await testPrisma.usuario.deleteMany();
  await testPrisma.usuario.create({
    data: { email: "admin@teste.com", senhaHash: await argon2.hash("senha123"), papel: "admin" },
  });
});

afterAll(async () => {
  await testPrisma.$disconnect();
  await app.close();
});

describe("POST /api/auth/login", () => {
  it("retorna token com credenciais válidas", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "admin@teste.com", senha: "senha123" },
    });
    expect(res.statusCode).toBe(200);
    expect(typeof (res.json() as { token: string }).token).toBe("string");
  });

  it("retorna 401 com senha errada", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "admin@teste.com", senha: "errada" },
    });
    expect(res.statusCode).toBe(401);
  });
});
