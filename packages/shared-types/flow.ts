export interface CreateFlowBoard {
  title: string;
  icon: string;
  description: string;
  year: string;
  semester?: string;
  school?: string;
  schoolId?: string;
}

export interface UpdateFLowBoard {
  title?: string;
  icon?: string;
  description?: string;
  year?: string;
  semester?: string;
  school?: string;
  schoolId?: string;
}

export interface FlowBoardResponse {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPfp: string;
  title: string;
  icon: string;
  creatorId: string;
  year: string | null;
  semester: string | null;
  school: string | null;
  schoolId: string | null;
  totalDone: number;
  totalInProgress: number;
  totalLength: number;
  courses: FlowCourseResponse[];
}

export interface FlowBoardOverview {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerPfp: string;
  title: string;
  icon: string;
  creatorId: string;
  year: string | null;
  semester: string | null;
  school: string | null;
  schoolId: string | null;
  progress: number;
  totalLength: number;
  totalDone: number;
  totalInProgress: number;
  courses: number;
}

export interface CreateFlowCourse {
  boardId?: string;
  title: string;
  icon: string;
  description?: string;
  resource?: string;
  examDate?: string;
  lessonDays?: string;
}

export interface UpdateFlowCourse {
  title?: string;
  icon?: string;
  description?: string;
  examDate?: string;
  lessonDays?: string;
}

export interface FlowCourseResponse {
  id: string;
  boardId: string | null;
  addedByDisplayName: string;
  addedById: string;
  title: string;
  icon: string;
  description: string;
  totalDone: number;
  totalInProgress: number;
  totalLength: number;
  resource: string;
  examDate: string;
  lessonDays: string;
}

export interface FullFlowCourseResponse extends FlowCourseResponse {
  rows: FlowRowResponse[];
}

export interface CreateFlowRow {
  courseId: string;
  title: string;
  orderIndex?: number;
  description?: string;
  priority?: Priority;
  status: Status;
  dueDate?: string;
  studosetId?: string;
  visualsetId?: string;
  resources?: CreateFlowResource[];
}

export interface UpdateFlowRow {
  title?: string;
  orderIndex?: number;
  description?: string;
  priority?: Priority;
  status?: Status;
  dueDate?: string;
  studosetId?: string;
  visualsetId?: string;
}

export interface FlowRowResponse {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  description: string;
  priority: string;
  courseLink?: string;
  summaryLink?: string;
  status: string;
  dueDate: string;
  studosetId: string;
  visualsetId: string;
  resources: FlowResourceResponse[];
}

export interface CreateFlowResource {
  title: string;
  link: string;
  linkType?: string;
  resourceType?: ResourceType;
}

export interface UpdateFlowResource {
  title?: string;
  link?: string;
  linkType?: string;
  resourceType?: ResourceType;
}

export interface FlowResourceResponse {
  id: string;
  title: string;
  link: string;
  linkType?: string;
  resourceType?: ResourceType;
}

export interface MyBoardsResponse {
  boards: FlowBoardOverview[];
}

export type ResourceType =
  | "course"
  | "notes"
  | "summary"
  | "abstract"
  | "sample_exam"
  | "task";
export type Priority = "no_priority" | "low" | "medium" | "high";
export type Status = "not_started" | "doing" | "done";
