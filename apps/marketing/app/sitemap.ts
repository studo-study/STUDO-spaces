import type { MetadataRoute } from "next";
import { routing } from "@studo/i18n/routing";
import { SEO_BASE_URL, SEO_ROUTES } from "@/lib/seo";

const LOCALES = routing.locales;

/**
 * Dynamic sitemap generated from SEO_ROUTES × locales.
 * Replaces the old hand-maintained public/sitemap.xml (stale lastmod,
 * missing `es`). Emits one entry per locale with full hreflang alternates
 * + x-default so the cluster is correct by construction.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const url = (locale: string, path: string) =>
    `${SEO_BASE_URL}/${locale}${path}`;

  return SEO_ROUTES.flatMap(({ path, priority }) => {
    const languages = {
      ...Object.fromEntries(LOCALES.map((l) => [l, url(l, path)])),
      "x-default": url(routing.defaultLocale, path),
    };

    return LOCALES.map((locale) => ({
      url: url(locale, path),
      lastModified,
      changeFrequency: "weekly" as const,
      priority,
      alternates: { languages },
    }));
  });
}
