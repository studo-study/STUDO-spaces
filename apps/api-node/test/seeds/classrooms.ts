import * as schema from '../../src/drizzle/schema';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { classrooms } from '../../src/drizzle/schema';

const connection = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const classroomId1 = '0e2b6da7-d82b-4be2-bf3e-4b320bfd497b';

export const CLASSROOM_SEED = [
  {
    id: classroomId1,
    name: 'Biology 101 - Fall 2024',
    ownerId: userId1,
    type: 'public',
    createdAt: '2024-08-20T10:00:00.000Z',
    verified: true,
    school: '',
  },
];

export async function seedClassrooms() {
  console.log('Seeding classrooms...');
  await db.insert(schema.classrooms).values(CLASSROOM_SEED);
  console.log('Classrooms seeded\n');
}

export async function clearClassrooms(drizzle: DatabaseProvider) {
  await drizzle.delete(classrooms);
}
