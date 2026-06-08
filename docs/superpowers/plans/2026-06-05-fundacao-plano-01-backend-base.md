# Plano 1 — Base do Backend (Fundação) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar o repo num monorepo e levantar a base do backend — Postgres + MinIO locais, Prisma com as 8 tabelas, seed com os dados recuperados, e uma API Fastify de pé com uma fatia vertical (`timeline`) testada ponta a ponta.

**Architecture:** Monorepo pnpm (`apps/web`, `apps/api`, `packages/shared`). API Fastify em TypeScript estrito com camadas isoladas (routes → service → repository), Prisma como única porta do banco, tipos compartilhados via `packages/shared`. Tudo roda local via `docker-compose` antes de qualquer nuvem.

**Tech Stack:** pnpm workspaces · TypeScript 5 (ESM, strict) · Fastify 5 + `fastify-type-provider-zod` · zod · Prisma 6 + PostgreSQL 16 · MinIO · Vitest · Docker Compose.

---

## Notas de execução (ler antes de começar)

- **Branch:** criar `feat/refatoracao-fundacao` antes da Task 1. Nunca commitar na `main`.
- **Rede / shell:** este projeto roda no Windows. O sandbox do Bash **não tem internet**;
  comandos que baixam pacotes (`pnpm install`) ou imagens Docker devem rodar num terminal
  com rede (PowerShell no host, ou `! <comando>` na sessão). Comandos que não usam rede
  (git, prisma generate offline, vitest) podem rodar normalmente.
- **Pré-requisitos:** Node 20+, pnpm 9+, Docker Desktop ativos.
- **Segredos:** nada de token/segredo em arquivo versionado. `.env` é git-ignored; só
  `.env.example` entra no git.
- **Este é o Plano 1 de 4.** Planos 2 (API completa + auth + storage), 3 (frontend) e 4
  (deploy Railway) virão depois, cada um produzindo software testável.

## Mapa de arquivos (o que cada um faz)

```
rachel-freixo/
  package.json                         # raiz do workspace (scripts agregados)
  pnpm-workspace.yaml                  # declara apps/* e packages/*
  tsconfig.base.json                   # config TS estrito compartilhado
  .gitignore                           # garante .env, node_modules, dist ignorados
  infra/docker-compose.yml             # postgres + minio locais
  packages/shared/
    package.json
    tsconfig.json
    src/index.ts                       # barrel de exports
    src/timeline.ts                    # schema zod + tipo Timeline (DTO)
  apps/web/                            # app Vite atual, MOVIDO para cá (ainda JS)
  apps/api/
    package.json
    tsconfig.json
    vitest.config.ts
    .env.example
    prisma/schema.prisma               # 8 modelos
    prisma/seed.ts                     # dados recuperados
    src/config/env.ts                  # validação de env (zod) + fail-fast
    src/config/env.test.ts
    src/db/prisma.ts                   # singleton do PrismaClient
    src/lib/logger.ts                  # logger prefixado por módulo
    src/app.ts                         # buildApp() — factory testável
    src/server.ts                      # entrypoint (listen)
    src/modules/timeline/timeline.repository.ts
    src/modules/timeline/timeline.service.ts
    src/modules/timeline/timeline.routes.ts
    src/test/db.ts                     # helper de DB para testes
    src/modules/timeline/timeline.routes.test.ts
```

---

### Task 1: Reestruturar em monorepo (mover app atual para `apps/web`)

**Files:**
- Create: `pnpm-workspace.yaml`, `package.json` (raiz nova), `tsconfig.base.json`
- Move: tudo do app Vite atual → `apps/web/`
- Modify: `.gitignore` (raiz)

- [ ] **Step 1: Criar a branch**

```bash
cd rachel-freixo
git checkout -b feat/refatoracao-fundacao
```

- [ ] **Step 2: Mover o app Vite atual para `apps/web/` preservando histórico**

```bash
mkdir -p apps/web
git mv src public index.html package.json package-lock.json vite.config.js eslint.config.js vercel.json README.md apps/web/
# .env não versionado: mover manualmente se existir
[ -f .env ] && mv .env apps/web/.env || true
```

- [ ] **Step 3: Criar `pnpm-workspace.yaml` na raiz**

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

- [ ] **Step 4: Criar `package.json` raiz (workspace root)**

```json
{
  "name": "rachel-freixo-monorepo",
  "private": true,
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev:api": "pnpm --filter @rf/api dev",
    "dev:web": "pnpm --filter web dev",
    "build": "pnpm --filter @rf/shared build && pnpm --filter @rf/api build && pnpm --filter web build",
    "typecheck": "pnpm -r typecheck",
    "test": "pnpm -r test"
  }
}
```

