import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FolderListResponse } from "@studo/types";

export function useDeleteFolder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/folders/${id}`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Failed to delete folder");
        return id;
      }),

    onSuccess: (id) => {
      queryClient.setQueryData(
        ["folders"],
        (old: FolderListResponse | undefined) => {
          if (!old) return old;
          return { ...old, folders: old.folders.filter((f) => f.id !== id) };
        },
      );
    },
  });
}
