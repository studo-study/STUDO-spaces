import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MyStudysetsResponse } from "@studo/types";

export function useDeleteStudoset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/studysets/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Failed to delete studyset");
        return id;
      }),

    onSuccess: (id) => {
      queryClient.setQueryData(
        ["studosets"],
        (old: MyStudysetsResponse | undefined) => {
          if (!old) return old;
          return { ...old, sets: old.sets.filter((s) => s.id !== id) };
        },
      );
    },
  });
}
