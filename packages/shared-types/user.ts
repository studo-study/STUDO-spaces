export interface RegisterUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: string;
}

export interface SocialLogin {
  email: string;
  displayName: string;
  provider: string;
  providerId?: string;
  img_url?: string;
}

export interface UpdateUser {
  email?: string;
  password?: string;
  displayName?: string;
  img_url?: string;
  streak_started?: string;
  streak_count?: number;
  streak_last_update?: string;
  last_login?: string;
  role?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  img_url: string;
  join_date: string;
  joinNumber: number;
  totalSets: number;
  streak_started: string | null;
  streak_count: number | null;
  streak_last_update: string | null;
  last_login: string;
  roles: string[];
  publicRole: string;
  verified: boolean;
}

export interface LastStudied {
  set_id: string;
  last_studied: string;
  title: string;
  Course: string;
  type: string;
  progress: number;
  length: number;
}

export interface TotalStats {
  totalsets: number;
  timeLearned: number;
  cardsLearned: number;
  totalCards: number;
}

export interface UserResponseStats extends UserResponse {
  stats: TotalStats;
  lastTen: LastStudied[];
}

export interface UserListResponse {
  users: UserResponse[];
}

export interface HeaderResponse {
  displayName: string;
  email: string;
  streak_count: number | null;
  pfp: string;
}

export interface ClassActivities {
  id: string;
  classroom_id: string;
  user_id: string;
  displayName: string;
  img_url: string;
  set_id: string;
  set_type: string;
  title: string;
  last_seen: string;
}

export interface StartPagina {
  lastTen: LastStudied[];
  courses: string[];
  class: ClassActivities[];
  stats: TotalStats;
}
