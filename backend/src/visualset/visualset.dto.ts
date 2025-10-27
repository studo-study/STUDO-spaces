import { CardListResponseDto, CreateCardListDto } from '../studyset/card.dto';
import { PinResponseDto } from '../pin/pin.dto';
import { SetLikeResponseListDto } from '../studyset/setlike.dto';

export class CreateVisualsetDto {}

export class UpdateVisualsetDto {}

export class VisualsetResponseDto {
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
  grid_x: number;
  grid_y: number;
  scale: number;
}

export class FullVSResponseListDto extends VisualsetResponseDto {
  cards: CardListResponseDto;
  likes: SetLikeResponseListDto;
}

export class VisualsetResponseListDto {
  visualsets: VisualsetResponseDto[];
}
