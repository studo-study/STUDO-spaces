import { useQuery } from "@tanstack/react-query";
import type { FullCourseResponse } from "@studo/types";
import { courseKeys } from "./courseKeys";

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

export const useCourseTable = (id: string) => useCourse(id).data?.table;
export const useCourseSets = (id: string) => useCourse(id).data?.sets;
export const useCourseDocs = (id: string) => useCourse(id).data?.documents;
