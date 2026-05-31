import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateFolder } from "@/types/types";

export function useCreateFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateFolder) =>
      fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to create folder");
        return null;
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sync"] });
    },
  });
}
