import type { CreateCard, UpdateCard, CardResponse } from "./card";
import type { SetLikeResponse } from "./setlike";
import type { StudysessionResponse } from "./studysession";
import type { ClassroomResponse } from "./classroom";
import type { FolderResponse } from "./folder";
import type { VisualsetResponse } from "./visualset";

export interface CreateStudyset {
  title: string;
  course: string;
  global_term_language: string;
  global_definition_language: string;
  folder_id: string;
  cardlist: CreateCard[];
}

export interface UpdateStudyset {
  title?: string;
  course?: string;
  global_term_language?: string;
  global_definition_language?: string;
  public_set?: boolean;
  cards?: UpdateCard[];
}

export interface StudysetResponse {
  id: string;
  title: string;
  course: string;
  global_term_language: string;
  global_definition_language: string;
  created_at: string;
  last_updated: string;
  public_set: boolean;
  displayName: string;
  img_url: string;
  user_id: string;
  folder_id?: string | null;
  card_count?: number;
  last_studied?: string | null;
  progress?: number;
}

export interface FullStudysetResponse extends StudysetResponse {
  cards: CardResponse[];
  likes: SetLikeResponse[];
  session?: StudysessionResponse;
  classrooms?: ClassroomResponse[];
  folders?: FolderResponse[];
}

export interface StudysetListResponse {
  sets: StudysetResponse[];
}

export interface AllsetsResponse {
  studysets: StudysetResponse[];
  visualsets: VisualsetResponse[];
}

export interface MyStudysetsResponse {
  sets: StudysetResponse[];
  visualsets: VisualsetResponse[];
  stats: import("./user").TotalStats;
}
