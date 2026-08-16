import AllClassrooms from "@/components/ui/app/shared/search/classrooms/all_classrooms";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search · Classrooms - Studo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={"w-full flex flex-1 min-h-0"}>
      <AllClassrooms />
    </div>
  );
}
