import AllUsers from "@/components/ui/app/shared/search/users/all_users";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search · Users - Studo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className={"w-full flex flex-1 min-h-0"}>
      <AllUsers />
    </div>
  );
}
