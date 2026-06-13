import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { FullStudysetResponse, SyncResponse } from "@studo/types";

export function useCourse(id: string) {
  const queryClient = useQueryClient();
  const token = "";
  return useQuery<FullStudysetResponse>({
    queryKey: ["courses", id],
    queryFn: () =>
      fetch(`${process.env.AUTH_API_URL}/flows/course/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        method: "GET",
      }).then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load"), {
            status: r.status,
          });
        return r.json();
      }),
    placeholderData: () => {
      const sync = queryClient.getQueryData<SyncResponse>(["sync"]);
      return sync?.studysets.find((s) => s.id === id) as
        | FullStudysetResponse
        | undefined;
    },
  });
}
