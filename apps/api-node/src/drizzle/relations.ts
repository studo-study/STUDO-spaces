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
