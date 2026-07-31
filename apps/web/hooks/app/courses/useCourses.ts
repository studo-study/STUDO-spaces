import { useQuery } from "@tanstack/react-query";
import type { Course } from "@studo/types";
import { courseKeys } from "./courseKeys";

/** Alle courses waar de ingelogde user lid van is. */
export function useCourses() {
  return useQuery<Course[]>({
    queryKey: courseKeys.all,
    queryFn: () => fetch("/api/courses/me").then((r) => r.json()),
  });
}
