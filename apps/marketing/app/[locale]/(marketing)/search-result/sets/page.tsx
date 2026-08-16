import All_sets from "@/components/ui/app/shared/search/sets/all_sets";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search · Sets - Studo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={"w-full flex flex-1 min-h-0"}>
      <All_sets />
    </div>
  );
}
