import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Course } from "@studo/types";
import { api } from "@/lib/api/api";
import { courseKeys } from "@/hooks/app/courses/courseKeys";

export function useDeleteCourse() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      api<void>(`/api/courses/${id}`, { method: "DELETE" }).then(() => id),

    onMutate: async (id) => {
      // lopende refetches stoppen zodat ze onze optimistic update niet overschrijven
      await qc.cancelQueries({ queryKey: courseKeys.all });

      const prevList = qc.getQueryData<Course[]>(courseKeys.all);

      // course optimistisch uit de lijst verwijderen
      qc.setQueryData<Course[]>(courseKeys.all, (old) =>
        old?.filter((c) => c.id !== id),
      );

      return { prevList };
    },

    onError: (_e, _id, ctx) => {
      // lijst terugrollen bij fout
      if (ctx?.prevList) qc.setQueryData(courseKeys.all, ctx.prevList);
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
