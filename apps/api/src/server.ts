import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { logger } from "./lib/logger.js";

const env = loadEnv();
const app = await buildApp();

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => logger.info("Server", `API ouvindo em http://localhost:${env.PORT}`))
  .catch((err) => {
    logger.error("Server", String(err));
    process.exit(1);
  });
