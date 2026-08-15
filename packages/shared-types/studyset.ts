import type { CreateCard, UpdateCard, CardResponse } from "./card";
import type { SetLikeResponse } from "./setlike";
import type { StudysessionResponse } from "./studysession";
import type { ClassroomResponse } from "./classroom";
import type { VisualsetResponse } from "./visualset";
import type { CourseResponse } from "./course";

export interface CreateStudyset {
  title: string;
  globalTermLanguage: string;
  globalDefinitionLanguage: string;
  cardlist: CreateCard[];
}

export interface UpdateStudyset {
  title?: string;
  globalTermLanguage?: string;
  globalDefinitionLanguage?: string;
  publicSet?: boolean;
  cards?: UpdateCard[];
}

export interface StudysetResponse {
  id: string;
  title: string;
  globalTermLanguage: string;
  globalDefinitionLanguage: string;
  createdAt: string;
  lastUpdated: string;
  publicSet: boolean;
  displayName: string;
  imgUrl: string;
  userId: string;
  cardCount?: number;
  lastStudied?: string | null;
  progress?: number;
}

export interface FullStudysetResponse extends StudysetResponse {
  cards: CardResponse[];
  likes: SetLikeResponse[];
  session?: StudysessionResponse;
  classrooms?: ClassroomResponse[];
  /** De course van de opvragende user waarin deze set zit (indien van toepassing). */
  course?: CourseResponse;
}

export interface PublicStudysetResponse extends StudysetResponse {
  cards: CardResponse[];
  likes: SetLikeResponse[];
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
