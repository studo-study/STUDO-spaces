# STUDO-backend

Backend for the web application STUDO, built with NestJS, Drizzle ORM, and Vitest.

## Requirements

- [NodeJS v22 (LTS)](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-windows/)

## Before starting/testing this project

Create a `.env` (development) or `.env.test` (testing) file with the following template. Complete the environment
variables with your secrets, credentials, etc.

```bash
# General configuration
NODE_ENV=testing
PORT=3001

# CORS configuration
CORS_ORIGINS=["http://localhost:5173"]
CORS_MAX_AGE=10800

# Database configuration
DATABASE_URL=postgresql://devusr:devpwd@localhost:5433/studo_test

# Auth configuration
AUTH_JWT_SECRET=eensuperveiligsecretvoorindevelopment
AUTH_JWT_AUDIENCE=studo-(api)
AUTH_JWT_ISSUER=studo-(api)
AUTH_HASH_LENGTH=32
AUTH_HASH_TIME_COST=6
AUTH_HASH_MEMORY_COST=65536
AUTH_MAX_DELAY=2000

# Logging configuration
LOG_DISABLED=true
```

## Start this project

### Development

1. Install all dependencies:

```bash
pnpm install
```

2. Make sure a `.env` exists (see above)

3. Create a database with the name given in the `.env` file

4. Generate the database:

```bash
pnpm db:generate
```

5. Migrate the database:

```bash
pnpm db:migrate
```

6. Seed the database:

```bash
pnpm db:seed
```

7. Start the development server:

```bash
pnpm start:dev
```

### Production

1. Install all dependencies:

```bash
pnpm install
```

2. Make sure all environment variables are available in the environment

3. Create a database with the name given in the environment variable

4. Migrate the database:

```bash
pnpm db:migrate
```

5. Start the production server:

```bash
pnpm start
```

### Running Tests

The test database will be created and dropped each time the tests are run! You don't have to specify the DATABASE_URL in
the `.env.test` file.

- Install all dependencies: `pnpm install`
- Make sure `.env.test` exists (it's recommended to disabled logging in the testing environment)
- Run the tests: `pnpm test:e2e`
    - This will start a new server for each test suite that runs, you won't see any output as logging is disabled to
      make output more clean.
    - To enable logging change the config parameter `LOG_DISABLED` to `false`.
    - The user suite will take 'long' (around 6s) to complete, this is normal as many cryptographic operations are being
      performed.

### Usefull Scripts

| Script                | Description                                |
|-----------------------|--------------------------------------------|
| `pnpm start`          | Start production server                    |
| `pnpm start:dev`      | Start development server with watch mode   |
| `pnpm start:debug`    | Start server in debug mode                 |
| `pnpm build`          | Build the NestJS application               |
| `pnpm lint`           | Lint the code and auto-fix issues          |
| `pnpm format`         | Format the code using Prettier             |
| `pnpm test:e2e`       | Run all end-to-end tests                   |
| `pnpm test:e2e:watch` | Run tests in watch mode                    |
| `pnpm db:migrate`     | Migrate the database to the latest version |
| `pnpm db:drop`        | Drop the database                          |
| `pnpm db:reset`       | Drop and reset the database                |
| `pnpm db:seed`        | Seed the database with initial/test data   |
