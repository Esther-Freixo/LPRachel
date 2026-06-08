# Site Rachel Freixo — Monorepo

Monorepo pnpm com três pacotes:

- **`apps/web`** — site institucional (React + Vite + TypeScript). Páginas, componentes, hooks e camada de dados em TS. _(Exceção: as variações experimentais da timeline em `/lab/timeline` seguem em `.jsx`, pois só existem em dev.)_
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

# 6. Em outro terminal: sobe o site (http://localhost:5174, proxy /api -> 3333)
pnpm dev:web
```

Smoke test: `curl http://localhost:3333/api/timeline` deve retornar 14 itens.

> Portas locais: Postgres `5433`, MinIO `9100` (API) / `9101` (console), API `3333`.

## Scripts

- `pnpm dev:api` — sobe a API em watch
- `pnpm dev:web` — sobe o site em watch (porta 5174 ou 5173)
- `pnpm typecheck` — checagem de tipos de todos os pacotes
- `pnpm test` — testes unitários/integração (API + web)
- `pnpm build` — build de shared + api + web

## Testes

- `pnpm test` — unidade/integração: API (vitest, banco `rachel_test` isolado) + web (vitest).
- `pnpm --filter web test:e2e` — end-to-end (Playwright): smoke das páginas públicas, autenticação e CRUD do admin. Requer Postgres+MinIO, API e web no ar.

> Os testes da API usam o banco `rachel_test`. Crie-o e migre antes da primeira execução:
> `createdb` via container + `pnpm --filter @rf/api prisma migrate deploy` apontando `DATABASE_URL` para `rachel_test`.

## Lab

- `/lab/timeline` — página (não linkada) que compara variações de design da timeline da home. **Só existe em desenvolvimento** (`import.meta.env.DEV`, lazy import) — fica fora do bundle de produção automaticamente.

Arquitetura: [`docs/architecture.md`](docs/architecture.md).
Decisão de design: [`docs/superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md`](docs/superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md).
