import * as schema from '../../src/drizzle/schema';
import { Role } from '../../src/auth/roles';
import postgres, { Sql } from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as argon2 from 'argon2';
import { v6 as uuidv6 } from 'uuid';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { sessioncards, studysets } from '../../src/drizzle/schema';
import { STUDYSETS_SEED } from './studysets';

const connection: Sql = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });
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
    card_viewcount: 3,
    card_total_viewcount: 8,
    inQueue: false,
    mastered: true,
    times_relearned: 1,
    card_id: cardId1,
    session_id: sessionId1,
    owner_id: userId1,
  },
  {
    id: uuidv6(),
    number: 2,
    card_viewcount: 2,
    card_total_viewcount: 5,
    inQueue: true,
    mastered: false,
    times_relearned: 0,
    card_id: cardId2,
    session_id: sessionId1,
    owner_id: userId1,
  },
  // Session 2 (userId1, studySetId2)
  {
    id: uuidv6(),
    number: 1,
    card_viewcount: 4,
    card_total_viewcount: 10,
    inQueue: false,
    mastered: true,
    times_relearned: 2,
    card_id: cardId3,
    session_id: sessionId2,
    owner_id: userId1,
  },
  {
    id: uuidv6(),
    number: 2,
    card_viewcount: 3,
    card_total_viewcount: 7,
    inQueue: true,
    mastered: false,
    times_relearned: 1,
    card_id: cardId4,
    session_id: sessionId2,
    owner_id: userId1,
  },
  // Session 5 (userId2, studySetId2)
  {
    id: uuidv6(),
    number: 1,
    card_viewcount: 2,
    card_total_viewcount: 4,
    inQueue: false,
    mastered: true,
    times_relearned: 0,
    card_id: cardId3,
    session_id: sessionId5,
    owner_id: userId2,
  },
  {
    id: uuidv6(),
    number: 2,
    card_viewcount: 1,
    card_total_viewcount: 2,
    inQueue: true,
    mastered: false,
    times_relearned: 0,
    card_id: cardId4,
    session_id: sessionId5,
    owner_id: userId2,
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