- [ ] **Step 5: Criar `tsconfig.base.json` na raiz**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 6: Garantir `.gitignore` raiz ignora segredos e build**

Conteúdo de `.gitignore` (raiz):

```gitignore
node_modules/
dist/
build/
.env
.env.*
!.env.example
*.log
.DS_Store
```

- [ ] **Step 7: Verificar que o app web ainda existe e o git registrou o move**

Run: `git status --short`
Expected: arquivos aparecem como `R` (renamed) sob `apps/web/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: reestrutura repositorio em monorepo pnpm (web movido para apps/web)"
```

---

### Task 2: Infra local — `docker-compose` com Postgres + MinIO

**Files:**
- Create: `infra/docker-compose.yml`

- [ ] **Step 1: Criar `infra/docker-compose.yml`**

```yaml
services:
  postgres:
    image: postgres:16-alpine
    container_name: rf_postgres
    environment:
      POSTGRES_USER: rf
      POSTGRES_PASSWORD: rf_local_dev
      POSTGRES_DB: rachel
    ports:
      - "5432:5432"
    volumes:
      - rf_pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rf -d rachel"]
      interval: 5s
      timeout: 3s
      retries: 10

  minio:
    image: minio/minio:latest
    container_name: rf_minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: rf_minio
      MINIO_ROOT_PASSWORD: rf_minio_local_dev
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - rf_minio_data:/data
    healthcheck:
      test: ["CMD", "mc", "ready", "local"]
      interval: 5s
      timeout: 3s
      retries: 10

volumes:
  rf_pg_data:
  rf_minio_data:
```

- [ ] **Step 2: Subir os serviços (terminal com rede)**

Run: `docker compose -f infra/docker-compose.yml up -d`
Expected: containers `rf_postgres` e `rf_minio` criados.

- [ ] **Step 3: Verificar saúde**

Run: `docker compose -f infra/docker-compose.yml ps`
Expected: ambos com status `healthy`. (Postgres aceitando em `localhost:5432`; console MinIO em `localhost:9001`.)

- [ ] **Step 4: Commit**

```bash
git add infra/docker-compose.yml
git commit -m "chore: docker-compose local com postgres e minio"
```

---

### Task 3: Pacote `packages/shared` (contratos compartilhados)

**Files:**
- Create: `packages/shared/package.json`, `packages/shared/tsconfig.json`, `packages/shared/src/index.ts`, `packages/shared/src/timeline.ts`

- [ ] **Step 1: Criar `packages/shared/package.json`**

```json
{
  "name": "@rf/shared",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "echo \"no tests\" && exit 0"
  },
  "dependencies": { "zod": "^3.24.1" }
}
```

- [ ] **Step 2: Criar `packages/shared/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

- [ ] **Step 3: Criar `packages/shared/src/timeline.ts` (DTO de timeline)**

```typescript
import { z } from "zod";

// DTO público de um marco da trajetória (domínio pt-BR).
export const timelineSchema = z.object({
  id: z.number().int(),
  ano: z.string(),
  titulo: z.string(),
  descricao: z.string(),
});

