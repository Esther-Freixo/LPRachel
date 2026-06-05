import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { timelineSchema } from "@rf/shared";
import * as service from "./timeline.service.js";

export const timelineRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/timeline",
    { schema: { response: { 200: z.array(timelineSchema) } } },
    async () => {
      return service.listarTimeline();
    },
  );
};
