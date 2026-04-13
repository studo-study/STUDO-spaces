export interface CreateCard {
  term: string;
  definition: string;
  image?: string | null;
  number: number;
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
}

export interface CardListResponse {
  cards: CardResponse[];
}
