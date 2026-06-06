import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { publicacaoSchema, publicacaoCreateSchema, publicacaoUpdateSchema } from "@rf/shared";
import * as service from "./publicacoes.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });

export const publicacoesRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/publicacoes",
    { schema: { response: { 200: z.array(publicacaoSchema) } } },
    async () => service.listarPublicacoes(),
  );

  app.post(
    "/api/publicacoes",
    { preHandler: [app.requireAuth], schema: { body: publicacaoCreateSchema, response: { 201: publicacaoSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarPublicacao(req.body);
    },
  );

  app.put(
    "/api/publicacoes/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, body: publicacaoUpdateSchema, response: { 200: publicacaoSchema } } },
    async (req) => service.atualizarPublicacao(req.params.id, req.body),
  );

  app.delete(
    "/api/publicacoes/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerPublicacao(req.params.id);
      return { ok: true };
    },
  );
};
