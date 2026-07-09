import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";

export interface Profile {
  userId: string;
  displayName: string;
  imgUrl: string;
  bannerUrl: string | null;
  joinDate: string;
  joinNumber: number;
  streak: number;
  verified: boolean;
}

export interface ProfileListResponse {
  profiles: Profile[];
}

export interface ClassroomProfile {
  userId: string;
  displayName: string;
  imgUrl: string;
}

export interface ClassroomProfileList {
  profiles: ClassroomProfile[];
}

export interface ProfileResponse {
  profile: Profile;
  studysets: StudysetResponse[];
  visualsets: VisualsetResponse[];
}
