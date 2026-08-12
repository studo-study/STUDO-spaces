import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CourseTable,
  FullCourseResponse,
  UpdateCourseTable,
} from "@studo/types";
import { api } from "@/lib/api/api";
import { courseKeys } from "@/hooks/app/courses/courseKeys";

export function useUpdateCourseTable(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (patch: UpdateCourseTable) =>
      api<CourseTable>(`/api/courses/${id}/table`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),

    onMutate: async (patch) => {
      await qc.cancelQueries({ queryKey: courseKeys.course(id) });

      const prev = qc.getQueryData<FullCourseResponse>(courseKeys.course(id));

      // enkel title/description optimistisch updaten — rijen lopen via useCourseFlow
      qc.setQueryData<FullCourseResponse>(courseKeys.course(id), (old) =>
        old?.table
          ? {
              ...old,
              table: {
                ...old.table,
                title: patch.title ?? old.table.title,
                description: patch.description ?? old.table.description,
              },
            }
          : old,
      );

      return { prev };
    },

    onError: (_e, _patch, ctx) => {
      if (ctx?.prev) qc.setQueryData(courseKeys.course(id), ctx.prev);
    },

    onSuccess: (table) => {
      // server-truth tabel terugschrijven (nieuwe ids, timestamps, resources)
      qc.setQueryData<FullCourseResponse>(courseKeys.course(id), (old) =>
        old ? { ...old, table } : old,
      );
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: courseKeys.course(id) });
    },
  });
}
