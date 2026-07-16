import 'dotenv/config';
import { drizzle, PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';
import * as schema from '../src/drizzle/schema';
import { v6 as uuidv6 } from 'uuid';
import * as argon2 from 'argon2';
import { Role } from '../src/auth/roles';

const connection: Sql = postgres(process.env.DATABASE_URL as string, {
  max: 5,
});
const db = drizzle(connection, { schema });

async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength: 32,
    timeCost: 2,
    memoryCost: 2 ** 16,
  });
}

async function resetDatabase() {
  console.log('🗑️ Resetting database...');

  await db.delete(schema.classroomactivities);
  await db.delete(schema.classroomsets);
  await db.delete(schema.classroomusers);
  await db.delete(schema.classrooms);
  await db.delete(schema.sessionpins);
  await db.delete(schema.sessioncards);
  await db.delete(schema.studysessions);
  await db.delete(schema.setlikes);
  await db.delete(schema.pins);
  await db.delete(schema.cards);
  await db.delete(schema.courseWidgets);
  await db.delete(schema.courseWorkspaces);
  await db.delete(schema.courseDocumentChunks);
  await db.delete(schema.courseDocuments);
  await db.delete(schema.courseSets);
  await db.delete(schema.courseRows);
  await db.delete(schema.courseTables);
  await db.delete(schema.courseUsers);
  await db.delete(schema.courses);
  await db.delete(schema.boardUsers);
  await db.delete(schema.boards);
  await db.delete(schema.images);
  await db.delete(schema.visualsets);
  await db.delete(schema.studysets);
  await db.delete(schema.studoprofilecommunities);
  await db.delete(schema.tracksets);
  await db.delete(schema.studotracks);
  await db.delete(schema.studoprofiles);
  await db.delete(schema.profiles);
  await db.delete(schema.users);

  console.log('✅ Database reset completed\n');
}

