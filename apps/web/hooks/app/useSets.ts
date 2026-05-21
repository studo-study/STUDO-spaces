import { useQuery } from "@tanstack/react-query";
import type { MyStudysetsResponse } from "@studo/types";

export function useStudosets() {
  const query = useQuery<MyStudysetsResponse>({
    queryKey: ["studosets"],
    queryFn: () => fetch("/api/studysets/me").then((r) => r.json()),
  });

  return {
    ...query,
    sets: query.data?.sets ?? [],
    visualsets: query.data?.visualsets ?? [],
    stats: query.data?.stats ?? null,
  };
}
