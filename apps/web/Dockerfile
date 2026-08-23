# variabeles
ARG NODE_VERSION=24.13.0-slim


# pruner
FROM node:${NODE_VERSION} AS pruner
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm install -g turbo
COPY . .
RUN turbo prune @studo/web --docker


# installer
FROM node:${NODE_VERSION} AS installer
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile


# builder
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

ARG NEXT_PUBLIC_FRONTEND
ARG NEXT_PUBLIC_MARKETING
ARG NEXT_PUBLIC_VERSION
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_BACKEND_URL
ARG NEXT_PUBLIC_OPENBREIN
ARG NEXT_PUBLIC_BETA
ARG NEXT_PUBLIC_PREMIUM

RUN corepack enable && corepack prepare pnpm@9 --activate
COPY --from=installer /app/ .
COPY --from=pruner /app/out/full/ .

ENV NEXT_PUBLIC_FRONTEND=$NEXT_PUBLIC_FRONTEND
ENV NEXT_PUBLIC_MARKETING=$NEXT_PUBLIC_MARKETING
ENV NEXT_PUBLIC_VERSION=$NEXT_PUBLIC_VERSION
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NEXT_PUBLIC_OPENBREIN=$NEXT_PUBLIC_OPENBREIN
ENV NEXT_PUBLIC_BETA=$NEXT_PUBLIC_BETA
ENV NEXT_PUBLIC_PREMIUM=$NEXT_PUBLIC_PREMIUM
RUN npx turbo build --filter=@studo/web


# runner
FROM node:${NODE_VERSION} AS runner
WORKDIR /app
ENV PORT=4000
ENV NODE_ENV=production
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

EXPOSE 4000
CMD ["node", "apps/web/server.js"]