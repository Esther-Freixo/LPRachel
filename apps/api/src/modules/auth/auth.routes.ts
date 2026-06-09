import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import * as service from "./auth.service.js";
import { enviarEmailResetSenha } from "../../lib/email.js";

const loginBody = z.object({ email: z.string().email(), senha: z.string().min(1) });
const loginResp = z.object({ token: z.string() });
const erroResp = z.object({ erro: z.string() });
const esqueciBody = z.object({ email: z.string().email() });
const redefinirBody = z.object({ token: z.string().min(1), senha: z.string().min(8) });
const okResp = z.object({ ok: z.boolean() });

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/auth/login",
    { schema: { body: loginBody, response: { 200: loginResp, 401: erroResp } } },
    async (req, reply) => {
      const usuario = await service.validarCredenciais(req.body);
      if (!usuario) {
        return reply.status(401).send({ erro: "Credenciais inválidas." });
      }
      const token = app.jwt.sign(
        { sub: usuario.id, email: usuario.email, papel: usuario.papel },
        { expiresIn: "8h" },
      );
      return { token };
    },
  );

  // Solicita redefinição: sempre responde 200 (não revela se o e-mail existe).
  app.post(
    "/api/auth/esqueci-senha",
    { schema: { body: esqueciBody, response: { 200: okResp } } },
    async (req) => {
      const usuario = await service.buscarPorEmail(req.body.email);
      if (usuario) {
        const token = service.gerarTokenReset(usuario);
        const base = process.env.APP_URL || "http://localhost:5173";
        const link = `${base}/redefinir-senha?token=${encodeURIComponent(token)}`;
        try {
          await enviarEmailResetSenha(usuario.email, link);
        } catch (err) {
          req.log.error({ err }, "[auth] falha ao enviar e-mail de reset");
        }
      }
      return { ok: true };
    },
  );

  // Redefine a senha a partir de um token válido.
  app.post(
    "/api/auth/redefinir-senha",
    { schema: { body: redefinirBody, response: { 200: okResp, 400: erroResp } } },
    async (req, reply) => {
      const usuario = await service.verificarTokenReset(req.body.token);
      if (!usuario) {
        return reply.status(400).send({ erro: "Link inválido ou expirado." });
      }
      await service.atualizarSenha(usuario.id, req.body.senha);
      return { ok: true };
    },
  );
};
