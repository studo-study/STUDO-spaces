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

export const documentTagsEnum = pgEnum('document_tag', [
  'overview',
  'course',
  'notes',
  'summary',
  'exercises',
  'exam',
  'slides',
  'lab',
  'assignment',
  'cheatsheet',
  'document',
]);

export type documentTag = typeof documentTagsEnum.enumValues;

export const OnlineStatusEnum = pgEnum('online_status', [
  'active',
  'away',
  'dnd',
]);
export type OnlineStatus = typeof OnlineStatusEnum.enumValues;

export const AccountStatusEnum = pgEnum('account_status', [
  'all_good',
  'limited',
  'very_limited',
  'at_risk',
  'banned',
  'perma_banned',
]);
export type AccountStatus = typeof AccountStatusEnum.enumValues;

export const AppThemeEnum = pgEnum('app_theme', ['light', 'dark', 'system']);
export type AppTheme = typeof AppThemeEnum.enumValues;
