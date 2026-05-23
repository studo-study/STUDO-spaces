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
} from 'drizzle-orm/pg-core';
// timestamp columns are always stored as UTC, no timezone offset
import { relations, sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    img_url: varchar('img_url', { length: 250 }).notNull(),
    join_date: timestamp('join_date').notNull(),
    joinNumber: serial('join_number').notNull().unique(),
    totalSets: integer('total_sets').notNull(),
    streak_started: timestamp('streak_started'),
    streak_count: integer('streak_count'),
    streak_last_update: timestamp('streak_last_update'),
    last_login: timestamp('last_login').notNull(),
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
    user_id: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull()
      .primaryKey(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    img_url: varchar('img_url', { length: 250 }).notNull(),
    banner_url: varchar('banner_url', { length: 250 }),
    join_date: timestamp('join_date').notNull(),
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
    img_url: varchar('img_url', { length: 250 }).notNull(),
    banner_url: varchar('banner_url', { length: 250 }).notNull(),
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
    studoprofile_id: varchar('studoprofile_id', { length: 64 })
      .references(() => studoprofiles.id, { onDelete: 'cascade' })
      .notNull(),
    trackName: varchar('displayname', { length: 100 }).notNull(),
    icon_name: varchar('icon_name', { length: 50 }).notNull(),
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

export const folders = pgTable('folders', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  owner_id: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const folder_sets = pgTable('folder_sets', {
  id: varchar('id', { length: 64 }).primaryKey(),
  user_id: varchar('user_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  set_id: varchar('set_id', { length: 64 }).notNull(),
  set_type: varchar('set_type', { length: 20 }).notNull(), // 'studyset' | 'visualset'
  folder_id: varchar('folder_id', { length: 64 })
    .references(() => folders.id, { onDelete: 'cascade' })
    .notNull(),
});

export const studysets = pgTable(
  'studysets',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    course: varchar('course', { length: 100 }).notNull(),
    studoset: boolean(`studoset`).notNull(),
    global_term_language: varchar('global_term_language', {
      length: 2,
    }).notNull(),
    global_definition_language: varchar('global_definition_language', {
      length: 2,
    }).notNull(),
    created_at: varchar('created_at', { length: 24 }).notNull(),
    last_updated: varchar('last_updated', { length: 24 }).notNull(),
    public_set: boolean('publicSet').notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    img_url: varchar('img_url', { length: 250 }).notNull(),
    user_id: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    index('studysets_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      ||
      ' '
      ||
      ${table.course}
      )`,
    ),
  ],
);

export const visualsets = pgTable(
  'visualsets',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    title: varchar('title', { length: 200 }).notNull(),
    course: varchar('course', { length: 100 }).notNull(),
    studoset: boolean(`studoset`).notNull(),
    created_at: varchar('created_at', { length: 24 }).notNull(),
    last_updated: varchar('last_updated', { length: 24 }).notNull(),
    public_set: boolean('publicSet').notNull(),
    user_id: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    img_url: varchar('img_url', { length: 250 }).notNull(),
  },
  (table) => [
    index('visualsets_search_index').using(
      'gin',
      sql`to_tsvector
      ('simple',
      ${table.title}
      ||
      ' '
      ||
      ${table.course}
      )`,
    ),
  ],
);

export const images = pgTable('images', {
  id: varchar('id', { length: 64 }).primaryKey(),
  title: varchar('title', { length: 100 }).notNull(),
  index: integer('index').notNull(),
  url: varchar('url', { length: 250 }).notNull(),
  grid_x: integer('grid_x').notNull(),
  grid_y: integer('grid_y').notNull(),
  scale: varchar('scale', { length: 64 }).notNull(),
  set_id: varchar('set_id', { length: 64 })
    .references(() => visualsets.id, { onDelete: 'cascade' })
    .notNull(),
});

export const pins = pgTable('pins', {
  id: varchar('id', { length: 64 }).primaryKey(),
  definition: varchar('definition', { length: 128 }).notNull(),
  x: integer('x').notNull(),
  y: integer('y').notNull(),
  number: integer('number').notNull(),
  created_at: varchar('created_at', { length: 24 }).notNull(),
  updated_at: varchar('updated_at', { length: 24 }).notNull(),
  image_id: varchar('image_id', { length: 64 })
    .references(() => images.id, { onDelete: 'cascade' })
    .notNull(),
  set_id: varchar('set_id', { length: 64 })
    .references(() => visualsets.id, { onDelete: 'cascade' })
    .notNull(),
  owner_id: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const cards = pgTable('cards', {
  id: varchar('id', { length: 64 }).primaryKey(),
  term: varchar('term', { length: 512 }).notNull(),
  definition: varchar('definition', { length: 512 }).notNull(),
  number: integer('number').notNull(),
  created_at: varchar('created_at', { length: 24 }).notNull(),
  updated_at: varchar('updated_at', { length: 24 }).notNull(),
  set_id: varchar('set_id', { length: 64 })
    .references(() => studysets.id, { onDelete: 'cascade' })
    .notNull(),
  owner_id: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const setlikes = pgTable('setlikes', {
  id: varchar('id', { length: 64 }).primaryKey(),
  user_id: varchar('user_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  set_id: varchar('set_id', { length: 64 }).notNull(),
  set_type: varchar('set_type', { length: 20 }).notNull(),
  created_at: varchar('created_at', { length: 24 }).notNull(),
});

export const studysessions = pgTable('studysessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  user_id: varchar('user_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  set_id: varchar('set_id', { length: 64 }).notNull(),
  set_type: varchar('set_type', { length: 30 }).notNull(),
  started_at: varchar('started_at', { length: 24 }).notNull(),
  duration_min: integer('duration_min').notNull(),
  ended_at: varchar('ended_at', { length: 24 }).notNull(),
  index: integer('set_index').notNull(),
  accuracy: integer('accuracy').notNull(),
  average_response_time: integer('average_response_time').notNull(),
  longest_focus_streak: integer('longest_focus_streak').notNull(),
  last_seen: varchar('last_seen', { length: 64 }).notNull(),
  last_studied: varchar('last_studied').notNull(),
});

export const sessioncards = pgTable('sessioncards', {
  id: varchar('id', { length: 64 }).primaryKey(),
  number: integer('number').notNull(),
  card_viewcount: integer('card_viewcount').notNull(),
  card_total_viewcount: integer('card_total_viewcount').notNull(),
  inQueue: boolean('inQueue').notNull(),
  mastered: boolean('mastered').notNull(),
  times_relearned: integer('times_relearned').notNull(),
  card_id: varchar('card_id', { length: 64 })
    .references(() => cards.id, { onDelete: 'cascade' })
    .notNull(),
  session_id: varchar('session_id', { length: 64 })
    .references(() => studysessions.id, { onDelete: 'cascade' })
    .notNull(),
  owner_id: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const sessionpins = pgTable('sessionpins', {
  id: varchar('id', { length: 64 }).primaryKey(),
  number: integer('number').notNull(),
  pin_viewcount: integer('pin_viewcount').notNull(),
  pin_total_viewcount: integer('pin_total_viewcount').notNull(),
  inQueue: boolean('inQueue').notNull(),
  mastered: boolean('mastered').notNull(),
  times_relearned: integer('times_relearned').notNull(),
  pin_id: varchar('pin_id', { length: 64 })
    .references(() => pins.id, { onDelete: 'cascade' }) // ✅ CHANGED: consistent gedrag
    .notNull(),
  session_id: varchar('session_id', { length: 64 })
    .references(() => studysessions.id, { onDelete: 'cascade' })
    .notNull(),
  owner_id: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
});

export const classrooms = pgTable(
  'classrooms',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    name: varchar('name', { length: 64 }).notNull(),
    owner_id: varchar('owner_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    type: varchar('type', { length: 40 }).notNull(),
    created_at: varchar('created_at', { length: 24 }).notNull(),
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
    user_id: varchar('user_id', { length: 64 })
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    classroom_id: varchar('classroom_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
    role: varchar('role', { length: 7 }).notNull(),
    joined_at: varchar('joined_at', { length: 24 }).notNull(),
    position: integer('position').notNull(),
  },
  (table) => [
    uniqueIndex('idx_user_classroom_unique').on(
      table.user_id,
      table.classroom_id,
    ),
  ],
);

export const classroomsets = pgTable(
  'classroomsets',
  {
    set_id: varchar('set_id', { length: 64 }).notNull(),
    set_type: varchar('set_type', { length: 20 }).notNull(),
    added_by: varchar('added_by', { length: 100 }).notNull(),
    classroom_id: varchar('classroom_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_classroom_unique').on(
      table.set_id,
      table.classroom_id,
    ),
  ],
);

export const classroomactivities = pgTable('classroomactivity', {
  id: varchar('id', { length: 64 }).primaryKey(),
  classroom_id: varchar('classroom_id', { length: 64 })
    .references(() => classrooms.id, { onDelete: 'cascade' })
    .notNull(),
  user_id: varchar('user_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  displayName: varchar('displayName', { length: 64 }).notNull(),
  img_url: varchar('img_url', { length: 250 }).notNull(),
  last_seen: varchar('last_seen', { length: 64 }).notNull(),
  set_id: varchar('set_id', { length: 64 }).notNull(),
  set_type: varchar('set_type', { length: 24 }).notNull(),
  title: varchar('title', { length: 64 }).notNull(),
});

export const tracksets = pgTable(
  'tracksets',
  {
    set_id: varchar('set_id', { length: 64 }).notNull(),
    set_type: varchar('set_type', { length: 20 }).notNull(),
    track_id: varchar('track_id', { length: 64 })
      .references(() => studotracks.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_tracksets_unique').on(table.set_id, table.track_id),
  ],
);

export const studoprofilecommunities = pgTable(
  'studoprofilecommunities',
  {
    classroom_id: varchar('classroom_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' }) // FK naar classrooms
      .notNull(),
    class_type: varchar('class_type', { length: 20 }).notNull(),
    studoprofile_id: varchar('studoprofile_id', { length: 64 })
      .references(() => studoprofiles.id, { onDelete: 'cascade' }) // FK naar studoprofiles
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_trackcommunities_unique').on(
      table.classroom_id,
      table.studoprofile_id,
    ),
  ],
);

export const popular_sets = pgTable('popular_sets', {
  id: varchar('id', { length: 64 }).primaryKey().notNull(),
  studyset_id: varchar('studyset_id').references(() => studysets.id),
  visualset_id: varchar('visualset_id').references(() => visualsets.id),
  rank: integer('rank').notNull(),
  snapshot_id: integer('snapshot_id').notNull(),
});

export const reports = pgTable('reports', {
  report_id: varchar('report_id').primaryKey(),
  filled_by: integer('filled_by').notNull(),
  report_type: varchar('report_type', { length: 50 }).notNull(),
  description: text('description'),
  target_id: varchar('target_id').notNull(),
  target_type: varchar('target_type', { length: 20 }).notNull(),
  reported_user_id: integer('reported_user_id'),
  status: varchar('status', { length: 20 }).default('to_do').notNull(),
  priority: varchar('priority').default('no_priority').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at'),
  reviewed_by: integer('reviewed_by'),
  moderator_note: text('moderator_note'),
  assignee_id: varchar('assignee_id'),
  assignee_displayName: varchar('assignee_displayName'),
  number: integer('number').notNull(),
});

export const flowboards = pgTable('flowboards', {
  id: varchar('board_id').primaryKey(),
  owner_id: varchar('owner_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title').notNull(),
  icon: varchar('icon').default('flowboard_icon').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  year: varchar('year'),
  semester: varchar('semester'),
  school_name: varchar('school_name'),
  school_id: varchar('school_id'),
});

export const flowcourses = pgTable('flowcourses', {
  id: varchar('flowcourse_id').primaryKey(),
  board_id: varchar('board_id')
    .references(() => flowboards.id, { onDelete: 'cascade' })
    .notNull(),
  added_by: varchar('added_by')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title').notNull(),
  icon: varchar('icon').default('flowcourse_icon').notNull(),
  description: text('description'),
  resource: varchar('resource'),
  exam_date: varchar('exam_date'),
  lesson_days: varchar('lesson_days'),
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
  flowcourse_id: varchar('flowcourse_id')
    .references(() => flowcourses.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title').notNull(),
  order_index: integer('order_index'),
  description: text('description'),
  type: rowTypeEnum('type').default('task'),
  priority: priorityEnum('priority').default('no_priority'),
  status: statusEnum('status').default('not_started').notNull(),
  estimated_time: integer('estimated_time'),
  difficulty: integer('difficulty'),
  is_required: boolean('is_required').default(true),
  due_date: timestamp('due_date'),
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
  flowresource_id: varchar('flowresource_id').primaryKey(),
  row_id: varchar('row_id')
    .references(() => flowrows.id, { onDelete: 'cascade' })
    .notNull(),
  title: varchar('title').notNull(),
  link: varchar('link').notNull(),
  link_type: varchar('link_type'),
  resource_type: resourceTypeEnum('resource_type').default('task'),
});

// ============================================================
// RELATIONS
// ============================================================

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.user_id],
  }),
  folders: many(folders),
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
}));

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.user_id],
    references: [users.id],
  }),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  owner: one(users, {
    fields: [folders.owner_id],
    references: [users.id],
  }),
  folder_sets: many(folder_sets),
}));

export const folderSetsRelations = relations(folder_sets, ({ one }) => ({
  user: one(users, {
    fields: [folder_sets.user_id],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [folder_sets.folder_id],
    references: [folders.id],
  }),
}));

export const studysetsRelations = relations(studysets, ({ one, many }) => ({
  user: one(users, {
    fields: [studysets.user_id],
    references: [users.id],
  }),
  cards: many(cards),
}));

export const visualsetsRelations = relations(visualsets, ({ one, many }) => ({
  user: one(users, {
    fields: [visualsets.user_id],
    references: [users.id],
  }),
  images: many(images),
  pins: many(pins),
}));

export const imagesRelations = relations(images, ({ one, many }) => ({
  visualset: one(visualsets, {
    fields: [images.set_id],
    references: [visualsets.id],
  }),
  pins: many(pins),
}));

export const pinsRelations = relations(pins, ({ one, many }) => ({
  image: one(images, {
    fields: [pins.image_id],
    references: [images.id],
  }),
  visualset: one(visualsets, {
    fields: [pins.set_id],
    references: [visualsets.id],
  }),
  owner: one(users, {
    fields: [pins.owner_id],
    references: [users.id],
  }),
  sessionpins: many(sessionpins),
}));

export const cardsRelations = relations(cards, ({ one, many }) => ({
  studyset: one(studysets, {
    fields: [cards.set_id],
    references: [studysets.id],
  }),
  owner: one(users, {
    fields: [cards.owner_id],
    references: [users.id],
  }),
  sessioncards: many(sessioncards),
}));

export const setlikesRelations = relations(setlikes, ({ one }) => ({
  user: one(users, {
    fields: [setlikes.user_id],
    references: [users.id],
  }),
}));

export const studysessionsRelations = relations(
  studysessions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [studysessions.user_id],
      references: [users.id],
    }),
    sessioncards: many(sessioncards),
    sessionpins: many(sessionpins),
  }),
);

export const sessioncardsRelations = relations(sessioncards, ({ one }) => ({
  card: one(cards, {
    fields: [sessioncards.card_id],
    references: [cards.id],
  }),
  session: one(studysessions, {
    fields: [sessioncards.session_id],
    references: [studysessions.id],
  }),
  owner: one(users, {
    fields: [sessioncards.owner_id],
    references: [users.id],
  }),
}));

export const sessionpinsRelations = relations(sessionpins, ({ one }) => ({
  pin: one(pins, {
    fields: [sessionpins.pin_id],
    references: [pins.id],
  }),
  session: one(studysessions, {
    fields: [sessionpins.session_id],
    references: [studysessions.id],
  }),
  owner: one(users, {
    fields: [sessionpins.owner_id],
    references: [users.id],
  }),
}));

export const classroomsRelations = relations(classrooms, ({ one, many }) => ({
  owner: one(users, {
    fields: [classrooms.owner_id],
    references: [users.id],
  }),
  classroomusers: many(classroomusers),
  classroomsets: many(classroomsets),
  classroomactivities: many(classroomactivities),
  studoprofilecommunities: many(studoprofilecommunities),
}));

export const classroomusersRelations = relations(classroomusers, ({ one }) => ({
  user: one(users, {
    fields: [classroomusers.user_id],
    references: [users.id],
  }),
  classroom: one(classrooms, {
    fields: [classroomusers.classroom_id],
    references: [classrooms.id],
  }),
}));

export const classroomsetsRelations = relations(classroomsets, ({ one }) => ({
  classroom: one(classrooms, {
    fields: [classroomsets.classroom_id],
    references: [classrooms.id],
  }),
}));

export const classroomactivitiesRelations = relations(
  classroomactivities,
  ({ one }) => ({
    user: one(users, {
      fields: [classroomactivities.user_id],
      references: [users.id],
    }),
    classroom: one(classrooms, {
      fields: [classroomactivities.classroom_id],
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
    fields: [studotracks.studoprofile_id],
    references: [studoprofiles.id],
  }),
}));

export const studocommunitiesRelations = relations(
  studoprofilecommunities,
  ({ one }) => ({
    profile: one(studoprofiles, {
      fields: [studoprofilecommunities.studoprofile_id],
      references: [studoprofiles.id],
    }),
    classroom: one(classrooms, {
      fields: [studoprofilecommunities.classroom_id],
      references: [classrooms.id],
    }),
  }),
);

export const flowboardsRelations = relations(flowboards, ({ one, many }) => ({
  owner: one(users, { fields: [flowboards.owner_id], references: [users.id] }),
  courses: many(flowcourses),
}));

export const flowcoursesRelations = relations(flowcourses, ({ one, many }) => ({
  board: one(flowboards, {
    fields: [flowcourses.board_id],
    references: [flowboards.id],
  }),
  addedBy: one(users, {
    fields: [flowcourses.added_by],
    references: [users.id],
  }),
  rows: many(flowrows),
}));

export const flowrowsRelations = relations(flowrows, ({ one, many }) => ({
  course: one(flowcourses, {
    fields: [flowrows.flowcourse_id],
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
    fields: [flowresources.row_id],
    references: [flowrows.id],
  }),
}));
