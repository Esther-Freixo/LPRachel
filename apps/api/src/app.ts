import Fastify, { type FastifyInstance, type FastifyError } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { logger } from "./lib/logger.js";
import { prisma } from "./db/prisma.js";
import { timelineRoutes } from "./modules/timeline/timeline.routes.js";

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Error handler central: mensagem genérica ao usuário, log completo no servidor.
  app.setErrorHandler((error: FastifyError, _req, reply) => {
    logger.error("Server", `${error.name}: ${error.message}`);
    const status = error.statusCode ?? 500;
    const publicMsg =
      status >= 500 ? "Erro interno. Tente novamente." : error.message || "Requisição inválida.";
    reply.status(status).send({ erro: publicMsg });
  });

  // Desconecta o Prisma ao encerrar a app (evita conexões pendentes nos testes).
  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  app.get("/api/health", async () => ({ status: "ok" }));
  await app.register(timelineRoutes);

  return app;
}
