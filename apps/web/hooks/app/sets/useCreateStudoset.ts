import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MyStudysetsResponse } from "@studo/types";
import { CreateStudyset } from "@/types/types";

export function useCreateStudyset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateStudyset) =>
      fetch("/api/studysets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => r.json()),

    onSuccess: (newSet) => {
      queryClient.setQueryData(
        ["studosets"],
        (old: MyStudysetsResponse | undefined) => {
          if (!old) return old;
          return { ...old, sets: [newSet, ...old.sets] };
        },
      );
    },
  });
}
