import { useQuery } from "@tanstack/react-query";
import type { FullCourseDocument } from "@studo/types";
import { courseKeys } from "./courseKeys";

export function useFile(courseId: string, docId: string) {
  return useQuery<FullCourseDocument>({
    queryKey: courseKeys.document(courseId, docId),
    enabled: Boolean(docId),
    queryFn: () =>
      fetch(`/api/courses/${courseId}/docs/${docId}`).then((r) => {
        if (!r.ok)
          throw Object.assign(new Error("Failed to load"), {
            status: r.status,
          });
        return r.json();
      }),
  });
}
