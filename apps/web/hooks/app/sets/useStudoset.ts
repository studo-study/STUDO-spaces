import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FullStudysetResponse, SyncResponse } from "@studo/types";

export function useStudoset(id: string) {
  const queryClient = useQueryClient();

  return useQuery<FullStudysetResponse>({
    queryKey: ["studosets", id],
    queryFn: () => fetch(`/api/studysets/${id}`).then((r) => r.json()),
    placeholderData: () => {
      const sync = queryClient.getQueryData<SyncResponse>(["sync"]);
      return sync?.studysets.find((s) => s.id === id) as
        | FullStudysetResponse
        | undefined;
    },
  });
}
