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
