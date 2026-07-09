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
  pgEnum,
  primaryKey,
  foreignKey,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
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
    roles: jsonb('roles').notNull(),
    publicRole: varchar('public_role', { length: 24 }).notNull(),
    verified: boolean('verified').notNull(),
    banned: boolean('banned').notNull(),
  },
  (table) => [uniqueIndex('idx_user_email_unique').on(table.email)],
);

export const profiles = pgTable(
  'profiles',
  {
    userId: varchar('user_id', { length: 64 })
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
    id: varchar('user_id', { length: 64 })
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
    id: varchar('id', { length: 64 }).notNull().primaryKey(),
    studoprofileId: varchar('studoprofile_id', { length: 64 })
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
    id: varchar('id', { length: 64 }).primaryKey(),
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
    userId: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
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
    id: varchar('id', { length: 64 }).primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    studoset: boolean(`studoset`).notNull(),
    createdAt: varchar('created_at', { length: 24 }).notNull(),
    lastUpdated: varchar('last_updated', { length: 24 }).notNull(),
    publicSet: boolean('publicSet').notNull(),
    userId: varchar('user_id', { length: 64 })
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
    id: varchar('id', { length: 64 }).primaryKey(),
    title: varchar('title', { length: 100 }).notNull(),
    index: integer('index').notNull(),
    url: varchar('url', { length: 250 }).notNull(),
    gridX: integer('grid_x').notNull(),
    gridY: integer('grid_y').notNull(),
    scale: varchar('scale', { length: 64 }).notNull(),
    setId: varchar('set_id', { length: 64 })
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
  id: varchar('id', { length: 64 }).primaryKey(),
  definition: varchar('definition', { length: 128 }).notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  number: integer('number').notNull(),
  createdAt: varchar('created_at', { length: 24 }).notNull(),
  updatedAt: varchar('updated_at', { length: 24 }).notNull(),
  imageId: varchar('image_id', { length: 64 })
    .references(() => images.id, { onDelete: 'cascade' })
    .notNull(),
  setId: varchar('set_id', { length: 64 })
    .references(() => visualsets.id, { onDelete: 'cascade' })
    .notNull(),
  ownerId: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const cards = pgTable('cards', {
  id: varchar('id', { length: 64 }).primaryKey(),
  term: varchar('term', { length: 512 }).notNull(),
  definition: varchar('definition', { length: 512 }).notNull(),
  number: integer('number').notNull(),
  createdAt: varchar('created_at', { length: 24 }).notNull(),
  updatedAt: varchar('updated_at', { length: 24 }).notNull(),
  setId: varchar('set_id', { length: 64 })
    .references(() => studysets.id, { onDelete: 'cascade' })
    .notNull(),
  ownerId: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  termContentType: varchar('term_content_type', { length: 8 })
    .notNull()
    .default('text'),
  codeLanguage: varchar('code_language', { length: 32 })
    .notNull()
    .default('typescript'),
  suggestionImageId: varchar('suggestion_image_id', { length: 64 }),
});

export const setlikes = pgTable('setlikes', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: varchar('user_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  setId: varchar('set_id', { length: 64 }).notNull(),
  setType: varchar('set_type', { length: 20 }).notNull(),
  createdAt: varchar('created_at', { length: 24 }).notNull(),
});

export const studysessions = pgTable(
  'studysessions',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    userId: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    setId: varchar('set_id', { length: 64 }).notNull(),
    setType: varchar('set_type', { length: 30 }).notNull(),
    startedAt: varchar('started_at', { length: 24 }).notNull(),
    durationMin: integer('duration_min').notNull(),
    endedAt: varchar('ended_at', { length: 24 }).notNull(),
    index: integer('set_index').notNull(),
    accuracy: integer('accuracy').notNull(),
    averageResponseTime: integer('average_response_time').notNull(),
    longestFocusStreak: integer('longest_focus_streak').notNull(),
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
    id: varchar('id', { length: 64 }).primaryKey(),
    number: integer('number').notNull(),
    cardViewcount: integer('card_viewcount').notNull(),
    cardTotalViewcount: integer('card_total_viewcount').notNull(),
    inQueue: boolean('inQueue').notNull(),
    mastered: boolean('mastered').notNull(),
    timesRelearned: integer('times_relearned').notNull(),
    cardId: varchar('card_id', { length: 64 })
      .references(() => cards.id, { onDelete: 'cascade' })
      .notNull(),
    sessionId: varchar('session_id', { length: 64 })
      .references(() => studysessions.id, { onDelete: 'cascade' })
      .notNull(),
    ownerId: varchar('owner_id', { length: 64 })
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
    id: varchar('id', { length: 64 }).primaryKey(),
    number: integer('number').notNull(),
    pinViewcount: integer('pin_viewcount').notNull(),
    pinTotalViewcount: integer('pin_total_viewcount').notNull(),
    inQueue: boolean('inQueue').notNull(),
    mastered: boolean('mastered').notNull(),
    timesRelearned: integer('times_relearned').notNull(),
    pinId: varchar('pin_id', { length: 64 })
      .references(() => pins.id, { onDelete: 'cascade' }) // ✅ CHANGED: consistent gedrag
      .notNull(),
    sessionId: varchar('session_id', { length: 64 })
      .references(() => studysessions.id, { onDelete: 'cascade' })
      .notNull(),
    ownerId: varchar('owner_id', { length: 64 })
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
    id: varchar('id', { length: 64 }).primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    ownerId: varchar('owner_id', { length: 64 })
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
    userId: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    classroomId: varchar('classroom_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
    role: varchar('role', { length: 7 }).notNull(),
    joinedAt: varchar('joined_at', { length: 24 }).notNull(),
    position: integer('position').notNull(),
  },
  (table) => [
    uniqueIndex('idx_user_classroom_unique').on(
      table.userId,
      table.classroomId,
    ),
  ],
);

export const classroomsets = pgTable(
  'classroomsets',
  {
    setId: varchar('set_id', { length: 64 }).notNull(),
    setType: varchar('set_type', { length: 20 }).notNull(),
    addedBy: varchar('added_by', { length: 100 }).notNull(),
    classroomId: varchar('classroom_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_classroom_unique').on(table.setId, table.classroomId),
  ],
);

export const classroomactivities = pgTable('classroomactivity', {
  id: varchar('id', { length: 64 }).primaryKey(),
  classroomId: varchar('classroom_id', { length: 64 })
    .references(() => classrooms.id, { onDelete: 'cascade' })
    .notNull(),
  userId: varchar('user_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  displayName: varchar('displayName', { length: 64 }).notNull(),
  imgUrl: varchar('img_url', { length: 250 }).notNull(),
  lastSeen: varchar('last_seen', { length: 64 }).notNull(),
  setId: varchar('set_id', { length: 64 }).notNull(),
  setType: varchar('set_type', { length: 24 }).notNull(),
  title: varchar('title', { length: 64 }).notNull(),
});

export const tracksets = pgTable(
  'tracksets',
  {
    setId: varchar('set_id', { length: 64 }).notNull(),
    setType: varchar('set_type', { length: 20 }).notNull(),
    trackId: varchar('track_id', { length: 64 })
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
    classroomId: varchar('classroom_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' }) // FK naar classrooms
      .notNull(),
    classType: varchar('class_type', { length: 20 }).notNull(),
    studoprofileId: varchar('studoprofile_id', { length: 64 })
      .references(() => studoprofiles.id, { onDelete: 'cascade' }) // FK naar studoprofiles
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_trackcommunities_unique').on(
      table.classroomId,
      table.studoprofileId,
    ),
  ],
);

export const popular_sets = pgTable('popular_sets', {
  id: varchar('id', { length: 64 }).primaryKey().notNull(),
  studysetId: varchar('studyset_id').references(() => studysets.id),
  visualsetId: varchar('visualset_id').references(() => visualsets.id),
  rank: integer('rank').notNull(),
  snapshotId: integer('snapshot_id').notNull(),
});

export const reports = pgTable('reports', {
  reportId: varchar('report_id').primaryKey(),
  filledBy: varchar('filled_by')
    .notNull()
    .references(() => users.id),
  reportType: varchar('report_type', { length: 50 }).notNull(),
  description: text('description'),
  targetId: varchar('target_id').notNull(),
  targetType: varchar('target_type', { length: 20 }).notNull(),
  reportedUserId: varchar('reported_user_id').references(() => users.id),
  status: varchar('status', { length: 20 }).default('to_do').notNull(),
  priority: varchar('priority').default('no_priority').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  reviewedBy: varchar('reviewed_by').references(() => users.id),
  moderatorNote: text('moderator_note'),
  assigneeId: varchar('assignee_id').references(() => users.id),
  assigneeDisplayName: varchar('assignee_displayName'),
  number: integer('number').notNull(),
});

export const flowboards = pgTable(
  'flowboards',
  {
    id: varchar('board_id').primaryKey(),
    ownerId: varchar('owner_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    title: varchar('title').notNull(),
    icon: varchar('icon').default('flowboard_icon').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    year: varchar('year'),
    semester: varchar('semester'),
    schoolName: varchar('school_name'),
    schoolId: varchar('school_id'),
  },
  (table) => [
    index('flowboards_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.id}
      )`,
    ),
    index('flowboard_title_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      )`,
    ),
  ],
);

export const flowcourses = pgTable(
  'flowcourses',
  {
    id: varchar('flowcourse_id').primaryKey(),
    boardId: varchar('board_id').references(() => flowboards.id, {
      onDelete: 'cascade',
    }),
    addedBy: varchar('added_by')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    title: varchar('title').notNull(),
    icon: varchar('icon').default('flowcourse_icon').notNull(),
    description: text('description'),
    resource: varchar('resource'),
    examDate: varchar('exam_date'),
    lessonDays: varchar('lesson_days'),
  },
  (table) => [
    index('flowcourses_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.id}
      )`,
    ),
    index('board_id_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.boardId}
      )`,
    ),
    index('flow_course_title_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      )`,
    ),
  ],
);

