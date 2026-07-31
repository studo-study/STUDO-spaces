# Studo

**Building the studytools of tomorrow**

Studo is een all-in-one studieplatform voor studenten hoger onderwijs. Het combineert bewezen leermethodes zoals spaced
repetition, visueel leren en actieve recall in één geïntegreerd platform dat zich aanpast aan de student.

---

## Waarom Studo?

Studenten gebruiken gemiddeld 3 tot 5 losse tools om te studeren: Quizlet voor vocabulaire, Anki voor herhaling, Notion
voor notities, losse PDF's voor schema's. Geen van deze tools is gebouwd voor de complexiteit van hoger onderwijs — denk
aan anatomie, STEM-vakken of medische opleidingen.

Studo lost dit op met:

- **Studosets** — Term-definitie paren met spaced repetition, tijdstrijd en flashcard modi. Ondersteuning voor LaTeX,
  afbeeldingen en import uit Word/Excel.
- **Visualsets** — Upload afbeeldingen, plaats pins met definities. Ideaal voor anatomie, aardrijkskunde en schema's.
  Leer via _Spotten_ (typ de definitie) of _Aanwijzen_ (duid de juiste pin aan).
- **Classrooms** — Officiële klasgroepen, informele studygroups en open communities. Deel sets, volg voortgang en daag
  elkaar uit.
- **Challenges** — Time Attack, Mastery Tournament en Duels om competitief te studeren.
- **Studo Select** _(coming soon)_ — AI-laag met SVEN: automatische set-generatie uit PDF's, course linking en semantic
  search.

---

## Tech Stack

| Layer           | Technologie                                          |
| --------------- | ---------------------------------------------------- |
| Frontend        | Next.js 16, React 19, TypeScript, Tailwind CSS 4     |
| Backend (Node)  | NestJS 11, TypeScript, Drizzle ORM                   |
| Backend (Rust)  | Rust microservices                                   |
| Backend (Swift) | Swift API services                                   |
| Mobile          | React Native, Expo                                   |
| Database        | PostgreSQL, Redis, Qdrant                            |
| Storage         | Scaleway S3                                          |
| Auth            | NextAuth 5 (Google, Microsoft Entra ID, Credentials) |
| AI              | Google Generative AI                                 |
| State           | Zustand, React Query                                 |
| UI              | Lucide Icons                                         |
| i18n            | next-intl (en, nl, fr)                               |
| Infra           | Docker, Railway, Turborepo                           |

## Monorepo Structuur

```
studo-spaces/
├── apps/
│   ├── api-node/             # NestJS API (TypeScript)
│   │   ├── src/
│   │   ├── migrations/
│   │   ├── test/
│   │   └── drizzle.config.ts
│   ├── services/
│   │   ├── rust-services/    # Rust microservices
│   │   └── swift-services/   # Swift API services
│   ├── web/                  # Next.js frontend
│   │   ├── app/
│   │   ├── components/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── messages/         # i18n vertalingen
│   │   └── types/
│   ├── mobile/               # React Native (Expo) app
│   └── legacy/               # Legacy Vue frontend
├── packages/
│   └── shared-types/         # Gedeelde TypeScript types
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

Gemanaged met **pnpm workspaces** en **Turborepo**.

---

## Getting Started

### Vereisten

- Node.js ≥ 20
- pnpm ≥ 10
- Docker

### Installatie

```bash
# Clone de repo
git clone https://github.com/studo-study/STUDO-web.git
cd STUDO-web

# Installeer dependencies
make init-all
# of
make init-api
make init-web

# Maak de root .env aan en distribueer naar alle apps
cp .env.example .env   # vul de waarden in
pnpm env:sync
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
```

### Build

```bash
# Build alle apps
pnpm build

# Of individueel
pnpm build:web
pnpm build:api
```

### Docker Deployment

```bash
# Dev workspace
make start-docker

# Volledige backend stack
make start-docker-api

# Met seeding
make start-docker-api-seeded

```

---

## Scripts

| Command                  | Beschrijving                                   |
| ------------------------ | ---------------------------------------------- |
| `make init-all`          | Installeert dependencies voor alle applicaties |
| `make api`               | Installeert dependencies voor api              |
| `make web`               | Installeert dependencies voor web              |
| `pnpm build`             | Build alle apps                                |
| `pnpm lint`              | Lint alle apps                                 |
| `make start-all`         | Start alle apps via Turborepo                  |
| `make start-docker`      | Start docker container op                      |
| `make start-web`         | Start alleen de frontend                       |
| `make start-api`         | Start alleen de backend                        |
| `pnpm build:web`         | Build alleen de frontend                       |
| `pnpm build:api`         | Build alleen de backend                        |
| `pnpm env:sync`          | Distribueer root `.env` naar alle apps         |
| `pnpm db:generate`       | Genereer migraties uit schema wijzigingen      |
| `pnpm db:migrate`        | Voer migraties uit                             |
| `pnpm db:seed`           | Seed de database                               |
| `pnpm db:reset`          | Reset de database                              |
| `pnpm db:reset-and-seed` | Reset en seed de database in één stap          |
| `make ci`                | Start alle ci tests                            |
| `make analyze`           | Analyseert code base, zoekt naar leaks         |
| `make clean-frontend`    | Wiped NextJS cache                             |

---

## Roadmap

- [x] Studosets met spaced repetition & leermodi
- [x] Visualsets met pin-based learning
- [x] Classrooms, Study Groups & Communities
- [x] Zoekfunctie & ecosysteem
- [x] Challenges (Time Attack, Duels, Mastery Tournament)
- [ ] Statistieken dashboard
- [ ] Studo Courses & Verified Sets
- [ ] Studo Select (AI-laag met SVEN)
- [ ] B2B schoollicenties

---

## Commando's

```
# aantal lijnen checken
cloc . \
  --exclude-dir=node_modules,.next,dist,build,Pods \
  --exclude-ext=json,svg,txt, yaml, swift, ASM, php
```

## Licentie

Proprietary — alle rechten voorbehouden.
