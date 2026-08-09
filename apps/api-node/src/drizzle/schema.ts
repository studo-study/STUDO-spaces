import {
  pgTable,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  serial,
  index,
  jsonb,
  timestamp,
  text,
  primaryKey,
  uuid,
  date,
  vector,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import {
  courseDocumentStatusEnum,
  courseRolesEnum,
  rowStatusEnum,
  rowTypeEnum,
  rowPriorityEnum,
  setTypeEnum,
  widgetTypeEnum,
  documentTagsEnum,
  OnlineStatusEnum,
  AccountStatusEnum,
  AppThemeEnum,
} from './enums';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    imgUrl: varchar('img_url', { length: 250 }).notNull(),
    joinDate: timestamp('join_date').notNull(),
    joinNumber: serial('join_number').notNull().unique(),
    totalSets: integer('total_sets').notNull(),
    streakStarted: timestamp('streak_started'),
    streakCount: integer('streak_count'),
    streakLastUpdate: timestamp('streak_last_update'),
    lastLogin: timestamp('last_login').notNull(),
    lastOnline: timestamp('last_online'),
    roles: jsonb('roles').notNull(),
    publicRole: varchar('public_role', { length: 24 }).notNull(),
    verified: boolean('verified').notNull(),
    banned: boolean('banned').notNull(),
  },
  (table) => [uniqueIndex('idx_user_email_unique').on(table.email)],
);

export const settings = pgTable(
  'settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' })
      .notNull(),
    devMode: boolean('dev_mode').default(false).notNull(),
    debugMode: boolean('debug_mode').default(false).notNull(),
    showReprocessing: boolean('show_reprocessing').default(false).notNull(),

    visibleStreak: boolean('visible_streak').default(true).notNull(),
    allSetsPrivate: boolean('all_sets_private').default(false).notNull(),
    shareGroupProgress: boolean('share_group_progress').default(true).notNull(),
    allowGroupInvites: boolean('allow_group_invites').default(true).notNull(),
    autoGroupParticipation: boolean('auto_group_participation')
      .default(true)
      .notNull(),
    experimentalGroupFeatures: boolean('experimental_group_features')
      .default(false)
      .notNull(),
    theme: AppThemeEnum('theme').default('system').notNull(),
    emailNotifications: boolean('email_notifications').default(true).notNull(),
    inAppNotifications: boolean('in_app_notifications').default(true).notNull(),
    progressNotifications: boolean('progress_notifications')
      .default(false)
      .notNull(),
    streakReminders: boolean('streak_reminders').default(true).notNull(),
    groupNotifications: boolean('group_notifications').default(true).notNull(),
    accountStatus: AccountStatusEnum('account_status')
      .default('all_good')
      .notNull(),
    onlineStatus: OnlineStatusEnum('online_status').default('active').notNull(),
  },
  (table) => [uniqueIndex('idx_user_settings').on(table.userId)],
);

export const profiles = pgTable(
  'profiles',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .primaryKey(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    imgUrl: varchar('img_url', { length: 250 }).notNull(),
    bannerUrl: varchar('banner_url', { length: 250 }),
    joinDate: timestamp('join_date').notNull(),
    joinNumber: serial('join_number').notNull().unique(),
    streak: integer('streak').notNull(),
    verified: boolean('verified').notNull(),
    tags: varchar('tags').array().notNull(),
  },
  (table) => [
    index('profiles_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.displayName}
      )`,
    ),
  ],
);

export const studoprofiles = pgTable(
  'studoprofiles',
  {
    id: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .primaryKey(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    imgUrl: varchar('img_url', { length: 250 }).notNull(),
    bannerUrl: varchar('banner_url', { length: 250 }).notNull(),
    tags: varchar('tags').array().notNull(),
  },
  (table) => [
    index('studoprofiles_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.displayName}
      )`,
    ),
  ],
);

