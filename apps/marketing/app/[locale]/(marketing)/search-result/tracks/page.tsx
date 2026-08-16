import AllStudoResults from "@/components/ui/app/shared/search/studo/all_studo";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search · Tracks - Studo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={"w-full flex flex-1 min-h-0"}>
      <AllStudoResults />
    </div>
  );
}