export const flowcourse_sets = pgTable('flowcourse_sets', {
  id: varchar('id').primaryKey(),
  setId: varchar('set_id')
    .references(() => studysets.id || visualsets.id, { onDelete: 'cascade' })
    .notNull(),
  courseId: varchar('course_id')
    .references(() => flowcourses.id)
    .notNull(),
});

export const statusEnum = pgEnum('status', ['not_started', 'doing', 'done']);

export const priorityEnum = pgEnum('priority', [
  'no_priority',
  'low',
  'medium',
  'high',
]);

export const rowTypeEnum = pgEnum('rowType', [
  'lesson',
  'practice',
  'study',
  'exam',
  'summary',
  'task',
]);

export const flowrows = pgTable('flowrows', {
  id: varchar('flowrow_id').primaryKey(),
  flowcourseId: varchar('flowcourse_id')
    .references(() => flowcourses.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title').notNull(),
  orderIndex: integer('order_index'),
  description: text('description'),
  type: rowTypeEnum('type').default('task'),
  priority: priorityEnum('priority').default('no_priority'),
  status: statusEnum('status').default('not_started').notNull(),
  estimatedTime: integer('estimated_time'),
  difficulty: integer('difficulty'),
  isRequired: boolean('is_required').default(true),
  dueDate: timestamp('due_date'),
  studoset: varchar('studoset').references(() => studysets.id),
  visualset: varchar('visualset').references(() => visualsets.id),
});

export const resourceTypeEnum = pgEnum('resourceType', [
  'course',
  'notes',
  'summary',
  'abstract',
  'sample_exam',
  'task',
]);

export const flowresources = pgTable('flowresources', {
  flowresourceId: varchar('flowresource_id').primaryKey(),
  rowId: varchar('row_id')
    .references(() => flowrows.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title').notNull(),
  link: varchar('link').notNull(),
  linkType: varchar('link_type'),
  resourceType: resourceTypeEnum('resource_type').default('task'),
});

export const suggestion_images = pgTable('suggestion_images', {
  id: varchar('id').primaryKey(),
  pexelsId: varchar('pexels_id').notNull().unique(),
  displayUrl: varchar('display_url').notNull(),
  source: varchar('source').notNull().default('pexels'),
  photographer: varchar('photographer').notNull(),
  sourcePageUrl: varchar('source_page_url').notNull(),
});

export const suggestion_terms_cards = pgTable(
  'suggestion_terms_cards',
  {
    cardId: varchar('card_id')
      .notNull()
      .references(() => cards.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    imageId: varchar('image_id')
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
    id: varchar('id').notNull().primaryKey(),
    userId: varchar('user_id')
      .notNull()
      .references(() => users.id, { onUpdate: 'cascade', onDelete: 'cascade' }),
    boardId: varchar('board_id').references(() => flowboards.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
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
    id: varchar('id').notNull().unique().primaryKey(),
    chatId: varchar('chat_id')
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
    id: varchar('id', { length: 64 }).primaryKey(),
    messageId: varchar('message_id')
      .notNull()
      .references(() => chatMessage.id, {
        onUpdate: 'cascade',
        onDelete: 'cascade',
      }),
    title: varchar('title').notNull().default('payload'),
    flowcourseId: varchar('flowcourse_id').references(() => flowcourses.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    studosetId: varchar('studoset_id').references(() => studysets.id, {
      onDelete: 'cascade',
      onUpdate: 'cascade',
    }),
    cardId: varchar('card_id').references(() => cards.id, {
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

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  studysets: many(studysets),
  visualsets: many(visualsets),
  pins: many(pins),
  cards: many(cards),
  setlikes: many(setlikes),
  studysessions: many(studysessions),
  classroomusers: many(classroomusers),
  classroomactivities: many(classroomactivities),
  sessioncards: many(sessioncards),
  sessionpins: many(sessionpins),
  flowboards: many(flowboards),
  flowcourses: many(flowcourses),
  reports: many(reports),
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id],
  }),
}));

export const studysetsRelations = relations(studysets, ({ one, many }) => ({
  user: one(users, {
    fields: [studysets.userId],
    references: [users.id],
  }),
  cards: many(cards),
}));

export const visualsetsRelations = relations(visualsets, ({ one, many }) => ({
  user: one(users, {
    fields: [visualsets.userId],
    references: [users.id],
  }),
  images: many(images),
  pins: many(pins),
}));

export const imagesRelations = relations(images, ({ one, many }) => ({
  visualset: one(visualsets, {
    fields: [images.setId],
    references: [visualsets.id],
  }),
  pins: many(pins),
}));

export const pinsRelations = relations(pins, ({ one, many }) => ({
  image: one(images, {
    fields: [pins.imageId],
    references: [images.id],
  }),
  visualset: one(visualsets, {
    fields: [pins.setId],
    references: [visualsets.id],
  }),
  owner: one(users, {
    fields: [pins.ownerId],
    references: [users.id],
  }),
  sessionpins: many(sessionpins),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  studyset: one(studysets, {
    fields: [cards.setId],
    references: [studysets.id],
  }),
  owner: one(users, {
    fields: [cards.ownerId],
    references: [users.id],
  }),
  sessioncards: many(sessioncards),
  suggestionImage: one(suggestion_images, {
    fields: [cards.suggestionImageId],
    references: [suggestion_images.id],
  }),
  suggestionTermsCards: many(suggestion_terms_cards),
}));

export const setlikesRelations = relations(setlikes, ({ one }) => ({
  user: one(users, {
    fields: [setlikes.userId],
    references: [users.id],
  }),
}));

export const studysessionsRelations = relations(
  studysessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [studysessions.userId],
      references: [users.id],
    }),
    sessioncards: many(sessioncards),
    sessionpins: many(sessionpins),
  }),
);

