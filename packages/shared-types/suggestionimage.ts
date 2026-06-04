export interface TermSuggestionDTO {
  term: string;
  lang?: string;
}

export interface SuggestionImagesResponse {
  images: SuggestionImage[];
}

export interface SuggestionImage {
  id: string;
  pexels_id: string;
  display_url: string;
  source: string;
  photographer: string;
  source_page_url: string;
}

export interface SetCardImage {
  image_id: string;
}
