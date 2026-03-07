import {
  pgTable,
  varchar,
  integer,
  boolean,
  uniqueIndex,
  serial,
  index,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

export const users = pgTable(
  'users',
  {
    id: varchar('id', { length: 64 }).primaryKey(),
    email: varchar('email', { length: 255 }).notNull(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    displayName: varchar('displayname', { length: 100 }).notNull(),
    img_url: varchar('img_url', { length: 250 }).notNull(),
    join_date: varchar('join_date', { length: 24 }).notNull(),
    joinNumber: serial('join_number').notNull().unique(),
    totalSets: integer('total_sets').notNull(),
    streak_started: varchar('streak_started', { length: 24 }),
    streak_count: integer('streak_count'),
    streak_last_update: varchar('streak_last_update', { length: 24 }),
    last_login: varchar('last_login', { length: 24 }).notNull(),
    roles: jsonb('roles').notNull(),
    publicRole: varchar('public_role', { length: 24 }).notNull(),
    verified: boolean('verified').notNull(),
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
    join_date: varchar('join_date', { length: 24 }).notNull(),
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
    icon_name: varchar('icon_name', { length: 250 }).notNull(),
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

export const trackset = pgTable(
  'trackset',
  {
    set_id: varchar('set_id', { length: 64 }).notNull(),
    set_type: varchar('set_type', { length: 20 }).notNull(),
    added_by: varchar('added_by', { length: 100 }).notNull(),
    track_id: varchar('track_id', { length: 64 })
      .references(() => studotracks.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_trackset_unique').on(table.set_id, table.track_id),
  ],
);

export const folders = pgTable('folders', {
  id: varchar('id', { length: 64 }).primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  owner_id: varchar('owner_id', { length: 64 })
    .references(() => users.id, { onDelete: 'cascade' })
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
    folder_id: varchar('folder_id', { length: 64 })
      .references(() => folders.id, { onDelete: 'cascade' })
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
    folder_id: varchar('folder_id', { length: 64 })
      .references(() => folders.id, { onDelete: 'cascade' })
      .notNull(),
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
  term: varchar('term', { length: 128 }).notNull(),
  definition: varchar('definition', { length: 128 }).notNull(),
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
    .references(() => cards.id, { onDelete: 'set null' })
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
    classroom_id: varchar('classroom_id', { length: 64 }).notNull(),
    class_type: varchar('class_type', { length: 20 }).notNull(),
    studoprofile_id: varchar('studoprofile_id', { length: 64 })
      .references(() => classrooms.id, { onDelete: 'cascade' })
      .notNull(),
  },
  (table) => [
    uniqueIndex('idx_set_trackcommunities_unique').on(
      table.classroom_id,
      table.studoprofile_id,
    ),
  ],
);

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
  studysets: many(studysets),
  visualsets: many(visualsets),
}));

export const studysetsRelations = relations(studysets, ({ one, many }) => ({
  user: one(users, {
    fields: [studysets.user_id],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [studysets.folder_id],
    references: [folders.id],
  }),
  cards: many(cards),
  classroomactivities: many(classroomactivities),
  studysessions: many(studysessions),
}));

export const visualsetsRelations = relations(visualsets, ({ one, many }) => ({
  user: one(users, {
    fields: [visualsets.user_id],
    references: [users.id],
  }),
  folder: one(folders, {
    fields: [visualsets.folder_id],
    references: [folders.id],
  }),
  images: many(images),
  pins: many(pins),
  classroomactivities: many(classroomactivities),
  studysessions: many(studysessions),
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
  }),
);
