import type { Metadata } from "next";
import { routing } from "@studo/i18n/routing";

export const SEO_BASE_URL = "https://studo.study";

const LOCALES = routing.locales;

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
  const ogImage = messages.ogImage ?? "/images/og/default.png";

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
