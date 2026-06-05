# Site Rachel Freixo — Monorepo

Monorepo pnpm com três pacotes:

- **`apps/web`** — site institucional (React + Vite). _Convertido para TypeScript no Plano 3._
- **`apps/api`** — API REST (Fastify + Prisma + PostgreSQL).
- **`packages/shared`** — contratos/DTOs (zod) compartilhados entre `web` e `api`.

## Rodar local

Pré-requisitos: Node 20+, pnpm 9+, Docker Desktop.

```bash
# 1. Sobe Postgres + MinIO
docker compose -p rf -f infra/docker-compose.yml up -d

# 2. Instala dependências
pnpm install

# 3. Configura ambiente da API
cp apps/api/.env.example apps/api/.env

# 4. Aplica o schema e popula os dados recuperados
pnpm --filter @rf/api prisma:migrate
pnpm --filter @rf/api prisma:seed

# 5. Sobe a API (http://localhost:3333)
pnpm dev:api
```

Smoke test: `curl http://localhost:3333/api/timeline` deve retornar 14 itens.

> Portas locais: Postgres `5433`, MinIO `9100` (API) / `9101` (console), API `3333`.

## Scripts

- `pnpm dev:api` — sobe a API em watch
- `pnpm typecheck` — checagem de tipos de todos os pacotes
- `pnpm test` — testes de todos os pacotes
- `pnpm build` — build de shared + api + web

Arquitetura: [`docs/architecture.md`](docs/architecture.md).
Decisão de design: [`docs/superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md`](docs/superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md).
