"use client";
import SearchHeader from "@/components/ui/app/shared/search/searchheader";
import { useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { SearchResults } from "@studo/types";

export default function Layout({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [result, setResult] = useState<SearchResults>();

  useEffect(() => {
    if (!query) return;
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/search/public/${query}`)
      .then((r) => r.json())
      .then((data) => {
        setResult(data);
      });
  }, [query]);

  const size =
    result &&
    result.data[0].data.length +
      result.data[1].data.length +
      result.data[2].data.length +
      result.data[3].data.length;
  console.log(result);

  return (
    <main
      className={`w-full dark:text-white text-studodarkblue
         flex flex-col justify-baseline items-center`}
    >
      <div className={"w-full flex flex-col gap-5"}>
        <SearchHeader query={query} size={size} />
        {children}
      </div>
    </main>
  );
}
