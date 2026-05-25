import { DatabaseProvider } from '../../src/drizzle/drizzle.provider';
import { cards } from '../../src/drizzle/schema';

const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
const userId2 = '2f0c076e-f30c-6390-a0f3-d5a021c6a9cb';
const cardId1 = '3de5f065-47da-4064-a93f-450565bf4e93';
const cardId2 = '82347a02-9da2-4a6b-9cc0-e2ccbc0762d0';
const cardId3 = '0c3e9782-0978-4348-bf33-fce99c88c769';
const cardId4 = '30aee87f-d44b-490a-9839-72ca553c9ab4';
const studySetId1 = '63c1725a-3723-4691-98e1-b8630cb1bdab';
const studySetId2 = '2e145267-e5d7-48d0-a605-09c29157358e';

export const CARDS_SEED = [
  {
    id: cardId1,
    term: 'Mitochondria',
    definition: 'The powerhouse of the cell',
    number: 1,
    created_at: '2024-09-01T10:15:00.000Z',
    updated_at: '2024-09-01T10:15:00.000Z',
    set_id: studySetId1,
    owner_id: userId1,
    term_content_type: 'text',
  },
  {
    id: cardId2,
    term: 'Nucleus',
    definition: 'Contains genetic material (DNA)',
    number: 2,
    created_at: '2024-09-01T10:20:00.000Z',
    updated_at: '2024-09-01T10:20:00.000Z',
    set_id: studySetId1,
    owner_id: userId1,
    term_content_type: 'text',
  },
  {
    id: cardId3,
    term: 'Array',
    definition: 'A data structure that stores elements in contiguous memory',
    number: 1,
    created_at: '2024-08-15T09:15:00.000Z',
    updated_at: '2024-08-15T09:15:00.000Z',
    set_id: studySetId2,
    owner_id: userId2,
    term_content_type: 'text',
  },
  {
    id: cardId4,
    term: 'Linked List',
    definition:
      'A linear data structure where elements are linked using pointers',
    number: 2,
    created_at: '2024-08-15T09:20:00.000Z',
    updated_at: '2024-08-15T09:20:00.000Z',
    set_id: studySetId2,
    owner_id: userId2,
    term_content_type: 'text',
  },
];

export async function seedCards(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding cards...');
  await drizzle.insert(cards).values(CARDS_SEED);
  console.log('✅ cards seeded');
}

export async function clearCards(drizzle: DatabaseProvider) {
  await drizzle.delete(cards);
}
