import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { setlikes } from '../../src/drizzle/schema';
import { v6 as uuidv6 } from 'uuid';
const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const studySetId2 = '2e145267-e5d7-48d0-a605-09c29157358e';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const setLike1 = uuidv6();
const setLike2 = uuidv6();
const setLike3 = uuidv6();

export const SETLIKES_SEED = [
  {
    id: setLike1,
    user_id: userId2,
    set_id: studySetId1,
    set_type: 'studyset',
    created_at: '2024-10-15T12:00:00.000Z',
  },
  {
    id: setLike2,
    user_id: userId1,
    set_id: studySetId1,
    set_type: 'visualset',
    created_at: '2024-10-20T09:30:00.000Z',
  },
  {
    id: setLike3,
    user_id: userId1,
    set_id: studySetId2,
    set_type: 'studyset',
    created_at: '2024-10-22T14:00:00.000Z',
  },
];

export async function seedSetlikes(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding setlikes...');
  await drizzle.insert(setlikes).values(SETLIKES_SEED);
  console.log('✅ setlikes seeded');
}

export async function clearSetlikes(drizzle: DatabaseProvider) {
  await drizzle.delete(setlikes);
}