export async function seedStudo(
  db: PostgresJsDatabase<typeof schema> & {
    $client: postgres.Sql;
  },
) {
  try {
    console.log('Starting seed process...\n');

    // === IDs ===
    const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
    const userId2 = uuidv6();
    const userId3 = uuidv6();
    const userId4 = uuidv6();

    const studySetId1 = uuidv6();
    const studySetId2 = uuidv6();
    const visualSetId1 = uuidv6();

    const classroomId1 = uuidv6();
    const classroomId2 = uuidv6();
    const classroomId3 = uuidv6();
    const classroomId4 = uuidv6();
    const classroomId5 = uuidv6();

    const imageId1 = uuidv6();
    const cardId1 = uuidv6();
    const cardId2 = uuidv6();
    const cardId3 = uuidv6();
    const cardId4 = uuidv6();
    const pinId1 = uuidv6();
    const pinId2 = uuidv6();

    const setLike1 = uuidv6();
    const setLike2 = uuidv6();
    const setLike3 = uuidv6();
    const classAct1 = uuidv6();

    // Study session IDs
    const sessionId1 = uuidv6();
    const sessionId2 = uuidv6();
    const sessionId3 = uuidv6();
    const sessionId4 = uuidv6();
    const sessionId5 = uuidv6();

    //chat
    const chatId1 = uuidv6();
    const chatId2 = uuidv6();
    const chatId3 = uuidv6();

    const message1 = uuidv6();
    const message2 = uuidv6();
    const message3 = uuidv6();
    const message4 = uuidv6();
    const message5 = uuidv6();
    const message6 = uuidv6();

    // course / board
    const boardId1 = uuidv6();
    const courseId1 = uuidv6(); // zit in board
    const courseId2 = uuidv6(); // standalone
    const workspaceId1 = uuidv6();
    const documentId1 = uuidv6();
    const tableId1 = uuidv6();

    // === 1. Users ===
    console.log('Seeding users...');
    await db.insert(schema.users).values([
      {
        id: userId1,
        email: 'support@studo.study',
        passwordHash: await hashPassword('Wachtwoord'),
        displayName: 'Studo Admin',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
        joinDate: new Date('2024-01-15T10:00:00.000Z'),
        totalSets: 2,
        streakStarted: new Date('2024-10-01T08:00:00.000Z'),
        streakCount: 29,
        streakLastUpdate: new Date('2024-10-29T09:30:00.000Z'),
        lastLogin: new Date('2024-10-30T08:00:00.000Z'),
        roles: [Role.USER, Role.ADMIN],
        publicRole: 'owner',
        verified: true,
        banned: false,
      },
      {
        id: userId2,
        email: 'paulallan@example.com',
        passwordHash: await hashPassword('123'),
        displayName: 'Paul Allan',
        imgUrl: 'https://i.pravatar.cc/150?img=2',
        joinDate: new Date('2024-02-20T14:30:00.000Z'),
        totalSets: 1,
        streakStarted: new Date('2024-10-15T10:00:00.000Z'),
        streakCount: 15,
        streakLastUpdate: new Date('2024-10-30T07:15:00.000Z'),
        lastLogin: new Date('2024-10-30T07:15:00.000Z'),
        roles: [Role.USER],
        publicRole: 'student',
        verified: false,
        banned: false,
      },
      {
        id: userId3,
        email: 'teacher@example.com',
        passwordHash: await hashPassword('123'),
        displayName: 'Carol Williams',
        imgUrl: 'https://i.pravatar.cc/150?img=3',
        joinDate: new Date('2023-08-01T09:00:00.000Z'),
        totalSets: 0,
        streakStarted: null,
        streakCount: null,
        streakLastUpdate: new Date('2024-10-30T08:00:00.000Z'),
        lastLogin: new Date('2024-10-30T08:00:00.000Z'),
        roles: [Role.USER],
        publicRole: 'teacher',
        verified: false,
        banned: false,
      },
      {
        id: userId4,
        email: 'geneeskunde@studo.study',
        passwordHash: await hashPassword('123'),
        displayName: 'geneeskunde',
        imgUrl: 'https://i.pravatar.cc/150?img=3',
        joinDate: new Date('2023-08-01T09:00:00.000Z'),
        totalSets: 0,
        streakStarted: null,
        streakCount: null,
        streakLastUpdate: new Date('2024-10-30T08:00:00.000Z'),
        lastLogin: new Date('2024-10-30T08:00:00.000Z'),
        roles: [Role.USER, Role.ADMIN, Role.VERIFIED],
        publicRole: 'Studo Profile',
        verified: true,
        banned: false,
      },
    ]);
    console.log('Users seeded\n');

    // === 2. Profiles ===
    console.log('Seeding profiles...');
    await db.insert(schema.profiles).values([
      {
        userId: userId1,
        displayName: 'Studo Admin',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
        bannerUrl: '',
        joinDate: new Date('2024-01-15T10:00:00.000Z'),
        streak: 29,
        verified: false,
        tags: ['Studo Admin'],
      },
      {
        userId: userId2,
        displayName: 'Paul Allan',
        imgUrl: 'https://i.pravatar.cc/150?img=2',
        bannerUrl: '',
        joinDate: new Date('2024-02-20T14:30:00.000Z'),
        streak: 15,
        verified: false,
        tags: ['Paul Allan'],
      },
      {
        userId: userId3,
        displayName: 'Carol Williams',
        imgUrl: 'https://i.pravatar.cc/150?img=3',
        bannerUrl: '',
        joinDate: new Date('2023-08-01T09:00:00.000Z'),
        streak: 0,
        verified: false,
        tags: ['Carol Williams'],
      },
    ]);
    console.log('Profiles seeded\n');

    // === 3. Studoprofiles ===
    const trackId1 = uuidv6();
    const trackId2 = uuidv6();
    const trackId3 = uuidv6();
    const trackId4 = uuidv6();
    const trackId5 = uuidv6();

    console.log('Seeding studoprofiles...');
    await db.insert(schema.studoprofiles).values([
      {
        id: userId1,
        displayName: 'Geneeskunde',
        imgUrl: '',
        bannerUrl: 'https://wallpaperaccess.com//full/1330480.jpg',
        tags: ['geneeskunde', 'anatomie', 'ingangsexamen', 'ugent', 'kuleuven'],
      },
    ]);

    console.log('Seeding studotracks...');
    await db.insert(schema.studotracks).values([
      {
        id: trackId1,
        studoprofileId: userId1,
        trackName: 'Biologie',
        iconName: 'biology',
        grade: 'Ingangsexamen',
      },
      {
        id: trackId2,
        studoprofileId: userId1,
        trackName: 'Chemie',
        iconName: 'chemistry',
        grade: 'Ingangsexamen',
      },
      {
        id: trackId3,
        studoprofileId: userId1,
        trackName: 'Fysica',
        iconName: 'physics',
        grade: 'Ingangsexamen',
      },
      {
        id: trackId4,
        studoprofileId: userId1,
        trackName: 'Wiskunde',
        iconName: 'maths',
        grade: 'Ingangsexamen',
      },
      {
        id: trackId5,
        studoprofileId: userId1,
        trackName: 'Fysiologie',
        iconName: 'physiology-icon',
        grade: 'eerste jaar',
      },
    ]);

    // === 5. Studysets ===
    console.log('Seeding studosets...');
    await db.insert(schema.studysets).values([
      {
        id: studySetId1,
        title: 'Cell Biology Basics',
        studoset: false,
        globalTermLanguage: 'en',
        globalDefinitionLanguage: 'en',
        createdAt: '2024-09-01T10:00:00.000Z',
        lastUpdated: '2024-09-01T10:00:00.000Z',
        publicSet: true,
        userId: userId1,
        displayName: 'Studo Admin',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
      },
      {
        id: studySetId2,
        title: 'Data Structures',
        studoset: false,
        globalTermLanguage: 'en',
        globalDefinitionLanguage: 'en',
        createdAt: '2024-08-15T09:00:00.000Z',
        lastUpdated: '2024-08-15T09:00:00.000Z',
        publicSet: false,
        userId: userId2,
        imgUrl: 'https://i.pravatar.cc/150?img=2',
        displayName: 'Paul ALlan',
      },
    ]);
    console.log('Studysets seeded\n');

    // === 6. Visualsets ===
    console.log('Seeding visualsets...');
    await db.insert(schema.visualsets).values([
      {
        id: visualSetId1,
        title: 'Human Anatomy',
        studoset: true,
        createdAt: '2024-09-10T11:00:00.000Z',
        lastUpdated: '2024-09-10T11:00:00.000Z',
        publicSet: true,
        userId: userId4,
        displayName: 'geneeskunde',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
      },
    ]);
    console.log('Visualsets seeded\n');

    // === 7. Cards ===
    console.log('Seeding cards...');
    await db.insert(schema.cards).values([
      {
        id: cardId1,
        term: 'Mitochondria',
        definition: 'The powerhouse of the cell',
        number: 1,
        termContentType: 'text',
        createdAt: '2024-09-01T10:15:00.000Z',
        updatedAt: '2024-09-01T10:15:00.000Z',
        setId: studySetId1,
        ownerId: userId1,
      },
      {
        id: cardId2,
        term: 'Nucleus',
        definition: 'Contains genetic material (DNA)',
        number: 2,
        termContentType: 'text',
        createdAt: '2024-09-01T10:20:00.000Z',
        updatedAt: '2024-09-01T10:20:00.000Z',
        setId: studySetId1,
        ownerId: userId1,
      },
      {
        id: cardId3,
        term: 'Array',
        definition:
          'A data structure that stores elements in contiguous memory',
        number: 1,
        termContentType: 'text',
        createdAt: '2024-08-15T09:15:00.000Z',
        updatedAt: '2024-08-15T09:15:00.000Z',
        setId: studySetId2,
        ownerId: userId2,
      },
      {
        id: cardId4,
        term: 'Linked List',
        definition:
          'A linear data structure where elements are linked using pointers',
        number: 2,
        termContentType: 'text',
        createdAt: '2024-08-15T09:20:00.000Z',
        updatedAt: '2024-08-15T09:20:00.000Z',
        setId: studySetId2,
        ownerId: userId2,
      },
    ]);
    console.log('Cards seeded\n');

    // === 8. Images & Pins ===
    console.log('Seeding images...');
    await db.insert(schema.images).values([
      {
        id: imageId1,
        title: 'Human Body Diagram',
        index: 1,
        url: 'https://example.com/images/human-body.jpg',
        gridX: 0,
        gridY: 0,
        scale: '1.0',
        setId: visualSetId1,
      },
    ]);
    console.log('Images seeded\n');

    console.log('Seeding pins...');
    await db.insert(schema.pins).values([
      {
        id: pinId1,
        definition: 'Heart',
        x: 150,
        y: 200,
        number: 1,
        createdAt: '2024-09-10T11:30:00.000Z',
        updatedAt: '2024-09-10T11:30:00.000Z',
        imageId: imageId1,
        setId: visualSetId1,
        ownerId: userId1,
      },
      {
        id: pinId2,
        definition: 'Brain',
        x: 150,
        y: 50,
        number: 2,
        createdAt: '2024-09-10T11:35:00.000Z',
        updatedAt: '2024-09-10T11:35:00.000Z',
        imageId: imageId1,
        setId: visualSetId1,
        ownerId: userId1,
      },
    ]);
    console.log('Pins seeded\n');

    // === 9. Setlikes ===
    console.log('Seeding setlikes...');
    await db.insert(schema.setlikes).values([
      {
        id: setLike1,
        userId: userId2,
        setId: studySetId1,
        setType: 'studyset',
        createdAt: '2024-10-15T12:00:00.000Z',
      },
      {
        id: setLike2,
        userId: userId1,
        setId: visualSetId1,
        setType: 'visualset',
        createdAt: '2024-10-20T09:30:00.000Z',
      },
      {
        id: setLike3,
        userId: userId3,
        setId: studySetId1,
        setType: 'studyset',
        createdAt: '2024-10-22T14:00:00.000Z',
      },
    ]);
    console.log('Setlikes seeded\n');

    console.log('Seeding tracksets...');
    await db.insert(schema.tracksets).values([
      {
        setId: visualSetId1,
        setType: 'visualset',
        trackId: trackId1,
      },
      {
        setId: studySetId1,
        setType: 'studyset',
        trackId: trackId1,
      },
    ]);

    // === 10. Studysessions ===
    console.log('Seeding studysessions...');
    await db.insert(schema.studysessions).values([
      {
        id: sessionId1,
        userId: userId1,
        setId: studySetId1,
        setType: 'studyset',
        startedAt: '2024-10-29T14:00:00.000Z',
        durationMin: 45,
        lastStudied: '2024-10-29T14:30:00.000Z',
        endedAt: '2024-10-29T14:45:00.000Z',
        index: 5,
        accuracy: 85,
        averageResponseTime: 3500,
        longestFocusStreak: 12,
        lastSeen: cardId1,
      },
      {
        id: sessionId2,
        userId: userId1,
        setId: studySetId2,
        setType: 'studyset',
        startedAt: '2024-10-29T15:00:00.000Z',
        durationMin: 30,
        lastStudied: '2024-10-29T15:30:00.000Z',
        endedAt: '2024-10-29T15:30:00.000Z',
        index: 3,
        accuracy: 78,
        averageResponseTime: 4000,
        longestFocusStreak: 8,
        lastSeen: cardId3,
      },
      {
        id: sessionId3,
        userId: userId1,
        setId: visualSetId1,
        setType: 'visualset',
        startedAt: '2024-10-29T16:00:00.000Z',
        durationMin: 25,
        lastStudied: '2024-10-29T16:25:00.000Z',
        endedAt: '2024-10-29T16:25:00.000Z',
        index: 4,
        accuracy: 90,
        averageResponseTime: 3000,
        longestFocusStreak: 10,
        lastSeen: pinId1,
      },
      {
        id: sessionId4,
        userId: userId2,
        setId: visualSetId1,
        setType: 'visualset',
        startedAt: '2024-10-30T08:00:00.000Z',
        durationMin: 30,
        endedAt: '2024-10-30T08:30:00.000Z',
        index: 3,
        accuracy: 92,
        averageResponseTime: 2800,
        longestFocusStreak: 8,
        lastSeen: pinId2,
        lastStudied: '2024-10-30T08:15:00.000Z',
      },
      {
        id: sessionId5,
        userId: userId2,
        setId: studySetId2,
        setType: 'studyset',
        startedAt: '2024-10-30T09:00:00.000Z',
        durationMin: 20,
        endedAt: '2024-10-30T09:20:00.000Z',
        index: 2,
        accuracy: 88,
        averageResponseTime: 3200,
        longestFocusStreak: 6,
        lastSeen: cardId3,
        lastStudied: '2024-10-30T09:10:00.000Z',
      },
    ]);
    console.log('Studysessions seeded\n');

    // === 11. SessionCards ===
    console.log('Seeding sessioncards...');
    await db.insert(schema.sessioncards).values([
      {
        id: uuidv6(),
        number: 1,
        cardViewcount: 3,
        cardTotalViewcount: 8,
        inQueue: false,
        mastered: true,
        timesRelearned: 1,
        cardId: cardId1,
        sessionId: sessionId1,
        ownerId: userId1,
      },
      {
        id: uuidv6(),
        number: 2,
        cardViewcount: 2,
        cardTotalViewcount: 5,
        inQueue: true,
        mastered: false,
        timesRelearned: 0,
        cardId: cardId2,
        sessionId: sessionId1,
        ownerId: userId1,
      },
      {
        id: uuidv6(),
        number: 1,
        cardViewcount: 4,
        cardTotalViewcount: 10,
        inQueue: false,
        mastered: true,
        timesRelearned: 2,
        cardId: cardId3,
        sessionId: sessionId2,
        ownerId: userId1,
      },
      {
        id: uuidv6(),
        number: 2,
        cardViewcount: 3,
        cardTotalViewcount: 7,
        inQueue: true,
        mastered: false,
        timesRelearned: 1,
        cardId: cardId4,
        sessionId: sessionId2,
        ownerId: userId1,
      },
      {
        id: uuidv6(),
        number: 1,
        cardViewcount: 2,
        cardTotalViewcount: 4,
        inQueue: false,
        mastered: true,
        timesRelearned: 0,
        cardId: cardId3,
        sessionId: sessionId5,
        ownerId: userId2,
      },
      {
        id: uuidv6(),
        number: 2,
        cardViewcount: 1,
        cardTotalViewcount: 2,
        inQueue: true,
        mastered: false,
        timesRelearned: 0,
        cardId: cardId4,
        sessionId: sessionId5,
        ownerId: userId2,
      },
    ]);
    console.log('SessionCards seeded\n');

    // === 12. SessionPins ===
    console.log('Seeding sessionpins...');
    await db.insert(schema.sessionpins).values([
      {
        id: uuidv6(),
        number: 1,
        pinViewcount: 5,
        pinTotalViewcount: 12,
        inQueue: false,
        mastered: true,
        timesRelearned: 1,
        pinId: pinId1,
        sessionId: sessionId3,
        ownerId: userId1,
      },
      {
        id: uuidv6(),
        number: 2,
        pinViewcount: 3,
        pinTotalViewcount: 8,
        inQueue: true,
        mastered: false,
        timesRelearned: 0,
        pinId: pinId2,
        sessionId: sessionId3,
        ownerId: userId1,
      },
      {
        id: uuidv6(),
        number: 1,
        pinViewcount: 4,
        pinTotalViewcount: 9,
        inQueue: false,
        mastered: true,
        timesRelearned: 1,
        pinId: pinId1,
        sessionId: sessionId4,
        ownerId: userId2,
      },
      {
        id: uuidv6(),
        number: 2,
        pinViewcount: 2,
        pinTotalViewcount: 5,
        inQueue: true,
        mastered: false,
        timesRelearned: 0,
        pinId: pinId2,
        sessionId: sessionId4,
        ownerId: userId2,
      },
    ]);
    console.log('SessionPins seeded\n');

    // === 13. Classrooms ===
    console.log('Seeding classrooms...');
    await db.insert(schema.classrooms).values([
      {
        id: classroomId1,
        name: 'Biology 101 - Fall 2024',
        ownerId: userId3,
        type: 'class_group',
        createdAt: '2024-08-20T10:00:00.000Z',
        verified: false,
        school: `Erasmus De Pinte`,
      },
      {
        id: classroomId3,
        name: 'KU Leuven - rechten',
        ownerId: userId3,
        type: 'university',
        createdAt: '2024-08-20T10:00:00.000Z',
        verified: true,
        school: `KU Leuven`,
      },
      {
        id: classroomId4,
        name: 'UGent - informatica',
        ownerId: userId3,
        type: 'university',
        createdAt: '2024-08-20T10:00:00.000Z',
        verified: true,
        school: `UGent`,
      },
      {
        id: classroomId5,
        name: 'UGent - bio engineering',
        ownerId: userId3,
        type: 'university',
        createdAt: '2024-08-20T10:00:00.000Z',
        verified: true,
        school: `UGent`,
      },
      {
        id: classroomId2,
        name: 'Advanced Computer Science',
        ownerId: userId3,
        type: 'study_group',
        createdAt: '2024-08-22T11:00:00.000Z',
        verified: false,
        school: `Ugent`,
      },
    ]);
    console.log('Classrooms seeded\n');

    // === 14. Classroomusers ===
    console.log('Seeding classroomusers...');
    await db.insert(schema.classroomusers).values([
      {
        userId: userId3,
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
      {
        userId: userId2,
        classroomId: classroomId1,
        role: 'student',
        joinedAt: '2024-08-25T10:00:00.000Z',
        position: 3,
      },
      {
        userId: userId3,
        classroomId: classroomId2,
        role: 'owner',
        joinedAt: '2024-08-22T11:00:00.000Z',
        position: 2,
      },
      {
        userId: userId2,
        classroomId: classroomId2,
        role: 'student',
        joinedAt: '2024-08-25T10:00:00.000Z',
        position: 1,
      },
      {
        userId: userId1,
        classroomId: classroomId2,
        role: 'student',
        joinedAt: '2024-08-25T10:00:00.000Z',
        position: 3,
      },
    ]);
    console.log('Classroomusers seeded\n');

    // === 15. Classroomsets ===
    console.log('Seeding classroomsets...');
    await db.insert(schema.classroomsets).values([
      {
        setId: studySetId1,
        setType: 'studyset',
        classroomId: classroomId1,
        addedBy: userId2,
      },
      {
        setId: visualSetId1,
        setType: 'visualset',
        classroomId: classroomId1,
        addedBy: userId1,
      },
    ]);
    console.log('Classroomsets seeded\n');

    // === 16. Classroomactivities ===
    console.log('Seeding classroomactivities...');
    await db.insert(schema.classroomactivities).values([
      {
        id: classAct1,
        classroomId: classroomId1,
        userId: userId1,
        displayName: 'Studo Admin',
        imgUrl: 'https://i.pravatar.cc/150?img=1',
        setId: studySetId1,
        setType: 'studyset',
        title: 'Cell Biology Basics',
        lastSeen: '2024-10-29T14:30:00.000Z',
      },
    ]);
    console.log('Classroomactivities seeded\n');

    // === 17. Studoprofile Communities ===
    console.log('Seeding studoprofilecommunities...');
    await db.insert(schema.studoprofilecommunities).values([
      {
        classroomId: classroomId3,
        classType: 'university',
        studoprofileId: userId1,
      },
      {
        classroomId: classroomId4,
        classType: 'university',
        studoprofileId: userId1,
      },
      {
        classroomId: classroomId5,
        classType: 'university',
        studoprofileId: userId1,
      },
    ]);
    console.log('Studoprofilecommunities seeded\n');

    // === 24. Chats ===
    console.log('Seeding chats...');
    await db.insert(schema.chat).values([
      {
        id: chatId1,
        userId: userId1,
        title: 'Statistiek vragen',
        creationDate: '2026-06-22T10:00:00.000Z',
        pinned: false,
      },
      {
        id: chatId2,
        userId: userId1,
        title: 'Nieuwe chat',
        creationDate: '2026-06-23T10:00:00.000Z',
        pinned: false,
      },
      {
        id: chatId3,
        userId: userId1,
        title: 'Data Science samenvatting',
        creationDate: '2026-06-22T10:10:00.000Z',
        pinned: true,
      },
    ]);
    console.log('Chats seeded\n');

    // === 25. Chat messages ===
    console.log('Seeding messages...');
    await db.insert(schema.chatMessage).values([
      {
        id: message1,
        chatId: chatId1,
        svenMessage: false,
        sortIndex: 1,
        content: 'Goodmorning',
        createdAt: '2026-06-22T10:10:00.000Z',
      },
      {
        id: message2,
        chatId: chatId1,
        svenMessage: true,
        sortIndex: 2,
        content: 'Hi, how are you? I am Sven, your assistant.',
        createdAt: '2026-06-22T10:12:00.000Z',
      },
      {
        id: message3,
        chatId: chatId1,
        svenMessage: false,
        sortIndex: 3,
        content: 'Kan je de centrale limietstelling uitleggen?',
        createdAt: '2026-06-22T10:13:00.000Z',
      },
      {
        id: message4,
        chatId: chatId1,
        svenMessage: true,
        sortIndex: 4,
        content:
          'Zeker! De centrale limietstelling zegt dat het gemiddelde van een grote steekproef ongeveer normaal verdeeld is, ongeacht de oorspronkelijke verdeling.',
        createdAt: '2026-06-22T10:13:30.000Z',
      },
      {
        id: message5,
        chatId: chatId3,
        svenMessage: false,
        sortIndex: 1,
        content: 'Vat deze studieset samen voor mij.',
        createdAt: '2026-06-22T10:11:00.000Z',
      },
      {
        id: message6,
        chatId: chatId3,
        svenMessage: true,
        sortIndex: 2,
        content: 'Hier is een samenvatting van je set en de eerste kaart.',
        createdAt: '2026-06-22T10:11:20.000Z',
      },
    ]);
    console.log('Chatmessages seeded\n');

    // === 26. Chat message payloads ===
    console.log('Seeding payloads...');
    await db.insert(schema.chatMessagePayload).values([
      {
        id: uuidv6(),
        messageId: message3,
        studosetId: null,
        cardId: null,
      },
      {
        id: uuidv6(),
        messageId: message5,
        studosetId: studySetId1,
        cardId: null,
      },
      {
        id: uuidv6(),
        messageId: message6,
        studosetId: studySetId1,
        cardId: cardId1,
      },
    ]);
    console.log('Payload seeded\n');

    // === 27. Boards ===
    console.log('Seeding boards...');
    await db.insert(schema.boards).values([
      {
        id: boardId1,
        title: 'Geneeskunde 2e bach',
        icon: 'board_icon',
        publicBoard: false,
        academyYear: 2025,
        institute: 'HOGENT',
      },
    ]);
    console.log('Boards seeded\n');

    // === 28. Courses ===
    console.log('Seeding courses...');
    await db.insert(schema.courses).values([
      {
        id: courseId1,
        boardId: boardId1, // erft academyYear/institute van het board
        title: 'Anatomie',
        icon: 'course_icon',
        publicCourse: false,
        examDate: '2026-01-15',
      },
      {
        id: courseId2,
        boardId: null, // standalone
        title: 'Losse cursus Statistiek',
        icon: 'course_icon',
        publicCourse: true,
        academyYear: 2025,
        institute: 'UGent',
      },
    ]);
    console.log('Courses seeded\n');

    // === 29. Board users ===
    console.log('Seeding board users...');
    await db.insert(schema.boardUsers).values([
      { boardId: boardId1, userId: userId1, role: 'owner' },
      { boardId: boardId1, userId: userId2, role: 'viewer' },
    ]);
    console.log('Board users seeded\n');

    // === 30. Course users ===
    console.log('Seeding course users...');
    await db.insert(schema.courseUsers).values([
      { userId: userId1, courseId: courseId1, role: 'owner' },
      { userId: userId1, courseId: courseId2, role: 'owner' },
      { userId: userId3, courseId: courseId2, role: 'editor' },
    ]);
    console.log('Course users seeded\n');

    // === 31. Course workspace + widgets ===
    console.log('Seeding course workspace...');
    await db
      .insert(schema.courseWorkspaces)
      .values([{ id: workspaceId1, courseId: courseId1 }]);
    await db.insert(schema.courseWidgets).values([
      { workspaceId: workspaceId1, type: 'notes', x: 0, y: 0, w: 2, h: 2 },
      { workspaceId: workspaceId1, type: 'flashcards', x: 2, y: 0, w: 2, h: 2 },
      { workspaceId: workspaceId1, type: 'timer', x: 0, y: 2, w: 1, h: 1 },
    ]);
    console.log('Course workspace seeded\n');

    // === 32. Course documents + chunks ===
    console.log('Seeding course documents...');
    await db.insert(schema.courseDocuments).values([
      {
        id: documentId1,
        courseId: courseId1,
        uploaderId: userId1,
        title: 'Hoofdstuk 1 - Skelet',
        author: 'Prof. Janssens',
        storageKey: `courses/${courseId1}/skelet.pdf`,
        mimeType: 'pdf',
        status: 'finished',
        pageCount: 42,
        wordCount: 12000,
      },
    ]);
    await db.insert(schema.courseDocumentChunks).values([
      {
        documentId: documentId1,
        chunkIndex: 0,
        pageStart: 1,
        pageEnd: 2,
        text: 'Het menselijk skelet bestaat uit 206 botten...',
      },
      {
        documentId: documentId1,
        chunkIndex: 1,
        pageStart: 3,
        pageEnd: 4,
        text: 'De wervelkolom bestaat uit 33 wervels...',
      },
    ]);
    console.log('Course documents seeded\n');

    // === 33. Course sets ===
    console.log('Seeding course sets...');
    await db.insert(schema.courseSets).values([
      {
        setId: studySetId1,
        setType: 'studoset',
        addedBy: userId1,
        courseId: courseId1,
      },
    ]);
    console.log('Course sets seeded\n');

    // === 34. Course tables + rows ===
    console.log('Seeding course tables...');
    await db
      .insert(schema.courseTables)
      .values([{ id: tableId1, courseId: courseId1, title: 'Studieplanning' }]);
    await db.insert(schema.courseRows).values([
      { tableId: tableId1, position: 0, createdBy: userId1 },
      { tableId: tableId1, position: 1, createdBy: userId1 },
    ]);
    console.log('Course tables seeded\n');

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

export async function main() {
  console.log('🌱 Starting database seeding...\n');

  await resetDatabase();
  await seedStudo(db);

  console.log('🎉 Database seeding completed successfully!');
}

if (require.main === module) {
  main()
    .then(async () => {
      await connection.end();
    })
    .catch(async (e) => {
      console.error(e);
      await connection.end();
      process.exit(1);
    });
}
export default class seed {}
