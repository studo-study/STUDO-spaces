import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FullStudysetResponse, MyStudysetsResponse } from "@studo/types";

export function useStudoset(id: string) {
  const queryClient = useQueryClient();

  return useQuery<FullStudysetResponse>({
    queryKey: ["studosets", id],
    queryFn: () => fetch(`/api/studysets/${id}`).then((r) => r.json()),
    placeholderData: () => {
      const list = queryClient.getQueryData<MyStudysetsResponse>(["studosets"]);
      return list?.sets.find((s) => s.id === id) as
        | FullStudysetResponse
        | undefined;
    },
  });
}
