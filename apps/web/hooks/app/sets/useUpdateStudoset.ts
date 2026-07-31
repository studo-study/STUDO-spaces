import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateStudysetBody {
  title?: string;
  global_term_language?: string;
  global_definition_language?: string;
  public_set?: boolean;
  cardlist?: {
    term: string;
    definition: string;
    number: number;
    image?: string;
    term_content_type?: "text" | "latex" | "code";
    code_language?: string;
  }[];
}

export function useUpdateStudyset(setId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: UpdateStudysetBody) =>
      fetch(`/api/studysets/${setId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => {
        if (!r.ok) throw new Error("Failed to update studyset");
        return r.json();
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studosets", setId] });
      queryClient.invalidateQueries({ queryKey: ["sync"] });
    },
  });
}
