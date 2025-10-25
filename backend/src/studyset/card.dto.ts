export class CreateCardDto {
  term: string;
  definition: string;
  created_at: string;
  updated_at: string;
  card_viewcount: number;
  set_id: number;
}

export class UpdateCardDto {
  term?: string;
  definition?: string;
  created_at?: string;
  updated_at?: string;
  card_viewcount?: number;
  set_id?: number;
}

export class CardResponseDto {
  id: string;
  term: string;
  definition: string;
  created_at: string;
  updated_at: string;
  card_viewcount: number;
  set_id: string;
}

export class CardListResponseDto {
  cards: CardResponseDto[];
}
