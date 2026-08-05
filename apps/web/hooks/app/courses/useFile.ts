import { useQuery } from "@tanstack/react-query";
import type { FullCourseDocument } from "@studo/types";
import { courseKeys } from "./courseKeys";

export function useFile(courseId: string, docId: string) {
  return useQuery<FullCourseDocument>({
    queryKey: courseKeys.document(courseId, docId),
    enabled: Boolean(docId),
    // signed url is ~1u geldig → lang cachen zodat de url stabiel blijft en de
    // PDF niet herlaadt bij tab-focus of remount (anders nieuwe url = reload).
    staleTime: 1000 * 60 * 50,
    gcTime: 1000 * 60 * 55,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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
