# Plano 6 — Deploy no Railway (Fundação) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans.

**Goal:** Colocar o site no ar como **serviço único** no Railway: Fastify serve o build do `apps/web` em `/` e a API em `/api/*`, com Postgres e MinIO como serviços Railway.

**Architecture:** Em produção (`SERVE_WEB=true`), o Fastify registra `@fastify/static` servindo `apps/web/dist` com fallback SPA (index.html) para rotas não-`/api`. Build via Dockerfile multi-stage (pnpm monorepo). Migrations aplicadas no release; seed roda uma vez (manual). Mesma origem → sem CORS.

**Tech Stack:** + `@fastify/static`, Docker, Railway CLI. Branch: `feat/refatoracao-fundacao`.

---

### Task 1: Fastify serve o site em produção
- [ ] `@fastify/static` em `apps/api/package.json`; `pnpm install`.
- [ ] Em `app.ts`, bloco guardado por `SERVE_WEB==='true'`: registra static em `WEB_DIR` (default `../../web/dist` relativo a `apps/api/dist`) + `setNotFoundHandler` que serve `index.html` para GET não-`/api`.
- [ ] commit.

### Task 2: Build de produção + Dockerfile
- [ ] `Dockerfile` multi-stage (node 22 + pnpm): instala, builda shared+api+web, roda `prisma migrate deploy` + `node apps/api/dist/server.js`.
- [ ] `.dockerignore` (node_modules, dist, .env, .git).
- [ ] `railway.json` (builder DOCKERFILE).
- [ ] commit.

### Task 3: Verificação local do modo produção
- [ ] `pnpm build` (shared+api+web).
- [ ] Rodar `SERVE_WEB=true node apps/api/dist/server.js` (com DATABASE_URL/JWT_SECRET) e `curl http://localhost:3333/` (HTML do site) + `curl /api/timeline` (14). Confirma o serviço único.
- [ ] commit (se houve ajuste).

### Task 4: Deploy no Railway
- [ ] Instalar Railway CLI (`npm i -g @railway/cli`).
- [ ] Autenticar com o token (env `RAILWAY_TOKEN`/`RAILWAY_API_TOKEN`).
- [ ] Criar/linkar projeto; provisionar **Postgres** e **MinIO** (`minio/minio`, volume, env); setar env do serviço web (`DATABASE_URL`, `JWT_SECRET`, `ADMIN_*`, `MINIO_*`, `MINIO_PUBLIC_URL`, `SERVE_WEB=true`, `NODE_ENV=production`).
- [ ] `railway up` (deploy do serviço web).
- [ ] Rodar seed uma vez no banco da nuvem; smoke na URL pública.
- [ ] Atualizar docs.

> Segurança: o token do Railway foi compartilhado no chat — **rotacionar depois**. Nada de segredo no git.

## Self-Review
- Serviço único cobre o spec (mesma origem, sem CORS). Storage/oembed já prontos. Seed manual (não sobrescrever conteúdo do admin a cada deploy).
- Atenção: Railway-specific (MinIO via Docker service) pode exigir ajuste fino no dashboard; CLI cobre a maior parte.
