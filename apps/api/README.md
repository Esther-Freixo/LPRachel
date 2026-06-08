# @rf/api

API Fastify + Prisma + PostgreSQL.

## Scripts

- `pnpm dev` — sobe a API em watch (carrega `.env` via `--env-file`)
- `pnpm build` / `pnpm start` — build e execução de produção
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — testes (Vitest)
- `pnpm prisma:migrate` / `pnpm prisma:seed` — schema e dados

## Estrutura

```
src/
  config/env.ts        # validação de ambiente (zod) + fail-fast
  db/prisma.ts         # singleton do PrismaClient
  lib/logger.ts        # logs prefixados por módulo
  app.ts               # buildApp() — factory testável (error handler, rotas)
  server.ts            # entrypoint (listen)
  modules/<entidade>/  # *.routes.ts → *.service.ts → *.repository.ts
  test/db.ts           # helper de banco para testes de integração
```

## Testes

Usam um banco separado (`rachel_test`). Antes de rodar, crie-o e aplique as migrations:

```bash
docker exec rf_postgres psql -U rf -d rachel -c "CREATE DATABASE rachel_test"
# Windows PowerShell:
$env:DATABASE_URL=$env:DATABASE_URL_TEST; pnpm prisma migrate deploy
$env:DATABASE_URL=$env:DATABASE_URL_TEST; pnpm test
```

(`DATABASE_URL` e `DATABASE_URL_TEST` apontam para `rachel_test` ao rodar os testes.)
