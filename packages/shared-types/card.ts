import { SuggestionImage } from "./suggestionimage";

export type CardContentType = "text" | "latex" | "code";

export interface CreateCard {
  term: string;
  definition: string;
  suggestionImageId?: string | null;
  number: number;
  termContentType: CardContentType;
  codeLanguage?: string;
}

export interface CreateCardList {
  cards: CreateCard[];
}

export interface UpdateCard {
  id: string;
  term?: string;
  definition?: string;
  number?: number;
  updatedAt?: string;
  termContentType?: CardContentType;
  codeLanguage?: string;
  suggestionImageId?: string | null;
}

export interface CardResponse {
  id: string;
  term: string;
  definition: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  setId: string;
  ownerId: string;
  termContentType: CardContentType;
  codeLanguage: string;
  suggestionImageId?: string | null;
  suggestionImage?: SuggestionImage | null;
}

export interface CardListResponse {
  cards: CardResponse[];
}
