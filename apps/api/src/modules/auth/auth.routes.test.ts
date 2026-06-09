import { describe, it, expect, beforeAll, afterAll } from "vitest";
import argon2 from "argon2";
import { buildApp } from "../../app.js";
import { testPrisma } from "../../test/db.js";
import * as service from "./auth.service.js";

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

describe("recuperação de senha", () => {
  it("esqueci-senha responde 200 mesmo para e-mail inexistente (não vaza)", async () => {
    for (const email of ["admin@teste.com", "naoexiste@teste.com"]) {
      const res = await app.inject({ method: "POST", url: "/api/auth/esqueci-senha", payload: { email } });
      expect(res.statusCode).toBe(200);
      expect((res.json() as { ok: boolean }).ok).toBe(true);
    }
  });

  it("redefinir-senha rejeita token inválido (400)", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/redefinir-senha",
      payload: { token: "abc.def", senha: "novasenha123" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("token válido redefine a senha e é single-use", async () => {
    const user = await testPrisma.usuario.findUnique({ where: { email: "admin@teste.com" } });
    const token = service.gerarTokenReset({ id: user!.id, senhaHash: user!.senhaHash });

    const reset = await app.inject({
      method: "POST",
      url: "/api/auth/redefinir-senha",
      payload: { token, senha: "novaSenha456" },
    });
    expect(reset.statusCode).toBe(200);

    // login com a nova senha funciona
    const login = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: { email: "admin@teste.com", senha: "novaSenha456" },
    });
    expect(login.statusCode).toBe(200);

    // o mesmo token não vale mais — a senhaHash mudou (single-use)
    const reuso = await app.inject({
      method: "POST",
      url: "/api/auth/redefinir-senha",
      payload: { token, senha: "outraSenha789" },
    });
    expect(reuso.statusCode).toBe(400);
  });
});
