import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateStudysession } from "@studo/types";

export function useUpdateSession(
  sessionId: string,
  setId: string,
  // per checkpoint invalideren = extra GET van de hele set → opt-out mogelijk
  { invalidateOnSettled = true }: { invalidateOnSettled?: boolean } = {},
) {
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
      // Response body is intentionally empty (204) — nothing to parse.
    },
    onSettled: invalidateOnSettled
      ? () => queryClient.invalidateQueries({ queryKey: ["studosets", setId] })
      : undefined,
  });
}
