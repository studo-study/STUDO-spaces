"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ClassSearch from "@/components/ui/app/private/classrooms/ClassroomSearchbar";
import ClassroomOverviewItem from "@/components/ui/app/private/classrooms/ClassroomOverviewItem";
import { useUser } from "@/components/providers/auth/UserProvider";
import { useClassrooms } from "@/hooks/app/classrooms/useClassrooms";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";
import Select from "@studo/ui/design_system/select/Select";

export default function ClassroomGrid() {
  const { classrooms, isLoading } = useClassrooms();
  const User = useUser().user;
  const [sortMode, setSortMode] = useState<string>("all");
  const [query, setQuery] = useState<string>("");
  const t = useTranslations("classrooms");

  useCourseNav([
    {
      title: "classrooms",
      href: `/classrooms`,
      isLast: true,
      translate: true,
    },
  ]);

  // afgeleide lijst: eerst zoeken (query), dan sorteren (sortMode)
  const filteredClasses = useMemo(() => {
    let list = classrooms ?? [];

    if (query) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.school.toLowerCase().includes(query) ||
          item.ownerId.toLowerCase().includes(query),
      );
    }

    if (sortMode === "alphabetical") {
      list = list.toSorted((a, b) => a.name.localeCompare(b.name));
    } else if (sortMode === "last" && User) {
      list = list.toSorted((a, b) => {
        const timeA = a.users.find((u) => u.userId === User.id)?.joinedAt;
        const timeB = b.users.find((u) => u.userId === User.id)?.joinedAt;
        return (
          (timeB ? new Date(timeB).getTime() : 0) -
          (timeA ? new Date(timeA).getTime() : 0)
        );
      });
    }

    return list;
  }, [classrooms, query, sortMode, User]);

  return (
    <div className="w-full h-full min-h-0 min-w-0 flex-1 flex flex-col gap-5 scroll-hidden overflow-visible">
      <div
        className={
          "w-full h-20 z-20  py-8 flex flex-row items-center justify-between gap-3 overflow-visible"
        }
      >
        <div className={"w-fit flex flex-row gap-5 items-center"}>
          <Select
            placeholder="sort sets"
            align={"start"}
            size={"sm"}
            value={sortMode}
            onChange={(input) => setSortMode(input as string)}
            options={[
              {
                label: t("all"),
                value: "all",
              },
              {
                value: "last",
                label: t("last"),
              },
              {
                value: "alphabetical",
                label: t("alphabetical"),
              },
            ]}
          />
        </div>
        <div className={"w-fit flex flex-row gap-5 items-center"}>
          <ClassSearch onQueryChange={setQuery} />
        </div>
      </div>
      <div
        className={
          " min-h-0 min-w-0 flex-1 w-full h-fit flex flex-col gap-5 overflow-visible pb-15"
        }
      >
        {isLoading && (
          <div className="w-full py-10 text-center text-sm opacity-50">
            Loading...
          </div>
        )}
        {!isLoading && filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <ClassroomOverviewItem key={item.id} t={t} classroom={item} />
          ))
        ) : (
          <div
            className={
              "min-w-0 min-h-0 flex-1 flex justify-center items-center"
            }
          >
            {t("no_found")}
          </div>
        )}
      </div>
    </div>
  );
}
