"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { type FullClassroom, type FullClassroomSet } from "@/types/types";
import Image from "next/image";
import { useState } from "react";
import CourseIcons from "@/data";

interface ListItemProps {
  items: FullClassroom;
}

export default function RecentlyAdded({ items }: ListItemProps) {
  const t = useTranslations("classroom");
  const [filteredSets] = useState(items.sets);
  //TODO
  const [now] = useState(() => Date.now());
  const ONE_WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;

  const thisWeek = filteredSets.filter(
    (item) => now - new Date(item.created_at).getTime() <= ONE_WEEK_IN_MS,
  );
  const lastWeek = filteredSets.filter((item) => {
    const age = now - new Date(item.created_at).getTime();
    return age > ONE_WEEK_IN_MS && age <= ONE_WEEK_IN_MS * 2;
  });
  const rest = filteredSets.filter(
    (item) => now - new Date(item.created_at).getTime() > ONE_WEEK_IN_MS * 2,
  );
  const pinned = [];
  return (
    <>
      <div className="w-full flex flex-row gap-5 items-center justify-end py-3"></div>
      <div className={"w-full min-h-full h-full flex flex-col gap-3"}>
        {pinned.length > 0 && (
          <>
            <span className={"font-bold text-studodarkblue dark:text-white"}>
              {t("pinned_sets")}:
            </span>
            <div className={"w-full h-1/3 flex flex-col gap-5"}>
              {pinned.length === 0 && (
                <span
                  className={
                    "w-full h-full text-studodarkblue dark:text-white flex items-center justify-center"
                  }
                >
                  {t("no_pinned")}
                </span>
              )}
            </div>
          </>
        )}
        <div className={"w-full h-2/3 flex flex-col gap-5"}>
          {/*sorry voor de spaghetti*/}
          {thisWeek.length ? (
            <div className={"w-full flex flex-col gap-10"}>
              <div className={"w-full h-fit flex flex-col gap-5"}>
                <span
                  className={
                    "dark:text-white text-sm text-studodarkblue font-bold"
                  }
                >
                  {t("this_week")}
                </span>
                {thisWeek.map((item, index) => (
                  <ListItem set={item} key={index} t={t} />
                ))}
              </div>
              {lastWeek.length != 0 && (
                <div className={"w-full h-fit flex flex-col gap-5"}>
                  <span
                    className={"dark:text-white text-sm text-studodarkblue"}
                  >
                    {t("last_week")}
                  </span>
                  {lastWeek.map((item, index) => (
                    <ListItem set={item} key={index} t={t} />
                  ))}
                </div>
              )}
              {rest.length != 0 && (
                <div className={"w-full h-fit flex flex-col gap-5"}>
                  <span
                    className={"dark:text-white text-sm text-studodarkblue"}
                  >
                    {t("other")}
                  </span>
                  {rest.map((item, index) => (
                    <ListItem set={item} key={index} t={t} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            items.sets.map((item, index) => (
              <ListItem set={item} key={index} t={t} />
            ))
          )}
          {items.sets.length == 0 && (
            <span
              className={
                "w-full h-full text-studodarkblue dark:text-white flex items-center justify-center"
              }
            >
              {t("no_sets")}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

interface SetItemProps {
  set: FullClassroomSet;
  t: ReturnType<typeof useTranslations>;
}

function ListItem({ set, t }: SetItemProps) {
  const iconSrc =
    set.set_type === "studyset"
      ? "/icons/studyset.svg"
      : "/icons/visualset.svg";

  const link =
    set.set_type === "studyset"
      ? "/studoset/" + set.set_id
      : "/visualset/" + set.set_id;
  return (
    <Link
      href={link}
      className={`
                     max-h-20 h-20 flex-col sm:flex-row px-10 pl-2.5 py-3 sm:py-0 max-w-full min-w-full cursor-pointer
                 flex gap-3 items-center w-full rounded-3xl bg-studogrey/30 border border-studoborder/30 hover:border-studoborder transition-all duration-300 overflow-hidden`}
    >
      <div
        className={`flex flex-row gap-3 items-center "w-full sm:w-1/2 sm:flex-1`}
      >
        <div
          className={
            "w-15 h-15 rounded-2xl bg-studogrey/30 flex items-center justify-center"
          }
        >
          <Image
            width={0}
            height={0}
            className={"w-8"}
            src={getCoverImage(set.title)}
            alt={set.title}
          />
        </div>
        <div className={"w-fit flex flex-col pt-1"}>
          <div className={"w-fit flex flex-row gap-3"}>
            <Image
              src={iconSrc}
              width={0}
              height={0}
              className="invert opacity-50 brightness-0 w-5 flex-shrink-0"
              alt=""
            />
            <span className="dark:text-white text-studodarkblue font-bold text-base overflow-hidden truncate">
              {set.title}
            </span>
          </div>
          <span
            className={"w-fit text-studodarkblue/30 dark:text-white/30 text-sm"}
          >
            {t("added_by")} {set.added_by}
          </span>
        </div>
      </div>
    </Link>
  );
}

function getCoverImage(title: string): string {
  const key = Object.keys(CourseIcons).find((k) =>
    title.toLowerCase().includes(k),
  ) as keyof typeof CourseIcons | undefined;
  return key
    ? `/icons/courses/${CourseIcons[key]}`
    : "/icons/courses/default.svg";
}
