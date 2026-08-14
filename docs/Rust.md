# Rust voor STUDO — Complete Gids voor TypeScript Developers

> Je kent TypeScript en Spring Boot. Je weet wat een async function is, wat een interface is, wat dependency injection is. Deze gids legt Rust uit in termen die je al snapt — en bouwt stap voor stap de document-verwerkingspipeline voor STUDO. Geen abstracte theorie: alle code werkt met jouw echte DB, jouw echte tabellen.

---

## Inhoudsopgave

1. [Waarom Rust? — Het mentale model](#1-waarom-rust--het-mentale-model)
2. [Rust vs TypeScript — side-by-side](#2-rust-vs-typescript--side-by-side)
3. [Ownership — het grote idee](#3-ownership--het-grote-idee)
4. [Result en Option — geen exceptions, geen null](#4-result-en-option--geen-exceptions-geen-null)
5. [Structs, Traits en Enums](#5-structs-traits-en-enums)
6. [Async/Await in Rust](#6-asyncawait-in-rust)
7. [Cargo — de npm van Rust](#7-cargo--de-npm-van-rust)
8. [Jouw project structuur](#8-jouw-project-structuur)
9. [Stap 1: Database connectie met sqlx](#9-stap-1-database-connectie-met-sqlx)
10. [Stap 2: Redis connectie](#10-stap-2-redis-connectie)
11. [Stap 3: De worker_job tabel aanmaken](#11-stap-3-de-worker_job-tabel-aanmaken)
12. [Stap 4: De Queue<P,R> implementatie](#12-stap-4-de-queuepr-implementatie)
13. [Stap 5: Node.js triggert een Rust worker](#13-stap-5-nodejs-triggert-een-rust-worker)
14. [Stap 6: De document-parser-worker](#14-stap-6-de-document-parser-worker)
15. [Stap 7: Studoset generator worker](#15-stap-7-studoset-generator-worker)
16. [Stap 8: Visualset generator worker](#16-stap-8-visualset-generator-worker)
17. [Stap 9: Qdrant voor AI Q&A op cursusmateriaal](#17-stap-9-qdrant-voor-ai-qa-op-cursusmateriaal)
18. [Stap 10: De workflow service — alles orchestreren](#18-stap-10-de-workflow-service--alles-orchestreren)
19. [Lokaal draaien en debuggen](#19-lokaal-draaien-en-debuggen)
20. [Veelgemaakte fouten en hoe je ze oplost](#20-veelgemaakte-fouten-en-hoe-je-ze-oplost)

---

## 1. Waarom Rust? — Het mentale model

### Het probleem met TypeScript voor CPU-intensief werk

TypeScript draait op Node.js, en Node.js heeft één grote beperking: de **event loop is single-threaded**. Dat is prima voor I/O-werk (HTTP calls, DB queries, wachten), maar slecht voor CPU-intensief werk zoals:

- Een PDF van 400 pagina's parsen en tekst extraheren
- Embeddings berekenen voor duizenden tekstblokken
- Parallel meerdere AI-responses verwerken

In Node.js blokkeer je de event loop als je CPU-intensief werk doet. In Spring Boot heb je echte threads maar wel een JVM met garbage collector die geheugen pauzeert op onvoorspelbare momenten.

**Rust lost beide problemen op:**

- Geen garbage collector → geen GC-pauses, voorspelbare latency
- Echte OS-threads + async/await → maximale parallelism
- Memory veilig door het type systeem → geen null pointer crashes in productie

### Wanneer kies je Rust voor STUDO?

| Taak                   | TypeScript (Node)       | Rust      |
| ---------------------- | ----------------------- | --------- |
| REST API endpoints     | ✅ Prima                | Overkill  |
| DB queries uitvoeren   | ✅ Prima                | ✅ Prima  |
| PDF van 400p parsen    | ⚠️ Traag, blokkeert     | ✅ Ideaal |
| 10.000 chunks embedden | ❌ Veel te traag        | ✅ Ideaal |
| Meerdere docs tegelijk | ⚠️ Worker threads nodig | ✅ Native |
| AI calls doen (HTTP)   | ✅ Prima                | ✅ Prima  |

**De architectuur:** Node.js doet de API, auth, en business logic. Rust doet het zware verwerkingswerk op de achtergrond. Ze communiceren via een gedeelde PostgreSQL tabel (de `worker_job` queue).

---

## 2. Rust vs TypeScript — side-by-side

Lees dit als een "vertaalwoordenboek". Elk TypeScript concept heeft een Rust equivalent.

### Variabelen

```typescript
// TypeScript
let name: string = "hello"; // muteerbaar
const count: number = 42; // immuteerbaar
```

```rust
// Rust
let name: &str = "hello";    // immuteerbaar by default!
let mut count: i32 = 42;     // mut = expliciet muteerbaar maken
let count = 42;              // type inference werkt ook, compiler raadt i32
```

**Belangrijk verschil:** In Rust is alles standaard **immuteerbaar**. Je moet expliciet `mut` schrijven om een variabele te kunnen wijzigen. Dit klinkt vervelend maar voorkomt een hele klasse bugs.

### Functies

```typescript
// TypeScript
async function processDocument(id: string): Promise<string> {
  const result = await fetchDocument(id);
  return result.text;
}
```

```rust
// Rust
async fn process_document(id: &str) -> Result<String, MyError> {
    let result = fetch_document(id).await?;  // ? = gooi fout als er één is
    Ok(result.text)
}
```

Drie dingen vallen op:

1. `snake_case` in Rust (niet camelCase)
2. Geen `Promise<T>` maar `Result<T, E>` — het fouttype staat in de signatuur
3. De `?` operator: als `fetch_document` een fout teruggeeft, stopt de functie en geeft die fout door. Dit is equivalent aan een `try/catch` die automatisch `throw`t.

### Types / Interfaces

```typescript
// TypeScript
interface Card {
  id: string;
  term: string;
  definition: string;
  setId: string;
}

function createCard(card: Card): Promise<void> { ... }
```

```rust
// Rust
struct Card {
    id: String,
    term: String,
    definition: String,
    set_id: String,
}

async fn create_card(card: Card) -> Result<(), MyError> { ... }
```

`struct` in Rust = `interface` in TypeScript (min of meer). Het grote verschil: een struct **bezit** zijn data. Als je een struct doorgeeft aan een functie, verplaatst de ownership mee (meer hierover in sectie 3).

### Klassen / Methods

```typescript
// TypeScript — klasse met methods
class DocumentProcessor {
  private dbPool: Pool;

  constructor(dbPool: Pool) {
    this.dbPool = dbPool;
  }

  async process(documentId: string): Promise<void> {
    // ...
  }
}
```

```rust
// Rust — struct + impl blok (geen klassen!)
struct DocumentProcessor {
    db_pool: PgPool,
}

impl DocumentProcessor {
    // constructor conventie: new()
    fn new(db_pool: PgPool) -> Self {
        DocumentProcessor { db_pool }
    }

    async fn process(&self, document_id: &str) -> Result<(), MyError> {
        // &self = de "this" van Rust, maar als referentie
    }
}
```

Rust heeft geen klassen. In plaats daarvan: `struct` voor data + `impl` blok voor methods. `&self` is Rust's `this`, maar altijd een referentie (zie sectie 3).

### Arrays en Vectors

```typescript
// TypeScript
const ids: string[] = ["a", "b", "c"];
ids.push("d");
```

```rust
// Rust
let ids: Vec<String> = vec!["a".to_string(), "b".to_string(), "c".to_string()];
// of korter:
let mut ids = Vec::new();
ids.push("d".to_string());
```

`Vec<T>` = dynamische array, equivalent aan JavaScript `Array`. De `!` in `vec![]` geeft aan dat het een **macro** is (een code-generator), niet een functie.

### HashMap

```typescript
// TypeScript
const map = new Map<string, number>();
map.set("count", 42);
const val = map.get("count"); // string | undefined
```

```rust
// Rust
use std::collections::HashMap;
let mut map = HashMap::new();
map.insert("count", 42);
let val = map.get("count"); // Option<&i32> — Some(42) of None
```

---

## 3. Ownership — het grote idee

Dit is het concept dat Rust uniek maakt en waar de meeste beginners op vastlopen. Lees dit goed.

### De kernregel

**Elke waarde in Rust heeft precies één eigenaar. Als die eigenaar buiten scope gaat, wordt de waarde opgeruimd.**

```rust
fn main() {
    let s1 = String::from("hello");  // s1 bezit de string
    let s2 = s1;                     // ownership verplaatst naar s2!

    println!("{}", s1);  // ❌ COMPILE ERROR: s1 is "moved", bestaat niet meer
    println!("{}", s2);  // ✅ OK
}
```

In TypeScript zou dit prima werken — beide variabelen zouden naar hetzelfde object verwijzen. In Rust is er maar één eigenaar. Dit klinkt beperkend, maar het betekent dat de **compiler garandeert dat je nooit twee plekken hebt die dezelfde data wijzigen** — geen race conditions, geen use-after-free bugs.

### Borrowing — lenen zonder overnemen

Als je een functie een waarde wilt meegeven maar de eigenaar wil houden, gebruik je een **referentie**:

```rust
fn print_length(s: &String) {  // & = referentie, lenen
    println!("Length: {}", s.len());
    // s wordt hier niet owned, dus niet opgeruimd
}

fn main() {
    let s = String::from("hello");
    print_length(&s);  // & = geef een lening mee
    println!("{}", s); // ✅ s bestaat nog, we hebben alleen geleend
}
```

**Analoog in TypeScript:** Altijd alles "by reference" in JS. In Rust moet je expliciet kiezen:

- `s` → ownership move (TypeScript equivalent: je delete de originele variabele)
- `&s` → immutable borrow (TypeScript equivalent: readonly toegang)
- `&mut s` → mutable borrow (TypeScript equivalent: gewone toegang)

### Clone — als je echt een kopie wilt

```rust
let s1 = String::from("hello");
let s2 = s1.clone();  // expliciete kopie maken

println!("{}", s1);  // ✅ beide bestaan
println!("{}", s2);  // ✅
```

`.clone()` is bewust verbose in Rust. Als je `clone()` ziet staan, weet je: hier wordt geheugen gekopieerd. In TypeScript doe je dit onbewust de hele tijd (`{...obj}`, `.slice()`, etc.).

### Waarom dit relevant is voor STUDO

In de worker queue code ga je veel zien:

```rust
let document_id = payload.document_id.clone();

tokio::spawn(async move {
    process_document(document_id).await
});
```

De `move` keyword zegt: de async task neemt ownership van alle variabelen die ze gebruikt. `clone()` is nodig als je dezelfde string daarna nog nodig hebt in de huidige scope.

### Arc — gedeeld ownership

Voor de WorkerContext (DB pool, Redis connectie, etc.) wil je dat meerdere async tasks dezelfde data kunnen gebruiken. Daarvoor is `Arc<T>` (Atomic Reference Counted):

```rust
use std::sync::Arc;

let ctx = Arc::new(WorkerContext::new(...));

// Meerdere tasks kunnen dezelfde ctx gebruiken
let ctx1 = Arc::clone(&ctx);
tokio::spawn(async move { task1(ctx1).await });

let ctx2 = Arc::clone(&ctx);
tokio::spawn(async move { task2(ctx2).await });
```

`Arc::clone` kopieert niet de data — het verhoogt alleen een teller. Als alle clones uit scope gaan, wordt de data opgeruimd. **Analoog:** React's `useContext` — meerdere componenten delen dezelfde waarde zonder kopie.

---

## 4. Result en Option — geen exceptions, geen null

### Result<T, E>

In TypeScript gooi je exceptions:

```typescript
async function getDocument(id: string): Promise<Document> {
  const doc = await db.findOne(id);
  if (!doc) throw new Error("Not found");
  return doc;
}

// Caller:
try {
  const doc = await getDocument("abc");
} catch (e) {
  console.error(e);
}
```

In Rust geef je fouten terug als gewone waarden:

```rust
async fn get_document(id: &str) -> Result<Document, DbError> {
    let doc = db.find_one(id).await?;  // ? = early return als None/Err
    Ok(doc)
}

// Caller:
match get_document("abc").await {
    Ok(doc) => println!("Got: {}", doc.title),
    Err(e) => eprintln!("Error: {}", e),
}
```

**Voordeel:** De compiler **dwingt** je om fouten af te handelen. Je kunt nooit vergeten dat een functie kan falen — dat staat in de return type.

### De `?` operator — shorthand voor foutpropagatie

```rust
// Zonder ?
async fn process(id: &str) -> Result<String, MyError> {
    let doc = match get_document(id).await {
        Ok(d) => d,
        Err(e) => return Err(e.into()),  // early return
    };
    let text = match extract_text(&doc).await {
        Ok(t) => t,
        Err(e) => return Err(e.into()),
    };
    Ok(text)
}

// Met ? — exact hetzelfde, maar leesbaar
async fn process(id: &str) -> Result<String, MyError> {
    let doc = get_document(id).await?;
    let text = extract_text(&doc).await?;
    Ok(text)
}
```

`?` = "als dit een Err is, return die Err meteen". Het is letterlijk het equivalent van:

```typescript
const doc = await getDocument(id); // als dit throw, stopt de functie
```

maar dan expliciet en in het type zichtbaar.

### Option<T> — geen null, geen undefined

```typescript
// TypeScript
function findUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

const user = findUser("abc");
if (user) {
  console.log(user.name); // TypeScript weet dat user niet undefined is
}
```

```rust
// Rust
fn find_user(id: &str) -> Option<User> {
    users.iter().find(|u| u.id == id).cloned()
}

match find_user("abc") {
    Some(user) => println!("{}", user.name),
    None => println!("Not found"),
}

// Of met if let (als je alleen Some interesseert):
if let Some(user) = find_user("abc") {
    println!("{}", user.name);
}

// Of met unwrap_or (geef default als None):
let name = find_user("abc")
    .map(|u| u.name)
    .unwrap_or("Unknown".to_string());
```

`Option<T>` = `T | null | undefined` in TypeScript, maar dan afdwingbaar door de compiler. Je kunt een `Option<T>` **nooit** gebruiken zonder eerst te checken of er iets in zit.

### thiserror — eigen fout types maken

```rust
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DocumentError {
    #[error("Document not found: {0}")]
    NotFound(String),

    #[error("PDF parsing failed: {0}")]
    ParseFailed(String),

    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),  // #[from] = automatisch omzetten vanuit sqlx::Error
}
```

Dit is equivalent aan custom Error klassen in TypeScript:

```typescript
class DocumentError extends Error {
  constructor(message: string) { super(message); }
}
class NotFoundError extends DocumentError { ... }
```

Maar Rust's enum-aanpak is type-veiliger: elke variant heeft een andere shape en je kunt ze exhaustief matchen.

---

## 5. Structs, Traits en Enums

### Enums — véél krachtiger dan TypeScript

TypeScript enums zijn simpele strings/nummers:

```typescript
enum Status {
  Idle = "Idle",
  Running = "Running",
  Failed = "Failed",
}
```

Rust enums kunnen **data bevatten per variant**:

```rust
enum WorkerJobStatus {
    Idle,
    Running { started_at: DateTime<Utc>, worker_id: String },
    Succeeded { result: String, finished_at: DateTime<Utc> },
    Failed { error: String, attempt_count: i32 },
}

// Pattern matching — compiler dwingt je alle gevallen te behandelen
match job.status {
    WorkerJobStatus::Idle => println!("Waiting..."),
    WorkerJobStatus::Running { started_at, worker_id } => {
        println!("Running since {} by {}", started_at, worker_id)
    }
    WorkerJobStatus::Succeeded { result, .. } => println!("Done: {}", result),
    WorkerJobStatus::Failed { error, attempt_count } => {
        println!("Failed after {} attempts: {}", attempt_count, error)
    }
}
// ❌ Als je een variant vergeet: compile error!
```

Dit is enorm waardevol voor state machines — precies wat onze worker job lifecycle is.

### Traits — interfaces maar dan beter

```typescript
// TypeScript interface
interface Serializable {
  toJson(): string;
}

class Card implements Serializable {
  toJson(): string {
    return JSON.stringify(this);
  }
}
```

```rust
// Rust trait
trait Serializable {
    fn to_json(&self) -> String;
}

struct Card { term: String, definition: String }

impl Serializable for Card {
    fn to_json(&self) -> String {
        format!(r#"{{"term":"{}","definition":"{}"}}"#, self.term, self.definition)
    }
}
```

**Maar in de praktijk:** voor JSON serialisatie gebruik je `serde`:

```rust
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]  // Rust snake_case → JSON camelCase
struct Card {
    id: String,
    term: String,
    definition: String,
    set_id: String,         // → "setId" in JSON
    term_content_type: String, // → "termContentType" in JSON
}

// Serialiseren:
let card = Card { id: "...".into(), term: "Mitose".into(), ... };
let json = serde_json::to_string(&card)?;
// {"id":"...","term":"Mitose","setId":"...","termContentType":"..."}

// Deserialiseren:
let card: Card = serde_json::from_str(&json)?;
```

`#[derive(...)]` = automatisch traits implementeren. `serde` is het meest gebruikte crate voor JSON in Rust.

**De `#[serde(rename_all = "camelCase")]` is CRUCIAAL** voor jullie stack: Node.js schrijft camelCase JSON, Rust gebruikt snake_case variabelen. Deze attribuut zorgt voor de automatische mapping.

---

## 6. Async/Await in Rust

### Het verschil met Node.js

In Node.js wordt async code uitgevoerd op één thread met een event loop. In Rust gebruik je **Tokio** — een async runtime die meerdere OS-threads gebruikt.

```rust
// Cargo.toml
[dependencies]
tokio = { version = "1", features = ["full"] }

// main.rs
#[tokio::main]  // ← dit start de Tokio runtime
async fn main() {
    let result = do_async_work().await;
}
```

`#[tokio::main]` is een macro die je `main` functie omzet naar:

```rust
fn main() {
    tokio::runtime::Runtime::new()
        .unwrap()
        .block_on(async { /* jouw code */ })
}
```

### Parallelle tasks spawnen

```typescript
// TypeScript — parallel met Promise.all
const [doc, user] = await Promise.all([fetchDocument(id), fetchUser(userId)]);
```

```rust
// Rust — parallel met tokio::join!
let (doc, user) = tokio::join!(
    fetch_document(id),
    fetch_user(user_id)
);

// Of voor meerdere dynamische tasks:
let handles: Vec<_> = document_ids
    .iter()
    .map(|id| {
        let id = id.clone();
        tokio::spawn(async move { process_document(id).await })
    })
    .collect();

for handle in handles {
    handle.await??;  // .await wacht, tweede ? pakt het Result
}
```

### `tokio::spawn` — fire and forget

```typescript
// TypeScript — geen await, gewoon starten
processDocument(id).catch(console.error);
```

```rust
// Rust — spawn geeft een JoinHandle terug die je kunt awaitten of negeren
tokio::spawn(async move {
    if let Err(e) = process_document(id).await {
        eprintln!("Error: {}", e);
    }
});
// Controle keert meteen terug
```

---

## 7. Cargo — de npm van Rust

### Cargo.toml = package.json

```toml
# Cargo.toml
[package]
name = "document-parser-worker"
version = "0.1.0"
edition = "2021"         # Rust edition — gebruik altijd 2021

[[bin]]
name = "document-parser-worker"
path = "src/main.rs"

[dependencies]
# Versies: "1" = ^1.x.x (zelfde als npm "^1.0.0")
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.8", features = ["postgres", "runtime-tokio", "uuid", "chrono"] }
redis = { version = "0.27", features = ["tokio-comp"] }
anyhow = "1"        # Easy error handling
thiserror = "2"     # Custom error types
tracing = "0.1"     # Logging (println! is amateur)
tracing-subscriber = "0.3"
reqwest = { version = "0.12", features = ["json"] }  # HTTP client
uuid = { version = "1", features = ["v4"] }
chrono = { version = "0.4", features = ["serde"] }
dotenvy = "0.15"    # .env files laden
```

### Workspace = monorepo

Voor STUDO's rust-services gebruiken we een **workspace**: één Cargo.toml die meerdere crates bundelt:

```toml
# apps/services/rust-services/Cargo.toml
[workspace]
members = [
    "crates/db-client",       # gedeelde DB connectie logica
    "crates/queue",           # de Queue<P,R> implementatie
    "workers/document-parser",# de PDF parser worker
    "workers/studoset-generator", # AI studoset generator
    "workers/visualset-generator",
    "workers/document-indexer",   # Qdrant indexer
]
resolver = "2"

# Gedeelde dependencies — workers hoeven versies niet te herhalen
[workspace.dependencies]
tokio = { version = "1", features = ["full"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
sqlx = { version = "0.8", features = ["postgres", "runtime-tokio", "uuid", "chrono"] }
anyhow = "1"
thiserror = "2"
tracing = "0.1"
```

### Cargo commando's

```bash
cargo build              # compileer alles (traag eerste keer, snel daarna)
cargo build --release    # geoptimaliseerde build voor productie
cargo check              # typecheck zonder bouwen (veel sneller)
cargo run                # bouwen + draaien
cargo test               # tests draaien
cargo clippy             # linter (veel strenger dan ESLint)
cargo fmt                # formatter (geen discussie over stijl)
cargo add tokio          # dependency toevoegen (zoals npm install)
```

---

## 8. Jouw project structuur

We gaan `apps/services/rust-services/` omzetten naar een echte workspace.

### Huidige structuur (skelet)

```
apps/services/rust-services/
├── Cargo.toml    ← alleen [package], geen workspace
└── src/
    └── main.rs   ← simpele Axum hello world
```

### Doelstructuur

```
apps/services/rust-services/
├── Cargo.toml                    ← workspace root
├── Cargo.lock
├── .env                          ← DATABASE_URL, REDIS_URL, ANTHROPIC_API_KEY
│
├── crates/                       ← gedeelde bibliotheken
│   ├── db-client/                ← PostgreSQL pool + queries
│   │   ├── Cargo.toml
│   │   └── src/
│   │       ├── lib.rs
│   │       ├── pool.rs           ← connectie pool
│   │       └── queries/          ← SQL queries per domein
│   │           ├── mod.rs
│   │           ├── documents.rs
│   │           ├── studysets.rs
│   │           └── worker_jobs.rs
│   │
│   └── queue/                    ← Queue<P,R> worker systeem
│       ├── Cargo.toml
│       └── src/
│           ├── lib.rs
│           ├── queue.rs          ← Queue struct + add_job + start_runner
│           ├── pubsub.rs         ← Redis pub/sub
│           └── types.rs          ← WorkerJob, WorkerJobStatus, WorkerError
│
└── workers/                      ← individuele worker binaries
    ├── document-parser/          ← PDF → tekst
    │   ├── Cargo.toml
    │   └── src/
    │       ├── main.rs
    │       ├── lib.rs
    │       ├── types.rs
    │       ├── processor.rs
    │       └── errors.rs
    │
    ├── studoset-generator/       ← tekst → flashcards via AI
    │   └── src/ ...
    │
    ├── visualset-generator/      ← tekst → visualset via AI
    │   └── src/ ...
    │
    └── document-indexer/         ← chunks → Qdrant vectoren
        └── src/ ...
```

### De omzetting uitvoeren

```bash
cd apps/services/rust-services

# Bestaande src/ bewaren voor later
mkdir -p crates/db-client/src
mkdir -p crates/queue/src
mkdir -p workers/document-parser/src
mkdir -p workers/studoset-generator/src
mkdir -p workers/document-indexer/src
```

---

## 9. Stap 1: Database connectie met sqlx

`sqlx` is de Rust equivalent van `pg` of Drizzle — maar met compile-time SQL validatie.

### Waarom sqlx en niet een ORM?

- **Diesel** (Rust ORM) is complex om op te zetten met een bestaand schema
- **sqlx** laat je gewone SQL schrijven maar checked queries op compile-time
- Je DB schema (de Drizzle migrations) bestaat al — we willen er gewoon queries op draaien

### De db-client crate

```toml
# crates/db-client/Cargo.toml
[package]
name = "db-client"
version = "0.1.0"
edition = "2021"

[dependencies]
sqlx = { workspace = true }
tokio = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }
thiserror = { workspace = true }
tracing = { workspace = true }
uuid = { workspace = true }
chrono = { workspace = true }
```

```rust
// crates/db-client/src/lib.rs
pub mod pool;
pub mod queries;

pub use pool::DbPool;
pub use sqlx::PgPool;

// Re-exporteer sqlx Error voor gebruik in workers
pub use sqlx::Error as SqlxError;
```

```rust
// crates/db-client/src/pool.rs
use sqlx::postgres::PgPoolOptions;
use sqlx::PgPool;

// PgPool is al een Arc intern — je kunt het goedkoop clonen en door threads sturen
pub type DbPool = PgPool;

pub async fn create_pool(database_url: &str) -> Result<DbPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)           // max 10 gelijktijdige DB connecties
        .acquire_timeout(std::time::Duration::from_secs(5))
        .connect(database_url)
        .await
}
```

**Vergelijking met Node.js/TypeScript (pg library):**

```typescript
// TypeScript equivalent
import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  connectionTimeoutMillis: 5000,
});
```

### Queries schrijven

```rust
// crates/db-client/src/queries/worker_jobs.rs
use sqlx::PgPool;
use crate::types::{WorkerJob, WorkerJobStatus};

pub async fn insert_worker_job(
    pool: &PgPool,
    queue: &str,
    payload: &str,         // JSON string
    key: Option<&str>,
    fairness_key: Option<&str>,
) -> Result<i64, sqlx::Error> {
    // sqlx::query_scalar! returned één waarde (de id)
    // Het RETURNING id geeft de gegenereerde primary key terug
    let id = sqlx::query_scalar!(
        r#"
        INSERT INTO worker_job (queue, payload, status, key, fairness_key)
        VALUES ($1, $2, 'Idle', $3, $4)
        RETURNING id
        "#,
        queue,
        payload,
        key,
        fairness_key,
    )
    .fetch_one(pool)
    .await?;

    Ok(id)
}

pub async fn fetch_idle_jobs(
    pool: &PgPool,
    queue: &str,
    limit: i64,
) -> Result<Vec<WorkerJob>, sqlx::Error> {
    // sqlx::query_as! mapt automatisch rijen naar een struct
    let jobs = sqlx::query_as!(
        WorkerJob,
        r#"
        SELECT id, queue, key, payload, status as "status: WorkerJobStatus",
               attempt_count, retry_at, fairness_key
        FROM worker_job
        WHERE queue = $1
          AND status = 'Idle'
          AND (retry_at IS NULL OR retry_at <= NOW())
        ORDER BY id ASC
        LIMIT $2
        FOR UPDATE SKIP LOCKED  -- cruciaal: twee workers pakken nooit dezelfde job
        "#,
        queue,
        limit,
    )
    .fetch_all(pool)
    .await?;

    Ok(jobs)
}
```

**`FOR UPDATE SKIP LOCKED`** is de database-level oplossing voor het "twee workers pakken dezelfde job" probleem. Dit werkt veel beter dan application-level locking.

---

## 10. Stap 2: Redis connectie

Redis gebruiken we voor twee dingen:

1. **Pub/sub:** Node.js publiceert "nieuwe job!" → Rust workers waken op
2. **Pub/sub:** Rust publiceert "job klaar!" → Node.js weet wanneer een job afgerond is

```rust
// crates/queue/src/pubsub.rs
use redis::aio::MultiplexedConnection;
use redis::AsyncCommands;
use tokio::sync::broadcast;

pub struct RedisPubSub {
    client: redis::Client,
}

impl RedisPubSub {
    pub fn new(redis_url: &str) -> Result<Self, redis::RedisError> {
        let client = redis::Client::open(redis_url)?;
        Ok(Self { client })
    }

    // Publiceer een bericht naar een channel
    pub async fn publish(&self, channel: &str, message: &str) -> Result<(), redis::RedisError> {
        let mut conn = self.client.get_multiplexed_async_connection().await?;
        conn.publish(channel, message).await?;
        Ok(())
    }

    // Subscribeer op een channel — geeft een receiver terug
    // De receiver ontvangt alle berichten die op dat channel binnenkomen
    pub async fn subscribe(
        &self,
        channel: &str,
    ) -> Result<broadcast::Receiver<String>, redis::RedisError> {
        let (tx, rx) = broadcast::channel(100);  // 100 berichten buffer
        let mut pubsub = self.client.get_async_pubsub().await?;
        pubsub.subscribe(channel).await?;

        // Spawn een achtergrondtask die berichten van Redis leest
        // en ze doorstuurt naar alle receivers via het broadcast channel
        tokio::spawn(async move {
            use futures_util::StreamExt;
            let mut stream = pubsub.on_message();
            while let Some(msg) = stream.next().await {
                let payload: String = msg.get_payload().unwrap_or_default();
                let _ = tx.send(payload);  // _ = negeer fout als geen receivers
            }
        });

        Ok(rx)
    }
}
```

**Jouw Redis URL** (uit docker-compose.yml):

```
redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379
```

Channel naam conventie: `queue:{queue_naam}` — bijv. `queue:document_parsing`

---

## 11. Stap 3: De worker_job tabel aanmaken

We voegen een migratie toe aan de bestaande Drizzle setup. Maak een nieuw migratie bestand:

```sql
-- apps/api-node/src/drizzle/migrations/0XXX_worker_job.sql
-- Of voeg dit toe via: npx drizzle-kit generate

CREATE TYPE worker_job_status AS ENUM ('Idle', 'Running', 'Succeeded', 'Failed');

CREATE TABLE worker_job (
    id              BIGSERIAL PRIMARY KEY,
    queue           TEXT NOT NULL,
    key             TEXT,
    payload         TEXT NOT NULL,           -- JSON string (altijd camelCase!)
    result          TEXT,                    -- JSON string na succes
    error           TEXT,
    status          worker_job_status NOT NULL DEFAULT 'Idle',
    attempt_count   INTEGER NOT NULL DEFAULT 0,
    started_at      TIMESTAMPTZ,
    finished_at     TIMESTAMPTZ,
    lock_key        TEXT,                    -- welke worker heeft deze job
    lock_expires_at TIMESTAMPTZ,
    retry_at        TIMESTAMPTZ,
    fairness_key    TEXT,                    -- user_id voor fair scheduling
    priority        INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index zodat workers snel idle jobs vinden
CREATE INDEX idx_worker_job_queue_status ON worker_job (queue, status, retry_at);

-- Optioneel: unieke key per queue voor deduplicatie
CREATE UNIQUE INDEX idx_worker_job_queue_key ON worker_job (queue, key)
    WHERE key IS NOT NULL AND status IN ('Idle', 'Running');

-- Tabel voor te verwerken cursusmateriaal (onze PDF documenten)
CREATE TABLE course_documents (
    id              VARCHAR(64) PRIMARY KEY,
    flowcourse_id   VARCHAR(64) NOT NULL REFERENCES flowcourses(flowcourse_id) ON DELETE CASCADE,
    user_id         VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title           VARCHAR(500) NOT NULL,
    file_url        TEXT NOT NULL,          -- URL naar de opgeslagen PDF
    file_size_bytes BIGINT,
    page_count      INTEGER,
    extracted_text  TEXT,                   -- ruwe tekst na parsing
    processing_status VARCHAR(30) NOT NULL DEFAULT 'pending',
    -- 'pending' | 'parsing' | 'parsed' | 'generating' | 'done' | 'failed'
    error_message   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tekstblokken na chunking (voor Qdrant indexering)
CREATE TABLE document_chunks (
    id              BIGSERIAL PRIMARY KEY,
    document_id     VARCHAR(64) NOT NULL REFERENCES course_documents(id) ON DELETE CASCADE,
    chunk_index     INTEGER NOT NULL,
    content         TEXT NOT NULL,
    page_number     INTEGER,
    token_count     INTEGER,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_document_chunks_document ON document_chunks (document_id, chunk_index);
```

Voeg dit toe aan je Drizzle schema voor TypeScript type-safety:

```typescript
// Voeg toe aan apps/api-node/src/drizzle/schema.ts

export const processingStatusEnum = pgEnum("processing_status_type", [
  "pending",
  "parsing",
  "parsed",
  "generating",
  "done",
  "failed",
]);

export const workerJobStatusEnum = pgEnum("worker_job_status", [
  "Idle",
  "Running",
  "Succeeded",
  "Failed",
]);

export const workerJobs = pgTable("worker_job", {
  id: bigserial("id", { mode: "bigint" }).primaryKey(),
  queue: text("queue").notNull(),
  key: text("key"),
  payload: text("payload").notNull(),
  result: text("result"),
  error: text("error"),
  status: workerJobStatusEnum("status").notNull().default("Idle"),
  attemptCount: integer("attempt_count").notNull().default(0),
  startedAt: timestamp("started_at", { withTimezone: true }),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  lockKey: text("lock_key"),
  lockExpiresAt: timestamp("lock_expires_at", { withTimezone: true }),
  retryAt: timestamp("retry_at", { withTimezone: true }),
  fairnessKey: text("fairness_key"),
  priority: integer("priority").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const courseDocuments = pgTable("course_documents", {
  id: varchar("id", { length: 64 }).primaryKey(),
  flowcourseId: varchar("flowcourse_id", { length: 64 })
    .references(() => flowcourses.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id", { length: 64 })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSizeBytes: bigint("file_size_bytes", { mode: "number" }),
  pageCount: integer("page_count"),
  extractedText: text("extracted_text"),
  processingStatus: varchar("processing_status", { length: 30 })
    .notNull()
    .default("pending"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
```

---

## 12. Stap 4: De Queue<P,R> implementatie

Dit is het hart van het systeem. `Queue<P, R>` is een generieke struct waarbij:

- `P` = Payload type (wat je job meekrijgt)
- `R` = Result type (wat de job teruggeeft na succes)

### De types

```rust
// crates/queue/src/types.rs
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, sqlx::Type, Serialize, Deserialize, PartialEq)]
#[sqlx(type_name = "worker_job_status", rename_all = "PascalCase")]
pub enum WorkerJobStatus {
    Idle,
    Running,
    Succeeded,
    Failed,
}

#[derive(Debug, Clone, sqlx::FromRow)]
pub struct WorkerJob {
    pub id: i64,
    pub queue: String,
    pub key: Option<String>,
    pub payload: String,
    pub status: WorkerJobStatus,
    pub attempt_count: i32,
    pub retry_at: Option<DateTime<Utc>>,
    pub fairness_key: Option<String>,
}

// Fouten die een worker kan teruggeven
#[derive(Debug)]
pub enum WorkerError {
    // Tijdelijk: wordt opnieuw geprobeerd na retry_delay
    Retryable(String),
    // Permanent: geen retry, job staat meteen op Failed
    Fatal(String),
    // Retry na specifieke delay (bijv. rate limiting door AI provider)
    DelayedRetry { delay_secs: u64, message: String },
}

impl std::fmt::Display for WorkerError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            WorkerError::Retryable(msg) => write!(f, "Retryable: {}", msg),
            WorkerError::Fatal(msg) => write!(f, "Fatal: {}", msg),
            WorkerError::DelayedRetry { message, .. } => write!(f, "DelayedRetry: {}", message),
        }
    }
}

// Configuratie voor een queue instantie
#[derive(Debug, Clone)]
pub struct QueueConfig {
    pub name: String,
    pub concurrency: u32,       // hoeveel jobs parallel
    pub max_retries: u32,       // hoe vaak opnieuw proberen
    pub retry_delay_secs: u64,  // wachttijd tussen pogingen
    pub job_timeout_secs: u64,  // max tijd per job (daarna: lock verlopen)
}

impl QueueConfig {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            concurrency: 4,
            max_retries: 5,
            retry_delay_secs: 30,
            job_timeout_secs: 900,  // 15 minuten default
        }
    }

    // Builder pattern — equivalent van options object in TypeScript
    pub fn with_concurrency(mut self, n: u32) -> Self {
        self.concurrency = n;
        self
    }

    pub fn with_max_retries(mut self, n: u32) -> Self {
        self.max_retries = n;
        self
    }

    pub fn with_retry_delay_secs(mut self, secs: u64) -> Self {
        self.retry_delay_secs = secs;
        self
    }
}
```

### De Queue struct

```rust
// crates/queue/src/queue.rs
use std::sync::Arc;
use std::marker::PhantomData;
use serde::{Serialize, de::DeserializeOwned};
use sqlx::PgPool;
use tokio::sync::Semaphore;
use tracing::{info, error, warn};
use uuid::Uuid;

use crate::types::{QueueConfig, WorkerError, WorkerJob, WorkerJobStatus};
use crate::pubsub::RedisPubSub;

// PhantomData<(P, R)> vertelt de compiler dat Queue "weet van" P en R
// zonder ze daadwerkelijk op te slaan — het is een type-level hint
pub struct Queue<P, R>
where
    P: Serialize + DeserializeOwned + Send + Sync + 'static,
    R: Serialize + DeserializeOwned + Send + Sync + 'static,
{
    config: QueueConfig,
    pool: PgPool,
    pubsub: Arc<RedisPubSub>,
    _phantom: PhantomData<(P, R)>,
}

impl<P, R> Queue<P, R>
where
    P: Serialize + DeserializeOwned + Send + Sync + 'static,
    R: Serialize + DeserializeOwned + Send + Sync + 'static,
{
    pub fn new(config: QueueConfig, pool: PgPool, pubsub: Arc<RedisPubSub>) -> Self {
        Self { config, pool, pubsub, _phantom: PhantomData }
    }

    /// Voeg een job toe aan de queue.
    /// Equivalent van queue.addJob(payload) in Node.js
    pub async fn add_job(
        &self,
        payload: P,
        key: Option<String>,
    ) -> Result<i64, sqlx::Error> {
        // Serialize payload naar JSON string
        // serde_json::to_string is infallible voor goed gedefineerde structs
        let payload_json = serde_json::to_string(&payload)
            .expect("Payload moet serialiseerbaar zijn");

        let id = sqlx::query_scalar!(
            r#"
            INSERT INTO worker_job (queue, payload, status, key, created_at)
            VALUES ($1, $2, 'Idle', $3, NOW())
            RETURNING id
            "#,
            self.config.name,
            payload_json,
            key,
        )
        .fetch_one(&self.pool)
        .await?;

        // Notificeer workers dat er een nieuwe job is
        let channel = format!("queue:{}", self.config.name);
        let message = format!(r#"{{"type":"run-job","jobId":"{}"}}"#, id);
        if let Err(e) = self.pubsub.publish(&channel, &message).await {
            // Niet fataal: worker pikt job op via volgende poll cycle
            warn!("Failed to publish job notification: {}", e);
        }

        info!(queue = %self.config.name, job_id = id, "Job added to queue");
        Ok(id)
    }

    /// Start de worker loop.
    /// Dit blokkeert voor altijd — de worker draait totdat het process stopt.
    ///
    /// processor: de functie die de eigenlijke job uitvoert
    pub async fn start_runner<F, Fut>(
        &self,
        processor: F,
    ) -> anyhow::Result<()>
    where
        F: Fn(P) -> Fut + Send + Sync + Clone + 'static,
        Fut: std::future::Future<Output = Result<R, WorkerError>> + Send,
    {
        // Semaphore = teller die bijhoudt hoeveel jobs tegelijk draaien
        // Equivalent van p-limit in Node.js
        let semaphore = Arc::new(Semaphore::new(self.config.concurrency as usize));
        let channel = format!("queue:{}", self.config.name);

        info!(
            queue = %self.config.name,
            concurrency = self.config.concurrency,
            "Worker started"
        );

        // Subscribeer op Redis voor snelle wakeups
        let mut rx = self.pubsub.subscribe(&channel).await
            .unwrap_or_else(|e| {
                warn!("Redis subscribe failed, will use polling only: {}", e);
                // Maak een dummy receiver die nooit iets ontvangt
                tokio::sync::broadcast::channel(1).1
            });

        loop {
            // Haal beschikbare jobs op (met database-level locking)
            match self.fetch_and_lock_jobs(self.config.concurrency).await {
                Ok(jobs) => {
                    for job in jobs {
                        let sem = Arc::clone(&semaphore);
                        let pool = self.pool.clone();
                        let config = self.config.clone();
                        let pubsub = Arc::clone(&self.pubsub);
                        let processor = processor.clone();

                        tokio::spawn(async move {
                            // Acquire semaphore slot — blokkeert als max bereikt
                            let _permit = sem.acquire().await.unwrap();
                            execute_job(job, processor, pool, config, pubsub).await;
                            // _permit wordt opgeruimd hier → semaphore teller +1
                        });
                    }
                }
                Err(e) => {
                    error!("Failed to fetch jobs: {}", e);
                }
            }

            // Wacht op pub/sub signaal OF timeout na 30 seconden
            // Daarna: opnieuw jobs ophalen
            tokio::select! {
                // Redis zegt: nieuwe job beschikbaar
                _ = rx.recv() => {
                    // Direct de loop herhalen (jobs ophalen)
                }
                // Timeout: om de 30s sowieso checken (fallback als Redis mist)
                _ = tokio::time::sleep(std::time::Duration::from_secs(30)) => {
                    // Direct de loop herhalen
                }
            }
        }
    }

    async fn fetch_and_lock_jobs(&self, limit: u32) -> Result<Vec<WorkerJob>, sqlx::Error> {
        let worker_id = Uuid::new_v4().to_string();
        let timeout_interval = format!("{} seconds", self.config.job_timeout_secs);

        // FOR UPDATE SKIP LOCKED = atomische lock, nooit twee workers dezelfde job
        let jobs = sqlx::query_as!(
            WorkerJob,
            r#"
            UPDATE worker_job
            SET status = 'Running',
                lock_key = $1,
                lock_expires_at = NOW() + $2::interval,
                started_at = NOW(),
                attempt_count = attempt_count + 1
            WHERE id IN (
                SELECT id FROM worker_job
                WHERE queue = $3
                  AND status = 'Idle'
                  AND (retry_at IS NULL OR retry_at <= NOW())
                ORDER BY priority DESC, id ASC
                LIMIT $4
                FOR UPDATE SKIP LOCKED
            )
            RETURNING id, queue, key, payload,
                      status as "status: WorkerJobStatus",
                      attempt_count, retry_at, fairness_key
            "#,
            worker_id,
            timeout_interval,
            self.config.name,
            limit as i64,
        )
        .fetch_all(&self.pool)
        .await?;

        Ok(jobs)
    }
}

/// Voert één job uit en slaat het resultaat op in de DB
async fn execute_job<P, R, F, Fut>(
    job: WorkerJob,
    processor: F,
    pool: PgPool,
    config: QueueConfig,
    pubsub: Arc<RedisPubSub>,
)
where
    P: for<'de> serde::Deserialize<'de>,
    R: Serialize,
    F: Fn(P) -> Fut,
    Fut: std::future::Future<Output = Result<R, WorkerError>>,
{
    let channel = format!("queue:{}", config.name);

    // Deserialize payload JSON → Rust struct
    let payload: P = match serde_json::from_str(&job.payload) {
        Ok(p) => p,
        Err(e) => {
            error!(job_id = job.id, "Failed to deserialize payload: {}", e);
            mark_failed(&pool, job.id, &format!("Invalid payload: {}", e)).await;
            return;
        }
    };

    info!(job_id = job.id, queue = %config.name, "Processing job");

    match processor(payload).await {
        Ok(result) => {
            let result_json = serde_json::to_string(&result).unwrap_or_default();

            sqlx::query!(
                "UPDATE worker_job SET status = 'Succeeded', result = $1, finished_at = NOW()
                 WHERE id = $2",
                result_json,
                job.id,
            )
            .execute(&pool)
            .await
            .ok();

            // Notificeer waiters (bijv. Node.js die wacht op dit job)
            let msg = format!(
                r#"{{"type":"status-update","jobId":"{}","status":"succeeded"}}"#,
                job.id
            );
            pubsub.publish(&channel, &msg).await.ok();
            info!(job_id = job.id, "Job succeeded");
        }

        Err(WorkerError::Fatal(msg)) => {
            error!(job_id = job.id, "Job permanently failed: {}", msg);
            mark_failed(&pool, job.id, &msg).await;
            let notification = format!(
                r#"{{"type":"status-update","jobId":"{}","status":"failed"}}"#,
                job.id
            );
            pubsub.publish(&channel, &notification).await.ok();
        }

        Err(WorkerError::Retryable(msg)) => {
            if job.attempt_count >= config.max_retries as i32 {
                error!(job_id = job.id, attempts = job.attempt_count, "Max retries reached");
                mark_failed(&pool, job.id, &msg).await;
                let notification = format!(
                    r#"{{"type":"status-update","jobId":"{}","status":"failed"}}"#,
                    job.id
                );
                pubsub.publish(&channel, &notification).await.ok();
            } else {
                warn!(job_id = job.id, "Job failed, will retry: {}", msg);
                sqlx::query!(
                    "UPDATE worker_job SET status = 'Idle', error = $1,
                     retry_at = NOW() + $2::interval
                     WHERE id = $3",
                    msg,
                    format!("{} seconds", config.retry_delay_secs),
                    job.id,
                )
                .execute(&pool)
                .await
                .ok();
            }
        }

        Err(WorkerError::DelayedRetry { delay_secs, message }) => {
            warn!(job_id = job.id, delay = delay_secs, "Job rate limited, retrying later");
            sqlx::query!(
                "UPDATE worker_job SET status = 'Idle', error = $1,
                 retry_at = NOW() + $2::interval
                 WHERE id = $3",
                message,
                format!("{} seconds", delay_secs),
                job.id,
            )
            .execute(&pool)
            .await
            .ok();
        }
    }
}

async fn mark_failed(pool: &PgPool, job_id: i64, error: &str) {
    sqlx::query!(
        "UPDATE worker_job SET status = 'Failed', error = $1, finished_at = NOW() WHERE id = $2",
        error,
        job_id,
    )
    .execute(pool)
    .await
    .ok();
}
```

---

## 13. Stap 5: Node.js triggert een Rust worker

Wanneer een gebruiker een PDF uploadt via de web app, doet Node.js het volgende:

```typescript
// apps/api-node/src/flow/table.service.ts (of een nieuwe document.service.ts)

import { db } from "../drizzle/drizzle.provider";
import { workerJobs, courseDocuments } from "../drizzle/schema";
import { createId } from "@paralleldrive/cuid2";
import { redis } from "../redis/redis.provider";

interface DocumentParsePayload {
  documentId: string;
  flowcourseId: string;
  userId: string;
  fileUrl: string;
}

export async function enqueueDocumentParsing(
  documentId: string,
  flowcourseId: string,
  userId: string,
  fileUrl: string,
): Promise<bigint> {
  const payload: DocumentParsePayload = {
    documentId,
    flowcourseId,
    userId,
    fileUrl,
  };

  // Insert job in worker_job tabel
  const [job] = await db
    .insert(workerJobs)
    .values({
      queue: "document_parsing", // ← EXACT hetzelfde als QUEUE_NAME in Rust
      payload: JSON.stringify(payload), // camelCase JSON ← Rust verwacht dit
      key: documentId, // deduplicatie: één parse job per document
    })
    .returning({ id: workerJobs.id });

  // Stuur Redis notificatie zodat Rust worker meteen wakker wordt
  await redis.publish(
    "queue:document_parsing",
    JSON.stringify({ type: "run-job", jobId: job.id.toString() }),
  );

  return job.id;
}

// Gebruik in een endpoint:
// POST /api/flowcourses/:id/documents
export async function uploadCourseDocument(
  flowcourseId: string,
  userId: string,
  fileUrl: string,
  title: string,
) {
  const documentId = createId();

  // Maak document record aan
  await db.insert(courseDocuments).values({
    id: documentId,
    flowcourseId,
    userId,
    title,
    fileUrl,
    processingStatus: "pending",
  });

  // Enqueue de Rust worker
  await enqueueDocumentParsing(documentId, flowcourseId, userId, fileUrl);

  return { documentId };
}
```

**Het JSON contract:** Node schrijft `{"documentId":"...","flowcourseId":"..."}` (camelCase). Rust leest dit met `#[serde(rename_all = "camelCase")]`. Zolang beide kanten dit volgen, werkt de communicatie automatisch.

---

## 14. Stap 6: De document-parser-worker

De worker pakt PDFs, extraheert de tekst, slaat die op, en enqueued dan de volgende workers.

### PDF parsing in Rust

Voor PDF's van 400 pagina's zijn er twee aanpakken:

| Aanpak                | Crate                             | Gebruik               |
| --------------------- | --------------------------------- | --------------------- |
| Tekst-PDFs (digitaal) | `pdf-extract`                     | 90% van cursus PDFs   |
| Scan-PDFs (foto's)    | Externe OCR API (Azure, Google)   | 10%, alleen als nodig |
| Gemengd               | `pdf-extract` + fallback naar OCR | Robuuste aanpak       |

We beginnen met `pdf-extract` voor digitale PDFs:

```toml
# workers/document-parser/Cargo.toml
[package]
name = "document-parser"
version = "0.1.0"
edition = "2021"

[[bin]]
name = "document-parser"
path = "src/main.rs"

[dependencies]
tokio = { workspace = true }
serde = { workspace = true }
serde_json = { workspace = true }
sqlx = { workspace = true }
anyhow = { workspace = true }
thiserror = { workspace = true }
tracing = { workspace = true }
tracing-subscriber = { version = "0.3", features = ["env-filter"] }
dotenvy = { workspace = true }
reqwest = { version = "0.12", features = ["json", "stream"] }

# Queue systeem
queue = { path = "../../crates/queue" }
db-client = { path = "../../crates/db-client" }

# PDF parsing
pdf-extract = "0.7"

# UUID voor document IDs
uuid = { version = "1", features = ["v4"] }
```

### De types

```rust
// workers/document-parser/src/types.rs
use serde::{Deserialize, Serialize};

/// Wat Node in worker_job.payload steekt.
/// ALTIJD #[serde(rename_all = "camelCase")] — anders matcht het JSON niet!
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseDocumentPayload {
    pub document_id: String,    // → "documentId" in JSON
    pub flowcourse_id: String,  // → "flowcourseId"
    pub user_id: String,        // → "userId"
    pub file_url: String,       // → "fileUrl"
}

/// Wat de worker teruggeeft in worker_job.result na succes.
#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ParseDocumentResult {
    pub document_id: String,
    pub page_count: i32,
    pub text_length: i32,
    pub chunk_count: i32,
}
```

### De errors

```rust
// workers/document-parser/src/errors.rs
use thiserror::Error;

#[derive(Debug, Error)]
pub enum ParseError {
    #[error("Document not found in DB: {0}")]
    DocumentNotFound(String),

    #[error("Failed to download PDF: {0}")]
    DownloadFailed(String),

    #[error("PDF parsing failed: {0}")]
    PdfParseFailed(String),

    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),
}

impl ParseError {
    /// true = permanente fout, geen retry
    pub fn is_fatal(&self) -> bool {
        matches!(self, Self::DocumentNotFound(_))
        // PdfParseFailed is ook potentieel fatal maar we retrien toch een keer
    }
}
```

### De processor

```rust
// workers/document-parser/src/processor.rs
use std::io::Cursor;
use sqlx::PgPool;
use tracing::{info, warn};

use crate::errors::ParseError;
use crate::types::{ParseDocumentPayload, ParseDocumentResult};

pub async fn process(
    pool: &PgPool,
    payload: ParseDocumentPayload,
) -> Result<ParseDocumentResult, ParseError> {
    let document_id = &payload.document_id;

    info!(document_id = %document_id, "Starting document parsing");

    // 1. Update status in DB
    sqlx::query!(
        "UPDATE course_documents SET processing_status = 'parsing', updated_at = NOW()
         WHERE id = $1",
        document_id,
    )
    .execute(pool)
    .await?;

    // 2. Download de PDF als bytes
    let pdf_bytes = download_pdf(&payload.file_url).await?;

    info!(
        document_id = %document_id,
        size_mb = pdf_bytes.len() / 1_048_576,
        "PDF downloaded"
    );

    // 3. Extraheer tekst uit PDF
    // pdf_extract::extract_text_from_mem werkt op een byte slice
    // Dit is synchrone code — we wrappen het in spawn_blocking zodat
    // de Tokio event loop niet geblokkeerd wordt tijdens CPU-intensief werk
    let text = {
        let bytes = pdf_bytes.clone();
        tokio::task::spawn_blocking(move || {
            pdf_extract::extract_text_from_mem(&bytes)
                .map_err(|e| ParseError::PdfParseFailed(e.to_string()))
        })
        .await
        .map_err(|e| ParseError::PdfParseFailed(e.to_string()))??
    };

    let text_length = text.len() as i32;
    // Ruwe schatting van pagina's: gemiddeld 3000 chars per pagina
    let estimated_pages = (text_length / 3000).max(1);

    info!(
        document_id = %document_id,
        chars = text_length,
        estimated_pages = estimated_pages,
        "Text extracted"
    );

    // 4. Sla de geëxtraheerde tekst op in de DB
    sqlx::query!(
        "UPDATE course_documents
         SET extracted_text = $1, page_count = $2, processing_status = 'parsed', updated_at = NOW()
         WHERE id = $3",
        text,
        estimated_pages,
        document_id,
    )
    .execute(pool)
    .await?;

    // 5. Maak chunks van de tekst voor Qdrant indexering
    let chunks = chunk_text(&text, 1500);  // ~1500 chars per chunk
    let chunk_count = chunks.len() as i32;

    // Sla alle chunks op in één batch INSERT
    // sqlx ondersteunt geen batch inserts natively, dus we doen het in een loop
    // (Voor productie: gebruik COPY of unnest trick voor bulk inserts)
    for (i, chunk) in chunks.iter().enumerate() {
        sqlx::query!(
            "INSERT INTO document_chunks (document_id, chunk_index, content, token_count)
             VALUES ($1, $2, $3, $4)",
            document_id,
            i as i32,
            chunk.as_str(),
            estimate_tokens(chunk),
        )
        .execute(pool)
        .await?;
    }

    info!(
        document_id = %document_id,
        chunk_count = chunk_count,
        "Chunks created"
    );

    Ok(ParseDocumentResult {
        document_id: document_id.clone(),
        page_count: estimated_pages,
        text_length,
        chunk_count,
    })
}

async fn download_pdf(url: &str) -> Result<Vec<u8>, ParseError> {
    let response = reqwest::get(url)
        .await
        .map_err(|e| ParseError::DownloadFailed(e.to_string()))?;

    if !response.status().is_success() {
        return Err(ParseError::DownloadFailed(format!(
            "HTTP {} downloading PDF",
            response.status()
        )));
    }

    let bytes = response
        .bytes()
        .await
        .map_err(|e| ParseError::DownloadFailed(e.to_string()))?;

    Ok(bytes.to_vec())
}

/// Splits tekst in overlappende chunks
/// overlap van 200 chars zorgt dat context niet verloren gaat aan chunk-grenzen
fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    let overlap = 200;
    let chars: Vec<char> = text.chars().collect();
    let total = chars.len();
    let mut chunks = Vec::new();
    let mut start = 0;

    while start < total {
        let end = (start + chunk_size).min(total);

        // Probeer te eindigen op een zin (punt, vraagteken, uitroepteken)
        let end = if end < total {
            chars[start..end]
                .iter()
                .enumerate()
                .rev()
                .find(|(_, &c)| c == '.' || c == '?' || c == '!')
                .map(|(i, _)| start + i + 1)
                .unwrap_or(end)
        } else {
            end
        };

        let chunk: String = chars[start..end].iter().collect();
        if !chunk.trim().is_empty() {
            chunks.push(chunk);
        }

        // Volgende chunk start met overlap
        start = if end > overlap { end - overlap } else { end };
    }

    chunks
}

/// Ruwe schatting: 1 token ≈ 4 chars (voor Engelse tekst)
fn estimate_tokens(text: &str) -> i32 {
    (text.len() / 4) as i32
}
```

### lib.rs — de Queue starten

```rust
// workers/document-parser/src/lib.rs
mod errors;
mod processor;
pub mod types;

use std::sync::Arc;
use sqlx::PgPool;

use queue::{Queue, QueueConfig};
use crate::errors::ParseError;
use crate::types::{ParseDocumentPayload, ParseDocumentResult};

/// EXACT hetzelfde als wat Node.js in worker_job.queue schrijft
const QUEUE_NAME: &str = "document_parsing";

pub async fn start(pool: PgPool, pubsub: Arc<queue::RedisPubSub>) -> anyhow::Result<()> {
    let queue = Queue::<ParseDocumentPayload, ParseDocumentResult>::new(
        QueueConfig::new(QUEUE_NAME)
            .with_concurrency(2)          // 2 PDFs tegelijk — parsing is CPU-intensief
            .with_max_retries(5)
            .with_retry_delay_secs(60),   // 1 minuut wachten bij fout
        pool.clone(),
        pubsub,
    );

    queue
        .start_runner(move |payload| {
            let pool = pool.clone();
            async move {
                processor::process(&pool, payload)
                    .await
                    .map_err(|e| {
                        if e.is_fatal() {
                            queue::WorkerError::Fatal(e.to_string())
                        } else {
                            queue::WorkerError::Retryable(e.to_string())
                        }
                    })
            }
        })
        .await
}
```

### main.rs

```rust
// workers/document-parser/src/main.rs
use std::sync::Arc;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Laad .env bestand (DATABASE_URL, REDIS_URL, enz.)
    dotenvy::dotenv().ok();

    // Setup logging — gebruik RUST_LOG env var om level in te stellen
    // RUST_LOG=info,document_parser=debug  → info voor alles, debug voor onze code
    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env())
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Database verbinding
    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let pool = db_client::pool::create_pool(&database_url).await?;

    // Redis verbinding
    let redis_url = std::env::var("REDIS_URL")
        .expect("REDIS_URL must be set");
    let pubsub = Arc::new(queue::RedisPubSub::new(&redis_url)?);

    tracing::info!("Document parser worker starting...");

    document_parser::start(pool, pubsub).await
}
```

### .env bestand

```bash
# apps/services/rust-services/.env

# Jouw lokale PostgreSQL (uit docker-compose.yml)
DATABASE_URL=postgres://devusr:devpwd@localhost:5432/studo

# Jouw lokale Redis (uit docker-compose.yml)
# Formaat: redis://:password@host:port
REDIS_URL=redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379

# Log level
RUST_LOG=info,document_parser=debug

# Anthropic API key (voor AI workers)
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 15. Stap 7: Studoset generator worker

Na het parsen van de PDF wil je automatisch flashcards genereren. De worker:

1. Leest de chunks uit `document_chunks`
2. Stuurt ze naar Claude API
3. Slaat de gegenereerde cards op in `studysets` + `cards` (jouw bestaande tabellen!)

### Types

```rust
// workers/studoset-generator/src/types.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateStudosetPayload {
    pub document_id: String,
    pub flowcourse_id: String,
    pub user_id: String,
    pub language: String,       // "nl" | "en" | "fr" — taal van het cursusmateriaal
    pub max_cards: Option<i32>, // optioneel: max aantal kaartjes (default: 50)
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateStudosetResult {
    pub studyset_id: String,
    pub card_count: i32,
}

// Wat de AI teruggeeft
#[derive(Debug, Deserialize)]
pub struct AiCard {
    pub term: String,
    pub definition: String,
}

#[derive(Debug, Deserialize)]
pub struct AiStudosetResponse {
    pub title: String,
    pub cards: Vec<AiCard>,
}
```

### De Anthropic API aanroepen

```rust
// workers/studoset-generator/src/anthropic.rs
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::types::AiStudosetResponse;

pub struct AnthropicClient {
    client: Client,
    api_key: String,
}

impl AnthropicClient {
    pub fn new(api_key: String) -> Self {
        Self {
            client: Client::new(),
            api_key,
        }
    }

    pub async fn generate_studoset(
        &self,
        text_chunks: &[String],
        language: &str,
        max_cards: i32,
    ) -> Result<AiStudosetResponse, reqwest::Error> {
        // Combineer chunks tot één tekst (max ~8000 chars om tokens te beperken)
        let combined_text = text_chunks
            .iter()
            .take(20)  // max 20 chunks voor deze call
            .cloned()
            .collect::<Vec<_>>()
            .join("\n\n---\n\n");

        let prompt = format!(
            r#"Je bent een expert studieassistent. Analyseer de volgende cursustekst en genereer flashcards.

TEKST:
{combined_text}

INSTRUCTIES:
- Genereer maximaal {max_cards} flashcards
- Taal: {language}
- Focus op de belangrijkste concepten, definities en feiten
- Maak de term bondig (1-5 woorden)
- Maak de definitie volledig maar beknopt (1-3 zinnen)
- Geef ook een passende titel voor de studyset

ANTWOORD in dit exacte JSON formaat:
{{
  "title": "Naam van de studyset",
  "cards": [
    {{"term": "Begriff", "definition": "Uitleg van het begrip"}},
    ...
  ]
}}"#
        );

        let response = self
            .client
            .post("https://api.anthropic.com/v1/messages")
            .header("x-api-key", &self.api_key)
            .header("anthropic-version", "2023-06-01")
            .header("content-type", "application/json")
            .json(&json!({
                "model": "claude-sonnet-4-6",
                "max_tokens": 4096,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            }))
            .send()
            .await?;

        // Parse de Anthropic response envelope
        let api_response: serde_json::Value = response.json().await?;

        let content = api_response["content"][0]["text"]
            .as_str()
            .unwrap_or("{}");

        // Extract JSON uit de tekst (AI geeft soms extra tekst rondom de JSON)
        let json_start = content.find('{').unwrap_or(0);
        let json_end = content.rfind('}').map(|i| i + 1).unwrap_or(content.len());
        let json_str = &content[json_start..json_end];

        let result: AiStudosetResponse = serde_json::from_str(json_str)
            .unwrap_or_else(|_| AiStudosetResponse {
                title: "Gegenereerde studyset".to_string(),
                cards: vec![],
            });

        Ok(result)
    }
}
```

### De processor

```rust
// workers/studoset-generator/src/processor.rs
use sqlx::PgPool;
use tracing::info;
use uuid::Uuid;
use chrono::Utc;

use crate::anthropic::AnthropicClient;
use crate::types::{GenerateStudosetPayload, GenerateStudosetResult};
use crate::errors::GeneratorError;

pub async fn process(
    pool: &PgPool,
    anthropic: &AnthropicClient,
    payload: GenerateStudosetPayload,
) -> Result<GenerateStudosetResult, GeneratorError> {
    let document_id = &payload.document_id;
    let max_cards = payload.max_cards.unwrap_or(50);

    info!(document_id = %document_id, "Generating studoset");

    // 1. Haal chunks op uit de DB
    let chunks = sqlx::query!(
        "SELECT content FROM document_chunks
         WHERE document_id = $1
         ORDER BY chunk_index ASC",
        document_id,
    )
    .fetch_all(pool)
    .await?
    .into_iter()
    .map(|r| r.content)
    .collect::<Vec<_>>();

    if chunks.is_empty() {
        return Err(GeneratorError::NoChunks(document_id.clone()));
    }

    info!(document_id = %document_id, chunk_count = chunks.len(), "Fetched chunks");

    // 2. Roep de AI aan
    let ai_result = anthropic
        .generate_studoset(&chunks, &payload.language, max_cards)
        .await
        .map_err(|e| GeneratorError::AiFailed(e.to_string()))?;

    info!(
        document_id = %document_id,
        card_count = ai_result.cards.len(),
        title = %ai_result.title,
        "AI generated cards"
    );

    // 3. Sla de studyset op in JOUW bestaande studysets tabel
    let studyset_id = Uuid::new_v4().to_string();
    let now = Utc::now().to_rfc3339();

    // Haal user info op voor displayName en img_url (vereist door schema)
    let user = sqlx::query!(
        "SELECT displayname, img_url FROM users WHERE id = $1",
        payload.user_id,
    )
    .fetch_one(pool)
    .await?;

    sqlx::query!(
        r#"
        INSERT INTO studysets (
            id, title, studoset, global_term_language, global_definition_language,
            created_at, last_updated, public_set, displayname, img_url, user_id
        )
        VALUES ($1, $2, false, $3, $3, $4, $4, false, $5, $6, $7)
        "#,
        studyset_id,
        ai_result.title,
        payload.language,  // term en definition taal zijn beide dezelfde taal
        now,
        user.displayname,
        user.img_url,
        payload.user_id,
    )
    .execute(pool)
    .await?;

    // 4. Sla alle cards op in één transactie
    let mut tx = pool.begin().await?;

    for (i, ai_card) in ai_result.cards.iter().enumerate() {
        let card_id = Uuid::new_v4().to_string();

        sqlx::query!(
            r#"
            INSERT INTO cards (
                id, term, definition, number, created_at, updated_at,
                set_id, owner_id, term_content_type, code_language
            )
            VALUES ($1, $2, $3, $4, $5, $5, $6, $7, 'text', 'typescript')
            "#,
            card_id,
            ai_card.term,
            ai_card.definition,
            i as i32,
            now,
            studyset_id,
            payload.user_id,
        )
        .execute(&mut *tx)
        .await?;
    }

    tx.commit().await?;

    // 5. Koppel de studyset aan de flowcourse via flowcourse_sets
    let flowcourse_set_id = Uuid::new_v4().to_string();
    sqlx::query!(
        "INSERT INTO flowcourse_sets (id, set_id, course_id) VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING",
        flowcourse_set_id,
        studyset_id,
        payload.flowcourse_id,
    )
    .execute(pool)
    .await?;

    // 6. Update document status
    sqlx::query!(
        "UPDATE course_documents SET processing_status = 'done', updated_at = NOW()
         WHERE id = $1",
        document_id,
    )
    .execute(pool)
    .await?;

    info!(
        document_id = %document_id,
        studyset_id = %studyset_id,
        card_count = ai_result.cards.len(),
        "Studoset generated successfully"
    );

    Ok(GenerateStudosetResult {
        studyset_id,
        card_count: ai_result.cards.len() as i32,
    })
}
```

---

## 16. Stap 8: Visualset generator worker

Visualsets zijn visuele leersets met afbeeldingen en pins. Voor cursusmateriaal kunnen we:

- Diagrammen identificeren in de tekst
- Een visualset maken met conceptuele "kaart" layouts
- Of: Pexels afbeeldingen zoeken op basis van de cursusinhoud en pins genereren

Hier focussen we op de **tekstuele aanpak**: AI genereert een conceptuele diagram beschrijving die we omzetten naar een visualset.

```rust
// workers/visualset-generator/src/types.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateVisualsetPayload {
    pub document_id: String,
    pub flowcourse_id: String,
    pub user_id: String,
    pub language: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateVisualsetResult {
    pub visualset_id: Option<String>,  // None als geen diagram gevonden
    pub pin_count: i32,
}

// AI response voor visuele concepten
#[derive(Debug, Deserialize)]
pub struct AiPin {
    pub label: String,    // concept naam
    pub description: String,  // definitie/uitleg
    pub x: i32,          // positie 0-100 (percentage van breedte)
    pub y: i32,          // positie 0-100 (percentage van hoogte)
}

#[derive(Debug, Deserialize)]
pub struct AiVisualsetResponse {
    pub title: String,
    pub diagram_type: String,  // "mindmap" | "flowchart" | "cycle" | "hierarchy"
    pub pins: Vec<AiPin>,
}
```

---

## 17. Stap 9: Qdrant voor AI Q&A op cursusmateriaal

Qdrant is een vector database. Embeddings (numerieke representaties van tekst) worden opgeslagen zodat je semantisch kunt zoeken — "wat is mitose?" vindt relevante chunks ook als het woord "mitose" niet letterlijk in de zoekvraag staat.

### Setup

```yaml
# Voeg toe aan docker-compose.yml
qdrant:
  image: qdrant/qdrant:latest
  ports:
    - "6333:6333" # REST API
    - "6334:6334" # gRPC
  volumes:
    - qdrant_data:/qdrant/storage
```

### De document-indexer worker

```toml
# workers/document-indexer/Cargo.toml
[dependencies]
# ... zelfde als andere workers +
qdrant-client = "1"
```

```rust
// workers/document-indexer/src/types.rs
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndexDocumentPayload {
    pub document_id: String,
    pub flowcourse_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct IndexDocumentResult {
    pub indexed_chunks: i32,
}
```

```rust
// workers/document-indexer/src/embeddings.rs
// Genereert embeddings via Voyage AI (goede kwaliteit voor educatieve tekst)
// of via OpenAI text-embedding-3-small
use reqwest::Client;
use serde_json::json;

pub struct EmbeddingClient {
    client: Client,
    api_key: String,
}

impl EmbeddingClient {
    pub fn new(api_key: String) -> Self {
        Self { client: Client::new(), api_key }
    }

    /// Genereert embeddings voor een batch van teksten.
    /// Geeft Vec<Vec<f32>> terug — één vector per input tekst.
    pub async fn embed_batch(&self, texts: &[String]) -> Result<Vec<Vec<f32>>, reqwest::Error> {
        let response = self
            .client
            .post("https://api.openai.com/v1/embeddings")
            .bearer_auth(&self.api_key)
            .json(&json!({
                "model": "text-embedding-3-small",  // 1536 dimensies, goedkoop
                "input": texts,
            }))
            .send()
            .await?
            .json::<serde_json::Value>()
            .await?;

        let embeddings = response["data"]
            .as_array()
            .unwrap_or(&vec![])
            .iter()
            .map(|item| {
                item["embedding"]
                    .as_array()
                    .unwrap_or(&vec![])
                    .iter()
                    .map(|v| v.as_f64().unwrap_or(0.0) as f32)
                    .collect::<Vec<f32>>()
            })
            .collect::<Vec<_>>();

        Ok(embeddings)
    }
}
```

```rust
// workers/document-indexer/src/processor.rs
use qdrant_client::qdrant::{
    CreateCollectionBuilder, Distance, PointStruct, UpsertPointsBuilder, VectorParamsBuilder,
};
use qdrant_client::Qdrant;
use sqlx::PgPool;
use tracing::info;

use crate::embeddings::EmbeddingClient;
use crate::errors::IndexError;
use crate::types::{IndexDocumentPayload, IndexDocumentResult};

const COLLECTION_NAME: &str = "studo_course_chunks";
const VECTOR_SIZE: u64 = 1536;  // OpenAI text-embedding-3-small dimensies
const BATCH_SIZE: usize = 50;   // Hoeveel chunks per API call embedden

pub async fn process(
    pool: &PgPool,
    qdrant: &Qdrant,
    embedder: &EmbeddingClient,
    payload: IndexDocumentPayload,
) -> Result<IndexDocumentResult, IndexError> {
    let document_id = &payload.document_id;

    // 1. Zorg dat de Qdrant collection bestaat
    ensure_collection(qdrant).await?;

    // 2. Haal alle chunks op
    let chunks = sqlx::query!(
        "SELECT id, content, chunk_index, page_number FROM document_chunks
         WHERE document_id = $1 ORDER BY chunk_index ASC",
        document_id,
    )
    .fetch_all(pool)
    .await?;

    info!(document_id = %document_id, count = chunks.len(), "Indexing chunks");

    let mut indexed_count = 0;

    // 3. Verwerk in batches (API heeft limiet per call)
    for batch in chunks.chunks(BATCH_SIZE) {
        let texts: Vec<String> = batch.iter().map(|c| c.content.clone()).collect();

        // Genereer embeddings voor deze batch
        let embeddings = embedder
            .embed_batch(&texts)
            .await
            .map_err(|e| IndexError::EmbeddingFailed(e.to_string()))?;

        // Maak Qdrant punten aan
        let points: Vec<PointStruct> = batch
            .iter()
            .zip(embeddings.iter())
            .map(|(chunk, embedding)| {
                PointStruct::new(
                    chunk.id as u64,  // Qdrant wil u64 als ID
                    embedding.clone(),
                    // Payload = metadata die bij het punt opgeslagen wordt
                    // Dit wordt teruggegeven bij search results
                    std::collections::HashMap::from([
                        ("document_id".to_string(), document_id.clone().into()),
                        ("flowcourse_id".to_string(), payload.flowcourse_id.clone().into()),
                        ("chunk_index".to_string(), (chunk.chunk_index as i64).into()),
                        ("content".to_string(), chunk.content.clone().into()),
                        ("page_number".to_string(), chunk.page_number.unwrap_or(0).into()),
                    ]),
                )
            })
            .collect();

        // Upload naar Qdrant
        qdrant
            .upsert_points(UpsertPointsBuilder::new(COLLECTION_NAME, points))
            .await
            .map_err(|e| IndexError::QdrantFailed(e.to_string()))?;

        indexed_count += batch.len();
        info!(document_id = %document_id, progress = indexed_count, "Batch indexed");
    }

    Ok(IndexDocumentResult {
        indexed_chunks: indexed_count as i32,
    })
}

async fn ensure_collection(qdrant: &Qdrant) -> Result<(), IndexError> {
    // Check of collection al bestaat
    let collections = qdrant
        .list_collections()
        .await
        .map_err(|e| IndexError::QdrantFailed(e.to_string()))?;

    let exists = collections
        .collections
        .iter()
        .any(|c| c.name == COLLECTION_NAME);

    if !exists {
        qdrant
            .create_collection(
                CreateCollectionBuilder::new(COLLECTION_NAME)
                    .vectors_config(VectorParamsBuilder::new(VECTOR_SIZE, Distance::Cosine)),
            )
            .await
            .map_err(|e| IndexError::QdrantFailed(e.to_string()))?;

        info!("Created Qdrant collection: {}", COLLECTION_NAME);
    }

    Ok(())
}
```

### Q&A endpoint in Node.js

Nu de chunks geïndexeerd zijn, kun je vragen beantwoorden. Dit kan gewoon in Node.js via de Qdrant REST API:

```typescript
// apps/api-node/src/flow/document-qa.service.ts

const QDRANT_URL = process.env.QDRANT_URL ?? "http://localhost:6333";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY!;

interface QaResult {
  answer: string;
  sources: Array<{ content: string; pageNumber: number; chunkIndex: number }>;
}

export async function answerQuestion(
  question: string,
  flowcourseId: string,
): Promise<QaResult> {
  // 1. Embed de vraag
  const embeddingResponse = await fetch(
    "https://api.openai.com/v1/embeddings",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: question,
      }),
    },
  );
  const { data } = await embeddingResponse.json();
  const questionEmbedding = data[0].embedding;

  // 2. Zoek relevante chunks in Qdrant (filter op flowcourse_id!)
  const searchResponse = await fetch(
    `${QDRANT_URL}/collections/studo_course_chunks/points/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vector: questionEmbedding,
        limit: 5,
        with_payload: true,
        filter: {
          must: [{ key: "flowcourse_id", match: { value: flowcourseId } }],
        },
      }),
    },
  );
  const { result: hits } = await searchResponse.json();

  const context = hits
    .map((hit: any) => hit.payload.content)
    .join("\n\n---\n\n");

  const sources = hits.map((hit: any) => ({
    content: hit.payload.content,
    pageNumber: hit.payload.page_number,
    chunkIndex: hit.payload.chunk_index,
  }));

  // 3. Genereer antwoord via Claude
  const answerResponse = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Beantwoord de vraag op basis van de cursustekst hieronder.
        
CURSUSTEKST:
${context}

VRAAG: ${question}

Geef een duidelijk, beknopt antwoord. Verwijs naar specifieke informatie uit de tekst.`,
        },
      ],
    }),
  });

  const { content } = await answerResponse.json();
  const answer = content[0].text;

  return { answer, sources };
}
```

---

## 18. Stap 10: De workflow service — alles orchestreren

De workflow service verbindt de workers in een pipeline: parse → index → genereer studoset → genereer visualset.

```rust
// workers/workflow-runner/src/main.rs
// Dit is een aparte binary die alle queues in de gaten houdt
// en de pipeline orkestreert

use std::sync::Arc;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenvy::dotenv().ok();
    setup_tracing();

    let pool = create_db_pool().await?;
    let pubsub = Arc::new(create_redis_pubsub().await?);
    let anthropic = Arc::new(AnthropicClient::new(
        std::env::var("ANTHROPIC_API_KEY").expect("ANTHROPIC_API_KEY must be set")
    ));

    // Start alle workers tegelijk via tokio::join!
    // Als één worker crasht, crasht het hele process (gewenst in productie)
    tokio::try_join!(
        document_parser::start(pool.clone(), Arc::clone(&pubsub)),
        studoset_generator::start(pool.clone(), Arc::clone(&pubsub), Arc::clone(&anthropic)),
        document_indexer::start(pool.clone(), Arc::clone(&pubsub)),
        visualset_generator::start(pool.clone(), Arc::clone(&pubsub), Arc::clone(&anthropic)),
    )?;

    Ok(())
}
```

### Automatisch chaining: van parsing naar generatie

Na het parsen wil je automatisch de volgende stap starten. Dit doe je in de `processor.rs` van de parser, nadat de chunks aangemaakt zijn:

```rust
// workers/document-parser/src/processor.rs (aanvulling)
// Voeg dit toe na het aanmaken van de chunks:

// Enqueue de volgende stap: studoset genereren
let next_payload = serde_json::json!({
    "documentId": document_id,
    "flowcourseId": payload.flowcourse_id,
    "userId": payload.user_id,
    "language": "nl",  // of detecteer taal uit de tekst
    "maxCards": 50,
});

sqlx::query!(
    "INSERT INTO worker_job (queue, payload, status, key)
     VALUES ('studoset_generation', $1, 'Idle', $2)
     ON CONFLICT DO NOTHING",  // dedup: één job per document
    next_payload.to_string(),
    document_id,  // key = document_id voor dedup
)
.execute(pool)
.await?;

// Publiceer notificatie naar Redis
pubsub.publish(
    "queue:studoset_generation",
    &format!(r#"{{"type":"run-job"}}"#),
).await.ok();

// Ook document-indexer starten
let index_payload = serde_json::json!({
    "documentId": document_id,
    "flowcourseId": payload.flowcourse_id,
});

sqlx::query!(
    "INSERT INTO worker_job (queue, payload, status, key)
     VALUES ('document_indexing', $1, 'Idle', $2)
     ON CONFLICT DO NOTHING",
    index_payload.to_string(),
    format!("{}-index", document_id),
)
.execute(pool)
.await?;
```

---

## 19. Lokaal draaien en debuggen

### Workspace omzetten en builden

```bash
cd apps/services/rust-services

# Vervang het huidige Cargo.toml met workspace versie
# (zie sectie 8 voor de inhoud)

# Maak de mappenstructuur aan
mkdir -p crates/db-client/src
mkdir -p crates/queue/src
mkdir -p workers/document-parser/src
mkdir -p workers/studoset-generator/src
mkdir -p workers/document-indexer/src

# Type-check alles (geen compilatie, snel feedback)
cargo check

# Compileer een specifieke worker
cargo build -p document-parser

# Draai de document-parser worker
RUST_LOG=debug cargo run -p document-parser

# Of via Makefile (voeg toe aan Makefile in root):
# start-rust-workers:
#     cd apps/services/rust-services && cargo run -p document-parser
```

### Een job manueel injecteren voor testen

```sql
-- Simuleer een document upload zonder de Node.js frontend
INSERT INTO course_documents (id, flowcourse_id, user_id, title, file_url, processing_status)
VALUES (
    'test-doc-001',
    'jouw-flowcourse-id',  -- vervang met echte ID
    'jouw-user-id',         -- vervang met echte ID
    'Test cursusmateriaal',
    'https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf',
    'pending'
);

-- Enqueue de parsing job
INSERT INTO worker_job (queue, payload, status)
VALUES (
    'document_parsing',
    '{"documentId":"test-doc-001","flowcourseId":"jouw-flowcourse-id","userId":"jouw-user-id","fileUrl":"https://www.w3.org/WAI/WCAG21/Techniques/pdf/sample.pdf"}',
    'Idle'
);
```

### Status checken

```sql
-- Bekijk alle jobs voor je document
SELECT queue, status, attempt_count, error,
       LEFT(result, 200) as result_preview,
       created_at, finished_at
FROM worker_job
WHERE payload::jsonb->>'documentId' = 'test-doc-001'
ORDER BY created_at DESC;

-- Chunks die aangemaakt zijn
SELECT COUNT(*), AVG(LENGTH(content)) as avg_chars
FROM document_chunks
WHERE document_id = 'test-doc-001';

-- Studysets die aangemaakt zijn
SELECT s.id, s.title, COUNT(c.id) as card_count
FROM studysets s
LEFT JOIN cards c ON c.set_id = s.id
GROUP BY s.id, s.title
ORDER BY s.created_at DESC
LIMIT 5;

-- Gefaalde jobs inspecteren
SELECT id, queue, attempt_count, error
FROM worker_job
WHERE status = 'Failed'
ORDER BY created_at DESC;

-- Vastgelopen jobs resetten
UPDATE worker_job
SET status = 'Idle', error = NULL, attempt_count = 0,
    retry_at = NULL, lock_key = NULL, lock_expires_at = NULL
WHERE id = 42;  -- vervang met job ID
```

### Logs interpreteren

```bash
# Start worker met debug logs
RUST_LOG=info,document_parser=debug,queue=debug cargo run -p document-parser

# Typische succesvolle log output:
# INFO document_parser: Document parser worker starting...
# INFO queue: Worker started queue="document_parsing" concurrency=2
# INFO document_parser::processor: Starting document parsing document_id="test-doc-001"
# INFO document_parser::processor: PDF downloaded size_mb=2
# INFO document_parser::processor: Text extracted chars=45230 estimated_pages=15
# INFO document_parser::processor: Chunks created chunk_count=34
# INFO queue: Job succeeded job_id=1
```

---

## 20. Veelgemaakte fouten en hoe je ze oplost

### Fout 1: `cannot move out of ... which is behind a shared reference`

```rust
// ❌ Probleem
let name = document.title;  // move uit &Document — niet toegestaan

// ✅ Oplossing 1: clone
let name = document.title.clone();

// ✅ Oplossing 2: referentie gebruiken
let name = &document.title;

// ✅ Oplossing 3: ownership nemen als je die hebt
fn process(document: Document) {  // niet &Document
    let name = document.title;  // OK, we hebben ownership
}
```

### Fout 2: `expected &str, found String` (of andersom)

```rust
// String = owned, gealloceerd op heap
// &str = referentie naar string data (kan String of string literal zijn)

// ❌
fn greet(name: String) { ... }
greet("hello");  // "hello" is &str, geen String

// ✅
fn greet(name: &str) { ... }  // accepteer &str — flexibeler
greet("hello");        // OK
greet(&my_string);     // OK — &String auto-converteert naar &str
```

### Fout 3: `#[serde(rename_all = "camelCase")]` vergeten

Symptoom: job staat eeuwig op `Idle` (payload wordt niet geparsed).

```rust
// ❌ Node schrijft {"documentId":"..."} maar Rust verwacht {"document_id":"..."}
#[derive(Deserialize)]
struct Payload {
    document_id: String,  // zoekt naar "document_id" in JSON
}

// ✅
#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]  // "documentId" → document_id
struct Payload {
    document_id: String,
}
```

### Fout 4: `async fn` in een `impl` blok dat `Sync` nodig heeft

```rust
// ❌ Probleem met async trait methods
trait Processor {
    async fn process(&self) -> Result<(), Error>;  // niet stable in Rust traits!
}

// ✅ Gebruik async_trait crate
use async_trait::async_trait;

#[async_trait]
trait Processor {
    async fn process(&self) -> Result<(), Error>;
}
```

### Fout 5: `the trait bound ... is not satisfied`

Dit is de Rust versie van een TypeScript generic constraint fout. Lees de volledige error — de compiler vertelt je precies welk trait ontbreekt.

```
error[E0277]: `MyStruct` cannot be sent between threads safely
  = help: the trait `Send` is not implemented for `MyStruct`
```

Oplossing: voeg `#[derive(Clone)]` toe, of wrap in `Arc<Mutex<...>>` als je mutable access nodig hebt over threads.

### Fout 6: sqlx compile-time query check faalt

sqlx `query!` en `query_as!` macro's connecten op **compile-time** met je database om queries te valideren. Als de DB niet draait, compileert de code niet.

```bash
# Oplossing 1: DB starten voor compilatie
docker compose up db -d

# Oplossing 2: SQLX_OFFLINE mode (gebruik gecachte query info)
# Eerst: cargo sqlx prepare  (genereert .sqlx/ folder)
# Dan: SQLX_OFFLINE=true cargo build

# Voor development: zet in .cargo/config.toml:
[env]
SQLX_OFFLINE = "true"
```

### Fout 7: lifetime errors

```
error[E0106]: missing lifetime specifier
```

Lifetimes zijn het moeilijkste deel van Rust. Voor beginners: **gebruik `String` in plaats van `&str` in structs**, dan vermijd je de meeste lifetime problemen:

```rust
// ❌ Vereist lifetime annotaties
struct Processor<'a> {
    queue_name: &'a str,
}

// ✅ Simpeler — gebruik String in structs
struct Processor {
    queue_name: String,
}
```

---

## Samenvatting: de complete data-flow voor STUDO

```
Gebruiker upload PDF via web app
    │
    ▼
Node.js endpoint (apps/api-node)
    │  INSERT course_documents (status='pending')
    │  INSERT worker_job (queue='document_parsing', payload=JSON)
    │  PUBLISH queue:document_parsing via Redis
    ▼
Rust document-parser-worker
    │  Download PDF van URL
    │  Extraheer tekst (pdf-extract)
    │  Split in chunks (1500 chars + overlap)
    │  INSERT document_chunks
    │  UPDATE course_documents (status='parsed')
    │  INSERT worker_job (queue='studoset_generation')
    │  INSERT worker_job (queue='document_indexing')
    │
    ├─────────────────────────────────┐
    ▼                                 ▼
Rust studoset-generator             Rust document-indexer
    │  Fetch chunks uit DB            │  Fetch chunks uit DB
    │  Claude API → flashcards        │  OpenAI Embeddings API
    │  INSERT studysets               │  Upsert naar Qdrant
    │  INSERT cards (jouw schema!)    │
    │  INSERT flowcourse_sets         │
    │  UPDATE course_documents        │
    │  (status='done')                │
    ▼                                 ▼
Gebruiker ziet studyset           AI Q&A werkt nu
in de web app                     op dit cursusmateriaal
```

**Kernprincipe:** Node.js en Rust delen geen code. Ze communiceren via:

1. **PostgreSQL** `worker_job` tabel — jobs toevoegen en resultaten ophalen
2. **Redis** pub/sub — snelle notificaties (sub-seconde wakeup)
3. **Gedeeld DB schema** — beide lezen/schrijven naar dezelfde tabellen (`studysets`, `cards`, `course_documents`, etc.)

Het enige contract tussen Node en Rust: de JSON payload shape (altijd camelCase) en de queue naam (altijd exact dezelfde string).

---

---

# Deel 2 — Diepgaande Rust: alles waar je aan zult twijfelen

> Dit deel behandelt de concepten die je na het lezen van deel 1 nog niet snapt, de edge cases die je pas tegenkomt als je écht gaat bouwen, en de vragen die elke TypeScript developer stelt als ze Rust leren.

---

## 21. Lifetimes — het gevreesde concept uitgelegd

Lifetimes zijn de reden dat veel mensen Rust opgeven. Maar 90% van de tijd hoef je ze niet te schrijven — de compiler raadt ze zelf. Je krijgt alleen lifetime errors als de compiler het niet kan raden. Hier is alles wat je moet weten.

### Waarom lifetimes bestaan

Het probleem dat lifetimes oplossen:

```rust
fn get_name(user: &User) -> &str {
    &user.name  // geeft een referentie terug die naar user.name wijst
}

let name;
{
    let user = User { name: "Alice".to_string() };
    name = get_name(&user);
    // user gaat hier out of scope → geheugen vrijgemaakt
}
println!("{}", name);  // ❌ name wijst naar vrijgemaakt geheugen!
```

De compiler moet weten: "hoe lang leeft de referentie die ik teruggeef?" Lifetimes zijn de notatie daarvoor.

### Lifetime annotaties lezen (niet schrijven)

```rust
// 'a is een lifetime parameter — lees het als "levensduur a"
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
//         ↑             ↑              ↑
//    "er is een levensduur 'a"
//    "x leeft minstens zo lang als 'a"
//    "y leeft minstens zo lang als 'a"
//    "de return waarde leeft minstens zo lang als 'a"
    if x.len() > y.len() { x } else { y }
}
```

Vertaling: "x en y moeten allebei leven zolang de return waarde gebruikt wordt."

```rust
// ✅ OK
let s1 = String::from("long string");
let result;
{
    let s2 = String::from("short");
    result = longest(&s1, &s2);  // result leeft zolang s2 leeft
    println!("{}", result);  // OK — hier leven beide nog
}
// result hier gebruiken zou fail zijn als s2 al weg is

// ❌ Niet OK
let result;
{
    let s2 = String::from("short");
    result = longest(&s1, &s2);
}
println!("{}", result);  // ❌ s2 is al weg, maar result kan ernaar wijzen
```

### De praktische regel: gebruik `String` in structs

Als beginner: **gebruik nooit `&str` in structs**. Gebruik `String`. Dan heb je geen lifetime annotaties nodig.

```rust
// ❌ Vereist lifetime annotaties overal
struct Document<'a> {
    title: &'a str,
    content: &'a str,
}

// ✅ Geen lifetimes nodig
struct Document {
    title: String,
    content: String,
}
```

`String` bezit zijn data. `&str` is een lening. In structs wil je ownership, dus `String`.

### Wanneer je lifetimes WEL ziet in onze codebase

In de Queue implementatie:

```rust
// sqlx query_as! macros genereren soms lifetime errors
// Oplossing: gebruik String ipv &str in de query structs
```

In processor functies:

```rust
// ✅ Dit werkt — &self leeft lang genoeg
impl AnthropicClient {
    pub async fn call(&self, prompt: &str) -> Result<String, Error> {
        // &self en &prompt leven allebei de duur van deze functie
    }
}
```

### 'static — de speciale lifetime

```rust
// 'static betekent: leeft voor de hele duur van het programma
// String literals zijn altijd 'static
let s: &'static str = "hello";  // staat hardcoded in de binary

// tokio::spawn vereist 'static bounds:
tokio::spawn(async move {
    // alles hier moet 'static zijn
    // → gebruik clone() voor referenties die je meegeeft
});
```

---

## 22. String types — de complete gids

Dit is de grootste verwarringsaanleiding voor TypeScript developers.

### De vier string types

| Type       | Eigenaar     | Mutable | Gebruik                            |
| ---------- | ------------ | ------- | ---------------------------------- |
| `String`   | Ja           | Ja      | Dynamische strings, struct velden  |
| `&str`     | Nee (lening) | Nee     | Functieparameters, string literals |
| `&String`  | Nee (lening) | Nee     | Zelden — gebruik `&str` in plaats  |
| `Box<str>` | Ja           | Nee     | Zelden — immutable owned string    |

### De vuistregel

```rust
// In functie parameters: gebruik &str (accepteert zowel String als literals)
fn process(text: &str) { ... }

let owned = String::from("hello");
process(&owned);     // String → &str via Deref coercion
process("literal");  // &str direct

// In struct velden: gebruik String (ownership)
struct Config {
    api_key: String,  // niet &str
}

// In return types: gebruik String (callers kunnen niet lenen van tijdelijke waarden)
fn get_name() -> String {
    "Alice".to_string()
}
```

### String aanmaken — alle manieren

```rust
// Vanuit een literal
let s1 = "hello".to_string();
let s2 = String::from("hello");
let s3 = String::new();  // lege string

// Samenvoegen
let s4 = format!("{} {}", "hello", "world");  // aanbevolen — geen ownership move
let s5 = "hello".to_string() + " world";      // + verplaatst de linker String!

// Converteren
let n: i32 = 42;
let s = n.to_string();  // "42"
let n: i32 = "42".parse().unwrap();  // parse::<i32>() ook OK

// Van bytes (bijv. na HTTP response)
let bytes = vec![104u8, 101, 108, 108, 111];
let s = String::from_utf8(bytes).unwrap();  // "hello"
// Of als je niet zeker bent over encoding:
let s = String::from_utf8_lossy(&bytes).to_string();  // vervangt invalide bytes
```

### String slicen

```rust
let s = String::from("Hello, STUDO!");
let hello = &s[0..5];    // "Hello" — &str, niet String
let studo = &s[7..12];   // "STUDO"

// GEVAAR: slicen op byte boundaries, niet char boundaries!
// Voor Unicode (bijv. Nederlandstalige cursustekst met é, ü, etc.):
let s = "Héllo";
// &s[0..2] zou panichen — 'é' is 2 bytes in UTF-8!

// Veilig: gebruik chars()
let first_5: String = s.chars().take(5).collect();
```

### Waarom `.to_string()` vs `.into()` vs `String::from()`

Ze zijn equivalent. Kies één stijl en hou die aan:

```rust
// Alle drie zijn hetzelfde:
let a = "hello".to_string();
let b: String = "hello".into();
let c = String::from("hello");

// In context met type inference:
fn takes_string(s: String) { ... }
takes_string("hello".into());    // .into() is het kortst
takes_string("hello".to_string()); // .to_string() is het duidelijkst
```

---

## 23. Vec, slices en iterators — de complete gids

### Vec<T> vs &[T]

```rust
// Vec<T> = owned, dynamische array (zoals JS Array)
let mut v: Vec<i32> = vec![1, 2, 3];
v.push(4);

// &[T] = een slice — referentie naar een aaneengesloten stuk van een array
// Accepteert zowel Vec<T> als arrays
fn sum(numbers: &[i32]) -> i32 {   // &[i32] niet Vec<i32>
    numbers.iter().sum()
}

sum(&v);           // Vec → slice via &
sum(&[1, 2, 3]);   // array literal → slice
```

Zelfde patroon als `String` vs `&str`: in functieparameters gebruik `&[T]`, in structs gebruik `Vec<T>`.

### Iterator patterns — de Rust manier van map/filter

Dit is de meest expressieve Rust feature en het equivalent van Array.prototype methods in JS:

```typescript
// TypeScript
const titles = documents
  .filter((d) => d.status === "done")
  .map((d) => d.title.toUpperCase())
  .slice(0, 10);
```

```rust
// Rust — bijna identiek, maar lazy (wordt pas berekend bij collect())
let titles: Vec<String> = documents
    .iter()                                    // maak iterator
    .filter(|d| d.status == "done")            // filter (closure met &&)
    .map(|d| d.title.to_uppercase())           // transformeer
    .take(10)                                  // limit
    .collect();                                // materialiseer naar Vec
```

### Alle nuttige iterator methoden

```rust
let chunks: Vec<String> = vec![...];

// map — transformeer elk element
let lengths: Vec<usize> = chunks.iter().map(|c| c.len()).collect();

// filter — behoud elementen die voldoen
let long_chunks: Vec<&String> = chunks.iter().filter(|c| c.len() > 100).collect();

// filter_map — filter én transformeer tegelijk (geeft Some terug om te houden)
let parsed: Vec<i32> = vec!["1", "oops", "3"]
    .iter()
    .filter_map(|s| s.parse::<i32>().ok())  // .ok() converteert Result naar Option
    .collect();  // [1, 3] — "oops" werd weggegooid

// flat_map — map waarbij elke output een iterator is (zoals Array.flatMap)
let all_words: Vec<&str> = chunks.iter()
    .flat_map(|c| c.split_whitespace())
    .collect();

// enumerate — geeft (index, element) tuples
for (i, chunk) in chunks.iter().enumerate() {
    println!("Chunk {}: {} chars", i, chunk.len());
}

// zip — combineer twee iterators
let indices = 0..chunks.len();
let pairs: Vec<(usize, &String)> = indices.zip(chunks.iter()).collect();

// any / all — boolean reducers
let has_long_chunk = chunks.iter().any(|c| c.len() > 500);
let all_non_empty = chunks.iter().all(|c| !c.is_empty());

// fold — reduce (zoals Array.reduce)
let total_chars: usize = chunks.iter().fold(0, |acc, c| acc + c.len());
// Korter voor sommige operaties:
let total_chars: usize = chunks.iter().map(|c| c.len()).sum();

// max / min
let longest = chunks.iter().max_by_key(|c| c.len());

// count
let count = chunks.iter().filter(|c| c.len() > 100).count();

// Chaining — alles samenvoegen
let result: Vec<String> = chunks
    .iter()
    .filter(|c| !c.trim().is_empty())
    .enumerate()
    .map(|(i, c)| format!("Chunk {}: {}", i + 1, c.trim()))
    .take(20)
    .collect();
```

### iter() vs into_iter() vs iter_mut()

Dit is een veelgemaakte fout:

```rust
let chunks = vec!["a".to_string(), "b".to_string()];

// iter() — lent de elementen (&String) — chunks blijft geldig
for chunk in chunks.iter() {
    println!("{}", chunk);  // chunk is &String
}
// chunks nog beschikbaar hier

// into_iter() — neemt ownership (String) — chunks bestaat niet meer
for chunk in chunks.into_iter() {
    println!("{}", chunk);  // chunk is String
}
// chunks bestaat niet meer hier!

// iter_mut() — mutable lening (&mut String)
let mut chunks = vec!["a".to_string()];
for chunk in chunks.iter_mut() {
    chunk.push_str(" modified");
}
```

Vuistregel: gebruik `iter()` tenzij je de elementen wilt verplaatsen (dan `into_iter()`) of wijzigen (dan `iter_mut()`).

---

## 24. Closures — de complete gids

Closures zijn functies die variabelen uit hun omgeving kunnen "vangen". Equivalent van arrow functions in TypeScript, maar met ownership regels.

### Fn, FnMut, FnOnce — de drie closure types

```rust
// Fn — kan meerdere keren aangeroepen worden, leent alleen
let multiplier = 3;
let multiply = |x| x * multiplier;  // leent multiplier
println!("{}", multiply(5));   // 15
println!("{}", multiply(10));  // 30 — OK, Fn is herbruikbaar

// FnMut — kan meerdere keren, maar wijzigt gevangen variabelen
let mut count = 0;
let mut increment = || { count += 1; count };
println!("{}", increment());  // 1
println!("{}", increment());  // 2

// FnOnce — kan maar één keer — verplaatst gevangen variabelen
let name = String::from("Alice");
let greet = move || {
    let s = name;  // name wordt verplaatst bij eerste aanroep
    format!("Hello, {}!", s)
};
println!("{}", greet());  // "Hello, Alice!"
// greet() nogmaals aanroepen zou fail zijn (name is al verplaatst)
```

### move closures — de meest voorkomende in async code

```rust
// Zonder move: closure leent document_id
let document_id = "abc-123".to_string();
let f = || println!("{}", document_id);  // leent document_id
f();
println!("{}", document_id);  // OK — document_id nog beschikbaar

// Met move: closure neemt ownership
let document_id = "abc-123".to_string();
let f = move || println!("{}", document_id);  // bezit document_id
f();
// println!("{}", document_id);  // ❌ document_id is verplaatst naar de closure

// In async context: ALTIJD move nodig voor spawned tasks
let document_id = "abc-123".to_string();
tokio::spawn(async move {
    // Zonder move: compile error — de task kan langer leven dan de closure
    process_document(&document_id).await
});
```

### Closure als functie parameter

```rust
// In TypeScript:
// function doWork(callback: (x: string) => Promise<void>): Promise<void>

// In Rust:
async fn do_work<F, Fut>(callback: F)
where
    F: Fn(String) -> Fut,    // accepteert een closure die String neemt
    Fut: Future<Output = ()>, // en een Future teruggeeft
{
    callback("hello".to_string()).await;
}

// Aanroepen:
do_work(|s| async move {
    println!("{}", s);
}).await;
```

Waarom `where` clause? Om de types leesbaar te houden. Dit is equivalent aan generics in TypeScript:

```typescript
async function doWork<F extends (x: string) => Promise<void>>(
  callback: F,
): Promise<void>;
```

---

## 25. Arc, Mutex en RwLock — gedeelde staat over threads

Dit is het equivalent van `useRef` + `useContext` in React, maar voor multithreaded Rust.

### Arc<T> — gedeeld ownership over threads

```rust
use std::sync::Arc;

// Arc = Atomic Reference Counted
// Veilig om te clonen en naar andere threads te sturen
let config = Arc::new(AppConfig { api_key: "sk-...".to_string() });

let config1 = Arc::clone(&config);  // teller +1
tokio::spawn(async move {
    // config1 hier gebruiken
    println!("{}", config1.api_key);
});

let config2 = Arc::clone(&config);  // teller +1
tokio::spawn(async move {
    println!("{}", config2.api_key);
});
// Wanneer alle Arc's weg zijn (teller=0): data opgeruimd
```

**Arc geeft GEEN mutatie.** Het is read-only sharing. Voor mutatie heb je Mutex nodig.

### Mutex<T> — mutual exclusion voor gedeelde mutatie

```rust
use std::sync::{Arc, Mutex};

// Scenario: meerdere workers bijhouden welke jobs actief zijn
let active_jobs: Arc<Mutex<Vec<String>>> = Arc::new(Mutex::new(Vec::new()));

let jobs1 = Arc::clone(&active_jobs);
tokio::spawn(async move {
    let mut guard = jobs1.lock().unwrap();  // wacht tot lock beschikbaar
    guard.push("job-123".to_string());
    // guard gaat hier out of scope → lock vrijgegeven
});

let jobs2 = Arc::clone(&active_jobs);
tokio::spawn(async move {
    let mut guard = jobs2.lock().unwrap();
    guard.push("job-456".to_string());
});
```

**In async code: gebruik `tokio::sync::Mutex`**, niet `std::sync::Mutex`!

```rust
// ❌ std::sync::Mutex kan panichen als je .await houdt terwijl lock locked is
use std::sync::Mutex;
let m = Arc::new(Mutex::new(0));
let guard = m.lock().unwrap();
some_async_fn().await;  // ❌ DEADLOCK GEVAAR
drop(guard);

// ✅ tokio::sync::Mutex is async-aware
use tokio::sync::Mutex;
let m = Arc::new(Mutex::new(0));
let mut guard = m.lock().await;  // async wait, geen thread blocking
some_async_fn().await;  // OK
*guard += 1;
drop(guard);  // expliciet of out of scope
```

### RwLock<T> — lezen parallel, schrijven exclusief

```rust
use tokio::sync::RwLock;

// Scenario: cache die veel gelezen en weinig geschreven wordt
let cache: Arc<RwLock<HashMap<String, String>>> = Arc::new(RwLock::new(HashMap::new()));

// Meerdere readers tegelijk OK
let cache_read = Arc::clone(&cache);
tokio::spawn(async move {
    let guard = cache_read.read().await;  // read lock — andere readers mogen ook
    println!("{:?}", guard.get("key"));
});

// Maar writer is exclusief
let cache_write = Arc::clone(&cache);
tokio::spawn(async move {
    let mut guard = cache_write.write().await;  // write lock — alles geblokkeerd
    guard.insert("key".to_string(), "value".to_string());
});
```

### Wanneer gebruik je wat?

| Situatie                          | Gebruik                  |
| --------------------------------- | ------------------------ |
| Immutable data over threads       | `Arc<T>`                 |
| Mutable data, weinig concurrentie | `Arc<Mutex<T>>` (tokio)  |
| Veel reads, weinig writes         | `Arc<RwLock<T>>` (tokio) |
| Counter zonder full mutex         | `Arc<AtomicU32>`         |

Voor onze worker context (DB pool, Redis client, AI client): alles immutable na init, dus gewoon `Arc<WorkerContext>` zonder Mutex.

---

## 26. Send + Sync — waarom tokio::spawn fouten geeft

Dit is de meest cryptische Rust foutmelding voor beginners.

```
error[E0277]: `*mut u8` cannot be sent between threads safely
  = help: within `MyStruct`, the trait `Send` is not implemented for `*mut u8`
```

### Wat Send en Sync betekenen

- **`Send`**: veilig om ownership naar een andere thread te sturen
- **`Sync`**: veilig om een referentie naar meerdere threads tegelijk te sturen

```rust
// tokio::spawn vereist Send (de task gaat naar een andere thread)
tokio::spawn(async move {
    // Alles hier moet Send zijn
});

// Rc<T> is NIET Send — gebruik Arc<T>
// Cell<T> is NIET Sync — gebruik Mutex<T>
// raw pointers (*mut T) zijn NIET Send of Sync
```

### Hoe je de fout oplost

```rust
// ❌ Fout: Rc is niet Send
use std::rc::Rc;
let data = Rc::new(vec![1, 2, 3]);
tokio::spawn(async move {
    println!("{:?}", data);  // ERROR: Rc cannot be sent between threads
});

// ✅ Oplossing: gebruik Arc
use std::sync::Arc;
let data = Arc::new(vec![1, 2, 3]);
tokio::spawn(async move {
    println!("{:?}", data);  // OK
});
```

### De meest voorkomende niet-Send types

| Type                   | Probleem                             | Oplossing                 |
| ---------------------- | ------------------------------------ | ------------------------- |
| `Rc<T>`                | Niet thread-safe referentie tellen   | `Arc<T>`                  |
| `Cell<T>`              | Niet thread-safe interior mutability | `Mutex<T>`                |
| `RefCell<T>`           | Niet thread-safe interior mutability | `Mutex<T>` of `RwLock<T>` |
| `*mut T` (raw pointer) | Geen ownership guarantees            | `Arc<Mutex<T>>`           |
| `MutexGuard<T>`        | Kan niet gemovet worden              | Drop voor `.await`        |

### MutexGuard over .await — de subtiele deadlock

```rust
// ❌ MutexGuard over een await point — kan deadlock veroorzaken
async fn bad_example(data: Arc<Mutex<HashMap<String, String>>>) {
    let guard = data.lock().await;
    let value = guard.get("key").cloned();
    // guard is nog in scope!
    some_async_fn().await;  // ⚠️ guard blocked terwijl we wachten
    drop(guard);
}

// ✅ Drop de guard voor het await point
async fn good_example(data: Arc<Mutex<HashMap<String, String>>>) {
    let value = {
        let guard = data.lock().await;
        guard.get("key").cloned()
        // guard gaat out of scope hier → lock vrijgegeven
    };
    some_async_fn().await;  // OK — geen lock meer
}
```

---

## 27. Error handling — de complete gids

### anyhow vs thiserror — wanneer gebruik je wat?

```
anyhow  → voor binaries (main.rs, workers) — convenient, geen eigen types
thiserror → voor libraries (crates) — gestructureerde fout types
```

```rust
// ✅ In een worker binary (main.rs / lib.rs):
use anyhow::{Context, Result};

async fn process() -> Result<()> {  // anyhow::Result — automatisch Box<dyn Error>
    let pool = create_pool(&url)
        .await
        .context("Failed to connect to database")?;  // voegt context toe aan fout

    let text = extract_pdf(&path)
        .context("PDF extraction failed")?;

    Ok(())
}

// ✅ In een crate (errors.rs):
use thiserror::Error;

#[derive(Debug, Error)]
pub enum DocumentError {
    #[error("Document {0} not found")]
    NotFound(String),

    #[error("Database error")]
    Database(#[from] sqlx::Error),  // #[from] = implementeert From<sqlx::Error>

    #[error("PDF parsing failed: {0}")]
    PdfParse(String),

    #[error("AI call failed after {attempts} attempts: {message}")]
    AiFailed { attempts: u32, message: String },
}
```

### De `?` operator in detail

`?` doet drie dingen:

1. Als `Err(e)`: converteert `e` naar het return type's error via `From` trait, dan `return Err(...)`
2. Als `Ok(v)`: extraheert `v` en gaat verder
3. Als `None` (bij Option): converteert naar fout en returned

```rust
// Dit:
let val = some_result?;

// Is exact equivalent aan:
let val = match some_result {
    Ok(v) => v,
    Err(e) => return Err(e.into()),  // .into() = From trait conversie
};
```

### From trait — automatische fout conversie

```rust
#[derive(Debug, Error)]
pub enum MyError {
    #[error("DB error: {0}")]
    Database(#[from] sqlx::Error),     // implementeert From<sqlx::Error> for MyError

    #[error("HTTP error: {0}")]
    Http(#[from] reqwest::Error),      // implementeert From<reqwest::Error> for MyError
}

// Nu werkt ? automatisch voor sqlx en reqwest fouten:
async fn fetch_and_query() -> Result<(), MyError> {
    let pool = create_pool().await?;     // sqlx::Error → MyError::Database
    let resp = reqwest::get("...").await?;  // reqwest::Error → MyError::Http
    Ok(())
}
```

### Fout context toevoegen met anyhow

```rust
use anyhow::Context;

// Zonder context:
let doc = fetch_doc(id).await?;
// Error: "connection refused"  ← nutteloos in logs

// Met context:
let doc = fetch_doc(id).await
    .with_context(|| format!("Failed to fetch document {}", id))?;
// Error: "Failed to fetch document abc-123: connection refused"  ← nuttig!
```

### Wanneer `.unwrap()` en `.expect()` gebruiken

```rust
// .unwrap() — panicht als Err/None. NOOIT in productie code voor user input.
let n: i32 = "42".parse().unwrap();  // OK als je ZEKER weet dat het parseable is

// .expect("msg") — panicht met message. Beter dan unwrap voor setup code.
let api_key = std::env::var("ANTHROPIC_API_KEY")
    .expect("ANTHROPIC_API_KEY environment variable must be set");
// Als dit faalt: je process start niet → OK voor startup checks

// .unwrap_or(default) — geeft default bij None/Err
let page = chunk.page_number.unwrap_or(0);

// .unwrap_or_else(|| ...) — lazy default (closure)
let name = user.display_name.unwrap_or_else(|| "Anonymous".to_string());

// .unwrap_or_default() — gebruikt Default trait implementatie
let count: i32 = maybe_count.unwrap_or_default();  // 0 voor integers
```

**Vuistregel voor STUDO:** gebruik `expect()` alleen in `main()` voor startup vereisten (env vars, DB connectie). Gebruik `?` in alle andere gevallen.

---

## 28. Serde — alle edge cases

### Alle serde attributen die je nodig hebt

```rust
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]  // snake_case → camelCase in JSON
pub struct ComplexPayload {
    pub document_id: String,           // → "documentId"

    #[serde(skip_serializing_if = "Option::is_none")]
    pub optional_field: Option<String>, // → weggelaten als None (niet "null")

    #[serde(default)]                  // → 0 als veld ontbreekt in JSON
    pub attempt_count: i32,

    #[serde(default = "default_language")]  // → roept functie aan als ontbreekt
    pub language: String,

    #[serde(rename = "userId")]        // override rename_all voor dit veld
    pub user_id: String,               // → altijd "userId" (niet "userId" twee keer)

    #[serde(skip)]                     // nooit serialiseren/deserialiseren
    pub internal_state: String,

    #[serde(flatten)]                  // inline de velden van een nested struct
    pub metadata: DocumentMetadata,
}

fn default_language() -> String {
    "nl".to_string()
}

// flatten voorbeeld:
#[derive(Serialize, Deserialize)]
pub struct DocumentMetadata {
    pub page_count: i32,
    pub file_size: i64,
}

// JSON voor ComplexPayload met flatten:
// {"documentId":"...","pageCount":42,"fileSize":1000}
// NIET: {"documentId":"...","metadata":{"pageCount":42}}
```

### Enum serialisatie

```rust
// Default: {"variant_name": {fields}}
#[derive(Serialize, Deserialize)]
enum Status {
    Pending,
    Processing { started_at: String },
    Done { result: String },
}
// Serialiseert als: {"Processing":{"startedAt":"2024-..."}}

// Met tag: {"status":"Processing","startedAt":"2024-..."}
#[derive(Serialize, Deserialize)]
#[serde(tag = "status", rename_all = "camelCase")]
enum Status {
    Pending,
    Processing { started_at: String },
    Done { result: String },
}

// Als string (voor eenvoudige enums):
#[derive(Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
enum ProcessingStatus {
    Pending,     // → "pending"
    InProgress,  // → "in_progress"
    Done,        // → "done"
}
```

### Dynamische JSON met serde_json::Value

Soms weet je op voorhand niet wat de JSON structuur is (bijv. de AI response):

```rust
use serde_json::Value;

let response: Value = reqwest::get(url).await?.json().await?;

// Navigeren door dynamische JSON
let model = response["model"].as_str().unwrap_or("unknown");
let tokens = response["usage"]["input_tokens"].as_u64().unwrap_or(0);

// Controleren of een veld bestaat
if response["error"].is_null() {
    // geen fout
}

// Array itereren
if let Some(items) = response["choices"].as_array() {
    for item in items {
        println!("{}", item["text"]);
    }
}

// Omzetten naar typed struct (gedeeltelijk)
#[derive(Deserialize)]
struct PartialResponse {
    model: String,
}
let partial: PartialResponse = serde_json::from_value(response.clone())?;
```

---

## 29. SQLX — alle edge cases

### query! vs query_as! vs query_scalar!

```rust
// query! — voert een query uit, geeft anonieme rijen terug
// Gebruik voor INSERT/UPDATE/DELETE of als je de kolommen bij naam wilt
let row = sqlx::query!(
    "SELECT id, title FROM course_documents WHERE id = $1",
    document_id,
)
.fetch_one(&pool)
.await?;
println!("{}", row.title);  // .title werkt direct

// query_as! — mapt rijen naar een struct
// Struct velden moeten exact matchen met SELECT kolommen
let doc: CourseDocument = sqlx::query_as!(
    CourseDocument,
    "SELECT id, title, extracted_text, processing_status FROM course_documents WHERE id = $1",
    document_id,
)
.fetch_one(&pool)
.await?;

// query_scalar! — geeft één enkele waarde terug
let count: i64 = sqlx::query_scalar!(
    "SELECT COUNT(*) FROM document_chunks WHERE document_id = $1",
    document_id,
)
.fetch_one(&pool)
.await?
.unwrap_or(0);
```

### fetch_one vs fetch_optional vs fetch_all

```rust
// fetch_one — vereist exact één rij, geeft Err als 0 of meer rijen
let doc = query.fetch_one(&pool).await?;  // panicht als niet gevonden

// fetch_optional — geeft Option<T>, handig voor "zoek of geef None"
let doc: Option<CourseDocument> = query.fetch_optional(&pool).await?;
if let Some(doc) = doc {
    // gevonden
}

// fetch_all — geeft alle rijen als Vec<T>
let docs: Vec<CourseDocument> = query.fetch_all(&pool).await?;
```

### Transacties

```rust
// Transactie = atomisch blok: alles slaagt of niets
let mut tx = pool.begin().await?;

sqlx::query!("INSERT INTO studysets (id, title) VALUES ($1, $2)", set_id, title)
    .execute(&mut *tx)  // ← gebruik &mut *tx, niet &pool
    .await?;

for card in &cards {
    sqlx::query!("INSERT INTO cards (id, term, definition, set_id) VALUES ($1, $2, $3, $4)",
        card.id, card.term, card.definition, set_id)
        .execute(&mut *tx)
        .await?;
}

// Alles OK → commit
tx.commit().await?;
// Als er ergens een ? fout geeft vóór commit: automatisch rollback
```

### Bulk inserts — performanter dan loopen

```rust
// Traag: één INSERT per card
for card in &cards {
    sqlx::query!("INSERT INTO cards ...").execute(&pool).await?;
}

// Snel: gebruik UNNEST voor bulk insert
let ids: Vec<String> = cards.iter().map(|c| c.id.clone()).collect();
let terms: Vec<String> = cards.iter().map(|c| c.term.clone()).collect();
let definitions: Vec<String> = cards.iter().map(|c| c.definition.clone()).collect();
let set_ids: Vec<String> = vec![set_id.to_string(); cards.len()];

sqlx::query!(
    r#"
    INSERT INTO cards (id, term, definition, set_id, owner_id, number, created_at, updated_at, term_content_type, code_language)
    SELECT * FROM UNNEST(
        $1::varchar[], $2::varchar[], $3::varchar[], $4::varchar[]
    ) AS t(id, term, definition, set_id)
    -- Vul resterende velden later aan met UPDATE of voeg toe aan UNNEST
    "#,
    &ids,
    &terms,
    &definitions,
    &set_ids,
)
.execute(&pool)
.await?;
```

### SQLX offline mode instellen

Zonder dit kun je niet compileren als de DB niet draait:

```bash
# Stap 1: zorg dat DB draait en DATABASE_URL gezet is
export DATABASE_URL=postgres://devusr:devpwd@localhost:5432/studo

# Stap 2: genereer de query cache
cd apps/services/rust-services
cargo sqlx prepare --workspace
# Dit maakt .sqlx/ folder aan met query metadata

# Stap 3: commit de .sqlx/ folder
git add .sqlx/
git commit -m "chore: add sqlx query cache for offline compilation"

# Daarna: compileren zonder DB
SQLX_OFFLINE=true cargo build
```

Voeg toe aan `.cargo/config.toml`:

```toml
# apps/services/rust-services/.cargo/config.toml
[env]
SQLX_OFFLINE = { value = "true", force = false }
# force = false → DATABASE_URL override als die gezet is
```

### Omgaan met NULL in sqlx

```rust
// Als een kolom nullable is in de DB: gebruik Option<T> in de struct
#[derive(sqlx::FromRow)]
struct CourseDocument {
    id: String,
    title: String,
    extracted_text: Option<String>,  // NULL → None, tekst → Some("...")
    page_count: Option<i32>,
}

// Bij INSERT: Option<T> → NULL
sqlx::query!(
    "INSERT INTO course_documents (id, page_count) VALUES ($1, $2)",
    doc_id,
    doc.page_count,  // None → NULL in DB
)
.execute(&pool)
.await?;
```

### Type casting in queries

```rust
// Soms moet je het DB type expliciet vermelden
sqlx::query!(
    "SELECT id, status as \"status: ProcessingStatus\" FROM course_documents",
)
// Het "status: ProcessingStatus" vertelt sqlx welk Rust type te gebruiken
// ProcessingStatus moet sqlx::Type implementeren
```

---

## 30. Tokio — de async runtime in detail

### tokio::select! — wachten op meerdere futures

`select!` wacht op de eerste die klaar is, cancelt de rest:

```rust
use tokio::time::{sleep, Duration};

// Timeout patroon
let result = tokio::select! {
    res = do_expensive_work() => {
        match res {
            Ok(v) => Ok(v),
            Err(e) => Err(e),
        }
    }
    _ = sleep(Duration::from_secs(30)) => {
        Err(anyhow::anyhow!("Timeout after 30 seconds"))
    }
};
```

In de worker queue gebruiken we select! voor "wacht op Redis OF timeout":

```rust
tokio::select! {
    msg = rx.recv() => {
        // Redis stuurde een bericht → nieuwe job beschikbaar
        // Ga meteen jobs ophalen
    }
    _ = tokio::time::sleep(Duration::from_secs(30)) => {
        // Timeout → sowieso checken (fallback als Redis mist)
    }
}
```

### tokio::time::interval — periodieke taken

```rust
use tokio::time::{interval, Duration};

// Equivalent van setInterval in JavaScript
async fn cleanup_expired_locks(pool: PgPool) {
    let mut interval = interval(Duration::from_secs(60));  // elke 60 seconden

    loop {
        interval.tick().await;  // wacht tot volgende tick

        sqlx::query!(
            "UPDATE worker_job SET status = 'Idle', lock_key = NULL
             WHERE status = 'Running' AND lock_expires_at < NOW()"
        )
        .execute(&pool)
        .await
        .ok();  // .ok() = negeer fouten (lock cleanup mag falen)
    }
}

// Starten als achtergrondtaak:
tokio::spawn(cleanup_expired_locks(pool.clone()));
```

### spawn_blocking — sync code in async context

```rust
// PROBLEEM: PDF parsing is synchrone, CPU-intensieve code
// Als je dit direct in een async fn doet, blokkeer je de Tokio thread
// en kunnen andere async taken niet draaien!

// ❌ Blokkeert de Tokio runtime
async fn parse_pdf_bad(bytes: Vec<u8>) -> Result<String, Error> {
    let text = pdf_extract::extract_text_from_mem(&bytes)?;  // sync, kan lang duren
    Ok(text)
}

// ✅ Gebruik spawn_blocking voor sync CPU-intensieve code
async fn parse_pdf_good(bytes: Vec<u8>) -> Result<String, Error> {
    let text = tokio::task::spawn_blocking(move || {
        pdf_extract::extract_text_from_mem(&bytes)
    })
    .await  // wacht op de blocking thread
    .map_err(|e| anyhow::anyhow!("Thread panicked: {}", e))??;

    Ok(text)
}
```

**Vuistregel:** elke operatie die langer dan ~1ms duurt en niet async is → `spawn_blocking`.

### Cancellation — futures stoppen

```rust
// Tokio futures zijn cancellation-safe
// Als je de JoinHandle dropped, wordt de task gecancelled

let handle = tokio::spawn(async {
    tokio::time::sleep(Duration::from_secs(100)).await;
    "done"
});

// Annuleer na 5 seconden
tokio::time::sleep(Duration::from_secs(5)).await;
handle.abort();  // task wordt gecancelled

// Of met tokio::time::timeout:
let result = tokio::time::timeout(
    Duration::from_secs(5),
    some_long_running_task(),
).await;

match result {
    Ok(value) => println!("Done: {:?}", value),
    Err(_) => println!("Timed out!"),
}
```

---

## 31. Modules en visibility — project organisatie

### Het module systeem

```rust
// In main.rs of lib.rs:
mod processor;        // zoekt naar processor.rs of processor/mod.rs
mod errors;
pub mod types;        // pub = zichtbaar buiten de crate

// In processor.rs:
use crate::types::ParseDocumentPayload;  // crate:: = root van je crate
use super::errors::ParseError;            // super:: = parent module
use std::sync::Arc;                       // std:: = standaard bibliotheek
```

### Visibility regels

```rust
// pub = zichtbaar voor iedereen
pub struct PublicStruct { ... }

// pub(crate) = zichtbaar binnen de crate, niet buiten
pub(crate) struct InternalStruct { ... }

// pub(super) = zichtbaar voor parent module
pub(super) fn helper() { ... }

// (geen pub) = alleen in dit module
fn private_helper() { ... }
```

### Hoe je alles in lib.rs exporteert

```rust
// crates/queue/src/lib.rs
mod queue;      // interne implementatie
mod pubsub;     // interne implementatie
pub mod types;  // types die workers nodig hebben

// Re-exporteer wat andere crates nodig hebben
pub use queue::Queue;
pub use pubsub::RedisPubSub;
pub use types::{QueueConfig, WorkerError, WorkerJob};
```

Daarna in workers:

```rust
// workers/document-parser/src/lib.rs
use queue::{Queue, QueueConfig, WorkerError};  // alles van queue crate
```

---

## 32. Tracing — professioneel loggen

`println!` is voor prototypes. In productie gebruik je `tracing`.

### Setup

```rust
// main.rs
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

fn setup_tracing() {
    tracing_subscriber::registry()
        .with(EnvFilter::from_default_env()  // leest RUST_LOG env var
            .add_directive("document_parser=debug".parse().unwrap())
            .add_directive("queue=info".parse().unwrap()))
        .with(tracing_subscriber::fmt::layer()
            .with_target(true)       // toont module naam
            .with_line_number(true)) // toont regelnummer
        .init();
}
```

### Logging in code

```rust
use tracing::{debug, info, warn, error, instrument};

pub async fn process(document_id: &str) -> Result<(), Error> {
    // Gestructureerde velden — veel beter dan format strings!
    info!(document_id = %document_id, "Starting processing");

    // % = Display trait (to_string)
    // ? = Debug trait ({:?})
    debug!(document_id = %document_id, size_mb = ?file_size, "File details");

    warn!(document_id = %document_id, attempt = 3, "Retrying after failure");

    error!(document_id = %document_id, error = %e, "Processing failed");
}
```

### Spans — context over meerdere functies

```rust
use tracing::{info_span, Instrument};

// Alles binnen deze span krijgt document_id als context
let span = info_span!("process_document", document_id = %id);

async_fn()
    .instrument(span)  // span is actief terwijl future draait
    .await?;

// Of met #[instrument] macro:
#[tracing::instrument(skip(pool), fields(document_id = %payload.document_id))]
pub async fn process(pool: &PgPool, payload: ParseDocumentPayload) -> Result<(), Error> {
    // Alle logs hier hebben automatisch document_id als context
    info!("Starting");  // log bevat document_id
}
```

### RUST_LOG configureren

```bash
# Alles op info
RUST_LOG=info cargo run

# Specifieke modules op debug
RUST_LOG=info,document_parser=debug,sqlx=warn cargo run

# Sqlx queries loggen (VEEL output — alleen lokaal)
RUST_LOG=sqlx=debug cargo run
```

---

## 33. Configuratie — env vars en .env bestanden

### dotenvy — .env bestanden laden

```rust
// main.rs — EERSTE ding in main()
dotenvy::dotenv().ok();  // .ok() = negeer fout als .env niet bestaat (productie)
```

### Config struct met validatie

```rust
// config.rs
pub struct Config {
    pub database_url: String,
    pub redis_url: String,
    pub anthropic_api_key: String,
    pub worker_concurrency: u32,
    pub rust_log: String,
}

impl Config {
    pub fn from_env() -> Self {
        // std::env::var geeft Result<String, VarError>
        // .expect() panicht met duidelijke boodschap als niet gezet
        Self {
            database_url: std::env::var("DATABASE_URL")
                .expect("DATABASE_URL must be set"),
            redis_url: std::env::var("REDIS_URL")
                .expect("REDIS_URL must be set"),
            anthropic_api_key: std::env::var("ANTHROPIC_API_KEY")
                .expect("ANTHROPIC_API_KEY must be set"),
            worker_concurrency: std::env::var("WORKER_CONCURRENCY")
                .unwrap_or_else(|_| "4".to_string())
                .parse()
                .expect("WORKER_CONCURRENCY must be a number"),
            rust_log: std::env::var("RUST_LOG")
                .unwrap_or_else(|_| "info".to_string()),
        }
    }
}
```

```bash
# apps/services/rust-services/.env
DATABASE_URL=postgres://devusr:devpwd@localhost:5432/studo
REDIS_URL=redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@localhost:6379
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-...             # voor embeddings
QDRANT_URL=http://localhost:6333
WORKER_CONCURRENCY=4
RUST_LOG=info,document_parser=debug,queue=info

# .env.example — commit dit, niet .env!
DATABASE_URL=postgres://user:password@localhost:5432/studo
REDIS_URL=redis://:password@localhost:6379
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 34. Testing in Rust

### Unit tests — in hetzelfde bestand

```rust
// processor.rs
pub fn chunk_text(text: &str, chunk_size: usize) -> Vec<String> {
    // ... implementatie ...
}

#[cfg(test)]         // alleen gecompileerd bij `cargo test`
mod tests {
    use super::*;    // importeer alles van parent module

    #[test]
    fn test_chunk_empty_text() {
        let chunks = chunk_text("", 100);
        assert!(chunks.is_empty());
    }

    #[test]
    fn test_chunk_splits_correctly() {
        let text = "a".repeat(200);
        let chunks = chunk_text(&text, 100);
        assert!(chunks.len() >= 2);
        assert!(chunks.iter().all(|c| !c.is_empty()));
    }

    #[test]
    #[should_panic]  // test dat code panicht
    fn test_invalid_input_panics() {
        chunk_text("test", 0);  // chunk_size=0 moet panichen
    }
}
```

### Async tests

```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]  // tokio equivalent van #[test]
    async fn test_fetch_chunks() {
        let pool = sqlx::PgPool::connect(&std::env::var("DATABASE_URL").unwrap())
            .await
            .unwrap();

        // Setup: maak test data
        sqlx::query!("INSERT INTO course_documents ... VALUES ...")
            .execute(&pool)
            .await
            .unwrap();

        // Test
        let chunks = fetch_chunks(&pool, "test-doc").await.unwrap();
        assert!(!chunks.is_empty());

        // Cleanup (of gebruik transacties voor rollback)
        sqlx::query!("DELETE FROM course_documents WHERE id = 'test-doc'")
            .execute(&pool)
            .await
            .unwrap();
    }
}
```

### Test organisatie voor STUDO

```bash
# Alleen unit tests (geen DB)
cargo test --lib

# Alle tests inclusief integratie
DATABASE_URL=postgres://devusr:devpwd@localhost:5432/studo_test cargo test

# Specifieke test
cargo test test_chunk_splits_correctly

# Verbose output
cargo test -- --nocapture
```

---

## 35. Patterns die je veel zult zien

### Builder pattern — complexe structs aanmaken

```rust
// QueueConfig gebruikte dit al:
let config = QueueConfig::new("document_parsing")
    .with_concurrency(4)
    .with_max_retries(10)
    .with_retry_delay_secs(60);

// Hoe je het implementeert:
pub struct QueueConfig {
    name: String,
    concurrency: u32,
}

impl QueueConfig {
    pub fn new(name: impl Into<String>) -> Self {
        Self { name: name.into(), concurrency: 4 }
    }

    pub fn with_concurrency(mut self, n: u32) -> Self {
        self.concurrency = n;
        self  // geeft self terug voor chaining
    }
}
```

### Newtype pattern — type veiligheid voor IDs

```rust
// Problem: document_id en user_id zijn allebei String
// Je kunt ze per ongeluk omwisselen en de compiler ziet het niet

// Oplossing: newtype wrapper
pub struct DocumentId(String);
pub struct UserId(String);

// Nu geeft de compiler een fout als je een UserId meegeeft waar DocumentId nodig is
fn process(doc_id: DocumentId, user_id: UserId) { ... }

// Aanmaken:
let doc_id = DocumentId("abc-123".to_string());
let user_id = UserId("user-456".to_string());
process(doc_id, user_id);   // OK
process(user_id, doc_id);   // ❌ Compile error!

// Deref om de inner String te gebruiken:
impl std::ops::Deref for DocumentId {
    type Target = str;
    fn deref(&self) -> &str { &self.0 }
}
let id = DocumentId("abc".to_string());
println!("{}", &*id);  // "abc"
```

### State machine pattern — document processing status

```rust
// Ipv een string "pending" | "parsing" | "done" gebruik je types:

pub struct PendingDocument { id: String, file_url: String }
pub struct ParsedDocument  { id: String, text: String, chunks: Vec<String> }
pub struct IndexedDocument { id: String, qdrant_collection: String }

// Functies drukken hun verwachtingen uit in de types:
fn parse(doc: PendingDocument) -> Result<ParsedDocument, ParseError> { ... }
fn index(doc: ParsedDocument) -> Result<IndexedDocument, IndexError> { ... }

// Je kúnt niet een ParsedDocument indexen zonder eerst te parsen
// De compiler afdwingt de correcte volgorde
```

---

## 36. Deref coercion — waarom &String werkt als &str

Dit is de "magic" achter waarom je overal `&my_string` kunt doorgeven aan functies die `&str` verwachten.

```rust
fn needs_str(s: &str) { println!("{}", s); }

let my_string = String::from("hello");
needs_str(&my_string);  // ← hoe werkt dit? String ≠ str

// Rust doet automatisch: &String → &String → &str
// via de Deref implementatie van String
// impl Deref for String { type Target = str; }
```

Dezelfde coercions:

- `&Vec<T>` → `&[T]`
- `&Box<T>` → `&T`
- `&Arc<T>` → `&T`

```rust
fn needs_slice(s: &[i32]) { ... }

let v = vec![1, 2, 3];
needs_slice(&v);  // &Vec<i32> → &[i32] via Deref
```

---

## 37. Hoe je effectief Rust leest (andermans code begrijpen)

Als je code tegenkomt die je niet snapt, volg deze volgorde:

### Stap 1: Ignoreer generics en lifetimes eerst

```rust
// Dit ziet er overweldigend uit:
pub fn start_runner<F, Fut>(&self, processor: F) -> impl Future<Output = anyhow::Result<()>>
where
    F: Fn(P) -> Fut + Send + Sync + Clone + 'static,
    Fut: Future<Output = Result<R, WorkerError>> + Send,

// Lees het als:
// "start_runner neemt een functie (processor) en geeft een Future terug"
// De generics zijn details die je later snapt
```

### Stap 2: Focus op wat een functie doet, niet hoe

```rust
// Wat doet dit? → neemt een closure, roept hem aan, handled errors
queue.start_runner(|payload| async move {
    process(&pool, payload).await
}).await?;
```

### Stap 3: `impl Trait` lezen

```rust
// "impl Future" = "iets dat een Future is (je weet niet exact welk type)"
fn get_future() -> impl Future<Output = i32> { ... }

// "impl Fn" = "iets dat een Fn is"
fn apply(f: impl Fn(i32) -> i32, x: i32) -> i32 { f(x) }
```

### Stap 4: Macro's herkennen

Alles met `!` is een macro:

- `println!`, `format!`, `vec!` — standaard macro's
- `sqlx::query!` — compile-time SQL check
- `#[derive(...)]` — attribute macro, genereert code
- `#[tokio::main]` — attribute macro

---

## 38. Performance — wanneer moet je opletten?

### Clone overhead

```rust
// Clone is O(n) voor Strings en Vec's — pas op in hot paths
let chunks: Vec<String> = ...;

// ❌ Kloont elke iteratie — O(n²) totaal
for _ in 0..1000 {
    let copy = chunks.clone();  // kloont alle strings!
    process(copy);
}

// ✅ Gebruik referenties
for _ in 0..1000 {
    process(&chunks);  // geen allocatie
}
```

### Wanneer clone OK is

```rust
// Bij het spawnen van async tasks — één clone per task is prima
let document_id = "abc".to_string();
let pool = pool.clone();  // PgPool clone is goedkoop (Arc intern)

tokio::spawn(async move {
    process_document(&pool, &document_id).await
});
```

### String allocation vermijden

```rust
// ❌ Kloont de string elke iteratie
chunks.iter().map(|c| c.clone()).collect::<Vec<String>>();

// ✅ Gebruik referenties als je de data niet nodig hebt te bezitten
chunks.iter().map(|c| c.as_str()).collect::<Vec<&str>>();

// ✅ Of bij owned: into_iter verplaatst ipv kloont
chunks.into_iter().map(|c| c.to_uppercase()).collect::<Vec<String>>();
```

---

## 39. Docker deployment

### Multi-stage build voor kleine images

Rust binaries zijn groot tijdens compilatie maar klein als binary (geen runtime nodig!).

```dockerfile
# apps/services/rust-services/Dockerfile

# Stage 1: bouwen (grote image met alle tools)
FROM rust:1.83-slim AS builder

WORKDIR /app

# Installeer build dependencies voor PDF parsing
RUN apt-get update && apt-get install -y \
    pkg-config \
    libssl-dev \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Kopieer workspace files
COPY Cargo.toml Cargo.lock ./
COPY crates/ crates/
COPY workers/ workers/

# Build (--release voor geoptimaliseerde binary)
RUN cargo build --release -p document-parser

# Stage 2: runtime (minimale image)
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Kopieer alleen de binary uit de builder stage
COPY --from=builder /app/target/release/document-parser /app/document-parser

# Geen shell nodig — direct de binary
CMD ["/app/document-parser"]
```

```yaml
# docker-compose.yml aanvulling voor de Rust worker
document-parser:
  build:
    context: apps/services/rust-services
    dockerfile: Dockerfile
  environment:
    DATABASE_URL: postgres://devusr:devpwd@db:5432/studo
    REDIS_URL: redis://:eYVX7EwVmmxKPCDmwMtyKVge8oLd2t81@cache:6379
    ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}
    RUST_LOG: info
  depends_on:
    db:
      condition: service_healthy
    cache:
      condition: service_started
```

---

## 40. De meest cryptische compile errors en wat ze betekenen

### "the trait `std::marker::Sync` is not implemented"

```
error: future cannot be shared between threads safely
  = help: the trait `Sync` is not implemented for ...
```

**Oorzaak:** je houdt een niet-Sync type (bijv. `RefCell`, `Rc`) vast over een `.await` punt.  
**Oplossing:** gebruik `Arc<Mutex<T>>` of drop de waarde voor `.await`.

### "type annotations needed"

```
error[E0282]: type annotations needed
  --> src/processor.rs:42:9
   |
42 |     let result = items.iter().collect();
```

**Oorzaak:** Rust kan het type van `collect()` niet raden.  
**Oplossing:** annoteer het type:

```rust
let result: Vec<String> = items.iter().cloned().collect();
// Of turbofishes:
let result = items.iter().cloned().collect::<Vec<String>>();
```

### "cannot borrow as mutable, as it is not declared as mutable"

```
error[E0596]: cannot borrow `items` as mutable
```

**Oplossing:** voeg `mut` toe:

```rust
let mut items = Vec::new();  // niet: let items = Vec::new();
items.push("hello");
```

### "use of moved value"

```
error[E0382]: use of moved value: `payload`
```

**Oorzaak:** je hebt `payload` al verplaatst (bijv. in een closure), maar probeert hem nog te gebruiken.  
**Oplossing:**

```rust
// ❌
let id = payload.document_id;  // move van document_id
process(payload).await;         // ❌ payload deels moved

// ✅ optie 1: clone
let id = payload.document_id.clone();
process(payload).await;

// ✅ optie 2: haal id eerst op
let id = &payload.document_id;  // borrow, geen move
process(&payload).await;
```

### "this function's return type contains a borrowed value, but there is no value for it to be borrowed from"

```rust
// ❌
fn get_title() -> &str {
    let s = String::from("hello");
    &s  // s gaat hier out of scope — de referentie zou naar vrijgemaakt geheugen wijzen
}

// ✅
fn get_title() -> String {
    String::from("hello")  // geef ownership terug
}
```

### Numerieke type mismatches

```rust
// Rust converteert NOOIT automatisch tussen numerieke types
let x: i32 = 5;
let y: i64 = 10;
let z = x + y;  // ❌ Cannot add i32 and i64

// Expliciet converteren:
let z = x as i64 + y;  // ✅
// of:
let z = i64::from(x) + y;  // ✅ type-veiliger (geeft compile error bij narrowing)
```

Nuttige conversies voor STUDO:

```rust
// DB geeft i64, maar je wilt i32
let count: i64 = sqlx_result;
let count_i32 = count as i32;           // truncation als te groot
let count_i32: i32 = count.try_into()?; // geeft Err als te groot

// usize voor indices
let idx: usize = i as usize;
let i: i32 = idx as i32;

// f64 voor berekeningen
let ratio = (matched as f64) / (total as f64);
```

---

## 41. Nuttige crates voor STUDO die je nog niet kent

```toml
[dependencies]
# Async HTTP client (reqwest is al vermeld, maar hier zijn de features)
reqwest = { version = "0.12", features = [
    "json",     # .json() methode op Response
    "stream",   # streaming responses
    "gzip",     # automatische gzip decompressie
    "rustls-tls", # TLS zonder OpenSSL (makkelijker op Docker)
]}

# Betere UUID generatie (v4 = random, v7 = time-ordered, beter voor DB)
uuid = { version = "1", features = ["v4", "v7", "serde"] }

# Datum/tijd (chrono is de standaard)
chrono = { version = "0.4", features = ["serde"] }

# Environment variabelen met type-conversie
envy = "0.4"   # deserialiseert env vars direct naar een struct via serde

# Parallel iterators (rayon) — nuttig voor CPU-intensieve batch verwerking
rayon = "1"

# Retry logica
backon = "1"  # retry met exponential backoff

# Regex
regex = "1"

# MIME type detectie (voor PDF validatie)
infer = "0.16"

# Base64 encoding/decoding
base64 = "0.22"

# SHA hashing (voor document dedup)
sha2 = "0.10"

# Leaky bucket / rate limiting
governor = "0.6"
```

### envy — env vars direct naar struct

```rust
use serde::Deserialize;

#[derive(Deserialize)]
struct Config {
    database_url: String,
    anthropic_api_key: String,
    #[serde(default = "default_concurrency")]
    worker_concurrency: u32,
}

fn default_concurrency() -> u32 { 4 }

fn main() {
    dotenvy::dotenv().ok();
    let config: Config = envy::from_env().expect("Invalid environment configuration");
    // Automatisch: DATABASE_URL → database_url
}
```

### backon — retry met backoff

```rust
use backon::{ExponentialBuilder, Retryable};

let result = (|| async {
    anthropic_client.generate_cards(&chunks).await
})
.retry(ExponentialBuilder::default()
    .with_max_times(5)
    .with_min_delay(Duration::from_secs(1))
    .with_max_delay(Duration::from_secs(60)))
.await?;
```

### SHA256 voor document deduplicatie

```rust
use sha2::{Sha256, Digest};

fn compute_hash(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    format!("{:x}", hasher.finalize())
}

// Gebruik: voordat je een PDF verwerkt, check of de hash al bestaat
let hash = compute_hash(&pdf_bytes);
let existing = sqlx::query_scalar!(
    "SELECT id FROM course_documents WHERE sha256_hash = $1",
    hash,
)
.fetch_optional(&pool)
.await?;

if existing.is_some() {
    return Err(DocumentError::Duplicate(hash));
}
```

---

## 42. Volgorde van leren — jouw roadmap

Op basis van "The Rust Programming Language" boek, in deze volgorde lezen en toepassen:

### Week 1-2: Fundaments

1. **Hoofdstuk 1-3** — Variabelen, types, functies, control flow
   - Meteen toepassen: schrijf de `chunk_text` functie uit sectie 14
2. **Hoofdstuk 4** — Ownership (lees dit twee keer)
   - Meteen toepassen: schrijf de `Config::from_env()` struct
3. **Hoofdstuk 5-6** — Structs, Enums, Pattern matching
   - Meteen toepassen: schrijf de `WorkerError` enum

### Week 3-4: Intermediate

4. **Hoofdstuk 7** — Modules (lees snel, raadpleeg als nodig)

5. **Hoofdstuk 8** — Collections (Vec, HashMap)
   - Meteen toepassen: schrijf de iterator chains voor chunk verwerking

6. **Hoofdstuk 9** — Error handling
   - Meteen toepassen: vervang alle `.unwrap()` door `?` in jouw code

7. **Hoofdstuk 10** — Generics en Traits
   - Meteen toepassen: snap waarom Queue<P, R> zo geschreven is

### Week 5-6: Async

8. **Hoofdstuk 13** — Closures en Iterators (heel belangrijk!)

9. **Hoofdstuk 16** — Concurrency (Mutex, channels)

10. **Async book** (aparte resource): https://rust-lang.github.io/async-book
    - Hoofdstuk 1-4 zijn het belangrijkste
    - Daarna: tokio tutorial op tokio.rs

### Daarna

- **Hoofdstuk 19** — Advanced features (als je problemen tegenkomt)
- Lifetimes hoofdstuk 10.3 — pas lezen als je lifetime errors krijgt

### Wat je NIET hoeft te leren voor STUDO

- Unsafe Rust (nooit nodig voor workers)
- Macro schrijven (je gebruikt bestaande macro's)
- FFI (Foreign Function Interface)
- `Pin<T>` in detail (je krijgt het mee via futures, maar hoeft het niet te schrijven)
- WASM target

---

## Samenvatting van alle edge cases

| Twijfelpunt                                | Antwoord                                                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| `String` vs `&str`                         | `String` in structs, `&str` in parameters                                                              |
| `clone()` overal zetten                    | In async tasks: ja. In hot loops: nee, gebruik referenties                                             |
| `unwrap()` gebruiken                       | Alleen in startup code en tests                                                                        |
| `Arc::clone` vs `.clone()`                 | Beide werken, `Arc::clone(&x)` is explicieter                                                          |
| `std::sync::Mutex` vs `tokio::sync::Mutex` | Tokio Mutex in async code                                                                              |
| `iter()` vs `into_iter()`                  | `iter()` als je daarna de Vec nog nodig hebt                                                           |
| `?` in `main()`                            | `main() -> anyhow::Result<()>` — dan werkt `?`                                                         |
| Lifetime errors                            | Gebruik `String` ipv `&str` in structs → meestal opgelost                                              |
| `spawn_blocking` wanneer                   | Elke sync operatie >1ms (PDF parsing, zware berekening)                                                |
| `map_err` vs `?`                           | `?` als fout types matchen, `map_err` voor type conversie                                              |
| `collect::<Vec<_>>()`                      | `_` = "raad het type" — werkt als omringende context duidelijk is                                      |
| Compiler zegt `Send` not implemented       | Check: gebruik je `Rc` of `RefCell`? Vervang door `Arc`/`Mutex`                                        |
| `impl Trait` als parameter                 | Equivalent van generics, iets simpeler te schrijven                                                    |
| `dyn Trait` vs `impl Trait`                | `impl Trait` als type statisch bekend is (compile-time), `dyn Trait` voor runtime polymorfisme (boxed) |
