"use client";
import React from "react";
import { createPortal } from "react-dom";
import { Paperclip, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CourseResource, CourseRow } from "@studo/types";

type UpdateRow = (id: string, patch: Partial<CourseRow>) => void;

interface ResourceCellProps {
  row: CourseRow;
  updateRow: UpdateRow;
}

const ResourceCell: React.FC<ResourceCellProps> = ({ row, updateRow }) => {
  const t = useTranslations("flow.course");
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [coords, setCoords] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const resources = row.resources ?? [];

  const updateCoords = React.useCallback(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setCoords({ top: rect.bottom + 8, left: rect.left, width: rect.width });
  }, []);

  React.useLayoutEffect(() => {
    if (open) updateCoords();
  }, [open, updateCoords]);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !containerRef.current?.contains(target) &&
        !panelRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const reposition = () => updateCoords();
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", reposition, true);
      window.addEventListener("resize", reposition);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open, updateCoords]);

  const addResource = () => {
    const link = draft.trim();
    if (!link) return;
    const next: CourseResource[] = [
      ...resources,
      { id: crypto.randomUUID(), rowId: row.id, link },
    ];
    updateRow(row.id, { resources: next });
    setDraft("");
  };

  const removeResource = (id: string) => {
    updateRow(row.id, {
      resources: resources.filter((r) => r.id !== id),
    });
  };

  return (
    <div
      ref={containerRef}
      className={"w-full h-full px-3 flex items-center justify-center"}
    >
      <button
        type={"button"}
        onClick={() => setOpen((prev) => !prev)}
        className={
          "flex flex-row items-center gap-1.5 cursor-pointer text-sm px-2 py-1 rounded-full hover:bg-studogrey/30 transition-colors"
        }
      >
        <Paperclip size={14} opacity={0.6} />
        {resources.length > 0 && (
          <span className={"text-xs"}>{resources.length}</span>
        )}
      </button>

      {typeof document !== "undefined" &&
        coords &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left + coords.width / 2,
              transform: "translateX(-50%)",
            }}
            className={`z-200 w-64 max-w-[90vw] origin-top
              p-2 border border-neutral-200/30 dark:text-white text-studodarkblue
              rounded-2xl dark:bg-slate-800 bg-slate-100
              flex flex-col gap-2
              shadow-xl shadow-black/10 dark:shadow-black/30
              transition-all duration-200 ease-out
              ${
                open
                  ? "opacity-100 scale-100 visible pointer-events-auto"
                  : "opacity-0 scale-95 -translate-y-2 invisible pointer-events-none"
              }
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {resources.length > 0 && (
              <div className={"flex flex-col gap-1 max-h-48 overflow-y-auto"}>
                {resources.map((res) => (
                  <div
                    key={res.id}
                    className={
                      "group flex flex-row items-center justify-between gap-2 rounded-lg px-2 py-1 hover:bg-zinc-200/50 hover:dark:bg-zinc-400/20"
                    }
                  >
                    <a
                      href={res.link}
                      target={"_blank"}
                      rel={"noreferrer noopener"}
                      className={
                        "truncate text-xs text-blue-500 hover:underline"
                      }
                    >
                      {res.link}
                    </a>
                    <button
                      type={"button"}
                      aria-label={"remove"}
                      onClick={() => removeResource(res.id)}
                      className={
                        "shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      }
                    >
                      <X size={13} opacity={0.6} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className={"flex flex-row items-center gap-1"}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addResource();
                  }
                }}
                placeholder={t("add_resource")}
                className={
                  "min-w-0 flex-1 outline-none text-xs bg-studogrey/30 rounded-full px-3 py-1.5 border border-neutral-200/30"
                }
              />
              <button
                type={"button"}
                aria-label={"add"}
                onClick={addResource}
                className={
                  "shrink-0 cursor-pointer p-1.5 rounded-full hover:bg-zinc-200/50 hover:dark:bg-zinc-400/20"
                }
              >
                <Plus size={14} />
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

ResourceCell.displayName = "ResourceCell";
export default ResourceCell;
