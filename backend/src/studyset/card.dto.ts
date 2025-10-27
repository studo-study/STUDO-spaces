export class CreateCardDto {
  term: string;
  definition: string;
  image: null | string;
  number: number;
}

export class CreateCardListDto {
  cards: CreateCardDto[];
}

export class UpdateCardDto {
  term?: string;
  definition?: string;
  created_at?: string;
  updated_at?: string;
  card_viewcount?: number;
  card_totalviewcount?: number;
}

export class CardResponseDto {
  id: string;
  term: string;
  definition: string;
  number: number;
  created_at: string;
  updated_at: string;
  card_viewcount: number;
  card_totalviewcount: number;
  inQueue: boolean;
  mastered: boolean;
  times_relearned: number;
  set_id: string;
  owner_id: string;
}

export class CardListResponseDto {
  cards: CardResponseDto[];
}