export const studotracks = pgTable(
  'studotracks',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    studoprofileId: uuid('studoprofile_id')
      .references(() => studoprofiles.id, { onDelete: 'cascade' })
      .notNull(),
    trackName: varchar('displayname', { length: 100 }).notNull(),
    iconName: varchar('icon_name', { length: 50 }).notNull(),
    grade: varchar('grade', { length: 50 }).notNull(),
  },
  (table) => [
    index('studotracks_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.trackName}
      )`,
    ),
  ],
);

export const studysets = pgTable(
  'studysets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    studoset: boolean(`studoset`).notNull(),
    globalTermLanguage: varchar('global_term_language', {
      length: 2,
    }).notNull(),
    globalDefinitionLanguage: varchar('global_definition_language', {
      length: 2,
    }).notNull(),
    createdAt: varchar('created_at', { length: 24 }).notNull(),
    lastUpdated: varchar('last_updated', { length: 24 }).notNull(),
    publicSet: boolean('publicSet').notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    imgUrl: varchar('img_url', { length: 250 }).notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    generated: boolean('generated').notNull().default(false),
  },
  (table) => [
    index('studysets_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      )`,
    ),
  ],
);

export const visualsets = pgTable(
  'visualsets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 200 }).notNull(),
    studoset: boolean(`studoset`).notNull(),
    createdAt: varchar('created_at', { length: 24 }).notNull(),
    lastUpdated: varchar('last_updated', { length: 24 }).notNull(),
    publicSet: boolean('publicSet').notNull(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    imgUrl: varchar('img_url', { length: 250 }).notNull(),
  },
  (table) => [
    index('visualsets_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      )`,
    ),
  ],
);

export const images = pgTable(
  'images',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 100 }).notNull(),
    index: integer('index').notNull(),
    url: varchar('url', { length: 250 }).notNull(),
    gridX: integer('grid_x').notNull(),
    gridY: integer('grid_y').notNull(),
    scale: varchar('scale', { length: 64 }).notNull(),
    setId: uuid('set_id')
      .references(() => visualsets.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    index('visualsets_images_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      )`,
    ),
  ],
);

export const pins = pgTable('pins', {
  id: uuid('id').primaryKey().defaultRandom(),
  definition: varchar('definition', { length: 128 }).notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  number: integer('number').notNull(),
  createdAt: varchar('created_at', { length: 24 }).notNull(),
  updatedAt: varchar('updated_at', { length: 24 }).notNull(),
  imageId: uuid('image_id')
    .references(() => images.id, { onDelete: 'cascade' })
    .notNull(),
  setId: uuid('set_id')
    .references(() => visualsets.id, { onDelete: 'cascade' })
    .notNull(),
  ownerId: uuid('owner_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const cards = pgTable('cards', {
  id: uuid('id').primaryKey().defaultRandom(),
  term: varchar('term', { length: 512 }).notNull(),
  definition: varchar('definition', { length: 512 }).notNull(),
  number: integer('number').notNull(),
  createdAt: varchar('created_at', { length: 24 }).notNull(),
  updatedAt: varchar('updated_at', { length: 24 }).notNull(),
  setId: uuid('set_id')
    .references(() => studysets.id, { onDelete: 'cascade' })
    .notNull(),
  ownerId: uuid('owner_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  termContentType: varchar('term_content_type', { length: 8 })
    .notNull()
    .default('text'),
  codeLanguage: varchar('code_language', { length: 32 })
    .notNull()
    .default('typescript'),
  suggestionImageId: uuid('suggestion_image_id'),
  courseDocumentChunkId: uuid('course_document_chunk_id').references(
    () => courseDocumentChunks.id,
    { onUpdate: 'cascade' },
  ),
});

export const setlikes = pgTable('setlikes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  setId: uuid('set_id').notNull(),
  setType: varchar('set_type', { length: 20 }).notNull(),
  createdAt: varchar('created_at', { length: 24 }).notNull(),
});

export const studysessions = pgTable(
  'studysessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    setId: uuid('set_id').notNull(),
    setType: varchar('set_type', { length: 30 }).notNull(),
    startedAt: varchar('started_at', { length: 24 }).notNull(),
    durationMin: integer('duration_min').notNull(),
    endedAt: varchar('ended_at', { length: 24 }).notNull(),
    index: integer('set_index').notNull(),
    accuracy: integer('accuracy').notNull(),
    averageResponseTime: integer('average_response_time').notNull(),
    longestFocusStreak: integer('longest_focus_streak').notNull(),
    totalAttempts: integer('total_attempts').notNull().default(0),
    totalCorrect: integer('total_correct').notNull().default(0),
    completions: integer('completions').notNull().default(0),
    lastSeen: varchar('last_seen', { length: 64 }).notNull(),
    lastStudied: varchar('last_studied').notNull(),
  },
  (table) => [
    uniqueIndex('idx_studysessions_users_unique').on(table.userId, table.setId),
  ],
);

