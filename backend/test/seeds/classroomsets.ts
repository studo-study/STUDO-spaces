import * as schema from '../../src/drizzle/schema';
import { Role } from '../../src/auth/roles';
import postgres, { Sql } from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as argon2 from 'argon2';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { classroomsets, studysets } from '../../src/drizzle/schema';

const connection: Sql = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });
const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const studySetId2 = '2e145267-e5d7-48d0-a605-09c29157358e';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const folderId1 = '2b5a7605-6b7c-49dd-8fc5-fe7ad62c410b';
const folderId2 = 'd9365882-43aa-49ca-84fa-28e2ec08572b';
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
