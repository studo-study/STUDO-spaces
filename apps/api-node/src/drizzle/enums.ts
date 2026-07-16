import { pgEnum } from 'drizzle-orm/pg-core';

export const courseRolesEnum = pgEnum('course_roles', [
  'owner',
  'editor',
  'viewer',
]);

export const courseDocumentStatusEnum = pgEnum('course_document_status', [
  'uploading',
  'processing',
  'finished',
  'failed',
]);

export const setTypeEnum = pgEnum('set_type', ['studoset', 'visualset']);

export const widgetTypeEnum = pgEnum('widget_type', [
  'notes',
  'flashcards',
  'document',
  'set',
  'todo',
  'timer',
  'calendar',
]);

export const mimeTypeEnum = pgEnum('mime_type', ['pdf', 'docx']);

export const rowStatusEnum = pgEnum('row_status', [
  'not_started',
  'doing',
  'done',
]);

export const rowTypeEnum = pgEnum('row_type', [
  'course',
  'notes',
  'summary',
  'abstract',
  'sample_exam',
  'task',
  'set',
]);

export const rowPriorityEnum = pgEnum('row_priority', [
  'no_priority',
  'low',
  'medium',
  'high',
]);
