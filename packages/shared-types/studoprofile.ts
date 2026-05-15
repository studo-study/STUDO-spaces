import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";

export interface StudoProfile {
  id: string;
  displayName: string;
  img_url: string;
  banner_url?: string;
  tags: string[];
}

export interface Track {
  id: string;
  trackName: string;
  icon_name: string;
  grade: string;
  studysets: StudysetResponse[];
  visualsets: VisualsetResponse[];
}

export interface Community {
  id: string;
  name: string;
  owner: string;
  owner_id: string;
  type: string;
  verified: boolean;
}

export interface StudoProfileResponse {
  profile: StudoProfile;
  tracks: Track[];
  communities: Community[];
}
