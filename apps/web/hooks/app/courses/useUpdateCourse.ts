import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Course,
  CourseResponse,
  FullCourseResponse,
  UpdateCourse,
} from "@studo/types";
import { api } from "@/lib/api/api";
import { courseKeys } from "@/hooks/app/courses/courseKeys";

export function useUpdateCourse(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (patch: UpdateCourse) =>
      api<CourseResponse>(`/api/courses/${id}`, {
        method: "PATCH",
        body: JSON.stringify(patch),
      }),

    onMutate: async (patch) => {
      // lopende refetches stoppen zodat ze onze optimistic update niet overschrijven
      await qc.cancelQueries({ queryKey: courseKeys.all });

      const prevCourse = qc.getQueryData<FullCourseResponse>(
        courseKeys.course(id),
      );
      const prevList = qc.getQueryData<Course[]>(courseKeys.all);

      // single course optimistisch updaten
      qc.setQueryData<FullCourseResponse>(courseKeys.course(id), (old) =>
        old ? { ...old, ...patch } : old,
      );

      // dezelfde course in de lijst optimistisch updaten
      qc.setQueryData<Course[]>(courseKeys.all, (old) =>
        old?.map((c) => (c.id === id ? { ...c, ...patch } : c)),
      );

      return { prevCourse, prevList };
    },

    onError: (_e, _v, ctx) => {
      // beide caches terugrollen bij fout
      if (ctx?.prevCourse)
        qc.setQueryData(courseKeys.course(id), ctx.prevCourse);
      if (ctx?.prevList) qc.setQueryData(courseKeys.all, ctx.prevList);
    },

    onSettled: () => {
      // ["courses"] matcht via prefix ook ["courses","course",id]
      // → single course én lijst worden opnieuw opgehaald van de server
      qc.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
