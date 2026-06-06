import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { citacaoSchema } from "@rf/shared";
import * as service from "./citacoes.service.js";

export const citacoesRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/citacoes",
    { schema: { response: { 200: z.array(citacaoSchema) } } },
    async () => service.listarCitacoes(),
  );
};
