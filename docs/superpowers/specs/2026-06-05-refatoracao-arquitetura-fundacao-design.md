# Design — Refatoração de Arquitetura (Fase 1: Fundação)

**Projeto:** Site institucional Rachel Freixo
**Data:** 2026-06-05
**Status:** Design aprovado (aguardando revisão do spec)
**Autor:** Esther + Claude

---

## 1. Contexto e problema

O site atual é um SPA React+Vite (JavaScript) que fala **direto do navegador** com um
projeto Supabase via REST. Dois problemas estruturais:

1. **Backend evaporou.** O projeto Supabase (`pabcmwgncpbfyrbbfzhj.supabase.co`) foi
   deletado — DNS NXDOMAIN. Todas as seções dinâmicas (timeline, agenda, publicações,
   insights, citações, mídias) renderizam vazias porque `fetchSupabase` faz
   `catch → return []`, engolindo o erro.
2. **Arquitetura frágil.** A `SUPABASE_KEY` fica exposta no client; o login admin é
   `admrachel/space123` **hardcoded** em `src/store/data.js`; componentes fazem `fetch`
   direto; não há tipagem, camadas nem testes.

A cliente vai **crescer o site com posts, links e vídeos** ao longo do tempo e está
disposta a arcar com custo de infra. A decisão foi **refatorar para uma arquitetura
própria, limpa e tipada**, saindo do Supabase.

## 2. Objetivos / Não-objetivos

### Objetivos (Fase 1)
- Migrar **todas as features atuais** para uma stack em camadas, própria e tipada.
- Preservar **100% do design e animações** do frontend.
- Substituir o auth hardcoded por **autenticação real (JWT + senha hasheada)**.
- **Re-popular** o banco com os dados recuperados dos scripts de seed.
- Modelo de conteúdo já **preparado** para posts/vídeo (sem construir o blog ainda).
- Rodar **100% local** via `docker-compose` antes de qualquer deploy.

### Não-objetivos (ficam para fases seguintes, cada uma com seu spec)
- Blog/Insights rico com editor e embed de vídeo como feature completa.
- Integração LinkedIn (bidirecional).
- Newsletter, i18n, analytics, SEO avançado (SSR).
- Migração para Next.js.

## 3. Decisões travadas

| Camada | Escolha | Motivo |
|---|---|---|
| Escopo | Só a fundação | Decompor a visão grande; entregar base sólida primeiro |
| Frontend | Manter React+Vite, converter para **TS estrito** | Preservar UI/animações; zero retrabalho |
| Backend | **Fastify + TypeScript** | TS-native, validação de schema, rápido |
| Acesso a dados | **Prisma + PostgreSQL** | Schema-first, tipos gerados, migrations, prepared statements |
| Arquivos | **MinIO** (imagem/PDF via upload) + **embed** p/ vídeo | Não hospedar vídeo (banda); object storage S3-compatível |
| Auth | **JWT + argon2**, admin único (Rachel) | Mata o hardcoded; extensível depois |
| Deploy | **Tudo no Railway** — serviço Fastify serve o site + `/api`, mais Postgres e MinIO | Um domínio, sem CORS, um deploy; simplicidade |

**Confirmado pela cliente:** tudo no Railway (serviço único web+api); admin único; `noembed` movido para a API; emojis de UI removidos por padrão.

## 4. Arquitetura

### 4.1 Topologia

```
Navegador ──HTTPS──> Serviço "web" (Railway): Fastify
                       ├── serve o site (build do React/Vite) em  /
                       ├── rotas da API em  /api/*   (Bearer JWT)
                       ├── Prisma ──> PostgreSQL                  [Railway]
                       └── S3 SDK ──> MinIO (bucket img/pdf)       [Railway]

Site e API na MESMA origem → sem CORS. Vídeo: nunca hospedado —
embed YouTube/Spotify/LinkedIn (guardamos só a URL).
```

Tudo no Railway (3 serviços: `web`=site+api, `postgres`, `minio`). O navegador nunca acessa
o banco diretamente. Segredos de produção vivem no painel do Railway — nunca no client nem no git.

### 4.2 Estrutura do repositório (monorepo pnpm workspaces)

```
rachel-freixo/
  apps/
    web/      # frontend React+Vite, convertido para TS
    api/      # backend Fastify + Prisma
  packages/
    shared/   # contratos/DTOs e tipos compartilhados (zod) — domínio pt-BR
  infra/
    docker-compose.yml   # dev local: postgres + minio
  docs/
    architecture.md
    superpowers/specs/
```

