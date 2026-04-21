// test/seeds/users.ts
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { users } from '../../src/drizzle/schema';
import { Role } from '../../src/auth/roles';

const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';

export const USERS_SEED = [
  {
    id: userId1,
    email: 'charles@test.com',
    displayName: 'Charles Degraeuwe',
    img_url: 'https://i.pravatar.cc/150?img=1',
    join_date: '2024-01-15T10:00:00.000Z',
    totalSets: 2,
    streak_started: '2024-10-01T08:00:00.000Z',
    streak_count: 29,
    streak_last_update: '2024-10-29T09:30:00.000Z',
    last_login: '2024-10-30T08:00:00.000Z',
    roles: [Role.USER, Role.ADMIN],
    publicRole: 'owner',
    verified: false,
  },
  {
    id: userId2,
    email: 'paulallen@example.com',
    displayName: 'Paul Allen',
    img_url: 'https://i.pravatar.cc/150?img=2',
    join_date: '2024-02-20T14:30:00.000Z',
    totalSets: 1,
    streak_started: '2024-10-15T10:00:00.000Z',
    streak_count: 15,
    streak_last_update: '2024-10-30T07:15:00.000Z',
    last_login: '2024-10-30T07:15:00.000Z',
    roles: [Role.USER],
    publicRole: 'student',
    verified: false,
  },
];

export async function seedUsers(
  app: INestApplication,
  drizzle: DatabaseProvider,
) {
  console.log('🌱 Seeding users...');

  const authService = app.get(AuthService);
  const passwordHash = await authService.hashPassword('123');

  await drizzle.insert(users).values(
    USERS_SEED.map((user) => ({
      ...user,
      passwordHash,
    })),
  );

  console.log('✅ Users seeded');
}

export async function clearUsers(drizzle: DatabaseProvider) {
  console.log('🧹 Clearing users...');
  await drizzle.delete(users);
  console.log('✅ Users cleared');
}
