import type { StudysetResponse } from './studyset';
import type { VisualsetResponse } from './visualset';

export interface Profile {
  user_id: string;
  displayName: string;
  img_url: string;
  banner_url: string | null;
  join_date: string;
  joinNumber: number;
  streak: number;
  verified: boolean;
}

export interface ProfileListResponse {
  profiles: Profile[];
}

export interface ClassroomProfile {
  user_id: string;
  displayName: string;
  img_url: string;
}

export interface ClassroomProfileList {
  profiles: ClassroomProfile[];
}

export interface ProfileResponse {
  profile: Profile;
  studysets: StudysetResponse[];
  visualsets: VisualsetResponse[];
}
