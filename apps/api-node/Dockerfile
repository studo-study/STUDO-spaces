# variabeles
ARG NODE_VERSION=24.13.0-slim


# pruner
FROM node:${NODE_VERSION} AS pruner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install -g turbo
COPY . .
RUN turbo prune @studo/api-node --docker


# installer
FROM node:${NODE_VERSION} AS installer
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile


# builder
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

RUN npx turbo build --filter=@studo/api-node


# runner
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=installer /app/node_modules ./node_modules
COPY --from=builder /app/apps/api-node/dist ./apps/api-node/dist
COPY --from=builder /app/apps/api-node/package.json ./apps/api-node/package.json
COPY --from=builder /app/apps/api-node/drizzle ./apps/api-node/drizzle
COPY --from=builder /app/apps/api-node/drizzle.config.ts ./apps/api-node/drizzle.config.ts

EXPOSE 3000
CMD ["sh", "-c", "npx drizzle-kit migrate --config=apps/api-node/drizzle.config.ts && node apps/api-node/dist/main.js"]