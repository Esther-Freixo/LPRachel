import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { insightSchema } from "@rf/shared";
import * as service from "./insights.service.js";

export const insightsRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/insights",
    { schema: { response: { 200: z.array(insightSchema) } } },
    async () => service.listarInsights(),
  );
};
