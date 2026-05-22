// test/seeds/profiles.ts
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { profiles } from '../../src/drizzle/schema';

const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';

export const PROFILES_SEED = [
  {
    user_id: userId1,
    displayName: 'Charles Degraeuwe',
    img_url: 'https://i.pravatar.cc/150?img=1',
    banner_url: '',
    join_date: new Date('2024-01-15T10:00:00.000Z'),
    streak: 29,
    verified: false,
    tags: [],
  },
  {
    user_id: userId2,
    displayName: 'Paul Allen',
    img_url: 'https://i.pravatar.cc/150?img=2',
    banner_url: '',
    join_date: new Date('2024-02-20T14:30:00.000Z'),
    streak: 15,
    verified: false,
    tags: [],
  },
];

export async function seedProfiles(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding profiles...');
  await drizzle.insert(profiles).values(PROFILES_SEED);
  console.log('✅ Profiles seeded');
}

export async function clearProfiles(drizzle: DatabaseProvider) {
  console.log('🧹 Clearing profiles...');
  await drizzle.delete(profiles);
  console.log('✅ Profiles cleared');
}
