import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { midiaSchema } from "@rf/shared";
import * as service from "./midias.service.js";

export const midiasRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/midias",
    { schema: { response: { 200: z.array(midiaSchema) } } },
    async () => service.listarMidias(),
  );
};
