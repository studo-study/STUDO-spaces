"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SetSearch from "@/components/ui/app/private/your-files/sets/search";
import ListItems from "@/components/ui/app/private/your-files/sets/listitems";
import { useSets } from "@/hooks/app/sets/useSets";
import { StudysetResponse, type VisualsetResponse } from "@studo/types";
import { useParams } from "next/navigation";

export interface StudySetItem {
  id: string;
  title: string;
  studoset?: boolean;
  globalTermLanguage?: string;
  globalDefinitionLanguage?: string;
  createdAt: string;
  lastUpdated: string;
  publicSet: boolean;
  displayName: string;
  imgUrl: string;
  userId: string;
  type: "studyset" | "visualset";
  flowcourseIcon?: string;
}

export default function CourseSetsGrid() {
  const { sets, visualsets } = useSets();
  const allSets: StudySetItem[] = useMemo(
    () => [
      ...sets.map((s: StudysetResponse) => ({
        ...s,
        type: "studyset" as const,
      })),
      ...visualsets.map((s: VisualsetResponse) => ({
        ...s,
        type: "visualset" as const,
      })),
    ],
    [sets, visualsets],
  );

  const [sortMode, setSortMode] = useState<"all" | "recent" | "created">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = useMemo(() => {
    let result = allSets.filter((set) => set);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }
    if (sortMode === "recent")
      return [...result].sort(
        (a, b) =>
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
      );
    if (sortMode === "created")
      return [...result].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    return result;
  }, [allSets, sortMode, searchQuery]);

  const t = useTranslations("y_f.your_sets");

  return (
    <div className="relative w-full flex-1 flex flex-col gap-5 scroll-hidden overflow-y-scroll overflow-x-visible">
      <div className="sticky top-0 w-full h-20 z-20 backdrop-blur-2xl py-8 flex overflow-visible flex-row items-center justify-between gap-3">
        <div className="w-fit flex flex-row gap-5 items-center">
          <select
            name="sort sets"
            value={sortMode}
            onChange={(e) =>
              setSortMode(e.target.value as "all" | "recent" | "created")
            }
            className="
                            px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                            border dark:border-studogrey/30 border-gray-200
                            bg-white/50 dark:bg-gray-700
                            text-studodarkblue dark:text-white
                            font-medium text-xs sm:text-sm
                            shadow-sm hover:shadow-md
                            transition-all duration-200
                            cursor-pointer w-45 text-center
                            focus:outline-none focus:ring-2 focus:ring-studogrey/50
                            appearance-none"
          >
            <option value="all">{t("all")}</option>
            <option value="recent">{t("recent")}</option>
            <option value="created">{t("created")}</option>
          </select>
        </div>
        <SetSearch sets={allSets} setSearchQuery={setSearchQuery} />
      </div>
      <div className="w-full flex-1 h-fit gap-2 flex flex-col">
        <ListItems items={filteredSets} />
      </div>
    </div>
  );
}
