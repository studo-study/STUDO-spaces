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
    <div className={"flex bg-gray-900 flex-col flex-1 min-h-0 overflow-hidden"}>
      <div className={"w-full gap-2 shrink-0"}>
        <PageTitle
          title={`Lucide Icons (${filtered.length} / ${ALL_ICONS.length})`}
        />
        <input
          type="text"
          placeholder="Search an icon..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={
            "w-full px-3 py-4 rounded-full text-sm border-neutral-200/30 border outline-none border-box"
          }
        />
      </div>

      <div className={"flex-1 min-h-0 overflow-hidden"}>
        <div className={"grid grid-cols-7 p-4 gap-3"}>
          {paged.map(([name, Icon]) => (
            <button
              className={
                "dark:text-white dark:bg-gray-950 flex flex-col gap-3 border border-neutral-200/30 items-center justify-center px-2 backdrop-filter-2xl rounded-lg py-5"
              }
              key={name}
              onClick={() => handleCopy(kebabCase(name))}
              style={{
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
              <Icon
                size={22}
                strokeWidth={1.75}
                className={"text-[##1d1d1f} dark:text-white"}
              />
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