`packages/shared` garante **zero `any` de ponta a ponta**: o tipo que a API retorna é o
mesmo que o front consome (DTOs derivados de schemas zod). É onde moram as interfaces/contratos.

### 4.3 Backend em camadas (`apps/api`)

Bootstrap e infraestrutura:
- `src/server.ts` — Fastify, plugins, CORS, registro de rotas, error handler central.
- `src/config/env.ts` — validação de env com zod; **falha rápido** (`process.exit(1)`) se
  faltar segredo. Sem fallback de secret.
- `src/db/prisma.ts` — singleton do PrismaClient.
- `src/lib/storage.ts` — cliente MinIO (S3 SDK); upload e geração de URL pública/presigned.
- `src/lib/logger.ts` — logs prefixados por módulo (`[Auth]`, `[DB]`, `[Storage]`).

Por entidade, em `src/modules/<entidade>/`, três camadas isoladas:
- `*.routes.ts` — só HTTP: valida entrada (zod), chama o service, converte para resposta.
  **Service nunca retorna objeto HTTP.**
- `*.service.ts` — regra de negócio / orquestração.
- `*.repository.ts` — **único** lugar que toca o banco (Prisma, sempre parametrizado).
- `*.schema.ts` — schemas zod / DTOs (reexportados para `packages/shared` quando compartilhados).

Módulos: `auth`, `publicacoes`, `agenda`, `timeline`, `insights`, `citacoes`, `midias`,
`contatos`, `storage`.

### 4.4 Autenticação

- Tabela `usuarios` com `senha_hash` (argon2). Bootstrap do admin único (Rachel) via
  `prisma/seed.ts` lendo credenciais do env (`ADMIN_EMAIL`, `ADMIN_SENHA`).
- `POST /api/auth/login` → valida → emite **JWT** (access token assinado com `JWT_SECRET`).
- Rotas admin protegidas por `preHandler` que verifica o JWT. Matriz de acesso:

  | Acesso | Rotas |
  |---|---|
  | **Público (sem auth)** | GET de conteúdo (`publicacoes`, `agenda`, `timeline`, `insights`, `citacoes`, `midias`); **`POST /api/contatos`** (envio do formulário) |
  | **Admin (JWT)** | CRUD de conteúdo (POST/PUT/DELETE); **`GET /api/contatos`** (ler leads); upload no storage; gestão de `usuarios` |

- Frontend guarda o token e o envia via `Authorization: Bearer`.

### 4.5 Modelo de dados (Prisma — colunas snake_case, domínio pt-BR)

Migração das tabelas atuais + normalização de inconsistências detectadas:

| Tabela | Colunas |
|---|---|
| `publicacoes` | id, tipo (`livro\|artigo\|opiniao\|imprensa`), titulo, meta, resumo, link |
| `agenda` | id, dia, mes, ano, tipo, titulo, local, descricao, link, status (`proximo\|realizado`) |
| `timeline` | id, ano, titulo, descricao |
| `insights` | id, data, titulo, texto, link_original, media_url |
| `citacoes` | id, texto, bg, text_col, border, quote_mark |
| `midias` | id, titulo, tipo (`podcast\|video\|entrevista`), url, descricao, thumbnail_url, plataforma (`spotify\|youtube\|outro`), ordem |
| `contatos` | id, nome, email, assunto, mensagem, created_at |
| `usuarios` | id, email, senha_hash, papel, created_at |

**Normalizações:** `insights` hoje tem drift — dados antigos usam `imagemUrl`, admin novo
envia `mediaUrl`, e `linkOriginal` é camelCase. Consolidar em `media_url` e `link_original`
(snake_case). A camada de serviço expõe os campos via DTO sem vazar o nome de coluna.

**Preparo para posts/vídeo (YAGNI-consciente):** `insights` já serve de base para "posts";
`media_url` aceita imagem ou embed. Não adicionamos campos especulativos além disso nesta fase.

### 4.6 Frontend (`apps/web`)

- Conversão `.jsx → .tsx`, `tsconfig` com `strict: true`, sem `any`.
- Remover `src/store/data.js` (Supabase no client). Entra:
  - `src/services/api.ts` — cliente HTTP tipado (base URL via `VITE_API_URL`, injeta JWT,
    trata erro de forma uniforme).
  - `src/services/<entidade>.ts` — funções tipadas retornando DTOs de `packages/shared`.
- **Nenhum componente faz `fetch` direto** (regra ESD). Hooks (`useData`) retipados.
- Páginas públicas: **visual idêntico**, só a fonte de dados muda.
- Admin: login real com JWT (substitui `sessionStorage rf_auth` + credencial hardcoded).
- `Midias` hoje chama `noembed.com` direto no client para autofill do YouTube. **Decisão:
  mover para a API** (`GET /api/midias/oembed?url=`) — evita dependência de terceiro no client
  e segue a regra "sem fetch solto em componente".

