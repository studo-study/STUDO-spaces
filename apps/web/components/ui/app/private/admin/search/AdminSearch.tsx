"use client";
import { IoMdSearch } from "react-icons/io";
import { useTranslations } from "next-intl";
import { useCourseNav } from "@/hooks/app/courses/useCourseNav";

const AdminSearch = () => {
  const t = useTranslations("admin");
  useCourseNav([
    {
      title: "backoffice",
      href: `/backoffice`,
      isLast: false,
      translate: true,
    },
    {
      title: "search",
      href: `/backoffice/search`,
      isLast: true,
      translate: true,
    },
  ]);
  return (
    <div
      className={`min-w-1/3 lg:w-1/2 w-full h-14 flex flex-row items-center  px-7 bg-gray-300/30 dark:bg-gray-500/10
        rounded-full dark:text-white text-studodarkblue focus-within:border-gray-300 border-2 border-gray-400/30 dark:border-neutral-200/20`}
    >
      <input
        type="text"
        onKeyDown={(e) => e.key === "Enter"}
        placeholder={t("search_a")}
        className={"w-full h-full text-xl focus:border-none outline-none"}
      />
      <IoMdSearch className="text-2xl cursor-pointer active:scale-95 transition-all duration-200" />
    </div>
  );
};

AdminSearch.displayName = "AdminSearch";
export default AdminSearch;
