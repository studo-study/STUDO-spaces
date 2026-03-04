import { drizzle } from 'drizzle-orm/postgres-js';
import postgres, { Sql } from 'postgres';
import * as schema from './schema';
import { v4 as uuidv4, v6 as uuidv6 } from 'uuid';
import * as argon2 from 'argon2';
import { Role } from '../auth/roles';

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
  await db.delete(schema.images);
  await db.delete(schema.visualsets);
  await db.delete(schema.studysets);
  await db.delete(schema.folders);
  await db.delete(schema.profiles);
  await db.delete(schema.users);

  console.log('✅ Database reset completed\n');
}

async function seedStudo() {
  try {
    console.log('Starting seed process...\n');

    // === IDs ===
    const userId1 = '1f0c076e-f30c-64b0-a0f3-d5a021c6a9cb';
    const userId2 = uuidv6();
    const userId3 = uuidv6();
    const userId4 = uuidv6();
    const folderId1 = uuidv6();
    const folderId2 = uuidv6();

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

    // === 1. Users ===
    console.log('Seeding users...');
    await db.insert(schema.users).values([
      {
        id: userId1,
        email: 'support@studo.study',
        passwordHash: await hashPassword('Wachtwoord'),
        displayName: 'Studo Admin',
        img_url: 'https://i.pravatar.cc/150?img=1',
        join_date: '2024-01-15T10:00:00.000Z',
        totalSets: 2,
        streak_started: '2024-10-01T08:00:00.000Z',
        streak_count: 29,
        streak_last_update: '2024-10-29T09:30:00.000Z',
        last_login: '2024-10-30T08:00:00.000Z',
        roles: [Role.USER, Role.ADMIN],
        publicRole: 'owner',
        verified: true,
      },
      {
        id: userId2,
        email: 'paulallan@example.com',
        passwordHash: await hashPassword('123'),
        displayName: 'Paul Allan',
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
      {
        id: userId3,
        email: 'teacher@example.com',
        passwordHash: await hashPassword('123'),
        displayName: 'Carol Williams',
        img_url: 'https://i.pravatar.cc/150?img=3',
        join_date: '2023-08-01T09:00:00.000Z',
        totalSets: 0,
        streak_started: null,
        streak_count: null,
        streak_last_update: '2024-10-30T08:00:00.000Z',
        last_login: '2024-10-30T08:00:00.000Z',
        roles: [Role.USER],
        publicRole: 'teacher',
        verified: false,
      },

      {
        id: userId4,
        email: 'geneeskunde@studo.study',
        passwordHash: await hashPassword('123'),
        displayName: 'geneeskunde',
        img_url: 'https://i.pravatar.cc/150?img=3',
        join_date: '2023-08-01T09:00:00.000Z',
        totalSets: 0,
        streak_started: null,
        streak_count: null,
        streak_last_update: '2024-10-30T08:00:00.000Z',
        last_login: '2024-10-30T08:00:00.000Z',
        roles: [Role.USER, Role.ADMIN, Role.VERIFIED],
        publicRole: 'Studo Profile',
        verified: true,
      },
    ]);
    console.log('Users seeded\n');

    // === 2. Profiles ===
    console.log('Seeding profiles...');
    await db.insert(schema.profiles).values([
      {
        user_id: userId1,
        displayName: 'Studo Admin',
        img_url: 'https://i.pravatar.cc/150?img=1',
        banner_url: '',
        join_date: '2024-01-15T10:00:00.000Z',
        streak: 29,
        verified: false,
        studoProfile: false,
        tags: ['Studo Admin'],
      },
      {
        user_id: userId2,
        displayName: 'Paul Allan',
        img_url: 'https://i.pravatar.cc/150?img=2',
        banner_url: '',
        join_date: '2024-02-20T14:30:00.000Z',
        streak: 15,
        verified: false,
        studoProfile: false,
        tags: ['Paul Allan'],
      },
      {
        user_id: userId3,
        displayName: 'Carol Williams',
        img_url: 'https://i.pravatar.cc/150?img=3',
        banner_url: '',
        join_date: '2023-08-01T09:00:00.000Z',
        streak: 0,
        verified: false,
        studoProfile: false,
        tags: ['Carol Williams'],
      },
      {
        user_id: userId4,
        displayName: 'geneeskunde',
        img_url: '',
        banner_url: 'https://wallpaperaccess.com//full/1330480.jpg',
        join_date: '2023-08-01T09:00:00.000Z',
        streak: 0,
        verified: true,
        studoProfile: true,
        tags: [
          'geneeskunde',
          'anatomie',
          'ingangsexamen',
          'ugent',
          'kuleuven',
          'Vlaanderen',
          'toelatingsexamen arts',
          'UGent',
          'KU Leuven',
          'UAntwerpen',
          'UHasselt',
          'VUB',
        ],
      },
    ]);
    console.log('Profiles seeded\n');

    // === 3. Folders ===
    console.log('Seeding folders...');
    await db.insert(schema.folders).values([
      { id: folderId1, name: 'Biology Notes', owner_id: userId1 },
      { id: folderId2, name: 'Computer Science', owner_id: userId2 },
    ]);
    console.log('Folders seeded\n');

    // === 4. Studysets ===
    console.log('Seeding studosets...');
    await db.insert(schema.studysets).values([
      {
        id: studySetId1,
        title: 'Cell Biology Basics',
        course: 'Biology 101',
        studoset: false,
        global_term_language: 'en',
        global_definition_language: 'en',
        created_at: '2024-09-01T10:00:00.000Z',
        last_updated: '2024-09-01T10:00:00.000Z',
        public_set: true,
        user_id: userId1,
        displayName: 'Studo Admin',
        img_url: 'https://i.pravatar.cc/150?img=1',
        folder_id: folderId1,
      },
      {
        id: studySetId2,
        title: 'Data Structures',
        course: 'CS 201',
        studoset: false,
        global_term_language: 'en',
        global_definition_language: 'en',
        created_at: '2024-08-15T09:00:00.000Z',
        last_updated: '2024-08-15T09:00:00.000Z',
        public_set: false,
        user_id: userId2,
        img_url: 'https://i.pravatar.cc/150?img=2',
        displayName: 'Paul ALlan',
        folder_id: folderId2,
      },
    ]);
    console.log('Studysets seeded\n');

    // === 5. Visualsets ===
    console.log('Seeding visualsets...');
    await db.insert(schema.visualsets).values([
      {
        id: visualSetId1,
        title: 'Human Anatomy',
        course: 'Anatomy 101',
        studoset: true,
        created_at: '2024-09-10T11:00:00.000Z',
        last_updated: '2024-09-10T11:00:00.000Z',
        public_set: true,
        user_id: userId4,
        displayName: 'geneeskunde',
        img_url: 'https://i.pravatar.cc/150?img=1',
        folder_id: folderId1,
      },
    ]);
    console.log('Visualsets seeded\n');

    // === 6. Cards ===
    console.log('Seeding cards...');
    await db.insert(schema.cards).values([
      {
        id: cardId1,
        term: 'Mitochondria',
        definition: 'The powerhouse of the cell',
        number: 1,
        created_at: '2024-09-01T10:15:00.000Z',
        updated_at: '2024-09-01T10:15:00.000Z',
        set_id: studySetId1,
        owner_id: userId1,
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
      },
      {
        id: cardId3,
        term: 'Array',
        definition:
          'A data structure that stores elements in contiguous memory',
        number: 1,
        created_at: '2024-08-15T09:15:00.000Z',
        updated_at: '2024-08-15T09:15:00.000Z',
        set_id: studySetId2,
        owner_id: userId2,
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
      },
    ]);
    console.log('Cards seeded\n');

    // === 7. Images & Pins ===
    console.log('Seeding images...');
    await db.insert(schema.images).values([
      {
        id: imageId1,
        title: 'Human Body Diagram',
        index: 1,
        url: 'https://example.com/images/human-body.jpg',
        grid_x: 0,
        grid_y: 0,
        scale: '1.0',
        set_id: visualSetId1,
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
        created_at: '2024-09-10T11:30:00.000Z',
        updated_at: '2024-09-10T11:30:00.000Z',
        image_id: imageId1,
        set_id: visualSetId1,
        owner_id: userId1,
      },
      {
        id: pinId2,
        definition: 'Brain',
        x: 150,
        y: 50,
        number: 2,
        created_at: '2024-09-10T11:35:00.000Z',
        updated_at: '2024-09-10T11:35:00.000Z',
        image_id: imageId1,
        set_id: visualSetId1,
        owner_id: userId1,
      },
    ]);
    console.log('Pins seeded\n');

    // === 8. Setlikes ===
    console.log('Seeding setlikes...');
    await db.insert(schema.setlikes).values([
      {
        id: setLike1,
        user_id: userId2,
        set_id: studySetId1,
        set_type: 'studyset',
        created_at: '2024-10-15T12:00:00.000Z',
      },
      {
        id: setLike2,
        user_id: userId1,
        set_id: visualSetId1,
        set_type: 'visualset',
        created_at: '2024-10-20T09:30:00.000Z',
      },
      {
        id: setLike3,
        user_id: userId3,
        set_id: studySetId1,
        set_type: 'studyset',
        created_at: '2024-10-22T14:00:00.000Z',
      },
    ]);
    console.log('Setlikes seeded\n');

    // === 9. Studysessions ===
    console.log('Seeding studysessions...');
    await db.insert(schema.studysessions).values([
      {
        id: sessionId1,
        user_id: userId1,
        set_id: studySetId1,
        set_type: 'studyset',
        started_at: '2024-10-29T14:00:00.000Z',
        duration_min: 45,
        last_studied: '2024-10-29T14:30:00.000Z',
        ended_at: '2024-10-29T14:45:00.000Z',
        index: 5,
        accuracy: 85,
        average_response_time: 3500,
        longest_focus_streak: 12,
        last_seen: cardId1,
      },
      {
        id: sessionId2,
        user_id: userId1,
        set_id: studySetId2,
        set_type: 'studyset',
        started_at: '2024-10-29T15:00:00.000Z',
        duration_min: 30,
        last_studied: '2024-10-29T15:30:00.000Z',
        ended_at: '2024-10-29T15:30:00.000Z',
        index: 3,
        accuracy: 78,
        average_response_time: 4000,
        longest_focus_streak: 8,
        last_seen: cardId3,
      },
      {
        id: sessionId3,
        user_id: userId1,
        set_id: visualSetId1,
        set_type: 'visualset',
        started_at: '2024-10-29T16:00:00.000Z',
        duration_min: 25,
        last_studied: '2024-10-29T16:25:00.000Z',
        ended_at: '2024-10-29T16:25:00.000Z',
        index: 4,
        accuracy: 90,
        average_response_time: 3000,
        longest_focus_streak: 10,
        last_seen: pinId1,
      },
      {
        id: sessionId4,
        user_id: userId2,
        set_id: visualSetId1,
        set_type: 'visualset',
        started_at: '2024-10-30T08:00:00.000Z',
        duration_min: 30,
        ended_at: '2024-10-30T08:30:00.000Z',
        index: 3,
        accuracy: 92,
        average_response_time: 2800,
        longest_focus_streak: 8,
        last_seen: pinId2,
        last_studied: '2024-10-30T08:15:00.000Z',
      },
      {
        id: sessionId5,
        user_id: userId2,
        set_id: studySetId2,
        set_type: 'studyset',
        started_at: '2024-10-30T09:00:00.000Z',
        duration_min: 20,
        ended_at: '2024-10-30T09:20:00.000Z',
        index: 2,
        accuracy: 88,
        average_response_time: 3200,
        longest_focus_streak: 6,
        last_seen: cardId3,
        last_studied: '2024-10-30T09:10:00.000Z',
      },
    ]);
    console.log('Studysessions seeded\n');

    // === 10. SessionCards ===
    console.log('Seeding sessioncards...');
    await db.insert(schema.sessioncards).values([
      // Session 1 (userId1, studySetId1)
      {
        id: uuidv6(),
        number: 1,
        card_viewcount: 3,
        card_total_viewcount: 8,
        inQueue: false,
        mastered: true,
        times_relearned: 1,
        card_id: cardId1,
        session_id: sessionId1,
        owner_id: userId1,
      },
      {
        id: uuidv6(),
        number: 2,
        card_viewcount: 2,
        card_total_viewcount: 5,
        inQueue: true,
        mastered: false,
        times_relearned: 0,
        card_id: cardId2,
        session_id: sessionId1,
        owner_id: userId1,
      },
      // Session 2 (userId1, studySetId2)
      {
        id: uuidv6(),
        number: 1,
        card_viewcount: 4,
        card_total_viewcount: 10,
        inQueue: false,
        mastered: true,
        times_relearned: 2,
        card_id: cardId3,
        session_id: sessionId2,
        owner_id: userId1,
      },
      {
        id: uuidv6(),
        number: 2,
        card_viewcount: 3,
        card_total_viewcount: 7,
        inQueue: true,
        mastered: false,
        times_relearned: 1,
        card_id: cardId4,
        session_id: sessionId2,
        owner_id: userId1,
      },
      // Session 5 (userId2, studySetId2)
      {
        id: uuidv6(),
        number: 1,
        card_viewcount: 2,
        card_total_viewcount: 4,
        inQueue: false,
        mastered: true,
        times_relearned: 0,
        card_id: cardId3,
        session_id: sessionId5,
        owner_id: userId2,
      },
      {
        id: uuidv6(),
        number: 2,
        card_viewcount: 1,
        card_total_viewcount: 2,
        inQueue: true,
        mastered: false,
        times_relearned: 0,
        card_id: cardId4,
        session_id: sessionId5,
        owner_id: userId2,
      },
    ]);
    console.log('SessionCards seeded\n');

    // === 11. SessionPins ===
    console.log('Seeding sessionpins...');
    await db.insert(schema.sessionpins).values([
      // Session 3 (userId1, visualSetId1)
      {
        id: uuidv6(),
        number: 1,
        pin_viewcount: 5,
        pin_total_viewcount: 12,
        inQueue: false,
        mastered: true,
        times_relearned: 1,
        pin_id: pinId1,
        session_id: sessionId3,
        owner_id: userId1,
      },
      {
        id: uuidv6(),
        number: 2,
        pin_viewcount: 3,
        pin_total_viewcount: 8,
        inQueue: true,
        mastered: false,
        times_relearned: 0,
        pin_id: pinId2,
        session_id: sessionId3,
        owner_id: userId1,
      },
      // Session 4 (userId2, visualSetId1)
      {
        id: uuidv6(),
        number: 1,
        pin_viewcount: 4,
        pin_total_viewcount: 9,
        inQueue: false,
        mastered: true,
        times_relearned: 1,
        pin_id: pinId1,
        session_id: sessionId4,
        owner_id: userId2,
      },
      {
        id: uuidv6(),
        number: 2,
        pin_viewcount: 2,
        pin_total_viewcount: 5,
        inQueue: true,
        mastered: false,
        times_relearned: 0,
        pin_id: pinId2,
        session_id: sessionId4,
        owner_id: userId2,
      },
    ]);
    console.log('SessionPins seeded\n');

    // === 12. Classrooms ===
    console.log('Seeding classrooms...');
    await db.insert(schema.classrooms).values([
      {
        id: classroomId1,
        name: 'Biology 101 - Fall 2024',
        owner_id: userId3,
        type: 'class_group',
        created_at: '2024-08-20T10:00:00.000Z',
        verified: false,
        school: `Erasmus De Pinte`,
      },
      {
        id: classroomId3,
        name: 'KU Leuven - rechten',
        owner_id: userId3,
        type: 'university',
        created_at: '2024-08-20T10:00:00.000Z',
        verified: true,
        school: `KU Leuven`,
      },
      {
        id: classroomId4,
        name: 'UGent - informatica',
        owner_id: userId3,
        type: 'university',
        created_at: '2024-08-20T10:00:00.000Z',
        verified: true,
        school: `UGent`,
      },
      {
        id: classroomId5,
        name: 'UGent - bio engineering',
        owner_id: userId3,
        type: 'university',
        created_at: '2024-08-20T10:00:00.000Z',
        verified: true,
        school: `UGent`,
      },
      {
        id: classroomId2,
        name: 'Advanced Computer Science',
        owner_id: userId3,
        type: 'study_group',
        created_at: '2024-08-22T11:00:00.000Z',
        verified: false,
        school: `Ugent`,
      },
    ]);
    console.log('Classrooms seeded\n');

    // === 13. Classroomusers ===
    console.log('Seeding classroomusers...');
    await db.insert(schema.classroomusers).values([
      {
        user_id: userId3,
        classroom_id: classroomId1,
        role: 'owner',
        joined_at: '2024-08-20T10:00:00.000Z',
        position: 1,
      },
      {
        user_id: userId1,
        classroom_id: classroomId1,
        role: 'student',
        joined_at: '2024-08-22T10:00:00.000Z',
        position: 2,
      },
      {
        user_id: userId2,
        classroom_id: classroomId1,
        role: 'student',
        joined_at: '2024-08-25T10:00:00.000Z',
        position: 3,
      },
      {
        user_id: userId3,
        classroom_id: classroomId2,
        role: 'owner',
        joined_at: '2024-08-22T11:00:00.000Z',
        position: 2,
      },
      {
        user_id: userId2,
        classroom_id: classroomId2,
        role: 'student',
        joined_at: '2024-08-25T10:00:00.000Z',
        position: 1,
      },
      {
        user_id: userId1,
        classroom_id: classroomId2,
        role: 'student',
        joined_at: '2024-08-25T10:00:00.000Z',
        position: 3,
      },
    ]);
    console.log('Classroomusers seeded\n');

    // === 14. Classroomsets ===
    console.log('Seeding classroomsets...');
    await db.insert(schema.classroomsets).values([
      {
        set_id: studySetId1,
        set_type: 'studyset',
        classroom_id: classroomId1,
        added_by: userId2,
      },
      {
        set_id: visualSetId1,
        set_type: 'visualset',
        classroom_id: classroomId1,
        added_by: userId1,
      },
    ]);
    console.log('Classroomsets seeded\n');

    // === 15. Classroomactivities ===
    console.log('Seeding classroomactivities...');
    await db.insert(schema.classroomactivities).values([
      {
        id: classAct1,
        classroom_id: classroomId1,
        user_id: userId1,
        displayName: 'Studo Admin',
        img_url: 'https://i.pravatar.cc/150?img=1',
        set_id: studySetId1,
        set_type: 'studyset',
        title: 'Cell Biology Basics',
        last_seen: '2024-10-29T14:30:00.000Z',
      },
    ]);
    console.log('Classroomactivities seeded\n');

    console.log('All data seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

async function main() {
  console.log('🌱 Starting database seeding...\n');

  await resetDatabase();
  await seedStudo();

  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await connection.end();
  })
  .catch(async (e) => {
    console.error(e);
    await connection.end();
    process.exit(1);
  });
