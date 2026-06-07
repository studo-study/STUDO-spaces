"use client";
import { useTranslations } from "next-intl";
import { IoSearch } from "react-icons/io5";

export default function TicketSearch() {
  const t = useTranslations("y_f.your_sets");
  const search = false;
  return (
    <div
      className={`h-10 gap-5 px-5 dark:text-white w-70 rounded-4xl glass-rgb transition-all duration-300 
        ${search ? "dark:border-white border-gray-500" : "dark:border-studoborder/30 border-gray-300"} 
        border focus:border-white shadow-2xl flex justify-around`}
    >
      <input
        placeholder={t("search")}
        type="text"
        className="w-full h-full outline-none focus:ring-0"
      />
      <button className="w-fit cursor-pointer">
        <IoSearch />
      </button>
    </div>
  );
}