export const sessioncardsRelations = relations(sessioncards, ({ one }) => ({
  card: one(cards, {
    fields: [sessioncards.cardId],
    references: [cards.id],
  }),
  session: one(studysessions, {
    fields: [sessioncards.sessionId],
    references: [studysessions.id],
  }),
  owner: one(users, {
    fields: [sessioncards.ownerId],
    references: [users.id],
  }),
}));

export const sessionpinsRelations = relations(sessionpins, ({ one }) => ({
  pin: one(pins, {
    fields: [sessionpins.pinId],
    references: [pins.id],
  }),
  session: one(studysessions, {
    fields: [sessionpins.sessionId],
    references: [studysessions.id],
  }),
  owner: one(users, {
    fields: [sessionpins.ownerId],
    references: [users.id],
  }),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  owner: one(users, {
    fields: [classrooms.ownerId],
    references: [users.id],
  }),
  classroomusers: many(classroomusers),
  classroomsets: many(classroomsets),
  classroomactivities: many(classroomactivities),
  studoprofilecommunities: many(studoprofilecommunities),
}));

export const classroomusersRelations = relations(classroomusers, ({ one }) => ({
  user: one(users, {
    fields: [classroomusers.userId],
    references: [users.id],
  }),
  classroom: one(classrooms, {
    fields: [classroomusers.classroomId],
    references: [classrooms.id],
  }),
}));

