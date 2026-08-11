export interface RegisterUserRequest {
  email: string;
  password: string;
  displayName: string;
  role: string;
  // Optioneel: de frontend stuurt ze mee, de server valt terug op defaults.
  acceptedTerms?: boolean;
  acceptedTermsDate?: string;
  privacyVersion?: string;
}

export interface SocialLogin {
  email: string;
  displayName: string;
  provider: string;
  providerId?: string;
  imgUrl?: string;
}

export interface UpdateUser {
  email?: string;
  password?: string;
  displayName?: string;
  imgUrl?: string;
  streakStarted?: string;
  streakCount?: number;
  streakLastUpdate?: string;
  lastLogin?: string;
  role?: string;
  acceptedTerms?: boolean;
  acceptedTermsDate?: string;
  privacyVersion?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  displayName: string;
  imgUrl: string;
  joinDate: string;
  joinNumber: number;
  totalSets: number;
  streakStarted: string | null;
  streakCount: number | null;
  streakLastUpdate: string | null;
  lastLogin: string;
  roles: string[];
  publicRole: string;
  verified: boolean;
  banned: boolean;
  acceptedTerms: boolean;
  acceptedTermsDate: string;
  privacyVersion: string;
}

export interface LastStudied {
  setId: string;
  lastStudied: string;
  title: string;
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
  streakCount: number | null;
  pfp: string;
}

export interface ClassActivities {
  id: string;
  classroomId: string;
  userId: string;
  displayName: string;
  imgUrl: string;
  setId: string;
  setType: string;
  title: string;
  lastSeen: string;
}

export interface StartPagina {
  lastTen: LastStudied[];
  class: ClassActivities[];
  stats: TotalStats;
}

export interface SyncResponse {
  studysets: import("./studyset").StudysetResponse[];
  visualsets: import("./visualset").VisualsetResponse[];
  start: StartPagina;
}
