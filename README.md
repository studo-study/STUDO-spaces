# Examenopdracht Front-end Web Development & Web Services

- Student: Charles Degraeuwe
- Studentennummer: 240709758250
- E-mailadres: <charles.degraeuwe@student.hogent.be>

## Vereisten (voor zowel front- als back-end):

- [NodeJS](https://nodejs.org) (20 of hoger)
- [NestJs](https://nestjs.com/)
- [pnpm](https://pnpm.io)
- [git](https://git-scm.com/install/)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-windows/)
- [Docker](https://www.docker.com/)
- [Browser](https://www.firefox.com/) (als test omgeving)

## Installatie:

Begin natuurlijk met de repository te clonen van GitHub:

```bash
# Clone de repository
git clone https://github.com/HOGENT-frontendweb/frontendweb-2526-degraeuwechareles
```

Om deze applicatie te runnen is er zo goed als geen voorkennis nodig: via volgend commando kan men alle dependencies
installeren:

```bash
# navigeer eerst naar de front-end
cd frontend
# installeer alle dependencies
pnpm install

# navigeer daarna naar de back-end
cd ..
cd backend
# installeer ook daar alle dependencies
pnpm install

```

Creëer daarna ook twee `.env's`, één binnen de root frontend folder en één binnen de root backend.
Deze moet volgende gegevens bevatten.

### Front-end `.env`:

```bash
VITE_API_URL=http://localhost:3000/api
VITE_USER_ID=1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb
```

### Back-end `.env`:

```bash
# Database configuratie:
NODE_ENV=development
PORT=3000
CORS_ORIGINS=["http://studo-app-frontend"]
CORS_MAX_AGE=10800
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/studo

# JWT & authenticatie instellingen:
AUTH_JWT_SECRET=...
AUTH_JWT_AUDIENCE=studo-api
AUTH_JWT_ISSUER=studo-api

# configuratie voor Aragon password hashing
AUTH_HASH_LENGTH=32
AUTH_HASH_TIME_COST=6
AUTH_HASH_MEMORY_COST=65536
AUTH_MAX_DELAY=2000
AUTH_JWT_EXPIRATION_INTERVAL=2592000

# OAuth voor Google login (ga hiervoor naar Google Cloud Console)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:3000/api/sessions/google/callback

# OAuth voor Microsoft login (ga hiervoor naar Azure)
MICROSOFT_CLIENT_ID=...
MICROSOFT_CLIENT_SECRET=...
MICROSOFT_CALLBACK_URL=http://localhost:3000/api/sessions/microsoft/callback

# OAuth voor Facebook login (ga hiervoor naar Facebook Developer)
FACEBOOK_CLIENT_ID=...
FACEBOOK_CLIENT_SECRET=...
FACEBOOK_CALLBACK_URL=http://localhost:3000/api/sessions/facebook/callback

# Object storage om afbeeldingen in weg te schrijven
SCALEWAY_ACCESS_KEY=...
SCALEWAY_SECRET_KEY=...
SCW_DEFAULT_ORGANIZATION_ID=...
SCW_DEFAULT_PROJECT_ID=...
SCALEWAY_BUCKET_NAME=visualsets-images
SCALEWAY_REGION=fr-FR-par

FRONTEND_URL=http://localhost:80
```

## Front-end:

De front-end van STUDO is ontwikkeld in React en maakt gebruik van UI-bibliotheken zoals Tailwind CSS en Animate.css.
STUDO is een platform dat studenten helpt om zo efficiënt en snel mogelijk te studeren. Daarom heb ik bewust ingespeeld
op specifieke niches, zoals anatomie en vocabulaire, waar gerichte leermethoden een grote meerwaarde bieden.

### Verreisten:

- [NodeJS](https://nodejs.org) (20 of hoger)
- [pnpm](https://pnpm.io)
- [git](https://git-scm.com/install/)
- [Browser](https://www.firefox.com/) (als test omgeving)

### Opstarten:

Het opstarten gebeurt zoals in elke andere uitgegeven applicatie:

```bash
# navigeer eerst naar de front-end map
cd frontend

# run daarna de docker compose file 
docker compose up

# om de front-end te runnen
pnpm dev
```

Check zeker of de `.env` en `environment variables` zoals hierboven beschreven staat bestaat.

### Testen:

#### Korte beschrijving:

Ik heb gebruik gemaakt van cypress om mijn frontend te testen. Cypress is een end-to-end testing framework waarmee je
webapplicaties automatisch test door echte gebruikersinteracties in de browser te simuleren. Cypress zelf draait direct
in de browser, deze is op te starten met het simpele commando:

```bash
pnpm test
```

#### Gebruik:

Start de frontend in development mode: `pnpm dev`
Start Cypress: `pnpm test`
Dit opent de Cypress Test Runner in de browser

Voor headless runs (bv. CI): `pnpm test:headless`

Cypress bestuurt zelf de browser en toont duidelijke fouten en snapshots bij falende tests
*Wegen tijdsgebrek en knopen moeten doorhakken, slagen deze wel niet allemaal.*

## Back-end:

Backend for the web application STUDO, built with NestJS, Drizzle ORM, and Vitest.

### Requirements:

- [NodeJS v22 (LTS)](https://nodejs.org/)
- [NestJs](https://nestjs.com/)
- [pnpm](https://pnpm.io)
- [git](https://git-scm.com/install/)
- [PostgreSQL](https://www.postgresql.org/)
- [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-windows/)
- [Docker](https://www.docker.com/)
- [Postman](https://www.postman.com/)
-

### Opstarten:

Navigeer om te beginnen naar de juiste root folder:

```bash
# navigeer eerst naar de front-end map
cd ..
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
AUTH_JWT_AUDIENCE=studo-api
AUTH_JWT_ISSUER=studo-api
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
```

Seed de database:

```bash
pnpm db:seed
```

Start de development server:

```bash
pnpm start:dev
```

Om de database eventueel te resetten voor een nieuwe migratie run:

```bash
pnpm db:reset
```

### Productie:

Dit is heel simpel Run de docker compose file:

```bash
# run de docker compose file 
docker compose -f docker-compose-backend.yml up

# seed nu éénmalig
pnpm db:seed
```

### Testing

Voor testing heb ik gekozen voor Vitest.
De testdatabase wordt bij elke test-run automatisch aangemaakt en opnieuw verwijderd. Je hoeft de DATABASE_URL niet te
definiëren in het bestand .env.test.

* Installeer alle dependencies: pnpm install

* Zorg ervoor dat .env.test bestaat (het is aangeraden om logging uit te schakelen in de testomgeving)

* Start de tests: pnpm test:e2e

* Voor elke testsuite wordt een nieuwe server opgestart; je ziet geen output omdat logging is uitgeschakeld om de output
  overzichtelijk te houden

* Om logging te activeren, zet de configuratieparameter LOG_DISABLED op false

* De user-testsuite duurt relatief lang (ongeveer 6 seconden); dit is normaal omdat er veel cryptografische operaties
  worden uitgevoerd en zeer veel data wordt opgevraagd.

### Handige Scripts

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
