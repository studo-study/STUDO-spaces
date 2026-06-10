import { useQuery } from "@tanstack/react-query";
import type { SyncResponse } from "@studo/types";

export function useSync() {
  const { error, data, isLoading } = useQuery<SyncResponse>({
    queryKey: ["sync"],
    queryFn: () => fetch("/api/sync").then((r) => r.json()),
    staleTime: 30_000,
  });

  return {
    error,
    isLoading,
    studysets: data?.studysets ?? [],
    visualsets: data?.visualsets ?? [],
    folders: data?.folders ?? [],
    courses: data?.courses ?? [],
    start: data?.start ?? null,
    lastTen: data?.start?.lastTen ?? [],
  };
}
