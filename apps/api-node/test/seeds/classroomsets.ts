import * as schema from '../../src/drizzle/schema';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { classroomsets } from '../../src/drizzle/schema';

const connection = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });
const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const studySetId2 = '2e145267-e5d7-48d0-a605-09c29157358e';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const classroomId1 = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';

export const CLASSROOMSET_SEED = [
  {
    set_id: studySetId1,
    set_type: 'studyset',
    added_by: userId2,
    classroom_id: classroomId1,
  },
  {
    set_id: studySetId2,
    set_type: 'studyset',
    added_by: userId1,
    classroom_id: classroomId1,
  },
];

export async function seedClassroomsets() {
  console.log('Seeding classroomsets...');
  await db.insert(schema.classroomsets).values(CLASSROOMSET_SEED);
  console.log('Classroomsets seeded\n');
}

export async function clearClassroomsets(drizzle: DatabaseProvider) {
  await drizzle.delete(classroomsets);
}
