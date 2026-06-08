import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { insightSchema, insightCreateSchema, insightUpdateSchema } from "@rf/shared";
import * as service from "./insights.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });

export const insightsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/insights",
    { schema: { response: { 200: z.array(insightSchema) } } },
    async () => service.listarInsights(),
  );

  app.post(
    "/api/insights",
    { preHandler: [app.requireAuth], schema: { body: insightCreateSchema, response: { 201: insightSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarInsight(req.body);
    },
  );

  app.put(
    "/api/insights/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, body: insightUpdateSchema, response: { 200: insightSchema } } },
    async (req) => service.atualizarInsight(req.params.id, req.body),
  );

  app.delete(
    "/api/insights/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerInsight(req.params.id);
      return { ok: true };
    },
  );
};
