"use client";
import { IoSearch } from "react-icons/io5";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ClassSearchProps {
  // geeft de (lowercase) zoekterm terug; de parent filtert zelf
  onQueryChange: (query: string) => void;
}

export default function ClassSearch({ onQueryChange }: ClassSearchProps) {
  const t = useTranslations("classrooms");
  const [focused, setFocused] = useState(false);

  return (
    <div
      className={`h-10 gap-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300 px-5
        ${focused ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"}
        border focus:border-white shadow-2xl flex justify-around`}
    >
      <input
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={(e) => onQueryChange(e.target.value.toLowerCase().trim())}
        placeholder={t("search")}
        type="text"
        className={" w-full h-full outline-none focus:ring-0"}
      />
      <button className={"w-fit cursor-pointer"}>
        <IoSearch />
      </button>
    </div>
  );
}
