import { useQuery } from "@tanstack/react-query";
import { SearchResults } from "@studo/types";

export function useSearchResult(query: string) {
  return useQuery<SearchResults>({
    queryKey: ["query", query],
    queryFn: () =>
      fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/search/public/${query}`,
      ).then((r) => r.json()),
  });
}
