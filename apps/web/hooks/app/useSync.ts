import { useQuery } from "@tanstack/react-query";
import type { SyncResponse } from "@studo/types";

export function useSync() {
  const query = useQuery<SyncResponse>({
    queryKey: ["sync"],
    queryFn: () => fetch("/api/sync").then((r) => r.json()),
    staleTime: 30_000,
  });

  return {
    ...query,
    studysets: query.data?.studysets ?? [],
    visualsets: query.data?.visualsets ?? [],
    start: query.data?.start ?? null,
    lastTen: query.data?.start?.lastTen ?? [],
  };
}
