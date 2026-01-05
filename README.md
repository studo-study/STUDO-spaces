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

# JWT & authenticatie instellingen:
AUTH_JWT_SECRET=...
AUTH_JWT_AUDIENCE=studo-(api)
AUTH_JWT_ISSUER=studo-(api)

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

# Object storage om afbeeldingen in weg te schrijven
SCALEWAY_ACCESS_KEY=...
SCALEWAY_SECRET_KEY=...
SCW_DEFAULT_ORGANIZATION_ID=...
SCW_DEFAULT_PROJECT_ID=...
SCALEWAY_BUCKET_NAME=visualsets-images
SCALEWAY_REGION=fr-par

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

```

### Development:

Controleer ook zeker of de `.env` voor de back-end klopt met diegene die hierboven beschreven staat, naast die `.env`
voor
development moet je ook een `.env.test` creëeren die puur bedoeld is voor testing, deze moet het volgende bevatten:

```bash
# Algemene configuratie
NODE_ENV=testing
PORT=...

# CORS configuratie
CORS_ORIGINS=["http://localhost:5173"]
CORS_MAX_AGE=...

# Auth configuratie
AUTH_JWT_SECRET=...
AUTH_JWT_AUDIENCE=studo-(api)
AUTH_JWT_ISSUER=studo-(api)
AUTH_HASH_LENGTH=XX
AUTH_HASH_TIME_COST=X
AUTH_HASH_MEMORY_COST=XXXXX
AUTH_MAX_DELAY=XXXX

# Logging configuratie
LOG_DISABLED=true
```

Creëer daarna ook de databank die beschreven staat in de `.env.test`. Dit gaat via volgend commando:

```bash
pnpm db:generate
```

Migreer daarna de database:

```bash
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
