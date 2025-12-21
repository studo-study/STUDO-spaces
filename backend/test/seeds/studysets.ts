// test/seeds/studysets.ts
import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { studysets } from '../../src/drizzle/schema';

const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const studySetId2 = '2e145267-e5d7-48d0-a605-09c29157358e';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const folderId1 = '2b5a7605-6b7c-49dd-8fc5-fe7ad62c410b';
const folderId2 = 'd9365882-43aa-49ca-84fa-28e2ec08572b';

export const STUDYSETS_SEED = [
  {
    id: studySetId1,
    title: 'Cell Biology Basics',
    course: 'Biology 101',
    global_term_language: 'en',
    global_definition_language: 'en',
    created_at: '2024-09-01T10:00:00.000Z',
    last_updated: '2024-09-01T10:00:00.000Z',
    public_set: true,
    user_id: userId1,
    displayName: 'Charles Degraeuwe',
    img_url: 'https://i.pravatar.cc/150?img=1',
    folder_id: folderId1,
  },
  {
    id: studySetId2,
    title: 'Data Structures',
    course: 'CS 201',
    global_term_language: 'en',
    global_definition_language: 'en',
    created_at: '2024-08-15T09:00:00.000Z',
    last_updated: '2024-08-15T09:00:00.000Z',
    public_set: false,
    user_id: userId2,
    img_url: 'https://i.pravatar.cc/150?img=2',
    displayName: 'Bob Smith',
    folder_id: folderId2,
  },
];

export async function seedStudysets(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding studysets...');
  await drizzle.insert(studysets).values(STUDYSETS_SEED);
  console.log('✅ Studysets seeded');
}

export async function clearStudysets(drizzle: DatabaseProvider) {
  console.log('🧹 Clearing studysets...');
  await drizzle.delete(studysets);
  console.log('✅ Studysets cleared');
}
