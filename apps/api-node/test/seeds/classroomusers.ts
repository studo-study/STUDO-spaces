import * as schema from '../../src/drizzle/schema';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { classroomusers } from '../../src/drizzle/schema';

const connection = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const classroomId1 = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';

export const CLASSROOMSUSER_SEED = [
  {
    userId: userId2,
    classroomId: classroomId1,
    role: 'owner',
    joinedAt: '2024-08-20T10:00:00.000Z',
    position: 1,
  },
  {
    userId: userId1,
    classroomId: classroomId1,
    role: 'student',
    joinedAt: '2024-08-22T10:00:00.000Z',
    position: 2,
  },
];
export async function classroomUsers() {
  console.log('Seeding classroomusers...');
  await db.insert(schema.classroomusers).values(CLASSROOMSUSER_SEED);
  console.log('Classroomusers seeded\n');
}

export async function clearClassroomusers(drizzle: DatabaseProvider) {
  await drizzle.delete(classroomusers);
}
