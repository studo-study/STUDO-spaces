# SEO Action Plan — apps/marketing

Ordered by impact ÷ effort. Do P0 first — indexing-blocking.

## P0 — This week (indexing-critical)

1. **Fix canonical path** (C1) — change `localeUrl = ${baseUrl}/${locale}` → include page path on every page missing it. ~18 files. Mechanical.
2. **Fix hreflang paths** (C2) — append page path to each `alternates.languages` URL + `x-default`. Same files as #1. Best solved by a shared `buildAlternates(locale, path)` helper in `@studo/i18n` or a local util → refactor all pages to use it.
3. **Pick one host** (C3) — standardize on `https://studo.study`. Update `public/sitemap.xml` (drop `www`) or metadata to match; add 301 redirect apex↔www at hosting/CDN.
4. **Add metadata to 13 bare pages** (C4) — homepage + pricing highest priority. Reuse `generateMetadata` + `messages/seo/*` pattern. `search-result/*` → `robots:{ index:false }`.

## P1 — Next 2 weeks

5. **`app/robots.ts`** (H1) — allow crawl, `Sitemap: https://studo.study/sitemap.xml`, decide AI-crawler policy (GPTBot/ClaudeBot/Google-Extended/CCBot).
6. **JSON-LD** (H2) — `Organization` + `WebSite`(+SearchAction) in `[locale]/layout.tsx`; `SoftwareApplication` on tool/mode pages.
7. **Dynamic `<html lang>`** (H3) — move into `[locale]/layout.tsx`.
8. **`metadataBase`** (H4) — set in root layout, switch OG/canonical to relative.

## P2 — This month

9. **Dynamic `app/sitemap.ts`** (M1) — generate from routes × `["en","nl","fr","es"]`; kill static file; fixes missing `es` + stale lastmod.
10. **Lock `remotePatterns`** (M2) — replace `"*"` with known hosts.
11. **Typekit** (M3) — remove if unused, else preconnect/async.
12. **Favicon check** (M4).

## Shared refactor (fixes #1 + #2 + #9 at once)

Add helper:

```ts
// packages/i18n or local util
export function seoAlternates(baseUrl: string, path: string, locale: string) {
  const locales = ["en", "nl", "fr", "es"] as const;
  const url = (l: string) => `${baseUrl}/${l}${path}`;
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(locales.map((l) => [l, url(l)])),
      "x-default": url("en"),
    },
  };
}
```

Every page calls `seoAlternates(baseUrl, "/tools/learn", locale)` → canonical + hreflang correct by construction, and `app/sitemap.ts` reuses the same list.

## Verify after deploy

- `pagespeed.py <url> --strategy mobile` → real CWV
- `robots_checker.py <url>` → AI crawler + sitemap
- Google Search Console → International Targeting (hreflang errors), Coverage (dedup canonical fixed)
