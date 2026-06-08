// Setup do vitest — roda ANTES dos módulos de teste serem importados.
// O singleton em src/db/prisma.ts lê DATABASE_URL no momento da construção,
// então apontamos a aplicação para o banco de TESTE aqui, antes de tudo.
if (!process.env.DATABASE_URL_TEST) {
  throw new Error(
    "[test] DATABASE_URL_TEST não definido — configure apps/api/.env (rode os testes com `pnpm --filter @rf/api test`)."
  );
}

process.env.DATABASE_URL = process.env.DATABASE_URL_TEST;
process.env.NODE_ENV = "test";
