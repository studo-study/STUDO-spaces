export interface TermSuggestionDTO {
  term: string;
  lang?: string;
}

export interface SuggestionImagesResponse {
  images: SuggestionImage[];
}

export interface SuggestionImage {
  id: string;
  pexelsId: string;
  displayUrl: string;
  source: string;
  photographer: string;
  sourcePageUrl: string;
}

export interface SetCardImage {
  imageId: string;
}
