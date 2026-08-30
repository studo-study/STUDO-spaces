# Studo

**Building the studytools of tomorrow**

Studo is een all-in-one studeerplatform. Het splitst studeren en student zijn op in vier aspecten — het **voorbereidende**,
het **opvolgende**, het **leer-** en het **sociale** aspect — en voorziet elke student van genoeg boilerplate om eender
welke studie volledig binnen Studo tot een goed einde te brengen.

Twee kernprincipes sturen elke feature:

- **_"It just works"_** — elke feature werkt met minimale setup en input.
- **Opschaalbaar tot powertool** — hoe meer user input, des te beter de performance. Casual-users én power-users worden
  bediend, oppervlakkig of zeer diepgaand.

> Volledige productscope: [`docs/Scope.md`](docs/Scope.md).

---

## Waarom Studo?

Studenten gebruiken gemiddeld 3 tot 5 losse tools om te studeren: Quizlet voor vocabulaire, Anki voor herhaling, Notion
voor notities, losse PDF's voor schema's. Geen van deze tools is gebouwd voor de complexiteit van hoger onderwijs — denk
aan anatomie, STEM-vakken of medische opleidingen.

Studo bundelt dat in één adaptief platform, rond een centrale AI-laag die groeit met elk geüpload document:

- **Vakken**: de basisentiteit. Een vak wordt aangemaakt met enkel een titel en groepeert vak-resources, een
  kennisdatabank en externe resources. Aanvulbare metadata (examendatum, lesdagen, semester, studiepunten) voedt de AI.
- **Kennisdatabank**: geüploade cursussen worden weggeschreven naar object-storage, gechunkt, geëmbed (pgvector) en
  gestructureerd (hoofdstukken, secties). Deze doorzoekbare pool van chunks voedt élke andere feature — hoe meer en beter
  gestructureerd materiaal, hoe accurater alles wordt.
- **Flow**: een opvolgbord per vak, weergeefbaar als spreadsheet, kanban, kalender of tijdlijn (zelfde onderliggende
  rijen/kolommen). Rijen linken naar entiteiten (documenten, taken, proefexamens, Studosets, Visualsets, notities,
  samenvattingen). De kennisdatabank kan rij-suggesties, deadline-spreiding, gap-detectie en automatische voortgang voeden.
- **Boards**: verzamelingen van vakken, gemodelleerd op academiejaren, met overzicht- en planner-tab.
- **Studosets**: rijke flashcards (tekst, KaTeX, Shiki-code, afbeeldingen) met spaced repetition (FSRS). Manueel,
  (semi-)automatisch uit de kennisdatabank, of geïmporteerd (bv. Quizlet).
- **Visualsets**: afbeeldingen met pins/vectoren gekoppeld aan definities — ideaal voor anatomie, kaarten, diagrammen.
  Leer via _Pin_ (duid de locatie aan) of _Point_ (geef de definitie). Draait op dezelfde FSRS-logica.
- **Notes**: native, in-Studo geschreven markdown-resources met versiegeschiedenis, optioneel gekoppeld aan de
  kennisdatabank.
- **Leersessies**: Learn (FSRS-adaptief), Speedy (tijdsgebonden) en Classic flashcards, met kaarten flaggen, pomodoro,
  20/20/20 en printen (woordenlijst / schema). AI stelt remediëring voor op onvoldoende gekende kaarten.
- **Vak-samenwerking**: een vak delen met Viewer / Editor / Owner rollen (naar analogie met Google Drive). De content-laag
  is gedeeld; Flow en de FSRS-leerstand blijven altijd persoonlijk.

---

## Tech Stack

