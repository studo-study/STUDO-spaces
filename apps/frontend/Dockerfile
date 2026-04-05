# 👇 1
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# 👇 2
RUN corepack enable

WORKDIR /usr/src/app
COPY . .

# 👇 1
FROM base AS build

# 👇 3
ARG VITE_API_URL
# 👇 3
ENV VITE_API_URL=$VITE_API_URL

# 👇 3
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
# 👇 3
RUN pnpm run build


# 👇 1
FROM nginx:1.27.4-alpine

COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm -rf /usr/share/nginx/html/*

# 👇 4
COPY --from=build /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]