export const sessioncards = pgTable(
  'sessioncards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    number: integer('number').notNull(),
    cardViewcount: integer('card_viewcount').notNull(),
    cardTotalViewcount: integer('card_total_viewcount').notNull(),
    inQueue: boolean('inQueue').notNull(),
    mastered: boolean('mastered').notNull(),
    timesRelearned: integer('times_relearned').notNull(),
    totalAttempts: integer('total_attempts').notNull().default(0),
    totalCorrect: integer('total_correct').notNull().default(0),
    responseSumMs: integer('response_sum_ms').notNull().default(0),
    flagged: boolean('flagged').notNull().default(false),
    cardId: uuid('card_id')
      .references(() => cards.id, { onDelete: 'cascade' })
      .notNull(),
    sessionId: uuid('session_id')
      .references(() => studysessions.id, { onDelete: 'cascade' })
      .notNull(),
    ownerId: uuid('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    index('sessioncards_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.sessionId}
      )`,
    ),
  ],
);

export const sessionpins = pgTable(
  'sessionpins',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    number: integer('number').notNull(),
    pinViewcount: integer('pin_viewcount').notNull(),
    pinTotalViewcount: integer('pin_total_viewcount').notNull(),
    inQueue: boolean('inQueue').notNull(),
    mastered: boolean('mastered').notNull(),
    timesRelearned: integer('times_relearned').notNull(),
    flagged: boolean('flagged').notNull().default(false),
    totalAttempts: integer('total_attempts').notNull().default(0),
    totalCorrect: integer('total_correct').notNull().default(0),
    pinId: uuid('pin_id')
      .references(() => pins.id, { onDelete: 'cascade' }) // ✅ CHANGED: consistent gedrag
      .notNull(),
    sessionId: uuid('session_id')
      .references(() => studysessions.id, { onDelete: 'cascade' })
      .notNull(),
    ownerId: uuid('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    index('sessionpins_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.sessionId}
      )`,
    ),
  ],
);

