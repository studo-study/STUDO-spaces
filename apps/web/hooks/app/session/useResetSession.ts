import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useResetSession(sessionId: string, setId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const r = await fetch(`/api/studysessions/${sessionId}/reset`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Failed to reset session (${r.status}): ${text}`);
      }
      return r.json();
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["studosets", setId] }),
  });
}
