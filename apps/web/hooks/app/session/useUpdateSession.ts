import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateStudysession } from "@studo/types";

export function useUpdateSession(sessionId: string, setId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: UpdateStudysession) => {
      const r = await fetch(`/api/studysessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Failed to update session (${r.status}): ${text}`);
      }
      return r.json();
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ["studosets", setId] }),
  });
}
