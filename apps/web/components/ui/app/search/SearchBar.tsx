"use client";
import { IoMdSearch } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useLoadingStore } from "@/store/slices/loading/loadingStore";
import { useLocale } from "next-intl";

export default function AppSearchbar() {
  //variables
  const [query, setQuery] = useState("");
  const locale = useLocale();
  const router = useRouter();
  const inputFieldRef = useRef<HTMLInputElement>(null);
  const setLoading = useLoadingStore((s) => s.setLoading);

  //toggles
  const toggleSearch = () => {
    if (inputFieldRef.current?.value) {
      setQuery(inputFieldRef.current.value);
    }
    setLoading(true);
  };

  useEffect(() => {
    if (!query) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/public/${query}`)
      .then((r) => r.json())
      .then(() => {
        setLoading(false);
        router.push(`/${locale}/search?q=${query}`);
      });
    if (inputFieldRef.current) {
      inputFieldRef.current.value = "";
    }
  }, [locale, router, setLoading, query]);

  return (
    <div
      className={`flex w-full min-w-24 max-w-40 lg:max-w-50 xl:max-w-100 shrink
            px-4 h-10 rounded-full bg-gray-300/30 dark:bg-gray-500/10 flex-row items-center 
         dark:text-white text-studodarkblue border-2 border-gray-400/30 dark:border-studoborder/20`}
    >
      <input
        type="text"
        ref={inputFieldRef}
        onKeyDown={(e) => {
          if (e.key == "Enter") toggleSearch();
        }}
        placeholder={"search..."}
        className={
          "w-full h-full text-sm focus:border-none outline-none bg-transparent"
        }
      />
      <IoMdSearch
        onClick={toggleSearch}
        className="text-2xl shrink-0 cursor-pointer active:scale-95 transition-all duration-200"
      />
    </div>
  );
}
