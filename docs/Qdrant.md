# Qdrant voor STUDO — Complete Gids voor TypeScript Developers

> Je kent TypeScript, je snapt HTTP APIs, JSON, en databases zoals Postgres. Deze gids legt Qdrant uit in termen die je al kent — en bouwt stap voor stap de vector-search laag voor STUDO's AI Q&A op cursusmateriaal. Geen abstracte wiskunde-college: alles vertaalt naar concrete keuzes die je in productie moet maken, inclusief de edge cases die je pas 's nachts om 3 uur ontdekt.

---

## Inhoudsopgave

1. [Wat is Qdrant? — Het mentale model](#1-wat-is-qdrant--het-mentale-model)
2. [Waarom een vector database en niet Postgres?](#2-waarom-een-vector-database-en-niet-postgres)
3. [Embeddings — van tekst naar getallen](#3-embeddings--van-tekst-naar-getallen)
4. [De kernbegrippen: Collection, Point, Payload, Vector](#4-de-kernbegrippen-collection-point-payload-vector)
5. [Distance metrics — hoe "gelijk" wordt gemeten](#5-distance-metrics--hoe-gelijk-wordt-gemeten)
6. [Hoe Qdrant intern zoekt: HNSW uitgelegd](#6-hoe-qdrant-intern-zoekt-hnsw-uitgelegd)
7. [Segments, WAL en de opslag-architectuur](#7-segments-wal-en-de-opslag-architectuur)
8. [Quantization — geheugen besparen zonder kwaliteit te verliezen](#8-quantization--geheugen-besparen-zonder-kwaliteit-te-verliezen)
9. [Stap 1: Qdrant lokaal draaien met Docker](#9-stap-1-qdrant-lokaal-draaien-met-docker)
10. [Stap 2: Een collection aanmaken voor STUDO](#10-stap-2-een-collection-aanmaken-voor-studo)
11. [Stap 3: Cursusmateriaal chunken en embedden](#11-stap-3-cursusmateriaal-chunken-en-embedden)
12. [Stap 4: Points upserten met payload](#12-stap-4-points-upserten-met-payload)
13. [Stap 5: Zoeken met filters (multi-tenancy)](#13-stap-5-zoeken-met-filters-multi-tenancy)
14. [Stap 6: De volledige RAG-flow voor STUDO](#14-stap-6-de-volledige-rag-flow-voor-studo)
15. [Payload indexing — filters snel maken](#15-payload-indexing--filters-snel-maken)
16. [Consistency, replication en sharding](#16-consistency-replication-en-sharding)
17. [Performance tuning — de knoppen die ertoe doen](#17-performance-tuning--de-knoppen-die-ertoe-doen)
18. [Edge cases en veelgemaakte fouten](#18-edge-cases-en-veelgemaakte-fouten)
19. [Monitoring, backups en operations](#19-monitoring-backups-en-operations)
20. [Checklist voor productie](#20-checklist-voor-productie)

---

## 1. Wat is Qdrant? — Het mentale model

Qdrant (spreek uit: "quadrant") is een **vector database**: een database die niet zoekt op exacte waarden (`WHERE naam = 'Jan'`) maar op **gelijkenis**. Je geeft het een lijst getallen (een vector) en het geeft je terug welke opgeslagen vectoren daar het meest op lijken.

Het mentale model dat je al kent:

| Postgres                | Qdrant                       |
| ----------------------- | ---------------------------- |
| Tabel                   | Collection                   |
| Rij                     | Point                        |
| Kolommen                | Payload (JSON)               |
| Primary key             | Point ID                     |
| `WHERE kolom = x`       | Payload filter               |
| `ORDER BY` op een kolom | `ORDER BY` op vector-afstand |
| B-tree index            | HNSW index                   |

Het grote verschil: in Postgres vraag je "geef me exact deze rij". In Qdrant vraag je "geef me de 10 rijen die semantisch het meest lijken op _deze betekenis_". Dat is precies wat je nodig hebt voor AI Q&A: een student stelt een vraag, jij vindt de stukken cursusmateriaal die het dichtst bij die vraag liggen, en die stop je in de LLM-prompt.

### Waar past Qdrant in STUDO?

```
PDF/slides uploaden
   │
   ▼
Rust document-parser-worker  ──► tekst chunks
   │
   ▼
Embedding model (OpenAI / lokaal)  ──► vectoren (1536 getallen per chunk)
   │
   ▼
Qdrant collection "course_material"  ──► opgeslagen + geïndexeerd
   │
   ▼
Student stelt vraag ──► vraag embedden ──► Qdrant search ──► top-k chunks ──► LLM ──► antwoord
```

Qdrant is dus de **retrieval-laag** in RAG (Retrieval-Augmented Generation). Het bevat geen AI zelf; het is een snelle, schaalbare index over vectoren.

---

## 2. Waarom een vector database en niet Postgres?

Postgres kan vectoren aan met de `pgvector` extensie. Waarom dan toch Qdrant?

**Wanneer pgvector prima is:**

- < ~1 miljoen vectoren
- Je hebt al Postgres draaien en wil geen extra service
- Zoeksnelheid van tientallen ms is acceptabel

**Wanneer je Qdrant wil:**

- Miljoenen tot miljarden vectoren
- Je hebt filtering nodig _tijdens_ de vector-search (bv. "alleen chunks van cursus X van universiteit Y") zonder dat de recall instort
- Je wil quantization om RAM-kosten te drukken
- Je wil horizontaal schalen met sharding/replication
- Je wil sub-10ms latency bij hoge concurrency

Het belangrijkste technische verschil is **filtered search**. Naïef filteren gaat op twee manieren, allebei slecht:

1. **Pre-filter**: eerst `WHERE`, dan brute-force vector-vergelijking op de overgebleven rijen → traag bij grote resultaten.
2. **Post-filter**: eerst vector-search, dan filter weggooien → je vraagt top-10, maar na filteren blijven er 2 over, want de andere 8 hoorden bij een andere cursus.

Qdrant lost dit op met **filterable HNSW**: het filter wordt tijdens het doorlopen van de graaf toegepast, zodat je altijd top-k _binnen het filter_ krijgt zonder de recall te verliezen. Dat is voor multi-tenant STUDO (elke universiteit/cursus gescheiden) cruciaal.

---

## 3. Embeddings — van tekst naar getallen

Een **embedding** is een vector: een lijst floats die de _betekenis_ van een stuk tekst codeert. Een embedding-model (OpenAI `text-embedding-3-small`, een lokaal model zoals `bge-m3`, etc.) neemt tekst en geeft bijvoorbeeld 1536 getallen terug.

Het idee: teksten met vergelijkbare betekenis liggen dicht bij elkaar in de vectorruimte.

```
"De hoofdstad van Frankrijk is Parijs"  ──► [0.021, -0.11, 0.34, ... ]  (1536 getallen)
"Parijs is de grootste stad van Frankrijk" ──► [0.019, -0.10, 0.35, ... ]  (heel dichtbij)
"De mitochondrie is de energiecentrale van de cel" ──► [0.88, 0.02, -0.4, ...] (ver weg)
```

Belangrijke feiten die je moet onthouden:

- **De dimensie is vast per model.** `text-embedding-3-small` = 1536, `text-embedding-3-large` = 3072, `bge-m3` = 1024. Je collection moet exact deze dimensie hebben. Wissel je van model, dan moet je **alles opnieuw embedden** — je kunt geen 1536-vector vergelijken met een 3072-vector.
- **Het model moet hetzelfde zijn bij indexeren én bij zoeken.** Je vraag embedden met model A en je documenten met model B geeft onzin-resultaten. Dit is de #1 stille bug.
- **Normalisatie matters.** Sommige modellen geven genormaliseerde vectoren (lengte 1), andere niet. Dit bepaalt welke distance metric je kiest (zie §5).

> **STUDO-keuze:** begin met één model, leg de naam + dimensie vast in config, en sla het model dat een chunk embedde op in de payload (`embedding_model: "text-embedding-3-small"`). Dan weet je later welke points je moet her-embedden bij een migratie.

---

## 4. De kernbegrippen: Collection, Point, Payload, Vector

### Collection

Een collection is als een tabel. Je definieert erbij:

- De **vector size** (dimensie, bv. 1536)
- De **distance metric** (Cosine / Dot / Euclid)
- Optioneel: named vectors (meerdere vectoren per point), quantization, HNSW-config

### Point

Een point is één rij. Het bestaat uit:

- **ID**: een unsigned integer óf een UUID. Let op: het mag _geen_ willekeurige string zijn zoals `"chunk-abc"`. Alleen ints of UUIDs.
- **Vector**: de embedding.
- **Payload**: willekeurige JSON-metadata.

```json
{
  "id": "9c1e...uuid",
  "vector": [0.021, -0.11, 0.34, "..."],
  "payload": {
    "course_id": "cs101",
    "university_id": "kuleuven",
    "document_id": "doc_42",
    "chunk_index": 7,
    "text": "De stelling van Pythagoras zegt dat...",
    "page": 12,
    "embedding_model": "text-embedding-3-small"
  }
}
```

### Payload

De payload is je metadata én je filter-materiaal. Hier zet je alles waarop je later wil filteren (course_id, taal, documenttype) én de originele tekst (zodat je die aan de LLM kunt geven zonder een tweede DB-lookup).

> **Edge case:** payload heeft geen schema. Je kunt per ongeluk `course_id` als int in de ene point en als string in de andere zetten — dan matcht je filter de helft niet. Wees streng en consistent met types.

---

## 5. Distance metrics — hoe "gelijk" wordt gemeten

Qdrant vergelijkt vectoren met een **distance metric**. Je kiest er één per (named) vector bij het aanmaken van de collection en die staat vast.

| Metric                  | Wat het meet                                    | Gebruik wanneer                                             |
| ----------------------- | ----------------------------------------------- | ----------------------------------------------------------- |
| **Cosine**              | Hoek tussen vectoren (richting, negeert lengte) | Default voor de meeste tekst-embeddings                     |
| **Dot** (inner product) | Richting én lengte                              | Model geeft al genormaliseerde vectoren; sneller dan cosine |
| **Euclid** (L2)         | Rechte-lijn afstand                             | Zelden voor tekst; wel voor sommige image-embeddings        |
| **Manhattan** (L1)      | Som van absolute verschillen                    | Nichegevallen                                               |

**De praktische regel:**

- Twijfel je? Kies **Cosine**. Het werkt bijna altijd goed voor tekst.
- Weet je zeker dat je model genormaliseerde vectoren geeft? Dan is **Dot** identiek aan Cosine maar sneller.
- Gebruik **nooit** een andere metric bij zoeken dan bij indexeren — dat kan ook niet, want het staat vast op de collection.

> **Edge case:** hogere score = beter bij Cosine en Dot (dichterbij = grotere score). Bij Euclid is _lagere_ afstand beter. Als je resultaten "omgekeerd" lijken, check je metric-interpretatie.

---

## 6. Hoe Qdrant intern zoekt: HNSW uitgelegd

Dit is het hart van Qdrant. Begrijp dit en je begrijpt 80% van de tuning.

### Het probleem

Naïef zoeken = elke opgeslagen vector vergelijken met de query-vector. Bij 10 miljoen vectoren van 1536 dimensies is dat 10M × 1536 vermenigvuldigingen per query. Veel te traag. Dit heet **brute-force / exact search**.

### De oplossing: benaderend zoeken (ANN)

Qdrant gebruikt **HNSW** = Hierarchical Navigable Small World. Het is een **approximate nearest neighbor** algoritme: je krijgt niet gegarandeerd de _exact_ dichtste buren, maar bijna altijd (95-99%) wél, en 100-1000× sneller.

### Het mentale model: een meerlaagse kaart

Stel je een landkaart voor met lagen:

- **Bovenste laag**: alleen grote steden (weinig nodes), met lange verbindingen. Je springt hier snel over grote afstand.
- **Middelste lagen**: steeds meer plaatsen, kortere verbindingen.
- **Onderste laag**: elk dorp (alle vectoren), zeer korte verbindingen.

Zoeken werkt zo:

1. Start bovenaan bij een willekeurige node.
2. Hop naar de buur die dichter bij de query ligt. Herhaal tot je niet dichterbij komt.
3. Zak een laag. Herhaal.
4. Onderaan aangekomen heb je de (bijna) dichtste buren gevonden.

Het is als "van vliegtuig naar auto naar te voet": eerst grof, dan fijn.

### De drie knoppen die ertoe doen

**`m`** (bij collection-config): hoeveel verbindingen elke node heeft.

- Hoger = betere recall + meer RAM + trager bouwen.
- Default 16. Verhoog naar 32-64 voor hoge-dimensie data die kwaliteit vraagt.

**`ef_construct`** (bij indexeren): hoe grondig de graaf wordt gebouwd.

- Hoger = betere graafkwaliteit + trager indexeren.
- Default 100. 128-256 voor betere recall.

**`ef` / `hnsw_ef`** (bij zoeken, runtime): hoeveel kandidaten je bekijkt tijdens de zoektocht.

- Hoger = betere recall + tragere query.
- Dit stel je per query in en is je belangrijkste latency/kwaliteit-trade-off. Begin bij 128.

> **Kernidee:** `m` en `ef_construct` bepaal je bij het bouwen (kosten eenmalig). `ef` bepaal je per query (kosten elke keer). Tune eerst `ef` — dat kun je live aanpassen zonder herindexeren.

### Edge case: klein vs groot

Bij een kleine collection (< ~10.000 points) is HNSW soms _langzamer_ dan brute-force en minder accuraat. Qdrant heeft daarom een `indexing_threshold`: onder dat aantal doet het gewoon exact search. Standaard 10.000. Voor een test-collection met 50 vectoren hoef je dus niet te panikeren dat "de index niet werkt" — die is er bewust nog niet.

---

## 7. Segments, WAL en de opslag-architectuur

Onder de motorkap slaat Qdrant een collection op als meerdere **segments**. Een segment is een zelfstandige eenheid met eigen vectoren, payload-index en HNSW-graaf.

Waarom segments?

- **Parallelisme**: zoekopdrachten lopen parallel over segments.
- **Achtergrond-optimalisatie**: Qdrant merge't kleine segments, herbouwt indexen, en ruimt verwijderde points op — zonder de service te blokkeren.

### Write-Ahead Log (WAL)

Elke schrijf gaat eerst naar de **WAL** op disk voordat hij als "klaar" wordt gerapporteerd. Dit garandeert duurzaamheid: crasht Qdrant, dan speelt het bij herstart de WAL af. Hetzelfde principe als Postgres' WAL.

### Appendable vs indexed segments

- Nieuwe writes gaan naar een **appendable segment** (snel schrijven, HNSW nog niet gebouwd).
- Op de achtergrond bouwt Qdrant hier een **indexed segment** van (HNSW klaar, geoptimaliseerd, read-only).

> **Edge case — "mijn zoekresultaten zijn er wel maar traag vlak na een grote upload":** de nieuwe points zitten nog in appendable segments zonder HNSW. Ze worden dan met brute-force doorzocht tot de optimizer klaar is. Wacht tot indexing klaar is (check `collection info` → `indexed_vectors_count` vs `points_count`), of forceer met optimizer-config.

### Memory: mmap vs in-RAM

Vectoren en indexen kunnen in RAM staan of via **memory-mapped files (mmap)** op disk, waarbij het OS bepaalt wat in RAM cache blijft.

- In-RAM = snelst, duurste.
- `on_disk: true` + mmap = veel goedkoper, iets trager, schaalt naar datasets groter dan je RAM.

Voor STUDO met veel cursusmateriaal maar niet-extreme QPS is `on_disk` payload + quantized vectoren in RAM vaak de sweet spot (zie §8).

---

## 8. Quantization — geheugen besparen zonder kwaliteit te verliezen

Vectoren zijn duur in RAM. 1 miljoen vectoren × 1536 dims × 4 bytes (float32) = ~6 GB. Alleen vectoren. Quantization comprimeert dit.

### Scalar quantization (aanrader om te beginnen)

Zet elke float32 om naar een int8 (1 byte i.p.v. 4). **4× minder geheugen**, minimaal kwaliteitsverlies (~1% recall). De standaard-keuze.

### Binary quantization

Elke dimensie wordt 1 bit (positief/negatief). **32× minder geheugen**, veel sneller, maar alleen goed voor high-dimensie modellen die ervoor geschikt zijn (bv. OpenAI large). Kwaliteitsverlies compenseer je met **oversampling + rescoring**.

### Product quantization

Sterkste compressie, meeste kwaliteitsverlies en CPU-kosten. Nichegeval.

### Het rescoring-truukje

De slimme aanpak: bewaar quantized vectoren in RAM (snel, klein) én de originele float32 vectoren `on_disk`. Zoek grof met quantized (haal bv. top-100 op), en **rescore** die 100 met de originele vectoren om de echte top-10 te bepalen. Zo krijg je snelheid + geheugenwinst _en_ nauwkeurigheid.

```
oversampling: 2.0   → haal 2× zoveel kandidaten op voor rescoring
rescore: true       → herbereken met originele vectoren
```

> **STUDO-aanbeveling:** scalar quantization aan, originele vectoren `on_disk`, rescoring aan met oversampling ~2.0. Goede balans voor een budget-bewuste multi-tenant setup.

---

## 9. Stap 1: Qdrant lokaal draaien met Docker

```bash
docker run -p 6333:6333 -p 6334:6334 \
  -v $(pwd)/qdrant_storage:/qdrant/storage \
  qdrant/qdrant
```

- **6333** = REST API + web dashboard (`http://localhost:6333/dashboard`)
- **6334** = gRPC API (sneller, gebruik dit in productie vanuit Rust/Node)
- De volume-mount zorgt dat je data een restart overleeft. **Vergeet dit niet** — zonder volume ben je alles kwijt bij `docker stop`.

Check dat het draait:

```bash
curl http://localhost:6333/healthz
```

Het dashboard op `/dashboard` is goud waard tijdens development: je ziet collections, kunt points bekijken en queries testen zonder code.

> **Edge case — productie:** zet **altijd** een API-key via de env var `QDRANT__SERVICE__API_KEY`. Qdrant heeft standaard _geen_ auth. Een open 6333-poort op het internet = je hele vectordatabase publiek. Combineer met TLS.

---

## 10. Stap 2: Een collection aanmaken voor STUDO

Vanuit Node/TypeScript met de officiële client:

```bash
pnpm add @qdrant/js-client-rest
```

```ts
import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL, // http://localhost:6333
  apiKey: process.env.QDRANT_API_KEY, // in productie verplicht
});

await qdrant.createCollection("course_material", {
  vectors: {
    size: 1536, // MOET matchen met je embedding-model
    distance: "Cosine",
    on_disk: true, // originele vectoren op disk
  },
  quantization_config: {
    scalar: {
      type: "int8",
      always_ram: true, // quantized versie in RAM voor snelheid
    },
  },
  hnsw_config: {
    m: 16,
    ef_construct: 128,
  },
  optimizers_config: {
    indexing_threshold: 10000,
  },
});
```

> **Edge case — collection bestaat al:** `createCollection` faalt als de collection al bestaat. Gebruik bij idempotente setup eerst `collectionExists` of vang de error. `recreateCollection` bestaat ook maar **gooit alle data weg** — nooit per ongeluk in productie draaien.

> **Edge case — dimensie-mismatch:** maak je de collection met `size: 1536` maar upsert je 1024-dim vectoren, dan krijg je een harde error per upsert. Goed nieuws: het faalt luid, niet stil.

---

## 11. Stap 3: Cursusmateriaal chunken en embedden

Je kunt geen PDF van 400 pagina's als één vector opslaan — dat verliest alle detail. Je **chunkt**: knip de tekst in stukken van bv. 300-800 tokens, met wat overlap.

### Chunking-regels die ertoe doen

- **Chunk-grootte**: te klein → geen context, te groot → verwaterde embedding. Voor cursusmateriaal is 300-500 tokens een goede start.
- **Overlap**: laat chunks ~10-20% overlappen zodat een zin die op een grens valt niet verloren gaat.
- **Respecteer structuur**: knip liever op paragraaf/koptekst-grenzen dan midden in een zin. Slides → één chunk per slide werkt vaak goed.
- **Bewaar herkomst**: sla `document_id`, `page`, `chunk_index` op in payload zodat je in het antwoord kunt bronvermelden ("zie slide 12").

```ts
type Chunk = {
  text: string;
  documentId: string;
  courseId: string;
  universityId: string;
  page: number;
  chunkIndex: number;
};

// Embed in batches — embedding-APIs hebben rate limits en batch-support
async function embedBatch(texts: string[]): Promise<number[][]> {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts, // stuur bv. 100 tegelijk, niet 1 per call
  });
  return res.data.map((d) => d.embedding);
}
```

> **Edge case — token-limieten:** embedding-modellen hebben een max input (bv. 8191 tokens). Een te grote chunk wordt getruncated of geweigerd. Meet tokens, niet karakters.

> **Edge case — lege / whitespace chunks:** een lege string embedden geeft een nul- of onzin-vector die overal "een beetje op lijkt". Filter lege chunks eruit vóór het embedden.

---

## 12. Stap 4: Points upserten met payload

```ts
import { v5 as uuidv5 } from "uuid";

const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

function pointId(chunk: Chunk): string {
  // Deterministische UUID → her-upsert overschrijft i.p.v. dupliceert
  return uuidv5(`${chunk.documentId}:${chunk.chunkIndex}`, NAMESPACE);
}

await qdrant.upsert("course_material", {
  wait: true, // wacht tot geschreven — belangrijk voor read-after-write
  points: chunks.map((chunk, i) => ({
    id: pointId(chunk),
    vector: vectors[i],
    payload: {
      text: chunk.text,
      course_id: chunk.courseId,
      university_id: chunk.universityId,
      document_id: chunk.documentId,
      page: chunk.page,
      chunk_index: chunk.chunkIndex,
      embedding_model: "text-embedding-3-small",
    },
  })),
});
```

Belangrijke punten:

- **Deterministische IDs**: door de ID af te leiden van `document_id + chunk_index` is upsert idempotent. Herverwerk je een document, dan overschrijf je de oude points i.p.v. duplicaten aan te maken. **Cruciaal** — anders krijg je bij elke re-run dubbele resultaten.
- **`wait: true`**: zonder dit keert de call terug voordat de data zichtbaar is. Voor een pipeline waar je meteen daarna zoekt, zet `wait: true`. Voor bulk-import mag `false` (sneller).
- **Batch-grootte**: upsert 100-1000 points per call, niet één voor één (netwerk-overhead) en niet 1 miljoen tegelijk (memory-spike).

### Een oud document verwijderen

```ts
await qdrant.delete("course_material", {
  filter: { must: [{ key: "document_id", match: { value: "doc_42" } }] },
});
```

Zo ruim je alle chunks van een verwijderd/vervangen document op. Onthoud: **delete markeert eerst, ruimt later op** (tijdens optimalisatie). De vectoren verdwijnen dus niet meteen van disk — normaal gedrag, geen bug.

---

## 13. Stap 5: Zoeken met filters (multi-tenancy)

Dit is de kern van STUDO: een student van KU Leuven in cursus CS101 mag **alleen** chunks van die cursus terugkrijgen. Nooit die van een andere universiteit.

```ts
const queryVector = (await embedBatch([studentQuestion]))[0];

const results = await qdrant.query("course_material", {
  query: queryVector,
  limit: 8,
  filter: {
    must: [
      { key: "university_id", match: { value: "kuleuven" } },
      { key: "course_id", match: { value: "cs101" } },
    ],
  },
  params: { hnsw_ef: 128 }, // recall/latency knop
  with_payload: true, // geef de tekst mee terug
});
```

Filter-operators die je zult gebruiken:

- `must` = AND (alle voorwaarden)
- `should` = OR (minstens één)
- `must_not` = NOT
- `match` = exacte gelijkheid; `match: { any: [...] }` = in-lijst
- `range` = numeriek (`gt`, `gte`, `lt`, `lte`), bv. `page` tussen waarden

> **Security edge case:** de tenant-filter (`university_id`, `course_id`) moet **server-side** worden gezet op basis van de geverifieerde sessie, nooit uit client-input. Anders kan een student door de filter te manipuleren andermans materiaal opvragen. Behandel dit als een `WHERE user_id = ?` in SQL: nooit door de gebruiker beïnvloedbaar.

> **Recall edge case:** een heel selectief filter (bv. één klein document) kan HNSW dwingen ver te zoeken. Qdrant valt dan soms terug op exact search binnen het filter — correct, maar check je latency. Payload-index op de filter-velden (§15) is hier verplicht.

---

## 14. Stap 6: De volledige RAG-flow voor STUDO

Alles samen, de flow die een studentvraag beantwoordt:

```ts
async function answerQuestion(opts: {
  question: string;
  universityId: string; // uit sessie, niet uit request-body
  courseId: string; // uit sessie
}): Promise<{ answer: string; sources: Source[] }> {
  // 1. Embed de vraag met HETZELFDE model als de chunks
  const [queryVector] = await embedBatch([opts.question]);

  // 2. Retrieve top-k relevante chunks, gefilterd op tenant
  const hits = await qdrant.query("course_material", {
    query: queryVector,
    limit: 8,
    filter: {
      must: [
        { key: "university_id", match: { value: opts.universityId } },
        { key: "course_id", match: { value: opts.courseId } },
      ],
    },
    params: {
      hnsw_ef: 128,
      quantization: { rescore: true, oversampling: 2.0 },
    },
    with_payload: true,
  });

  // 3. Bouw context uit de payload-tekst
  const context = hits.points
    .map((p, i) => `[${i + 1}] ${p.payload!.text}`)
    .join("\n\n");

  // 4. Vraag de LLM met de context (grounding)
  const answer = await llm.complete({
    system:
      "Beantwoord ALLEEN op basis van de context. Ken je het antwoord niet uit de context, zeg dat. Citeer bronnen als [n].",
    user: `Context:\n${context}\n\nVraag: ${opts.question}`,
  });

  // 5. Geef bronnen mee voor UI-verwijzingen
  const sources = hits.points.map((p) => ({
    documentId: p.payload!.document_id,
    page: p.payload!.page,
    score: p.score,
  }));

  return { answer, sources };
}
```

De kernprincipes van goede RAG:

- **Grounding**: dwing de LLM te antwoorden op basis van de opgehaalde context, niet uit z'n eigen "geheugen". Dat voorkomt hallucinaties.
- **Bronvermelding**: door `document_id` + `page` in de payload heb je gratis bronnen om te tonen.
- **"Ik weet het niet"**: instrueer de LLM om toe te geven als de context geen antwoord bevat. Beter dan een verzonnen antwoord.

> **Edge case — score threshold:** soms zijn er gewoon geen relevante chunks (student vraagt iets buiten de stof). Zet een `score_threshold` (bv. Cosine > 0.3) en als niks daarboven komt, antwoord "geen relevant materiaal gevonden" i.p.v. de LLM met ruis te voeren.

---

## 15. Payload indexing — filters snel maken

Standaard heeft Qdrant **geen** index op payload-velden. Filter je op `course_id` zonder index, dan moet het bij elke query elk point scannen om te bepalen wat binnen het filter valt. Traag bij grote collections.

Maak een index per filterbaar veld:

```ts
await qdrant.createPayloadIndex("course_material", {
  field_name: "course_id",
  field_schema: "keyword", // exacte-match string
});
await qdrant.createPayloadIndex("course_material", {
  field_name: "university_id",
  field_schema: "keyword",
});
await qdrant.createPayloadIndex("course_material", {
  field_name: "page",
  field_schema: "integer", // voor range-queries
});
```

Field-schema types:

- `keyword` — exacte string-match (IDs, categorieën)
- `integer` / `float` — getallen, range-queries
- `bool` — booleans
- `text` — full-text-achtige match binnen payload
- `geo` — geo-coördinaten
- `datetime` — tijd-ranges

> **Regel:** elk veld waarop je filtert = payload-index. Voor multi-tenant STUDO zijn `university_id` en `course_id` verplicht geïndexeerd. Zonder deze index degradeert filtered search hard naarmate je groeit.

> **Edge case — tenant cardinaliteit:** bij héél veel tenants (duizenden cursussen) kan een `keyword`-index met de tenant-key gecombineerd met de HNSW-graaf slim worden gemaakt. Qdrant heeft hiervoor `is_tenant: true` op de payload-index, wat de opslag per-tenant groepeert voor snellere gefilterde search. Zet dit op je hoofd-tenant-veld.

---

## 16. Consistency, replication en sharding

Voor één node hoef je hier niet over na te denken. Zodra je een cluster draait, wel.

### Sharding

Een collection wordt opgedeeld in **shards** die over nodes verdeeld worden. Meer shards = meer parallelisme + schaalt over machines. Je zet `shard_number` bij het aanmaken. Vuistregel: aantal shards ≈ aantal nodes (of een veelvoud), en je kunt achteraf niet triviaal her-sharden — kies bij creatie.

### Replication

`replication_factor` = hoeveel kopieën van elke shard. Factor 2-3 = hoge beschikbaarheid; valt een node uit, dan bedient een replica de reads. Kost evenredig meer opslag.

### Consistency

- **Write consistency (`write_consistency_factor`)**: hoeveel replicas een write moeten bevestigen voordat het "klaar" is. Hoger = duurzamer, trager.
- **Read consistency**: bij zoeken kun je `consistency` meegeven (bv. `majority`) zodat je niet toevallig een verouderde replica raakt.

> **Edge case — read-after-write op een cluster:** je upsert met `wait: true` op node A, en zoekt meteen via node B die nog niet gerepliceerd is → je mist het net toegevoegde point. Bij pipelines waar je meteen na schrijven leest: gebruik voldoende consistency of accepteer eventuele consistency.

> **STUDO-realiteit:** begin met één node + volume-backups. Ga pas naar een cluster als volume/uptime het echt vereist. Premature clustering = veel operationele complexiteit voor niks.

---

## 17. Performance tuning — de knoppen die ertoe doen

In volgorde van impact:

1. **`hnsw_ef` (per query)** — je primaire recall/latency-knop. Verlaag voor snelheid, verhoog voor kwaliteit. Tune dit eerst; geen herindexering nodig.
2. **Quantization + rescoring** — grootste geheugenwinst. Scalar int8 + rescore is de default sweet spot.
3. **Payload-indexen** — verplicht voor filtered search op grote collections.
4. **`m` / `ef_construct`** — betere graafkwaliteit, maar herindexering nodig. Verhoog alleen als `hnsw_ef`-tuning niet genoeg recall geeft.
5. **`on_disk` vectoren** — ruil RAM voor iets latency. Nodig zodra je data > RAM.
6. **Batch-grootte bij upsert** — 100-1000 per call. Te klein = overhead, te groot = memory-spikes.
7. **gRPC i.p.v. REST** — merkbaar sneller bij hoge QPS. Gebruik poort 6334 in productie.

> **Meet, gok niet.** Bouw een klein recall-testje: neem 50 queries waarvan je de "juiste" chunk kent, meet welk % in de top-k zit bij verschillende `hnsw_ef`. Zo kies je een waarde op data i.p.v. gevoel.

---

## 18. Edge cases en veelgemaakte fouten

Een verzameling valkuilen — lees dit vóór je live gaat.

- **Model-mismatch bij zoeken vs indexeren.** Vraag en documenten met verschillende embedding-modellen = onzin. #1 stille bug. Log het model in payload.
- **Dimensie-mismatch bij modelwissel.** Nieuw model met andere dims = alles her-embedden. Plan een migratie met een nieuwe collection + backfill, dan atomair omschakelen.
- **Duplicaten door random IDs.** Gebruik deterministische UUIDs uit `document_id + chunk_index`, anders dupliceert elke re-run.
- **Point-ID moet int of UUID zijn.** `"chunk-abc"` als ID faalt. Gebruik `uuidv5`.
- **Geen tenant-filter server-side = data-lek.** Zet tenant-filters uit de sessie, nooit uit client-input.
- **Geen payload-index = trage filters.** Indexeer elk filterbaar veld.
- **Type-inconsistentie in payload.** `course_id` de ene keer int, andere keer string → filter matcht niet. Wees streng.
- **Lege chunks embedden.** Geeft een "matcht overal een beetje"-vector. Filter ze eruit.
- **Geen `wait: true` en dan meteen zoeken.** Je mist net-geschreven points. Zet `wait` in read-after-write flows.
- **Geen API-key/TLS in productie.** Open Qdrant = publieke database. Altijd auth.
- **Vergeten volume-mount in Docker.** `docker stop` = alles kwijt.
- **`recreateCollection` in productie.** Gooit alles weg. Gebruik `collectionExists` + `createCollection`.
- **Verwachten dat delete meteen ruimte vrijmaakt.** Delete markeert; optimizer ruimt later op. Normaal.
- **Verwachten dat HNSW meteen klaar is na grote upload.** Nieuwe points worden brute-force doorzocht tot de optimizer indexeert. Check `indexed_vectors_count`.
- **`limit` verwarren met recall.** Meer `limit` haalt meer resultaten, maar verbetert recall niet; `hnsw_ef` doet dat.
- **Geen score-threshold.** Vragen buiten de stof leveren zwakke matches die de LLM ruis voeren. Zet een drempel.
- **Te grote chunks over de token-limiet van het embedding-model.** Wordt getruncated/geweigerd. Meet tokens.

---

## 19. Monitoring, backups en operations

### Health & metrics

- `GET /healthz` — liveness.
- `GET /metrics` — Prometheus-formaat. Scrape query-latency, indexering-status, geheugen.
- `GET /collections/{name}` — `points_count`, `indexed_vectors_count`, `status` (green/yellow/red). `yellow` = optimalisatie bezig.

### Snapshots (backups)

Qdrant kan **snapshots** maken per collection of van de hele node:

```ts
await qdrant.createSnapshot("course_material");
```

Een snapshot is een consistent bestand dat je kunt downloaden, ergens veilig opslaan, en terugzetten op een nieuwe node. Automatiseer dit (cron) en test je restore — een backup die je nooit hebt teruggezet is geen backup.

### Herbouwbaar > backup?

Bijzonder aan een vector-DB: de data is vaak **regenereerbaar**. Je originele documenten staan al ergens (Postgres/S3). In het ergste geval her-chunk en her-embed je alles. Dat kost tijd en API-geld, maar je verliest geen unieke data. Overweeg of snapshots of een reproduceerbare re-index-pipeline (of allebei) je backup-strategie is. Voor STUDO: bewaar de bron-documenten + chunking-config zorgvuldig, dan is de Qdrant-collection altijd te reconstrueren.

---

## 20. Checklist voor productie

- [ ] API-key gezet (`QDRANT__SERVICE__API_KEY`) + TLS aan
- [ ] Docker-volume gemount (data overleeft restart)
- [ ] Collection-dimensie matcht het embedding-model
- [ ] Distance metric = Cosine (of Dot bij genormaliseerde vectoren)
- [ ] Scalar quantization aan + rescoring met oversampling ~2.0
- [ ] Payload-indexen op `university_id`, `course_id` (+ `is_tenant`)
- [ ] Deterministische UUID-point-IDs (`document_id + chunk_index`)
- [ ] `embedding_model` opgeslagen in elke payload
- [ ] Tenant-filter server-side uit de sessie, nooit client-input
- [ ] `wait: true` in read-after-write pipelines
- [ ] Lege/oversized chunks gefilterd vóór embedden
- [ ] Score-threshold ingesteld voor "geen antwoord"-gevallen
- [ ] `hnsw_ef` afgesteld op een recall-testset, niet op gevoel
- [ ] Snapshot-backups geautomatiseerd + restore getest
- [ ] Metrics gescraped (latency, indexering, geheugen)
- [ ] Bron-documenten + chunking-config bewaard voor reproduceerbare re-index

---

> **Samengevat:** Qdrant is een tabel (collection) met rijen (points) die bestaan uit een embedding (vector) + metadata (payload). Je zoekt op gelijkenis via HNSW, filtert multi-tenant via payload-indexen, bespaart geheugen met quantization, en bewaakt kwaliteit met `hnsw_ef` + rescoring. Krijg §5 (metrics), §6 (HNSW) en §13 (filtered search) onder de knie en je begrijpt Qdrant beter dan de meeste mensen die het in productie draaien.
