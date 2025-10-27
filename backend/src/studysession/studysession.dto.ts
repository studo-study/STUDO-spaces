import { PinResponseDto } from '../pin/pin.dto';
import { CardResponseDto } from '../studyset/card.dto';

export class UpdateStudysessionDto {
  started_at?: string;
  duration?: number;
  second_last_login?: string;
  last_login?: string;
  ended_at?: string;
  index?: number;
  accuracy?: number;
  average_response_time?: number;
  longest_focus_streak?: number;
  device_type?: string;
  last_seen?: string;
}

export class StudysessionResponseDto {
  id: string;
  started_at: string;
  duration: number;
  second_last_login: string;
  last_login: string;
  ended_at: string;
  index: number;
  accuracy: number;
  average_response_time: number;
  longest_focus_streak: number;
  device_type: string;
  last_seen: string;
  user_id: string;
  set_id: string;
}

export class StudysessionListResponseDto {
  sessions: StudysessionResponseDto[];
}

export class TotalStats {
  joinNumber: number;
  joinDate: string;
  totalsets: number;
  timeLearned: number;
  cardsLearned: number;
}
