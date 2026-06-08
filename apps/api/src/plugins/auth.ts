import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

// Registra @fastify/jwt (via fastify-plugin para expor `jwt`/`requireAuth` na raiz)
// e um preHandler `requireAuth` para proteger rotas de admin (usado no Plano 3).
export const authPlugin = fp(async (app) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("[auth] JWT_SECRET ausente");
  await app.register(fastifyJwt, { secret });

  app.decorate("requireAuth", async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      await req.jwtVerify();
    } catch {
      await reply.status(401).send({ erro: "Não autorizado." });
    }
  });
});
