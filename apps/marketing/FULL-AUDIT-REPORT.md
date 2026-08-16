# SEO Audit — apps/marketing (Studo)

**Type:** Source-code audit (Next.js App Router, next-intl i18n)
**Date:** 2026-08-15
**Scope:** 33 page routes, locales `en/nl/fr/es`, canonical host `studo.study`
**Method:** Static source analysis (no live URL). Confidence labels applied.

## Score

| Category                 | Score            | Notes                                                              |
| ------------------------ | ---------------- | ------------------------------------------------------------------ |
| Technical SEO            | 45 / Poor        | Canonical + hreflang broken, no robots, hardcoded lang             |
| On-Page Metadata         | 55 / Needs work  | 13 pages have zero metadata                                        |
| Schema / Structured Data | 10 / Critical    | No JSON-LD anywhere                                                |
| i18n / hreflang          | 40 / Poor        | Alternates point to homepage, host mismatch, es missing in sitemap |
| Performance              | 70 / Good (est.) | next/font good; Typekit render-blocking. `Likely` — no CWV run     |
| AI Search (GEO/AEO)      | 25 / Poor        | No robots AI rules, no structured data                             |
| **Overall**              | **~42 / Poor**   |                                                                    |

---

## 🔴 Critical

### C1 — Canonical points to homepage on ~19 of 20 pages

**Evidence:** Most pages set `const localeUrl = ${baseUrl}/${locale}` (no page path) then `canonical: localeUrl`.
Example `tools/learn/page.tsx:17` → canonical of `/en/tools/learn` resolves to `/en`. Only `contact/page.tsx:15` correctly appends `/contact`.
**Impact:** Google treats every tool/mode/classroom/legal page as a duplicate of the locale homepage → those pages drop out of the index. Highest-impact bug in the repo.
**Fix:** `localeUrl = ${baseUrl}/${locale}/<path>` per page (or derive path centrally).

### C2 — hreflang alternates point to homepage

**Evidence:** `about-us/page.tsx:26-32` — `languages: { en: ${baseUrl}/en, nl: ${baseUrl}/nl, ... }` — no page path. Same pattern across pages.
**Impact:** hreflang cluster maps every localized page to the locale root → invalid, Google ignores hreflang. Wrong-language results served.
**Fix:** append page path to each language URL; keep `x-default` → `/en/<path>`.

### C3 — Host mismatch: metadata vs sitemap

**Evidence:** metadata `baseUrl = "https://studo.study"` (no www); `public/sitemap.xml` uses `https://www.studo.study`.
**Impact:** Split canonical signals between apex and www. Dilutes ranking, confuses indexer.
**Fix:** Pick one canonical host (recommend apex `studo.study`), 301 the other, make sitemap + metadata agree.

### C4 — 13 pages have zero metadata (incl. homepage)

**Evidence:** no `metadata`/`generateMetadata` in: `[locale]/page.tsx` (homepage), `pricing`, `newsroom`, `help-center`, `GDPR`, `(select)/studo`, `studo-select`, `studo-for-education`, `search-result` + `/sets` `/tracks` `/users` `/classrooms`.
**Impact:** Homepage + pricing fall back to root layout `title:"Studo", description:"Learn smarter"` — no keywords, no OG, no canonical, no hreflang. Weakest pages are the money pages.
**Fix:** Add `generateMetadata` (reuse existing `messages/seo/*` pattern). `search-result/*` should be `robots: { index:false, follow:true }`.

---

## 🔴 High

### H1 — No robots.txt / robots route

**Evidence:** no `robots.ts`, no `public/robots.txt`.
**Impact:** No sitemap pointer for crawlers; no control over AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Bytespider).
**Fix:** Add `app/robots.ts` — allow crawl, reference sitemap, set AI-crawler policy per business choice.

### H2 — No structured data (JSON-LD) anywhere

**Evidence:** grep `application/ld+json` / `schema.org` → 0 hits in app/components.
**Impact:** No `Organization` (knowledge panel/brand), no `WebSite`+`SearchAction`, no `SoftwareApplication` for the product. Weak GEO/AEO — AI engines have no machine-readable entity.
**Fix:** Inject `Organization` + `WebSite` JSON-LD in `[locale]/layout.tsx`; `SoftwareApplication` on product/tool pages. JSON-LD only.

### H3 — Root `<html lang="en">` hardcoded for all locales

**Evidence:** `app/layout.tsx` `<html lang="en">`; locale layout does not override.
**Impact:** nl/fr/es pages declare English → wrong-language signal, a11y failure.
**Fix:** Move `<html lang>` into `[locale]/layout.tsx` using the route locale (or set `lang` dynamically).

### H4 — No `metadataBase`

**Evidence:** absent in both layouts.
**Impact:** Next resolves relative OG/canonical against `localhost` in some builds → broken absolute URLs. Currently masked by manual `${baseUrl}` concat.
**Fix:** `metadata.metadataBase = new URL("https://studo.study")` in root layout; then use relative paths.

---

## ⚠️ Medium

### M1 — Static hand-maintained sitemap.xml (drift)

**Evidence:** `public/sitemap.xml`, 75 `<url>`, `lastmod 2026-02-22` (stale), hreflang lists only `en/nl/fr` — **`es` missing** despite `routing.ts locales` including `es`.
**Fix:** Replace with dynamic `app/sitemap.ts` generated from routes × locales → always in sync, correct lastmod, includes es.

### M2 — `images.remotePatterns` allows `hostname: "*"`

**Evidence:** `next.config.ts` second pattern `{ protocol:"https", hostname:"*" }`.
**Impact:** Any HTTPS host can be optimized through your loader — SSRF/abuse + cost. Also negates the specific `studo.study` rule.
**Fix:** Restrict to known hosts (`studo.study`, CDN).

### M3 — Typekit render-blocking stylesheet

**Evidence:** `app/layout.tsx` `<link rel="stylesheet" href="https://use.typekit.net/fmn3jvz.css">` in `<head>`.
**Impact:** Extra render-blocking round-trip → LCP hit. `Montserrat` already loaded via `next/font` (good).
**Fix:** If Typekit font unused, remove. Else preconnect + async load.

### M4 — Verify favicon path

**Evidence:** metadata `icons.icon: "/favicon.ico"`; `public/` has `favicons/` dir, no confirmed root `favicon.ico`.
**Fix:** Confirm `/favicon.ico` resolves or point to actual file.

---

## Environment Limitations

No live URL fetched → Core Web Vitals, rendered HTML, and real redirect/host behavior are `Likely`/`Hypothesis`, not measured. Run `pagespeed.py` + `robots_checker.py` against the deployed URL to confirm C3, M3, and CWV.
