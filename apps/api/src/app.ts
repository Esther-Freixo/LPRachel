import Fastify, { type FastifyInstance, type FastifyError } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { logger } from "./lib/logger.js";
import { prisma } from "./db/prisma.js";
import { timelineRoutes } from "./modules/timeline/timeline.routes.js";
import { publicacoesRoutes } from "./modules/publicacoes/publicacoes.routes.js";
import { agendaRoutes } from "./modules/agenda/agenda.routes.js";
import { insightsRoutes } from "./modules/insights/insights.routes.js";
import { citacoesRoutes } from "./modules/citacoes/citacoes.routes.js";
import { midiasRoutes } from "./modules/midias/midias.routes.js";
import { authPlugin } from "./plugins/auth.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { contatosRoutes } from "./modules/contatos/contatos.routes.js";
import fastifyMultipart from "@fastify/multipart";
import { uploadsRoutes } from "./modules/uploads/uploads.routes.js";
import fastifyStatic from "@fastify/static";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

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

  await app.register(authPlugin);
  await app.register(fastifyMultipart, { limits: { fileSize: 10 * 1024 * 1024 } });

  app.get("/api/health", async () => ({ status: "ok" }));
  await app.register(timelineRoutes);
  await app.register(publicacoesRoutes);
  await app.register(agendaRoutes);
  await app.register(insightsRoutes);
  await app.register(citacoesRoutes);
  await app.register(midiasRoutes);
  await app.register(authRoutes);
  await app.register(contatosRoutes);
  await app.register(uploadsRoutes);

  // Produção: o próprio Fastify serve o site (build do Vite) + fallback SPA.
  if (process.env.SERVE_WEB === "true") {
    const webDir =
      process.env.WEB_DIR ?? join(dirname(fileURLToPath(import.meta.url)), "..", "..", "web", "dist");
    await app.register(fastifyStatic, { root: webDir, wildcard: false });
    app.setNotFoundHandler((req, reply) => {
      if (req.method === "GET" && !req.url.startsWith("/api")) {
        return reply.sendFile("index.html");
      }
      return reply.status(404).send({ erro: "Não encontrado." });
    });
  }

  return app;
}
