import { defineConfig } from "vitest/config";

// Carrega o .env da API para process.env (DATABASE_URL_TEST etc.) durante os
// testes. process.loadEnvFile é nativo do Node (>=20.12) — sem dependências.
try {
  process.loadEnvFile(".env");
} catch {
  // .env ausente (ex.: CI com env injetado) — segue com o ambiente atual.
}

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    fileParallelism: false,
    setupFiles: ["./src/test/setup.ts"],
  },
});
