import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { studysessions } from '../../src/drizzle/schema';
const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const studySetId2 = '2e145267-e5d7-48d0-a605-09c29157358e';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const cardId1 = '3de5f065-47da-4064-a93f-450565bf4e93';
const cardId3 = '0c3e9782-0978-4348-bf33-fce99c88c769';
const sessionId1 = 'f64a9f4c-53a5-4ce5-8c1a-86b3e4b26c8b';
const sessionId2 = 'bd7869fd-a20c-4966-a216-8ddb1be907b0';
const sessionId3 = '4fae503a-425f-454d-be83-acedf0dd806a';
const sessionId4 = '4fae583a-425d-454d-be83-acedf0dd806a';

export const STUDYSESSION_SEED = [
  {
    id: sessionId1,
    user_id: userId1,
    set_id: studySetId1,
    set_type: 'studyset',
    started_at: '2024-10-29T14:00:00.000Z',
    duration_min: 45,
    last_studied: '2024-10-29T14:30:00.000Z',
    ended_at: '2024-10-29T14:45:00.000Z',
    index: 5,
    accuracy: 85,
    average_response_time: 3500,
    longest_focus_streak: 12,
    last_seen: cardId1,
  },
  {
    id: sessionId4,
    user_id: userId2,
    set_id: studySetId1,
    set_type: 'studyset',
    started_at: '2024-10-29T14:00:00.000Z',
    duration_min: 45,
    last_studied: '2024-10-29T14:30:00.000Z',
    ended_at: '2024-10-29T14:45:00.000Z',
    index: 5,
    accuracy: 85,
    average_response_time: 3500,
    longest_focus_streak: 12,
    last_seen: cardId1,
  },

  {
    id: sessionId2,
    user_id: userId1,
    set_id: studySetId2,
    set_type: 'studyset',
    started_at: '2024-10-29T15:00:00.000Z',
    duration_min: 30,
    last_studied: '2024-10-29T15:30:00.000Z',
    ended_at: '2024-10-29T15:30:00.000Z',
    index: 3,
    accuracy: 78,
    average_response_time: 4000,
    longest_focus_streak: 8,
    last_seen: cardId3,
  },
  {
    id: sessionId3,
    user_id: userId2,
    set_id: studySetId2,
    set_type: 'studyset',
    started_at: '2024-10-30T09:00:00.000Z',
    duration_min: 20,
    ended_at: '2024-10-30T09:20:00.000Z',
    index: 2,
    accuracy: 88,
    average_response_time: 3200,
    longest_focus_streak: 6,
    last_seen: cardId3,
    last_studied: '2024-10-30T09:10:00.000Z',
  },
];
export async function seedStudysessions(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding studysessions...');
  await drizzle.insert(studysessions).values(STUDYSESSION_SEED);
  console.log('✅ studyessions seeded');
}

export async function clearStudysessions(drizzle: DatabaseProvider) {
  await drizzle.delete(studysessions);
}
