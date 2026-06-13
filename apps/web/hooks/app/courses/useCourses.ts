import { useQuery } from "@tanstack/react-query";
import type { FlowCourseResponse } from "@studo/types";

export function useCourses() {
  return useQuery<FlowCourseResponse[]>({
    queryKey: ["flowcourses"],
    queryFn: () => fetch("/api/flows/courses").then((r) => r.json()),
  });
}
