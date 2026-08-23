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

# Copy the fully-installed & built workspace subset from the builder so all pnpm
# symlinks resolve at runtime — including the workspace package @studo/types,
# which the compiled dist require()s. Cherry-picking only dist + node_modules
# leaves that symlink dangling (packages/shared-types missing) → boot crash.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api-node ./apps/api-node

EXPOSE 3000
# Run from the package dir so drizzle-kit resolves ./migrations correctly
WORKDIR /app/apps/api-node
# nest compiles to dist/src/main.js in this monorepo (tsc preserves src/ due to
# the @studo/types project reference), not dist/main.js
CMD ["sh", "-c", "npx drizzle-kit migrate --config=drizzle.config.ts && node dist/src/main.js"]