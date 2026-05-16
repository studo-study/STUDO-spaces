import * as schema from '../../src/drizzle/schema';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { classroomactivities } from '../../src/drizzle/schema';

const connection = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });
const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const classroomId1 = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';

export const CLASSROOMACTIVITIES_SEED = [
  {
    id: 'b75a7b29-7307-4308-afc3-81371e67faf8',
    classroom_id: classroomId1,
    user_id: userId1,
    displayName: 'Charles Degraeuwe',
    img_url: 'https://i.pravatar.cc/150?img=1',
    set_id: studySetId1,
    set_type: 'studyset',
    title: 'Cell Biology Basics',
    last_seen: '2024-10-29T14:30:00.000Z',
  },
];

export async function seedClassroomactivities() {
  console.log('Seeding classroomactivities...');
  await db.insert(schema.classroomactivities).values(CLASSROOMACTIVITIES_SEED);
  console.log('Classroomactivities seeded\n');
}

export async function clearClassroomactivities(drizzle: DatabaseProvider) {
  await drizzle.delete(classroomactivities);
}
