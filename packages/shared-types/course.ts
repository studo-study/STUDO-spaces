import type { StudysetResponse } from "./studyset";
import type { VisualsetResponse } from "./visualset";

export type CourseRole = "owner" | "editor" | "viewer";
export type SetType = "studoset" | "visualset";
export type WidgetType = "progress" | "urgent" | "sets" | "files" | "notes";
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

// --- Entiteiten ---

export interface Course {
  id: string;
  boardId: string | null; // null = standalone
  title: string;
  description: string | null;
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
  config: Record<string, unknown> | unknown;
  createdAt: string;
  updatedAt: string;
}

/** One widget as sent by the client when persisting a course's layout. */
export interface CourseWidgetInput {
  type: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  config?: Record<string, unknown>;
}

/** PUT body for `courses/:id/widgets` — replaces the whole layout. */
export interface UpdateCourseWidgets {
  widgets: CourseWidgetInput[];
}

export interface CourseDocument {
  id: string;
  courseId: string;
  uploaderId: string;
  title: string;
  author?: string | null;
  publishingDate?: string | null;
  createdAt: Date;
  updatedAt: Date;
  pageCount?: number | null;
  wordCount?: number | null;
  status: string;
  storageKey: string;
  mimeType: string;
  fileSize?: number | null;
  checksum?: number | null;
  documentTag: string;
  lastOpened: Date;
}

export interface CourseDocumentChunk {
  id: string;
  documentId: string;
  pageStart: number | null;
  pageEnd: number | null;
  chunkIndex: number;
  text: string;
  createdAt: Date | null;
  updatedAt: Date | null;
}

export interface FullCourseDocument extends CourseDocument {
  url: string;
  chunks: CourseDocumentChunk[] | undefined | null;
}

/** Volledige set-data zoals gekoppeld aan een course (join course_sets). */
export interface CourseStudyset extends StudysetResponse {
  setType: "studoset";
  addedBy: string;
}

export interface CourseVisualset extends VisualsetResponse {
  setType: "visualset";
  addedBy: string;
}

export type CourseSetItem = CourseStudyset | CourseVisualset;

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
  createdAt: string | null;
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
  description: string | null;
  courseId: string;
  title: string;
  createdAt: string | null;
  updatedAt: string | null;
  rows: CourseRow[];
}

export interface UpdateCourseTable {
  title?: string;
  description?: string;
  rows?: UpdateCourseRow[];
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
  sets: CourseSetItem[];
  documents: CourseDocument[];
  members: CourseMember[];
  widgets?: CourseWidget[];
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

export interface CreateCourseResource {
  id?: string;
  link: string;
}

export interface CreateCourseRow {
  id?: string;
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
  resources?: CreateCourseResource[];
}

export type UpdateCourseRow = Partial<Omit<CreateCourseRow, "tableId">>;

interface UploadDocs {
  courseId: string;
  files: File[];
}

export default UploadDocs;