export type Timeline = z.infer<typeof timelineSchema>;
```

- [ ] **Step 4: Criar `packages/shared/src/index.ts` (barrel)**

```typescript
export * from "./timeline.js";
```

- [ ] **Step 5: Instalar deps e buildar (terminal com rede)**

Run: `pnpm install && pnpm --filter @rf/shared build`
Expected: gera `packages/shared/dist/index.js` e `index.d.ts` sem erros.

- [ ] **Step 6: Commit**

```bash
git add packages/shared
git commit -m "feat: pacote shared com contrato de timeline"
```

---

### Task 4: Scaffold do `apps/api` (Fastify + TS estrito + Vitest)

**Files:**
- Create: `apps/api/package.json`, `apps/api/tsconfig.json`, `apps/api/vitest.config.ts`, `apps/api/.env.example`

- [ ] **Step 1: Criar `apps/api/package.json`**

```json
{
  "name": "@rf/api",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/server.js",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "tsx prisma/seed.ts"
  },
  "prisma": { "seed": "tsx prisma/seed.ts" },
  "dependencies": {
    "@fastify/cors": "^10.0.1",
    "@prisma/client": "^6.2.1",
    "@rf/shared": "workspace:*",
    "fastify": "^5.2.0",
    "fastify-type-provider-zod": "^4.0.2",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@types/node": "^22.10.5",
    "prisma": "^6.2.1",
    "tsx": "^4.19.2",
    "typescript": "^5.7.3",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 2: Criar `apps/api/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": { "outDir": "dist", "rootDir": "src", "types": ["node"] },
  "include": ["src"]
}
```

- [ ] **Step 3: Criar `apps/api/vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    fileParallelism: false,
  },
});
```

- [ ] **Step 4: Criar `apps/api/.env.example`**

```dotenv
# API
PORT=3333
NODE_ENV=development
CORS_ORIGIN=http://localhost:5174

# Banco (dev local via docker-compose)
DATABASE_URL=postgresql://rf:rf_local_dev@localhost:5432/rachel?schema=public
# Banco de testes (criar database "rachel_test")
DATABASE_URL_TEST=postgresql://rf:rf_local_dev@localhost:5432/rachel_test?schema=public

# Auth (usado no Plano 2)
JWT_SECRET=troque-isto-por-um-segredo-forte
ADMIN_EMAIL=rachel@exemplo.com
ADMIN_SENHA=troque-isto

# MinIO (usado no Plano 2)
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=rf_minio
MINIO_SECRET_KEY=rf_minio_local_dev
MINIO_BUCKET=rachel-midia
```

- [ ] **Step 5: Criar o `.env` local a partir do exemplo (não versionado)**

Run: `cp apps/api/.env.example apps/api/.env`
Expected: `apps/api/.env` existe (e está ignorado pelo git).

- [ ] **Step 6: Instalar deps (terminal com rede)**

Run: `pnpm install`
Expected: deps de `@rf/api` instaladas; `@rf/shared` linkado via workspace.

- [ ] **Step 7: Commit**

```bash
git add apps/api/package.json apps/api/tsconfig.json apps/api/vitest.config.ts apps/api/.env.example pnpm-lock.yaml
git commit -m "chore: scaffold do apps/api (fastify + ts + vitest)"
```

---

### Task 5: Validação de env com fail-fast (TDD)

**Files:**
- Create: `apps/api/src/config/env.ts`, `apps/api/src/config/env.test.ts`

- [ ] **Step 1: Escrever o teste que falha** (`apps/api/src/config/env.test.ts`)

```typescript
import { describe, it, expect } from "vitest";
import { parseEnv } from "./env.js";

describe("parseEnv", () => {
  it("retorna config válida quando DATABASE_URL e JWT_SECRET existem", () => {
    const env = parseEnv({
      DATABASE_URL: "postgresql://u:p@localhost:5432/db",
      JWT_SECRET: "x".repeat(16),
      PORT: "3333",
    });
    expect(env.PORT).toBe(3333);
    expect(env.DATABASE_URL).toContain("postgresql://");
  });

  it("lança erro quando falta DATABASE_URL", () => {
    expect(() => parseEnv({ JWT_SECRET: "x".repeat(16) })).toThrow();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm --filter @rf/api test src/config/env.test.ts`
Expected: FAIL — `parseEnv` não existe.

- [ ] **Step 3: Implementar `apps/api/src/config/env.ts`**

```typescript
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3333),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(16),
  CORS_ORIGIN: z.string().default("http://localhost:5174"),
});

export type Env = z.infer<typeof envSchema>;

// Valida o ambiente. Em caso de erro, NÃO usa fallback — falha rápido.
export function parseEnv(source: NodeJS.ProcessEnv | Record<string, unknown>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
    throw new Error(`[env] configuração inválida — ${issues}`);
  }
  return result.data;
}

// Carrega a partir de process.env. Importado pelo server; encerra o processo se inválido.
export function loadEnv(): Env {
  try {
    return parseEnv(process.env);
  } catch (err) {
    console.error(String(err));
    process.exit(1);
  }
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm --filter @rf/api test src/config/env.test.ts`
Expected: PASS (2 testes).

- [ ] **Step 5: Commit**

```bash
git add apps/api/src/config/env.ts apps/api/src/config/env.test.ts
git commit -m "feat: validacao de env com fail-fast no apps/api"
```

---

### Task 6: Schema Prisma (8 tabelas) + migration inicial

**Files:**
- Create: `apps/api/prisma/schema.prisma`

- [ ] **Step 1: Criar `apps/api/prisma/schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Timeline {
  id        Int    @id @default(autoincrement())
  ano       String
  titulo    String
  descricao String
  @@map("timeline")
}

model Publicacao {
  id     Int     @id @default(autoincrement())
  tipo   String
  titulo String
  meta   String?
  resumo String?
  link   String?
  @@map("publicacoes")
}

model Evento {
  id        Int     @id @default(autoincrement())
  dia       String?
  mes       String?
  ano       String?
  tipo      String?
  titulo    String
  local     String?
  descricao String?
  link      String?
  status    String?
  @@map("agenda")
}

model Insight {
  id           Int     @id @default(autoincrement())
  data         String?
  titulo       String
  texto        String
  linkOriginal String? @map("link_original")
  mediaUrl     String? @map("media_url")
  @@map("insights")
}

model Citacao {
  id        Int     @id @default(autoincrement())
  texto     String
  bg        String?
  textCol   String? @map("text_col")
  border    String?
  quoteMark String? @map("quote_mark")
  @@map("citacoes")
}

model Midia {
  id           Int     @id @default(autoincrement())
  titulo       String
  tipo         String
  url          String
  descricao    String?
  thumbnailUrl String? @map("thumbnail_url")
  plataforma   String?
  ordem        Int?
  @@map("midias")
}

model Contato {
  id        Int      @id @default(autoincrement())
  nome      String
  email     String
  assunto   String?
  mensagem  String
  createdAt DateTime @default(now()) @map("created_at")
  @@map("contatos")
}

model Usuario {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  senhaHash String   @map("senha_hash")
  papel     String   @default("admin")
  createdAt DateTime @default(now()) @map("created_at")
  @@map("usuarios")
}
```

- [ ] **Step 2: Gerar a migration inicial (terminal com rede + Postgres no ar)**

Run: `cd apps/api && pnpm prisma migrate dev --name init`
Expected: cria `prisma/migrations/<ts>_init/` e aplica no banco `rachel`; gera o client.

- [ ] **Step 3: Verificar tabelas criadas**

Run: `cd apps/api && pnpm prisma db execute --stdin <<< "\\dt"` *(ou usar `prisma studio`)*
Expected: 8 tabelas + `_prisma_migrations`.

- [ ] **Step 4: Commit**

```bash
git add apps/api/prisma/schema.prisma apps/api/prisma/migrations
git commit -m "feat: schema prisma com 8 tabelas + migration inicial"
```

---

### Task 7: Seed com os dados recuperados

**Files:**
- Create: `apps/api/prisma/seed.ts`

- [ ] **Step 1: Criar `apps/api/prisma/seed.ts`** (dados de `database_scripts/solucao_final.sql` + `supabase_citacoes.sql` + insight COANA longo de `complemento_dados.sql`)

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const timeline = [
  { ano: "Set/2024 – Atual", titulo: "Conselheira Titular", descricao: "Conselho Administrativo de Recursos Fiscais (CARF). Julgamento de recursos administrativos fiscais." },
  { ano: "Set/2023 – Atual", titulo: "Vogal Titular (Governo Federal)", descricao: "Representante do Governo Federal na Junta Comercial do Estado do Espírito Santo (JUCEES)." },
  { ano: "Nov/2019 – Set/2025", titulo: "Subsecretária de Competitividade", descricao: "Governo do Estado do Espírito Santo. Liderança na modernização do ambiente de negócios." },
  { ano: "Jan/2018 – Jul/2024", titulo: "Professora", descricao: "FUCAPE Business School." },
  { ano: "Ago/2014 – Nov/2019", titulo: "Professora de Direito", descricao: "Faculdade Multivix." },
  { ano: "Jan/2012 – Nov/2019", titulo: "Comitê Jurídico", descricao: "Associação Brasileira de Empresas de Comércio Exterior (ABECE)." },
  { ano: "Fev/2014 – Fev/2015", titulo: "Advogada", descricao: "Moussallem e Campos Advogados." },
  { ano: "Set/2013 – Jan/2014", titulo: "Advogada", descricao: "De Goeye." },
  { ano: "Abr/2012 – Ago/2013", titulo: "Advogada Associada", descricao: "Araujo e Policastro Advogados." },
  { ano: "Mar/2007 – Mar/2012", titulo: "Advogada", descricao: "Target Trading S.A." },
  { ano: "Atual", titulo: "Doutorado em Gestão e Economia", descricao: "FUCAPE Business School. (Em andamento)" },
  { ano: "2016 – 2019", titulo: "Mestrado em Ciências Contábeis", descricao: "FUCAPE Business School. Foco em Planejamento Tributário." },
  { ano: "2012 – 2014", titulo: "Especialização", descricao: "Instituto Brasileiro de Estudos Tributários (IBET). Direito Tributário." },
  { ano: "2005 – 2010", titulo: "Graduação em Direito", descricao: "Faculdades Integradas de Vitória (FDV)." },
];

const publicacoes = [
  { tipo: "artigo", titulo: "Impulsionando o Sucesso Empresarial: A Importância da Diversidade nos Conselhos", meta: "Fev/2024", resumo: "Artigo destacando o valor da diversidade na liderança corporativa.", link: "https://www.linkedin.com/in/rachelfreixo/" },
  { tipo: "livro", titulo: "Questões Controvertidas no CARF — Vol. 2", meta: "Editora Jurídica Nacional", resumo: "Análise de teses tributárias julgadas pelo CARF.", link: null },
  { tipo: "opiniao", titulo: "Reforma Tributária e Equidade: o que o IBS muda para as pequenas empresas", meta: "Gazeta Online · Mar/2024", resumo: "Análise do impacto da Reforma Tributária no contexto das micro e pequenas empresas capixabas.", link: null },
  { tipo: "imprensa", titulo: '"Diversidade no CARF é questão de legitimidade institucional"', meta: "JOTA · Fev/2024", resumo: "Rachel Freixo fala sobre representatividade feminina nos órgãos de julgamento tributário.", link: null },
];

const agenda = [
  { dia: "15", mes: "Abr", ano: "2026", tipo: "Painel", titulo: "Brazil Summit on Tax", local: "George Washington University", descricao: "Liderança de discussões sobre o futuro da tributação internacional transfronteiriça.", link: "https://www.linkedin.com/in/rachelfreixo/", status: "proximo" },
];

const insights = [
  {
    data: "Publicado recentemente",
    titulo: "Hoje foi publicada a Portaria COANA nº 188/2026",
    texto:
      "Hoje foi publicada a Portaria COANA nº 188/2026, que regulamenta a simplificação dos procedimentos de trânsito aduaneiro e estabelece requisitos para o monitoramento de veículos terrestres e de unidades de carga.\n\nMais do que um novo normativo, ela representa a consolidação de uma mudança real na forma de pensar o trânsito aduaneiro no Brasil.\n\nDepois de tanto trabalho, debates, testes e construção conjunta, ver esse projeto ganhar forma normativa é motivo de muita alegria, e também de reconhecimento coletivo.\n\nUm abraço,\nRachel Freixo\n\nÍntegra da Portaria: https://lnkd.in/dk_xEvug",
    linkOriginal: "https://www.linkedin.com/feed/update/urn:li:activity:7453414735804362752/",
    mediaUrl: null,
  },
];

const citacoes = [
  { texto: "O rigor científico é a bússola que orienta a excelência na estratégia tributária.", bg: "bg-white/60", textCol: "text-brand-dark", border: "border-brand-red", quoteMark: "text-brand-dark/10" },
  { texto: "A governança não é apenas um selo, é o alicerce para negócios duradouros.", bg: "bg-brand-dark/90", textCol: "text-white", border: "border-[#E5E5E5]", quoteMark: "text-white/10" },
  { texto: "Desenvolver soluções exige integrar eficiência fiscal e responsabilidade sustentável.", bg: "bg-brand-red/90", textCol: "text-white", border: "border-brand-dark", quoteMark: "text-brand-dark/20" },
  { texto: "O debate acadêmico oxigena e impulsiona as transformações do setor produtivo.", bg: "bg-[#EFECE8]/90", textCol: "text-brand-dark", border: "border-brand-dark", quoteMark: "text-brand-dark/10" },
];

async function main() {
  // Idempotente: limpa antes de inserir.
  await prisma.$transaction([
    prisma.timeline.deleteMany(),
    prisma.publicacao.deleteMany(),
    prisma.evento.deleteMany(),
    prisma.insight.deleteMany(),
    prisma.citacao.deleteMany(),
  ]);
  await prisma.timeline.createMany({ data: timeline });
  await prisma.publicacao.createMany({ data: publicacoes });
  await prisma.evento.createMany({ data: agenda });
  await prisma.insight.createMany({ data: insights });
  await prisma.citacao.createMany({ data: citacoes });
  console.log("[seed] dados recuperados inseridos.");
}

main()
  .catch((e) => {
    console.error("[seed] erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Rodar o seed (Postgres no ar)**

Run: `cd apps/api && pnpm prisma:seed`
Expected: `[seed] dados recuperados inseridos.`

- [ ] **Step 3: Verificar contagem**

Run: `cd apps/api && pnpm prisma db execute --stdin <<< "SELECT count(*) FROM timeline;"`
Expected: 14.

- [ ] **Step 4: Commit**

```bash
git add apps/api/prisma/seed.ts
git commit -m "feat: seed com dados recuperados (timeline, publicacoes, agenda, insights, citacoes)"
```

---

### Task 8: Infra da API — singleton Prisma + logger

**Files:**
- Create: `apps/api/src/db/prisma.ts`, `apps/api/src/lib/logger.ts`

- [ ] **Step 1: Criar `apps/api/src/db/prisma.ts` (singleton)**

```typescript
import { PrismaClient } from "@prisma/client";

// Singleton — toda query passa por aqui. Evita múltiplas conexões em dev/HMR.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

- [ ] **Step 2: Criar `apps/api/src/lib/logger.ts` (logs prefixados por módulo)**

```typescript
type Modulo = "Server" | "DB" | "Auth" | "Storage" | "Timeline";

function emit(level: "info" | "warn" | "error", modulo: Modulo, msg: string): void {
  const line = `[${modulo}] ${msg}`;
  if (level === "error") console.error(line);
  else if (level === "warn") console.warn(line);
  else console.log(line);
}

export const logger = {
  info: (modulo: Modulo, msg: string) => emit("info", modulo, msg),
  warn: (modulo: Modulo, msg: string) => emit("warn", modulo, msg),
  error: (modulo: Modulo, msg: string) => emit("error", modulo, msg),
};
```

- [ ] **Step 3: Verificar typecheck**

Run: `pnpm --filter @rf/api typecheck`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
git add apps/api/src/db/prisma.ts apps/api/src/lib/logger.ts
git commit -m "feat: singleton prisma e logger prefixado na api"
```

---

### Task 9: Bootstrap do Fastify — `buildApp()`, error handler e `/api/health` (TDD)

**Files:**
- Create: `apps/api/src/app.ts`, `apps/api/src/server.ts`
- Test: `apps/api/src/app.health.test.ts`

- [ ] **Step 1: Escrever o teste que falha** (`apps/api/src/app.health.test.ts`)

```typescript
import { describe, it, expect, afterAll } from "vitest";
import { buildApp } from "./app.js";

const app = buildApp();

afterAll(async () => { await app.close(); });

describe("GET /api/health", () => {
  it("responde 200 com status ok", async () => {
    const res = await app.inject({ method: "GET", url: "/api/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `pnpm --filter @rf/api test src/app.health.test.ts`
Expected: FAIL — `buildApp` não existe.

- [ ] **Step 3: Criar `apps/api/src/app.ts` (factory testável)**

```typescript
import Fastify, { type FastifyInstance } from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { logger } from "./lib/logger.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // Error handler central: mensagem genérica ao usuário, log completo no servidor.
  app.setErrorHandler((error, _req, reply) => {
    logger.error("Server", `${error.name}: ${error.message}`);
    const status = error.statusCode ?? 500;
    const publicMsg =
      status >= 500 ? "Erro interno. Tente novamente." : (error.message || "Requisição inválida.");
    reply.status(status).send({ erro: publicMsg });
  });

  app.get("/api/health", async () => ({ status: "ok" }));

  return app;
}
```

- [ ] **Step 4: Rodar e ver passar**

Run: `pnpm --filter @rf/api test src/app.health.test.ts`
Expected: PASS.

- [ ] **Step 5: Criar `apps/api/src/server.ts` (entrypoint)**

```typescript
import { buildApp } from "./app.js";
import { loadEnv } from "./config/env.js";
import { logger } from "./lib/logger.js";

const env = loadEnv();
const app = buildApp();

app
  .listen({ port: env.PORT, host: "0.0.0.0" })
  .then(() => logger.info("Server", `API ouvindo em http://localhost:${env.PORT}`))
  .catch((err) => {
    logger.error("Server", String(err));
    process.exit(1);
  });
```

- [ ] **Step 6: Smoke test manual (terminal com rede/DB)**

Run: `pnpm --filter @rf/api dev` e em outro terminal `curl http://localhost:3333/api/health`
Expected: `{"status":"ok"}`.

- [ ] **Step 7: Commit**

```bash
git add apps/api/src/app.ts apps/api/src/server.ts apps/api/src/app.health.test.ts
git commit -m "feat: bootstrap fastify com error handler e rota de health"
```

---

### Task 10: Fatia vertical `timeline` (repository → service → routes) + teste de integração (TDD)

**Files:**
- Create: `apps/api/src/modules/timeline/timeline.repository.ts`, `timeline.service.ts`, `timeline.routes.ts`
- Create: `apps/api/src/test/db.ts` (helper de DB para testes)
- Modify: `apps/api/src/app.ts` (registrar a rota)
- Test: `apps/api/src/modules/timeline/timeline.routes.test.ts`

- [ ] **Step 1: Criar o helper de testes `apps/api/src/test/db.ts`**

> Usa o banco de testes `DATABASE_URL_TEST`. Antes de rodar os testes, aplicar as migrations
> nesse banco uma vez: `DATABASE_URL=$DATABASE_URL_TEST pnpm prisma migrate deploy`.

```typescript
import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL_TEST;
if (!url) throw new Error("[test] DATABASE_URL_TEST não definido");

export const testPrisma = new PrismaClient({ datasources: { db: { url } } });

export async function resetTimeline(): Promise<void> {
  await testPrisma.timeline.deleteMany();
}
```

- [ ] **Step 2: Escrever o teste que falha** (`apps/api/src/modules/timeline/timeline.routes.test.ts`)

```typescript
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../app.js";
import { testPrisma, resetTimeline } from "../../test/db.js";

const app = buildApp();

beforeAll(async () => {
  await resetTimeline();
  await testPrisma.timeline.createMany({
    data: [
      { ano: "2024", titulo: "Conselheira CARF", descricao: "Julgamento de recursos." },
      { ano: "2019", titulo: "Subsecretária", descricao: "Competitividade ES." },
    ],
  });
});

afterAll(async () => {
  await testPrisma.$disconnect();
  await app.close();
});

describe("GET /api/timeline", () => {
  it("retorna a lista de marcos em ordem decrescente de id", async () => {
    const res = await app.inject({ method: "GET", url: "/api/timeline" });
    expect(res.statusCode).toBe(200);
    const body = res.json() as Array<{ titulo: string }>;
    expect(body).toHaveLength(2);
    expect(body[0]?.titulo).toBe("Subsecretária"); // último inserido, id maior
  });
});
```

> Nota: o teste usa o `buildApp()` padrão, que conecta no `DATABASE_URL` do ambiente. Ao rodar
> os testes, exporte `DATABASE_URL=$DATABASE_URL_TEST` para que o repository use o banco de teste.
> (Comando completo no Step 8.)

- [ ] **Step 3: Rodar e ver falhar**

Run: `pnpm --filter @rf/api test src/modules/timeline/timeline.routes.test.ts`
Expected: FAIL — rota `/api/timeline` não registrada (404).

- [ ] **Step 4: Criar `timeline.repository.ts` (única porta do banco)**

```typescript
import { prisma } from "../../db/prisma.js";
import type { Timeline } from "@rf/shared";

export async function listarTimeline(): Promise<Timeline[]> {
  return prisma.timeline.findMany({ orderBy: { id: "desc" } });
}
```

- [ ] **Step 5: Criar `timeline.service.ts` (regra de negócio)**

```typescript
import type { Timeline } from "@rf/shared";
import * as repo from "./timeline.repository.js";

// Por ora é passthrough; a camada existe para abrigar regra futura sem mexer na rota.
export async function listarTimeline(): Promise<Timeline[]> {
  return repo.listarTimeline();
}
```

- [ ] **Step 6: Criar `timeline.routes.ts` (só HTTP)**

```typescript
import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { timelineSchema } from "@rf/shared";
import * as service from "./timeline.service.js";

export async function timelineRoutes(app: FastifyInstance): Promise<void> {
  app.get("/api/timeline", { schema: { response: { 200: z.array(timelineSchema) } } }, async () => {
    return service.listarTimeline();
  });
}
```

- [ ] **Step 7: Registrar a rota em `apps/api/src/app.ts`**

Adicionar o import no topo e o `register` antes do `return app;`:

```typescript
import { timelineRoutes } from "./modules/timeline/timeline.routes.js";
```

```typescript
  app.get("/api/health", async () => ({ status: "ok" }));
  await app.register(timelineRoutes);

  return app;
```

E tornar a factory assíncrona — assinatura passa a:

```typescript
export async function buildApp(): Promise<FastifyInstance> {
```

Atualizar os consumidores: em `server.ts` trocar `const app = buildApp();` por
`const app = await buildApp();`; nos testes (`app.health.test.ts` e `timeline.routes.test.ts`)
trocar `const app = buildApp();` por `const app = await buildApp();`.

- [ ] **Step 8: Rodar e ver passar** (aplica migrations no banco de teste antes)

```bash
cd apps/api
# cria o banco de teste se ainda não existe e aplica migrations
DATABASE_URL="postgresql://rf:rf_local_dev@localhost:5432/rachel_test?schema=public" pnpm prisma migrate deploy
# roda os testes apontando para o banco de teste
DATABASE_URL="$DATABASE_URL_TEST" pnpm test src/modules/timeline/timeline.routes.test.ts
```

Expected: PASS (2 marcos, primeiro é "Subsecretária").

- [ ] **Step 9: Rodar a suíte inteira e o typecheck**

Run: `pnpm --filter @rf/api typecheck && DATABASE_URL="$DATABASE_URL_TEST" pnpm --filter @rf/api test`
Expected: typecheck limpo; todos os testes passam.

- [ ] **Step 10: Commit**

```bash
git add apps/api/src/modules/timeline apps/api/src/test/db.ts apps/api/src/app.ts
git commit -m "feat: fatia vertical timeline (repository/service/routes) com teste de integracao"
```

---

### Task 11: Documentação da base + README do monorepo

**Files:**
- Create: `README.md` (raiz), `docs/architecture.md`
- Create: `apps/api/README.md`

- [ ] **Step 1: Criar `README.md` raiz** (visão geral + como rodar local)

```markdown
# Site Rachel Freixo — Monorepo

Monorepo pnpm: `apps/web` (site React+Vite), `apps/api` (Fastify+Prisma), `packages/shared` (contratos).

## Rodar local
1. `docker compose -f infra/docker-compose.yml up -d`  (Postgres + MinIO)
2. `pnpm install`
3. `cp apps/api/.env.example apps/api/.env`
4. `cd apps/api && pnpm prisma migrate dev && pnpm prisma:seed`
5. `pnpm dev:api`  (API em http://localhost:3333)

Detalhes de arquitetura em `docs/architecture.md`.
```

- [ ] **Step 2: Criar `docs/architecture.md`** resumindo camadas (routes→service→repository), o pacote `shared`, e o modelo single-service de deploy (referência ao spec em `docs/superpowers/specs/`).

```markdown
# Arquitetura

Ver decisão completa em `docs/superpowers/specs/2026-06-05-refatoracao-arquitetura-fundacao-design.md`.

- **apps/api** — Fastify. Camadas por entidade: `*.routes.ts` (HTTP) → `*.service.ts` (regra) → `*.repository.ts` (Prisma). `config/env.ts` valida ambiente (fail-fast). `db/prisma.ts` é singleton.
- **packages/shared** — DTOs/contratos (zod) compartilhados entre api e web. Zero `any` na fronteira.
- **apps/web** — React+Vite (convertido para TS no Plano 3). Consome a API via `services/`.
- **Deploy** — serviço único no Railway: a API serve o site + `/api`. Postgres e MinIO como serviços Railway.
```

- [ ] **Step 3: Criar `apps/api/README.md`** com scripts (`dev`, `test`, `prisma:migrate`, `prisma:seed`) e a variável `DATABASE_URL_TEST` para testes.

```markdown
# @rf/api

API Fastify + Prisma.

- `pnpm dev` — sobe a API (tsx watch)
- `pnpm test` — testes (precisa de `DATABASE_URL_TEST` e migrations aplicadas nesse banco)
- `pnpm prisma:migrate` / `pnpm prisma:seed`

Testes usam um banco separado (`rachel_test`). Aplique as migrations antes:
`DATABASE_URL=$DATABASE_URL_TEST pnpm prisma migrate deploy`.
```

- [ ] **Step 4: Commit**

```bash
git add README.md docs/architecture.md apps/api/README.md
git commit -m "docs: README do monorepo e doc de arquitetura"
```

---

## Self-Review (verificado contra o spec)

**1. Cobertura do spec (Fase 1, parte de base):**
- Monorepo (spec §4.2) → Task 1, 3, 4 ✓
- Infra local pg+minio (spec §4.8 dev) → Task 2 ✓
- Camadas backend routes/service/repository (spec §4.3) → Task 10 ✓
- `config/env` fail-fast (spec §4.3) → Task 5 ✓
- Singleton Prisma + logger prefixado (spec §4.3) → Task 8 ✓
- Error handler genérico (spec §5) → Task 9 ✓
- Modelo de dados 8 tabelas (spec §4.5) → Task 6 ✓
- Seed com dados recuperados (spec §11) → Task 7 ✓
- Tipos compartilhados / zero `any` (spec §4.2) → Task 3 + Task 10 ✓
- Testes (spec §6) → Tasks 5, 9, 10 ✓
- Docs como código (spec §7) → Task 11 ✓
- **Fora do escopo deste plano (vão para Planos 2-4):** demais CRUDs, auth JWT, MinIO upload,
  oembed, conversão TS do front, troca da fonte de dados no front, deploy Railway. ✓ (intencional)

**2. Placeholders:** nenhum "TBD"/"TODO"; todo passo de código tem o código real.

**3. Consistência de tipos/nomes:** `Timeline` (shared) usado em repository/service/routes;
`listarTimeline()` consistente nas 3 camadas; `buildApp()` vira `async` na Task 10 e os 3
consumidores (server + 2 testes) são atualizados no mesmo passo. Modelos Prisma (`Evento`→`agenda`)
batem com os nomes usados no seed (`prisma.evento`).

**Item de atenção registrado:** `buildApp()` nasce síncrono na Task 9 e vira `async` na Task 10
(quando passa a registrar rota com `await`). A Task 10 Step 7 já instrui atualizar server e testes.
