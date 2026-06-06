import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import * as service from "./auth.service.js";

const loginBody = z.object({ email: z.string().email(), senha: z.string().min(1) });
const loginResp = z.object({ token: z.string() });
const erroResp = z.object({ erro: z.string() });

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
};
