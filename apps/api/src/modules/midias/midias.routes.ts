import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { midiaSchema, midiaCreateSchema, midiaUpdateSchema } from "@rf/shared";
import * as service from "./midias.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });
const oembedQuery = z.object({ url: z.string().url() });
const oembedResp = z.object({ titulo: z.string().nullable(), autor: z.string().nullable() });

export const midiasRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/midias",
    { schema: { response: { 200: z.array(midiaSchema) } } },
    async () => service.listarMidias(),
  );

  // Público e seguro (o servidor só chama noembed.com): autofill do admin.
  app.get(
    "/api/midias/oembed",
    { schema: { querystring: oembedQuery, response: { 200: oembedResp } } },
    async (req) => service.buscarOembed(req.query.url),
  );

  app.post(
    "/api/midias",
    { preHandler: [app.requireAuth], schema: { body: midiaCreateSchema, response: { 201: midiaSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarMidia(req.body);
    },
  );

  app.put(
    "/api/midias/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, body: midiaUpdateSchema, response: { 200: midiaSchema } } },
    async (req) => service.atualizarMidia(req.params.id, req.body),
  );

  app.delete(
    "/api/midias/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerMidia(req.params.id);
      return { ok: true };
    },
  );
};