| Layer          | Technologie                                                                    |
| -------------- | ------------------------------------------------------------------------------ |
| Frontend       | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Radix UI        |
| Marketing      | Astro (aparte rep, statisch, geen auth)                                        |
| Dev-tools      | Vite 7, React Router 7, Tailwind 4                                             |
| Backend (Node) | NestJS 11, Express 5, Drizzle ORM, Swagger                                     |
| Backend (Rust) | Rust worker — Diesel (async) + pgvector, pdfium-render (PDF), Tokio            |
| Mobile         | Flutter                                                                        |
| Database       | PostgreSQL + pgvector (embeddings), Redis (cache + streams-queue)              |
| Storage        | S3-compatible object storage (AWS SDK)                                         |
| Auth (Web)     | NextAuth 5 (Google, Microsoft Entra ID, Credentials)                           |
| Auth (API)     | NestJS Passport — Google / Microsoft / Facebook OAuth + JWT, argon2            |
| AI             | Google Generative AI (Gemini) + RAG-pipeline (pgvector, text-splitter) in Rust |
| State / Data   | Zustand, TanStack React Query                                                  |
| Validatie      | Zod, react-hook-form, class-validator                                          |
| Email          | Resend                                                                         |
| Push           | Firebase (FCM)                                                                 |
| i18n           | next-intl (en, nl, fr, es)                                                     |
| Testing        | Vitest + Testcontainers (api-node)                                             |
| Tooling        | pnpm workspaces, Turborepo, ESLint 9, Prettier, Husky, Knip                    |
| Infra          | Docker + Coolify op Hetzner; Turborepo. Per-service Dockerfiles in `infra/`    |

## Monorepo Structuur

```
studo-spaces/
├── apps/
│   ├── api-node/             # NestJS API (Drizzle, Redis, S3, Passport)
│   │   ├── src/
│   │   │   └── drizzle/      # schema + provider (Drizzle ORM)
│   │   ├── test/
│   │   └── drizzle.config.ts
│   │
│   ├── web/                  # Next.js hoofd-app (auth, app-features)
│   │   ├── app/
│   │   ├── components/
│   │   ├── store/            # Zustand
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── messages/         # i18n vertalingen
│   │
│   ├── dev-tools/            # Vite intern tool
│   └── mobile/               # Flutter app
│       ├── android/
│       ├── ios/
│       └── lib/
│
├── workers/                  # Rust worker (Diesel + pgvector, pdfium, Redis streams)
│   ├── src/
│   └── Cargo.toml
│
├── infra/                    # Dockerfiles per service (Coolify / Hetzner)
│   ├── web/                  # Next.js standalone image
│   ├── api-node/             # NestJS image (+ drizzle migrate on start)
│   ├── rust-services/        # Rust worker image
│   ├── postgres/             # Postgres + pgvector (init.sql)
│   └── redis/                # Redis (cache + streams-queue, redis.conf)
│
├── packages/
│   ├── ui/                   # gedeelde React-componenten (@studo/ui)
│   ├── i18n/                 # next-intl routing (@studo/i18n)
│   ├── shared-types/         # gedeelde TypeScript types (@studo/types)
│   ├── utils/                # gedeelde helpers (@studo/utils)
│   └── config/               # gedeelde config
│
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

Gemanaged met **pnpm workspaces** en **Turborepo**.

---

## Getting Started

### Vereisten

- Node.js ≥ 20
- pnpm ≥ 11
- Docker
- Rust toolchain + Diesel CLI (voor `workers/`)
- Dart & Flutter SDK

### Installatie

```bash
# Clone de repo
git clone https://github.com/studo-study/STUDO-web.git
cd STUDO-web

# Installeer dependencies (één root-install voor de hele workspace)
pnpm install
# of via make
make install

# Eén root .env — alle apps lezen hieruit (geen distributie meer nodig)
cp .env.example .env   # vul de waarden in
```

### Docker

```bash
# PostgreSQL & Redis container starten
make start-docker
```

### Database

```bash
# Migraties genereren
pnpm db:generate

# Migraties uitvoeren
pnpm db:migrate

# Database seeden
pnpm db:seed

# Database resetten (drop + recreate)
pnpm db:reset
```

### Development

```bash
# Start alles via Turborepo
make start-all

# Of individueel
make start-web      # Next.js op :4000
make start-api      # NestJS op :3000
make start-workers  # Rust workers
```

### Build

```bash
# Build alle apps
pnpm build
make build-workers


