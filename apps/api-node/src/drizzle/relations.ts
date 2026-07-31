import { relations } from 'drizzle-orm';
import {
  cards,
  chat,
  chatMessage,
  chatMessagePayload,
  classroomactivities,
  classrooms,
  classroomsets,
  classroomusers,
  images,
  pins,
  profiles,
  reports,
  sessioncards,
  sessionpins,
  setlikes,
  studoprofilecommunities,
  studoprofiles,
  studotracks,
  studysessions,
  studysets,
  suggestion_images,
  suggestion_terms_cards,
  users,
  visualsets,
  courses,
  courseUsers,
  courseWorkspaces,
  courseWidgets,
  courseDocuments,
  courseDocumentChunks,
  courseSets,
  courseTables,
  courseRows,
  courseResources,
  boards,
  boardUsers,
} from './schema';

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
  reports: many(reports),
  courseMemberships: many(courseUsers),
  uploadedDocuments: many(courseDocuments),
  boardMemberships: many(boardUsers),
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

export const reportsRelations = relations(reports, ({ one }) => ({
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

export const coursesRelations = relations(courses, ({ one, many }) => ({
  board: one(boards, {
    fields: [courses.boardId],
    references: [boards.id],
  }),
  members: many(courseUsers),
  workspaces: many(courseWorkspaces),
  documents: many(courseDocuments),
  sets: many(courseSets),
  tables: many(courseTables),
}));

export const courseUsersRelations = relations(courseUsers, ({ one }) => ({
  user: one(users, {
    fields: [courseUsers.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [courseUsers.courseId],
    references: [courses.id],
  }),
}));

export const courseWorkspacesRelations = relations(
  courseWorkspaces,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseWorkspaces.courseId],
      references: [courses.id],
    }),
    widgets: many(courseWidgets),
  }),
);

export const courseWidgetsRelations = relations(courseWidgets, ({ one }) => ({
  workspace: one(courseWorkspaces, {
    fields: [courseWidgets.workspaceId],
    references: [courseWorkspaces.id],
  }),
}));

export const courseDocumentsRelations = relations(
  courseDocuments,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseDocuments.courseId],
      references: [courses.id],
    }),
    uploader: one(users, {
      fields: [courseDocuments.uploaderId],
      references: [users.id],
    }),
    chunks: many(courseDocumentChunks),
  }),
);

export const courseDocumentChunksRelations = relations(
  courseDocumentChunks,
  ({ one }) => ({
    document: one(courseDocuments, {
      fields: [courseDocumentChunks.documentId],
      references: [courseDocuments.id],
    }),
  }),
);

export const courseSetsRelations = relations(courseSets, ({ one }) => ({
  course: one(courses, {
    fields: [courseSets.courseId],
    references: [courses.id],
  }),
  addedByUser: one(users, {
    fields: [courseSets.addedBy],
    references: [users.id],
  }),
}));

export const courseTablesRelations = relations(
  courseTables,
  ({ one, many }) => ({
    course: one(courses, {
      fields: [courseTables.courseId],
      references: [courses.id],
    }),
    rows: many(courseRows),
  }),
);

export const courseRowsRelations = relations(courseRows, ({ one, many }) => ({
  table: one(courseTables, {
    fields: [courseRows.tableId],
    references: [courseTables.id],
  }),
  createdByUser: one(users, {
    fields: [courseRows.createdBy],
    references: [users.id],
  }),
  resources: many(courseResources),
}));

export const courseResourcesRelations = relations(
  courseResources,
  ({ one }) => ({
    row: one(courseRows, {
      fields: [courseResources.rowId],
      references: [courseRows.id],
    }),
  }),
);

export const boardsRelations = relations(boards, ({ many }) => ({
  courses: many(courses),
  members: many(boardUsers),
}));

export const boardUsersRelations = relations(boardUsers, ({ one }) => ({
  board: one(boards, {
    fields: [boardUsers.boardId],
    references: [boards.id],
  }),
  user: one(users, {
    fields: [boardUsers.userId],
    references: [users.id],
  }),
}));
