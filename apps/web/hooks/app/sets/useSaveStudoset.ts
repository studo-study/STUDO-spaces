import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullStudysetResponse } from "@studo/types";

export function useSaveStudoset(setId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["studosets", setId];

  const optimisticUpdate = async (folderId: string | null) => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData<FullStudysetResponse>(queryKey);
    queryClient.setQueryData<FullStudysetResponse>(queryKey, (old) => {
      if (!old) return old;
      return { ...old, folder_id: folderId };
    });
    return { previous };
  };

  const onError = (
    _: unknown,
    __: unknown,
    context: { previous: FullStudysetResponse | undefined } | undefined,
  ) => {
    if (context?.previous) {
      queryClient.setQueryData(queryKey, context.previous);
    }
  };

  const onSettled = () => queryClient.invalidateQueries({ queryKey });

  const save = useMutation({
    mutationFn: (folderId: string) =>
      fetch(`/api/studysets/${setId}/folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folder_id: folderId }),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to save to folder");
      }),
    onMutate: (folderId) => optimisticUpdate(folderId),
    onError,
    onSettled,
  });

  const remove = useMutation({
    mutationFn: () =>
      fetch(`/api/studysets/${setId}/folder`, { method: "DELETE" }).then(
        (r) => {
          if (!r.ok) throw new Error("Failed to remove from folder");
        },
      ),
    onMutate: () => optimisticUpdate(null),
    onError,
    onSettled,
  });

  return { save, remove };
}
