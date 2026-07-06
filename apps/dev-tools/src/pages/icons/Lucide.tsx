import { useState, useMemo, useEffect } from "react";
import * as icons from "lucide-react";
import PageTitle from "../../components/PageTitle.tsx";

const PAGE_SIZE = 84;

const ALL_ICONS = Object.entries(icons).filter(([name, value]) =>
  typeof value === "object" || typeof value === "function"
    ? /^[A-Z]/.test(name) && name !== "createLucideIcon" && name !== "Icon"
    : false,
) as [string, icons.LucideIcon][];

function kebabCase(name: string) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

export default function IconBrowser() {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_ICONS;
    const q = query.toLowerCase();
    return ALL_ICONS.filter(([name]) => kebabCase(name).includes(q));
  }, [query]);

  // Back to first page whenever the result set changes.
  useEffect(() => {
    setPage(0);
  }, [query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = useMemo(
    () => filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filtered, page],
  );

  const handleCopy = (name: string) => {
    navigator.clipboard.writeText(name).catch(() => {});
    setCopied(name);
    setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className={"flex flex-col flex-1 min-h-0"}>
      <div className={"w-full gap-2 shrink-0"}>
        <PageTitle
          title={`Lucide Icons (${filtered.length} / ${ALL_ICONS.length})`}
        />
        <input
          type="text"
          placeholder="Search an icon..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 16px",
            fontSize: 15,
            borderRadius: 14,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(10px)",
            outline: "none",
            boxSizing: "border-box",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        />
      </div>

      <div className={"flex-1 min-h-0 overflow-auto"}>
        <div className={"grid grid-cols-7 p-4 gap-3"}>
          {paged.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => handleCopy(kebabCase(name))}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                padding: "16px 8px",
                borderRadius: 16,
                border: "1px solid rgba(0,0,0,0.06)",
                background:
                  copied === kebabCase(name)
                    ? "rgba(52,199,89,0.15)"
                    : "rgba(255,255,255,0.6)",
                backdropFilter: "blur(10px)",
                cursor: "pointer",
                transition: "transform 0.12s ease, background 0.2s ease",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.95)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
              title={kebabCase(name)}
            >
              <Icon size={22} strokeWidth={1.75} color="#1d1d1f" />
              <span
                style={{
                  fontSize: 10,
                  color: "#6e6e73",
                  textAlign: "center",
                  wordBreak: "break-word",
                  lineHeight: 1.2,
                }}
              >
                {copied === kebabCase(name) ? "copied!" : kebabCase(name)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={
          "shrink-0 flex flex-row items-center justify-center gap-4 py-4 roboto-mono text-sm"
        }
      >
        <button
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className={
            "px-3 py-1.5 rounded-lg border border-black/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-black/5 transition-colors"
          }
        >
          Previous
        </button>
        <span className={"text-[#6e6e73]"}>
          {page + 1} / {pageCount}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
          disabled={page >= pageCount - 1}
          className={
            "px-3 py-1.5 rounded-lg border border-black/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer hover:bg-black/5 transition-colors"
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}
