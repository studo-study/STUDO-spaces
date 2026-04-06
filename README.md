# Studo

**Building the studytools of tomorrow**

Studo is een all-in-one studieplatform voor studenten hoger onderwijs. Het combineert bewezen leermethodes zoals spaced repetition, visueel leren en actieve recall in één geïntegreerd platform dat zich aanpast aan de student.

---

## Waarom Studo?

Studenten gebruiken gemiddeld 3 tot 5 losse tools om te studeren: Quizlet voor vocabulaire, Anki voor herhaling, Notion voor notities, losse PDF's voor schema's. Geen van deze tools is gebouwd voor de complexiteit van hoger onderwijs — denk aan anatomie, STEM-vakken of medische opleidingen.

Studo lost dit op met:

- **Studosets** — Term-definitie paren met spaced repetition, tijdstrijd en flashcard modi. Ondersteuning voor LaTeX, afbeeldingen en import uit Word/Excel.
- **Visualsets** — Upload afbeeldingen, plaats pins met definities. Ideaal voor anatomie, aardrijkskunde en schema's. Leer via *Spotten* (typ de definitie) of *Aanwijzen* (duid de juiste pin aan).
- **Classrooms** — Officiële klasgroepen, informele studygroups en open communities. Deel sets, volg voortgang en daag elkaar uit.
- **Studo Select** *(coming soon)* — AI-laag met SVEN: automatische set-generatie uit PDF's, course linking en semantic search.

---

## Tech Stack

| Layer | Technologie |
|-------|------------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS 4 |
| Backend | NestJS 11, TypeScript, Drizzle ORM |
| Database | PostgreSQL |
| Storage | Scaleway S3 |
| Auth | NextAuth (OAuth + JWT via Passport) |
| AI | OpenAI API *(fase 3-4)* |
| Infra | Docker, Railway |

---

## Monorepo Structuur

```
studo-web/
├── apps/
│   ├── backend/          # NestJS API
│   │   ├── src/
│   │   ├── migrations/
│   │   ├── test/
│   │   └── drizzle.config.ts
│   └── web/              # Next.js frontend
│       ├── app/
│       ├── components/
│       ├── store/
│       ├── lib/
│       ├── i18n/
│       └── types/
├── packages/             # Shared packages (types, utils)
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
- PostgreSQL
- Docker *(optioneel, voor database)*

### Installatie

```bash
# Clone de repo
git clone https://github.com/studo-study/STUDO-web.git
cd STUDO-web

# Installeer dependencies
pnpm install

# Binnen de repo staat een .env.example
# Gebruik deze om zelf de .env's aan te maken
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.example apps/web/.env
```

### Docker

```bash
# Docker databank container starten in de root
docker compose up
```


### Database

```bash
# Migraties genereren
pnpm --filter @studo/backend db:generate

# Migraties uitvoeren
pnpm --filter @studo/backend db:migrate

# Database seeden
pnpm --filter @studo/backend db:seed
```

### Development

```bash
# Start alles (backend + frontend)
pnpm dev

# Of individueel
pnpm dev:web          # Next.js op :4000
pnpm dev:api          # NestJS op :3000

# Build
pnpm build
```


---

## Scripts

| Command | Beschrijving |
|---------|-------------|
| `pnpm dev` | Start alle apps via Turborepo |
| `pnpm build` | Build alle apps |
| `pnpm lint` | Lint alle apps |
| `pnpm dev:web` | Start alleen de frontend |
| `pnpm dev:api` | Start alleen de backend |

---

## Roadmap

- [x] Studosets met spaced repetition & leermodi
- [x] Visualsets met pin-based learning
- [x] Classrooms, Study Groups & Communities
- [x] Zoekfunctie & ecosysteem
- [ ] Statistieken dashboard
- [ ] Studo Courses & Verified Sets
- [ ] Studo Select (AI-laag met SVEN)
- [ ] B2B schoollicenties

---

## Licentie

Proprietary — alle rechten voorbehouden.
