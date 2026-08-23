# edition = "2024" in workers/Cargo.toml requires Rust >= 1.85
ARG RUST_VERSION=1.90

# builder
FROM rust:${RUST_VERSION}-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Manifests + vendored pgvector crate (referenced via [patch.crates-io])
COPY workers/Cargo.toml workers/Cargo.lock ./
COPY workers/vendor ./vendor

# Cache dependency compilation with a dummy main
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Real sources
COPY workers/src ./src
RUN cargo build --release

# runner
FROM debian:bookworm-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y \
    ca-certificates \
    libssl3 \
    && rm -rf /var/lib/apt/lists/*

# Binary name = package name ("workers")
COPY --from=builder /app/target/release/workers /usr/local/bin/workers

CMD ["workers"]
