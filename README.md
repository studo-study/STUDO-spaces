# STUDO-Mobile

STUDO is een platform dat studenten helpt om zo efficiënt en snel mogelijk te studeren. De applicatie speelt in op specifieke niches, zoals anatomie en vocabulaire, waar gerichte leermethoden een grote meerwaarde bieden.

## Tech Stack

**Frontend:** Next Js, Tailwind CSS, Animate.css  
**Backend:** NestJS, Drizzle ORM, PostgreSQL  
**Testing:** Cypress (frontend), Vitest (backend)  
**Infrastructure:** Docker, Scaleway (object storage)

## Vereisten

- [Node.js](https://nodejs.org) v20+
- [pnpm](https://pnpm.io)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)

## Installatie

```bash
git clone https://github.com/studo-study/STUDO.git
cd STUDO

# Frontend dependencies
cd frontend && pnpm install

# Backend dependencies
cd ../backend && pnpm install
```

## Configuratie

### Frontend `.env`

```bash
VITE_API_URL=http://localhost:3000/api
```

### Backend `.env`

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studo

# JWT
AUTH_JWT_SECRET=your-secret-here
AUTH_JWT_AUDIENCE=studo-api
AUTH_JWT_ISSUER=studo-api
AUTH_JWT_EXPIRATION_INTERVAL=2592000

# Password hashing (Argon2)
AUTH_HASH_LENGTH=32
AUTH_HASH_TIME_COST=6
AUTH_HASH_MEMORY_COST=65536
AUTH_MAX_DELAY=2000

# CORS
CORS_ORIGINS=["http://localhost:5173"]
CORS_MAX_AGE=10800

# OAuth (optioneel)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/api/sessions/google/callback

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_CALLBACK_URL=http://localhost:3000/api/sessions/microsoft/callback

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/sessions/facebook/callback

# Object storage (optioneel)
SCALEWAY_ACCESS_KEY=
SCALEWAY_SECRET_KEY=
SCALEWAY_BUCKET_NAME=
SCALEWAY_REGION=

FRONTEND_URL=http://localhost:5173
```

## Development

### Frontend

```bash
cd frontend
pnpm dev
```

### Backend

```bash
cd backend

# Database setup
pnpm db:migrate
pnpm db:seed

# Start server
pnpm start:dev
```

## Productie (Docker)

```bash
# Frontend
cd frontend
docker compose up

# Backend
cd backend
docker compose -f docker-compose-backend.yml up
pnpm db:seed  # eenmalig
```

## Testing

### Frontend (Cypress)

```bash
cd frontend
pnpm dev          # start eerst de dev server
pnpm test         # open Cypress UI
pnpm test:headless  # headless voor CI
```

### Backend (Vitest)

```bash
cd backend
pnpm test:e2e
```

> De testdatabase wordt automatisch aangemaakt en opgeruimd per test-run.

## Scripts

| Script | Beschrijving |
|--------|--------------|
| `pnpm start:dev` | Development server met hot reload |
| `pnpm build` | Build voor productie |
| `pnpm lint` | Lint code |
| `pnpm format` | Format code met Prettier |
| `pnpm db:migrate` | Migreer database |
| `pnpm db:seed` | Seed database |
| `pnpm db:reset` | Reset database |

**succes**
