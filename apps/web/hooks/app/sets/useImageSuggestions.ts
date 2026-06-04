import { useQuery } from "@tanstack/react-query";
import { SuggestionImagesResponse } from "@studo/types";

export function useImageSuggestions(term: string | undefined, lang?: string) {
  return useQuery<SuggestionImagesResponse>({
    queryKey: ["image-suggestions", term, lang],
    queryFn: () => {
      const params = new URLSearchParams({ term: term! });
      if (lang) params.set("lang", lang);
      return fetch(`/api/studysets/suggest-image?${params}`).then((r) => {
        if (!r.ok) throw new Error("Failed to get suggestion");
        return r.json();
      });
    },
    enabled: !!term,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}
