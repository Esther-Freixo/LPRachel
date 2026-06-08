import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { timelineSchema, timelineCreateSchema, timelineUpdateSchema } from "@rf/shared";
import * as service from "./timeline.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });

export const timelineRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/timeline",
    { schema: { response: { 200: z.array(timelineSchema) } } },
    async () => service.listarTimeline(),
  );

  app.post(
    "/api/timeline",
    { preHandler: [app.requireAuth], schema: { body: timelineCreateSchema, response: { 201: timelineSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarTimeline(req.body);
    },
  );

  app.put(
    "/api/timeline/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, body: timelineUpdateSchema, response: { 200: timelineSchema } } },
    async (req) => service.atualizarTimeline(req.params.id, req.body),
  );

  app.delete(
    "/api/timeline/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerTimeline(req.params.id);
      return { ok: true };
    },
  );
};
