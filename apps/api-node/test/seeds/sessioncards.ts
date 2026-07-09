import { v6 as uuidv6 } from 'uuid';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { sessioncards } from '../../src/drizzle/schema';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const cardId1 = '3de5f065-47da-4064-a93f-450565bf4e93';
const cardId2 = '82347a02-9da2-4a6b-9cc0-e2ccbc0762d0';
const cardId3 = '0c3e9782-0978-4348-bf33-fce99c88c769';
const cardId4 = '30aee87f-d44b-490a-9839-72ca553c9ab4';
const sessionId1 = 'f64a9f4c-53a5-4ce5-8c1a-86b3e4b26c8b';
const sessionId2 = 'bd7869fd-a20c-4966-a216-8ddb1be907b0';
const sessionId5 = '4fae503a-425f-454d-be83-acedf0dd806a';

export const SESSIONCARD_SEED = [
  // Session 1 (userId1, studySetId1)
  {
    id: uuidv6(),
    number: 1,
    cardViewcount: 3,
    cardTotalViewcount: 8,
    inQueue: false,
    mastered: true,
    timesRelearned: 1,
    cardId: cardId1,
    sessionId: sessionId1,
    ownerId: userId1,
  },
  {
    id: uuidv6(),
    number: 2,
    cardViewcount: 2,
    cardTotalViewcount: 5,
    inQueue: true,
    mastered: false,
    timesRelearned: 0,
    cardId: cardId2,
    sessionId: sessionId1,
    ownerId: userId1,
  },
  // Session 2 (userId1, studySetId2)
  {
    id: uuidv6(),
    number: 1,
    cardViewcount: 4,
    cardTotalViewcount: 10,
    inQueue: false,
    mastered: true,
    timesRelearned: 2,
    cardId: cardId3,
    sessionId: sessionId2,
    ownerId: userId1,
  },
  {
    id: uuidv6(),
    number: 2,
    cardViewcount: 3,
    cardTotalViewcount: 7,
    inQueue: true,
    mastered: false,
    timesRelearned: 1,
    cardId: cardId4,
    sessionId: sessionId2,
    ownerId: userId1,
  },
  // Session 5 (userId2, studySetId2)
  {
    id: uuidv6(),
    number: 1,
    cardViewcount: 2,
    cardTotalViewcount: 4,
    inQueue: false,
    mastered: true,
    timesRelearned: 0,
    cardId: cardId3,
    sessionId: sessionId5,
    ownerId: userId2,
  },
  {
    id: uuidv6(),
    number: 2,
    cardViewcount: 1,
    cardTotalViewcount: 2,
    inQueue: true,
    mastered: false,
    timesRelearned: 0,
    cardId: cardId4,
    sessionId: sessionId5,
    ownerId: userId2,
  },
];

export async function seedSessioncards(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding sessioncards...');
  await drizzle.insert(sessioncards).values(SESSIONCARD_SEED);
  console.log('✅ sessioncards seeded');
}

export async function clearSessioncards(drizzle: DatabaseProvider) {
  await drizzle.delete(sessioncards);
}
