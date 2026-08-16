import type { MetadataRoute } from "next";
import { SEO_BASE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow all crawlers, incl. AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
    // Google-Extended, CCBot) — marketing wants GEO/AI-search visibility.
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Thin, query-driven pages — save crawl budget (also noindex'd).
        disallow: ["/*/search-result"],
      },
    ],
    sitemap: `${SEO_BASE_URL}/sitemap.xml`,
    host: SEO_BASE_URL,
  };
}
