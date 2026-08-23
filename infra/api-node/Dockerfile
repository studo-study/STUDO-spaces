# variabeles
ARG NODE_VERSION=24.13.0-slim


# pruner
FROM node:${NODE_VERSION} AS pruner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate
COPY . .
RUN npx --yes turbo@2.9.3 prune @studo/api-node --docker


# installer
FROM node:${NODE_VERSION} AS installer
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile


# builder
FROM node:${NODE_VERSION} AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

RUN npx turbo build --filter=@studo/api-node


# runner
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Isolated pnpm resolves runtime deps via BOTH the root store and the package's
# own node_modules (symlinks into ../../node_modules/.pnpm) — copy both.
COPY --from=installer /app/node_modules ./node_modules
COPY --from=installer /app/apps/api-node/node_modules ./apps/api-node/node_modules
COPY --from=builder /app/apps/api-node/dist ./apps/api-node/dist
COPY --from=builder /app/apps/api-node/package.json ./apps/api-node/package.json
# drizzle.config out is './migrations'; ship that dir (not the schema src)
COPY --from=builder /app/apps/api-node/migrations ./apps/api-node/migrations
COPY --from=builder /app/apps/api-node/drizzle.config.ts ./apps/api-node/drizzle.config.ts

EXPOSE 3000
# Run from the package dir so drizzle-kit resolves ./migrations correctly
WORKDIR /app/apps/api-node
CMD ["sh", "-c", "npx drizzle-kit migrate --config=drizzle.config.ts && node dist/main.js"]