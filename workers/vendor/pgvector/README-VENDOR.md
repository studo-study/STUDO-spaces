# Vendored pgvector (0.4.2)

This is a local copy of [`pgvector`](https://crates.io/crates/pgvector) `0.4.2` with a
**single deliberate change** in `Cargo.toml`.

## Why it's vendored

Upstream `pgvector` pins its optional `diesel` dependency to diesel's `postgres` feature:

```toml
diesel = { version = "2", ..., features = ["postgres"] }
```

Diesel's `postgres` feature = `postgres_backend` **plus** `pq-sys`, which links against
**libpq**, the PostgreSQL C client library. On macOS (Homebrew keg-only libpq) that makes
`cargo build` fail at link time with:

```
ld: library 'pq' not found
```

But this crate connects to Postgres through **diesel-async / tokio-postgres** (pure Rust) —
libpq is never called at runtime. pgvector's diesel code only needs the Pg `ToSql`/`FromSql`
impls, which live in `postgres_backend`. So we changed the pin to:

```toml
diesel = { version = "2", ..., features = ["postgres_backend"] }
```

This removes `pq-sys`/libpq from the dependency graph entirely — no C library, simpler CI,
and no `LIBRARY_PATH` / `.cargo/config.toml` linker hacks.

The workspace `Cargo.toml` wires this in via:

```toml
[patch.crates-io]
pgvector = { path = "vendor/pgvector" }
```

## Maintenance

- Only `Cargo.toml` differs from upstream `0.4.2`; `src/` is unmodified.
- When bumping pgvector, re-copy `src/` + `Cargo.toml` from the new release and re-apply the
  `postgres` → `postgres_backend` change. If upstream ever ships this fix, drop the vendor and
  the `[patch.crates-io]` entry.
