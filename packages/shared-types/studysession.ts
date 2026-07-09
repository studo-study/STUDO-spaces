export interface UpdateSessionCard {
  id: string;
  number?: number;
  cardViewcount?: number;
  cardTotalViewcount?: number;
  inQueue?: boolean;
  mastered?: boolean;
  timesRelearned?: number;
  sessionId?: string;
  ownerId?: string;
}

export interface SessionCardResponse {
  id: string;
  number: number;
  cardViewcount: number;
  cardTotalViewcount: number;
  inQueue: boolean;
  mastered: boolean;
  timesRelearned: number;
  cardId: string;
  sessionId: string;
  ownerId: string;
}

export interface UpdateSessionPin {
  id: string;
  number?: number;
  inQueue?: boolean;
  pinViewcount?: number;
  pinTotalViewcount?: number;
  sessionId?: string;
  ownerId?: string;
}

export interface SessionPinResponse {
  id: string;
  number: number;
  mastered: boolean;
  timesRelearned: number;
  inQueue: boolean;
  pinViewcount: number;
  pinTotalViewcount: number;
  pinId: string;
  sessionId: string;
  ownerId: string;
}

export interface UpdateStudysession {
  startedAt?: string;
  durationMin?: number;
  secondLastLogin?: string;
  lastLogin?: string;
  endedAt?: string;
  index?: number;
  accuracy?: number;
  averageResponseTime?: number;
  longestFocusStreak?: number;
  lastStudied?: string;
  userId: string;
  lastSeen?: string;
  cards?: UpdateSessionCard[];
  pins?: UpdateSessionPin[];
}

export interface Studysession {
  id: string;
  startedAt: string;
  durationMin: number;
  endedAt: string;
  index: number;
  accuracy: number;
  averageResponseTime: number;
  longestFocusStreak: number;
  lastSeen: string;
  lastStudied: string;
  userId: string;
  setId: string;
  setType: string;
}

export interface StudysessionResponse extends Studysession {
  pins: SessionPinResponse[] | null;
  cards: SessionCardResponse[] | null;
}

export interface StudysessionListResponse {
  sessions: StudysessionResponse[];
}

export interface UserStats {
  deviceType: string;
  secondLastLogin: string;
  lastLogin: string;
}