# Of individueel
pnpm build:web
pnpm build:api
make build-workers
```

### Docker Deployment (Coolify / Hetzner)

Elke service heeft een eigen Dockerfile onder `infra/<service>/`. Belangrijk:

- **web / api-node / rust-services** bouwen met **build-context = repo-root** (ze gebruiken `turbo prune` resp. de vendored `pgvector`-crate). In Coolify: build-context `/`, Dockerfile-pad `infra/<service>/Dockerfile`.
- **postgres / redis** bouwen vanuit hun eigen map (ze `COPY` lokaal `init.sql` / `redis.conf`).
- **redis**: wachtwoord wordt runtime geïnjecteerd via de env-var `REDIS_PASSWORD` (Coolify-secret), niet in `redis.conf`.
- **api-node** draait bij start automatisch `drizzle-kit migrate` vóór de server.

```bash
# Lokaal images bouwen (zelfde contexten als Coolify)
make docker-build-all
# of per service
make docker-build-web
make docker-build-api
make docker-build-workers

# Lokale dev-stack (Postgres + Redis)
make start-docker

# Volledige backend stack (compose)
make start-docker-api
make start-docker-api-seeded   # met seeding
make stop-docker
```

---

## Scripts

| Command                  | Beschrijving                                   |
| ------------------------ | ---------------------------------------------- |
| `make init-all`          | Installeert dependencies voor alle applicaties |
| `make init-api`          | Installeert dependencies voor api              |
| `make init-web`          | Installeert dependencies voor web              |
| `make init-workers`      | Installeert dependencies voor workers          |
| `pnpm build`             | Build alle apps                                |
| `pnpm lint`              | Lint alle apps                                 |
| `make start-all`         | Start alle apps via Turborepo                  |
| `make start-docker`      | Start docker container op                      |
| `make start-web`         | Start alleen de frontend                       |
| `make start-api`         | Start alleen de api                            |
| `make start-workers`     | Start alleen Rust workers                      |
| `pnpm build:web`         | Build alleen de frontend                       |
| `pnpm build:api`         | Build alleen de api                            |
| `make build-workers`     | Build Rust workers (release)                   |
| `make docker-build-all`  | Bouw alle service-images (Coolify/Hetzner)     |
| `pnpm db:generate`       | Genereer migraties uit schema wijzigingen      |
| `pnpm db:migrate`        | Voer migraties uit                             |
| `pnpm db:seed`           | Seed de database                               |
| `pnpm db:reset`          | Reset de database                              |
| `pnpm db:reset-and-seed` | Reset en seed de database in één stap          |
| `make ci`                | Start alle ci tests                            |
| `make analyze`           | Analyseert code base, zoekt naar leaks         |
| `make clean-frontend`    | Wiped NextJS cache                             |
| `make count-lines`       | Telt alle lijnen code in repo                  |

---

## Roadmap

**Voorbereidend aspect**

- [ ] Vakken met resources, mappen, tags & metadata
- [ ] Vakonboarding: upload → object-storage → chunking → embeddings (kennisdatabank)
- [ ] Structuurherkenning (hoofdstukken, secties)

**Opvolgend aspect**

- [ ] Flow-borden (spreadsheet / kanban / kalender / tijdlijn)
- [ ] Boards (overzicht + planner) over academiejaren
- [ ] AI Flow-integratie: rij-suggesties, gap-detectie, deadline-spreiding, automatische voortgang

**Leer-aspect**

- [x] Studosets met spaced repetition (FSRS) & leermodi (Learn / Speedy / Classic)
- [ ] Visualsets met pin/point-learning
- [ ] Notes (native markdown-resources)
- [ ] Focus-tools (pomodoro, 20/20/20) & printen (woordenlijst / schema)
- [ ] (Semi-)automatische set-generatie uit de kennisdatabank
- [ ] AI-remediëring op onvoldoende gekende kaarten

**Sociaal aspect**

- [ ] Vak-samenwerking (Viewer / Editor / Owner)
- [ ] Publiek delen van Studosets/Visualsets

---

## Commando's

```
# aantal lijnen checken
cloc --vcs=git --exclude-dir=node_modules,.next,dist,build,target \
     --not-match-f='(package-lock|pnpm-lock)\.(json|yaml)|\.gen\.ts$'
```

## Licentie

Proprietary — alle rechten voorbehouden.
