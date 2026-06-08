import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { randomUUID } from "node:crypto";
import { enviarArquivo } from "../../lib/storage.js";

const okResp = z.object({ url: z.string() });
const erroResp = z.object({ erro: z.string() });

export const uploadsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/uploads",
    { onRequest: [app.requireAuth], schema: { response: { 201: okResp, 400: erroResp } } },
    async (req, reply) => {
      const file = await req.file();
      if (!file) return reply.status(400).send({ erro: "Nenhum arquivo enviado." });
      const buffer = await file.toBuffer();
      const ext = file.filename.includes(".") ? file.filename.split(".").pop() : "bin";
      const nome = `${randomUUID()}.${ext ?? "bin"}`;
      const url = await enviarArquivo(nome, buffer, file.mimetype);
      reply.status(201);
      return { url };
    },
  );
};
