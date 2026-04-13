export interface UpdateSessionCard {
  id: string;
  number?: number;
  card_viewcount?: number;
  card_total_viewcount?: number;
  inQueue?: boolean;
  mastered?: boolean;
  times_relearned?: number;
  session_id?: string;
  owner_id?: string;
}

export interface SessionCardResponse {
  id: string;
  number: number;
  card_viewcount: number;
  card_total_viewcount: number;
  inQueue: boolean;
  mastered: boolean;
  times_relearned: number;
  card_id: string;
  session_id: string;
  owner_id: string;
}

export interface UpdateSessionPin {
  id: string;
  number?: number;
  inQueue?: boolean;
  pin_viewcount?: number;
  pin_total_viewcount?: number;
  session_id?: string;
  owner_id?: string;
}

export interface SessionPinResponse {
  id: string;
  number: number;
  mastered: boolean;
  times_relearned: number;
  inQueue: boolean;
  pin_viewcount: number;
  pin_total_viewcount: number;
  pin_id: string;
  session_id: string;
  owner_id: string;
}

export interface UpdateStudysession {
  started_at?: string;
  duration_min?: number;
  second_last_login?: string;
  last_login?: string;
  ended_at?: string;
  index?: number;
  accuracy?: number;
  average_response_time?: number;
  longest_focus_streak?: number;
  last_studied?: string;
  user_id: string;
  last_seen?: string;
  cards?: UpdateSessionCard[];
  pins?: UpdateSessionPin[];
}

export interface Studysession {
  id: string;
  started_at: string;
  duration_min: number;
  ended_at: string;
  index: number;
  accuracy: number;
  average_response_time: number;
  longest_focus_streak: number;
  last_seen: string;
  last_studied: string;
  user_id: string;
  set_id: string;
  set_type: string;
}

export interface StudysessionResponse extends Studysession {
  pins: SessionPinResponse[] | null;
  cards: SessionCardResponse[] | null;
}

export interface StudysessionListResponse {
  sessions: StudysessionResponse[];
}

export interface UserStats {
  device_type: string;
  second_last_login: string;
  last_login: string;
}
