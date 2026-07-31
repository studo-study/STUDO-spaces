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
const studySetId3 = 'a4f2e8c1-9b3d-4e6a-8f2c-1d5e7a9b0c3e';

const EN_NL_PAIRS: [string, string][] = [
  ['House', 'Huis'],
  ['Dog', 'Hond'],
  ['Cat', 'Kat'],
  ['Water', 'Water'],
  ['Bread', 'Brood'],
  ['Apple', 'Appel'],
  ['Book', 'Boek'],
  ['Table', 'Tafel'],
  ['Chair', 'Stoel'],
  ['Car', 'Auto'],
  ['Tree', 'Boom'],
  ['Flower', 'Bloem'],
  ['Sun', 'Zon'],
  ['Moon', 'Maan'],
  ['Star', 'Ster'],
  ['Friend', 'Vriend'],
  ['Family', 'Familie'],
  ['School', 'School'],
  ['Teacher', 'Leraar'],
  ['Student', 'Student'],
  ['City', 'Stad'],
  ['Street', 'Straat'],
  ['Window', 'Raam'],
  ['Door', 'Deur'],
  ['Kitchen', 'Keuken'],
  ['Garden', 'Tuin'],
  ['Bicycle', 'Fiets'],
  ['Train', 'Trein'],
  ['Money', 'Geld'],
  ['Time', 'Tijd'],
];

const ENNL_CARDS_SEED = EN_NL_PAIRS.map(([term, definition], i) => ({
  id: `b0000000-0000-4000-8000-${String(i + 1).padStart(12, '0')}`,
  term,
  definition,
  number: i + 1,
  createdAt: '2024-10-01T08:15:00.000Z',
  updatedAt: '2024-10-01T08:15:00.000Z',
  setId: studySetId3,
  ownerId: userId1,
  termContentType: 'text',
}));

export const CARDS_SEED = [
  {
    id: cardId1,
    term: 'Mitochondria',
    definition: 'The powerhouse of the cell',
    number: 1,
    createdAt: '2024-09-01T10:15:00.000Z',
    updatedAt: '2024-09-01T10:15:00.000Z',
    setId: studySetId1,
    ownerId: userId1,
    termContentType: 'text',
  },
  {
    id: cardId2,
    term: 'Nucleus',
    definition: 'Contains genetic material (DNA)',
    number: 2,
    createdAt: '2024-09-01T10:20:00.000Z',
    updatedAt: '2024-09-01T10:20:00.000Z',
    setId: studySetId1,
    ownerId: userId1,
    termContentType: 'text',
  },
  {
    id: cardId3,
    term: 'Array',
    definition: 'A data structure that stores elements in contiguous memory',
    number: 1,
    createdAt: '2024-08-15T09:15:00.000Z',
    updatedAt: '2024-08-15T09:15:00.000Z',
    setId: studySetId2,
    ownerId: userId2,
    termContentType: 'text',
  },
  {
    id: cardId4,
    term: 'Linked List',
    definition:
      'A linear data structure where elements are linked using pointers',
    number: 2,
    createdAt: '2024-08-15T09:20:00.000Z',
    updatedAt: '2024-08-15T09:20:00.000Z',
    setId: studySetId2,
    ownerId: userId2,
    termContentType: 'text',
  },
  ...ENNL_CARDS_SEED,
];

export async function seedCards(drizzle: DatabaseProvider) {
  console.log('🌱 Seeding cards...');
  await drizzle.insert(cards).values(CARDS_SEED);
  console.log('✅ cards seeded');
}

export async function clearCards(drizzle: DatabaseProvider) {
  await drizzle.delete(cards);
}
