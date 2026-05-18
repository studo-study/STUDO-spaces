FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apk add --no-cache libc6-compat

# --------------------
FROM base AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared-types/package.json ./packages/shared-types/
COPY apps/api-node/package.json ./apps/api-node/

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --------------------
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared-types/node_modules ./packages/shared-types/node_modules
COPY --from=deps /app/apps/api-node/node_modules ./apps/api-node/node_modules

COPY packages/shared-types ./packages/shared-types
COPY apps/api-node ./apps/api-node
COPY package.json pnpm-workspace.yaml tsconfig.json ./

RUN pnpm --filter @studo/types build
RUN pnpm --filter @studo/api-node build

# --------------------
FROM base AS runner
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api-node/node_modules ./apps/api-node/node_modules
COPY --from=builder /app/apps/api-node/dist ./apps/api-node/dist
COPY --from=builder /app/apps/api-node/migrations ./apps/api-node/migrations
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist

EXPOSE 3000
CMD ["node", "apps/api-node/dist/main"]
