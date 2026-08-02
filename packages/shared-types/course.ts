export type CourseRole = "owner" | "editor" | "viewer";
export type SetType = "studoset" | "visualset";
export type WidgetType =
  | "notes"
  | "flashcards"
  | "document"
  | "set"
  | "todo"
  | "timer"
  | "calendar";
export type RowStatus = "not_started" | "doing" | "done";
export type RowType =
  | "course"
  | "notes"
  | "summary"
  | "abstract"
  | "sample_exam"
  | "task"
  | "set";

export type RowPriority = "no_priority" | "low" | "medium" | "high";
export type CourseDocumentStatus =
  | "uploading"
  | "processing"
  | "finished"
  | "failed";
export type MimeType = "pdf" | "docx";

// --- Entiteiten ---

export interface Course {
  id: string;
  boardId: string | null; // null = standalone
  title: string;
  icon: string;
  publicCourse: boolean | null;
  createdAt: string | null;
  updatedAt: string | null;
  academyYear: number | null;
  examDate: string | null;
  institute: string | null;
}

export interface CourseMember {
  userId: string;
  courseId: string;
  role: CourseRole;
  displayName?: string;
  imgUrl?: string;
  createdAt: string | null;
}

export interface CourseWorkspace {
  id: string;
  courseId: string;
}

export interface CourseWidget {
  id: string;
  workspaceId: string;
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CourseDocument {
  id: string;
  courseId: string;
  uploaderId: string;
  title: string;
  author: string | null;
  publishingDate: string | null;
  status: CourseDocumentStatus;
  storageKey: string;
  mimeType: MimeType;
  pageCount: number | null;
  wordCount: number | null;
  fileSize: number | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CourseSet {
  setId: string;
  setType: SetType;
  addedBy: string;
  courseId: string;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface CourseResource {
  id: string;
  rowId: string;
  link: string;
}

export interface CourseRow {
  id: string;
  tableId: string;
  rowIndex: number;
  createdBy: string | null;
  status: RowStatus | null;
  priority: RowPriority | null;
  type: RowType | null;
  description: string | null;
  resources: CourseResource[];
  dueDate: string | null;
  // Optioneel: door de client gebruikte velden (nog niet door de API geleverd).
  title?: string;
  studosetId?: string | null;
  visualsetId?: string | null;
  courseLink?: string | null;
  summaryLink?: string | null;
}

export interface CourseTable {
  id: string;
  courseId: string;
  title: string;
  createdAt: string | null;
  updatedAt: string | null;
  rows: CourseRow[];
}

// --- Samengestelde responses ---

/** Course met effectieve (board-fallback) academische velden. */
export interface CourseResponse extends Course {
  addedByDisplayName?: string;
  totalRows?: number;
  totalLength?: number;
  totalDone?: number;
  totalInProgress?: number;
  lessonDays?: string | null;
}

/** Volledige course incl. de (ene) planning-tabel, sets, documenten. */
export interface FullCourseResponse extends CourseResponse {
  table: CourseTable | null; // max één tabel per course
  sets: CourseSet[];
  documents: CourseDocument[];
  members: CourseMember[];
}

export interface CoursesResponse {
  courses: CourseResponse[];
}

// --- Create / update payloads ---

export interface CreateCourse {
  boardId?: string | null;
  title: string;
  icon?: string;
  publicCourse?: boolean;
  academyYear?: number;
  examDate?: string;
  institute?: string;
  description?: string;
  resource?: string;
  lessonDays?: string;
}

export type UpdateCourse = Partial<CreateCourse>;

export interface CreateCourseRow {
  tableId?: string;
  courseId?: string;
  rowIndex?: number;
  orderIndex?: number;
  title?: string;
  type?: RowType;
  status?: RowStatus;
  priority?: RowPriority;
  description?: string;
  dueDate?: string;
  studosetId?: string;
  visualsetId?: string;
}

export type UpdateCourseRow = Partial<Omit<CreateCourseRow, "tableId">>;
