# ---- build ----
FROM node:22-slim AS build
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app

# manifestos primeiro (cache de deps)
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
RUN pnpm install --frozen-lockfile

# código + build (shared -> api -> web)
COPY . .
RUN pnpm --filter @rf/shared build \
 && pnpm --filter @rf/api build \
 && pnpm --filter web build

# ---- runtime ----
FROM node:22-slim AS runtime
RUN corepack enable && corepack prepare pnpm@10.33.4 --activate
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
ENV SERVE_WEB=true
ENV PORT=3333
COPY --from=build /app ./
EXPOSE 3333
# aplica migrations e sobe o serviço único (site + /api)
CMD ["sh", "-c", "pnpm --filter @rf/api exec prisma migrate deploy && node apps/api/dist/server.js"]
