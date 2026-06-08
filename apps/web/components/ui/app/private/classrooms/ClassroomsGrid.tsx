"use client";

import { useEffect, useRef, useState } from "react";
import { FullClassroom } from "@/types/types";
import { useTranslations } from "next-intl";
import ClassSearch from "@/components/ui/app/private/classrooms/ClassroomSearchbar";
import ClassroomOverviewItem from "@/components/ui/app/private/classrooms/ClassroomOverviewItem";
import { useUser } from "@/components/providers/auth/UserProvider";
import { useClassrooms } from "@/hooks/app/classrooms/useClassrooms";

export default function ClassroomGrid() {
  const { classrooms, isLoading } = useClassrooms();
  const User = useUser().user;
  const selectionRef = useRef<HTMLSelectElement>(null);
  const t = useTranslations("classrooms");
  const [filteredClasses, setFilteredClasses] = useState<FullClassroom[]>([]);

  useEffect(() => {
    setFilteredClasses(classrooms);
  }, [classrooms]);

  const filterClasses = () => {
    if (selectionRef.current && User) {
      const value = selectionRef.current.value;
      if (value === "all") setFilteredClasses(classrooms);
      if (value === "alphabetical")
        setFilteredClasses(
          classrooms.toSorted((a, b) => a.name.localeCompare(b.name)),
        );
      if (value === "last") {
        setFilteredClasses(
          classrooms.toSorted((a, b) => {
            const userA = a.users.find((u) => u.user_id === User.id);
            const userB = b.users.find((u) => u.user_id === User.id);

            const timeA = userA?.joined_at
              ? new Date(userA.joined_at).getTime()
              : 0;

            const timeB = userB?.joined_at
              ? new Date(userB.joined_at).getTime()
              : 0;

            return timeB - timeA;
          }),
        );
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-5 scroll-hidden overflow-visible">
      <div
        className={
          "w-full h-20 z-20 bg-gray-800 py-8 flex flex-row items-center justify-between gap-3 overflow-visible"
        }
      >
        <div className={"w-fit flex flex-row gap-5 items-center"}>
          <select
            name="sort sets"
            onChange={filterClasses}
            ref={selectionRef}
            defaultValue="all"
            className="
                                px-4 sm:px-6 py-2 sm:py-2.5 rounded-full
                                border border-studogrey/30
                                bg-white dark:bg-gray-700
                                text-studodarkblue dark:text-white
                                font-medium text-xs sm:text-sm
                                shadow-sm hover:shadow-md
                                transition-all duration-200
                                cursor-pointer w-45 text-center
                                focus:outline-none focus:ring-2 focus:ring-studogrey/50
                                appearance-none"
          >
            <option value="all">{t("all")}</option>
            <option value="last">{t("last")}</option>
            <option value="alphabetical">{t("alphabetical")}</option>
          </select>
        </div>
        <div className={"w-fit flex flex-row gap-5 items-center"}>
          <ClassSearch
            classes={classrooms}
            setFilteredClasses={setFilteredClasses}
          />
        </div>
      </div>
      <div
        className={"w-full h-fit flex flex-col gap-5 overflow-visible pb-15"}
      >
        {isLoading && (
          <div className="w-full py-10 text-center text-sm opacity-50">
            Loading...
          </div>
        )}
        {!isLoading &&
          filteredClasses.length > 0 &&
          filteredClasses.map((item) => (
            <ClassroomOverviewItem key={item.id} t={t} classroom={item} />
          ))}
      </div>
    </div>
  );
}
