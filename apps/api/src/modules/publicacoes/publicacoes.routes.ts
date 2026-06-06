import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { publicacaoSchema } from "@rf/shared";
import * as service from "./publicacoes.service.js";

export const publicacoesRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/publicacoes",
    { schema: { response: { 200: z.array(publicacaoSchema) } } },
    async () => service.listarPublicacoes(),
  );
};
