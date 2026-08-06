"use client";
import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import SetSearch from "@/components/ui/app/private/your-files/sets/search";
import ListItems from "@/components/ui/app/private/your-files/sets/listitems";
import type { StudySetItem } from "@/components/ui/app/private/your-files/sets/grid";
import { useCourse } from "@/hooks/app/courses/useCourse";
import { useParams } from "next/navigation";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import Select from "@/components/ui/design_system/select/Select";

export default function CourseSetsGrid() {
  const { id } = useParams<{ id: string }>();

  const course = useCourse(id)?.data;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const courseSets = course?.sets ?? [];

  useCourseNav([
    {
      title: "home",
      href: `/home`,
      isLast: false,
      translate: true,
    },
    {
      title: course?.title ?? "",
      href: `/course/${id}/overview`,
      isLast: false,
      translate: false,
    },
    {
      title: "sets",
      href: `/course/${id}/sets`,
      isLast: true,
      translate: true,
    },
  ]);

  const allSets: StudySetItem[] = useMemo(
    () =>
      courseSets.map((s) => ({
        ...s,
        type:
          s.setType === "studoset"
            ? ("studyset" as const)
            : ("visualset" as const),
      })),
    [courseSets],
  );

  const [sortMode, setSortMode] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSets = useMemo(() => {
    let result = allSets;
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
    <div className="p-5 relative min-w-0 flex-1 flex flex-col gap-5 scroll-hidden overflow-y-scroll overflow-x-visible">
      <div className="sticky top-0 w-full z-20 backdrop-blur-2xl flex overflow-visible flex-row items-center justify-between gap-3">
        <div className="w-fit flex flex-row gap-5 items-center">
          <Select
            placeholder="sort sets"
            size={"sm"}
            value={sortMode}
            onChange={(input) => setSortMode(input as string)}
            options={[
              {
                label: t("all"),
                value: "all",
              },
              {
                value: "recent",
                label: t("recent"),
              },
              {
                value: "created",
                label: t("created"),
              },
            ]}
          />
        </div>
        <SetSearch
          sets={allSets}
          setSearchQuery={setSearchQuery}
          className={"h-8"}
        />
      </div>
      <div className="w-full flex-1 h-fit gap-2 flex flex-col">
        <ListItems items={filteredSets} />
      </div>
    </div>
  );
}