export const classrooms = pgTable(
  'classrooms',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 64 }).notNull(),
    ownerId: uuid('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: varchar('type', { length: 40 }).notNull(),
    createdAt: varchar('created_at', { length: 24 }).notNull(),
    verified: boolean('verified').notNull(),
    school: varchar('school', { length: 50 }).notNull(),
  },
  (table) => [
    index('classrooms_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.name}
      )`,
    ),
  ],
);

export const classroomusers = pgTable(
  'classroomusers',
  {
    userId: uuid('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    classroomId: uuid('classroom_id')
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
    role: varchar('role', { length: 7 }).notNull(),
    joinedAt: varchar('joined_at', { length: 24 }).notNull(),
    position: integer('position').notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.classroomId] }),
  }),
);

export const classroomsets = pgTable(
  'classroomsets',
  {
    setId: uuid('set_id').notNull(),
    setType: varchar('set_type', { length: 20 }).notNull(),
    addedBy: varchar('added_by', { length: 100 }).notNull(),
    classroomId: uuid('classroom_id')
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.setId, t.classroomId] }),
  }),
);

export const classroomactivities = pgTable('classroomactivity', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  classroomId: uuid('classroom_id')
    .references(() => classrooms.id, { onDelete: 'cascade' })
    .notNull(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  displayName: varchar('displayName', { length: 64 }).notNull(),
  imgUrl: varchar('img_url', { length: 250 }).notNull(),
  lastSeen: varchar('last_seen', { length: 64 }).notNull(),
  setId: uuid('set_id').notNull(),
  setType: varchar('set_type', { length: 24 }).notNull(),
  title: varchar('title', { length: 64 }).notNull(),
});

export const tracksets = pgTable(
  'tracksets',
  {
    setId: uuid('id').primaryKey().defaultRandom().notNull(),
    setType: varchar('set_type', { length: 20 }).notNull(),
    trackId: uuid('track_id')
      .references(() => studotracks.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_tracksets_unique').on(table.setId, table.trackId),
  ],
);

export const studoprofilecommunities = pgTable(
  'studoprofilecommunities',
  {
    classroomId: uuid('classroom_id')
      .references(() => classrooms.id, { onDelete: 'cascade' }) // FK naar classrooms
      .notNull(),
    classType: varchar('class_type', { length: 20 }).notNull(),
    studoprofileId: uuid('studoprofile_id')
      .references(() => studoprofiles.id, { onDelete: 'cascade' }) // FK naar studoprofiles
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.classroomId, t.studoprofileId] }),
  }),
);

export const popular_sets = pgTable('popular_sets', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  studysetId: uuid('studyset_id').references(() => studysets.id),
  visualsetId: uuid('visualset_id').references(() => visualsets.id),
  rank: integer('rank').notNull(),
  snapshotId: integer('snapshot_id').notNull(),
});

export const reports = pgTable('reports', {
  reportId: uuid('report_id').primaryKey(),
  filledBy: uuid('filled_by')
    .notNull()
    .references(() => users.id),
  reportType: varchar('report_type', { length: 50 }).notNull(),
  description: text('description'),
  targetId: uuid('target_id').notNull(),
  targetType: varchar('target_type', { length: 20 }).notNull(),
  reportedUserId: uuid('reported_user_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('to_do').notNull(),
  priority: varchar('priority').default('no_priority').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  moderatorNote: text('moderator_note'),
  assigneeId: uuid('assignee_id').references(() => users.id),
  assigneeDisplayName: varchar('assignee_displayName'),
  number: integer('number').notNull(),
});

export const suggestion_images = pgTable('suggestion_images', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  pexelsId: varchar('pexels_id').notNull().unique(),
  displayUrl: varchar('display_url').notNull(),
  source: varchar('source').notNull().default('pexels'),
  photographer: varchar('photographer').notNull(),
  sourcePageUrl: varchar('source_page_url').notNull(),
});

export const suggestion_terms_cards = pgTable(
  'suggestion_terms_cards',
  {
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    imageId: uuid('image_id')
      .notNull()
      .references(() => suggestion_images.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    selectedCount: integer('selected_count').notNull().default(1),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cardId, t.imageId] }),
  }),
);

export const chat = pgTable(
  'chat',

  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    title: varchar('title').notNull(),
    creationDate: varchar('creation_date').notNull(),
    pinned: boolean('pinned').notNull().default(false),
  },
  (table) => [
    index('chat_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.id}
      )`,
    ),
    index('user_id_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.userId}
      )`,
    ),
    index('chat_title_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      )`,
    ),
  ],
);

export const chatMessage = pgTable(
  'chat_message',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    chatId: uuid('chat_id')
      .notNull()
      .references(() => chat.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    svenMessage: boolean('sven_message').notNull(),
    sortIndex: integer('sort_index').notNull(),
    content: varchar('content', { length: 1000 }).notNull(),
    createdAt: varchar('created_at').notNull(),
  },
  (table) => [
    index('message_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.id}
      )`,
    ),
    index('chat_id_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.chatId}
      )`,
    ),
  ],
);

export const chatMessagePayload = pgTable(
  'chat_message_payload',
  {
    id: uuid('id').primaryKey().defaultRandom().notNull(),
    messageId: uuid('message_id')
      .notNull()
      .references(() => chatMessage.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    title: varchar('title').notNull().default('payload'),
    studosetId: uuid('studoset_id').references(() => studysets.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    cardId: uuid('card_id').references(() => cards.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    }),
  },
  (table) => [
    index('payload_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.id}
      )`,
    ),
    index('message_id_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.messageId}
      )`,
    ),
  ],
);

export const courses = pgTable('course', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  // null = standalone course; anders erft het board-brede instellingen.
  boardId: uuid('board_id').references(() => boards.id, {
    onDelete: 'set null',
    onUpdate: 'cascade',
  }),
  title: varchar('title').notNull(),
  description: varchar('description'),
  icon: varchar('icon').notNull().default(''),
  publicCourse: boolean('public_course').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
  academyYear: integer('academy_year'),
  examDate: date('exam_date'),
  institute: varchar('institute'),
});

