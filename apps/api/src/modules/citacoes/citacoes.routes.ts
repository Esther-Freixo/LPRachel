import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { citacaoSchema, citacaoCreateSchema, citacaoUpdateSchema } from "@rf/shared";
import * as service from "./citacoes.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });

export const citacoesRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/citacoes",
    { schema: { response: { 200: z.array(citacaoSchema) } } },
    async () => service.listarCitacoes(),
  );

  app.post(
    "/api/citacoes",
    { preHandler: [app.requireAuth], schema: { body: citacaoCreateSchema, response: { 201: citacaoSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarCitacao(req.body);
    },
  );

  app.put(
    "/api/citacoes/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, body: citacaoUpdateSchema, response: { 200: citacaoSchema } } },
    async (req) => service.atualizarCitacao(req.params.id, req.body),
  );

  app.delete(
    "/api/citacoes/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerCitacao(req.params.id);
      return { ok: true };
    },
  );
};
