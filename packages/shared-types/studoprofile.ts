import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";

export interface StudoProfile {
  id: string;
  displayName: string;
  imgUrl: string;
  bannerUrl?: string;
  tags: string[];
}

export interface Track {
  id: string;
  trackName: string;
  iconName: string;
  grade: string;
  studysets: StudysetResponse[];
  visualsets: VisualsetResponse[];
}

export interface Community {
  id: string;
  name: string;
  owner: string;
  ownerId: string;
  type: string;
  verified: boolean;
}

export interface StudoProfileResponse {
  profile: StudoProfile;
  tracks: Track[];
  communities: Community[];
}
