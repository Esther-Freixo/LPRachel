import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { eventoSchema } from "@rf/shared";
import * as service from "./agenda.service.js";

export const agendaRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/agenda",
    { schema: { response: { 200: z.array(eventoSchema) } } },
    async () => service.listarAgenda(),
  );
};
