import { useQuery } from "@tanstack/react-query";
import type { FullFlowCourseResponse } from "@studo/types";

export function useCourse(id: string) {
  return useQuery<FullFlowCourseResponse>({
    queryKey: ["courses", id],
    queryFn: () =>
      fetch(`/api/flows/course/${id}`).then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load"), {
            status: r.status,
          });
        return r.json();
      }),
  });
}
