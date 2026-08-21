import { SEO_BASE_URL, SEO_ROUTES, type SeoRoute } from "@/lib/seo";

/**
 * /llms.txt — machine-readable site index for AI search engines
 * (ChatGPT, Perplexity, Claude, Gemini) following the llmstxt.org spec.
 * Generated from SEO_ROUTES + the English seo/* descriptions so it stays
 * in sync with the sitemap and page metadata. English canonical (/en).
 */
export const dynamic = "force-static";

const GROUP_ORDER: SeoRoute["group"][] = [
  "Product",
  "Tools",
  "Classrooms",
  "Company",
  "Legal",
];

async function describe(dir: string): Promise<string> {
  try {
    const { title, description } = (
      await import(`../../messages/seo/${dir}/en.json`)
    ).default as { title: string; description: string };
    return `${title.replace(/\s*[-–|]\s*Studo\s*$/i, "").trim()}: ${description}`;
  } catch {
    return "";
  }
}

export async function GET() {
  const lines: string[] = [
    "# Studo",
    "",
    "> Studo is an all-in-one study platform for students: Studosets and Visualsets for active studying, Classrooms for collaboration, Flow to track subjects, and SVEN, an AI study coach. Free study tools for smarter, faster studying.",
    "",
  ];

  for (const group of GROUP_ORDER) {
    const routes = SEO_ROUTES.filter((r) => r.group === group);
    if (routes.length === 0) continue;
    lines.push(`## ${group}`, "");
    for (const r of routes) {
      const summary = await describe(r.dir);
      const url = `${SEO_BASE_URL}/en${r.path}`;
      const label = summary.split(":")[0];
      lines.push(
        `- [${label}](${url})${summary ? `: ${summary.split(":").slice(1).join(":").trim()}` : ""}`,
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
