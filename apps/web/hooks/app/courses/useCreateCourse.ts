import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Course, CreateCourse } from "@studo/types";
import { courseKeys } from "./courseKeys";

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation<Course, Error, CreateCourse>({
    mutationFn: (body) =>
      fetch("/api/flows/course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to create course");
        return r.json();
      }),

    onSuccess: (newCourse) => {
      queryClient.setQueryData<Course[]>(courseKeys.all, (old) =>
        old ? [newCourse, ...old] : [newCourse],
      );
    },
  });
}
