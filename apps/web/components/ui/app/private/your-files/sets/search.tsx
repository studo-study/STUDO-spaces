"use client";
import { IoSearch } from "react-icons/io5";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import classNames from "@/utils/classnames";

interface SetSearchProps {
  sets: unknown[];
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SetSearch({
  setSearchQuery,
  placeholder,
  className,
}: SetSearchProps) {
  const t = useTranslations("y_f.your_sets");
  const [search, setSearch] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={classNames(
        `h-10 gap-5 px-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300
        ${search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"}
        border focus:border-white shadow-2xl flex justify-around`,
        className,
      )}
    >
      <input
        onClick={() => setSearch(true)}
        onFocus={() => setSearch(true)}
        onBlur={() => setSearch(false)}
        onChange={() => setSearchQuery(searchRef.current?.value ?? "")}
        ref={searchRef}
        placeholder={placeholder ?? t("search")}
        type="text"
        className="w-full h-full outline-none focus:ring-0"
      />
      <button className="w-fit cursor-pointer">
        <IoSearch />
      </button>
    </div>
  );
}
