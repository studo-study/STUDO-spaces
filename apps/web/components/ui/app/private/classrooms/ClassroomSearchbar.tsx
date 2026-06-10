"use client";
import { IoSearch } from "react-icons/io5";
import { useRef, useState } from "react";
import { FullClassroom } from "@/types/types";
import { useTranslations } from "next-intl";

interface ClassSearchProps {
  classes: FullClassroom[];
  setFilteredClasses: React.Dispatch<React.SetStateAction<FullClassroom[]>>;
}

export default function ClassSearch({
  classes,
  setFilteredClasses,
}: ClassSearchProps) {
  const t = useTranslations("classrooms");
  const [search, setSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const searching = () => {
    if (searchRef.current) {
      const query = searchRef.current.value.toLowerCase();
      if (query === "") {
        setFilteredClasses(classes); // Reset naar alle sets
      } else {
        setFilteredClasses(
          classes.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.school.toLowerCase().includes(query) ||
              item.owner_id.toLowerCase().includes(query),
          ),
        );
      }
    }
  };
  return (
    <div
      className={`h-10 gap-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300 px-5
        ${search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"} 
        border focus:border-white shadow-2xl flex justify-around`}
    >
      <input
        onClick={() => setSearch(true)}
        onFocus={() => setSearch(true)}
        onBlur={() => setSearch(false)}
        onChange={searching}
        ref={searchRef}
        placeholder={t("search")}
        type="text"
        className={" w-full h-full outline-none focus:ring-0"}
      />
      <button type={"button"} className={"w-fit cursor-pointer"}>
        <IoSearch />
      </button>
    </div>
  );
}
