import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SyncResponse } from "@studo/types";
import { CreateStudyset } from "@/types/types";

export function useCreateStudyset() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateStudyset) =>
      fetch("/api/studysets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to create studyset");
        return r.json();
      }),

    onSuccess: (newSet) => {
      queryClient.setQueryData(["sync"], (old: SyncResponse | undefined) => {
        if (!old) return old;
        return { ...old, studysets: [newSet, ...old.studysets] };
      });
    },
  });
}
