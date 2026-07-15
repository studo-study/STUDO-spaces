import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateStudyset, type FullClassroom } from "@/types/types";

export function useCreateClassroom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateStudyset) =>
      fetch("/api/classrooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to create classroom");
        return r.json();
      }),

    onSuccess: (newClassroom) => {
      queryClient.setQueryData(
        ["classrooms"],
        (old: FullClassroom[] | undefined) => {
          if (!old) return old;
          return { ...old, classrooms: [newClassroom, ...old] };
        },
      );
    },
  });
}
