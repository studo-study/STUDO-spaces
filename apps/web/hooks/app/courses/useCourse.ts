import { useQuery } from "@tanstack/react-query";
import type { FullCourseResponse } from "@studo/types";
import { courseKeys } from "./courseKeys";

/** Volledige course (tables → rows → resources, sets, documents, members). */
export function useCourse(id: string) {
  return useQuery<FullCourseResponse>({
    queryKey: courseKeys.course(id),
    enabled: Boolean(id),
    queryFn: () =>
      fetch(`/api/courses/${id}`).then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load"), {
            status: r.status,
          });
        return r.json();
      }),
  });
}
