import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";

export interface CreateFolder {
  name: string;
}

export interface UpdateFolder {
  name?: string;
}

export interface FolderResponse {
  id: string;
  name: string;
  owner_id: string;
}

export interface FolderSets {
  studysets: StudysetResponse[];
  visualsets: VisualsetResponse[];
}

export interface FullFolderResponse {
  id: string;
  name: string;
  owner_id: string;
  sets: FolderSets;
}

export interface FolderListResponse {
  folders: FolderResponse[];
}

export interface SwitchFolder {
  user_id: string;
  set_id: string;
  destinationFolder_id: string;
}
