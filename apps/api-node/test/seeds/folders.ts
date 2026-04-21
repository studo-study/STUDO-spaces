import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { folders } from '../../src/drizzle/schema';

const folderId1 = '2b5a7605-6b7c-49dd-8fc5-fe7ad62c410b';
const folderId2 = 'd9365882-43aa-49ca-84fa-28e2ec08572b';
const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';

export const FOLDERS_SEED = [
  { id: folderId1, name: 'Biology Notes', owner_id: userId1 },
  { id: folderId2, name: 'Computer Science', owner_id: userId2 },
];

export async function seedFolders(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding folders...');
  await drizzle.insert(folders).values(FOLDERS_SEED);
  console.log('✅ Folders seeded');
}

export async function clearFolders(drizzle: DatabaseProvider) {
  console.log('🧹 Clearing folders...');
  await drizzle.delete(folders);
  console.log('✅ Folders cleared');
}