export const classroomsetsRelations = relations(classroomsets, ({ one }) => ({
  classroom: one(classrooms, {
    fields: [classroomsets.classroomId],
    references: [classrooms.id],
  }),
}));

export const classroomactivitiesRelations = relations(
  classroomactivities,
  ({ one }) => ({
    user: one(users, {
      fields: [classroomactivities.userId],
      references: [users.id],
    }),
    classroom: one(classrooms, {
      fields: [classroomactivities.classroomId],
      references: [classrooms.id],
    }),
  }),
);

export const studoprofilesRelations = relations(studoprofiles, ({ many }) => ({
  tracks: many(studotracks),
  studoprofilecommunities: many(studoprofilecommunities),
}));

export const studotracksRelations = relations(studotracks, ({ one }) => ({
  profile: one(studoprofiles, {
    fields: [studotracks.studoprofileId],
    references: [studoprofiles.id],
  }),
}));

export const studocommunitiesRelations = relations(
  studoprofilecommunities,
  ({ one }) => ({
    profile: one(studoprofiles, {
      fields: [studoprofilecommunities.studoprofileId],
      references: [studoprofiles.id],
    }),
    classroom: one(classrooms, {
      fields: [studoprofilecommunities.classroomId],
      references: [classrooms.id],
    }),
  }),
);

