# Arquitetura

Decisão completa em
[`superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md`](superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md).

## Visão

```
Navegador → Serviço web (Railway): Fastify
              ├── serve o site (build do React/Vite) em /
              ├── rotas da API em /api/*
              ├── Prisma → PostgreSQL
              └── S3 SDK → MinIO (imagens/PDFs; vídeo é embed)
```

Tudo no Railway (serviço único web+api, Postgres, MinIO). Site e API na mesma origem → sem CORS em produção.

## Camadas

- **`apps/api`** — Fastify. Por entidade: `*.routes.ts` (só HTTP) → `*.service.ts` (regra de
  negócio) → `*.repository.ts` (única porta do Prisma). `config/env.ts` valida o ambiente com
  fail-fast. `db/prisma.ts` é singleton. Error handler central devolve mensagem genérica e loga
  o detalhe no servidor. Logs prefixados por módulo (`[Server]`, `[DB]`, ...).
- **`packages/shared`** — DTOs/contratos (zod) usados por api e web. Garante zero `any` na fronteira.
- **`apps/web`** — React + Vite. Consome a API via `services/` (sem `fetch` solto em componente).

## Convenções (ESD)

Domínio em pt-BR, infra em inglês · TypeScript estrito · prepared statements (Prisma) ·
Conventional Commits · documentação como código.

## Estado da Fundação

**Plano 1 (base):** monorepo, Postgres/MinIO locais, schema das 8 tabelas, seed dos dados
recuperados, API de pé com a fatia `timeline`.

**Plano 2 (leitura + auth):** leitura pública de `timeline`, `publicacoes`, `agenda`,
`insights`, `citacoes`, `midias` (GET `/api/<entidade>`); autenticação real — `POST
/api/auth/login` (JWT + argon2), `requireAuth` para rotas admin, e usuário admin no seed
(substitui o `admrachel/space123` hardcoded).

Próximos: **Plano 3** (escrita/CRUD admin protegido + upload MinIO + oembed),
**Plano 4** (frontend → TS + camada de serviço + login real), **Plano 5** (deploy Railway).
