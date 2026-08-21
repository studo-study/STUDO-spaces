import type { Metadata } from "next";
import { routing } from "@studo/i18n/routing";

export const SEO_BASE_URL = "https://studo.study";

const LOCALES = routing.locales;

/**
 * All indexable marketing routes (path after the `/{locale}` prefix).
 * Single source of truth for `app/sitemap.ts` + `app/llms.txt`. Keep in
 * sync when adding public pages. `search-result/*` is excluded (noindex).
 *
 * - `dir`      → `messages/seo/<dir>/<locale>.json` (title/description reuse)
 * - `priority` → biases crawl focus toward the money pages
 * - `group`    → section header in llms.txt
 */
export type SeoRoute = {
  path: string;
  dir: string;
  priority: number;
  group: "Product" | "Tools" | "Classrooms" | "Company" | "Legal";
};

export const SEO_ROUTES: SeoRoute[] = [
  { path: "/welcome", dir: "welcome", priority: 1.0, group: "Product" },
  { path: "/pricing", dir: "pricing", priority: 0.9, group: "Product" },
  {
    path: "/studo-for-education",
    dir: "studo-for-education",
    priority: 0.8,
    group: "Product",
  },
  {
    path: "/studo-select",
    dir: "studo-select",
    priority: 0.8,
    group: "Product",
  },
  { path: "/studo", dir: "studo", priority: 0.7, group: "Product" },
  { path: "/modes/ai", dir: "ai", priority: 0.8, group: "Product" },
  {
    path: "/modes/studosets",
    dir: "studosets",
    priority: 0.8,
    group: "Product",
  },
  {
    path: "/modes/visualsets",
    dir: "visualsets",
    priority: 0.8,
    group: "Product",
  },
  { path: "/tools/learn", dir: "learn", priority: 0.8, group: "Tools" },
  {
    path: "/tools/flashcards",
    dir: "flashcards",
    priority: 0.8,
    group: "Tools",
  },
  { path: "/tools/identify", dir: "identify", priority: 0.8, group: "Tools" },
  { path: "/tools/point", dir: "point", priority: 0.8, group: "Tools" },
  { path: "/tools/speedy", dir: "speedy", priority: 0.8, group: "Tools" },
  { path: "/challenges/duel", dir: "duel", priority: 0.6, group: "Classrooms" },
  {
    path: "/challenges/mastery-tournament",
    dir: "mastery",
    priority: 0.6,
    group: "Classrooms",
  },
  {
    path: "/challenges/time-attack",
    dir: "time-attack",
    priority: 0.6,
    group: "Classrooms",
  },
  { path: "/classes", dir: "classes", priority: 0.6, group: "Classrooms" },
  {
    path: "/communities",
    dir: "communities",
    priority: 0.6,
    group: "Classrooms",
  },
  { path: "/studygroups", dir: "groups", priority: 0.6, group: "Classrooms" },
  { path: "/about-us", dir: "about-us", priority: 0.6, group: "Company" },
  { path: "/newsroom", dir: "newsroom", priority: 0.5, group: "Company" },
  { path: "/faq", dir: "faq", priority: 0.6, group: "Company" },
  { path: "/help-center", dir: "help-center", priority: 0.5, group: "Company" },
  { path: "/contact", dir: "contact", priority: 0.5, group: "Company" },
  { path: "/privacy", dir: "privacy", priority: 0.3, group: "Legal" },
  {
    path: "/terms-of-service",
    dir: "terms-of-service",
    priority: 0.3,
    group: "Legal",
  },
  { path: "/GDPR", dir: "gdpr", priority: 0.3, group: "Legal" },
];

const ogLocale = (l: string) =>
  l === "en" ? "en_US" : `${l}_${l.toUpperCase()}`;

type SeoMessages = {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
};

/**
 * Builds page Metadata with correct per-page canonical + hreflang.
 *
 * @param seoDir  folder under `messages/seo/<seoDir>/<locale>.json`
 * @param path    route path appended after the locale, e.g. "/tools/learn"
 *                (use "" for the locale root)
 * @param locale  active locale from the route params
 */
export async function buildSeoMetadata(
  seoDir: string,
  path: string,
  locale: string,
  opts: { index?: boolean } = {},
): Promise<Metadata> {
  const messages: SeoMessages = (
    await import(`../messages/seo/${seoDir}/${locale}.json`)
  ).default;

  const url = (l: string) => `${SEO_BASE_URL}/${l}${path}`;
  const localeUrl = url(locale);
  const index = opts.index ?? true;
  // Per-page dynamic OG card by default; a page can still pin custom art
  // via `ogImage` in its seo/*.json. The legacy "/images/og/default.png"
  // placeholder is treated as "no custom art" → use the dynamic card.
  const dynamicOg = `/og?title=${encodeURIComponent(messages.title)}&desc=${encodeURIComponent(messages.description)}`;
  const custom =
    messages.ogImage && messages.ogImage !== "/images/og/default.png"
      ? messages.ogImage
      : undefined;
  const ogImage = custom ?? dynamicOg;

  return {
    metadataBase: new URL(SEO_BASE_URL),
    // absolute → bypass the root layout "%s | Studo" template
    // (page titles already carry their own "- Studo" branding)
    title: { absolute: messages.title },
    description: messages.description,
    keywords: messages.keywords,

    alternates: {
      canonical: localeUrl,
      languages: {
        ...Object.fromEntries(LOCALES.map((l) => [l, url(l)])),
        "x-default": url(routing.defaultLocale),
      },
    },

    openGraph: {
      title: messages.title,
      description: messages.description,
      url: localeUrl,
      siteName: "Studo",
      type: "website",
      locale: ogLocale(locale),
      alternateLocale: LOCALES.map(ogLocale).filter(
        (l) => l !== ogLocale(locale),
      ),
      images: [{ url: ogImage, width: 1200, height: 630, alt: messages.title }],
    },

    twitter: {
      card: "summary_large_image",
      title: messages.title,
      description: messages.description,
      images: [ogImage],
      creator: "@studo",
      site: "@studo",
    },

    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    applicationName: "Studo",
    category: "education",
  };
}