export const reportsRelations = relations(reports, ({ one, many }) => ({
  filledBy: one(users, {
    fields: [reports.filledBy],
    references: [users.id],
  }),
  reportedUserId: one(users, {
    fields: [reports.reportedUserId],
    references: [users.id],
  }),
  reviewedBy: one(users, {
    fields: [reports.reviewedBy],
    references: [users.id],
  }),
  assigneeId: one(users, {
    fields: [reports.assigneeId],
    references: [users.id],
  }),
  assigneeDisplayName: one(users, {
    fields: [reports.assigneeDisplayName],
    references: [users.displayName],
  }),
}));
export const flowboardsRelations = relations(flowboards, ({ one, many }) => ({
  owner: one(users, { fields: [flowboards.ownerId], references: [users.id] }),
  courses: many(flowcourses),
}));

export const flowcoursesRelations = relations(flowcourses, ({ one, many }) => ({
  board: one(flowboards, {
    fields: [flowcourses.boardId],
    references: [flowboards.id],
  }),
  addedBy: one(users, {
    fields: [flowcourses.addedBy],
    references: [users.id],
  }),
  rows: many(flowrows),
}));

export const flowrowsRelations = relations(flowrows, ({ one, many }) => ({
  course: one(flowcourses, {
    fields: [flowrows.flowcourseId],
    references: [flowcourses.id],
  }),
  studyset: one(studysets, {
    fields: [flowrows.studoset],
    references: [studysets.id],
  }),
  visualset: one(visualsets, {
    fields: [flowrows.visualset],
    references: [visualsets.id],
  }),
  resources: many(flowresources),
}));

export const flowresourcesRelations = relations(flowresources, ({ one }) => ({
  row: one(flowrows, {
    fields: [flowresources.rowId],
    references: [flowrows.id],
  }),
}));

export const suggestionImagesRelations = relations(
  suggestion_images,
  ({ many }) => ({
    cards: many(cards),
    suggestionTermsCards: many(suggestion_terms_cards),
  }),
);

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(users, {
    fields: [chat.userId],
    references: [users.id],
  }),
  messages: many(chatMessage),
}));

export const chatMessageRelations = relations(chatMessage, ({ one, many }) => ({
  chat: one(chat, {
    fields: [chatMessage.chatId],
    references: [chat.id],
  }),
  payloads: many(chatMessagePayload),
}));

export const chatMessagePayloadRelations = relations(
  chatMessagePayload,
  ({ one }) => ({
    message: one(chatMessage, {
      fields: [chatMessagePayload.messageId],
      references: [chatMessage.id],
    }),
    course: one(flowcourses, {
      fields: [chatMessagePayload.flowcourseId],
      references: [flowcourses.id],
    }),
    studyset: one(studysets, {
      fields: [chatMessagePayload.studosetId],
      references: [studysets.id],
    }),
    cards: one(cards, {
      fields: [chatMessagePayload.cardId],
      references: [cards.id],
    }),
  }),
);
