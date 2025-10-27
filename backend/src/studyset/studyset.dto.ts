import { CardListResponseDto, CreateCardListDto } from './card.dto';
import { SetLikeResponseDto, SetLikeResponseListDto } from './setlike.dto';

export class CreateStudysetDto {
  title: string;
  subject: string;
  global_term_language: string;
  global_definition_language: string;
  user_id: string;
  folder_id: string;
  cardlist: CreateCardListDto[];
}

export class UpdateStudysetDto {
  title?: string;
  subject?: string;
  global_term_language?: string;
  global_definition_language?: string;
  created_at?: string;
  last_studied?: string;
  last_updated?: string;
  publicSet?: boolean;
  hearts?: number;
  user_id?: string;
  folder_id?: string;
}

export class StudysetResponseDto {
  id: string;
  title: string;
  subject: string;
  global_term_language: string;
  global_definition_language: string;
  created_at: string;
  last_studied: string;
  last_updated: string;
  publicSet: boolean;
  hearts: number;
  user_id: string;
  folder_id: string;
}

export class fullSetResponseDto extends StudysetResponseDto {
  cards: CardListResponseDto;
  likes: SetLikeResponseListDto;
}

export class StudysetListResponseDto {
  sets: StudysetResponseDto[];
}
