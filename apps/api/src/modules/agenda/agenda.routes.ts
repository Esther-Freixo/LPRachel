import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { eventoSchema, eventoCreateSchema, eventoUpdateSchema } from "@rf/shared";
import * as service from "./agenda.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });

export const agendaRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/agenda",
    { schema: { response: { 200: z.array(eventoSchema) } } },
    async () => service.listarAgenda(),
  );

  app.post(
    "/api/agenda",
    { preHandler: [app.requireAuth], schema: { body: eventoCreateSchema, response: { 201: eventoSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarEvento(req.body);
    },
  );

  app.put(
    "/api/agenda/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, body: eventoUpdateSchema, response: { 200: eventoSchema } } },
    async (req) => service.atualizarEvento(req.params.id, req.body),
  );

  app.delete(
    "/api/agenda/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerEvento(req.params.id);
      return { ok: true };
    },
  );
};