### 4.7 Storage (MinIO)

- Bucket único para imagens/PDFs enviados pelo painel (publicações, mídias custom thumb, etc.).
- Endpoint de upload autenticado na API → grava no MinIO → devolve URL pública persistida no DB.
- Vídeo continua por embed (URL externa), nunca arquivo.

### 4.8 Deploy (tudo no Railway)

Três serviços Railway:
- **web** (Fastify): build do monorepo (`pnpm install && pnpm --filter web build &&
  pnpm --filter api build`); a API serve o site via `@fastify/static` e expõe `/api/*`.
  `prisma migrate deploy` no release; `prisma/seed.ts` roda uma vez (dados recuperados).
- **postgres**: plugin gerenciado do Railway.
- **minio**: container `minio/minio` + volume persistente.

Site e API na **mesma origem** → sem CORS; o front chama `/api` (relativo).
`.env.example` com: `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_SENHA`,
`MINIO_ENDPOINT`, `MINIO_ACCESS_KEY`, `MINIO_SECRET_KEY`, `MINIO_BUCKET`.
(`VITE_API_URL` default `/api`; `CORS_ORIGIN` não é necessário no modelo single-service.)

## 5. Tratamento de erros

- Error handler central do Fastify: **mensagem genérica** ao usuário + log completo no servidor.
- Validação zod → 400 com campos inválidos (mensagem genérica, sem stack).
- Auth inválido → 401. Não autorizado → 403. Não encontrado → 404.
- Frontend: a camada `services/api.ts` traduz status em estados de UI (loading/error/empty/success).

## 6. Testes (Vitest)

- **API:** unit em services e repositories (DB de teste via Prisma); contrato das rotas
  (integração) para os CRUDs e o fluxo de auth.
- **Frontend:** a camada de serviço e componentes-chave (ex.: render de timeline/agenda
  com dados mockados, estados vazio/erro).
- Escopo proporcional — cobrir caminhos felizes + erros relevantes, não 100% cego.

## 7. Documentação (parte da definição de pronto)

`README` por app, `docs/architecture.md`, `.env.example`, `CHANGELOG`. Conventional Commits,
branches `feat/*`/`fix/*`, **sem push direto na `main`**.

## 8. Sequência de implementação (detalhe vem no plano)

1. Scaffold do monorepo + `infra/docker-compose.yml` (postgres + minio local).
2. API: schema Prisma + migration inicial + `seed.ts` com dados recuperados + módulos CRUD
   + auth + storage.
3. Frontend: conversão TS + camada de serviço + troca da fonte de dados + login real.
4. Deploy Railway + Vercel, env, smoke test.
5. Docs + cutover.

## 9. Conformidade ESD

- [x] TypeScript estrito dos dois lados (`tsc --noEmit` no CI)
- [x] Domínio pt-BR / infra inglês
- [x] Pool/singleton de DB centralizado (Prisma), prepared statements
- [x] Sem auth mockado/hardcoded; sem fallback de secret
- [x] Sem `fetch` direto em componente (via `services/`)
- [x] Conventional Commits, sem push direto na `main`
- [x] Documentação como código
- [x] Sem emojis em UI/arquivos salvo pedido explícito (nota: admin atual usa emojis em
      labels de mídia — manter só se a cliente pedir; default é remover)

## 10. Decisões resolvidas + itens em aberto

Resolvido com a cliente:
- **Deploy: tudo no Railway** — serviço único Fastify servindo site + `/api` (sem Vercel, sem CORS).
- **Admin único** (Rachel).
- **`noembed` movido para a API.**
- **Emojis** de UI removidos por padrão (ESD); reversível se a Rachel pedir.

Em aberto (não bloqueiam o início):
- Credenciais reais do admin — definidas no deploy via env, não agora.

## 11. Dados recuperados (referência para o seed)

Origem: `database_scripts/` (fora do git, em disco). Conjunto consolidado:
`solucao_final.sql` (timeline com 14 itens — carreira + formação; agenda; publicações;
insight COANA), `supabase_citacoes.sql` (4 citações), `complemento_dados.sql` (insight longo),
`add_data.js` (eventos/publicações extras — avaliar se entram ou são placeholder).
Conteúdo com linguagem de advocacia será filtrado conforme reposicionamento de `new_texts.md`
em fase de conteúdo (não nesta fundação técnica).
