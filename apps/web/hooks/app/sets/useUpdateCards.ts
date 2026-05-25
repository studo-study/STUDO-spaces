import { useQueryClient } from "@tanstack/react-query";
import type { CardContentType } from "@studo/types";

interface UpdateCardPayload {
  id: string;
  term: string;
  definition: string;
  term_content_type: CardContentType;
  code_language: string;
}

export function useUpdateCards(setId: string) {
  const queryClient = useQueryClient();

  const updateCards = async (cards: UpdateCardPayload[]): Promise<void> => {
    const res = await fetch(`/api/studysets/${setId}/cards`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cards }),
    });
    if (!res.ok) throw new Error("Failed to update cards");
    await queryClient.invalidateQueries({ queryKey: ["studosets", setId] });
  };

  return { updateCards };
}
