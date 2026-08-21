import { ImageResponse } from "next/og";

export const runtime = "nodejs";

/**
 * Dynamic Open Graph image generator — /og?title=...&desc=...
 * One endpoint drives per-page social/SERP preview cards. Wired centrally
 * through buildSeoMetadata so every page gets a branded, page-specific
 * card without a per-route opengraph-image file.
 *
 * 1200×630, Studo dark-blue → emerald gradient, wordmark + title + desc.
 */
const WIDTH = 1200;
const HEIGHT = 630;

export function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "Studo").slice(0, 120);
  const desc = (searchParams.get("desc") ?? "").slice(0, 200);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background:
          "linear-gradient(135deg, #0B1B3B 0%, #123a5e 55%, #0f5132 100%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          fontSize: 44,
          fontWeight: 800,
          letterSpacing: -1,
        }}
      >
        <span
          style={{
            display: "flex",
            width: 56,
            height: 56,
            borderRadius: 16,
            marginRight: 24,
            background: "#34d399",
            alignItems: "center",
            justifyContent: "center",
            color: "#0B1B3B",
          }}
        >
          S
        </span>
        Studo
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
          }}
        >
          {title}
        </div>
        {desc ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 32,
              fontWeight: 500,
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.3,
            }}
          >
            {desc}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: "flex",
          fontSize: 28,
          fontWeight: 600,
          color: "#34d399",
        }}
      >
        studo.study
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT },
  );
}
