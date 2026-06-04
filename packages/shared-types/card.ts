export type CardContentType = "text" | "latex" | "code";

export interface CreateCard {
  term: string;
  definition: string;
  suggestion_image_id?: string | null;
  number: number;
  term_content_type: CardContentType;
  code_language?: string;
}

export interface CreateCardList {
  cards: CreateCard[];
}

export interface UpdateCard {
  id: string;
  term?: string;
  definition?: string;
  number?: number;
  updated_at?: string;
  term_content_type?: CardContentType;
  code_language?: string;
  suggestion_image_id?: string | null;
}

export interface CardResponse {
  id: string;
  term: string;
  definition: string;
  number: number;
  created_at: string;
  updated_at: string;
  set_id: string;
  owner_id: string;
  term_content_type: CardContentType;
  code_language: string;
  suggestion_image_id?: string | null;
}

export interface CardListResponse {
  cards: CardResponse[];
}
