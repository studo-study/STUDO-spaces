"use client";
import { useCourseNavStore } from "@/store/course/courseNavStore";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";

const BreadCrumbs = () => {
  const nav = useCourseNavStore((state) => state.nav);
  if (nav.length === 0) {
    return;
  }

  return (
    <div
      className={
        "py-1 w-fit px-2 gap-1 text-sm dark:text-white text-studodarkblue flex flex-row"
      }
    >
      {nav.map((link) => {
        return (
          <div className={"flex flex-row gap-1 items-center"} key={link.title}>
            <Link
              href={link.href}
              className={
                "gap-1 flex flex-row items-center font-semibold py-1.5 rounded-3xl px-3 hover:bg-studogrey/30"
              }
            >
              {link.icon} {link.title}
            </Link>
            {!link.isLast && (
              <ChevronRight size={15} className={"opacity-50"} />
            )}
          </div>
        );
      })}
    </div>
  );
};

BreadCrumbs.displayName = "BreadCrumbs";
export default BreadCrumbs;