export const courseContext = pgTable('course_context', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  courseId: uuid('course_id').references(() => courses.id, {
    onDelete: 'cascade',
    onUpdate: 'cascade',
  }),
  model: varchar('model'),
  documentCount: varchar('document_count'),
  context: text('context'),
});

export const courseUsers = pgTable(
  'course_users',
  {
    userId: uuid('user_id')
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    courseId: uuid('course_id')
      .references(() => courses.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    role: courseRolesEnum('role').notNull().default('viewer'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.courseId] }),
  }),
);

export const courseWorkspaces = pgTable('course_workspaces', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  courseId: uuid('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
});

export const courseWidgets = pgTable('course_widgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  workspaceId: uuid('workspace_id')
    .references(() => courseWorkspaces.id, { onDelete: 'cascade' })
    .notNull(),
  type: widgetTypeEnum('type').notNull(),
  x: integer('x').notNull().default(0),
  y: integer('y').notNull().default(0),
  w: integer('w').notNull().default(1),
  h: integer('h').notNull().default(1),
  config: jsonb('config')
    .notNull()
    .default(sql`'{}'::jsonb`),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const courseDocuments = pgTable('course_documents', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  courseId: uuid('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  uploaderId: uuid('uploader_id')
    .references(() => users.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  title: varchar('title').notNull(),
  author: varchar('author'),
  publishingDate: date('publishing_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  pageCount: integer('page_count'),
  documentTag: documentTagsEnum('document_tag').default('document').notNull(),
  wordCount: integer('word_count'),
  status: courseDocumentStatusEnum('status').default('uploading').notNull(),
  storageKey: varchar('storage_key').notNull(),
  mimeType: varchar('mime_type').notNull().default('pdf'),
  fileSize: integer('file_size'),
  checksum: integer('checksum'),
  lastOpened: timestamp('last_opened')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const courseDocumentChunks = pgTable('course_document_chunks', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  documentId: uuid('document_id')
    .references(() => courseDocuments.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull(),
  pageStart: integer('page_start'),
  pageEnd: integer('page_end'),
  chunkIndex: integer('chunk_index').notNull(),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
  embeddingModel: varchar('embedding_model'),
  embedding: vector('embedding', { dimensions: 1536 }),
});

export const courseSets = pgTable(
  'course_sets',
  {
    // polymorf: set_id verwijst naar studysets OF visualsets (zie set_type) —
    // geen harde FK mogelijk naar één tabel.
    setId: uuid('set_id').notNull(),
    setType: setTypeEnum('set_type').notNull(),
    addedBy: uuid('added_by')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    courseId: uuid('course_id')
      .references(() => courses.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.setId, t.courseId] }),
  }),
);

export const courseTables = pgTable('course_tables', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  courseId: uuid('course_id')
    .references(() => courses.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    })
    .notNull()
    .unique(),
  title: varchar('title').notNull(),
  description: varchar('description'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const courseRows = pgTable('course_rows', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  tableId: uuid('table_id')
    .references(() => courseTables.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    })
    .notNull(),
  rowIndex: integer('row_index').notNull(),
  createdBy: uuid('created_by').references(() => users.id, {
    onDelete: 'set null',
  }),
  title: varchar('title'),
  status: rowStatusEnum('status').default('not_started'),
  priority: rowPriorityEnum('priority').default('no_priority'),
  description: text('description'),
  type: rowTypeEnum('type').default('task'),
  dueDate: date('due_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const courseResources = pgTable('course_resources', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  rowId: uuid('row_id')
    .references(() => courseRows.id, {
      onUpdate: 'cascade',
      onDelete: 'cascade',
    })
    .notNull(),
  link: varchar('link').notNull(),
});

export const boards = pgTable('boards', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  title: varchar('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date()),
  icon: varchar('icon').notNull().default(''),
  publicBoard: boolean('public_board').default(false),
  academyYear: integer('academy_year'),
  examDate: date('exam_date'),
  institute: varchar('institute'),
});

export const boardUsers = pgTable(
  'board_users',
  {
    boardId: uuid('board_id')
      .references(() => boards.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    userId: uuid('user_id')
      .references(() => users.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      })
      .notNull(),
    role: courseRolesEnum('role').notNull().default('viewer'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.boardId, t.userId] }),
  }),
);
