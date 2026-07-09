import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FullStudysetResponse, SetLikeResponse } from "@studo/types";

export function useLikeStudoset(setId: string, userId: string) {
  const queryClient = useQueryClient();
  const queryKey = ["studosets", setId];

  const optimisticUpdate = async (
    updater: (likes: SetLikeResponse[]) => SetLikeResponse[],
  ) => {
    await queryClient.cancelQueries({ queryKey });
    const previous = queryClient.getQueryData<FullStudysetResponse>(queryKey);
    queryClient.setQueryData<FullStudysetResponse>(queryKey, (old) => {
      if (!old) return old;
      return { ...old, likes: updater(old.likes) };
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

  const like = useMutation({
    mutationFn: () =>
      fetch(`/api/studysets/${setId}/likes`, { method: "POST" }).then((r) => {
        if (!r.ok) throw new Error("Failed to like");
        return r.json() as Promise<SetLikeResponse>;
      }),
    onMutate: () =>
      optimisticUpdate((likes) => [
        ...likes,
        {
          userId: userId,
          setId: setId,
          setType: "studyset",
          id: "optimistic",
          createdAt: new Date().toISOString(),
        },
      ]),
    onError,
    onSettled,
  });

  const unlike = useMutation({
    mutationFn: () =>
      fetch(`/api/studysets/${setId}/likes`, { method: "DELETE" }).then((r) => {
        if (!r.ok) throw new Error("Failed to unlike");
      }),
    onMutate: () =>
      optimisticUpdate((likes) => likes.filter((l) => l.userId !== userId)),
    onError,
    onSettled,
  });

  return { like, unlike };
}
