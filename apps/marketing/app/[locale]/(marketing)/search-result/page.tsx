import SearchResults from "@/components/ui/app/shared/search/searchResults";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search - Studo",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <SearchResults />;
}
