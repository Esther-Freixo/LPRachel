import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { contatoSchema, contatoCreateSchema } from "@rf/shared";
import * as service from "./contatos.service.js";

const idParam = z.object({ id: z.coerce.number().int() });
const okResp = z.object({ ok: z.boolean() });

export const contatosRoutes: FastifyPluginAsyncZod = async (app) => {
  // Público: envio do formulário de contato.
  app.post(
    "/api/contatos",
    { schema: { body: contatoCreateSchema, response: { 201: contatoSchema } } },
    async (req, reply) => {
      reply.status(201);
      return service.criarContato(req.body);
    },
  );

  // Admin: ler e excluir mensagens recebidas.
  app.get(
    "/api/contatos",
    { preHandler: [app.requireAuth], schema: { response: { 200: z.array(contatoSchema) } } },
    async () => service.listarContatos(),
  );

  app.delete(
    "/api/contatos/:id",
    { preHandler: [app.requireAuth], schema: { params: idParam, response: { 200: okResp } } },
    async (req) => {
      await service.removerContato(req.params.id);
      return { ok: true };
    },
  );
};
