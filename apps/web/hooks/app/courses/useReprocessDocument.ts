import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullCourseDocument, FullCourseResponse } from "@studo/types";
import { api } from "@/lib/api/api";
import { courseKeys } from "./courseKeys";

type Ctx = {
  prevCourse?: FullCourseResponse;
  prevDoc?: FullCourseDocument;
};

/**
 * Re-enqueue a document for parsing. The backend fires a Redis stream job and
 * flips the document status to "processing"; there's no response body.
 *
 * We optimistically set status -> "processing" so the UI reacts instantly, then
 * invalidate so the real status (processing -> finished/failed) streams in on the
 * next refetch of the course.
 */
export function useReprocessDocument(courseId: string, docId: string) {
  const qc = useQueryClient();

  return useMutation<void, Error, void, Ctx>({
    mutationFn: () =>
      api<void>(`/api/courses/${courseId}/docs/${docId}`, { method: "PATCH" }),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: courseKeys.course(courseId) });
      await qc.cancelQueries({
        queryKey: courseKeys.document(courseId, docId),
      });

      const prevCourse = qc.getQueryData<FullCourseResponse>(
        courseKeys.course(courseId),
      );
      const prevDoc = qc.getQueryData<FullCourseDocument>(
        courseKeys.document(courseId, docId),
      );

      // Flip the doc inside the course's documents list.
      qc.setQueryData<FullCourseResponse>(courseKeys.course(courseId), (old) =>
        old
          ? {
              ...old,
              documents: old.documents?.map((d) =>
                d.id === docId ? { ...d, status: "processing" } : d,
              ),
            }
          : old,
      );

      // And the standalone doc query, if it's cached.
      qc.setQueryData<FullCourseDocument>(
        courseKeys.document(courseId, docId),
        (old) => (old ? { ...old, status: "processing" } : old),
      );

      return { prevCourse, prevDoc };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.prevCourse)
        qc.setQueryData(courseKeys.course(courseId), ctx.prevCourse);
      if (ctx?.prevDoc)
        qc.setQueryData(courseKeys.document(courseId, docId), ctx.prevDoc);
    },

    onSettled: () => {
      // Prefix-invalidate: refetches both the course and the single doc.
      qc.invalidateQueries({ queryKey: courseKeys.course(courseId) });
    },
  });
}
